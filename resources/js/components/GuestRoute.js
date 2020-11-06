import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { LOGIN_ROUTE } from '../pages/LoginPage'
import { HOMEPAGE_ROUTE } from '../pages/HomePage'

export default function GuestRoute({
    component: Component,
    user = null,
    ...rest
}) {

    return (
        <Route {...rest}>
            {
                !user
                    ? <Component />
                    : <Redirect to={HOMEPAGE_ROUTE} />
            }
        </Route>
    )
}
