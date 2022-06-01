import authHeader from "./auth.header";

const API = process.env.REACT_APP_API + 'users/';

class UserService{
    loadUser(id){
        return fetch(API + id, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': authHeader()
            }
        });
    }

    // this method converts string representation of bytes array into blob and then builds image url from that blob
    getImageUrl(image){
        return fetch("data:image/*;base64," + image).then(response => response.blob().then(blob => URL.createObjectURL(blob)));
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