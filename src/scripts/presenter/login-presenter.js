import ApiService from '../data/api.js';
import LoginPageView from '../view/pages/login/login-page.js';

class LoginPresenter {
    constructor() {
        this._view = LoginPageView;
    }

    async render() {
        return this._view.render();
    }

    async afterRender() {
        this._view.setupEventListeners(async ({ email, password }) => {
            try {
                await ApiService.login({ email, password });
                alert('Login berhasil!');
                window.location.hash = '#/home';
            } catch (error) {
                alert(error.message);
            }
        });
    }
}

export default LoginPresenter;