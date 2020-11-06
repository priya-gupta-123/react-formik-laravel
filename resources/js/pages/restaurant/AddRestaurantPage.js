import React, { useContext } from 'react'
import ExtendedForm, { setExtendedError } from '../../components/ExtendedForm';
import MainService from '../../services/MainService';
import { UserContext } from '../../components/Root';
import history from '../../config/history';
import { RESTAURANT_LIST_ROUTE } from './RestaurantListPage';
import { ToastContext, TOAST_TYPES } from '../../contexts/ToastContext';

export const RESTAURANT_ADD_ROUTE = '/restaurant/new';

export default function AddRestaurantPage() {

    const { user } = useContext(UserContext);
    const { setToast } = useContext(ToastContext);

    return (
        <div className="AddRestaurantPage">
            <div className="text-md font-bold mt-5 mb-2">ADD NEW RESTAURANT</div>
            <ExtendedForm
                elements={[
                    {
                        name: "name",
                        label: "Name",
                        placeholder: "Enter Name"
                    },
                    {
                        name: "image",
                        label: "Image",
                        placeholder: "URL For Display Image"
                    },
                    {
                        name: "address",
                        label: "Address",
                        type: "textarea",
                        value: "",
                        placeholder: "Restaurant Address"
                    },
                ]}
                onSubmit={async (values, { setErrors, setSubmitting }) => {
                    try {
                        const response = await MainService.createRestaurant(values, user);
                        setToast(response.message, TOAST_TYPES.SUCCESS);
                        history.push(RESTAURANT_LIST_ROUTE);
                    } catch (error) {
                        setExtendedError(error, setErrors);
                    }
                }}
                submitButtonLabel="Add Restaurant"
                formGroupClass="w-1/2" />
        </div>
    )
}
