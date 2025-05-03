import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Space, Table, TableProps } from "antd";
import { Link } from "react-router-dom";
import { getUsers } from "../../http/api";
import { User } from "../../types";
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
        <Table<User> columns={columns} dataSource={users} />
      </Space>
    </>
  );
};

export default Users;
