import os
import time
from pathlib import Path
import yaml
from util import logger
from util import ask_user
import requests
from config import config
import json

legacy_financial_products_location = os.path.join(
    Path(__file__).parent.parent.parent.parent.parent.parent,
    "legacy/lms/assets/financial_products",
)

def __rate_to_basis_points(rate) -> int:
    if rate["type"] == "FORMULA":
        return int(float(rate["value"].split("+")[0].replace("%", "")) * 100)
    elif rate["type"] == "PERCENT":
        return int(float(rate["value"]) * 100)
    else:
        if int(float(rate["value"])) == 0:
            return 0
        else:
            raise NotImplementedError("Convert monetary value to basis points is not implemented ")

def __sort_financial_products(financial_products: []) -> []:
    sorted_by_key_version = sorted(financial_products, key=lambda fp: (fp["key"], fp["version"]))
    return sorted_by_key_version

def __load_financial_products() -> []:
    logger.info(f"loading financial products from location: {legacy_financial_products_location}")

    fin_products = []
    for f in os.listdir(legacy_financial_products_location):
        if "test" not in f and not f.startswith("202"):
            fin_products.append(f"{legacy_financial_products_location}/{f}")

    financial_products = []
    for fp_file in fin_products:
        with open(fp_file, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)

            # Global Admin Fee
            admin_fee_bp = __rate_to_basis_points(data["global_attributes"]["admin_fee"])

            # Down Payment, will be extracted from tenors list (all existing tenors have the same downpayment)
            min_dp = data["tenor_variants"][0]["minimum_downpayment"]
            max_dp = data["tenor_variants"][0]["maximum_downpayment"]
            minimum_downpayment_in_bp = __rate_to_basis_points(min_dp)
            maximum_downpayment_in_bp = __rate_to_basis_points(max_dp)

            key = data["key"] + "-" + data["version"]

            financial_product = {
                "key": key,
                "name": data["name"],
                "version": data["version"],
                "description": data["description"],
                "active_since_utc": data["active_since"],
                "active_until_utc": data["active_until"],
                "grace_period_days": data["global_attributes"]["grace_period"][
                    "in_days"
                ],
                "min_principal": {
                    "currency": "EGP",
                    "amount": int(
                        float(
                            data["global_attributes"]["allowed_principal_range"]["min"]
                        )
                    ) * 100,
                },
                "max_principal": {
                    "currency": "EGP",
                    "amount": int(
                        float(
                            data["global_attributes"]["allowed_principal_range"]["max"]
                        )
                    ) * 100,
                },
                "min_down_payment_basis_points": minimum_downpayment_in_bp,
                "max_down_payment_basis_points": maximum_downpayment_in_bp,
                "admin_fee_basis_points": admin_fee_bp,
                "early_settlement_fee_basis_points": 0,
                "bad_debt_allowance_basis_points": __rate_to_basis_points(
                    ##data["global_attributes"]["bad_debt"]
                    { 'type': 'PERCENT', 'value': 1 }
                ),
                "tenors": [],
            }

            for tenor in data["tenor_variants"]:
                t = {
                    "key": tenor["key"],
                    "duration_in_days": tenor["duration_in_days"],
                    "interest_rate_basis_points": __rate_to_basis_points(
                        tenor["phases"][0]["interest"]
                    ),
                    "admin_fee_basis_points": admin_fee_bp if "admin_fee" not in tenor else __rate_to_basis_points(tenor["admin_fee"]),
                }
                financial_product["tenors"].append(t)

            financial_products.append(financial_product)

    # Sort the financial products by key and version


    logger.info(f"loaded {len(financial_products)} financial products")
    return financial_products

def __pretty_print_financial_products(financial_products):
    print("{:<48} {:<48} {:<10} {:<10}".format('Key', 'Name', 'Version', 'Total Tenors'))
    for fp in financial_products:
        key = fp["key"]
        name = fp["name"]
        version = fp["version"]
        tenors = len(fp["tenors"])

        print("{:<48} {:<48} {:<10} {:<10}".format(key, name, version, tenors))

def __create_financial_product(financial_product: any) -> dict:
    key = financial_product["key"]
    res = requests.request(
        method="POST",
        url=f"{config.LMS2_BASE_URL}/financial-products",
        headers={
            "X-User-Id": config.MIGRATION_SCRIPT,
        },
        data=json.dumps(financial_product),
    )
    if res.status_code != 202:
        error_response = res.json()
        logger.error(f"could not create financial product with id: {key}")
        logger.error(f"{error_response}")
        raise BaseException("could not create financial product")

    return {
        "id": key,
        "etag": res.headers["ETag"],
    }

def __approve_financial_product(financial_product_id: str, etag: str) -> dict:
    res = requests.request(
        method="PUT",
        url=f"{config.LMS2_BASE_URL}/financial-products/{financial_product_id}/approve",
        headers={
            "X-User-Id": config.MIGRATION_SCRIPT,
            "If-Match": etag,
        },
    )
    if res.status_code != 202:
        error_response = res.json()
        logger.error(f"could not approve financial product with id: {financial_product_id}")
        logger.error(f"{error_response}")
        raise BaseException("could not approve financial product")
    return {
        "id": financial_product_id,
        "etag": res.headers["ETag"],
    }

def __publish_financial_product(financial_product_id: str, etag: str) -> dict:
    res = requests.request(
        method="PUT",
        url=f"{config.LMS2_BASE_URL}/financial-products/{financial_product_id}/publish",
        headers={
            "X-User-Id": config.MIGRATION_SCRIPT,
            "If-Match": etag,
        },
    )
    if res.status_code != 202:
        error_response = res.json()
        logger.error(f"could not publish financial product with id: {financial_product_id}")
        logger.error(f"{error_response}")
        raise BaseException("could not publish financial product")
    return {
        "id": financial_product_id,
        "etag": res.headers["ETag"],
    }

def run():
    financial_products = __load_financial_products()
    financial_products = __sort_financial_products(financial_products)
    #__pretty_print_financial_products(financial_products)
    ask_user.continue_yes_no("Do You Want To Continue and have you reviewed the financial products ")
    for fp in financial_products:
        response = __create_financial_product(fp)
        time.sleep(1)
        response = __approve_financial_product(response["id"], response["etag"])
        time.sleep(1)
        __publish_financial_product(response["id"], response["etag"])
