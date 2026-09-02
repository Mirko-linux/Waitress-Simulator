// phone.js - PhoneSystem completo con integrazione fornitore
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

            this.phoneSprite.setDepth(30);
            this.phoneSprite.setInteractive({ useHandCursor: true });

            this.idleGlow = this.scene.add.circle(x, y, 22, 0x3498db, 0.3).setDepth(29);
            this.ringIndicator = this.scene.add.text(x + 12, y - 12, '🔔', { fontSize: '16px' }).setDepth(31).setVisible(false);

            this.phoneSprite.on('pointerdown', () => {
                if (this.isRinging) {
                    this.answerCall();
                } else {
                    this.togglePhoneMenu();
                }
            });
        }

        scheduleNextCall() {
            if (this.ringTimer) {
                this.ringTimer.remove();
            }
            const delay = Phaser.Math.Between(15000, 30000);
            this.ringTimer = this.scene.time.delayedCall(delay, () => {
                if (this.scene.gameActive && !this.isCallActive && !this.isMenuOpen) {
                    this.startRinging();
                } else {
                    this.scheduleNextCall();
                }
            });
        }

        startRinging() {
            this.isRinging = true;
            this.ringIndicator.setVisible(true);

            const callers = ['Fornitore', 'Proprietario', 'Cliente Fisso', 'Pubblicità'];
            this.callerName = callers[Phaser.Math.Between(0, callers.length - 1)];

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

            if (this.scene.sound && this.scene.sound.status !== undefined) {
                try {
                    this.scene.sound.play('vibrazione', { volume: 0.5 });
                } catch(e) {}
            }
        }

        missCall() {
            this.isRinging = false;
            this.ringIndicator.setVisible(false);
            this.scene.showFloatingText(540, 510, '📞 Chiamata persa', '#e74c3c');
            this.scheduleNextCall();
        }

        answerCall() {
            this.isRinging = false;
            this.isCallActive = true;
            this.ringIndicator.setVisible(false);
            this.phoneSprite.setAngle(0);

            if (typeof this.scene.setPhoneGameplayLock === 'function') {
                this.scene.setPhoneGameplayLock(true);
            }

            this.showCallUI();
        }

        showCallUI() {
            if (this.callDialog) this.callDialog.destroy();

            this.callDialog = this.scene.add.container(400, 300).setDepth(250);

            const bg = this.scene.add.rectangle(0, 0, 360, 240, 0x111111, 0.95);
            bg.setStrokeStyle(2, 0x3498db);

            const title = this.scene.add.text(0, -90, `📞 ${this.callerName}`, {
                fontSize: '18px',
                color: '#3498db',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            let msgText = 'Ciao! Ho una proposta per il locale.';
            let callback = null;

            if (this.callerName === 'Fornitore') {
                msgText = 'Vuoi scorte extra di ingredienti a metà prezzo?';
                callback = () => {
                    if (this.scene.supplier && typeof this.scene.supplier.spawnPackage === 'function') {
                        this.scene.supplier.spawnPackage();
                        this.scene.showFloatingText(400, 150, '📦 Fornitore in arrivo!', '#3498db');
                    } else {
                        this.scene.showFloatingText(400, 150, '❌ Fornitore non disponibile!', '#ff4444');
                    }
                };
            } else if (this.callerName === 'Proprietario') {
                msgText = 'Ricordati di pagare l\'affitto a fine giornata!';
                callback = () => {
                    this.scene.showFloatingText(400, 150, '📋 Affitto: 50€', '#ffd700');
                };
            } else if (this.callerName === 'Cliente Fisso') {
                msgText = 'Vorrei prenotare un tavolo per stasera!';
                callback = () => {
                    this.scene.showFloatingText(400, 150, '✅ Prenotazione confermata! +5€', '#2ecc71');
                    if (window.GAME) {
                        window.GAME.score += 5;
                    }
                };
            } else {
                msgText = 'Offerta pubblicitaria: +10 clienti oggi!';
                callback = () => {
                    this.scene.showFloatingText(400, 150, '📢 Pubblicità attivata!', '#3498db');
                    if (window.GAME) {
                        window.GAME.score += 10;
                    }
                };
            }

            const body = this.scene.add.text(0, -30, msgText, {
                fontSize: '13px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 320 },
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const btnAcceptBg = this.scene.add.rectangle(-80, 60, 130, 40, 0x2ecc71).setInteractive({ useHandCursor: true });
            const btnAcceptTxt = this.scene.add.text(-80, 60, 'Accetta', { fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

            const btnCloseBg = this.scene.add.rectangle(80, 60, 130, 40, 0xe74c3c).setInteractive({ useHandCursor: true });
            const btnCloseTxt = this.scene.add.text(80, 60, 'Chiudi', { fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

            btnAcceptBg.on('pointerdown', () => {
                if (callback) callback();
                this.endCall();
            });

            btnCloseBg.on('pointerdown', () => {
                this.endCall();
            });

            this.callDialog.add([bg, title, body, btnAcceptBg, btnAcceptTxt, btnCloseBg, btnCloseTxt]);
        }

        endCall() {
            this.isCallActive = false;
            if (this.callDialog) {
                this.callDialog.destroy();
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

            this.callDialog = this.scene.add.container(400, 300).setDepth(250);

            const bg = this.scene.add.rectangle(0, 0, 320, 260, 0x111111, 0.95);
            bg.setStrokeStyle(2, 0x3498db);

            const title = this.scene.add.text(0, -100, '📱 TELEFONO', {
                fontSize: '18px',
                color: '#3498db',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            // Pulsante Fornitore
            const btnFornitoreBg = this.scene.add.rectangle(0, -40, 240, 36, 0x34495e).setInteractive({ useHandCursor: true });
            const btnFornitoreTxt = this.scene.add.text(0, -40, `📦 Chiama Fornitore (${this.scene.supplier ? this.scene.supplier.totalCost : 7.50}€)`, {
                fontSize: '13px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            btnFornitoreBg.on('pointerdown', () => {
                if (!this.scene.supplier) {
                    this.scene.showFloatingText(400, 200, '❌ Fornitore non disponibile!', '#ff4444');
                    this.closePhoneMenu();
                    return;
                }

                // Controlla se c'è già un pacco
                if (this.scene.supplier.packageSpawned) {
                    this.scene.showFloatingText(400, 200, '📦 C\'è già un pacco in sala!', '#ffaa00');
                    this.closePhoneMenu();
                    return;
                }

                // Controlla se il giocatore ha abbastanza soldi
                if (window.GAME && window.GAME.score < this.scene.supplier.totalCost) {
                    this.scene.showFloatingText(
                        400,
                        200,
                        `💰 Non hai abbastanza soldi! (${this.scene.supplier.totalCost}€ necessari)`,
                        '#ff4444'
                    );
                    this.closePhoneMenu();
                    return;
                }

                // Spawna il pacco
                const spawned = this.scene.supplier.spawnPackage();
                if (spawned) {
                    this.scene.showFloatingText(400, 150, '📦 Fornitore in arrivo!', '#3498db');
                }
                this.closePhoneMenu();
            });

            // Pulsante Chiudi
            const btnCloseBg = this.scene.add.rectangle(0, 70, 160, 36, 0xe74c3c).setInteractive({ useHandCursor: true });
            const btnCloseTxt = this.scene.add.text(0, 70, 'Chiudi', { fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

            btnCloseBg.on('pointerdown', () => {
                this.closePhoneMenu();
            });

            this.callDialog.add([bg, title, btnFornitoreBg, btnFornitoreTxt, btnCloseBg, btnCloseTxt]);
        }

        closePhoneMenu() {
            this.isMenuOpen = false;
            if (this.callDialog) {
                this.callDialog.destroy();
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