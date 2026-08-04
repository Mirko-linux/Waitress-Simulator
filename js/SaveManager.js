class SaveManager {
    constructor() {
        this.dbName = 'WaitressSimulatorDB';
        this.storeName = 'gameSave';
        this.db = null;
        this.isReady = false;
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
                console.log('💾 SaveManager: IndexedDB connesso!');
                resolve(true);
            };

            request.onerror = (event) => {
                console.error('💾 SaveManager: Errore IndexedDB', event.target.error);
                reject(event.target.error);
            };
        });
    }

    
    async saveGame(gameData) {
        if (!this.isReady) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            
            const savePacket = {
                id: 'main_save',
                timestamp: Date.now(),
                data: gameData
            };

            const request = store.put(savePacket);

            request.onsuccess = () => {
                console.log('💾 Gioco salvato automaticamente su IndexedDB!');
                resolve(true);
            };

            request.onerror = (event) => {
                console.error('💾 Errore nel salvataggio IndexedDB', event.target.error);
                reject(event.target.error);
            };
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
                    console.log('💾 Gioco caricato da IndexedDB!');
                    resolve(result.data);
                } else {
                    console.log('💾 Nessun salvataggio trovato.');
                    resolve(null);
                }
            };

            request.onerror = (event) => {
                console.error('💾 Errore nel caricamento IndexedDB', event.target.error);
                reject(event.target.error);
            };
        });
    }

    
    async exportBackup() {
        const data = await this.loadGame();
        if (!data) {
            alert("❌ Nessun salvataggio da esportare!");
            return;
        }

        
        const backupObject = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            gameData: data
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

        console.log("💾 Backup esportato con successo!");
    }

    
    importBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                try {
                    const jsonString = event.target.result;
                    const backupObject = JSON.parse(jsonString);

                    
                    if (!backupObject.gameData) {
                        reject("Il file non sembra un backup valido di Waitress Simulator.");
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

            request.onsuccess = () => {
                console.log('💾 Salvataggio cancellato da IndexedDB.');
                resolve(true);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }
}


window.SaveManager = new SaveManager();