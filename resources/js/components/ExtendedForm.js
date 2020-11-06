import React from 'react';
import { Formik } from 'formik';
import Loader from './Loader';

export default function ExtendedForm({
    elements = [{
        name: "name",
        label: "Name",
        type: "text",
        value: "John Doe",
        placeholder: "Enter Name"
    }],
    onSubmit = async (values, {
        setErrors, setSubmitting
    }) => { },
    formClass = "",
    formGroupClass = "",
    validate = values => {},
    submitButtonLabel = "Submit",
    hasCancelButton = false,
    onCancelButtonClick = () => {}
}) {

    const initialValues = {};

    elements = elements.map(element => {
        if (!element.name) {
            element.name = "name";
        }
        if (!element.label) {
            element.label = "Name";
        }
        if (!element.type) {
            element.type = "text";
        }
        if (!element.value) {
            element.value = "";
        }
        if (!element.placeholder) {
            element.placeholder = "";
        }
        initialValues[element.name] = element.value;
        return element;
    });

    return (
        <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={onSubmit}>
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
            }) => (
                    <form onSubmit={handleSubmit} className={formClass}>
                        {
                            elements.map(element => {
                                return (
                                    <div key={element.name} className={formGroupClass}>
                                        <span className="text-sm px-1 text-gray-500">
                                            {element.label}
                                        </span>
                                        {
                                            getControlForElement(element, { values, handleBlur, handleChange })
                                        }
                                        <span className="text-xs mb-3 block text-red-500">
                                            {errors[element.name] && touched[element.name] && errors[element.name]}
                                        </span>
                                    </div>
                                )
                            })
                        }
                        <div className="p-1"></div>
                        {
                            isSubmitting
                                ? <Loader size={24} />
                                : (
                                    <>
                                        <button
                                            className="bg-orange-500 border border-orange-500 rounded text-sm px-3 py-1 text-white uppercase mr-2"
                                            type="submit"
                                            disabled={isSubmitting}>{submitButtonLabel}</button>
                                        {
                                            hasCancelButton && (
                                                <button
                                                    className="bg-red-500 border border-red-500 rounded text-sm px-3 py-1 text-white uppercase mr-2"
                                                    onClick={onCancelButtonClick}>Cancel</button>
                                            )
                                        }
                                    </>
                                )
                        }
                    </form>
                )
            }
        </Formik>
    );
}

export function setExtendedError(axiosError = null, setErrors = () => { }) {
    try {
        if (axiosError.response.status === 422) {
            let { errors } = axiosError.response.data;
            for (const entity in errors) {
                errors[entity] = errors[entity][0];
            }
            setErrors(errors);
        }
    } catch (error) { }
}

/**
 * Create form control based on element properties
 */
function getControlForElement(element, { values, handleChange, handleBlur }) {
    switch (element.type) {
        case "textarea":
            return (
                <textarea
                    name={element.name}
                    value={values[element.name]}
                    type={element.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border block mb-1 w-full px-2 py-1"
                    placeholder={element.placeholder} />
            )
        default:
            return (
                <input
                    name={element.name}
                    value={values[element.name]}
                    type={element.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border block mb-1 w-full px-2 py-1"
                    placeholder={element.placeholder} />
            )
    }
}
