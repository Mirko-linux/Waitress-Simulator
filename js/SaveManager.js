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

    async saveGame(gameData) {
        if (!this.isReady) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const dataToSave = { ...gameData };
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
        const backupObject = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            gameData: result.data,
            signature: this.generateHash(result.data)
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

    importBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const jsonString = event.target.result;
                    const backupObject = JSON.parse(jsonString);
                    if (!backupObject.gameData) {
                        reject("Il file non sembra un backup valido.");
                        return;
                    }
                    const expectedSig = this.generateHash(backupObject.gameData);
                    if (backupObject.signature && backupObject.signature !== expectedSig) {
                        reject("Firma del backup non valida. File manomesso.");
                        return;
                    }
                    await this.saveGame(backupObject.gameData);
                    resolve(true);
                } catch (e) {
                    reject("Errore nella lettura del file: " + e.message);
                }
            };
            reader.onerror = () => reject("Errore durante la lettura del file.");
            reader.readAsText(file);
        });
    }

    async deleteSave() {
        if (!this.isReady) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete('main_save');
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(event.target.error);
        });
    }
}

window.SaveManager = new SaveManager();