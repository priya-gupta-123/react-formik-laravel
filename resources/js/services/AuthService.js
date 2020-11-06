import Axios from "./Axios";
import Endpoints from "../config/endpoints";

export default class AuthService {
    static login({ email, password }) {
        return Axios.post(Endpoints.auth.login, { email, password }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(r => r.data);
    }

    static register({ email, password, password_confirmation, name, role = "regular" }) {
        return Axios.post(Endpoints.auth.register, { email, password, password_confirmation, name, role }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(r => r.data);
    }
}