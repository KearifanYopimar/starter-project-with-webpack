class AddStoryPageView {
    static render() {
        return `
      <section role="region" aria-labelledby="add-story-heading">
        <h2 id="add-story-heading">Tambah Cerita Baru</h2>
        <form id="add-story-form">
          <div>
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div>
            <label for="photo">Foto</label>
            <input type="file" id="photo" name="photo" accept="image/*" required>
            <video id="preview" style="display: none;"></video>
            <button type="button" id="start-camera">Buka Kamera</button>
          </div>
          <div>
            <label for="map">Pilih Lokasi</label>
            <div id="map" style="height: 300px;"></div>
            <input type="hidden" id="lat" name="lat">
            <input type="hidden" id="lon" name="lon">
          </div>
          <button type="submit">Tambah Cerita</button>
        </form>
      </section>
    `;
    }

    static setupEventListeners({ onSubmitStory, onStartCamera }) {
        const form = document.querySelector('#add-story-form');
        const startCameraBtn = document.querySelector('#start-camera');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const description = form.querySelector('#description').value;
            const photo = form.querySelector('#photo').files[0];
            const lat = form.querySelector('#lat').value;
            const lon = form.querySelector('#lon').value;
            onSubmitStory({ description, photo, lat, lon });
        });

        startCameraBtn.addEventListener('click', () => onStartCamera(form));
    }

    static initMap(onMapClick) {
        const L = window.L;
        const customIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        });

        const map = L.map('map').setView([-6.2, 106.8], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        let marker;
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            document.querySelector('#lat').value = lat;
            document.querySelector('#lon').value = lng;
            if (marker) map.removeLayer(marker);
            marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
            onMapClick(lat, lng);
        });
    }

    static setupCamera({ stream, onCapturePhoto }) {
        const video = document.querySelector('#preview');
        const form = document.querySelector('#add-story-form');
        video.srcObject = stream;
        video.style.display = 'block';
        video.play();

        const captureBtn = document.createElement('button');
        captureBtn.textContent = 'Ambil Foto';
        form.appendChild(captureBtn);

        captureBtn.addEventListener('click', () => {
            onCapturePhoto(video, stream, captureBtn);
        });
    }
}

export default AddStoryPageView;