import { Layout, Menu,Dropdown, message } from 'antd'
import {
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
  MenuOutlined,
  UserOutlined,
  DownOutlined, LogoutOutlined
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout

function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const handleLogout = () => {
    // 1️⃣ 清除登录信息
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  
    message.success('已退出登录')
  
    // 2️⃣ 跳转登录页
    navigate('/login')
  }

  const userMenuItems = [
    // {
    //   key: 'profile',
    //   label: '个人信息',
    // },
    {
      type: 'divider' as const, // ⭐ 关键点
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ]

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout()
    }
  }
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined style={{ color: '#1890ff' }} />, // 蓝色
      label: '工作台',
    },
    {
      key: '/courses',
      icon: <BookOutlined style={{ color: '#553c9a' }} />, // 紫色
      label: '课程管理',
    },
    {
      key: '/students',
      icon: <TeamOutlined style={{ color: '#00b96b' }} />, // 绿色
      label: '学生管理',
    },
    {
      key: '/summary',
      icon: <FileTextOutlined style={{ color: '#fa8c16' }} />, // 橙色
      label: '学习总结',
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#f3f3f3' }}>
      <Sider
        theme="light"
        width={260}
        style={{
          background: '#fff',
          borderRight: '3px solid #222',
        }}
      >
        <div
          style={{
            height: 88,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 24,
            fontWeight: 800,
            borderBottom: '4px solid #222',
          }}
        >
          <span style={{ fontSize: 28 }}>🎓</span>
          <span>学习管理平台</span>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            borderRight: 0,
            padding: '20px 10px',
            fontSize: 18,
            background: '#fff',
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            height: 76,
            padding: '0 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px dashed #cfd4dc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <MenuOutlined style={{ fontSize: 28, color: '#222' }} />
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              在线学习管理平台
            </div>
          </div>

          <Dropdown
  menu={{
    items: userMenuItems,
    onClick: handleUserMenuClick,
  }}
  placement="bottomRight"
>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 18,
      fontWeight: 600,
      cursor: 'pointer',
    }}
  >
    <UserOutlined style={{ fontSize: 22, color: '#6b46c1' }} />
    <span>管理员</span>
    <DownOutlined style={{ fontSize: 12 }} />
  </div>
</Dropdown>
        </Header>

        <Content
          style={{
            padding: '20px 30px 24px 30px',
            background: '#f3f3f3',
          }}
        >
          <div
            style={{
              width:'100%',
              maxWidth: 1320,
              margin: '0 auto',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout