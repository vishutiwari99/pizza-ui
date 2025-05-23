import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import { createUser, getUsers, updateUser } from "../../http/api";
import { CreateUserData, FieldsData, User } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import React, { useEffect, useState } from "react";
import UserForm from "./forms/UserForm";
import { PER_PAGE } from "../../constant";
import { debounce } from "lodash";
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
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: "Resturant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => <span>{record.tenant?.name}</span>,
  },
];
const Users = () => {
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const { user } = useAuthStore();
  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: CreateUserData) =>
      createUser(data).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const { mutate: updateUserMutate } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: CreateUserData) =>
      updateUser(data, currentEditingUser!.id).then(
        (response) => response.data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(
    null
  );
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  useEffect(() => {
    if (currentEditingUser) {
      setDrawerOpen(true);
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser.tenant?.id,
      });
    }
  }, [currentEditingUser, form]);

  const handleSubmit = async () => {
    const isEditMode = !!currentEditingUser;
    await form.validateFields();
    if (isEditMode) {
      await updateUserMutate(form.getFieldsValue());
    } else {
      await userMutate(form.getFieldsValue());
    }

    form.resetFields();
    setDrawerOpen(false);
    setCurrentEditingUser(null);
  };
  const debounceQueryUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({
        ...prev,
        q: value,
        currentPage: 1,
      }));
    }, 500);
  }, []);
  const onFilterChange = (changedFields: FieldsData[]) => {
    const changedFilterFields = changedFields
      .map((field) => {
        return {
          [field.name[0]]: field.value,
        };
      })
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    if ("q" in changedFilterFields) {
      debounceQueryUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const {
    data: users,
    error,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      const filteredQueryParams = Object.entries(queryParams).filter(
        (item) => !!item[1]
      );
      const queryString = new URLSearchParams(
        filteredQueryParams as unknown as Record<string, string>
      ).toString();
      return getUsers(queryString).then((response) => response.data);
    },
    placeholderData: keepPreviousData,
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

        {isError && <div>{error.message}</div>}
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UsersFilter>
            <Button
              onClick={() => setDrawerOpen(true)}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add User
            </Button>
          </UsersFilter>
        </Form>

        <Table<User>
          loading={isFetching}
          columns={[
            ...columns,

            {
              title: "Actions",
              // dataIndex: "tenant",
              // key: "tenant",
              render: (_text: string, record: User) => (
                console.log(_text),
                (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => setCurrentEditingUser(record)}
                    >
                      Edit
                    </Button>
                    <Button type="link">Delete</Button>
                  </Space>
                )
              ),
            },
          ]}
          dataSource={users?.data}
          pagination={{
            total: users?.total,
            current: queryParams.currentPage,
            pageSize: queryParams.perPage,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />
        <Drawer
          title={currentEditingUser ? `Edit User` : `Add User`}
          placement="right"
          styles={{ body: { background: colorBgLayout } }}
          width={720}
          destroyOnClose={true}
          onClose={() => {
            form.resetFields();
            setCurrentEditingUser(null);
            setDrawerOpen(false);
          }}
          open={drawerOpen}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                  setCurrentEditingUser(null);
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
            <UserForm isEditMode={!!currentEditingUser} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
