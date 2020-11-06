import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { LOGIN_ROUTE } from '../pages/LoginPage'

export default function ProtectedRoute({
    component: Component,
    user = null,
    forRole = USER_ROLES.ALL,
    ...rest
}) {

    return (
        <Route {...rest}>
            {
                user && canAccess(forRole, user.role)
                    ? <Component />
                    : <Redirect to={LOGIN_ROUTE} />
            }
        </Route>
    )
}

function canAccess(forRole, userRole)
{
    if (Array.isArray(forRole)) {
        return forRole.includes(userRole);
    } else {
        return forRole === userRole || forRole === USER_ROLES.ALL;
    }
}

export const USER_ROLES = {
    REGULAR: "regular",
    ADMIN: "admin",
    OWNER: "owner",
    ALL: "all",
}
