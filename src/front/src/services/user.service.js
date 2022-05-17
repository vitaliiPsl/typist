import authHeader from "./auth.header";

const API = "http://localhost:8080/api/users/";

class UserService{
    loadUser(id){
        return fetch(API + id, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': authHeader()
            }
        });
    }
}

export default new UserService();