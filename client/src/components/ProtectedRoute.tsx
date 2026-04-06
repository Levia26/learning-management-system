import { Navigate } from 'react-router-dom'
import { getToken } from '../utils/auth'

//逻辑很简单：
// 有 token：放行
// 没 token：跳到 /login

type Props = {
  children: React.ReactNode
}

function ProtectedRoute({ children }: Props) {
  const token = getToken()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute