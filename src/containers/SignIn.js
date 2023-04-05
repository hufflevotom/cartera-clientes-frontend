import React from "react";
import { Button, Form, Input } from "antd";
import { useAuth } from "../authentication";
import AppNotificationContainer from "../components/AppNotificationContainer";

const SignIn = () => {
  const { isLoading, error, userLogin } = useAuth();

  const onFinishFailed = (errorInfo) => {};

  const onFinish = (values) => {
    userLogin(values);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#F8F9FA",
      }}
    >
      <div
        style={{
          width: "35%",
          padding: "15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="gx-app-login-main-content"
          style={{
            padding: "30px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <img
						alt="logo"
						// src="/assets/images/logo-white.png"
						style={{ width: "60%", paddingBottom: "50px", paddingTop: "20px" }}
					/> */}
          <span style={{ paddingBottom: "50px", paddingTop: "20px" }}>
            Ingreso al sistema
          </span>
          <Form
            initialValues={{ remember: true }}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="gx-signin-form gx-form-row0"
            style={{ width: "90%" }}
          >
            <Form.Item
              // initialValue="demo@example.com"
              rules={[
                { required: true, message: "The input is not valid E-mail!" },
              ]}
              name="email"
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              // initialValue="demo#123"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
              name="password"
            >
              <Input type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ width: "100%", marginTop: "20px" }}
                className="gx-mb-0"
                htmlType="submit"
                type="primary"
              >
                Ingresar
              </Button>
            </Form.Item>
          </Form>
          <AppNotificationContainer loading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
