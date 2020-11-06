import React, { useContext, useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom';
import Loader from '../../components/Loader';
import { USER_ROLES } from '../../components/ProtectedRoute';
import { UserContext } from '../../components/Root';
import MainService from '../../services/MainService';
import { createRestaurantDetailRoute } from '../restaurant/RestaurantDetail';
import { createUserEditRoute } from './UserEditPage';

export const USER_DETAIL_ROUTE = "/user/:id";

export const createUserDetailRoute = id => "/user/" + id;

function UserDetailPage({ match: { params: { id } } }) {

    const { user } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        MainService.getUserDetail(id, user)
            .then(response => {
                setSelectedUser(response.user);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="UserDetailPage">
            <div className="text-lg my-3 border-0 border-b pb-2">
                User Details
                 <Link to={createUserEditRoute(id)} className="text-blue-500 text-xs mx-2">edit</Link>
            </div>
            {
                isLoading
                    ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader />
                        </div>
                    )
                    : (
                        <div>
                            <p className="mb-3"><span className="text-gray-600">Name:</span> {selectedUser.name}</p>
                            <p className="mb-3"><span className="text-gray-600">Email:</span> {selectedUser.email}</p>
                            <p className="mb-3"><span className="text-gray-600">Type:</span> <span className="capitalize">{selectedUser.role}</span></p>
                            {
                                selectedUser.role === USER_ROLES.OWNER && (
                                    <div className="border-t mt-8 mb-3 py-3 border-b">
                                        <div className="font-bold uppercase">Restaurants Owned</div>
                                        {
                                            selectedUser.restaurants.map(restaurant => (
                                                <Link to={createRestaurantDetailRoute(restaurant.id)} key={restaurant.id} className="my-4 flex items-center text-blue-500">
                                                    {restaurant.name}
                                                    <span className="text-xxxs px-1 py-1 rounded-full font-bold bg-orange-500 text-white inline-block mx-2">
                                                        {restaurant.average_rating}
                                                    </span>
                                                </Link>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    )
            }
        </div>
    )
}

export default withRouter(UserDetailPage);
