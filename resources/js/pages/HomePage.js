import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { LOGIN_ROUTE } from './LoginPage';
import { REGISTER_ROUTE } from './RegisterPage';
import { UserContext } from '../components/Root';
import MainService from '../services/MainService';
import Rating from '../components/Rating';
import { createRestaurantDetailRoute } from './restaurant/RestaurantDetail';
import Loader from '../components/Loader';
import RatingFilter from '../components/RatingFilter';

export const HOMEPAGE_ROUTE = '/';

export default function HomePage() {

    const { user } = useContext(UserContext);

    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [minRating, setMinRating] = useState(0);

    const loadRestaurants = (min_rating = 0) => {
        setIsLoading(true);
        MainService.getAllRestaurants(min_rating)
            .then(response => {
                let { restaurants } = response;
                setRestaurants(restaurants);
                setIsLoading(false);
            })
    }

    useEffect(() => {
        loadRestaurants();
    }, []);

    return (
        <div className="HomePage">
            <div style={{
                background: "url(\"https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=80\")",
                height: "200px",
                backgroundSize: "cover",
                backgroundPosition: "center center",
            }}></div>
            <div className="uppercase text-orange-500 text-center text-2xl py-5 font-bold">
                Review restaurants
            </div>
            <RatingFilter value={minRating} style={{
                paddingLeft: "16px"
            }} className="pt-4" onChange={event => {
                setMinRating(event.target.value);
                loadRestaurants(event.target.value);
            }} />
            {
                isLoading
                    ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader />
                        </div>
                    )
                    : restaurants.length > 0
                        ? restaurants.map(restaurant => (
                            <Link
                                to={createRestaurantDetailRoute(restaurant.id)}
                                key={restaurant.id}
                                className="rounded bg-white shadow my-5 block hover:shadow-md">
                                <div className="flex md:items-start items-center justify-center md:justify-start flex-col md:flex-row">
                                    <div
                                        className="rounded md:w-64 w-full"
                                        style={{
                                            height: "150px",
                                            background: 'url("' + restaurant.image + '") center center',
                                        }}>
                                    </div>
                                    <div className="px-3 py-1 md:w-auto w-full">
                                        <div className="flex items-center">
                                            <div className="font-bold pt-1">{restaurant.name}</div>
                                        </div>
                                        <Rating rating={restaurant.average_rating} size={18} className="px-2" />
                                        <div className="text-gray-600 font-bold text-sm">
                                            {(restaurant.address ?? "").split("\n").map((line, i) => <p key={i}>{line}</p>)}
                                        </div>
                                    </div>
                                </div>

                            </Link>
                        ))
                        : (
                            <div className="my-5 py-5 text-center">
                                No Restaurants Available!
                            </div>
                        )
            }
        </div>
    )
}
