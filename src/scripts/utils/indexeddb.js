// src/scripts/utils/indexeddb.js
import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
    },
});

class IndexedDBUtil {
    static async saveStory(story) {
        const db = await dbPromise;
        await db.put(STORE_NAME, story);
    }

    static async saveStories(stories) {
        const db = await dbPromise;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        stories.forEach((story) => tx.store.put(story));
        await tx.done;
    }

    static async getAllStories() {
        const db = await dbPromise;
        return await db.getAll(STORE_NAME);
    }

    static async deleteStory(id) {
        const db = await dbPromise;
        await db.delete(STORE_NAME, id);
    }
}

export default IndexedDBUtil;