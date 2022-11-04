import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";


export default function ProtectedRoute({children}) {
    const { user } = useContext(AuthContext)
    const storageUser = AuthService.getCurrentUser()
    console.log("Protected route. Context user: ", user, "Storage user: ", storageUser)
    if (!user) {
        console.log("Protected route: navigating to login (no user)")
        return <Navigate to='/login' replace/>
    }
    console.log("User granted access to protected route")
    return children
}