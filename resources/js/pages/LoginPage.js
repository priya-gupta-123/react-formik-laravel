import React, { useContext } from 'react'
import { Formik } from 'formik';
import AuthService from '../services/AuthService';
import history from '../config/history';
import { Link } from 'react-router-dom';
import { REGISTER_ROUTE } from './RegisterPage';
import Loader from '../components/Loader';
import { UserContext } from '../components/Root';

export const LOGIN_ROUTE = "/login";

export default function LoginPage() {

    const {user, setUser} = useContext(UserContext);

    const errors = {};

    return (
        <div className="py-24 flex justify-center LoginPage">
            <div style={{ width: "320px" }}>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validate={values => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = 'Invalid email address';
                        }
                        return errors;
                    }}
                    onSubmit={async (values, { setErrors, setSubmitting }) => {
                        setSubmitting(true);
                        await AuthService.login(values)
                            .then(user => {
                                localStorage.setItem('user', JSON.stringify(user));
                                setSubmitting(false);
                                setUser(user);
                                history.push(user.redirection);
                            })
                            .catch(error => {
                                setSubmitting(false);
                                if (error.response.status === 422) {
                                    let { email, password } = error.response.data.errors
                                    if (email) {
                                        email = email[0];
                                    }
                                    if (password) {
                                        password = password[0];
                                    }
                                    setErrors({ email, password });
                                }
                            });
                    }}>
                    {({
                        values,
                        errors: formErrors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (

                            <form onSubmit={handleSubmit}>
                                <span className="text-sm px-1 text-gray-500">Email</span>
                                <input
                                    name="email"
                                    type="email"
                                    className="border block mb-1 w-full px-2 py-1"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                />
                                <span className="text-xs mb-3 block text-red-500">
                                    {formErrors.email && touched.email && formErrors.email}
                                </span>
                                <span className="text-xs mb-3 block text-red-500">
                                    {errors.validation && errors.validation.email && errors.validation.email[0]}
                                </span>
                                <span className="text-sm px-1 text-gray-500">Password</span>
                                <input
                                    name="password"
                                    type="password"
                                    className="border block mb-1 w-full px-2 py-1"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                />
                                <span className="text-xs mb-3 block text-red-500">
                                    {formErrors.password && touched.password && formErrors.password}
                                </span>
                                <span className="text-xs mb-3 block text-red-500">
                                    {errors.validation && errors.validation.password && errors.validation.password[0]}
                                </span>
                                <div className="text-center">
                                    <button
                                        className="bg-orange-500 border border-orange-500 rounded text-sm px-3 py-1 text-white uppercase mx-1"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >Login</button> or
                                    <Link
                                        className="border border-orange-500 rounded text-sm px-3 py-1 text-orange-500 uppercase mx-1"
                                        to={REGISTER_ROUTE}
                                    >Register</Link>
                                </div>
                                {
                                    isSubmitting && (
                                        <Loader isFixed={true} background="white" />
                                    )
                                }
                            </form>
                        )}
                </Formik>
            </div>
        </div>
    );
}
