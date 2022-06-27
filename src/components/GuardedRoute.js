import { Navigate, Outlet } from 'react-router-dom'
import React from 'react'

export default function GuardedRoute({ autenticacion, defaultRedirect='/login' }) {
    if (autenticacion.currentUser !== null) {
        return <Outlet/>
    } else {
        return <Navigate to={defaultRedirect} />
    }
}