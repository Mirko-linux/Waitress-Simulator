// phone.js - Sistema Telefono con Emergenze (Tecnico e Pompieri)

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

        this.loadBoyfriendData();
        if (this.boyfriendAffection === null) {
            this.boyfriendAffection = 100;
            this.boyfriendName = 'Marco';
        }

        this.phoneX = 598;
        this.phoneY = 380;

        this.createPhoneGraphics();
        this.setupAudio();
    }

    loadBoyfriendData() {
        const saved = localStorage.getItem('waitress_boyfriend_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.boyfriendAffection = data.affection;
                this.boyfriendName = data.name || 'Marco';
            } catch(e) {
                this.boyfriendAffection = 100;
                this.boyfriendName = 'Marco';
            }
        } else {
            this.boyfriendAffection = 100;
            this.boyfriendName = 'Marco';
        }
    }

    saveBoyfriendData() {
        localStorage.setItem('waitress_boyfriend_data', JSON.stringify({
            affection: this.boyfriendAffection,
            name: this.boyfriendName
        }));
    }

    createPhoneGraphics() {
        const scene = this.scene;

        this.bg = scene.add.circle(this.phoneX, this.phoneY, 22, 0x000000, 0.8).setDepth(20);
        this.bg.setStrokeStyle(2, 0xd27d2d);

        if (scene.textures.exists('phone')) {
            this.phoneSprite = scene.add.image(this.phoneX, this.phoneY, 'phone').setDepth(21);
            this.phoneSprite.setDisplaySize(36, 36); 
        } else {
            this.phoneSprite = scene.add.text(this.phoneX, this.phoneY, '📞', {
                fontSize: '32px'
            }).setOrigin(0.5).setDepth(21);
        }

        this.phoneSprite.setInteractive({ useHandCursor: true });
        this.phoneSprite.on('pointerdown', () => { this.onPhoneClick(); });

        this.idleGlow = scene.add.graphics().setDepth(19);
        this.idleGlow.fillStyle(0xd27d2d, 0.2);
        this.idleGlow.fillCircle(this.phoneX, this.phoneY, 26);
        scene.tweens.add({
            targets: this.idleGlow, alpha: 0.2, duration: 1500, yoyo: true, repeat: -1
        });

        this.ringIndicator = scene.add.circle(this.phoneX + 20, this.phoneY - 20, 10, 0xe74c3c, 1).setDepth(22);
        this.ringIndicator.setVisible(false);
        scene.tweens.add({
            targets: this.ringIndicator, scaleX: 1.4, scaleY: 1.4, duration: 400, yoyo: true, repeat: -1, paused: true 
        });
    }

    setupAudio() {
        if (this.scene.cache.audio.exists('vibrazione')) {
            this.vibrationSound = this.scene.sound.add('vibrazione');
        }
    }

    update(time, delta) {
        if (window.GAME && window.GAME.level <= 1) return;
        if (!this.scene.gameActive || this.isActive) return;
        if (this.callCooldown > 0) { this.callCooldown -= delta; return; }

        // Chiamate casuali (pubblicità o fidanzato)
        if (Phaser.Math.Between(0, 200) === 0) {
            this.triggerCall();
        }
    }

    // --- CHIAMATE DI EMERGENZA ATTIVATE DALLA CUCINA ---
    triggerEmergency(type, station) {
        if (this.isRinging) return;
        
        this.isRinging = true;
        this.ringIndicator.setVisible(true);
        this.idleGlow.setVisible(false);
        const tween = this.scene.tweens.getTweensOf(this.ringIndicator)[0];
        if (tween) tween.paused = false;
        if (this.vibrationSound) this.vibrationSound.play();

        this.currentCallData = {
            type: type,
            station: station,
            timer: this.scene.time.delayedCall(15000, () => { this.missedEmergency(); })
        };
        
        this.scene.showFloatingText(this.phoneX, this.phoneY - 45, 
            type === 'fire' ? '🔥 INCENDIO! CHIAMA I POMPIERI!' : '🔧 MACCHINARIO ROTTO! CHIAMA IL TECNICO!', 
            type === 'fire' ? '#ff0000' : '#e74c3c'
        );
    }

    missedEmergency() {
        if (!this.isRinging) return;
        this.isRinging = false;
        this.ringIndicator.setVisible(false);
        this.idleGlow.setVisible(true);
        if (this.vibrationSound) this.vibrationSound.stop();

        // PENALITÀ PER OMISSIONE DI SOCCORSO
        const penalty = this.currentCallData.type === 'fire' ? 300 : 100;
        window.GAME.score = Math.max(0, window.GAME.score - penalty);
        this.scene.showFloatingText(400, 300, `🚨 Omissione di soccorso! -${penalty}€`, '#ff0000');
        
        // L'elettrodomestico rimane rotto/in fiamme (non viene riparato)
        this.isActive = false;
        this.callCooldown = 20000;
    }

    triggerCall() {
        if (this.isRinging) return;
        this.isRinging = true;
        this.ringIndicator.setVisible(true);
        this.idleGlow.setVisible(false);
        const tween = this.scene.tweens.getTweensOf(this.ringIndicator)[0];
        if (tween) tween.paused = false;
        if (this.vibrationSound) this.vibrationSound.play();

        const types = ['boyfriend', 'advertisement'];
        const weights = [40, 60];
        let random = Phaser.Math.Between(1, 100);
        let cumulative = 0;
        let selectedType = 'advertisement';
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) { selectedType = types[i]; break; }
        }

        this.currentCallData = {
            type: selectedType,
            timer: this.scene.time.delayedCall(8000, () => { this.missedCall(); })
        };
        this.scene.showFloatingText(this.phoneX, this.phoneY - 45, '📱 CHIAMATA IN ARRIVO!', '#e74c3c');
        
        this.scene.customers.forEach(c => {
            if (!c.isDead && c.patience > 0) c.patience = Math.max(0, c.patience - 3);
        });
    }

    onPhoneClick() {
        if (!this.isRinging) {
            this.scene.showFloatingText(this.phoneX, this.phoneY - 45, '📞 Nessuna chiamata', '#999');
            return;
        }

        this.isRinging = false;
        if (this.currentCallData && this.currentCallData.timer) this.currentCallData.timer.remove();
        this.ringIndicator.setVisible(false);
        this.idleGlow.setVisible(true);
        if (this.vibrationSound) this.vibrationSound.stop();

        this.isActive = true;
        this.handleCallLogic(this.currentCallData);
    }

    missedCall() {
        if (!this.isRinging) return;
        this.isRinging = false;
        this.ringIndicator.setVisible(false);
        this.idleGlow.setVisible(true);
        if (this.vibrationSound) this.vibrationSound.stop();

        if (this.currentCallData.type === 'boyfriend') {
            this.boyfriendAffection -= 15;
            this.saveBoyfriendData();
            this.scene.showFloatingText(this.phoneX, this.phoneY - 45, `💔 ${this.boyfriendName} è deluso! (Sintonia -15)`, '#ff4444');
            if (this.boyfriendAffection <= 0) this.boyfriendBreakup();
        }
    }

    handleCallLogic(callData) {
        if (callData.type === 'boyfriend') this.showBoyfriendUI();
        else if (callData.type === 'advertisement') this.showAdUI();
        else if (callData.type === 'fire') this.showFireUI(callData.station);
        else if (callData.type === 'technician') this.showTechnicianUI(callData.station);
    }

    // --- UI FISSA A SCHERMO INTERO ---
    hidePhoneElements() {
        this.phoneSprite.setVisible(false);
        this.idleGlow.setVisible(false);
        this.ringIndicator.setVisible(false);
        this.bg.setVisible(false);
    }
    showPhoneElements() {
        this.phoneSprite.setVisible(true);
        this.idleGlow.setVisible(true);
        this.ringIndicator.setVisible(false);
        this.bg.setVisible(true);
    }

    // --- 1. EMERGENZA TECNICO ---
    showTechnicianUI(station) {
        this.hidePhoneElements();
        const text = `🔧 Un elettrodomestico si è rotto!\nChiama il tecnico (10€) o ignora (penalità 100€)`;
        const options = [
            { text: '✅ Chiama il tecnico (10€)', value: 'call_tech' },
            { text: '❌ Ignora (penalità 100€)', value: 'ignore' }
        ];
        this.showChoiceUI(text, options, (choice) => {
            this.showPhoneElements();
            if (choice === 'call_tech') {
                window.GAME.score -= 10;
                this.scene.showFloatingText(400, 300, '🔧 Tecnico in arrivo! -10€', '#f1c40f');
                // Ripara la stazione
                if (this.scene.kitchen) {
                    this.scene.kitchen.repairStation(station);
                }
            } else {
                window.GAME.score = Math.max(0, window.GAME.score - 100);
                this.scene.showFloatingText(400, 300, '🚨 Penale omissione soccorso -100€', '#ff0000');
                // La stazione rimane rotta
            }
            this.isActive = false;
            this.callCooldown = 15000;
        });
    }

    // --- 2. EMERGENZA POMPIERI ---
    showFireUI(station) {
        this.hidePhoneElements();
        const text = `🔥 INCENDIO IN CUCINA!\nChiama i pompieri (30€) o ignora (penalità 300€)`;
        const options = [
            { text: '🔥 Chiama i pompieri (30€)', value: 'call_fire' },
            { text: '❌ Ignora (penalità 300€)', value: 'ignore' }
        ];
        this.showChoiceUI(text, options, (choice) => {
            this.showPhoneElements();
            if (choice === 'call_fire') {
                window.GAME.score -= 30;
                this.scene.showFloatingText(400, 300, '🚒 Pompieri in arrivo! -30€', '#f1c40f');
                if (this.scene.kitchen) {
                    this.scene.kitchen.repairStation(station);
                }
            } else {
                window.GAME.score = Math.max(0, window.GAME.score - 300);
                this.scene.showFloatingText(400, 300, '🚨 Penale omissione soccorso -300€', '#ff0000');
            }
            this.isActive = false;
            this.callCooldown = 20000;
        });
    }

    // --- 3. FIDANZATO ---
    showBoyfriendUI() {
        this.hidePhoneElements();
        const text = `📱 ${this.boyfriendName} sta chiamando!\n(Sintonia: ${this.boyfriendAffection}%)`;
        const options = [
            { text: '❤️ "Amore, ti penso sempre!"', value: 10 },
            { text: '😅 "Scusa amore, sono al lavoro!"', value: 5 },
            { text: '😒 "Ora non posso, ti richiamo."', value: -5 },
            { text: '🤬 "Smettila di chiamare!"', value: -20 }
        ];
        this.showChoiceUI(text, options, (affectionChange) => {
            this.showPhoneElements();
            this.boyfriendAffection = Phaser.Math.Clamp(this.boyfriendAffection + affectionChange, 0, 100);
            this.saveBoyfriendData();
            this.scene.showFloatingText(this.phoneX, this.phoneY - 45, 
                affectionChange > 0 ? `❤️ Sintonia +${affectionChange}%` : `💔 Sintonia ${affectionChange}%`, 
                affectionChange > 0 ? '#2ecc71' : '#e74c3c'
            );
            if (this.boyfriendAffection <= 0) this.boyfriendBreakup();
            this.isActive = false;
            this.callCooldown = 15000;
        });
    }

    // --- 4. PUBBLICITÀ (TTS) ---
    showAdUI() {
        this.hidePhoneElements();
        const adMessages = [
            "📞 Pubblicità: 'Vinci una cucina nuova! Rispondi per partecipare.'",
            "📞 Pubblicità: 'Solo oggi! Lavastoviglie SuperLava in offerta.'",
            "📞 Pubblicità: 'Il tuo ristorante potrebbe essere nella guida! Ascolta questa offerta.'",
            "📞 Pubblicità: 'Vendi il tuo oro? Chiama per una valutazione!'"
        ];
        const text = adMessages[Phaser.Math.Between(0, adMessages.length - 1)];
        // --- QUI PUOI SOSTITUIRE CON CHIAMATA TTS ---
        // const tts = new SpeechSynthesisUtterance(text);
        // window.speechSynthesis.speak(tts);
        // ----------------------------------------------------
        this.showTimerUI(text, 10000, () => {
            this.showPhoneElements();
            this.isActive = false;
            this.callCooldown = 10000;
            this.scene.showFloatingText(this.phoneX, this.phoneY - 45, '📞 Pubblicità finita. Hai perso tempo!', '#999');
        });
    }

    // --- UI COMPONENTI ---
    showChoiceUI(text, options, callback) {
        if (this.uiContainer) this.uiContainer.destroy();
        this.uiContainer = this.scene.add.container(400, 300).setDepth(400).setScrollFactor(0);
        this.overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.75).setDepth(399).setScrollFactor(0);
        this.overlay.setInteractive();

        const bg = this.scene.add.rectangle(0, 0, 440, 320, 0x110906, 0.95).setStrokeStyle(2, 0xd27d2d);
        const title = this.scene.add.text(0, -120, text, {
            fontSize: '18px', color: '#ffffff', fontFamily: 'Fredoka', align: 'center', wordWrap: { width: 400 }
        }).setOrigin(0.5);
        this.uiContainer.add([bg, title]);

        let yPos = -40;
        options.forEach((opt) => {
            const btn = this.scene.add.rectangle(0, yPos, 380, 40, 0x2c1a11).setStrokeStyle(1, 0xd27d2d);
            const txt = this.scene.add.text(0, yPos, opt.text, {
                fontSize: '14px', color: '#e0d5c1', fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            btn.setInteractive({ useHandCursor: true });
            btn.on('pointerover', () => btn.setFillStyle(0x3d2518));
            btn.on('pointerout', () => btn.setFillStyle(0x2c1a11));
            btn.on('pointerdown', () => {
                this.uiContainer.destroy();
                this.uiContainer = null;
                this.overlay.destroy();
                if (typeof opt.value !== 'undefined') callback(opt.value);
                else callback(opt);
            });
            this.uiContainer.add([btn, txt]);
            yPos += 60;
        });
    }

    showTimerUI(text, duration, callback) {
        if (this.uiContainer) this.uiContainer.destroy();
        this.uiContainer = this.scene.add.container(400, 300).setDepth(400).setScrollFactor(0);
        this.overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.75).setDepth(399).setScrollFactor(0);
        this.overlay.setInteractive();

        const bg = this.scene.add.rectangle(0, 0, 440, 160, 0x110906, 0.95).setStrokeStyle(2, 0xd27d2d);
        const title = this.scene.add.text(0, -30, text, {
            fontSize: '16px', color: '#ffffff', fontFamily: 'Fredoka', align: 'center', wordWrap: { width: 400 }
        }).setOrigin(0.5);
        const timerText = this.scene.add.text(0, 30, '⏳ Attendere...', {
            fontSize: '18px', color: '#ffd700', fontFamily: 'Fredoka'
        }).setOrigin(0.5);
        this.uiContainer.add([bg, title, timerText]);

        let remaining = duration / 1000;
        const timerInterval = this.scene.time.addEvent({
            delay: 100, callback: () => {
                remaining -= 0.1;
                timerText.setText(`⏳ ${remaining.toFixed(1)}s`);
                if (remaining <= 0) {
                    timerInterval.remove();
                    this.uiContainer.destroy();
                    this.uiContainer = null;
                    this.overlay.destroy();
                    callback();
                }
            }, loop: true
        });
    }

    boyfriendBreakup() {
        this.isActive = false;
        this.scene.gameActive = false;
        this.scene.showFloatingText(400, 300, '💔 HAI ROTTO CON IL FIDANZATO! 💔', '#ff0000');
        this.scene.time.delayedCall(3000, () => { this.scene.scene.start('GameOver'); });
    }
}

window.PhoneSystem = PhoneSystem;