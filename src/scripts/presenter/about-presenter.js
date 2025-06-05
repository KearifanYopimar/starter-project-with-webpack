import AboutPageView from '../view/pages/about/about-page.js';

class AboutPresenter {
    constructor() {
        this._view = AboutPageView;
    }

    async render() {
        return this._view.render();
    }

    async afterRender() {
        this._view.afterRender();
    }
}

export default AboutPresenter;