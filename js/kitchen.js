// kitchen.js - Sistema Cucina con Guasti, Incendi e Animazione Fumo

class KitchenSystem {
    constructor(scene) {
        this.scene = scene;
        this.cookingQueue = [];
        this.isProcessing = false;
        this.stations = {};
        this.counterSlots = [];
        this.chef = null;
        this.chefShadow = null;
        this.chefRestX = 710;
        this.chefRestY = 280;
        this.isChefMoving = false;
        this.chefDialog = null;
        
        // --- STATO DI GUASTO E INCENDIO ---
        this.isOnFire = false;
        this.fireTimer = null;
        this.smokeEffects = [];
        this.brokenStations = [];
        // ----------------------------------------

        this.preloadKitchenAssets();
        this.buildOvercookedKitchen();
    }

    preloadKitchenAssets() {
        const scene = this.scene;
        const assets = [
            { key: 'st_frigo', path: 'assets/cucina/frigo_acqua.png' },
            { key: 'st_tagliere', path: 'assets/cucina/banco_lavoro.png' },
            { key: 'st_fornelli', path: 'assets/cucina/fornelli.png' },
            { key: 'st_forno', path: 'assets/cucina/forno.png' },
            { key: 'st_friggitrice', path: 'assets/cucina/friggitrice.png' },
            { key: 'st_bevande', path: 'assets/cucina/dispenser_cola.png' },
            { key: 'st_caffe', path: 'assets/cucina/macchina_caffe.png' },
            { key: 'st_spillatore', path: 'assets/cucina/spillatore_birra.png' },
            { key: 'st_cuoco', path: 'assets/cucina/cuoco_cucina.png' },
            { key: 'st_bancone', path: 'assets/cucina/bancone_sala.png' }
        ];

        let needsLoad = false;
        assets.forEach(ast => {
            if (!scene.textures.exists(ast.key)) {
                scene.load.image(ast.key, ast.path);
                needsLoad = true;
            }
        });

        if (needsLoad && !scene.load.isLoading()) {
            scene.load.once('complete', () => {
                this.refreshKitchenTextures();
            });
            scene.load.start();
        }
    }

    buildOvercookedKitchen() {
        const scene = this.scene;

        // Pavimento
        for (let x = 6; x < 8; x++) {
            for (let y = 0; y < 6; y++) {
                const color = (x + y) % 2 === 0 ? 0x2c3e50 : 0x34495e;
                scene.add.rectangle(x * 100 + 50, y * 100 + 50, 100, 100, color).setDepth(0);
            }
        }

        // Muro
        const wall = scene.add.rectangle(595, 300, 10, 560, 0x1a252f).setDepth(2);
        for (let y = 30; y < 570; y += 35) {
            scene.add.rectangle(595, y, 14, 2, 0x2c3e50).setDepth(3);
        }

        // Definizione stazioni
        const stationDefs = [
            { id: 'frigo', name: 'Frigo', texKey: 'st_frigo', x: 635, y: 80, food: 'acqua' },
            { id: 'tagliere', name: 'Banco', texKey: 'st_tagliere', x: 690, y: 80, food: 'panino' },
            { id: 'fornelli', name: 'Grill', texKey: 'st_fornelli', x: 745, y: 80, food: 'panino' },
            { id: 'forno', name: 'Forno', texKey: 'st_forno', x: 635, y: 160, food: 'pizza' },
            { id: 'friggitrice', name: 'Friggitrice', texKey: 'st_friggitrice', x: 745, y: 160, food: 'patatine' },
            { id: 'bevande', name: 'Bibite', texKey: 'st_bevande', x: 635, y: 240, food: 'cola' },
            { id: 'caffe', name: 'Caffè', texKey: 'st_caffe', x: 745, y: 240, food: 'caffe' },
            { id: 'spillatore', name: 'Birra', texKey: 'st_spillatore', x: 690, y: 320, food: 'birra' }
        ];

        // Banchi di lavoro
        const topBench = scene.add.rectangle(690, 80, 160, 44, 0x34495e).setDepth(1);
        topBench.setStrokeStyle(2, 0x5d6d7e);

        const midBenchLeft = scene.add.rectangle(635, 200, 48, 130, 0x34495e).setDepth(1);
        midBenchLeft.setStrokeStyle(2, 0x5d6d7e);

        const midBenchRight = scene.add.rectangle(745, 200, 48, 130, 0x34495e).setDepth(1);
        midBenchRight.setStrokeStyle(2, 0x5d6d7e);

        const bottomBench = scene.add.rectangle(690, 320, 160, 44, 0x34495e).setDepth(1);
        bottomBench.setStrokeStyle(2, 0x5d6d7e);

        // Crea ogni stazione
        stationDefs.forEach(def => {
            const stationSprite = scene.add.image(def.x, def.y, def.texKey).setDepth(3);
            stationSprite.setDisplaySize(56, 56);

            // Elementi UI della stazione
            const progBg = scene.add.rectangle(def.x, def.y - 26, 36, 5, 0x1a1a2e).setDepth(5);
            progBg.setVisible(false);

            const progBar = scene.add.rectangle(def.x - 18, def.y - 26, 0, 5, 0x2ecc71).setDepth(6);
            progBar.setOrigin(0, 0.5);
            progBar.setVisible(false);

            const slipBg = scene.add.rectangle(def.x, def.y + 26, 46, 12, 0xfef9e7).setDepth(7);
            slipBg.setStrokeStyle(1, 0xf39c12);
            slipBg.setVisible(false);

            const slipText = scene.add.text(def.x, def.y + 26, '', {
                fontSize: '7px',
                color: '#c0392b',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(8);
            slipText.setVisible(false);

            // Sprite di fumo per stazione rotta
            const smokeSprite = null;

            this.stations[def.id] = {
                id: def.id,
                name: def.name,
                texKey: def.texKey,
                x: def.x,
                y: def.y,
                width: 56,
                height: 56,
                busy: false,
                food: def.food,
                sprite: stationSprite,
                progBg: progBg,
                progBar: progBar,
                slipBg: slipBg,
                slipText: slipText,
                // --- STATO DI GUASTO ---
                usageCount: 0,
                isBroken: false,
                smokeSprite: smokeSprite,
                brokenSince: null
                // ---------------------
            };
        });

        // Pass piatti
        const counterX = 595;
        const passHeight = 200;

        if (scene.textures.exists('st_bancone')) {
            this.passImg = scene.add.image(counterX, 420, 'st_bancone').setDepth(5);
            this.passImg.setDisplaySize(34, passHeight);
        } else {
            this.passImg = scene.add.rectangle(counterX, 420, 34, passHeight, 0x95a5a6).setDepth(5);
            this.passImg.setStrokeStyle(2, 0xbdc3c7);
        }

        scene.add.text(counterX, 310, 'PASS PIATTI', {
            fontSize: '9px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(7);

        // Slot del pass
        this.counterSlots = [];
        const slotYPositions = [350, 395, 440, 485];

        slotYPositions.forEach((yPos, index) => {
            scene.add.ellipse(counterX, yPos, 26, 10, 0x2c3e50, 0.4).setDepth(4);
            this.counterSlots.push({
                x: counterX,
                y: yPos,
                occupied: false,
                item: null,
                imageObj: null,
                index: index
            });
        });

        // Cuoco
        if (scene.textures.exists('st_cuoco')) {
            this.chef = scene.add.image(this.chefRestX, this.chefRestY, 'st_cuoco').setDepth(8);
            this.chef.setDisplaySize(48, 48);
        } else {
            this.chef = scene.add.text(this.chefRestX, this.chefRestY, '👨‍🍳', {
                fontSize: '34px'
            }).setOrigin(0.5).setDepth(8);
        }

        this.chefShadow = scene.add.ellipse(this.chefRestX, this.chefRestY + 20, 26, 8, 0x000000, 0.3).setDepth(7);
    }

    refreshKitchenTextures() {
        const scene = this.scene;
        for (const id in this.stations) {
            const st = this.stations[id];
            if (st.sprite && scene.textures.exists(st.texKey)) {
                st.sprite.setTexture(st.texKey);
                st.sprite.setDisplaySize(56, 56);
            }
        }
        if (this.chef && scene.textures.exists('st_cuoco') && typeof this.chef.setTexture === 'function') {
            this.chef.setTexture('st_cuoco');
            this.chef.setDisplaySize(48, 48);
        }
        if (this.passImg && scene.textures.exists('st_bancone') && typeof this.passImg.setTexture === 'function') {
            this.passImg.setTexture('st_bancone');
            this.passImg.setDisplaySize(34, 200);
        }
    }

    getNearestStation(player) {
        if (!player) return null;
        const maxDistance = 60;

        for (const id in this.stations) {
            const s = this.stations[id];
            const dist = Phaser.Math.Distance.Between(player.x, player.y, s.x, s.y);
            if (dist < maxDistance) {
                return s;
            }
        }
        return null;
    }

    interact(player) {
        const station = this.getNearestStation(player);
        if (!station) return false;

        if (station.busy) {
            this.showChefDialog('Postazione occupata!', '#e74c3c');
            return false;
        }

        // --- CONTROLLA SE LA STAZIONE È ROTTA ---
        if (station.isBroken) {
            this.showChefDialog('⚠️ Rotto! Chiama il tecnico!', '#e74c3c');
            return false;
        }
        // -----------------------------------------

        this.addOrder(station.id, station.food, 'A');
        return true;
    }

    addOrder(stationKey, foodName, tableId) {
        const station = this.stations[stationKey];
        if (!station) return false;

        if (station.busy) {
            this.showChefDialog('Occupato!', '#e74c3c');
            return false;
        }

        if (station.isBroken) {
            this.showChefDialog('⚠️ Rotto! Chiama il tecnico!', '#e74c3c');
            return false;
        }

        // --- CONTROLLO SCORTE PRIMA DI AGGIUNGERE L'ORDINE ---
        const supplier = this.scene.supplier;
        if (supplier && typeof supplier.foodStock === 'number' && supplier.foodStock <= 0) {
            this.showChefDialog('📦 Scorte esaurite!', '#e74c3c');
            return false;
        }
        // ------------------------------------------------------

        station.usageCount = (station.usageCount || 0) + 1;

        if (station.usageCount >= 30) {
            this.breakStation(station);
            this.showChefDialog(`💥 ${station.name} si è rotto per usura!`, '#e74c3c');
            return false;
        }

        this.cookingQueue.push({
            stationKey: stationKey,
            foodName: foodName,
            tableId: tableId,
            station: station
        });

        // --- CONSUMA LE SCORTE DOPO AVER AGGIUNTO L'ORDINE ---
        if (supplier && typeof supplier.consumeFood === 'function') {
            supplier.consumeFood();
        }
        // ------------------------------------------------------

        this.processQueue();
        return true;
    }

    breakStation(station) {
        if (!station || station.isBroken) return;

        station.isBroken = true;
        station.usageCount = 0;
        station.brokenSince = Date.now();
        station.busy = true;

        this.createSmokeEffect(station.x, station.y, station);

        if (!this.brokenStations.includes(station)) {
            this.brokenStations.push(station);
        }

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(station.x, station.y - 50, '🔧 ROTTO! Chiama il tecnico!', '#e74c3c');
        }

        if (window.triggerSfx) window.triggerSfx('break');
    }

    processQueue() {
        if (this.isProcessing || this.cookingQueue.length === 0) return;

        this.isProcessing = true;
        const order = this.cookingQueue.shift();
        this.startCooking(order);
    }

    startCooking(order) {
        const station = order.station;
        const foodName = order.foodName;
        const tableId = order.tableId;

        station.busy = true;
        station.slipBg.setVisible(true);
        station.slipText.setVisible(true);
        station.slipText.setText(`Tav.${tableId} ${foodName}`);

        station.progBg.setVisible(true);
        station.progBar.setVisible(true);
        station.progBar.width = 0;

        const targetX = station.x - 28;
        const targetY = station.y;

        this.moveChef(targetX, targetY, () => {
            if (window.triggerSfx) window.triggerSfx('cook');

            let duration = 4000;
            if (this.scene.CONFIG && this.scene.CONFIG.kitchen && this.scene.CONFIG.kitchen.cookingTimes) {
                duration = this.scene.CONFIG.kitchen.cookingTimes[foodName.toLowerCase()] || 4000;
            }

            this.scene.tweens.add({
                targets: station.progBar,
                width: 36,
                duration: duration,
                ease: 'Linear',
                onComplete: () => {
                    this.finishCooking(station, foodName);
                }
            });
        });
    }

    finishCooking(station, foodName) {
        station.busy = false;
        station.slipBg.setVisible(false);
        station.slipText.setVisible(false);
        station.progBg.setVisible(false);
        station.progBar.setVisible(false);
        station.progBar.width = 0;

        const freeSlot = this.counterSlots.find(slot => !slot.occupied);

        if (!freeSlot) {
            this.showChefDialog('Pass pieno!', '#e74c3c');
            if (window.triggerSfx) window.triggerSfx('alert');
            this.cookingQueue.unshift({
                stationKey: station.id,
                foodName: foodName,
                tableId: '?',
                station: station
            });
            this.isProcessing = false;
            this.scene.time.delayedCall(1200, () => { this.processQueue(); });
            return;
        }

        this.moveChef(freeSlot.x + 28, freeSlot.y, () => {
            freeSlot.occupied = true;
            freeSlot.item = foodName;

            if (this.scene.textures.exists(foodName)) {
                freeSlot.imageObj = this.scene.add.image(freeSlot.x, freeSlot.y, foodName)
                    .setDisplaySize(28, 28)
                    .setDepth(6);
            } else {
                const emoji = this.getFoodEmoji(foodName);
                freeSlot.imageObj = this.scene.add.text(freeSlot.x, freeSlot.y, emoji, {
                    fontSize: '20px'
                }).setOrigin(0.5).setDepth(6);
            }

            if (typeof this.scene.showFloatingText === 'function') {
                this.scene.showFloatingText(freeSlot.x, freeSlot.y - 20, '✨ PRONTO!', '#2ecc71');
            }
            this.showChefDialog('Pronto! 👨‍🍳', '#2ecc71');
            if (window.triggerSfx) window.triggerSfx('coin');

            this.moveChef(this.chefRestX, this.chefRestY);

            this.isProcessing = false;
            this.processQueue();
        });
    }

    moveChef(targetX, targetY, callback) {
        if (this.isChefMoving) {
            this.scene.time.delayedCall(80, () => {
                this.moveChef(targetX, targetY, callback);
            });
            return;
        }

        this.isChefMoving = true;
        const distance = Phaser.Math.Distance.Between(this.chef.x, this.chef.y, targetX, targetY);
        const duration = Math.min(distance * 2.8, 450);

        this.scene.tweens.add({
            targets: this.chef,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Quad.easeInOut',
            onUpdate: () => {
                if (this.chefShadow && this.chef) {
                    this.chefShadow.x = this.chef.x;
                    this.chefShadow.y = this.chef.y + 20;
                }
            },
            onComplete: () => {
                this.isChefMoving = false;
                if (callback) callback();
            }
        });
    }

    pickUpFood() {
        const occupiedSlot = this.counterSlots.find(slot => slot.occupied);
        if (!occupiedSlot) return null;

        const foodName = occupiedSlot.item;
        occupiedSlot.occupied = false;
        occupiedSlot.item = null;

        if (occupiedSlot.imageObj) {
            occupiedSlot.imageObj.destroy();
            occupiedSlot.imageObj = null;
        }

        return foodName;
    }

    getFoodEmoji(food) {
        const emojis = {
            'panino': '🍔', 'Panino': '🍔',
            'pizza': '🍕', 'Pizza': '🍕',
            'patatine': '🍟', 'Patatine': '🍟',
            'caffè': '☕', 'caffe': '☕', 'Caffè': '☕',
            'birra': '🍺', 'Birra': '🍺',
            'acqua': '💧', 'Acqua': '💧',
            'cola': '🥤', 'Cola': '🥤'
        };
        return emojis[food] || '🍽️';
    }

    showChefDialog(text, color = '#ffffff') {
        if (!this.chef) return;
        if (this.chefDialog) this.chefDialog.destroy();

        this.chefDialog = this.scene.add.text(
            this.chef.x,
            this.chef.y - 32,
            text,
            {
                fontSize: '11px',
                color: color,
                fontStyle: 'bold',
                fontFamily: 'Fredoka',
                backgroundColor: '#000000bb',
                padding: { x: 6, y: 3 }
            }
        ).setOrigin(0.5).setDepth(20);

        this.scene.tweens.add({
            targets: this.chefDialog,
            alpha: 0,
            y: this.chefDialog.y - 15,
            duration: 1400,
            delay: 1000,
            onComplete: () => {
                if (this.chefDialog) {
                    this.chefDialog.destroy();
                    this.chefDialog = null;
                }
            }
        });
    }
    // --- 1. ROTTURA PER USURA (SENZA CHIAMATA AUTOMATICA) ---
    breakStation(station) {
        if (station.isBroken) return;
        station.isBroken = true;
        station.usageCount = 0;
        station.brokenSince = Date.now();
        station.busy = true;

        // Crea effetto fumo
        this.createSmokeEffect(station.x, station.y, station);

        // Aggiungi alla lista delle stazioni rotte
        if (!this.brokenStations.includes(station)) {
            this.brokenStations.push(station);
        }

        // Mostra notifica (solo visiva, NON apre il menu)
        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(station.x, station.y - 50, '🔧 ROTTO! Chiama il tecnico!', '#e74c3c');
        }

        // Suono
        if (window.triggerSfx) window.triggerSfx('break');
    }

    // --- 2. RIPARAZIONE ---
    repairStation(station) {
        if (!station || !station.isBroken) return false;

        station.isBroken = false;
        station.busy = false;
        station.usageCount = 0;
        station.brokenSince = null;

        // Rimuovi fumo
        if (station.smokeSprite) {
            station.smokeSprite.destroy();
            station.smokeSprite = null;
        }

        // Rimuovi dalla lista stazioni rotte
        const index = this.brokenStations.indexOf(station);
        if (index > -1) {
            this.brokenStations.splice(index, 1);
        }

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(station.x, station.y - 30, '✅ Stazione riparata!', '#2ecc71');
        }

        this.showChefDialog(`🔧 ${station.name} riparato!`, '#2ecc71');
        if (window.triggerSfx) window.triggerSfx('repair');

        return true;
    }

    // --- 3. RIPARA UNA STAZIONE CASUALE ---
    repairRandomStation() {
        if (this.brokenStations.length === 0) return false;
        const station = this.brokenStations[0];
        return this.repairStation(station);
    }

    // --- 4. OTTIENI UNA STAZIONE ROTTA CASUALE ---
    getRandomBrokenStation() {
        if (this.brokenStations.length === 0) return null;
        return this.brokenStations[Math.floor(Math.random() * this.brokenStations.length)];
    }

    // --- 5. CONTROLLA INCENDIO PER TROPPI ORDINI ---
    checkForOverload() {
        if (this.cookingQueue.length >= 3 && !this.isOnFire) {
            this.startFire();
        }
    }

    // --- 6. INNESCA INCENDIO ---
    startFire() {
        if (this.isOnFire) return;
        this.isOnFire = true;
        this.scene.gameActive = false;

        // Crea fiamme su tutta la cucina
        for (const id in this.stations) {
            const st = this.stations[id];
            this.createSmokeEffect(st.x + (Math.random() - 0.5) * 40, st.y + (Math.random() - 0.5) * 40, st);
        }

        // Notifica
        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(400, 250, '🔥 INCENDIO IN CUCINA!', '#ff0000');
            this.scene.showFloatingText(400, 280, '📞 CHIAMA I POMPIERI!', '#ff6b6b');
        }

        if (window.triggerSfx) window.triggerSfx('fire');

        // Timer penalità: se non chiama i pompieri in 10 secondi
        this.fireTimer = this.scene.time.delayedCall(10000, () => {
            if (this.isOnFire) {
                if (this.scene.showFloatingText) {
                    this.scene.showFloatingText(400, 250, '💰 MULTA PER OMISSIONE DI SOCCORSO: -500€!', '#e74c3c');
                }
                if (window.GAME) {
                    window.GAME.score = Math.max(0, window.GAME.score - 500);
                    if (this.scene.updateHUD) this.scene.updateHUD();
                }
                this.extinguishFire(false);
            }
        });
    }

    // --- 7. SPEGNE INCENDIO ---
    extinguishFire(calledFirefighters) {
        if (!this.isOnFire) return;
        this.isOnFire = false;

        if (this.fireTimer) {
            this.fireTimer.remove();
            this.fireTimer = null;
        }

        // Rimuovi tutto il fumo
        this.smokeEffects.forEach(smoke => {
            if (smoke) smoke.destroy();
        });
        this.smokeEffects = [];

        // Rimuovi fumo dalle stazioni
        for (const id in this.stations) {
            const st = this.stations[id];
            if (st.smokeSprite) {
                st.smokeSprite.destroy();
                st.smokeSprite = null;
            }
        }

        if (calledFirefighters) {
            if (this.scene.showFloatingText) {
                this.scene.showFloatingText(400, 250, '🚒 Incendio spento!', '#2ecc71');
                this.scene.showFloatingText(400, 280, '💪 Hai chiamato i pompieri!', '#2ecc71');
            }
            if (window.triggerSfx) window.triggerSfx('extinguish');
        }

        this.scene.gameActive = true;
        this.isProcessing = false;
        this.processQueue();
    }

    // --- 8. CREA EFFETTO FUMO ---
    createSmokeEffect(x, y, station = null) {
        // Crea un rettangolo semitrasparente che pulsa
        const smoke = this.scene.add.rectangle(x, y, 30, 30, 0x888888, 0.3)
            .setDepth(100)
            .setScale(0.3);

        // Animazione di pulsazione e dissolvenza
        this.scene.tweens.add({
            targets: smoke,
            scaleX: 2.5,
            scaleY: 2.5,
            alpha: 0,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Quad.easeOut'
        });

        // Altra animazione per oscillazione
        this.scene.tweens.add({
            targets: smoke,
            x: smoke.x + (Math.random() - 0.5) * 20,
            y: smoke.y - 5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.smokeEffects.push(smoke);

        // Se associato a una stazione, salva riferimento
        if (station) {
            if (station.smokeSprite) station.smokeSprite.destroy();
            station.smokeSprite = smoke;
        }

        return smoke;
    }

    // =========================================================================

    update(player) {
        if (this.chefShadow && this.chef) {
            this.chefShadow.x = this.chef.x;
            this.chefShadow.y = this.chef.y + 20;
        }

        // Controlla se la coda è troppo lunga (rischio incendio)
        if (this.cookingQueue.length >= 3 && !this.isOnFire) {
            this.checkForOverload();
        }

        // Evidenzia stazione più vicina
        const nearest = this.getNearestStation(player || this.scene.waitress);

        for (const id in this.stations) {
            const s = this.stations[id];
            if (s.sprite && typeof s.sprite.setDisplaySize === 'function') {
                if (nearest && nearest.id === id && !s.isBroken) {
                    s.sprite.setDisplaySize(62, 62);
                } else {
                    s.sprite.setDisplaySize(56, 56);
                }
            }
        }
    }

    reset() {
        this.cookingQueue = [];
        this.isProcessing = false;
        
        // Svuota il pass
        this.counterSlots.forEach(slot => {
            slot.occupied = false;
            slot.item = null;
            if (slot.imageObj) {
                slot.imageObj.destroy();
                slot.imageObj = null;
            }
        });

        // Resetta tutte le stazioni
        for (const id in this.stations) {
            const st = this.stations[id];
            st.busy = false;
            st.slipBg.setVisible(false);
            st.slipText.setVisible(false);
            st.progBg.setVisible(false);
            st.progBar.setVisible(false);
            st.progBar.width = 0;
            
            // Resetta lo stato di usura
            st.usageCount = 0;
            st.isBroken = false;
            st.brokenSince = null;
            
            if (st.smokeSprite) {
                st.smokeSprite.destroy();
                st.smokeSprite = null;
            }
        }

        // Svuota lista stazioni rotte
        this.brokenStations = [];

        // Resetta il cuoco
        if (this.chef) {
            this.chef.x = this.chefRestX;
            this.chef.y = this.chefRestY;
        }
        this.isChefMoving = false;

        // Spegni eventuali incendi
        if (this.isOnFire) {
            this.extinguishFire(false);
        }

        // Rimuovi tutto il fumo
        this.smokeEffects.forEach(smoke => {
            if (smoke) smoke.destroy();
        });
        this.smokeEffects = [];

        if (this.fireTimer) {
            this.fireTimer.remove();
            this.fireTimer = null;
        }
    }

    // --- METODO PER OTTENERE LO STATO DI UNA STAZIONE ---
    getStationStatus(stationId) {
        const station = this.stations[stationId];
        if (!station) return null;
        return {
            isBroken: station.isBroken,
            usageCount: station.usageCount,
            busy: station.busy,
            name: station.name
        };
    }

    // --- METODO PER CONTROLLARE SE UNA STAZIONE È ROTTA ---
    isStationBroken(stationId) {
        const station = this.stations[stationId];
        return station ? station.isBroken : false;
    }
}

window.KitchenSystem = KitchenSystem;