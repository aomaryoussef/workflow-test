"use client";
import {
  Button,
  Card,
  CardProps,
  Col,
  Form,
  FormProps,
  Input,
  Layout,
  LayoutProps,
  Row,
  theme,
  Typography,
} from "antd";
import axios from "axios";
import React from "react";

import { useTypedTranslation } from "@/app/common/hooks/useTypedTranslation";
import { ThemedTitleV2 } from "@refinedev/antd";
import {
  LoginFormTypes,
  LoginPageProps,
  useActiveAuthProvider,
  useLink,
  useLogin,
  useRouterContext,
  useRouterType,
} from "@refinedev/core";
import { useQuery } from "@tanstack/react-query";

import { bodyStyles, containerStyles, headStyles, layoutStyles, titleStyles } from "./styles";

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink = false,
  rememberMe = false,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const t = useTypedTranslation("login");
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const { data } = useQuery({
    queryKey: ["initLoginFlow"],
    queryFn: () => axios.get("/.ory/kratos/public/self-service/login/browser?refresh=true", { withCredentials: true }),
  });

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "20px",
        }}
      >
        {title ?? <ThemedTitleV2 collapsed={false} />}
      </div>
    );

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      {t("SignInToYourAccount")}
    </Typography.Title>
  );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <Button
                key={provider.name}
                type="default"
                block
                icon={provider.icon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "8px",
                }}
                onClick={() =>
                  login({
                    providerName: provider.name,
                  })
                }
              >
                {provider.label}
              </Button>
            );
          })}
        </>
      );
    }
    return null;
  };

  const CardContent = (
    <Card
      title={CardTitle}
      style={{ ...containerStyles, backgroundColor: token.colorBgElevated }}
      styles={{ header: headStyles, body: bodyStyles }}
      {...(contentProps ?? {})}
    >
      {renderProviders()}
      {!hideForm && (
        <Form<LoginFormTypes & { loginAction?: string; csrfToken?: string }>
          layout="vertical"
          form={form}
          onFinish={(values) => {
            values = {
              ...values,
              loginAction: data?.data.ui.action,
              csrfToken: data?.data.ui.nodes.find((item: any) => item.attributes.name === "csrf_token").attributes
                .value,
            };
            login(values);
          }}
          requiredMark={false}
          initialValues={{
            remember: false,
          }}
          {...formProps}
        >
          <Form.Item
            name="email"
            label={t("email")}
            rules={[
              {
                required: true,
                message: t("required", { label: t("email") }),
              },
              {
                type: "email",
                message: t("invalidEmail"),
              },
            ]}
          >
            <Input size="large" data-testid="email-input" placeholder={t("email")} />
          </Form.Item>
          <Form.Item
            name="password"
            label={t("password")}
            rules={[
              {
                required: true,
                message: t("required", { label: t("password") }),
              },
            ]}
          >
            <Input
              type="password"
              data-testid="password"
              autoComplete="current-password"
              placeholder="●●●●●●●●"
              size="large"
            />
          </Form.Item>
          {!hideForm && (
            <Form.Item>
              <Button type="primary" size="large" htmlType="submit" loading={isLoading} data-testid="submit-btn" block>
                {t("signIn")}
              </Button>
            </Form.Item>
          )}
        </Form>
      )}
    </Card>
  );

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align={hideForm ? "top" : "middle"}
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
          paddingTop: hideForm ? "15dvh" : "16px",
        }}
      >
        <Col xs={22}>
          {renderContent ? (
            renderContent(CardContent, PageTitle)
          ) : (
            <>
              {PageTitle}
              {CardContent}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};
