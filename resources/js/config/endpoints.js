const baseUrl = "/api";

const Endpoints = {
    auth: {
        login: baseUrl + "/auth/login",
        register: baseUrl + "/auth/register",
    },
    user: baseUrl + "/user",
    regularUser: baseUrl + "/user/regular",
    ownerUser: baseUrl + "/user/owner",
    restaurant: baseUrl + "/restaurant",
    restaurantAll: baseUrl + "/restaurant/all",
    addReview: id => baseUrl + "/restaurant/" + id + "/review",
    editReview: id => baseUrl + "/review/" + id,
    addReply: id => baseUrl + "/review/" + id + "/reply",
    editReply: id => baseUrl + "/reply/" + id,
    deleteReply: id => baseUrl + "/reply/" + id,
}

export default Endpoints;