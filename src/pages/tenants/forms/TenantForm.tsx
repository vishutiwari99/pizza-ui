import { Col, Form, Input, Row } from "antd";

const TenantForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Form.Item
          label="Restaurant Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter your restaurant name",
            },
          ]}
        >
          <Input size={"large"} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Address line"
          name="address"
          rules={[
            {
              required: true,
              message: "Please enter your restaurant address",
            },
          ]}
        >
          <Input size={"large"} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default TenantForm;
