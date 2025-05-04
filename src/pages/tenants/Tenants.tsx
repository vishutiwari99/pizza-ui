import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Space,
  Table,
  TableProps,
} from "antd";
import { Link } from "react-router-dom";
import { Tenant } from "../../types";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import TenantsFilter from "./TenantsFilter";
import TenantForm from "./forms/TenantForm";

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
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenant"],
    mutationFn: async (data: Tenant) =>
      createTenant(data).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });
  const handleSubmit = async () => {
    await form.validateFields();
    await tenantMutate(form.getFieldsValue());
    setDrawerOpen(false);
    form.resetFields();
  };

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
            <Button
              onClick={() => {
                setDrawerOpen(false);
                form.resetFields();
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
          <TenantForm />
        </Form>
      </Drawer>
    </Space>
  );
};

export default Tenants;
