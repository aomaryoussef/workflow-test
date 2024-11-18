import {ThemedLayout} from "@/app/[locale]/back-office/components/themed-layout";
import React from "react";
import {getLocale} from "next-intl/server";
import {authProviderServer} from "@/app/[locale]/back-office/providers/auth-provider";
import {BackOfficeActions} from "@/app/[locale]/back-office/common/enums/backoffice.enums.ts";
import {redirect} from "next/navigation";

export default async function Layout({children}: React.PropsWithChildren) {
    const {allowed, userActions} = await getData();
    const locale = await getLocale();
    if (!allowed) {
        return redirect(`/${locale}/back-office/public/login`);
    }
    return <ThemedLayout actions={userActions}>{children}</ThemedLayout>;
}

const getData = () => {
    return authProviderServer.canUserDo(BackOfficeActions.CREATE_PARTNER);
};