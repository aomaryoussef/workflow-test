"use client";

import { Form } from "antd";
import axios from "axios";
import { useMemo } from "react";

import { CustomSelect } from "@/app/[locale]/back-office/components/common/CustomSelect";
import { IBranch } from "@/app/[locale]/back-office/graphql/types";
import { createPartnerBranch } from "@/app/[locale]/back-office/private/partners/stores/create/action";
import { useFormSubmission } from "@common/hooks/useFormSubmission";
import { useNotificationHandler } from "@common/hooks/useNotificationHandler";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation";
import { Create } from "@refinedev/antd";
import { useQuery } from "@tanstack/react-query";

import { StoreCard } from "./lists/StoresList/StoreCard";

export default function PartnerStoreForm({ governorates }: Readonly<{ governorates: { id: string; name: string }[] }>) {
  const [form] = Form.useForm<{ partnerId: string; branch: IBranch }>();
  const t = useTypedTranslation("partner");
  const { openNotification, notificationContextHolder } = useNotificationHandler();
  const {
    handleSubmit,
    isSubmitting,
    notificationContextHolder: formSubmissionNotificationContext,
  } = useFormSubmission(form, async (formValues) => {
    const { partnerId, branch } = formValues;
    return await createPartnerBranch(partnerId, { ...branch });
  });
  const {
    data: partnersResponse,
    isLoading: isLoadingPartners,
    isError: isErrorPartners,
  } = useQuery<{ data: { data: { data: { partner: { id: string; name: string }[] } } } }>({
    queryKey: ["fetchPartners"],
    queryFn: () => axios.get("../api"),
  });

  const partnersOptions = useMemo(
    () =>
      partnersResponse?.data?.data?.data?.partner?.map((partner: { id: string; name: string }) => ({
        label: partner.name,
        value: partner.id,
      })),
    [partnersResponse]
  );

  if (!isLoadingPartners) {
    if (isErrorPartners) openNotification("topRight", t("errors.failedtogetdata"), "error");
    else if (partnersOptions?.length === 0) openNotification("topRight", t("errors.noPartnersFound"), "error");
  }

  return (
    <>
      {notificationContextHolder}
      {formSubmissionNotificationContext}

      <Form form={form} layout="vertical" onFinish={handleSubmit} validateMessages={{ required: t("required") }}>
        <Create
          isLoading={isSubmitting}
          saveButtonProps={{ children: t("saveBranch") }}
          title={t("createPartnerStore")}
        >
          <Form.Item name="partnerId" rules={[{ required: true }]}>
            <CustomSelect
              options={partnersOptions}
              placeholder={t("selectPartner")}
              showSearch
              loading={isLoadingPartners}
              disabled={isLoadingPartners}
              data-testid="partner-select"
              optionFilterProp="label"
            />
          </Form.Item>
          <StoreCard form={form} parentField={{ name: "branch" }} governorates={governorates} />
        </Create>
      </Form>
    </>
  );
}
