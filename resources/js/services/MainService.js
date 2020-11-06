import Axios from "./Axios";
import Endpoints from "../config/endpoints";

export default class MainService {

    // users
    static getRegularUsers(user) {
        return Axios.get(Endpoints.regularUser, getTokenWithBearer(user))
            .then(r => r.data);
    }
    static getOwnerUsers(user) {
        return Axios.get(Endpoints.ownerUser, getTokenWithBearer(user))
            .then(r => r.data);
    }
    static getUserDetail(id, user) {
        return Axios.get(Endpoints.user + "/" + id, getTokenWithBearer(user))
            .then(r => r.data);
    }
    static editUser(id, { name, email }, user) {
        return Axios.post(Endpoints.user + "/" + id, { name, email }, getTokenWithBearer(user))
            .then(r => r.data);
    }
    static deleteUser(id, user) {
        return Axios.delete(Endpoints.user + "/" + id, getTokenWithBearer(user))
            .then(r => r.data);
    }

    // restaurants
    static getAllRestaurants(min_rating = 0) {
        return Axios.get(Endpoints.restaurantAll + "?min_avg_rating=" + min_rating)
            .then(r => r.data);
    }

    static getRestaurants(min_rating = 0, user) {
        return Axios.get(Endpoints.restaurant + "?min_avg_rating=" + min_rating, getTokenWithBearer(user))
            .then(r => r.data);
    }

    static showRestaurants(id, user) {
        return Axios.get(Endpoints.restaurant + "/" + id)
            .then(r => r.data);
    }

    static createRestaurant({ name, image, address }, user) {
        return Axios.post(Endpoints.restaurant, {
            name, image, address
        }, getTokenWithBearer(user))
            .then(r => r.data);
    }

    static editRestaurant(id, { name, image, address }, user) {
        return Axios.post(Endpoints.restaurant + "/" + id, {
            name, image, address
        }, getTokenWithBearer(user))
            .then(r => r.data);
    }

    static deleteRestaurant(id, user) {
        return Axios.delete(Endpoints.restaurant + "/" + id, getTokenWithBearer(user))
            .then(r => r.data);
    }

    // reviews
    static addReview(id, { rating, comment }, user) {
        return Axios.post(Endpoints.addReview(id), {
            rating, comment
        }, getTokenWithBearer(user))
            .then(r => r.data);
    }

    static editReview(id, { rating, comment }, user) {
        return Axios.post(Endpoints.editReview(id), {
            rating, comment
        }, getTokenWithBearer(user))
            .then(r => r.data);
    }

    static deleteReview(id, user) {
        return Axios.delete(Endpoints.editReview(id), getTokenWithBearer(user))
            .then(r => r.data);
    }

    // replies
    static addReply(id, { comment }, user) {
        return Axios.post(Endpoints.addReply(id), {
            comment
        }, getTokenWithBearer(user))
            .then(r => r.data);
    }

    static editReply(id, { comment }, user) {
        return Axios.post(Endpoints.editReply(id), {
            comment
        }, getTokenWithBearer(user))
            .then(r => r.data);
    }

    static deleteReply(id, user) {
        return Axios.delete(Endpoints.deleteReply(id), getTokenWithBearer(user))
            .then(r => r.data);
    }
}

function getTokenWithBearer(user) {
    return {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.token,
        }
    }
}