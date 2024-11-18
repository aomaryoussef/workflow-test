"use client";

import "./styles.css";

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDirection } from "@common/hooks/useDirection";
import { useNotificationHandler } from "@common/hooks/useNotificationHandler";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation";
import { Create, RefreshButton, SaveButton } from "@refinedev/antd";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Divider, Form, Row } from "antd";
import { useLocale } from "next-intl";
import { KeyboardEvent, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { IConsumerDto } from "@/app/[locale]/back-office/private/consumers/activate/dto/consumer.dto";

import { BranchSection } from "./_components/BranchSection";
import CreditLimitSection from "./_components/CreditLimitSection";
import { InfoSection } from "./_components/InfoSection";
import { SearchSection } from "./_components/SearchSection";
import { activateConsumer, consumerSearch, generatePdf } from "./actions";
import { ConsumerStatus } from "./enums";
import { IConsumerForm } from "./types";

const ActivateConsumerPage = () => {
  const [form] = Form.useForm<IConsumerForm>();
  const t = useTypedTranslation("consumer");
  const locale = useLocale();
  const dir = useDirection();
  const { openNotification, notificationContextHolder } = useNotificationHandler();

  const notificationPlacement = useMemo(() => (locale === "en" ? "topRight" : "topLeft"), [locale]);

  const creditLimitSectionRef = useRef<HTMLDivElement>(null);

  /**
   * Steps
   * 1. Search Consumer
   * 2. Print PDF and Activate
   */
  const [step, setStep] = useState<1 | 2>(1);
  // We need to save the consumer data for when we send the request to activate them.
  // The form doesn't contain all the data we need to send to the server, and the server requires the full consumer object.
  const [consumerData, setConsumerData] = useState<IConsumerDto | null>(null);
  const [consumerCreditLimit, setConsumerCreditLimit] = useState<number | null>(null);
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const deferredIsFormValid = useDeferredValue(isFormValid);
  const [shouldDisableForm, setShouldDisableForm] = useState(false);
  const [canDownloadPdf, setCanDownloadPdf] = useState(false);
  const [canShowCreditLimit, setCanShowCreditLimit] = useState(false);
  const [isConsumerActivated, setIsConsumerActivated] = useState(false);

  //#region Search Consumer
  const _search = useCallback(async () => {
    let values: IConsumerForm;
    try {
      values = await form.validateFields();
    } catch {
      return openNotification(notificationPlacement, t("notifications.checkRequiredFieldsValid"), "error");
    }

    try {
      const { consumer, creditLimit, formFields, shouldDisableForm, canDownload, info, error } = await consumerSearch(
        values.nationalId,
        values.phoneNumber
      );

      if (error) openNotification(notificationPlacement, error, "error");
      if (info) openNotification(notificationPlacement, info, "info");
      if (consumer) setConsumerData(consumer);
      if (creditLimit) {
        setConsumerCreditLimit(creditLimit.value);
        setCanShowCreditLimit(creditLimit.canShow);
      }
      if (formFields) {
        form.setFieldsValue(formFields);
        // Move to step 2, to show consumer data in the form
        setStep(2);
      }
      if (shouldDisableForm !== undefined) setShouldDisableForm(shouldDisableForm);
      if (canDownload !== undefined) setCanDownloadPdf(canDownload);

      // Return true, indicating we successfully retrieved the consumer data.
      // For useQuery status to be `success`. If no return is provided, the status will be `error`
      if (formFields) return true;
    } catch (error) {
      console.error("Error:", error);
      openNotification(notificationPlacement, t("errors.search.unknownErrorWhileSearchingForConsumer"), "error");
    }
  }, [form, notificationPlacement, openNotification, t]);

  const { isFetching: isSearchFetching, refetch: search } = useQuery({
    queryKey: ["search"],
    queryFn: _search,
    enabled: false,
  });
  //#endregion

  //#region Print PDF
  const _print = useCallback(async () => {
    let values: IConsumerForm;
    try {
      values = await form.validateFields();
    } catch {
      return openNotification(notificationPlacement, t("notifications.checkRequiredFieldsValid"), "error");
    }

    let pdfBuffer: Buffer;
    try {
      const pdfBytes = await generatePdf({
        formValues: values,
        consumerData: consumerData!,
        creditLimit: consumerCreditLimit!,
      });
      if ("error" in pdfBytes) return openNotification(notificationPlacement, pdfBytes.error, "error");
      pdfBuffer = Buffer.from(pdfBytes);
    } catch (error) {
      console.error("Error:", error);
      return openNotification(
        notificationPlacement,
        t("errors.prefilledContract.unknownErrorWhileGeneratingPrefilledContract"),
        "error"
      );
    }

    try {
      // Create a link element and simulate a click to download the file
      const url = window.URL.createObjectURL(new Blob([pdfBuffer], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${values.fullName}.pdf`); // Specify the file name and extension
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      // Update state
      setCanShowCreditLimit(true);
      setIsPrintClicked(true);

      // Scroll to the credit limit section
      // Set an interval that runs every 100 milliseconds to check if the `creditLimitSectionRef` is available,
      // once it is available scroll to it. The interval will run for a maximum of 10 seconds
      let counter = 0;
      const interval = setInterval(() => {
        if (creditLimitSectionRef.current) {
          creditLimitSectionRef.current.scrollIntoView({ behavior: "smooth" });
          clearInterval(interval);
        }
        if (counter >= 10_000) clearInterval(interval);
        counter += 100;
      }, 100);

      return true; // For useQuery status to be `success`. If no return is provided, the status will be `error`
    } catch (error) {
      console.error("Error:", error);
      openNotification(
        notificationPlacement,
        t("errors.prefilledContract.errorGeneratingPrefilledContractDownloadLink"),
        "error"
      );
    }
  }, [consumerCreditLimit, consumerData, form, notificationPlacement, openNotification, t]);

  const { isFetching: isPrintFetching, refetch: print } = useQuery({
    queryKey: ["print"],
    queryFn: _print,
    enabled: false,
  });
  //#endregion

  //#region Activate Consumer
  const _activate = useCallback(async () => {
    // Get the form values
    let values: IConsumerForm;
    try {
      values = await form.validateFields();
    } catch {
      return openNotification(notificationPlacement, t("notifications.checkRequiredFieldsValid"), "error");
    }

    // Convert salary and additional salary to numbers
    values.salary = +values.salary;
    values.additionalSalary = +values.additionalSalary;

    try {
      const { updatedConsumer, updatedFormFields, error } = await activateConsumer({
        consumerData: consumerData!,
        formFields: values,
        creditLimit: consumerCreditLimit!,
      });

      if (error) openNotification(notificationPlacement, error, "error");
      if (updatedConsumer) setConsumerData(updatedConsumer);
      if (updatedFormFields) form.setFieldsValue(updatedFormFields);

      if (updatedConsumer && updatedFormFields && updatedConsumer.status === ConsumerStatus.ACTIVE) {
        setIsConsumerActivated(true);
        openNotification(notificationPlacement, t("notifications.consumerActivated"), "success");
        // Scroll to the credit limit section
        // For some reason, we need to add a timeout for the scrolling animation to work
        setTimeout(() => creditLimitSectionRef.current?.scrollIntoView({ behavior: "smooth" }), 10);
        return true; // For useQuery status to be `success`. If no return is provided, the status will be `error`
      }
    } catch (error) {
      console.error("Error:", error);
      openNotification(notificationPlacement, t("errors.activate.unknownErrorWhileActivatingConsumer"), "error");
    }
  }, [consumerCreditLimit, consumerData, form, notificationPlacement, openNotification, t]);

  const { isFetching: isActivateFetching, refetch: activate } = useQuery({
    queryKey: ["activate"],
    queryFn: _activate,
    enabled: false,
  });
  //#endregion

  const isLoading = useMemo(
    () => isSearchFetching || isPrintFetching || isActivateFetching,
    [isSearchFetching, isPrintFetching, isActivateFetching]
  );

  /** Show the branch selection if the consumer status is awaiting activation, or we successfully activated them.
   * We show it after activating the consumer in disabled mode, for the user to know which value they selected. */
  const canShowBranchSection = useMemo(
    () => consumerData?.status === ConsumerStatus.AWAITING_ACTIVATION || isConsumerActivated,
    [consumerData?.status, isConsumerActivated]
  );

  const onFormValuesChange = useCallback(async () => {
    setIsPrintClicked(false);

    const isFormValid = await form
      .validateFields({ validateOnly: true })
      .then(() => true)
      .catch(() => false);
    setIsFormValid(isFormValid);
  }, [form]);

  // Trigger form validation on step change, to enable/disable the save button
  useEffect(() => {
    onFormValuesChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const onSaveClick = useCallback(() => {
    switch (step) {
      case 1:
        search();
        break;

      case 2:
        activate();
        break;
    }
  }, [step, search, activate]);

  const onFormKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      // Allow submitting with enter for search only for ease of use, but prevent it in the other steps,
      // to prevent accidental submissions.
      if (e.key === "Enter" && step === 1) {
        const isFormValid = await form
          .validateFields({ validateOnly: true })
          .then(() => true)
          .catch(() => false);
        if (isFormValid) search();
      }
    },
    [step, form, search]
  );

  /**  Cleanup function */
  const cleanup = useCallback(
    (shouldResetForm: boolean) => {
      if (shouldResetForm) form.resetFields();

      setStep(1);
      setConsumerData(null);
      setConsumerCreditLimit(null);
      setIsPrintClicked(false);
      setCanDownloadPdf(false);
      setShouldDisableForm(false);
      setIsFormValid(false);
      setIsConsumerActivated(false);
      setCanShowCreditLimit(false);
    },
    [form]
  );

  const footerButtons = useMemo(() => {
    let text: string, icon: React.ReactNode;

    switch (step) {
      case 1:
        text = t("buttons.search");
        icon = <SearchOutlined />;
        break;

      case 2:
        text = t("buttons.activate");
        icon = <CheckCircleOutlined />;
        break;
    }

    return (
      <>
        {step > 1 && (
          <Button
            type="default"
            icon={dir === "ltr" ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
            onClick={cleanup.bind(null, false)}
            disabled={isConsumerActivated}
          >
            {t("buttons.back")}
          </Button>
        )}
        <SaveButton
          icon={icon}
          onClick={onSaveClick}
          disabled={
            // Disable button if:
            // 1. Form is disabled
            shouldDisableForm ||
            // 1. Form not valid but we passed the search step
            (!deferredIsFormValid && step > 1) ||
            // 2. We passed the searching step but we can't download pre-filled contract (pdf)
            (step > 1 && !canDownloadPdf) ||
            // 3. We passed the searching step but the consumer is already activated before
            (step > 1 && consumerData?.status === ConsumerStatus.ACTIVE) ||
            // 4. We passed the searching step, but the print button wasn't clicked yet.
            (step > 1 && !isPrintClicked) ||
            // 5. We successfully activated the consumer
            isConsumerActivated
          }
        >
          {text}
        </SaveButton>
        {isConsumerActivated && (
          <RefreshButton type="primary" ghost onClick={cleanup.bind(null, true)}>
            {t("buttons.resetForm")}
          </RefreshButton>
        )}
      </>
    );
  }, [
    step,
    dir,
    isConsumerActivated,
    t,
    onSaveClick,
    shouldDisableForm,
    deferredIsFormValid,
    canDownloadPdf,
    isPrintClicked,
    consumerData?.status,
    cleanup,
  ]);

  return (
    <>
      {notificationContextHolder}

      <Create
        title={t("title")}
        headerProps={{ subTitle: <span className="whitespace-normal">{t("subTitle")}</span> }}
        footerButtons={footerButtons}
        // Override default footer styles, which was float: right; margin-right: 24px;
        footerButtonProps={{ style: { float: "inline-start", marginRight: "unset", marginInlineStart: "24px" } }}
        goBack={null}
        isLoading={isLoading}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={shouldDisableForm || (step === 2 && consumerData?.status === ConsumerStatus.ACTIVE)}
          clearOnDestroy
          validateMessages={{
            required: t("errors.form.required", { label: "${label}" }),
            string: {
              len: t("errors.form.length", { label: "${label}", length: "${len}" }),
              max: t("errors.form.maxLength", { label: "${label}", max: "${max}" }),
            },
          }}
          onChange={onFormValuesChange}
          // Use keydown event handler instead of form submission because somehow the form submission always continues
          // regardless of preventing default
          onKeyDown={onFormKeyDown}
        >
          <SearchSection disabled={step > 1} canShowStatus={!!consumerData} />

          {step > 1 && (
            <>
              <InfoSection />

              {(canShowBranchSection || canShowCreditLimit) && (
                <Divider>{canShowBranchSection && t("labels.contract")}</Divider>
              )}

              <Row gutter={32} align="middle" wrap={false}>
                {/* Show the branch selection if the consumer status is awaiting activation,
            or we successfully activated them. We show it after activating the consumer in disabled mode,
            for the user to know which value they selected. */}
                {canShowBranchSection && (
                  <Col>
                    <Row gutter={16} align="bottom" wrap={false}>
                      <Col>
                        <BranchSection onSelectChange={onFormValuesChange} openNotification={openNotification} />
                      </Col>
                      <Col>
                        {canDownloadPdf && (
                          // We wrap the button in a Form.Item to align it with the other form items,
                          // in this case the branch selection.
                          <Form.Item>
                            <Button
                              type="primary"
                              ghost
                              icon={<PrinterOutlined />}
                              onClick={() => print()}
                              disabled={
                                // Disable button if:
                                // 1. The print button is already clicked, to prevent multiple clicks. The value is set again to false when the form changes
                                isPrintClicked ||
                                // 2. We successfully activated the consumer
                                isConsumerActivated
                              }
                            >
                              {t("buttons.print")}
                            </Button>
                          </Form.Item>
                        )}
                      </Col>
                    </Row>
                  </Col>
                )}

                {canShowCreditLimit && (
                  <Col
                    span={canShowBranchSection ? undefined : 24}
                    className="grow"
                    style={{ borderInlineStart: canShowBranchSection ? "1px solid rgba(5, 5, 5, 0.06)" : "" }}
                  >
                    <CreditLimitSection
                      ref={creditLimitSectionRef}
                      creditLimit={consumerCreditLimit!}
                      type={consumerData?.status === ConsumerStatus.ACTIVE ? "success" : "info"}
                    />
                  </Col>
                )}
              </Row>
            </>
          )}
        </Form>
      </Create>
    </>
  );
};

export default ActivateConsumerPage;
