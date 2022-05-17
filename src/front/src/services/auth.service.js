const API = "http://localhost:8080/api/auth/";

class AuthService {
    login(loginData) {
        console.log(loginData);

        return  fetch(API + "login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });
    }

    signUp(signUpData){
        return fetch(API + 'signup', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signUpData)
        });
    }

    logout() {
        localStorage.removeItem('user');
    }

    saveCurrentUser(user){
        localStorage.setItem('user', JSON.stringify(user));
    }

    loadCurrentUser(){
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();