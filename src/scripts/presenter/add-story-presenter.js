import ApiService from '../data/api.js';
import AuthService from '../data/auth.js';
import AddStoryPageView from '../view/pages/add-story/add-story-page.js';
import CONFIG from '../config.js';

class AddStoryPresenter {
    constructor() {
        this._view = AddStoryPageView;
        this._lat = null;
        this._lon = null;
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

        this._view.setupEventListeners({
            onSubmitStory: async (storyData) => {
                try {
                    await ApiService.addStory(storyData);
                    alert('Cerita berhasil ditambahkan!');
                    window.location.hash = '#/home';

                    // src/scripts/presenter/add-story-presenter.js (perbarui bagian push notification)
                    if ('PushManager' in window) {
                        try {
                            const subscription = await navigator.serviceWorker.ready.then((reg) =>
                                reg.pushManager.subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: CONFIG.VAPID_PUBLIC_KEY,
                                })
                            );
                            await ApiService.subscribePushNotification(subscription);
                            await navigator.serviceWorker.ready.then((reg) =>
                                reg.showNotification('Story berhasil dibuat', {
                                    body: `Anda telah membuat story baru dengan deskripsi: ${storyData.description}`,
                                    icon: '/images/favicon.png',
                                })
                            );
                        } catch (error) {
                            console.error('Push notification error:', error);
                            alert('Push notification gagal: ' + error.message);
                        }
                    }
                } catch (error) {
                    alert(error.message);
                }
            },
            onStartCamera: async (form) => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    this._view.setupCamera({
                        stream,
                        onCapturePhoto: (video, stream, captureBtn) => {
                            const canvas = document.createElement('canvas');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            canvas.getContext('2d').drawImage(video, 0, 0);
                            canvas.toBlob((blob) => {
                                const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
                                const dataTransfer = new DataTransfer();
                                dataTransfer.items.add(file);
                                const photoInput = document.querySelector('#photo');
                                photoInput.files = dataTransfer.files;
                            });
                            stream.getTracks().forEach((track) => track.stop());
                            video.style.display = 'none';
                            captureBtn.remove();
                        },
                    });
                } catch (error) {
                    alert('Gagal mengakses kamera');
                }
            },
        });

        this._view.initMap((lat, lng) => {
            this._lat = lat;
            this._lon = lng;
        });
    }
}

export default AddStoryPresenter;