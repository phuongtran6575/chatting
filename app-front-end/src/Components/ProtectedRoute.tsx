import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuthStore } from "../core/Stores/authStore";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = useAuthStore((state) => state.token);

    if (!token) {
        // nếu không có token → quay về login
        return <Navigate to="/login" replace />;
    }

    // có token → cho vào trang mong muốn
    return children;
};

export default ProtectedRoute;