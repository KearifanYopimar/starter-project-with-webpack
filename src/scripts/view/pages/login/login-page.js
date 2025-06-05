class LoginPageView {
    static render() {
        return `
      <section role="region" aria-labelledby="login-heading">
        <h2 id="login-heading">Masuk</h2>
        <form id="login-form">
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div>
            <label for="password">Kata Sandi</label>
            <input type="password" id="password" name="password" required minlength="8">
          </div>
          <button type="submit">Masuk</button>
          <p>Belum punya akun? <a href="#/register">Daftar</a></p>
        </form>
      </section>
    `;
    }

    static setupEventListeners(onLogin) {
        const form = document.querySelector('#login-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('#email').value;
            const password = form.querySelector('#password').value;
            onLogin({ email, password });
        });
    }
}

export default LoginPageView;