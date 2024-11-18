import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import React from "react";

import { BackOfficeActions } from "@/app/[locale]/back-office/common/enums/backoffice.enums.ts";
import { ThemedLayout } from "@/app/[locale]/back-office/components/themed-layout";
import { authProviderServer } from "@/app/[locale]/back-office/providers/auth-provider";

export default async function Layout({ children }: React.PropsWithChildren) {
  const { allowed, userActions } = await getData();
  const locale = await getLocale();
  if (!allowed) return redirect(`/${locale}/back-office/public/login`);
  return <ThemedLayout actions={userActions}>{children}</ThemedLayout>;
}

const getData = () => {
  return authProviderServer.canUserDo(BackOfficeActions.ACTIVATE_CONSUMER);
};
