(function() {
    const SPONSOR_CONFIG = {
        sponsorName: 'Moroni',
        sponsorDay: 8,
        maxCrates: 4,
        beersPerCrate: 3,
        totalBeers: 12,
        crateTexture: 'Moroni',
        npcName: "Uomo d'Affari",
        npcTextures: {
            up: "Uomod'Affari_Dietro.png",
            down: "Uomod'Affari_Avanti.png",
            left: "Uomod'Affari_Sinistra.png",
            right: "Uomod'Affari_Destra.png"
        }
    };

    class SponsorSystem {
        constructor(scene) {
            this.scene = scene;
            this.state = this.loadState();
            this.crates = [];
            this.crateZones = [];
            this.sponsorNPC = null;
            this.sponsorDelivered = false;
            this.cratePositions = [
                { x: 50, y: 80 },
                { x: 50, y: 140 },
                { x: 50, y: 200 },
                { x: 50, y: 260 }
            ];
            this.crateSprites = [];
            this.crateInteractiveZones = [];
        }

        loadState() {
            try {
                const raw = localStorage.getItem('waitress_sponsor_state');
                if (raw) return JSON.parse(raw);
            } catch (e) {}
            return {
                active: false,
                day: 0,
                beersRemaining: 0,
                cratesRemaining: 0,
                sponsorSecured: false,
                sponsorPermanent: false,
                completed: false
            };
        }

        saveState() {
            localStorage.setItem('waitress_sponsor_state', JSON.stringify(this.state));
        }

        isAvailable(currentDay) {
            if (this.state.completed) return false;
            if (this.state.active) return true;
            return currentDay === SPONSOR_CONFIG.sponsorDay;
        }

        startMission() {
            if (this.state.active || this.state.completed) return;

            this.state.active = true;
            this.state.day = SPONSOR_CONFIG.sponsorDay;
            this.state.beersRemaining = SPONSOR_CONFIG.totalBeers;
            this.state.cratesRemaining = SPONSOR_CONFIG.maxCrates;
            this.saveState();

            this.scene.time.delayedCall(3000, () => {
                this.spawnSponsorNPC();
            });
        }

        spawnSponsorNPC() {
            if (this.sponsorNPC || !this.state.active) return;

            const entryX = 240;
            const entryY = 592;

            const textureDown = SPONSOR_CONFIG.npcTextures.down;
            const textureUp = SPONSOR_CONFIG.npcTextures.up;
            const textureLeft = SPONSOR_CONFIG.npcTextures.left;
            const textureRight = SPONSOR_CONFIG.npcTextures.right;

            this.sponsorNPC = {
                name: SPONSOR_CONFIG.npcName,
                hasDirectionalTextures: true,
                textureUp: textureUp,
                textureDown: textureDown,
                textureLeft: textureLeft,
                textureRight: textureRight,
                sprite: null,
                shadow: null,
                speed: 55,
                movementData: null,
                x: entryX,
                y: entryY,
                isWalking: true,
                isLeaving: false,
                isDead: false,
                timerEvent: null,
                movementTimeout: null,
                _onExitComplete: null
            };

            if (this.scene.textures.exists(textureDown)) {
                this.sponsorNPC.shadow = this.scene.add.ellipse(entryX, entryY + 10, 20, 5, 0x000000, 0.25).setDepth(entryY - 1);
                this.sponsorNPC.sprite = this.scene.add.image(entryX, entryY, textureDown)
                    .setDisplaySize(45, 45)
                    .setDepth(entryY);
            } else {
                this.sponsorNPC.shadow = this.scene.add.ellipse(entryX, entryY + 10, 20, 5, 0x000000, 0.25).setDepth(entryY - 1);
                this.sponsorNPC.sprite = this.scene.add.text(entryX, entryY, '💼', {
                    fontSize: '32px'
                }).setOrigin(0.5).setDepth(entryY);
                this.sponsorNPC.isEmoji = true;
            }

            const targetX = 400;
            const targetY = 300;

            const waypoints = [
                { x: entryX, y: entryY },
                { x: 240, y: 540 },
                { x: 350, y: 400 },
                { x: targetX, y: targetY }
            ];

            this.sponsorNPC.movementData = {
                waypoints: waypoints,
                currentWaypoint: 1,
                destination: waypoints[1],
                movementComplete: false
            };

            this.scene.customers.push(this.sponsorNPC);

            this.scene.showFloatingText(400, 200, "💼 Un uomo d'affari è entrato...", '#ffd700');
        }

        updateSponsorMovement(delta) {
            if (!this.sponsorNPC || !this.sponsorNPC.movementData || !this.sponsorNPC.sprite) return;

            const data = this.sponsorNPC.movementData;
            if (data.movementComplete) return;

            const dx = data.destination.x - this.sponsorNPC.sprite.x;
            const dy = data.destination.y - this.sponsorNPC.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 4) {
                this.sponsorNPC.sprite.x = data.destination.x;
                this.sponsorNPC.sprite.y = data.destination.y;

                if (data.waypoints && data.currentWaypoint < data.waypoints.length - 1) {
                    data.currentWaypoint++;
                    data.destination = data.waypoints[data.currentWaypoint];
                    return;
                }

                data.movementComplete = true;
                this.sponsorNPC.isWalking = false;
                this.onSponsorArrived();
                return;
            }

            const speed = this.sponsorNPC.speed || 55;
            const step = Math.min(distance, speed * (delta / 1000));
            const ratio = step / distance;

            this.sponsorNPC.sprite.x += dx * ratio;
            this.sponsorNPC.sprite.y += dy * ratio;
            this.sponsorNPC.sprite.setDepth(this.sponsorNPC.sprite.y);

            if (this.sponsorNPC.shadow) {
                this.sponsorNPC.shadow.x = this.sponsorNPC.sprite.x;
                this.sponsorNPC.shadow.y = this.sponsorNPC.sprite.y + 10;
            }

            if (!this.sponsorNPC.isEmoji) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.sponsorNPC.sprite.setTexture(dx > 0 ? this.sponsorNPC.textureRight : this.sponsorNPC.textureLeft);
                } else {
                    this.sponsorNPC.sprite.setTexture(dy > 0 ? this.sponsorNPC.textureDown : this.sponsorNPC.textureUp);
                }
            }
        }

        onSponsorArrived() {
            if (!this.sponsorNPC || this.sponsorDelivered) return;
            this.sponsorDelivered = true;

            const businessMessage = "💼 Uomo d'Affari: \"Buongiorno. La Moroni, noto birrificio locale, vorrebbe sponsorizzare il suo ristorante. Le ho fatto lasciare 4 casse di birra sul davanzale. Se le venderà tutte, entrerà nel menù fisso.\"";

            this.scene.showFloatingText(400, 250, businessMessage, '#ffd700');

            this.scene.time.delayedCall(4000, () => {
                this.spawnCrates();
            });

            this.scene.time.delayedCall(12000, () => {
                this.removeSponsorNPC();
            });
        }

        spawnCrates() {
            if (!this.state.active || this.state.cratesRemaining <= 0) return;

            const positions = this.cratePositions.slice(0, this.state.cratesRemaining);

            positions.forEach((pos, index) => {
                if (index >= this.state.cratesRemaining) return;

                const crate = this.scene.add.image(pos.x, pos.y, SPONSOR_CONFIG.crateTexture)
                    .setDisplaySize(36, 36)
                    .setDepth(pos.y)
                    .setInteractive({ useHandCursor: true });

                this.crateSprites.push(crate);

                crate.on('pointerdown', () => {
                    if (this.scene.isPhoneActive || !this.scene.gameActive) return;

                    const dist = Phaser.Math.Distance.Between(
                        this.scene.waitress.x, this.scene.waitress.y,
                        pos.x, pos.y
                    );

                    if (dist <= 80) {
                        this.takeBeerFromCrate(index);
                    } else {
                        this.scene.showFloatingText(
                            this.scene.waitress.x,
                            this.scene.waitress.y - 30,
                            'Avvicinati alla cassa!',
                            '#ffd700'
                        );
                    }
                });

                crate.on('pointerover', () => {
                    crate.setTint(0xffd700);
                });

                crate.on('pointerout', () => {
                    crate.clearTint();
                });
            });

            this.scene.showFloatingText(400, 180, "📦 Le casse di Moroni sono sul davanzale!", '#2ecc71');
        }

        takeBeerFromCrate(crateIndex) {
            if (this.state.beersRemaining <= 0) {
                this.scene.showFloatingText(
                    this.scene.waitress.x,
                    this.scene.waitress.y - 30,
                    '📦 Cassa vuota!',
                    '#ff4444'
                );
                return;
            }

            if (this.scene.waitressState.tray.length >= 4) {
                this.scene.showFloatingText(
                    this.scene.waitress.x,
                    this.scene.waitress.y - 30,
                    'Vassoio pieno!',
                    '#ff4444'
                );
                return;
            }

            this.scene.waitressState.tray.push({ food: 'Moroni' });
            this.state.beersRemaining--;
            this.state.cratesRemaining = Math.ceil(this.state.beersRemaining / SPONSOR_CONFIG.beersPerCrate);
            this.saveState();

            this.scene.ensureTrayIndicator();
            this.scene.updateTrayGraphics();
            this.scene.updateHUD();

            this.scene.showFloatingText(
                this.scene.waitress.x,
                this.scene.waitress.y - 40,
                `🍺 Moroni presa! (${this.state.beersRemaining} rimaste)`,
                '#2ecc71'
            );

            if (this.scene.triggerSfx) this.scene.triggerSfx('pickup');

            const beersInThisCrate = Math.min(
                SPONSOR_CONFIG.beersPerCrate,
                this.state.beersRemaining
            );

            if (beersInThisCrate <= 0) {
                const crate = this.crateSprites[crateIndex];
                if (crate) {
                    crate.destroy();
                    this.crateSprites[crateIndex] = null;
                }
            }

            if (this.state.beersRemaining <= 0) {
                this.completeSponsorMission();
            }
        }

        completeSponsorMission() {
            this.state.completed = true;
            this.state.sponsorPermanent = true;
            this.state.active = false;
            this.saveState();

            this.scene.time.delayedCall(2000, () => {
                this.scene.showFloatingText(400, 300, "🏆 MORONI È ORA SPONSOR UFFICIALE!", '#ffd700');
                this.scene.showFloatingText(400, 250, "🍺 La Moroni è entrata nel menù fisso!", '#2ecc71');
                if (this.scene.triggerSfx) this.scene.triggerSfx('coin');
            });

            this.crateSprites.forEach(crate => {
                if (crate && crate.active) crate.destroy();
            });
            this.crateSprites = [];
        }

        removeSponsorNPC() {
            if (!this.sponsorNPC) return;

            const exitWaypoints = [
                { x: this.sponsorNPC.sprite.x, y: this.sponsorNPC.sprite.y },
                { x: 350, y: 400 },
                { x: 240, y: 540 },
                { x: 240, y: 592 }
            ];

            this.sponsorNPC.movementData = {
                waypoints: exitWaypoints,
                currentWaypoint: 1,
                destination: exitWaypoints[1],
                movementComplete: false
            };
            this.sponsorNPC.isLeaving = true;
            this.sponsorNPC.speed = 60;
        }

        update(delta) {
            if (this.sponsorNPC && this.sponsorNPC.movementData && !this.sponsorNPC.movementData.movementComplete) {
                this.updateSponsorMovement(delta);
            }

            if (this.sponsorNPC && this.sponsorNPC.isLeaving) {
                if (this.sponsorNPC.movementData && this.sponsorNPC.movementData.movementComplete) {
                    this.cleanupSponsorNPC();
                }
            }

            if (this.state.active && this.state.beersRemaining <= 0 && !this.state.completed) {
                this.completeSponsorMission();
            }
        }

        cleanupSponsorNPC() {
            if (!this.sponsorNPC) return;

            if (this.sponsorNPC.sprite) this.sponsorNPC.sprite.destroy();
            if (this.sponsorNPC.shadow) this.sponsorNPC.shadow.destroy();

            const index = this.scene.customers.indexOf(this.sponsorNPC);
            if (index > -1) {
                this.scene.customers.splice(index, 1);
            }

            this.sponsorNPC = null;
        }

        hasMoroniInMenu() {
            return this.state.sponsorPermanent || this.state.completed;
        }

        isMoroniBeer(foodName) {
            return foodName === 'Moroni';
        }
    }

    window.SponsorSystem = SponsorSystem;
})();(function() {
    const SPONSOR_CONFIG = {
        sponsorName: 'Moroni',
        sponsorDay: 8,
        maxCrates: 4,
        beersPerCrate: 3,
        totalBeers: 12,
        crateTexture: 'Moroni',
        npcName: "Uomo d'Affari",
        npcTextures: {
            up: "Uomod'Affari_Dietro.png",
            down: "Uomod'Affari_Avanti.png",
            left: "Uomod'Affari_Sinistra.png",
            right: "Uomod'Affari_Destra.png"
        }
    };

    class SponsorSystem {
        constructor(scene) {
            this.scene = scene;
            this.state = this.loadState();
            this.crates = [];
            this.crateZones = [];
            this.sponsorNPC = null;
            this.sponsorDelivered = false;
            this.cratePositions = [
                { x: 50, y: 80 },
                { x: 50, y: 140 },
                { x: 50, y: 200 },
                { x: 50, y: 260 }
            ];
            this.crateSprites = [];
            this.crateInteractiveZones = [];
        }

        loadState() {
            try {
                const raw = localStorage.getItem('waitress_sponsor_state');
                if (raw) return JSON.parse(raw);
            } catch (e) {}
            return {
                active: false,
                day: 0,
                beersRemaining: 0,
                cratesRemaining: 0,
                sponsorSecured: false,
                sponsorPermanent: false,
                completed: false
            };
        }

        saveState() {
            localStorage.setItem('waitress_sponsor_state', JSON.stringify(this.state));
        }

        isAvailable(currentDay) {
            if (this.state.completed) return false;
            if (this.state.active) return true;
            return currentDay === SPONSOR_CONFIG.sponsorDay;
        }

        startMission() {
            if (this.state.active || this.state.completed) return;

            this.state.active = true;
            this.state.day = SPONSOR_CONFIG.sponsorDay;
            this.state.beersRemaining = SPONSOR_CONFIG.totalBeers;
            this.state.cratesRemaining = SPONSOR_CONFIG.maxCrates;
            this.saveState();

            this.scene.time.delayedCall(3000, () => {
                this.spawnSponsorNPC();
            });
        }

        spawnSponsorNPC() {
            if (this.sponsorNPC || !this.state.active) return;

            const entryX = 240;
            const entryY = 592;

            const textureDown = SPONSOR_CONFIG.npcTextures.down;
            const textureUp = SPONSOR_CONFIG.npcTextures.up;
            const textureLeft = SPONSOR_CONFIG.npcTextures.left;
            const textureRight = SPONSOR_CONFIG.npcTextures.right;

            this.sponsorNPC = {
                name: SPONSOR_CONFIG.npcName,
                hasDirectionalTextures: true,
                textureUp: textureUp,
                textureDown: textureDown,
                textureLeft: textureLeft,
                textureRight: textureRight,
                sprite: null,
                shadow: null,
                speed: 55,
                movementData: null,
                x: entryX,
                y: entryY,
                isWalking: true,
                isLeaving: false,
                isDead: false,
                timerEvent: null,
                movementTimeout: null,
                _onExitComplete: null
            };

            if (this.scene.textures.exists(textureDown)) {
                this.sponsorNPC.shadow = this.scene.add.ellipse(entryX, entryY + 10, 20, 5, 0x000000, 0.25).setDepth(entryY - 1);
                this.sponsorNPC.sprite = this.scene.add.image(entryX, entryY, textureDown)
                    .setDisplaySize(45, 45)
                    .setDepth(entryY);
            } else {
                this.sponsorNPC.shadow = this.scene.add.ellipse(entryX, entryY + 10, 20, 5, 0x000000, 0.25).setDepth(entryY - 1);
                this.sponsorNPC.sprite = this.scene.add.text(entryX, entryY, '💼', {
                    fontSize: '32px'
                }).setOrigin(0.5).setDepth(entryY);
                this.sponsorNPC.isEmoji = true;
            }

            const targetX = 400;
            const targetY = 300;

            const waypoints = [
                { x: entryX, y: entryY },
                { x: 240, y: 540 },
                { x: 350, y: 400 },
                { x: targetX, y: targetY }
            ];

            this.sponsorNPC.movementData = {
                waypoints: waypoints,
                currentWaypoint: 1,
                destination: waypoints[1],
                movementComplete: false
            };

            this.scene.customers.push(this.sponsorNPC);

            this.scene.showFloatingText(400, 200, "💼 Un uomo d'affari è entrato...", '#ffd700');
        }

        updateSponsorMovement(delta) {
            if (!this.sponsorNPC || !this.sponsorNPC.movementData || !this.sponsorNPC.sprite) return;

            const data = this.sponsorNPC.movementData;
            if (data.movementComplete) return;

            const dx = data.destination.x - this.sponsorNPC.sprite.x;
            const dy = data.destination.y - this.sponsorNPC.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 4) {
                this.sponsorNPC.sprite.x = data.destination.x;
                this.sponsorNPC.sprite.y = data.destination.y;

                if (data.waypoints && data.currentWaypoint < data.waypoints.length - 1) {
                    data.currentWaypoint++;
                    data.destination = data.waypoints[data.currentWaypoint];
                    return;
                }

                data.movementComplete = true;
                this.sponsorNPC.isWalking = false;
                this.onSponsorArrived();
                return;
            }

            const speed = this.sponsorNPC.speed || 55;
            const step = Math.min(distance, speed * (delta / 1000));
            const ratio = step / distance;

            this.sponsorNPC.sprite.x += dx * ratio;
            this.sponsorNPC.sprite.y += dy * ratio;
            this.sponsorNPC.sprite.setDepth(this.sponsorNPC.sprite.y);

            if (this.sponsorNPC.shadow) {
                this.sponsorNPC.shadow.x = this.sponsorNPC.sprite.x;
                this.sponsorNPC.shadow.y = this.sponsorNPC.sprite.y + 10;
            }

            if (!this.sponsorNPC.isEmoji) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.sponsorNPC.sprite.setTexture(dx > 0 ? this.sponsorNPC.textureRight : this.sponsorNPC.textureLeft);
                } else {
                    this.sponsorNPC.sprite.setTexture(dy > 0 ? this.sponsorNPC.textureDown : this.sponsorNPC.textureUp);
                }
            }
        }

        onSponsorArrived() {
            if (!this.sponsorNPC || this.sponsorDelivered) return;
            this.sponsorDelivered = true;

            const businessMessage = "💼 Uomo d'Affari: \"Buongiorno. La Moroni, noto birrificio locale, vorrebbe sponsorizzare il suo ristorante. Le ho fatto lasciare 4 casse di birra sul davanzale. Se le venderà tutte, entrerà nel menù fisso.\"";

            this.scene.showFloatingText(400, 250, businessMessage, '#ffd700');

            this.scene.time.delayedCall(4000, () => {
                this.spawnCrates();
            });

            this.scene.time.delayedCall(12000, () => {
                this.removeSponsorNPC();
            });
        }

        spawnCrates() {
            if (!this.state.active || this.state.cratesRemaining <= 0) return;

            const positions = this.cratePositions.slice(0, this.state.cratesRemaining);

            positions.forEach((pos, index) => {
                if (index >= this.state.cratesRemaining) return;

                const crate = this.scene.add.image(pos.x, pos.y, SPONSOR_CONFIG.crateTexture)
                    .setDisplaySize(36, 36)
                    .setDepth(pos.y)
                    .setInteractive({ useHandCursor: true });

                this.crateSprites.push(crate);

                crate.on('pointerdown', () => {
                    if (this.scene.isPhoneActive || !this.scene.gameActive) return;

                    const dist = Phaser.Math.Distance.Between(
                        this.scene.waitress.x, this.scene.waitress.y,
                        pos.x, pos.y
                    );

                    if (dist <= 80) {
                        this.takeBeerFromCrate(index);
                    } else {
                        this.scene.showFloatingText(
                            this.scene.waitress.x,
                            this.scene.waitress.y - 30,
                            'Avvicinati alla cassa!',
                            '#ffd700'
                        );
                    }
                });

                crate.on('pointerover', () => {
                    crate.setTint(0xffd700);
                });

                crate.on('pointerout', () => {
                    crate.clearTint();
                });
            });

            this.scene.showFloatingText(400, 180, "📦 Le casse di Moroni sono sul davanzale!", '#2ecc71');
        }

        takeBeerFromCrate(crateIndex) {
            if (this.state.beersRemaining <= 0) {
                this.scene.showFloatingText(
                    this.scene.waitress.x,
                    this.scene.waitress.y - 30,
                    '📦 Cassa vuota!',
                    '#ff4444'
                );
                return;
            }

            if (this.scene.waitressState.tray.length >= 4) {
                this.scene.showFloatingText(
                    this.scene.waitress.x,
                    this.scene.waitress.y - 30,
                    'Vassoio pieno!',
                    '#ff4444'
                );
                return;
            }

            this.scene.waitressState.tray.push({ food: 'Moroni' });
            this.state.beersRemaining--;
            this.state.cratesRemaining = Math.ceil(this.state.beersRemaining / SPONSOR_CONFIG.beersPerCrate);
            this.saveState();

            this.scene.ensureTrayIndicator();
            this.scene.updateTrayGraphics();
            this.scene.updateHUD();

            this.scene.showFloatingText(
                this.scene.waitress.x,
                this.scene.waitress.y - 40,
                `🍺 Moroni presa! (${this.state.beersRemaining} rimaste)`,
                '#2ecc71'
            );

            if (this.scene.triggerSfx) this.scene.triggerSfx('pickup');

            const beersInThisCrate = Math.min(
                SPONSOR_CONFIG.beersPerCrate,
                this.state.beersRemaining
            );

            if (beersInThisCrate <= 0) {
                const crate = this.crateSprites[crateIndex];
                if (crate) {
                    crate.destroy();
                    this.crateSprites[crateIndex] = null;
                }
            }

            if (this.state.beersRemaining <= 0) {
                this.completeSponsorMission();
            }
        }

        completeSponsorMission() {
            this.state.completed = true;
            this.state.sponsorPermanent = true;
            this.state.active = false;
            this.saveState();

            this.scene.time.delayedCall(2000, () => {
                this.scene.showFloatingText(400, 300, "🏆 MORONI È ORA SPONSOR UFFICIALE!", '#ffd700');
                this.scene.showFloatingText(400, 250, "🍺 La Moroni è entrata nel menù fisso!", '#2ecc71');
                if (this.scene.triggerSfx) this.scene.triggerSfx('coin');
            });

            this.crateSprites.forEach(crate => {
                if (crate && crate.active) crate.destroy();
            });
            this.crateSprites = [];
        }

        removeSponsorNPC() {
            if (!this.sponsorNPC) return;

            const exitWaypoints = [
                { x: this.sponsorNPC.sprite.x, y: this.sponsorNPC.sprite.y },
                { x: 350, y: 400 },
                { x: 240, y: 540 },
                { x: 240, y: 592 }
            ];

            this.sponsorNPC.movementData = {
                waypoints: exitWaypoints,
                currentWaypoint: 1,
                destination: exitWaypoints[1],
                movementComplete: false
            };
            this.sponsorNPC.isLeaving = true;
            this.sponsorNPC.speed = 60;
        }

        update(delta) {
            if (this.sponsorNPC && this.sponsorNPC.movementData && !this.sponsorNPC.movementData.movementComplete) {
                this.updateSponsorMovement(delta);
            }

            if (this.sponsorNPC && this.sponsorNPC.isLeaving) {
                if (this.sponsorNPC.movementData && this.sponsorNPC.movementData.movementComplete) {
                    this.cleanupSponsorNPC();
                }
            }

            if (this.state.active && this.state.beersRemaining <= 0 && !this.state.completed) {
                this.completeSponsorMission();
            }
        }

        cleanupSponsorNPC() {
            if (!this.sponsorNPC) return;

            if (this.sponsorNPC.sprite) this.sponsorNPC.sprite.destroy();
            if (this.sponsorNPC.shadow) this.sponsorNPC.shadow.destroy();

            const index = this.scene.customers.indexOf(this.sponsorNPC);
            if (index > -1) {
                this.scene.customers.splice(index, 1);
            }

            this.sponsorNPC = null;
        }

        hasMoroniInMenu() {
            return this.state.sponsorPermanent || this.state.completed;
        }

        isMoroniBeer(foodName) {
            return foodName === 'Moroni';
        }
    }

    window.SponsorSystem = SponsorSystem;
})();