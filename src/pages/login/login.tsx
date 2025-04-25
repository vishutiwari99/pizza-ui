import {
  Button,
  Checkbox,
  Form,
  Space,
  Input,
  FormProps,
  Flex,
  Alert,
} from "antd";
import Card from "antd/es/card/Card";
import Layout, { Content } from "antd/es/layout/layout";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/Logo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Credentials } from "../../types";
import { login, self, logout } from "../../http/api";
import { useAuthStore } from "../../store";
import { usePermission } from "../../hooks/usePermission";
type FieldType = {
  username: string;
  password: string;
  remember: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const loginUser = async (credentials: Credentials) => {
  const { data } = await login(credentials);
  return data;
};

const getSelf = async () => {
  const { data } = await self();
  return data;
};

const logOut = async () => {
  return await logout();
};
const Login = () => {
  const { isAllowed } = usePermission();
  const { setUser, logout: logoutFromStore } = useAuthStore();
  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false,
  });

  const {
    mutate: logoutMutate,
    isPending: logoutIsPending,
    error: logoutError,
  } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logOut,
    onSuccess: () => {
      logoutFromStore();
    },
  });
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const { data } = await refetch();
      console.log("isAllowed(data?.role)", isAllowed(data?.role));
      if (!isAllowed(data)) {
        logoutMutate();
        return;
      }

      setUser(data);
    },
  });

  return (
    <Layout style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <Space direction="vertical" align="center" size={"large"}>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Logo />
        </Content>
        <Card
          variant="borderless"
          style={{ width: "300px" }}
          title={
            <Space
              style={{ width: "100%", fontSize: 16, justifyContent: "center" }}
            >
              <LockFilled />
              Sign In
            </Space>
          }
        >
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={(values) => {
              mutate({ email: values.username, password: values.password });
            }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {isError && (
              <Alert
                style={{ marginBottom: 24 }}
                message={error.message || logoutError?.message}
                type="error"
              />
            )}
            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Flex justify="space-between">
              <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                label={null}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="" id="login-form-forgot-password">
                Forgot Password
              </a>
            </Flex>

            <Form.Item label={null}>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                loading={isPending || logoutIsPending}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Layout>
  );
};

export default Login;
