import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = () => {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((response) => response.data);
    },
  });
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size={"large"}>
          <Card title="Basic information">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="First name" name="firstName">
                  <Input size={"large"} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last name" name="lastName">
                  <Input size={"large"} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input size={"large"} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Security information">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Password" name="password">
                  <Input size={"large"} type="password" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Auth Info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Role" name="role">
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    onChange={(selectedItem) =>
                      console.log("selected item", selectedItem)
                    }
                    placeholder="Select role"
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Restaurants" name="tenantId">
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    onChange={(selectedItem) =>
                      console.log("selected item", selectedItem)
                    }
                    placeholder="Select restaurant"
                  >
                    {tenants?.map((tenant: Tenant) => (
                      <Select.Option value={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
