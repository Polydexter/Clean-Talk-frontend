import axios from "axios";
import jwt_decode from 'jwt-decode'

// Provides a set of custom methods to handle user info and login functions
class AuthService {
    setUserInLocalStorage(data) {
        localStorage.setItem('user', JSON.stringify(data))
    }

    async login(email, password) {
        console.log("login triggered")
        const response = await axios.post("http://localhost:8000/api/token/", { email, password});
        if (!response.data.access) {
            return response.data
        }
        // const config = {
        //     headers: {
        //         "Authorization": `Bearer ${response.data.access}`,
        //         'Content-Type': 'application/json'
        //     }
        // }
        // const respose2 = await axios.get('http://localhost:8000/users/details', config)
        // console.log(respose2)
        // const user = respose2.data.user
        const data = jwt_decode(response.data.access)
        const username = data.username
        const user = {
            'access': response.data.access,
            'refresh': response.data.refresh,
            'username': username
        }
        this.setUserInLocalStorage(user)
        return user
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        // TODO: May need logic for when there is no user
        const user = localStorage.getItem('user');
        return JSON.parse(user);
    }
}

export default new AuthService();