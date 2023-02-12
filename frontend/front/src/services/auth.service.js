const API = process.env.REACT_APP_API + 'auth/';

class AuthService {
    login(loginData) {
        return  fetch(API + "login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });
    }

    signUp(nickname, email, password, image){
        let formData = new FormData();

        formData.append('nickname', nickname);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', image);

        return fetch(API + 'signup', {
            method: 'post',
            body: formData
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