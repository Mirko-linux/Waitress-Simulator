class SaveManager {
    constructor() {
        this.dbName = 'WaitressSimulatorDB';
        this.storeName = 'gameSave';
        this.db = null;
        this.isReady = false;
        this.secretKey = 'Palermo_Procura_2026_X99';
    }

    generateHash(data) {
        const str = JSON.stringify(data) + this.secretKey;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.isReady = true;
                resolve(true);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getAIModelReference() {
        try {
            const raw = localStorage.getItem('waitress_ai_model_ref');
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return null;
    }

    async setAIModelReference(modelId) {
        try {
            const ref = {
                id: modelId,
                version: '1.0',
                cachedAt: Date.now()
            };
            localStorage.setItem('waitress_ai_model_ref', JSON.stringify(ref));
            return ref;
        } catch (e) {
            return null;
        }
    }

    async isAIModelCached(modelId) {
        if (!('caches' in window)) return false;
        try {
            const cacheNames = await caches.keys();
            const webllmCaches = cacheNames.filter(n =>
                n.toLowerCase().includes('webllm') ||
                n.toLowerCase().includes('mlc')
            );
            for (const name of webllmCaches) {
                const cache = await caches.open(name);
                const keys = await cache.keys();
                const hasModel = keys.some(req =>
                    req.url.includes(modelId) ||
                    req.url.includes('params') ||
                    req.url.includes('tokenizer')
                );
                if (hasModel) return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    collectNPCMemories() {
        const npcMemories = {};
        try {
            const npcNames = Object.keys(window.NPC_CONFIG || {});
            npcNames.forEach(name => {
                try {
                    const key = `waitress_npc_memory_${name}`;
                    const raw = localStorage.getItem(key);
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        const hasData =
                            (parsed.totalInteractions > 0) ||
                            (parsed.facts && parsed.facts.length > 0) ||
                            (parsed.summary && parsed.summary.length > 0) ||
                            (parsed.conversations && parsed.conversations.length > 0);
                        if (hasData) {
                            npcMemories[name] = parsed;
                        }
                    }
                } catch (e) {}
            });
        } catch (e) {}
        return npcMemories;
    }

    restoreNPCMemories(npcMemories) {
        if (!npcMemories || typeof npcMemories !== 'object') return;
        Object.keys(npcMemories).forEach(npcName => {
            try {
                localStorage.setItem(
                    `waitress_npc_memory_${npcName}`,
                    JSON.stringify(npcMemories[npcName])
                );
            } catch (e) {}
        });
    }

    async saveGame(gameData) {
        if (!this.isReady) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            const dataToSave = { ...gameData };

            const aiRef = (() => {
                try {
                    const raw = localStorage.getItem('waitress_ai_model_ref');
                    return raw ? JSON.parse(raw) : null;
                } catch (e) {
                    return null;
                }
            })();

            if (aiRef) {
                dataToSave.aiModel = aiRef;
            }

            const npcMemories = this.collectNPCMemories();
            if (Object.keys(npcMemories).length > 0) {
                dataToSave.npcMemories = npcMemories;
            }

            const signature = this.generateHash(dataToSave);

            const savePacket = {
                id: 'main_save',
                timestamp: Date.now(),
                data: dataToSave,
                sig: signature
            };

            const request = store.put(savePacket);
            request.onsuccess = () => {
                try {
                    localStorage.setItem('waitress_save_data', JSON.stringify(savePacket));
                } catch(e) {}
                resolve(true);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async loadGame() {
        if (!this.isReady) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get('main_save');

            request.onsuccess = (event) => {
                const result = event.target.result;
                if (result) {
                    const isValid = this.verifySave(result);
                    resolve({ data: result.data, isValid: isValid });
                } else {
                    resolve(null);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    verifySave(savePacket) {
        if (!savePacket || !savePacket.data || !savePacket.sig) return false;
        const currentSig = this.generateHash(savePacket.data);
        return currentSig === savePacket.sig;
    }

    async exportBackup() {
        const result = await this.loadGame();
        if (!result || !result.data) {
            alert("❌ Nessun salvataggio da esportare!");
            return;
        }

        const gameData = { ...result.data };

        const aiRef = (() => {
            try {
                const raw = localStorage.getItem('waitress_ai_model_ref');
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        })();

        if (aiRef) {
            gameData.aiModel = aiRef;
        }

        const npcMemories = this.collectNPCMemories();
        if (Object.keys(npcMemories).length > 0) {
            gameData.npcMemories = npcMemories;
        }

        const backupObject = {
            version: "1.1",
            exportedAt: new Date().toISOString(),
            gameData: gameData,
            signature: this.generateHash(gameData)
        };

        const jsonString = JSON.stringify(backupObject, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `WaitressSim_Backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importBackup(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);

            let gameData = null;
            let providedSignature = null;

            if (parsed && parsed.data && parsed.sig) {
                gameData = parsed.data;
                providedSignature = parsed.sig;
            } else if (parsed && parsed.gameData && parsed.signature) {
                gameData = parsed.gameData;
                providedSignature = parsed.signature;
            } else {
                return { success: false, error: 'Formato backup non valido' };
            }

            if (!gameData || !providedSignature) {
                return { success: false, error: 'Dati o firma mancanti' };
            }

            const expectedSignature = this.generateHash(gameData);

            if (expectedSignature !== providedSignature) {
                return { success: false, error: 'Firma non valida - file modificato o corrotto' };
            }

            if (gameData.aiModel) {
                try {
                    localStorage.setItem(
                        'waitress_ai_model_ref',
                        JSON.stringify(gameData.aiModel)
                    );
                } catch (e) {}
            }

            if (gameData.npcMemories) {
                this.restoreNPCMemories(gameData.npcMemories);
            }

            return this.saveGame(gameData).then(() => {
                return { success: true };
            }).catch(() => {
                return { success: false, error: 'Errore durante il salvataggio' };
            });
        } catch (e) {
            return { success: false, error: 'Errore nella lettura del file' };
        }
    }

    async deleteSave() {
        if (!this.isReady) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete('main_save');
            request.onsuccess = () => {
                try {
                    localStorage.removeItem('waitress_save_data');
                } catch(e) {}
                resolve(true);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async clearNPCMemories() {
        try {
            const npcNames = Object.keys(window.NPC_CONFIG || {});
            npcNames.forEach(name => {
                localStorage.removeItem(`waitress_npc_memory_${name}`);
            });
        } catch (e) {}
    }
}

window.SaveManager = new SaveManager();