import { Card, Col, Form, Input, Row } from "antd";
import React from "react";

const UserForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Card title="Basic information">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="First name" name="firstName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last name" name="lastName">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default UserForm;
