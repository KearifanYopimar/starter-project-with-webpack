class AboutPageView {
  static render() {
    return `
      <section role="region" aria-labelledby="about-heading">
        <h2 id="about-heading">Tentang Aplikasi</h2>
        <p>Story App adalah aplikasi untuk berbagi cerita dengan foto dan lokasi.</p>
      </section>
    `;
  }

  static afterRender() {
    // Tidak ada logika tambahan untuk halaman statis ini
  }
}

export default AboutPageView;