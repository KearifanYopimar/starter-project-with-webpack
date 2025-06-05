import HomePresenter from '../presenter/home-presenter.js';
import AddStoryPresenter from '../presenter/add-story-presenter.js';
import LoginPresenter from '../presenter/login-presenter.js';
import RegisterPresenter from '../presenter/register-presenter.js';
import AboutPresenter from '../presenter/about-presenter.js';

const routes = {
  '/home': new HomePresenter(),
  '/add-story': new AddStoryPresenter(),
  '/login': new LoginPresenter(),
  '/register': new RegisterPresenter(),
  '/about': new AboutPresenter(),
};

export default routes;