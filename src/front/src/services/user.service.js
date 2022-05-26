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

    changeNickname(nickname){
        return fetch(API + 'edit/nickname', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                'Authorization': authHeader()
            },
            body: JSON.stringify({nickname}),
        });
    }

    changePassword(oldPassword, newPassword){
        return fetch(API + 'edit/password', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                'Authorization': authHeader()
            },
            body: JSON.stringify({oldPassword, newPassword}),
        });
    }

    deleteAccount(){
        return fetch(API + 'delete', {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                'Authorization': authHeader()
            }
        });
    }
}

export default new UserService();