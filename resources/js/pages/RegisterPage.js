import React, { useContext } from 'react'
import { Formik } from 'formik';
import AuthService from '../services/AuthService';
import history from '../config/history';
import Loader from '../components/Loader';
import { LOGIN_ROUTE } from './LoginPage';
import { Link } from 'react-router-dom';
import { UserContext } from '../components/Root';

export const REGISTER_ROUTE = "/register";

export default function RegisterPage() {

    const {user, setUser} = useContext(UserContext);

    return (
        <div className="py-24 flex justify-center RegisterPage">
            <div style={{ width: "320px" }}>
                <Formik
                    initialValues={{ email: "", password: "", password_confirmation: "", name: "", role: "regular" }}
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
                        await AuthService.register(values)
                            .then(user => {
                                localStorage.setItem('user', JSON.stringify(user));
                                setSubmitting(false);
                                setUser(user);
                                history.push(user.redirection);
                            })
                            .catch(error => {
                                setSubmitting(false);
                                if (error.response.status === 422) {
                                    let { email, password, name, role } = error.response.data.errors
                                    if (email) {
                                        email = email[0];
                                    }
                                    if (password) {
                                        password = password[0];
                                    }
                                    if (name) {
                                        name = name[0];
                                    }
                                    if (role) {
                                        role = role[0];
                                    }
                                    setErrors({ email, password, name, role });
                                }
                            });
                    }}>
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (

                            <form onSubmit={handleSubmit}>
                                <span className="text-sm px-1 text-gray-500">Name</span>
                                <input
                                    name="name"
                                    type="text"
                                    className="border block mb-1 w-full px-2 py-1"
                                    placeholder="Name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                />
                                <span className="text-xs mb-3 block text-red-500">
                                    {errors.name && touched.name && errors.name}
                                </span>
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
                                    {errors.email && touched.email && errors.email}
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
                                    {errors.password && touched.password_confirmation && errors.password}
                                </span>
                                <span className="text-sm px-1 text-gray-500">Confirm Password</span>
                                <input
                                    name="password_confirmation"
                                    type="password"
                                    className="border block mb-1 w-full px-2 py-1"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password_confirmation}
                                />
                                <span className="text-xs mb-3 block text-red-500">
                                    {errors.password_confirmation && touched.password_confirmation && errors.password_confirmation}
                                </span>
                                <span className="text-sm px-1 text-gray-500">Role</span>
                                <select name="role"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.role}
                                    className="border block mb-1 w-full px-2 py-1">
                                    <option value="regular">Regular User</option>
                                    <option value="owner">Owner</option>
                                </select>
                                <span className="text-xs mb-3 block text-red-500">
                                    {errors.role && touched.role && errors.role}
                                </span>
                                <div className="text-center">
                                    <button
                                        className="bg-orange-500 rounded text-sm px-3 py-1 text-white uppercase border border-orange-500 mx-auto"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >Get Started</button> or
                                    <Link
                                        className="border border-orange-500 rounded text-sm px-3 py-1 text-orange-500 uppercase mx-1"
                                        to={LOGIN_ROUTE}
                                    >Login</Link>
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
