import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/auth'
import { setToken } from '../../utils/auth'
import "../../index.css";

function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      const res = await login(values)
      const token = res.data.data.token

      setToken(token)

      message.success('登录成功')
      navigate('/dashboard')
    } catch (error) {
      console.error('登录失败:', error)
      message.error('登录失败')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* 头像：修改为目标样式 */}
        <div className="avatar">
          <UserOutlined />
        </div>

        {/* 标题 */}
        <h2 className="title">在线学习管理平台</h2>

        <Form onFinish={handleLogin}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined className="user-icon" />} 
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="lock-icon" />} 
              placeholder="请输入密码"
              size="large"
              visibilityToggle={{ visible: false }} 
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="login-btn"
          >
            登录
          </Button>
        </Form>

        <div className="test-account">
          测试账号：admin / admin123
        </div>
      </div>
    </div>
  )
}

export default LoginPage