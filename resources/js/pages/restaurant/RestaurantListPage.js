import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../components/Root';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { createRestaurantDetailRoute } from './RestaurantDetail';
import { RESTAURANT_ADD_ROUTE } from './AddRestaurantPage';
import { createRestaurantEditRoute } from './EditRestaurantPage';
import MainService from '../../services/MainService';
import history from '../../config/history';
import { USER_ROLES } from '../../components/ProtectedRoute';
import RatingFilter from '../../components/RatingFilter';

export const RESTAURANT_LIST_ROUTE = '/restaurants';

export default function RestaurantListPage() {

    const { user, setUser } = useContext(UserContext);

    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadRestaurants = (min_rating = 0) => {
        MainService.getRestaurants(min_rating, user)
            .then(response => {
                let { message, restaurants } = response;
                restaurants = restaurants.map(restaurant => {
                    restaurant.created_at = moment(restaurant.created_at).format('D MMM Y');
                    return restaurant;
                })
                setRestaurants(restaurants);
                setIsLoading(false);
            })
    }

    useEffect(() => {
        loadRestaurants();
    }, []);

    // create columns
    const columns = [
        { name: 'Id', selector: 'id', sortable: true },
        { name: 'Name', selector: 'name', sortable: true },
        // { name: 'Image', selector: 'image', sortable: true },
        // { name: 'Address', selector: 'address', sortable: true },
        // { name: 'Updated At', selector: 'updated_at', sortable: true },
        // { name: 'Max Rating', selector: 'max_rating', sortable: true },
        // { name: 'Min Rating', selector: 'min_rating', sortable: true },
        { name: 'Average Rating', selector: 'average_rating', sortable: true },
        { name: 'Pending Reviews', selector: 'pending_reviews', sortable: true },
        { name: 'Created At', selector: 'created_at', sortable: true },
    ];

    if (user.role === USER_ROLES.ADMIN) {
        columns.push({ name: 'Created By', selector: 'owner', sortable: true })
    }

    return (
        <div className="Dashboard">
            <div style={{
                paddingLeft: "16px"
            }}>
                {
                    user.role === USER_ROLES.OWNER && <Link
                        to={RESTAURANT_ADD_ROUTE}
                        className="rounded bg-orange-500 text-white px-2 py-1 inline-block">Add New Restaurant</Link>
                }
            </div>
            <RatingFilter style={{
                paddingLeft: "16px"
            }} className="pt-4" onChange={event => {
                loadRestaurants(event.target.value);
            }} />
            <DataTable
                pointerOnHover
                onRowClicked={v => { history.push(createRestaurantDetailRoute(v.id)) }}
                title="Restaurant List"
                columns={[
                    ...columns,
                    {
                        cell: v => (
                            <div>
                                <span
                                    className="text-xs inline-block px-2 py-1 rounded bg-red-500 text-white m-1 cursor-pointer"
                                    onClick={() => {
                                        if (confirm("You sure about deleting?")) {
                                            MainService.deleteRestaurant(v.id, user)
                                                .then(response => {
                                                    const r = [...restaurants];
                                                    r.splice(r.findIndex(r => r.id === v.id), 1);
                                                    setRestaurants(r);
                                                    alert(response.message);
                                                })
                                        }
                                    }}>Delete</span>
                            </div>
                        ),
                        ignoreRowClick: true,
                        allowOverflow: true,
                        button: true,
                    }
                ]}
                data={restaurants}
                progressPending={isLoading}
            />
        </div>
    )
}
