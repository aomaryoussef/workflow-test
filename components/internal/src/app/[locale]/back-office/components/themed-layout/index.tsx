"use client";

import { Divider, Menu } from "antd";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { BackOfficeActions } from "@/app/[locale]/back-office/common/enums/backoffice.enums";
import { Header } from "@/app/[locale]/back-office/components/header";
import { useDirection } from "@common/hooks/useDirection";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation";
import { ThemedLayoutV2, ThemedSiderV2 } from "@refinedev/antd";
import { useLogout } from "@refinedev/core";

export const ThemedLayout = ({ children, actions }: { children: React.ReactNode; actions: Set<BackOfficeActions> }) => {
  return (
    <ThemedLayoutV2 Sider={() => <Sider actions={actions} />} Header={() => <Header sticky />}>
      {children}
    </ThemedLayoutV2>
  );
};

const Sider = ({ actions }: { actions?: Set<BackOfficeActions> }) => {
  const lang = useLocale();
  const t = useTypedTranslation();
  const { mutate: logoutAction } = useLogout();

  const [loading, setLoading] = useState(false);

  return (
    <ThemedSiderV2
      Title={Title}
      render={() => (
        <>
          {/* Partner */}

          {actions?.has(BackOfficeActions.CREATE_PARTNER) && (
            <>
              <Menu.Item key="create-partner">
                <Link href={`/${lang}/back-office/private/partners/create`}>{t("partner.create")}</Link>
              </Menu.Item>
              <Menu.Item key="create-partner-store">
                <Link href={`/${lang}/back-office/private/partners/stores/create`}>
                  {t("partner.createPartnerStore")}
                </Link>
              </Menu.Item>
            </>
          )}
          {/* Consumer */}
          {actions?.has(BackOfficeActions.ACTIVATE_CONSUMER) && (
            <Menu.Item key="create-consumer">
              <Link href={`/${lang}/back-office/private/consumers/activate`}>{t("consumer.sidebar.activate")}</Link>
            </Menu.Item>
          )}

          <Menu.Item key="divider" className="pointer-events-none">
            <Divider />
          </Menu.Item>

          <Menu.Item
            key="logout"
            onClick={() => {
              setLoading(true);
              logoutAction();
              setLoading(false);
            }}
          >
            <button disabled={loading}>{t("login.logout")}</button>
          </Menu.Item>
        </>
      )}
    />
  );
};

const Title = () => {
  const direction = useDirection();
  return (
    <div className="pl-3 pt-6">
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
        src={direction === "rtl" ? "/back-office/images/mylo-logo-ar.svg" : "/back-office/images/mylo-logo.svg"}
        alt="Mylo Logo"
        width={80}
        height={20}
        priority
      />
      <p className="font-bold flex">{direction === "ltr" ? "back office" : ""}</p>
    </div>
  );
};
