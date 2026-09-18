(function() {
    class PhoneSystem {
        constructor(scene) {
            this.scene = scene;
            this.phoneSprite = null;
            this.idleGlow = null;
            this.ringIndicator = null;
            this.isRinging = false;
            this.isCallActive = false;
            this.isMenuOpen = false;
            this.ringTimer = null;
            this.callerName = '';
            this.callDialog = null;
            this.soundEnabled = true;
            this.ringSound = null;
            this.callCenterAudio = null;
            this.marcoCallChance = 0.3;
            this.callCooldown = 0;
            this.forceNextCaller = null;
            this.clanCallDelivered = false;
            this.createPhoneIcon();
            this.scheduleNextCall();
        }

        createPhoneIcon() {
            const x = 540;
            const y = 540;

            if (this.scene.textures.exists('phone')) {
                this.phoneSprite = this.scene.add.image(x, y, 'phone');
                this.phoneSprite.setDisplaySize(36, 36);
            } else {
                this.phoneSprite = this.scene.add.text(x, y, '📞', { fontSize: '30px' }).setOrigin(0.5);
            }

            this.phoneSprite.setDepth(2000);
            this.phoneSprite.setScrollFactor(0);
            this.phoneSprite.setInteractive({ useHandCursor: true });

            this.idleGlow = this.scene.add.circle(x, y, 22, 0x3498db, 0.3).setDepth(2000).setScrollFactor(0);
            this.ringIndicator = this.scene.add.text(x + 12, y - 12, '🔔', { fontSize: '16px' }).setDepth(2000).setScrollFactor(0).setVisible(false);

            this.phoneSprite.on('pointerdown', () => {
                if (this.isRinging) {
                    this.answerCall();
                } else {
                    this.togglePhoneMenu();
                }
            });
        }

        triggerCall(callerName) {
            if (this.isCallActive || this.isMenuOpen || this.isRinging) return;
            this.callerName = callerName || 'Sconosciuto';
            this.startRinging();
        }

        playRingtone() {
            if (!this.soundEnabled) return;

            try {
                if (this.scene.sound && this.scene.cache.audio.exists('vibrazione')) {
                    if (!this.ringSound) {
                        this.ringSound = this.scene.sound.add('vibrazione', {
                            volume: 0.5,
                            loop: true
                        });
                        this.ringSound.play();
                    }
                }
            } catch(e) {}
        }

        stopRingtone() {
            try {
                if (this.ringSound) {
                    this.ringSound.stop();
                    this.ringSound.destroy();
                    this.ringSound = null;
                }
                if (this.callCenterAudio) {
                    this.callCenterAudio.stop();
                    this.callCenterAudio.destroy();
                    this.callCenterAudio = null;
                }
            } catch(e) {}
        }

        scheduleNextCall() {
            if (this.ringTimer) {
                this.ringTimer.remove();
            }

            if (this.forceNextCaller) {
                const caller = this.forceNextCaller;
                this.forceNextCaller = null;
                this.ringTimer = this.scene.time.delayedCall(1500, () => {
                    if (this.scene.gameActive && !this.isCallActive && !this.isMenuOpen) {
                        this.callerName = caller;
                        this.startRinging();
                    } else {
                        this.forceNextCaller = caller;
                        this.scheduleNextCall();
                    }
                });
                return;
            }

            if (this.shouldTriggerClanCall()) {
                this.ringTimer = this.scene.time.delayedCall(3000, () => {
                    if (this.scene.gameActive && !this.isCallActive && !this.isMenuOpen) {
                        this.callerName = 'clan';
                        this.clanCallDelivered = true;
                        if (this.scene.story) {
                            this.scene.story.storyState.clanCallReceived = true;
                            this.scene.story.saveStoryData();
                        }
                        this.startRinging();
                    } else {
                        this.scheduleNextCall();
                    }
                });
                return;
            }

            const isMarcoCall = Math.random() < this.marcoCallChance;
            const delay = isMarcoCall ? Phaser.Math.Between(25000, 45000) : Phaser.Math.Between(18000, 35000);

            this.ringTimer = this.scene.time.delayedCall(delay, () => {
                if (this.scene.gameActive && !this.isCallActive && !this.isMenuOpen) {
                    this.callerName = isMarcoCall ? 'Marco' : this.getRandomCaller();
                    this.startRinging();
                } else {
                    this.scheduleNextCall();
                }
            });
        }

        shouldTriggerClanCall() {
            if (this.clanCallDelivered) return false;
            if (!this.scene.crime) return false;
            if (this.scene.crime.hasAcceptedClanMission) return false;
            if (this.scene.crime.clanMissionCompleted) return false;
            if (window.GAME.level < 5) return false;
            return true;
        }

        getRandomCaller() {
            const callers = ['TAM', 'Telecom Direct Italia', 'MovieFilm'];
            return callers[Phaser.Math.Between(0, callers.length - 1)];
        }

        startRinging() {
            this.isRinging = true;
            this.ringIndicator.setVisible(true);
            this.playRingtone();

            this.scene.tweens.add({
                targets: this.phoneSprite,
                angle: { from: -15, to: 15 },
                duration: 100,
                yoyo: true,
                repeat: 20,
                onComplete: () => {
                    this.phoneSprite.setAngle(0);
                    if (this.isRinging && !this.isCallActive) {
                        this.missCall();
                    }
                }
            });
        }

        missCall() {
            this.isRinging = false;
            this.ringIndicator.setVisible(false);
            this.stopRingtone();

            if (this.callerName === 'Marco') {
                if (window.NPCManager && this.scene.npcManager) {
                    const currentRelation = this.scene.npcManager.getRelationship('Marco');
                    this.scene.npcManager.relationshipScores['Marco'] = Math.max(0, currentRelation - 15);
                    this.scene.npcManager.saveRelationships();

                    this.scene.showFloatingText(540, 510, '💔 Sintonia -15', '#e74c3c');

                    if (this.scene.npcManager.relationshipScores['Marco'] <= 0) {
                        this.scene.showFloatingText(400, 200, '💔 MARCO TI HA LASCIATO!', '#ff0000');
                        this.scene.gameActive = false;
                        this.scene.time.delayedCall(2000, () => {
                            this.scene.scene.start('GameOver');
                        });
                    }
                }
            } else if (this.callerName === 'clan') {
                this.scene.showFloatingText(540, 510, '📞 Il clan ha riattaccato...', '#ff4444');
                this.clanCallDelivered = false;
            } else {
                this.scene.showFloatingText(540, 510, '📞 Chiamata persa', '#e74c3c');
            }

            this.scheduleNextCall();
        }

        answerCall() {
            this.isRinging = false;
            this.isCallActive = true;
            this.ringIndicator.setVisible(false);
            this.phoneSprite.setAngle(0);
            this.stopRingtone();

            if (this.callerName === 'TAM' || this.callerName === 'Telecom Direct Italia' || this.callerName === 'MovieFilm') {
                if (typeof this.scene.setPhoneGameplayLock === 'function') {
                    this.scene.setPhoneGameplayLock(true);
                }
                this.showAdCallUI();
                return;
            }

            if (typeof this.scene.setPhoneGameplayLock === 'function') {
                this.scene.setPhoneGameplayLock(true);
            }

            if (this.callerName === 'clan') {
                this.showClanCallUI();
                return;
            }

            if (this.callerName === 'Marco') {
                this.showMarcoCallUI();
                return;
            }

            this.showCallUI();
        }

        showAdCallUI() {
            if (this.callDialog) this.callDialog.destroy();

            this.callDialog = this.scene.add.container(400, 300).setDepth(2000);
            this.callDialog.setScrollFactor(0);

            const bg = this.scene.add.rectangle(0, 0, 420, 320, 0x111111, 0.95);
            bg.setStrokeStyle(2, 0x3498db);

            const title = this.scene.add.text(0, -130, `📞 ${this.callerName}`, {
                fontSize: '20px',
                color: '#3498db',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            let msgText = '';
            let iconText = '📢';

            if (this.callerName === 'TAM') {
                iconText = '🚗';
                msgText = 'TAM: "Scopri le nuove auto in offerta! Vieni a trovarci!"';
            } else if (this.callerName === 'Telecom Direct Italia') {
                iconText = '📱';
                msgText = 'Telecom Direct Italia: "Fibra ultraveloce a soli 19.99€ al mese!"';
            } else if (this.callerName === 'MovieFilm') {
                iconText = '🎬';
                msgText = 'MovieFilm: "Prova 30 giorni gratis! Film e serie senza limiti!"';
            }

            const icon = this.scene.add.text(0, -70, iconText, {
                fontSize: '48px'
            }).setOrigin(0.5);

            const body = this.scene.add.text(0, 0, msgText, {
                fontSize: '14px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 360 },
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const statusText = this.scene.add.text(0, 60, '⏳ Chiamata in corso...', {
                fontSize: '12px',
                color: '#f39c12',
                fontStyle: 'italic',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const btnCloseBg = this.scene.add.rectangle(0, 115, 180, 36, 0xe74c3c).setInteractive({ useHandCursor: true });
            const btnCloseTxt = this.scene.add.text(0, 115, '❌ Riaggancia', {
                fontSize: '14px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            btnCloseBg.on('pointerdown', () => {
                this.endCall();
            });

            this.callDialog.add([bg, title, icon, body, statusText, btnCloseBg, btnCloseTxt]);

            try {
                const audioKeys = ['npc_call_center', 'npc_call_center_1', 'npc_call_center_2'];
                const audioKey = audioKeys[Phaser.Math.Between(0, audioKeys.length - 1)];
                if (this.scene.sound && this.scene.cache.audio.exists(audioKey)) {
                    this.callCenterAudio = this.scene.sound.add(audioKey, {
                        volume: 0.7,
                        loop: false
                    });
                    this.callCenterAudio.play();
                    this.callCenterAudio.once('complete', () => {
                        this.endCall();
                    });
                }
            } catch(e) {}
        }

        showClanCallUI() {
            if (this.callDialog) this.callDialog.destroy();

            this.callDialog = this.scene.add.container(400, 300).setDepth(2000);
            this.callDialog.setScrollFactor(0);

            const bg = this.scene.add.rectangle(0, 0, 360, 240, 0x111111, 0.95);
            bg.setStrokeStyle(2, 0xff4444);

            const title = this.scene.add.text(0, -90, `📞 ${this.callerName}`, {
                fontSize: '18px',
                color: '#ff4444',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const msgText = '🧔‍♂️ "Ci serve il tuo aiuto. Accetti la missione?"';

            const body = this.scene.add.text(0, -30, msgText, {
                fontSize: '13px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 320 },
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            this.callDialog.add([bg, title, body]);

            const options = [
                { text: '✅ Accetto la missione', accept: true },
                { text: '❌ Rifiuto', accept: false }
            ];

            options.forEach((option, index) => {
                const y = 40 + (index * 50);
                const color = option.accept ? 0x2ecc71 : 0xe74c3c;
                const btnBg = this.scene.add.rectangle(0, y, 280, 40, color).setInteractive({ useHandCursor: true });
                const btnTxt = this.scene.add.text(0, y, option.text, {
                    fontSize: '14px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }).setOrigin(0.5);

                btnBg.on('pointerdown', () => {
                    if (option.accept) {
                        if (this.scene.crime && typeof this.scene.crime.acceptClanMission === 'function') {
                            this.scene.crime.acceptClanMission();
                        }
                        if (this.scene.story) {
                            this.scene.story.storyState.clanMissionAccepted = true;
                            this.scene.story.saveStoryData();
                        }
                    } else {
                        this.scene.showFloatingText(400, 300, '❌ Missione rifiutata.', '#999999');
                        this.clanCallDelivered = false;
                    }
                    this.endCall();
                });

                this.callDialog.add([btnBg, btnTxt]);
            });
        }

        showMarcoCallUI() {
            if (this.callDialog) this.callDialog.destroy();

            this.callDialog = this.scene.add.container(400, 300).setDepth(2000);
            this.callDialog.setScrollFactor(0);

            const bg = this.scene.add.rectangle(0, 0, 420, 300, 0x111111, 0.95);
            bg.setStrokeStyle(2, 0xff6b6b);

            const title = this.scene.add.text(0, -110, `📞 ${this.callerName}`, {
                fontSize: '18px',
                color: '#ff6b6b',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const body = this.scene.add.text(0, -70, 'Amore, come stai? Mi manchi!', {
                fontSize: '14px',
                color: '#ffffff',
                align: 'center',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            this.callDialog.add([bg, title, body]);

            const options = [
                { text: '❤️ Ti amo!', delta: +10 },
                { text: '😊 Sto bene, tu?', delta: +5 },
                { text: '😅 Sono impegnata, scusa.', delta: -5 },
                { text: '😒 Non ora, ho da fare.', delta: -15 }
            ];

            options.forEach((option, index) => {
                const y = -20 + (index * 55);
                const btnBg = this.scene.add.rectangle(0, y, 360, 45, 0x34495e).setInteractive({ useHandCursor: true });
                const btnTxt = this.scene.add.text(0, y, option.text, {
                    fontSize: '14px',
                    color: '#ffffff',
                    align: 'center',
                    fontFamily: 'Fredoka'
                }).setOrigin(0.5);

                btnBg.on('pointerdown', () => {
                    if (window.NPCManager && this.scene.npcManager) {
                        const currentRelation = this.scene.npcManager.getRelationship('Marco');
                        this.scene.npcManager.relationshipScores['Marco'] = Phaser.Math.Clamp(currentRelation + option.delta, 0, 100);
                        this.scene.npcManager.saveRelationships();

                        this.scene.showFloatingText(540, 510, `${option.delta > 0 ? '❤️ Sintonia +' : '💔 Sintonia '}${option.delta}`, option.delta > 0 ? '#2ecc71' : '#e74c3c');

                        if (this.scene.npcManager.relationshipScores['Marco'] <= 0) {
                            this.scene.showFloatingText(400, 200, '💔 MARCO TI HA LASCIATO!', '#ff0000');
                            this.scene.time.delayedCall(2000, () => {
                                this.scene.scene.start('GameOver');
                            });
                        }
                    }

                    this.endCall();
                });

                this.callDialog.add([btnBg, btnTxt]);
            });
        }

        showCallUI() {
            if (this.callDialog) this.callDialog.destroy();

            this.callDialog = this.scene.add.container(400, 300).setDepth(2000);
            this.callDialog.setScrollFactor(0);

            const bg = this.scene.add.rectangle(0, 0, 360, 240, 0x111111, 0.95);
            bg.setStrokeStyle(2, 0x3498db);

            const title = this.scene.add.text(0, -90, `📞 ${this.callerName}`, {
                fontSize: '18px',
                color: '#3498db',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const msgText = 'Ciao! Ho una proposta per il locale.';

            const body = this.scene.add.text(0, -30, msgText, {
                fontSize: '13px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 320 },
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const btnCloseBg = this.scene.add.rectangle(0, 60, 160, 40, 0xe74c3c).setInteractive({ useHandCursor: true });
            const btnCloseTxt = this.scene.add.text(0, 60, 'Chiudi', { fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

            btnCloseBg.on('pointerdown', () => {
                this.endCall();
            });

            this.callDialog.add([bg, title, body, btnCloseBg, btnCloseTxt]);
        }

        callTechnician() {
            if (this.scene.kitchen && typeof this.scene.kitchen.callTechnician === 'function') {
                return this.scene.kitchen.callTechnician();
            }
            return false;
        }

        callFirefighters() {
            if (this.scene.kitchen && typeof this.scene.kitchen.callFirefighters === 'function') {
                return this.scene.kitchen.callFirefighters();
            }
            return false;
        }

        endCall() {
            this.isCallActive = false;
            this.stopRingtone();

            if (this.callDialog) {
                this.callDialog.destroy(true);
                this.callDialog = null;
            }

            if (typeof this.scene.setPhoneGameplayLock === 'function') {
                this.scene.setPhoneGameplayLock(false);
            }

            this.scheduleNextCall();
        }

        togglePhoneMenu() {
            if (this.isCallActive) return;

            if (this.isMenuOpen) {
                this.closePhoneMenu();
            } else {
                this.openPhoneMenu();
            }
        }

        openPhoneMenu() {
            this.isMenuOpen = true;

            if (typeof this.scene.setPhoneGameplayLock === 'function') {
                this.scene.setPhoneGameplayLock(true);
            }

            if (this.callDialog) this.callDialog.destroy();

            this.callDialog = this.scene.add.container(400, 300).setDepth(2000);
            this.callDialog.setScrollFactor(0);

            const bg = this.scene.add.rectangle(0, 0, 320, 320, 0x111111, 0.95);
            bg.setStrokeStyle(2, 0x3498db);

            const title = this.scene.add.text(0, -130, '📱 TELEFONO', {
                fontSize: '18px',
                color: '#3498db',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const soundBtnBg = this.scene.add.rectangle(0, -90, 240, 32, this.soundEnabled ? 0x27ae60 : 0xe74c3c).setInteractive({ useHandCursor: true });
            const soundBtnTxt = this.scene.add.text(0, -90, this.soundEnabled ? '🔊 Suoneria: ON' : '🔇 Suoneria: OFF', {
                fontSize: '12px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            soundBtnBg.on('pointerdown', () => {
                this.soundEnabled = !this.soundEnabled;
                if (!this.soundEnabled && this.ringSound) {
                    this.ringSound.stop();
                    this.ringSound.destroy();
                    this.ringSound = null;
                }
                this.openPhoneMenu();
            });

            const btnFornitoreBg = this.scene.add.rectangle(0, -20, 240, 32, 0x34495e).setInteractive({ useHandCursor: true });
            const btnFornitoreTxt = this.scene.add.text(0, -20, `📦 Fornitore (${this.scene.supplier ? this.scene.supplier.totalCost : 7.50}€)`, {
                fontSize: '12px', color: '#ffffff', fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            btnFornitoreBg.on('pointerdown', () => {
                if (!this.scene.supplier) {
                    this.scene.showFloatingText(400, 200, '❌ Fornitore non disponibile!', '#ff4444');
                    this.closePhoneMenu();
                    return;
                }
                if (this.scene.supplier.packageSpawned) {
                    this.scene.showFloatingText(400, 200, '📦 C\'è già un pacco in sala!', '#ffaa00');
                    this.closePhoneMenu();
                    return;
                }
                if (window.GAME && window.GAME.score < this.scene.supplier.totalCost) {
                    this.scene.showFloatingText(400, 200, `💰 Non hai abbastanza soldi!`, '#ff4444');
                    this.closePhoneMenu();
                    return;
                }
                const spawned = this.scene.supplier.spawnPackage();
                if (spawned) this.scene.showFloatingText(400, 150, '📦 Fornitore in arrivo!', '#3498db');
                this.closePhoneMenu();
            });

            const btnTecnicoBg = this.scene.add.rectangle(0, 20, 240, 32, 0x8e44ad).setInteractive({ useHandCursor: true });
            const btnTecnicoTxt = this.scene.add.text(0, 20, `🔧 Tecnico (100€)`, {
                fontSize: '12px', color: '#ffffff', fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            btnTecnicoBg.on('pointerdown', () => {
                if (this.scene.kitchen && typeof this.scene.kitchen.callTechnician === 'function') {
                    const called = this.scene.kitchen.callTechnician();
                    if (called) this.closePhoneMenu();
                } else {
                    this.scene.showFloatingText(400, 200, '❌ Tecnico non disponibile!', '#ff4444');
                    this.closePhoneMenu();
                }
            });

            const btnPompieriBg = this.scene.add.rectangle(0, 60, 240, 32, 0xe74c3c).setInteractive({ useHandCursor: true });
            const btnPompieriTxt = this.scene.add.text(0, 60, `🚒 Pompieri (50€)`, {
                fontSize: '12px', color: '#ffffff', fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            btnPompieriBg.on('pointerdown', () => {
                if (this.scene.kitchen && typeof this.scene.kitchen.callFirefighters === 'function') {
                    const called = this.scene.kitchen.callFirefighters();
                    if (called) this.closePhoneMenu();
                } else {
                    this.scene.showFloatingText(400, 200, '❌ Pompieri non disponibili!', '#ff4444');
                    this.closePhoneMenu();
                }
            });

            const btnCloseBg = this.scene.add.rectangle(0, 110, 160, 32, 0x555555).setInteractive({ useHandCursor: true });
            const btnCloseTxt = this.scene.add.text(0, 110, 'Chiudi', { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

            btnCloseBg.on('pointerdown', () => {
                this.closePhoneMenu();
            });

            this.callDialog.add([bg, title, soundBtnBg, soundBtnTxt, btnFornitoreBg, btnFornitoreTxt, btnTecnicoBg, btnTecnicoTxt, btnPompieriBg, btnPompieriTxt, btnCloseBg, btnCloseTxt]);
        }

        closePhoneMenu() {
            this.isMenuOpen = false;
            if (this.callDialog) {
                this.callDialog.destroy(true);
                this.callDialog = null;
            }

            if (typeof this.scene.setPhoneGameplayLock === 'function') {
                this.scene.setPhoneGameplayLock(false);
            }
        }

        update(time, delta) {}
    }

    window.PhoneSystem = PhoneSystem;
})();