(function() {
    const SPONSOR_CONFIG = {
        sponsorName: 'Moroni',
        sponsorDay: 8,
        cratesCount: 3,
        beersPerCrate: 4,
        totalBeers: 12,
        beersToSell: 3,
        crateTexture: 'Moroni_Piena',
        crateTextureEmpty: 'Moroni_Vuota',
        npcName: "Uomo d'Affari",
        npcTextures: {
            up: "Uomod'Affari_Dietro.png",
            down: "Uomod'Affari_Avanti.png",
            left: "Uomod'Affari_Sinistra.png",
            right: "Uomod'Affari_Destra.png"
        }
    };

    const MORONI_DIALOG_LINES = [
        {
            text: "Ho fatto una grossa proposta di sponsoring con Moroni per questo locale.",
            emoji: ''
        },
        {
            text: "Visto che ora siamo legati a loro, vedi di far vendere le birre Moroni ai clienti senza fiatare.",
            emoji: ''
        },
        {
            text: "Non deludermi o ci saranno conseguenze.",
            emoji: ''
        }
    ];

    class MoroniDialogScene extends Phaser.Scene {
        constructor() {
            super('MoroniDialog');
            this.currentLine = 0;
            this.dialogContainer = null;
            this.isClosing = false;
            this._typeTimer = null;
        }

        init(data) {
            this.onComplete = (data && data.onComplete) || null;
            this.currentLine = 0;
            this.isClosing = false;
            this._typeTimer = null;
        }

        create() {
            const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
            overlay.setDepth(1);

            this.dialogContainer = this.add.container(400, 480).setDepth(100);

            const dialogBg = this.add.rectangle(0, 0, 720, 180, 0x110906, 0.98)
                .setStrokeStyle(3, 0xffd700);

            const speakerText = this.add.text(-340, -70, SPONSOR_CONFIG.npcName, {
                fontSize: '16px',
                color: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0, 0.5);

            const emojiText = this.add.text(320, -70, '', {
                fontSize: '28px'
            }).setOrigin(1, 0.5);

            this.dialogText = this.add.text(-340, 0, '', {
                fontSize: '15px',
                color: '#ffffff',
                fontFamily: 'Fredoka',
                wordWrap: { width: 660 },
                lineSpacing: 6
            }).setOrigin(0, 0.5);

            const hintText = this.add.text(340, 70, 'CLICCA PER CONTINUARE', {
                fontSize: '11px',
                color: '#ffd700',
                fontStyle: 'italic',
                fontFamily: 'Fredoka'
            }).setOrigin(1, 0.5);

            this.tweens.add({
                targets: hintText,
                alpha: 0.3,
                duration: 800,
                yoyo: true,
                repeat: -1
            });

            this.dialogContainer.add([dialogBg, speakerText, emojiText, this.dialogText, hintText]);

            this.dialogContainer.setScale(0.9);
            this.dialogContainer.setAlpha(0);

            this.tweens.add({
                targets: this.dialogContainer,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                duration: 400,
                ease: 'Back.easeOut'
            });

            this.input.on('pointerdown', () => {
                if (this.isClosing) return;
                this.nextLine();
            });

            this.input.keyboard.on('keydown-SPACE', () => {
                if (this.isClosing) return;
                this.nextLine();
            });

            this.input.keyboard.on('keydown-ENTER', () => {
                if (this.isClosing) return;
                this.nextLine();
            });

            this.showLine(0);
        }

        showLine(index) {
            if (index >= MORONI_DIALOG_LINES.length) {
                this.closeDialog();
                return;
            }

            const line = MORONI_DIALOG_LINES[index];

            this.dialogText.setText('');

            let charIndex = 0;
            const fullText = line.text;

            if (this._typeTimer) {
                this._typeTimer.remove();
                this._typeTimer = null;
            }

            this._typeTimer = this.time.addEvent({
                delay: 20,
                callback: () => {
                    charIndex++;
                    this.dialogText.setText(fullText.substring(0, charIndex));
                    if (charIndex >= fullText.length) {
                        if (this._typeTimer) {
                            this._typeTimer.remove();
                            this._typeTimer = null;
                        }
                    }
                },
                loop: true
            });
        }

        nextLine() {
            if (this._typeTimer) {
                this._typeTimer.remove();
                this._typeTimer = null;
                const line = MORONI_DIALOG_LINES[this.currentLine];
                if (line) {
                    this.dialogText.setText(line.text);
                }
                this.currentLine++;
                if (this.currentLine >= MORONI_DIALOG_LINES.length) {
                    this.closeDialog();
                } else {
                    this.showLine(this.currentLine);
                }
                return;
            }

            this.currentLine++;
            if (this.currentLine >= MORONI_DIALOG_LINES.length) {
                this.closeDialog();
            } else {
                this.showLine(this.currentLine);
            }
        }

        closeDialog() {
            if (this.isClosing) return;
            this.isClosing = true;

            if (this._typeTimer) {
                this._typeTimer.remove();
                this._typeTimer = null;
            }

            this.tweens.add({
                targets: this.dialogContainer,
                alpha: 0,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 400,
                ease: 'Back.easeIn',
                onComplete: () => {
                    if (typeof this.onComplete === 'function') {
                        this.onComplete();
                    }
                    this.scene.stop();
                }
            });
        }
    }

    class SponsorSystem {
        constructor(scene) {
            this.scene = scene;
            this.state = this.loadState();
            this.sponsorNPC = null;
            this.sponsorDelivered = false;
            this.dialogShown = false;
            this.crateSprites = [];
            this.cratePositions = [
                { x: 560, y: 470 },
                { x: 560, y: 510 },
                { x: 560, y: 550 }
            ];
            this.crateBeers = [4, 4, 4];
            this.beersSoldThisLevel = 0;
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
                crateBeers: [],
                beersSoldThisLevel: 0,
                sponsorSecured: false,
                sponsorPermanent: false,
                completed: false,
                failed: false
            };
        }

        saveState() {
            localStorage.setItem('waitress_sponsor_state', JSON.stringify(this.state));
        }

        resetState() {
            this.state = {
                active: false,
                day: 0,
                beersRemaining: 0,
                cratesRemaining: 0,
                crateBeers: [],
                beersSoldThisLevel: 0,
                sponsorSecured: false,
                sponsorPermanent: false,
                completed: false,
                failed: false
            };
            this.saveState();
        }

        isAvailable(currentDay) {
            if (this.state.completed) return false;
            if (this.state.active && this.state.day === currentDay) return true;

            let day = Math.max(1, currentDay) - 1;
            let month = CALENDAR_CONFIG.startMonth;
            let year = CALENDAR_CONFIG.startYear;
            while (true) {
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                if (day < daysInMonth) break;
                day -= daysInMonth;
                month++;
                if (month > 11) {
                    month = 0;
                    year++;
                }
            }
            return day + 1 === SPONSOR_CONFIG.sponsorDay;
        }

        startMission() {
            if (this.state.completed) return;

            const isResuming = this.state.active && this.state.day === window.GAME.level;
            if (this.state.active && this.state.day !== window.GAME.level) {
                this.state.active = false;
            }

            if (!this.state.active) {
                this.state.active = true;
                this.state.day = window.GAME.level;
                this.state.beersRemaining = SPONSOR_CONFIG.totalBeers;
                this.state.cratesRemaining = SPONSOR_CONFIG.cratesCount;
                this.state.beersSoldThisLevel = 0;
                this.state.sponsorSecured = false;
                this.state.failed = false;
                this.crateBeers = Array(SPONSOR_CONFIG.cratesCount).fill(SPONSOR_CONFIG.beersPerCrate);
            }

            this.beersSoldThisLevel = this.state.beersSoldThisLevel || 0;
            if (isResuming && Array.isArray(this.state.crateBeers) &&
                this.state.crateBeers.length === SPONSOR_CONFIG.cratesCount) {
                this.crateBeers = [...this.state.crateBeers];
            }
            this.state.crateBeers = [...this.crateBeers];
            this.sponsorDelivered = false;
            this.dialogShown = false;
            this.saveState();

            this.scene.sponsorBlocksCustomers = true;
            if (this.scene.tutorialActive && this.scene.tutorial) {
                this.scene.tutorialActive = false;
            }

            this.scene.time.delayedCall(600, () => {
                this.spawnSponsorNPC();
            });
        }

        spawnSponsorNPC() {
            if (this.sponsorNPC || !this.state.active) return;

            const entryX = 240;
            const entryY = 592;

            const textureDown = SPONSOR_CONFIG.npcTextures.down;

            this.sponsorNPC = {
                name: SPONSOR_CONFIG.npcName,
                hasDirectionalTextures: true,
                textureUp: SPONSOR_CONFIG.npcTextures.up,
                textureDown: textureDown,
                textureLeft: SPONSOR_CONFIG.npcTextures.left,
                textureRight: SPONSOR_CONFIG.npcTextures.right,
                sprite: null,
                shadow: null,
                speed: 65,
                movementData: null,
                x: entryX,
                y: entryY,
                isWalking: true,
                isLeaving: false,
                isDead: false,
                timerEvent: null,
                movementTimeout: null,
                missionBubble: null
            };

            if (this.scene.textures.exists(textureDown)) {
                this.sponsorNPC.shadow = this.scene.add.ellipse(entryX, entryY + 10, 20, 5, 0x000000, 0.25).setDepth(entryY - 1);
                this.sponsorNPC.sprite = this.scene.add.image(entryX, entryY, textureDown)
                    .setDisplaySize(45, 45)
                    .setDepth(entryY);
            } else {
                this.sponsorNPC.shadow = this.scene.add.ellipse(entryX, entryY + 10, 20, 5, 0x000000, 0.25).setDepth(entryY - 1);
                this.sponsorNPC.sprite = this.scene.add.text(entryX, entryY, '', {
                    fontSize: '32px'
                }).setOrigin(0.5).setDepth(entryY);
                this.sponsorNPC.isEmoji = true;
            }
            this.sponsorNPC.missionBubble = this.scene.add.image(entryX, entryY - 38, 'bubble_mission')
                .setDisplaySize(32, 32)
                .setDepth(entryY + 2);

            const waypoints = [
                { x: entryX, y: entryY },
                { x: 240, y: 540 },
                { x: 350, y: 450 },
                { x: 500, y: 400 }
            ];

            this.sponsorNPC.movementData = {
                waypoints: waypoints,
                currentWaypoint: 1,
                destination: waypoints[1],
                movementComplete: false
            };
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

            const speed = this.sponsorNPC.speed || 65;
            const step = Math.min(distance, speed * (delta / 1000));
            const ratio = step / distance;

            this.sponsorNPC.sprite.x += dx * ratio;
            this.sponsorNPC.sprite.y += dy * ratio;
            this.sponsorNPC.sprite.setDepth(this.sponsorNPC.sprite.y);

            if (this.sponsorNPC.shadow) {
                this.sponsorNPC.shadow.x = this.sponsorNPC.sprite.x;
                this.sponsorNPC.shadow.y = this.sponsorNPC.sprite.y + 10;
            }
            if (this.sponsorNPC.missionBubble) {
                this.sponsorNPC.missionBubble.x = this.sponsorNPC.sprite.x;
                this.sponsorNPC.missionBubble.y = this.sponsorNPC.sprite.y - 38;
                this.sponsorNPC.missionBubble.setDepth(this.sponsorNPC.sprite.y + 2);
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

            this.scene.time.delayedCall(400, () => {
                this.showDialog();
            });
        }

        showDialog() {
            if (this.dialogShown) return;
            this.dialogShown = true;

            if (!this.scene.scene.get('MoroniDialog')) {
                this.scene.scene.add('MoroniDialog', MoroniDialogScene, false);
            }

            this.scene.scene.launch('MoroniDialog', {
                onComplete: () => {
                    this.afterDialog();
                }
            });

            this.scene.scene.pause();
        }

        afterDialog() {
            if (this.scene.scene.isPaused()) {
                this.scene.scene.resume();
            }

            this.spawnCrates();

            this.scene.time.delayedCall(1200, () => {
                this.removeSponsorNPC();
            });
        }

        spawnCrates() {
            if (!this.state.active) return;

            const positions = this.cratePositions;

            positions.forEach((pos, index) => {
                if (this.crateSprites[index] && this.crateSprites[index].active) return;
                if (this.crateBeers[index] <= 0) return;

                const crateKey = this.crateBeers[index] > 0
                    ? SPONSOR_CONFIG.crateTexture
                    : (this.scene.textures.exists(SPONSOR_CONFIG.crateTextureEmpty)
                        ? SPONSOR_CONFIG.crateTextureEmpty
                        : SPONSOR_CONFIG.crateTexture);

                if (!this.scene.textures.exists(crateKey)) return;

                const crate = this.scene.add.image(pos.x, pos.y, crateKey)
                    .setDisplaySize(40, 40)
                    .setDepth(pos.y)
                    .setInteractive();

                this.crateSprites[index] = crate;

                crate.on('pointerdown', () => {
                    if (this.scene.isPhoneActive || !this.scene.gameActive) return;

                    const dist = Phaser.Math.Distance.Between(
                        this.scene.waitress.x, this.scene.waitress.y,
                        pos.x, pos.y
                    );

                    if (dist <= 90) {
                        this.takeBeerFromCrate(index);
                    }
                });
            });
        }

        takeBeerFromCrate(crateIndex) {
            if (!this.state.active) return;
            if (this.crateBeers[crateIndex] <= 0) {
                this.scene.showFloatingText(
                    this.scene.waitress.x,
                    this.scene.waitress.y - 30,
                    'Cassa vuota',
                    '#ff4444'
                );
                return;
            }

            if (this.scene.waitressState.tray.length >= 4) {
                this.scene.showFloatingText(
                    this.scene.waitress.x,
                    this.scene.waitress.y - 30,
                    'Vassoio pieno',
                    '#ff4444'
                );
                return;
            }

            this.scene.waitressState.tray.push({ food: 'Moroni' });
            this.crateBeers[crateIndex]--;
            this.state.beersRemaining--;
            this.state.crateBeers = [...this.crateBeers];
            this.state.cratesRemaining = this.crateBeers.filter(count => count > 0).length;
            this.saveState();

            this.scene.ensureTrayIndicator();
            this.scene.updateTrayGraphics();
            this.scene.updateHUD();

            this.scene.showFloatingText(
                this.scene.waitress.x,
                this.scene.waitress.y - 40,
                'Moroni presa',
                '#2ecc71'
            );

            if (this.scene.triggerSfx) this.scene.triggerSfx('pickup');

            const crate = this.crateSprites[crateIndex];
            if (crate && this.crateBeers[crateIndex] === 0) {
                const emptyKey = this.scene.textures.exists(SPONSOR_CONFIG.crateTextureEmpty)
                    ? SPONSOR_CONFIG.crateTextureEmpty
                    : SPONSOR_CONFIG.crateTexture;
                crate.setTexture(emptyKey);
                crate.setDisplaySize(40, 40);
            }
        }

        notifyMoroniSold() {
            if (!this.state.active) return;

            this.beersSoldThisLevel++;
            this.state.beersSoldThisLevel = this.beersSoldThisLevel;
            this.saveState();
        }

        completeSponsorMission() {
            this.state.completed = true;
            this.state.sponsorPermanent = true;
            this.state.active = false;
            this.saveState();
            if (this.scene.missions) {
                this.scene.missions.complete('sponsor_moroni');
            }

            this.crateSprites.forEach(crate => {
                if (crate && crate.active) crate.destroy();
            });
            this.crateSprites = [];
        }

        failSponsorMission() {
            this.state.failed = true;
            this.state.active = false;
            this.saveState();
            if (this.scene.missions) {
                this.scene.missions.fail('sponsor_moroni');
            }

            this.crateSprites.forEach(crate => {
                if (crate && crate.active) crate.destroy();
            });
            this.crateSprites = [];
        }

        checkLevelEnd() {
            if (!this.state.active) return;

            if (this.beersSoldThisLevel >= SPONSOR_CONFIG.beersToSell) {
                this.completeSponsorMission();
            } else {
                this.failSponsorMission();
            }
        }

        removeSponsorNPC() {
            if (!this.sponsorNPC) return;
            if (!this.sponsorNPC.sprite) {
                this.cleanupSponsorNPC();
                return;
            }

            const exitWaypoints = [
                { x: this.sponsorNPC.sprite.x, y: this.sponsorNPC.sprite.y },
                { x: 350, y: 450 },
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
            this.sponsorNPC.speed = 70;
            if (this.sponsorNPC.missionBubble) {
                this.sponsorNPC.missionBubble.setVisible(false);
            }
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
        }

        cleanupSponsorNPC() {
            if (!this.sponsorNPC) return;

            if (this.sponsorNPC.sprite) this.sponsorNPC.sprite.destroy();
            if (this.sponsorNPC.shadow) this.sponsorNPC.shadow.destroy();
            if (this.sponsorNPC.missionBubble) this.sponsorNPC.missionBubble.destroy();

            this.sponsorNPC = null;
            this.scene.sponsorBlocksCustomers = false;
            if (this.scene.gameActive && !this.scene.isCheater) {
                this.scene.startSpawning();
            }
        }

        hasMoroniInMenu() {
            return this.state.sponsorPermanent || this.state.completed;
        }

        isMoroniBeer(foodName) {
            return foodName === 'Moroni';
        }

        isMissionActive() {
            return this.state.active && this.state.day === (window.GAME ? window.GAME.level : 0);
        }
    }

    window.MoroniDialogScene = MoroniDialogScene;
    window.SponsorSystem = SponsorSystem;
})();