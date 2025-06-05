class UrlParser {
  static parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitedUrl = url.split('/');
    return `/${splitedUrl[1] || 'home'}`;
  }
}

export default UrlParser;