import Axios from 'axios';

Axios.interceptors.response.use(response => response, error => {

    // just throw the 422
    if (error.response && error.response.status === 422) {
        throw error;
    }
    // handle error otherwise
    try {
        alert(error.response.data.message);
    } catch (err) {
        alert("Something went wrong! Please try to refresh!");
    }
});

export default Axios;
