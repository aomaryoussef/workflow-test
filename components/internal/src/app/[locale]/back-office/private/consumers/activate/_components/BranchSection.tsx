import { useNotificationHandler } from "@common/hooks/useNotificationHandler";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation";
import { useQuery } from "@tanstack/react-query";
import { Form } from "antd";
import React from "react";

import { CustomSelect } from "@/app/[locale]/back-office/components/common/CustomSelect";

import { fetchBTechBranches } from "../actions";

export const BranchSection: React.FC<{
  onSelectChange: () => void;
  openNotification: ReturnType<typeof useNotificationHandler>["openNotification"];
}> = ({ onSelectChange, openNotification }) => {
  const t = useTypedTranslation("consumer");

  const { isFetching, data } = useQuery({
    queryKey: ["fetchBTechBranches"],
    queryFn: async () => {
      const branchesRes = await fetchBTechBranches();

      if ("error" in branchesRes) {
        openNotification("topRight", branchesRes.error, "error");
        throw new Error(branchesRes.error);
      }

      return branchesRes;
    },
  });

  return (
    <Form.Item name="branchName" label={t("labels.branchName")} rules={[{ required: true }]}>
      <CustomSelect options={data} loading={isFetching} onChange={onSelectChange} popupMatchSelectWidth={false} />
    </Form.Item>
  );
};
