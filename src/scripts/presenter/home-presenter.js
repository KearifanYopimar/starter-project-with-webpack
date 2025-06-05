// src/scripts/presenter/home-presenter.js
import ApiService from '../data/api.js';
import AuthService from '../data/auth.js';
import HomePageView from '../view/pages/home/home-page.js';
import IndexedDBUtil from '../utils/indexeddb.js'; // Tambahkan

class HomePresenter {
    constructor() {
        this._view = HomePageView;
    }

    async render() {
        return this._view.render();
    }

    async afterRender() {
        if (!AuthService.isAuthenticated()) {
            alert('Silakan login terlebih dahulu');
            window.location.hash = '#/login';
            return;
        }

        this._view.setupEventListeners(async () => {
            let stories = [];
            try {
                // Coba ambil dari API
                const data = await ApiService.getAllStories({ location: 1 });
                if (data && Array.isArray(data)) {
                    stories = data;
                    // Simpan ke IndexedDB
                    await IndexedDBUtil.saveStories(stories);
                } else {
                    console.warn('Data cerita tidak valid:', data);
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
                // Jika gagal (offline), ambil dari IndexedDB
                stories = await IndexedDBUtil.getAllStories();
                if (stories.length > 0) {
                    alert('Aplikasi sedang offline. Menampilkan data dari penyimpanan lokal.');
                } else {
                    alert('Aplikasi sedang offline dan tidak ada data tersedia.');
                }
            }
            this._view.displayStories(stories);
            this._view.initMap(stories);
        });
    }
}

export default HomePresenter;