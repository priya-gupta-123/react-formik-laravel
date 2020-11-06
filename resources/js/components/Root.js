import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import history from '../config/history';
import HomePage, { HOMEPAGE_ROUTE } from '../pages/HomePage';
import LoginPage, { LOGIN_ROUTE } from '../pages/LoginPage';
import FourOFourPage from '../pages/FourOFourPage';
import ProtectedRoute, { USER_ROLES } from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import RegisterPage, { REGISTER_ROUTE } from '../pages/RegisterPage';
import RestaurantListPage, { RESTAURANT_LIST_ROUTE } from '../pages/restaurant/RestaurantListPage';
import Sidebar from './Sidebar';
import Loader from './Loader';
import OwnerRestaurantDetail, { RESTAURANT_DETAIL_ROUTE } from '../pages/restaurant/RestaurantDetail';
import AddRestaurantPage, { RESTAURANT_ADD_ROUTE } from '../pages/restaurant/AddRestaurantPage';
import EditRestaurantPage, { RESTAURANT_EDIT_ROUTE } from '../pages/restaurant/EditRestaurantPage';
import RegularUserListPage, { USER_LIST_REGULAR_ROUTE } from '../pages/user/RegularUserListPage';
import UserDetailPage, { USER_DETAIL_ROUTE } from '../pages/user/UserDetailPage';
import UserEditPage, { USER_EDIT_ROUTE } from '../pages/user/UserEditPage';
import OwnerUserListPage, { USER_LIST_OWNER_ROUTE } from '../pages/user/OwnerUserListPage';
import ToastCard from './ToastCard';
import { createToast, ToastContext, TOAST_TYPES } from '../contexts/ToastContext';


export const UserContext = React.createContext({
    user: null,
    setUser: null
})

function Root() {

    const [user, setUser] = useState(null);
    const [toast, setToast] = useState({
        message: null,
        type: null,
        duration: 2500
    });
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            setUser(JSON.parse(localStorage.getItem('user')));
            setIsInitialized(true);
        } catch (error) { }
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <ToastContext.Provider value={{
                toast,
                setToast: createToast(setToast)
            }}>
                {
                    isInitialized
                        ? (
                            <Router history={history}>
                                <Navbar />
                                {user && <Sidebar user={user} />}
                                <div className={(user && user.role !== "regular") ? "DashboardContainer" : "UserContainer"}>
                                    <Switch>
                                        <Route path={HOMEPAGE_ROUTE} exact><HomePage /></Route>

                                        {/* Auth */}
                                        <GuestRoute path={LOGIN_ROUTE} component={LoginPage} user={user} />
                                        <GuestRoute path={REGISTER_ROUTE} component={RegisterPage} user={user} />

                                        {/* UserRoutes */}
                                        <ProtectedRoute path={USER_LIST_REGULAR_ROUTE} forRole={USER_ROLES.ADMIN} exact component={RegularUserListPage} user={user} />
                                        <ProtectedRoute path={USER_LIST_OWNER_ROUTE} forRole={USER_ROLES.ADMIN} exact component={OwnerUserListPage} user={user} />
                                        <ProtectedRoute path={USER_DETAIL_ROUTE} forRole={USER_ROLES.ADMIN} exact component={UserDetailPage} user={user} />
                                        <ProtectedRoute path={USER_EDIT_ROUTE} forRole={USER_ROLES.ADMIN} exact component={UserEditPage} user={user} />

                                        {/* Restaurant Routes */}
                                        <ProtectedRoute path={RESTAURANT_LIST_ROUTE} forRole={[USER_ROLES.OWNER, USER_ROLES.ADMIN]} exact component={RestaurantListPage} user={user} />
                                        <ProtectedRoute path={RESTAURANT_ADD_ROUTE} forRole={USER_ROLES.OWNER} exact component={AddRestaurantPage} user={user} />
                                        <Route path={RESTAURANT_DETAIL_ROUTE} exact component={OwnerRestaurantDetail} user={user} />
                                        <ProtectedRoute path={RESTAURANT_EDIT_ROUTE} forRole={[USER_ROLES.OWNER, USER_ROLES.ADMIN]} exact component={EditRestaurantPage} user={user} />


                                        {/* Miscelleneous routes */}
                                        <Route><FourOFourPage /></Route>
                                    </Switch>
                                </div>
                            </Router>
                        )
                        : (
                            <Loader isFixed />
                        )
                }
                {
                    toast && toast.message && <ToastCard toast={toast} setToast={setToast} />
                }
            </ToastContext.Provider>
        </UserContext.Provider>
    );
}

export default Root;

if (document.getElementById('root')) {
    ReactDOM.render(<Root />, document.getElementById('root'));
}
