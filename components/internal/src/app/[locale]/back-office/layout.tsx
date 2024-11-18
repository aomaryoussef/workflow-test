import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import "../../../instrumentation.ts";
import RefineProvider from "@/app/[locale]/back-office/providers/refine/RefineProvider.tsx";
import QueryClientProviderWrapper from "@/app/[locale]/back-office/providers/tanstack/queryClientProvider.tsx";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import GlobalError from "./global-error";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "mylo backoffice",
    description: "back office portal for mylo operations",
};

export default async function RootLayout({
                                             children,
                                             params: {locale},
                                         }: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    const messages = await getMessages();
    const direction = locale === "ar" ? "rtl" : "ltr";

    return (
        <html dir={direction} lang={locale}>
        <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
            <QueryClientProviderWrapper>
                <ErrorBoundary errorComponent={GlobalError}>
                    <RefineProvider>{children}</RefineProvider>
                </ErrorBoundary>
            </QueryClientProviderWrapper>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}