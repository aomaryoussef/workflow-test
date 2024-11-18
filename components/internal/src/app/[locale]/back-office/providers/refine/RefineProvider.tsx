import { useLocale } from "next-intl";
import { cookies } from "next/headers";
import { Suspense } from "react";

import { ColorModeContextProvider } from "@/app/[locale]/back-office/contexts/color-mode";
import { authProvider } from "@/app/[locale]/back-office/providers/auth-provider";
import { dataProvider } from "@/app/[locale]/back-office/providers/data-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { useTypedTranslation } from "@common/hooks/useTypedTranslation";
import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";

export default function RefineProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const t = useTypedTranslation("web-internal");
  const locale = useLocale();
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <Suspense>
      <AntdRegistry>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <Refine
            routerProvider={routerProvider}
            dataProvider={{
              default: dataProvider,
              consumers: dataProvider,
            }}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              // {
              //   name: t("dashboard"),
              //   identifier: "dashboard",
              //   list: `/${locale}/dashboard`,
              // },
              // {
              //   name: t("identities"),
              //   identifier: "identities",
              //   list: `/${locale}/identities`,
              // },
              // {
              //   name: t("finances"),
              //   identifier: "finances",
              //   list: `/${locale}/finances`,
              //   create: `/${locale}/finances/create`,
              // },
              // {
              //   name: t("accounting"),
              //   identifier: "accounting",
              //   list: `/${locale}/accounting`,
              // },
              {
                name: t("partners"),
                identifier: "partners",
                // list: `/${locale}/partners`,
                create: `/${locale}/partners/create`,
              },
              {
                name: t("consumers"),
                identifier: "consumers",
                // list: `/${locale}/consumers`,
                // show: `/${locale}/consumers/show`,
                create: `/${locale}/consumers/activate`,
              },
            ]}
            options={{
              // syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
            }}
          >
            {children}
          </Refine>
        </ColorModeContextProvider>
      </AntdRegistry>
    </Suspense>
  );
}
