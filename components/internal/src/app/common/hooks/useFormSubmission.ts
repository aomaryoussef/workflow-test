import { FormInstance } from "antd";
import { useCallback, useState } from "react";

import { useNotificationHandler } from "@common/hooks/useNotificationHandler";

import { useTypedTranslation } from "./useTypedTranslation";

/**
 * Custom hook for handling form submission
 * @template T The type of the form input data (request input)
 * @template R The type of the response data
 * @param form The Ant Design form instance
 * @param submitAction The function to submit the form data
 * @returns An object containing the handleSubmit function and isSubmitting state
 */
export const useFormSubmission = <T, R>(
  form: FormInstance<T>,
  submitAction: (formValues: T) => Promise<{ data?: R; error?: string | null; code?: null | any; message?: null | any }>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openNotification, notificationContextHolder } = useNotificationHandler();
  const t = useTypedTranslation("common");
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await form.validateFields();
    } catch (err) {
      openNotification("topRight", t("fillRequiredFields"), "error");
      setIsSubmitting(false);
      return;
    }

    const formValues = form.getFieldsValue();
    try {
      const { data, error, message } = await submitAction(formValues);
      if (error !== null) {
        console.error(error);
        openNotification("topRight", t("error"), "error");
        setIsSubmitting(false);
        return;
      }

      if (data) {
        if (message) {
          openNotification("topRight", message, "error");
          setIsSubmitting(false);
          return;
        }

        openNotification("topRight", t("success"), "success");
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
      openNotification("topRight", t("operationFailed"), "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isSubmitting, openNotification, submitAction, t]);

  return { handleSubmit, isSubmitting, notificationContextHolder };
};
