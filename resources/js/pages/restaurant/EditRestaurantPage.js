import React, { useContext, useState, useEffect } from 'react'
import ExtendedForm, { setExtendedError } from '../../components/ExtendedForm';
import MainService from '../../services/MainService';
import { UserContext } from '../../components/Root';
import history from '../../config/history';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import Endpoints from '../../config/endpoints';
import Loader from '../../components/Loader';
import moment from 'moment';
import { ToastContext, TOAST_TYPES } from '../../contexts/ToastContext';

export const RESTAURANT_EDIT_ROUTE = '/restaurant/edit/:id';

export const createRestaurantEditRoute = id => '/restaurant/edit/' + id;

function EditRestaurantPage({ match }) {

    const { user } = useContext(UserContext);
    const { setToast } = useContext(ToastContext);

    const { params: { id } } = match;

    const [restaurant, setRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        MainService.showRestaurants(id, user)
            .then(response => {
                let { message, restaurant } = response;
                restaurant.created_at = moment(restaurant.created_at).format('D MMM Y');
                setRestaurant(restaurant);
                setIsLoading(false);
            })
    }, []);

    return (
        <div className="EditRestaurantPage">
            <div className="text-md font-bold mt-5 mb-2">EDIT RESTAURANT</div>
            {
                isLoading
                    ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader />
                        </div>
                    )
                    : (
                        <ExtendedForm
                            elements={[
                                {
                                    name: "name",
                                    label: "Name",
                                    placeholder: "Enter Name",
                                    value: restaurant.name,
                                },
                                {
                                    name: "image",
                                    label: "Image",
                                    placeholder: "URL For Display Image",
                                    value: restaurant.image,
                                },
                                {
                                    name: "address",
                                    label: "Address",
                                    type: "textarea",
                                    value: restaurant.address,
                                    placeholder: "Restaurant Address"
                                },
                            ]}
                            onSubmit={async (values, { setErrors, setSubmitting }) => {
                                try {
                                    const response = await MainService.editRestaurant(restaurant.id, values, user);
                                    setToast(response.message, TOAST_TYPES.SUCCESS);
                                } catch (error) {
                                    setExtendedError(error, setErrors);
                                }
                            }}
                            submitButtonLabel="Save Restaurant"
                            formGroupClass="w-1/2" />
                    )
            }
        </div>
    )
}

export default withRouter(EditRestaurantPage);
