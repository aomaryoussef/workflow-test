import { notification } from "antd";
import React, { useCallback, useRef } from "react";

import { useTypedTranslation } from "./useTypedTranslation";

import type { NotificationArgsProps } from "antd";
export type NotificationPlacement = NotificationArgsProps["placement"];

const getRandomKey = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const useNotificationHandler = () => {
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const t = useTypedTranslation("common");
  const notificationKey = useRef(getRandomKey());

  const openNotification = useCallback(
    (placement: NotificationPlacement, description?: string, type?: "error" | "success" | "info") => {
      if (type === "error") notificationApi.error({ message: t("error"), description, placement });
      else if (type === "success") notificationApi.success({ message: t("success"), description, placement });
      else notificationApi.info({ message: undefined, description, placement });
    },
    [notificationApi, t]
  );

  return {
    openNotification,
    notificationContextHolder: React.cloneElement(notificationContextHolder, { key: notificationKey.current }),
  };
};
