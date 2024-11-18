from typing import Optional, Dict
from uuid import UUID
import time
import requests
from config.settings import settings
from src.domain.partner.models.partner import Partner
from src.domain.partner.models.branch import Branch
from src.domain.partner.models.bank_account import BankAccount
from src.domain.checkout.models.checkout_basket import CheckoutBasket
from src.domain.registry.models.payment import Payment
from src.domain.lookups.models.governorate import Governorate
from src.services.logging import logger

workflow_url = settings.get("workflow", default={}).get("base_url", default="")
content_type = "application/json"
not_found_exception = Exception("Task is not found")
base_workflow_url = workflow_url + "/api/workflow"
base_task_url = workflow_url + "/api/tasks"

logger = logger.bind(service="workflow", context="setup", action="setup")
WORKFLOW_FAILURE_MESSAGE = "Failed to start workflow"


class Workflow:
    @staticmethod
    def start_checkout(checkout_basket: CheckoutBasket, partner: Partner, branch: Branch, governorate: Governorate, single_payment_day: int) -> Optional[str]:
        logger.debug("start checkout")
        workflow_name = settings.get("workflow", default={}).get("checkout_process", default="checkout_process")
        request_body = {
            "name": workflow_name,
            "input": {
                "checkout_basket": checkout_basket.to_dict(),
                "partner": {"name": partner.name},
                "governorate": {"name_en":governorate.name_en} if governorate is not None else {"name_en":""},
                "branch": branch.name if branch is not None else "",
                "booking_time": checkout_basket.get_booking_time_utc(),
                "consumer_single_payment_day": single_payment_day,
            },
        }
        response = requests.post(
            url=base_workflow_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error(f"{WORKFLOW_FAILURE_MESSAGE} {response.text}")
            return None

    @staticmethod
    def start_disbursement(incoming_request_body: dict) -> Optional[str]:
        logger.debug("start disbursement")
        workflow_name = settings.get("workflow", default={}).get(
            "disbursement", default="disbursement_notification_process"
        )
        request_body = {
            "name": workflow_name,
            "input": incoming_request_body["input"],
        }
        response = requests.post(
            url=base_workflow_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error(f"{WORKFLOW_FAILURE_MESSAGE} {response.text}")
            return None

    @staticmethod
    def __get_task_id(workflow_id: UUID, task_reference_name: str) -> Optional[str]:
        logger.debug("get task id")
        response = requests.get(
            url=base_workflow_url + "/" + workflow_id,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow = response.json()
            tasks = workflow["tasks"]
            for task in tasks:
                if task["status"] != "COMPLETED" and (
                    task_reference_name == "" or task["referenceTaskName"] == task_reference_name
                ):
                    return task["taskId"]
        return None

    @staticmethod
    def __sub_workflow_id(workflow_id: UUID, sub_workflow_name: str) -> Optional[str]:
        logger.debug("get sub workflow id")
        response = requests.get(
            url=base_workflow_url + "/" + workflow_id,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow = response.json()
            tasks = workflow["tasks"]
            for task in tasks:
                if task["taskDefName"] == sub_workflow_name and task["status"] == "IN_PROGRESS":
                    return task["subWorkflowId"]
        return None

    @staticmethod
    def is_workflow_running(workflow_id: UUID) -> bool:
        logger.debug("is workflow running")
        response = requests.get(
            url=base_workflow_url + "/" + str(workflow_id),
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow = response.json()
            if workflow["status"] == "RUNNING":
                return True
            else:
                return False
        return False

    @staticmethod
    def get_workflow_status(workflow_id: UUID) -> str:
        logger.debug("get workflow status")
        response = requests.get(
            url=base_workflow_url + "/" + str(workflow_id),
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow = response.json()
            return workflow["status"]
        else:
            return ""

    @staticmethod
    def trigger_commercial_offer_selection(offer: Dict[str, any], workflow_id: UUID) -> Optional[str]:
        logger.debug("start trigger commercial offer selection")
        task_id = Workflow.__get_task_id(str(workflow_id), task_reference_name="commercial_offer_selection")
        if task_id is None:
            logger.error("Failed to get task id")
            raise not_found_exception
        request_body = {
            "outputData": {
                "selected_offer_id": offer["id"],
                "admin_fee": offer["admin_fee"],
                "annual_interest_percentage": offer["annual_interest_percentage"],
                "down_payment": offer["down_payment"],
                "financed_amount": offer["financed_amount"],
                "interest_rate_per_tenure": offer["interest_rate_per_tenure"],
                "monthly_instalment": offer["monthly_instalment"],
                "tenure": offer["tenure"],
                "total_amount": offer["total_amount"],
            },
            "status": "COMPLETED",
            "workflowInstanceId": str(workflow_id),
            "taskId": task_id,
        }
        response = requests.post(
            url=base_task_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error("Failed to trigger commercial offer selection %s" % str(response))
            return None

    @staticmethod
    def trigger_pos_clearance(workflow_id: UUID) -> Optional[str]:
        logger.debug("start trigger pos clearance")
        task_id = Workflow.__get_task_id(str(workflow_id), task_reference_name="pos_clearence")
        if task_id is None:
            raise not_found_exception
        request_body = {
            "status": "COMPLETED",
            "workflowInstanceId": str(workflow_id),
            "taskId": task_id,
        }
        response = requests.post(
            url=base_task_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error("Failed to trigger pos clearance %s" % str(response))
            return None

    @staticmethod
    def reject_commercial_offer(workflow_id: UUID) -> Optional[str]:
        logger.debug("start reject commercial offer")
        task_id = Workflow.__get_task_id(str(workflow_id), task_reference_name="commercial_offer_selection")
        if task_id is None:
            raise not_found_exception
        request_body = {
            "status": "FAILED",
            "workflowInstanceId": str(workflow_id),
            "taskId": task_id,
        }
        response = requests.post(
            url=base_task_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error("Failed to reject commercial offer %s" % str(response))
            return None

    @staticmethod
    def reject_pos_clearance(workflow_id: UUID) -> Optional[str]:
        logger.debug("start reject pos clearance")
        task_id = Workflow.__get_task_id(str(workflow_id), task_reference_name="pos_clearence")
        if task_id is None:
            raise not_found_exception
        request_body = {
            "status": "FAILED",
            "workflowInstanceId": str(workflow_id),
            "taskId": task_id,
        }
        response = requests.post(
            url=base_task_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error("Failed to reject pos clearance %s" % str(response))
            return None

    @staticmethod
    def start_partner_onboarding(partner: Partner) -> Optional[str]:
        logger.debug(f"start partner onboarding for partner {partner.id}")
        workflow_name = settings.get("workflow", default={}).get("partner_onboarding", default="merchant_onboarding")
        request_body = {
            "name": workflow_name,
            "correlationId": str(partner.id),
            "input": {
                "partner": partner.to_dict(),
            },
        }
        response = requests.post(
            url=base_workflow_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            logger.debug(f"partner onboarding workflow started with id {workflow_id}")
            return workflow_id
        else:
            logger.error(f"{WORKFLOW_FAILURE_MESSAGE} {response.text}")
            return None

    @staticmethod
    def create_partner_general_accounting(partner: Partner, branch: Branch, bank_account: BankAccount) -> Optional[str]:
        logger.debug("start create partner general accounting")
        workflow_name = settings.get("workflow", default={}).get("partner_onboarding", default="merchant_onboarding")
        request_body = {
            "name": workflow_name,
            "input": {
                "merchant_id": str(partner.id),
                "merchant_name": partner.name,
                "merchant_group": "MISC",
                "currency_code": "EGP",
                "search_name": partner.name,
                "sales_tax_group": "None",
                "withholding_tax_group_code": "0%",
                "location": "Egypt",
                "street_number": branch.street,
                "street": branch.area,
                "zip_code": "11009",
                "state": branch.governorate,
                "city": branch.city,
                "merchant_bank_name": bank_account.bank_name,
                "merchant_bank_address": bank_account.branch_name,
                "merchant_bank_branch_name": bank_account.branch_name,
                "merchant_bank_swift_code": bank_account.swift_code,
                "merchant_bank_iban": bank_account.iban,
                "merchant_bank_account_number": bank_account.account_number,
                "tax_registration_number": partner.tax_registration_number,
                "beneficiary_bank_name": bank_account.beneficiary_name,
                "beneficiary_bank_address": bank_account.branch_name,
            },
        }
        response = requests.post(
            url=base_workflow_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error("Failed to start create partner account workflow %s" % str(response))
            return None

    @staticmethod
    def activate_consumer(consumer_id: str) -> Optional[str]:
        logger.debug("start create consumer lms account")
        workflow_name = settings.get("workflow", default={}).get("consumer_onboarding", default="consumer_onboarding")
        request_body = {
            "name": workflow_name,
            "input": {
                "consumer_id": consumer_id,
            },
        }
        response = requests.post(
            url=base_workflow_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error("Failed to start create consumer lms workflow", response)
            return None

    @staticmethod
    def trigger_verify_otp(workflow_id: UUID, status: str) -> Optional[str]:
        logger.debug("start trigger verify otp")
        sub_workflow_id = Workflow.__sub_workflow_id(str(workflow_id), sub_workflow_name="otp_workflow")
        task_id = Workflow.__get_task_id(str(sub_workflow_id), task_reference_name="verify_otp")
        if task_id is None:
            raise not_found_exception
        request_body = {
            "outputData": {"result": str(status)},
            "status": "COMPLETED",
            "workflowInstanceId": str(sub_workflow_id),
            "taskId": task_id,
        }
        response = requests.post(
            url=base_task_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error("Failed to start verify otp workflow %s" % str(response))
            return None

    @staticmethod
    def __sub_workflow_id_with_retries(workflow_id: UUID, sub_workflow_name, retries):
        logger.debug("start __sub_workflow_id_with_retries")
        attempts = 0
        while attempts < retries:
            try:
                sub_workflow_id = Workflow.__sub_workflow_id(str(workflow_id), sub_workflow_name)
                time.sleep(1)
                if sub_workflow_id is not None:
                    return sub_workflow_id
                attempts += 1
            except Exception:
                attempts += 1

    @staticmethod
    def trigger_human_send_otp(workflow_id: UUID, consumer_id: UUID) -> Optional[str]:
        logger.debug("start trigger human send otp")
        sub_workflow_id = Workflow.__sub_workflow_id_with_retries(workflow_id, "otp_workflow", 20)
        if sub_workflow_id is None:
            logger.error("OTP sub workflow not found")
            raise Exception("OTP sub workflow not found")
        task_id = Workflow.__get_task_id(str(sub_workflow_id), task_reference_name="human_send_otp")
        if task_id is None:
            logger.error("OTP task not found")
            raise not_found_exception
        request_body = {
            "outputData": {"consumer_id": str(consumer_id)},
            "status": "COMPLETED",
            "workflowInstanceId": sub_workflow_id,
            "taskId": task_id,
        }
        try:
            response = requests.post(
                url=base_task_url,
                json=request_body,
                verify=True,
                headers={"Content-Type": content_type},
            )
            if response.status_code == 200:
                workflow_id = response.text
                return workflow_id
            else:
                logger.error(f"{WORKFLOW_FAILURE_MESSAGE} {response.text}")
                return None
        except Exception as exception:
            logger.error("Failed to trigger human send otp %s" % str(exception))
            raise exception

    @staticmethod
    def reject_otp_workflow(workflow_id: UUID) -> Optional[str]:
        logger.debug("start reject otp workflow")
        task_id = Workflow.__get_task_id(str(workflow_id), task_reference_name="")
        if task_id is None:
            raise not_found_exception
        request_body = {
            "status": "FAILED",
            "workflowInstanceId": str(workflow_id),
            "taskId": task_id,
        }
        response = requests.post(
            url=base_task_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            return workflow_id
        else:
            logger.error("Failed to reject otp workflow", response)
            return None

    @staticmethod
    def start_consumer_collection(payment: Payment) -> Optional[str]:
        logger.debug(f"start consumer collection for payment {payment.id}")
        workflow_name = settings.get("workflow", default={}).get(
            "consumer_collection", default="consumer_collection_process"
        )
        payment_details = payment.to_dict()
        request_body = {
            "name": workflow_name,
            "correlationId": str(payment.id),
            "input": {
                "consumer_id": payment.payee_id,
                "booking_time": payment.booking_time.isoformat("T") + "Z",
                "payment_channel": "BTECH_STORE_CASH",
                "payment_registry": "MYLO",
                "payment_details": payment_details,
                "mylo_repayments": [
                    {
                        "loan_id": payment.billing_account,
                        "loan_schedule_id": payment.billing_account_schedule_id,
                        "amount": payment.amount_units,
                        "collected_as_early_settlement": payment.collected_as_early_settlement,
                    }
                ],
            },
        }
        response = requests.post(
            url=base_workflow_url,
            json=request_body,
            verify=True,
            headers={"Content-Type": content_type},
        )
        if response.status_code == 200:
            workflow_id = response.text
            logger.debug(f"consumer collection workflow started with id {workflow_id}")
            return workflow_id
        else:
            logger.error(f"{WORKFLOW_FAILURE_MESSAGE} {response.text}")
            return None
