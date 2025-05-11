import { Card, Col, Form, Input, Row } from "antd";

type TenantsFilterProps = {
  children: React.ReactNode;
};
const TenantsFilter = ({ children }: TenantsFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item name={"q"}>
                <Input.Search
                  allowClear
                  placeholder="Search Resturants"
                  onChange={(e) => {
                    console.log(e.target.value);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "flex-end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default TenantsFilter;
