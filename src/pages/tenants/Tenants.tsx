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
import { FieldsData, Tenant } from "../../types";
import React, { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import TenantsFilter from "./TenantsFilter";
import TenantForm from "./forms/TenantForm";
import { debounce } from "lodash";
import { PER_PAGE } from "../../constant";

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
  const [filterForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });
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
      .map((field) => ({
        [field.name[0]]: field.value,
      }))
      .reduce((acc, cur) => ({ ...acc, ...cur }), {});

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
    data: tenants,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: () => {
      const filteredQueryParams = Object.entries(queryParams).filter(
        (item) => !!item[1]
      );
      const queryString = new URLSearchParams(
        filteredQueryParams as unknown as Record<string, string>
      ).toString();
      return getTenants(queryString).then((response) => response.data);
    },
    placeholderData: keepPreviousData,
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
      <Form form={filterForm} onFieldsChange={onFilterChange}>
        <TenantsFilter>
          <Button
            onClick={() => setDrawerOpen(true)}
            type="primary"
            icon={<PlusOutlined />}
          >
            Add Restaurant
          </Button>
        </TenantsFilter>
      </Form>
      <Table<Tenant>
        columns={columns}
        dataSource={tenants?.data}
        pagination={{
          total: tenants?.total,
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
        <Form layout="vertical" form={form} onFieldsChange={onFilterChange}>
          <TenantForm />
        </Form>
      </Drawer>
    </Space>
  );
};

export default Tenants;
