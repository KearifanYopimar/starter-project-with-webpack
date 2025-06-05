// src/scripts/view/pages/home/home-page.js
import L from 'leaflet';
import { createStoryItemTemplate } from '../../../utils/index.js';
import IndexedDBUtil from '../../../utils/indexeddb.js'; // Tambahkan

class HomePageView {
  static render() {
    return `
      <section role="region" aria-labelledby="stories-heading">
        <h2 id="stories-heading">Daftar Cerita</h2>
        <div id="stories-list"></div>
        <div id="map" style="height: 400px;"></div>
      </section>
    `;
  }

  static setupEventListeners(onLoadStories) {
    onLoadStories();
  }

  static displayStories(stories = []) {
    const storiesList = document.querySelector('#stories-list');
    if (Array.isArray(stories) && stories.length > 0) {
      storiesList.innerHTML = stories
          .map((story) => `
          <article role="article">
            <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" loading="lazy">
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <p>Dibuat pada: ${new Date(story.createdAt).toLocaleDateString('id-ID')}</p>
            <button class="delete-story bg-red-500 text-white px-4 py-2 rounded" data-id="${story.id}">Hapus</button>
          </article>
        `)
          .join('');

      // Tambahkan event listener untuk tombol hapus
      document.querySelectorAll('.delete-story').forEach((button) => {
        button.addEventListener('click', async () => {
          const id = button.getAttribute('data-id');
          if (confirm('Apakah Anda yakin ingin menghapus cerita ini dari penyimpanan lokal?')) {
            await IndexedDBUtil.deleteStory(id);
            // Refresh daftar cerita
            const updatedStories = await IndexedDBUtil.getAllStories();
            this.displayStories(updatedStories);
            this.initMap(updatedStories);
          }
        });
      });
    } else {
      storiesList.innerHTML = '<p>Tidak ada cerita yang tersedia.</p>';
    }
  }

  static initMap(stories = []) {
    if (!L || !L.map) {
      console.error('Leaflet is not loaded correctly');
      return;
    }

    const map = L.map('map').setView([-6.2, 106.8], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    if (Array.isArray(stories) && stories.length > 0) {
      stories.forEach((story) => {
        if (story.lat && story.lon) {
          L.marker([story.lat, story.lon], { icon: customIcon })
              .addTo(map)
              .bindPopup(`<b>${story.name || 'Unknown'}</b><br>${story.description || ''}`);
        } else {
          console.warn('Invalid lat/lon for story:', story);
        }
      });
    } else {
      console.warn('No stories available for map');
    }
  }
}

export default HomePageView;