import React, { useState, useContext } from 'react'
import { HOMEPAGE_ROUTE } from '../pages/HomePage'
import { Link } from 'react-router-dom'
import history from '../config/history';
import { LOGIN_ROUTE } from '../pages/LoginPage';
import { UserContext } from './Root';
import { USER_ROLES } from './ProtectedRoute';

export default function Navbar() {

    const { user, setUser } = useContext(UserContext);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    return (
        <div className="px-2 py-2 bg-orange-500 text-white flex justify-between Navbar">
            <div className="flex">
                <Link to={HOMEPAGE_ROUTE} className="mx-2">Review Restaurants</Link>
            </div>
            {
                user
                    ? (
                        <div>
                            <span className="mx-1 cursor-pointer" onClick={() => { setIsDropdownVisible(!isDropdownVisible); }}>{user && user.name}</span>
                            {
                                isDropdownVisible &&
                                <div style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "45px",
                                    width: "200px",
                                }} className="shadow rounded bg-white text-orange-500">
                                    <span className="text-gray-600 px-4 pt-4 pb-2 uppercase block">{user.role}</span>
                                    <span className="text-gray-600 text-xxxs px-4 py-1 uppercase block">{user.email}</span>
                                    <span onClick={() => {
                                        localStorage.removeItem('user');
                                        setIsDropdownVisible(false);
                                        setUser(null);
                                        history.push(LOGIN_ROUTE);
                                    }} className="rounded cursor-pointer hover:bg-orange-500 hover:text-white block mb-1 px-4 py-2">Logout</span>
                                </div>
                            }
                        </div>
                    ) : (
                        <Link to={LOGIN_ROUTE} className="mx-2">Login / Signup</Link>
                    )
            }
        </div>
    )
}
