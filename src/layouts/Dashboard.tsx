import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Icon, {
  BellFilled,
  GiftOutlined,
  HomeFilled,
  ProductOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import Resturants from "../components/icons/Resturants";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <HomeFilled />,
      label: <NavLink to="/">Home</NavLink>,
    },

    {
      key: "/resturants",
      icon: <Icon component={Resturants} />,
      label: <NavLink to="/resturants">Resturants</NavLink>,
    },
    {
      key: "/products",
      icon: <ProductOutlined />,
      label: <NavLink to="/products">Products</NavLink>,
    },
    {
      key: "/promos",
      icon: <GiftOutlined />,
      label: <NavLink to="/promos">Promos</NavLink>,
    },
  ];

  if (role === "admin") {
    const menus = [...baseItems];
    menus?.splice(1, 0, {
      key: "/users",
      icon: <UserOutlined />,
      label: <NavLink to="/users">Users</NavLink>,
    });
    return menus;
  }
  return baseItems;
};

const logOut = async () => {
  return await logout();
};
const Dashboard = () => {
  const location = useLocation();
  const { logout: logoutFromStore, user } = useAuthStore();

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logOut,
    onSuccess: () => {
      logoutFromStore();
    },
  });
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items = getMenuItems(user?.role as string);
  if (user === null) {
    return (
      <Navigate
        to={`auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={["/"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: "0 16px", background: colorBgContainer }}>
            <Flex gap="middle" align="start" justify="space-between">
              <Badge
                text={
                  user.role === "admin"
                    ? "You are an admin"
                    : user?.tenant?.name
                }
                status="success"
              />
              <Space size={16}>
                <Badge dot>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutMutate(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                  arrow={{ pointAtCenter: true }}
                >
                  <Avatar>Vaibhav</Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "16px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>Pizza Shop @2025</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
