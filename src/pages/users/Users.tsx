import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Space,
  Table,
  TableProps,
  theme,
} from "antd";
import { Link, Navigate } from "react-router-dom";
import { createUser, getUsers } from "../../http/api";
import { CreateUserData, User } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./forms/UserForm";
const columns: TableProps<User>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => (
      <span>
        {record.firstName} {record.lastName}
      </span>
    ),
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text: string) => <span>{text}</span>,
  },
];
const Users = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  const { user } = useAuthStore();
  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: CreateUserData) =>
      createUser(data).then((response) => response.data),
    onSuccess: () => {
      return;
    },
  });

  const handleSubmit = async () => {
    await form.validateFields();
    console.log(form.getFieldsValue());
    await userMutate(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const {
    data: users,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((response) => response.data);
    },
  });
  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/dashboard">Dashboard</Link> },
            { title: "Users" },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}
        <UsersFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            onClick={() => setDrawerOpen(true)}
            type="primary"
            icon={<PlusOutlined />}
          >
            Add User
          </Button>
        </UsersFilter>
        <Table<User> columns={columns} dataSource={users} />
        <Drawer
          title="Create User"
          placement="right"
          styles={{ body: { background: colorBgLayout } }}
          width={720}
          destroyOnClose={true}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
