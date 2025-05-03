import { Card, Col, Input, Row } from "antd";

type TenantsFilterProps = {
  children: React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
};
const TenantsFilter = ({ onFilterChange, children }: TenantsFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Input.Search
                allowClear
                placeholder="Search Resturants"
                onChange={(e) =>
                  onFilterChange("TenantSearchQuery", e.target.value)
                }
              />
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
