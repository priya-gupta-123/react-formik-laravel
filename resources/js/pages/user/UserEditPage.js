import React, { useContext, useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom';
import ExtendedForm, { setExtendedError } from '../../components/ExtendedForm';
import Loader from '../../components/Loader';
import { UserContext } from '../../components/Root';
import MainService from '../../services/MainService';
import { createUserDetailRoute } from './UserDetailPage';

export const USER_EDIT_ROUTE = "/user/edit/:id";

export const createUserEditRoute = id => "/user/edit/" + id;

function UserEditPage({ match: { params: { id } } }) {

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
                 <Link to={createUserDetailRoute(id)} className="text-blue-500 text-xs mx-2">back to detail</Link>
            </div>
            {
                isLoading
                    ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader />
                        </div>
                    )
                    : (
                        <ExtendedForm
                            formClass="w-1/2"
                            elements={[
                                {
                                    name: "name",
                                    label: "Full Name",
                                    value: selectedUser.name
                                },
                                {
                                    name: "email",
                                    label: "Email",
                                    value: selectedUser.email
                                },
                            ]}
                            submitButtonLabel="Save"
                            onSubmit={async (values, { setSubmitting, setErrors }) => {
                                try {
                                    const { message, user: u } = await MainService.editUser(id, values, user);
                                    alert(message);
                                } catch (error) {
                                    setExtendedError(error, setErrors)
                                }
                            }}
                        />
                    )
            }
        </div>
    )
}

export default withRouter(UserEditPage);
