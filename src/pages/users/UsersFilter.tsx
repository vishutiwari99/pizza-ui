import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Select } from "antd";

const UsersFilter = () => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Input.Search placeholder="Search Users" />
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                allowClear={true}
                placeholder="Select Role"
              >
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
                <Select.Option value="customer">Customer</Select.Option>
              </Select>
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                allowClear={true}
                placeholder="Status"
              >
                <Select.Option value="ban">Ban</Select.Option>
                <Select.Option value="active">Active</Select.Option>
              </Select>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" icon={<PlusOutlined />}>
            Add User
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default UsersFilter;
