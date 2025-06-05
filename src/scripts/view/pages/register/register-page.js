class RegisterPageView {
    static render() {
        return `
      <section role="region" aria-labelledby="register-heading">
        <h2 id="register-heading">Daftar</h2>
        <form id="register-form">
          <div>
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div>
            <label for="password">Kata Sandi</label>
            <input type="password" id="password" name="password" required minlength="8">
          </div>
          <button type="submit">Daftar</button>
          <p>Sudah punya akun? <a href="#/login">Masuk</a></p>
        </form>
      </section>
    `;
    }

    static setupEventListeners(onRegister) {
        const form = document.querySelector('#register-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const password = form.querySelector('#password').value;
            onRegister({ name, email, password });
        });
    }
}

export default RegisterPageView;