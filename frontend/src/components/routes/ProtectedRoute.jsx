import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ token }) => {
	if (!token) {
		return <Navigate to={'/auth/signin'} />
	}

	return <Outlet />
}

export default ProtectedRoute
