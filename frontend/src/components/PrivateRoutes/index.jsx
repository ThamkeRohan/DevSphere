import React from 'react'
import {useAuth} from "../../contexts/AuthContext"
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoutes() {
    const loggedInUser = useAuth()

    if(loggedInUser == null) {
        return <Navigate to="/login"/>
    }
    if(!loggedInUser.areTagsFollowed) {
        return <Navigate to="/followTags"/>
    }
  return <Outlet/>
}
