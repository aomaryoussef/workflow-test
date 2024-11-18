import { CardProps, FormProps, LayoutProps } from "antd";
import Image from "next/image";
import React from "react";

import { useDirection } from "@/app/common/hooks/useDirection";
import { AuthPageProps } from "@refinedev/core";

import { LoginPage } from "./components";

export type AuthProps = AuthPageProps<LayoutProps, CardProps, FormProps> & {
  renderContent?: (content: React.ReactNode, title: React.ReactNode) => React.ReactNode;
  title?: React.ReactNode;
};

/**
 * **refine** has a default auth page form served on the `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/antd-auth-page/} for more details.
 */
export const AuthPage: React.FC<AuthProps> = (props) => <LoginPage {...props} title={<Title />} />;

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
    </div>
  );
};
