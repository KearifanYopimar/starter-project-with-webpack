import routes from './routes/routes.js';
import UrlParser from './routes/url-parser.js';

class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url] || routes['/home'];

    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this._content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this._content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}

export default App;