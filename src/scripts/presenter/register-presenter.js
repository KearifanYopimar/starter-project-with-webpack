import ApiService from '../data/api.js';
import RegisterPageView from '../view/pages/register/register-page.js';

class RegisterPresenter {
    constructor() {
        this._view = RegisterPageView;
    }

    async render() {
        return this._view.render();
    }

    async afterRender() {
        this._view.setupEventListeners(async ({ name, email, password }) => {
            try {
                await ApiService.register({ name, email, password });
                alert('Pendaftaran berhasil! Silakan login.');
                window.location.hash = '#/login';
            } catch (error) {
                alert(error.message);
            }
        });
    }
}

export default RegisterPresenter;