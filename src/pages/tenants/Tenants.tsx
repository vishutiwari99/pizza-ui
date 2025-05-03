import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Drawer, Space, Table, TableProps } from "antd";
import { Link } from "react-router-dom";
import { Tenant } from "../../types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import TenantsFilter from "./TenantsFilter";

const columns: TableProps<Tenant>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text: string) => <span>{text}</span>,
  },

  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (text: string) => <span>{text}</span>,
  },
];
const Tenants = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: tenants,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((response) => response.data);
    },
  });

  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <Breadcrumb
        separator={<RightOutlined />}
        items={[
          { title: <Link to="/dashboard">Dashboard</Link> },
          { title: "Resturants" },
        ]}
      />
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error.message}</div>}
      <TenantsFilter
        onFilterChange={(filterName: string, filterValue: string) => {
          console.log(filterName, filterValue);
        }}
      >
        <Button
          onClick={() => setDrawerOpen(true)}
          type="primary"
          icon={<PlusOutlined />}
        >
          Add Restaurant
        </Button>
      </TenantsFilter>
      <Table<Tenant> columns={columns} dataSource={tenants} />
      <Drawer
        title="Create Resturant"
        placement="right"
        width={720}
        destroyOnClose={true}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        extra={
          <Space>
            <Button>Cancel</Button>
            <Button type="primary">Submit</Button>
          </Space>
        }
      >
        <p>Some contetnt</p>
      </Drawer>
    </Space>
  );
};

export default Tenants;
