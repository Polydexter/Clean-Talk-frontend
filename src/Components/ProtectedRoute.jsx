import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


export default function ProtectedRoute({children}) {
    const { user } = useContext(AuthContext)
    if (!user) {
        return <Navigate to='/login' replace/>
    }
    console.log("User granted access to protected route")
    return children
}