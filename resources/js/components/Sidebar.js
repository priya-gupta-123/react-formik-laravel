import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { RESTAURANT_LIST_ROUTE } from '../pages/restaurant/RestaurantListPage'
import { HOMEPAGE_ROUTE } from '../pages/HomePage'
import { USER_LIST_REGULAR_ROUTE } from '../pages/user/RegularUserListPage'
import { USER_LIST_OWNER_ROUTE } from '../pages/user/OwnerUserListPage'
import { USER_ROLES } from './ProtectedRoute'

export default function Sidebar({ user }) {
    if (user.role === USER_ROLES.REGULAR) {
        return <div></div>;
    }

    return (
        <div className="Sidebar bg-gray-800 py-12 px-2">
            {/* Admin Routes */}
            {
                user.role === 'admin' && (
                    <div>
                        <SidebarLink to={USER_LIST_REGULAR_ROUTE}>Regular Users</SidebarLink>
                        <SidebarLink to={USER_LIST_OWNER_ROUTE}>Owner Users</SidebarLink>
                    </div>
                )
            }
            {/* Owner Name */}
            {
                user.role === 'owner' && (
                    <div>
                    </div>
                )
            }
            <SidebarLink to={RESTAURANT_LIST_ROUTE}>Restaurants</SidebarLink>
        </div>
    )
}

function SidebarLink({ children, to = "" }) {
    return (
        <NavLink
            activeClassName="bg-gray-300 hover:bg-gray-100 hover:text-gray-800 text-gray-800"
            to={to}
            className="rounded cursor-pointer hover:bg-gray-100 text-white hover:text-gray-800 block mb-1 px-4 py-2">
            {children}
        </NavLink>
    )
}
