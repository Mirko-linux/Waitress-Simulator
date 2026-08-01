// ============================================
// PHONE SYSTEM - Telefono finalmente visibile
// ============================================
class PhoneSystem {
    constructor(scene) {
        this.scene = scene;
        this.isRinging = false;
        this.isActive = false;
        this.callCooldown = 0;
        this.callTimer = null;
        this.currentCallData = null;
        this.uiContainer = null;
        this.vibrationSound = null;

        this.boyfriendAffection = 100;
        this.boyfriendName = 'Marco';

        // POSIZIONE: Sopra il muro, a fianco del cartello "PASS PIATTI"
        this.phoneX = 585;
        this.phoneY = 320;

        this.createPhoneGraphics();
        this.setupAudio();
    }

    createPhoneGraphics() {
        const scene = this.scene;

        // 1. BASE DEL TELEFONO
        const bg = scene.add.circle(this.phoneX, this.phoneY, 22, 0x000000, 0.8).setDepth(20);
        bg.setStrokeStyle(2, 0xd27d2d);

        // 2. IL TELEFONO
        if (scene.textures.exists('phone')) {
            this.phoneSprite = scene.add.image(this.phoneX, this.phoneY, 'phone').setDepth(21);
            this.phoneSprite.setDisplaySize(36, 36); 
        } else {
            this.phoneSprite = scene.add.text(this.phoneX, this.phoneY, '📞', {
                fontSize: '32px'
            }).setOrigin(0.5).setDepth(21);
        }

        // Rendi interattivo
        this.phoneSprite.setInteractive({ useHandCursor: true });
        this.phoneSprite.on('pointerdown', () => {
            this.onPhoneClick();
        });

        // Effetto bagliore
        this.idleGlow = scene.add.graphics().setDepth(19);
        this.idleGlow.fillStyle(0xd27d2d, 0.2);
        this.idleGlow.fillCircle(this.phoneX, this.phoneY, 26);
        
        scene.tweens.add({
            targets: this.idleGlow,
            alpha: 0.2,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Indicatore di chiamata
        this.ringIndicator = scene.add.circle(this.phoneX + 20, this.phoneY - 20, 10, 0xe74c3c, 1).setDepth(22);
        this.ringIndicator.setVisible(false);

        scene.tweens.add({
            targets: this.ringIndicator,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 400,
            yoyo: true,
            repeat: -1,
            paused: true 
        });
    }

    setupAudio() {
        if (!this.scene.cache.audio.exists('vibrazione')) {
            this.scene.load.audio('vibrazione', 'assets/audio/vibrazione.wav');
            this.scene.load.once('complete', () => {
                this.vibrationSound = this.scene.sound.add('vibrazione');
            });
            this.scene.load.start();
        } else {
            this.vibrationSound = this.scene.sound.add('vibrazione');
        }
    }

    update(time, delta) {
        // --- CORREZIONE QUI: usa this.scene.gameActive ---
        if (!this.scene.gameActive || this.isActive) return;

        if (this.callCooldown > 0) {
            this.callCooldown -= delta;
            return;
        }

        if (Phaser.Math.Between(0, 200) === 0) {
            this.triggerCall();
        }
    }

    triggerCall() {
        if (this.isRinging) return;

        this.isRinging = true;
        this.ringIndicator.setVisible(true);
        this.idleGlow.setVisible(false);

        const tween = this.scene.tweens.getTweensOf(this.ringIndicator)[0];
        if (tween) tween.paused = false;

        if (this.vibrationSound) {
            this.vibrationSound.play();
        }

        const types = ['boyfriend', 'advertisement', 'machine_break'];
        const weights = [30, 40, 30]; 
        let random = Phaser.Math.Between(1, 100);
        let cumulative = 0;
        let selectedType = 'advertisement';

        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                selectedType = types[i];
                break;
            }
        }

        this.currentCallData = {
            type: selectedType,
            timer: this.scene.time.delayedCall(8000, () => {
                this.missedCall();
            })
        };
        
        this.scene.showFloatingText(this.phoneX, this.phoneY - 45, '📱 CHIAMATA!', '#e74c3c');
    }

    onPhoneClick() {
        if (!this.isRinging) {
            this.scene.showFloatingText(this.phoneX, this.phoneY - 45, '📞 Nessuna chiamata', '#999');
            return;
        }

        this.isRinging = false;
        if (this.currentCallData && this.currentCallData.timer) {
            this.currentCallData.timer.remove();
        }
        this.ringIndicator.setVisible(false);
        this.idleGlow.setVisible(true);
        if (this.vibrationSound) {
            this.vibrationSound.stop();
        }

        this.isActive = true;
        this.handleCallLogic(this.currentCallData);
    }

    missedCall() {
        if (!this.isRinging) return;

        this.isRinging = false;
        this.ringIndicator.setVisible(false);
        this.idleGlow.setVisible(true);
        
        if (this.currentCallData.type === 'boyfriend') {
            this.boyfriendAffection -= 15;
            this.scene.showFloatingText(this.phoneX, this.phoneY - 45, `💔 ${this.boyfriendName} è deluso!`, '#ff4444');
            if (this.boyfriendAffection <= 0) this.boyfriendBreakup();
        } else if (this.currentCallData.type === 'machine_break') {
            this.scene.showFloatingText(this.phoneX, this.phoneY - 45, '🔧 Macchinario rotto!', '#f39c12');
            this.scene.gameActive = false;
            this.scene.time.delayedCall(3000, () => { this.scene.gameActive = true; });
        }
    }

    handleCallLogic(callData) {
        if (callData.type === 'boyfriend') this.showBoyfriendUI();
        else if (callData.type === 'advertisement') this.showAdUI();
        else if (callData.type === 'machine_break') this.showMachineRepairUI();
    }

    showBoyfriendUI() {
        const text = `📱 ${this.boyfriendName} sta chiamando! Cosa gli dici?`;
        const options = [
            { text: '❤️ "Amore, ti penso sempre!" (+10)', value: 10 },
            { text: '😅 "Scusa amore, sono al lavoro!" (+5)', value: 5 },
            { text: '😒 "Ora non posso, ti richiamo." (-5)', value: -5 },
            { text: '🤬 "Smettila di chiamare!" (-20)', value: -20 }
        ];
        this.showChoiceUI(text, options, (affectionChange) => {
            this.boyfriendAffection += affectionChange;
            this.scene.showFloatingText(this.phoneX, this.phoneY - 45, 
                affectionChange > 0 ? `❤️ +${affectionChange} Affetto` : `💔 ${affectionChange} Affetto`, 
                affectionChange > 0 ? '#2ecc71' : '#e74c3c'
            );
            if (this.boyfriendAffection <= 0) this.boyfriendBreakup();
            this.isActive = false;
            this.callCooldown = 15000;
        });
    }

    boyfriendBreakup() {
        this.isActive = false;
        this.scene.gameActive = false;
        this.scene.showFloatingText(400, 300, '💔 HAI ROTTO CON IL FIDANZATO! 💔', '#ff0000');
        this.scene.time.delayedCall(3000, () => { this.scene.scene.start('GameOver'); });
    }

    showAdUI() {
        const text = `📞 Pubblicità: "Super offerta lavastoviglie!"\nDevi ascoltare per 4 secondi.`;
        this.showTimerUI(text, 4000, () => {
            this.isActive = false;
            this.callCooldown = 10000;
        });
    }

    showMachineRepairUI() {
        const text = `🔧 Allarme! Un macchinario si è rotto!\nVuoi chiamare il tecnico?`;
        const options = [
            { text: '✅ Chiama il tecnico (10€, riparazione immediata)', value: 'call_tech' },
            { text: '❌ Ripara da sola (risparmi ma perdi tempo)', value: 'self_fix' }
        ];
        this.showChoiceUI(text, options, (choice) => {
            if (choice === 'call_tech') {
                this.scene.GAME.score -= 10;
                this.scene.showFloatingText(400, 300, '🔧 Tecnico in arrivo! -10€', '#f1c40f');
            } else {
                this.scene.showFloatingText(400, 300, '⏳ Riparazione manuale in corso...', '#f39c12');
                this.scene.gameActive = false;
                this.scene.time.delayedCall(3000, () => { this.scene.gameActive = true; });
            }
            this.isActive = false;
            this.callCooldown = 12000;
        });
    }

    showChoiceUI(text, options, callback) {
        if (this.uiContainer) this.uiContainer.destroy();
        this.uiContainer = this.scene.add.container(400, 250);
        const bg = this.scene.add.rectangle(0, 0, 480, 280, 0x110906, 0.95).setStrokeStyle(2, 0xd27d2d);
        const title = this.scene.add.text(0, -100, text, {
            fontSize: '16px', color: '#ffffff', fontFamily: 'Fredoka', align: 'center', wordWrap: { width: 420 }
        }).setOrigin(0.5);
        this.uiContainer.add([bg, title]);

        let yPos = -40;
        options.forEach((opt, index) => {
            const btn = this.scene.add.rectangle(0, yPos, 380, 35, 0x2c1a11).setStrokeStyle(1, 0xd27d2d);
            const txt = this.scene.add.text(0, yPos, opt.text, {
                fontSize: '13px', color: '#e0d5c1', fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            btn.setInteractive({ useHandCursor: true });
            btn.on('pointerover', () => btn.setFillStyle(0x3d2518));
            btn.on('pointerout', () => btn.setFillStyle(0x2c1a11));
            btn.on('pointerdown', () => {
                this.uiContainer.destroy();
                this.uiContainer = null;
                if (typeof opt.value !== 'undefined') callback(opt.value);
                else callback(opt);
            });
            this.uiContainer.add([btn, txt]);
            yPos += 55;
        });
    }

    showTimerUI(text, duration, callback) {
        if (this.uiContainer) this.uiContainer.destroy();
        this.uiContainer = this.scene.add.container(400, 250);
        const bg = this.scene.add.rectangle(0, 0, 400, 150, 0x110906, 0.95).setStrokeStyle(2, 0xd27d2d);
        const title = this.scene.add.text(0, -30, text, {
            fontSize: '15px', color: '#ffffff', fontFamily: 'Fredoka', align: 'center', wordWrap: { width: 350 }
        }).setOrigin(0.5);
        const timerText = this.scene.add.text(0, 15, '⏳ Attendere...', {
            fontSize: '14px', color: '#ffd700', fontFamily: 'Fredoka'
        }).setOrigin(0.5);
        this.uiContainer.add([bg, title, timerText]);

        let remaining = duration / 1000;
        const timerInterval = this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                remaining -= 0.1;
                timerText.setText(`⏳ ${remaining.toFixed(1)}s`);
                if (remaining <= 0) {
                    timerInterval.remove();
                    this.uiContainer.destroy();
                    this.uiContainer = null;
                    callback();
                }
            },
            loop: true
        });
    }
}