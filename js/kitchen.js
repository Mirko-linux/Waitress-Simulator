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

        this.isOnFire = false;
        this.fireTimer = null;
        this.smokeEffects = [];
        this.brokenStations = [];
        this.pendingOrders = 0;
        this.orderTimestamps = [];
        this.technician = null;
        this.technicianShadow = null;
        this.isTechnicianComing = false;
        this.technicianTimer = null;

        this.fireChancePerOrder = 0.02;
        this.fireChanceWindow = 20000;
        this.fireChanceCap = 0.35;
        this.fireChanceMinOrders = 5;

        this.repairCost = 100;
        this.firefighterCost = 50;
        this.omissionFine = 500;

        this.buildOvercookedKitchen();
    }

    buildOvercookedKitchen() {
        const scene = this.scene;

        for (let x = 6; x < 8; x++) {
            for (let y = 0; y < 6; y++) {
                const color = (x + y) % 2 === 0 ? 0x2c3e50 : 0x34495e;
                scene.add.rectangle(x * 100 + 50, y * 100 + 50, 100, 100, color).setDepth(0);
            }
        }

        scene.add.rectangle(595, 300, 10, 560, 0x1a252f).setDepth(2);
        for (let y = 30; y < 570; y += 35) {
            scene.add.rectangle(595, y, 14, 2, 0x2c3e50).setDepth(3);
        }

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

        const topBench = scene.add.rectangle(690, 80, 160, 44, 0x34495e).setDepth(1);
        topBench.setStrokeStyle(2, 0x5d6d7e);

        const midBenchLeft = scene.add.rectangle(635, 200, 48, 130, 0x34495e).setDepth(1);
        midBenchLeft.setStrokeStyle(2, 0x5d6d7e);

        const midBenchRight = scene.add.rectangle(745, 200, 48, 130, 0x34495e).setDepth(1);
        midBenchRight.setStrokeStyle(2, 0x5d6d7e);

        const bottomBench = scene.add.rectangle(690, 320, 160, 44, 0x34495e).setDepth(1);
        bottomBench.setStrokeStyle(2, 0x5d6d7e);

        stationDefs.forEach(def => {
            const stationSprite = scene.add.image(def.x, def.y, def.texKey).setDepth(3);
            stationSprite.setDisplaySize(56, 56);

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
                usageCount: 0,
                isBroken: false,
                smokeSprite: null,
                smokeTween: null,
                brokenSince: null
            };
        });

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

        if (scene.textures.exists('st_cuoco')) {
            this.chef = scene.add.image(this.chefRestX, this.chefRestY, 'st_cuoco').setDepth(8);
            this.chef.setDisplaySize(48, 48);
        } else {
            this.chef = scene.add.text(this.chefRestX, this.chefRestY, '👨‍🍳', {
                fontSize: '34px'
            }).setOrigin(0.5).setDepth(8);
        }

        this.chefShadow = scene.add.ellipse(this.chefRestX, this.chefRestY + 20, 26, 8, 0x000000, 0.3).setDepth(7);

        this.fireChanceIndicator = scene.add.text(690, 130, '', {
            fontSize: '10px',
            color: '#ff6b6b',
            fontStyle: 'bold',
            fontFamily: 'Fredoka',
            backgroundColor: '#000000aa',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setDepth(20).setVisible(false);
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

    addOrder(stationKey, foodName, tableId) {
        const station = this.stations[stationKey];
        if (!station) return false;

        if (station.isBroken) {
            this.showChefDialog('⚠️ Rotto! Chiama il tecnico!', '#e74c3c');
            return false;
        }

        const supplier = this.scene.supplier;
        if (supplier && typeof supplier.foodStock === 'number' && supplier.foodStock <= 0) {
            this.showChefDialog('📦 Scorte esaurite!', '#e74c3c');
            return false;
        }

        this.cookingQueue.push({
            stationKey: stationKey,
            foodName: foodName,
            tableId: tableId,
            station: station
        });

        this.pendingOrders++;
        this.orderTimestamps.push(Date.now());
        this.checkForFireChance();

        if (supplier && typeof supplier.consumeFood === 'function') {
            supplier.consumeFood();
        }

        this.processQueue();
        return true;
    }

    checkForFireChance() {
        if (this.isOnFire) return;

        const now = Date.now();
        this.orderTimestamps = this.orderTimestamps.filter(t => now - t < this.fireChanceWindow);

        const recentOrders = this.orderTimestamps.length;

        if (recentOrders < this.fireChanceMinOrders) {
            this.updateFireChanceIndicator(0);
            return;
        }

        const chance = Math.min(this.fireChanceCap, this.fireChancePerOrder * recentOrders);
        this.updateFireChanceIndicator(chance);

        const roll = Math.random();

        if (roll < chance) {
            this.startFire();
        }
    }

    updateFireChanceIndicator(chance) {
        if (!this.fireChanceIndicator) return;

        if (chance <= 0) {
            this.fireChanceIndicator.setVisible(false);
            return;
        }

        const pct = Math.round(chance * 100);
        this.fireChanceIndicator.setVisible(true);
        this.fireChanceIndicator.setText(`🔥 Rischio incendio: ${pct}%`);

        if (pct < 10) {
            this.fireChanceIndicator.setColor('#f39c12');
        } else if (pct < 20) {
            this.fireChanceIndicator.setColor('#e67e22');
        } else {
            this.fireChanceIndicator.setColor('#e74c3c');
        }
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
        station.usageCount = (station.usageCount || 0) + 1;

        if (station.usageCount >= 15) {
            this.breakStation(station, 'usura');
            this.isProcessing = false;
            this.processQueue();
            return;
        }

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

            this.pendingOrders = Math.max(0, this.pendingOrders - 1);

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

    breakStation(station, cause) {
        if (!station || station.isBroken) return;

        station.isBroken = true;
        station.usageCount = 0;
        station.busy = false;
        station.brokenSince = Date.now();

        if (station.progBar) {
            station.progBar.setVisible(false);
            station.progBar.width = 0;
        }
        if (station.progBg) station.progBg.setVisible(false);
        if (station.slipBg) station.slipBg.setVisible(false);
        if (station.slipText) station.slipText.setVisible(false);

        this.createSmokeEffect(station);

        if (!this.brokenStations.includes(station)) {
            this.brokenStations.push(station);
        }

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(station.x, station.y - 50, `💥 ${station.name} ROTTO!`, '#e74c3c');
            this.scene.showFloatingText(station.x, station.y - 70, '📞 Chiama il tecnico!', '#ffd700');
        }

        if (window.triggerSfx) window.triggerSfx('alert');
    }

    repairStation(station) {
        if (!station || !station.isBroken) return false;

        station.isBroken = false;
        station.busy = false;
        station.usageCount = 0;
        station.brokenSince = null;

        this.removeSmokeEffect(station);

        const index = this.brokenStations.indexOf(station);
        if (index > -1) {
            this.brokenStations.splice(index, 1);
        }

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(station.x, station.y - 30, '✅ Stazione riparata!', '#2ecc71');
        }

        if (window.triggerSfx) window.triggerSfx('coin');

        return true;
    }

    callTechnician() {
        if (this.isTechnicianComing) return false;
        if (this.brokenStations.length === 0) {
            if (this.scene.showFloatingText) {
                this.scene.showFloatingText(400, 200, '✅ Nessuna stazione rotta!', '#2ecc71');
            }
            return false;
        }
        if (!window.GAME) return false;

        if (window.GAME.score < this.repairCost) {
            if (this.scene.showFloatingText) {
                this.scene.showFloatingText(400, 200, `💰 Servono ${this.repairCost}€ per il tecnico!`, '#ff4444');
            }
            return false;
        }

        window.GAME.score -= this.repairCost;
        if (this.scene.updateHUD) this.scene.updateHUD();

        this.isTechnicianComing = true;

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(400, 200, `📞 Tecnico chiamato! -${this.repairCost}€`, '#3498db');
            this.scene.showFloatingText(400, 230, '🚶 Arriverà a breve...', '#ffd700');
        }

        this.spawnTechnician();

        return true;
    }

    spawnTechnician() {
        const startX = 240;
        const startY = 592;

        if (this.scene.textures.exists('st_cuoco')) {
            this.technician = this.scene.add.image(startX, startY, 'st_cuoco').setDepth(15);
            this.technician.setDisplaySize(45, 45);
            this.technician.setTint(0x3498db);
        } else {
            this.technician = this.scene.add.text(startX, startY, '👷', {
                fontSize: '32px'
            }).setOrigin(0.5).setDepth(15);
        }

        this.technicianShadow = this.scene.add.ellipse(startX, startY + 12, 24, 8, 0x000000, 0.3).setDepth(14);

        const targetStation = this.brokenStations[0];
        if (!targetStation) {
            this.despawnTechnician();
            this.isTechnicianComing = false;
            return;
        }

        const waypoints = [
            { x: startX, y: startY },
            { x: 240, y: 500 },
            { x: 500, y: 400 },
            { x: targetStation.x, y: targetStation.y + 40 }
        ];

        this.moveTechnician(waypoints, 0, () => {
            this.repairStation(targetStation);

            if (this.scene.showFloatingText) {
                this.scene.showFloatingText(targetStation.x, targetStation.y - 50, '🔧 Riparato!', '#2ecc71');
            }

            this.scene.time.delayedCall(1500, () => {
                this.technicianLeave();
            });
        });
    }

    moveTechnician(waypoints, index, onComplete) {
        if (!this.technician || index >= waypoints.length) {
            if (onComplete) onComplete();
            return;
        }

        const target = waypoints[index];
        const distance = Phaser.Math.Distance.Between(this.technician.x, this.technician.y, target.x, target.y);
        const duration = Math.min(distance * 8, 2000);

        this.scene.tweens.add({
            targets: this.technician,
            x: target.x,
            y: target.y,
            duration: duration,
            ease: 'Linear',
            onUpdate: () => {
                if (this.technicianShadow && this.technician) {
                    this.technicianShadow.x = this.technician.x;
                    this.technicianShadow.y = this.technician.y + 12;
                }
            },
            onComplete: () => {
                this.moveTechnician(waypoints, index + 1, onComplete);
            }
        });
    }

    technicianLeave() {
        if (!this.technician) {
            this.isTechnicianComing = false;
            return;
        }

        const exitX = 240;
        const exitY = 592;

        const distance = Phaser.Math.Distance.Between(this.technician.x, this.technician.y, exitX, exitY);
        const duration = Math.min(distance * 6, 2500);

        this.scene.tweens.add({
            targets: this.technician,
            x: exitX,
            y: exitY,
            duration: duration,
            ease: 'Linear',
            onUpdate: () => {
                if (this.technicianShadow && this.technician) {
                    this.technicianShadow.x = this.technician.x;
                    this.technicianShadow.y = this.technician.y + 12;
                }
            },
            onComplete: () => {
                this.despawnTechnician();
                this.isTechnicianComing = false;

                if (this.brokenStations.length > 0) {
                    this.scene.time.delayedCall(5000, () => {
                        this.callTechnician();
                    });
                }
            }
        });
    }

    despawnTechnician() {
        if (this.technician) {
            this.technician.destroy();
            this.technician = null;
        }
        if (this.technicianShadow) {
            this.technicianShadow.destroy();
            this.technicianShadow = null;
        }
    }

    createSmokeEffect(station) {
        if (station.smokeSprite) return;

        const smoke = this.scene.add.circle(station.x, station.y - 15, 8, 0x555555, 0.6).setDepth(100);
        const smoke2 = this.scene.add.circle(station.x + 5, station.y - 25, 10, 0x666666, 0.5).setDepth(100);
        const smoke3 = this.scene.add.circle(station.x - 5, station.y - 35, 12, 0x777777, 0.4).setDepth(100);

        station.smokeSprite = [smoke, smoke2, smoke3];

        station.smokeTween = this.scene.tweens.add({
            targets: [smoke, smoke2, smoke3],
            y: '-=40',
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 2000,
            repeat: -1,
            ease: 'Quad.easeOut',
            onRepeat: () => {
                smoke.setPosition(station.x, station.y - 15);
                smoke2.setPosition(station.x + 5, station.y - 25);
                smoke3.setPosition(station.x - 5, station.y - 35);
                smoke.setAlpha(0.6);
                smoke2.setAlpha(0.5);
                smoke3.setAlpha(0.4);
                smoke.setScale(1);
                smoke2.setScale(1);
                smoke3.setScale(1);
            }
        });
    }

    removeSmokeEffect(station) {
        if (station.smokeTween) {
            station.smokeTween.stop();
            station.smokeTween = null;
        }
        if (station.smokeSprite) {
            if (Array.isArray(station.smokeSprite)) {
                station.smokeSprite.forEach(s => {
                    try { s.destroy(); } catch(e) {}
                });
            } else {
                try { station.smokeSprite.destroy(); } catch(e) {}
            }
            station.smokeSprite = null;
        }
    }

    startFire() {
        if (this.isOnFire) return;
        this.isOnFire = true;

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(400, 250, '🔥 INCENDIO IN CUCINA!', '#ff0000');
            this.scene.showFloatingText(400, 280, '📞 Chiama i pompieri! (Telefono)', '#ff6b6b');
        }

        if (window.triggerSfx) window.triggerSfx('alert');

        const stationsToBreak = [];
        for (const id in this.stations) {
            const st = this.stations[id];
            if (!st.isBroken && Math.random() < 0.4) {
                stationsToBreak.push(st);
            }
        }

        stationsToBreak.forEach(st => {
            this.breakStation(st, 'incendio');
        });

        this.fireTimer = this.scene.time.delayedCall(15000, () => {
            if (this.isOnFire) {
                if (this.scene.showFloatingText) {
                    this.scene.showFloatingText(400, 250, `💰 MULTA PER OMISSIONE: -${this.omissionFine}€!`, '#e74c3c');
                }
                if (window.GAME) {
                    window.GAME.score = Math.max(0, window.GAME.score - this.omissionFine);
                    if (this.scene.updateHUD) this.scene.updateHUD();
                }
                this.extinguishFire(false);
            }
        });
    }

    extinguishFire(calledFirefighters) {
        if (!this.isOnFire) return;
        this.isOnFire = false;

        if (this.fireTimer) {
            this.fireTimer.remove();
            this.fireTimer = null;
        }

        if (calledFirefighters) {
            if (this.scene.showFloatingText) {
                this.scene.showFloatingText(400, 250, '🚒 Incendio spento!', '#2ecc71');
            }
            if (window.triggerSfx) window.triggerSfx('coin');
        }
    }

    callFirefighters() {
        if (!this.isOnFire) {
            if (this.scene.showFloatingText) {
                this.scene.showFloatingText(400, 200, '✅ Nessun incendio attivo!', '#2ecc71');
            }
            return false;
        }

        if (window.GAME && window.GAME.score < this.firefighterCost) {
            if (this.scene.showFloatingText) {
                this.scene.showFloatingText(400, 200, `💰 Servono ${this.firefighterCost}€!`, '#ff4444');
            }
            return false;
        }

        if (window.GAME) {
            window.GAME.score -= this.firefighterCost;
            if (this.scene.updateHUD) this.scene.updateHUD();
        }

        this.extinguishFire(true);

        return true;
    }

    update(player) {
        if (this.chefShadow && this.chef) {
            this.chefShadow.x = this.chef.x;
            this.chefShadow.y = this.chef.y + 20;
        }

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

        const now = Date.now();
        this.orderTimestamps = this.orderTimestamps.filter(t => now - t < this.fireChanceWindow);
        const recentOrders = this.orderTimestamps.length;

        if (recentOrders < this.fireChanceMinOrders) {
            if (this.fireChanceIndicator) this.fireChanceIndicator.setVisible(false);
        } else {
            const chance = Math.min(this.fireChanceCap, this.fireChancePerOrder * recentOrders);
            this.updateFireChanceIndicator(chance);
        }
    }

    reset() {
        this.cookingQueue = [];
        this.isProcessing = false;
        this.pendingOrders = 0;
        this.orderTimestamps = [];

        this.counterSlots.forEach(slot => {
            slot.occupied = false;
            slot.item = null;
            if (slot.imageObj) {
                try { slot.imageObj.destroy(); } catch(e) {}
                slot.imageObj = null;
            }
        });

        for (const id in this.stations) {
            const st = this.stations[id];
            st.busy = false;
            st.slipBg.setVisible(false);
            st.slipText.setVisible(false);
            st.progBg.setVisible(false);
            st.progBar.setVisible(false);
            st.progBar.width = 0;
            st.usageCount = 0;
            st.isBroken = false;
            st.brokenSince = null;

            this.removeSmokeEffect(st);
        }

        this.brokenStations = [];

        if (this.chef) {
            this.chef.x = this.chefRestX;
            this.chef.y = this.chefRestY;
        }
        this.isChefMoving = false;

        this.despawnTechnician();
        this.isTechnicianComing = false;

        if (this.isOnFire) {
            this.extinguishFire(false);
        }

        if (this.fireTimer) {
            this.fireTimer.remove();
            this.fireTimer = null;
        }

        if (this.fireChanceIndicator) {
            this.fireChanceIndicator.setVisible(false);
        }
    }

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

    isStationBroken(stationId) {
        const station = this.stations[stationId];
        return station ? station.isBroken : false;
    }
}

window.KitchenSystem = KitchenSystem;