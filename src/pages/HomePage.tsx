import { Typography } from "antd";
import { useAuthStore } from "../store";
import { getGreeting } from "../utils";
const { Title } = Typography;
function HomePage() {
  const { user } = useAuthStore();
  return (
    <div>
      <Title level={5}>
        {getGreeting()}, {user?.firstName} 😄
      </Title>
    </div>
  );
}

export default HomePage;
