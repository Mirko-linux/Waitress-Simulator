// ============================================
// PHONE SYSTEM - Chiamate, Fidanzato & Guasti
// ============================================
class PhoneSystem {
    constructor(scene) {
        this.scene = scene;
        this.isRinging = false;
        this.isActive = false; // Se il giocatore sta guardando il telefono
        this.callCooldown = 0;
        this.callTimer = null;
        this.currentCallData = null;
        this.uiContainer = null;
        this.vibrationSound = null;

        // Variabili del Fidanzato
        this.boyfriendAffection = 100;
        this.boyfriendName = 'Marco'; // Nome del fidanzato

        // Posizione del telefono (Vicino al bancone pass piatti, lato cucina)
        // Dalla tua mappa, il bancone è a X=595. Mettiamo il telefono a destra del muro
        this.phoneX = 635;
        this.phoneY = 410;

        this.createPhoneGraphics();
        this.setupAudio();
    }

    createPhoneGraphics() {
        const scene = this.scene;

        // 1. DISEGNA IL TELEFONO (USANDO IL PNG CHE HAI)
        // Usa 'phone.png' che hai in assets/Cucina
        if (scene.textures.exists('phone')) {
            this.phoneSprite = scene.add.image(this.phoneX, this.phoneY, 'phone').setDepth(6);
            this.phoneSprite.setDisplaySize(40, 40); // Adatta la dimensione
        } else {
            // Fallback se il PNG non c'è
            this.phoneSprite = scene.add.text(this.phoneX, this.phoneY, '📞', {
                fontSize: '30px'
            }).setOrigin(0.5).setDepth(6);
        }

        // Rendilo cliccabile
        this.phoneSprite.setInteractive({ useHandCursor: true });
        this.phoneSprite.on('pointerdown', () => {
            this.onPhoneClick();
        });

        // 2. ANELLO DI NOTIFICA (VIBRAZIONE)
        this.ringIndicator = scene.add.circle(this.phoneX + 25, this.phoneY - 25, 12, 0xe74c3c, 0.8).setDepth(7);
        this.ringIndicator.setVisible(false);

        // Aggiungiamo un effetto "pulsante" alla notifica
        scene.tweens.add({
            targets: this.ringIndicator,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 400,
            yoyo: true,
            repeat: -1,
            paused: true // In pausa finché non suona
        });
    }

    setupAudio() {
        // Carica il suono della vibrazione (se il caricamento è già stato fatto nel game, usa quello)
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

    // --------------------------------------------
    // GESTIONE CHIAMATE (Da chiamare ogni frame)
    // --------------------------------------------
    update(time, delta) {
        // Se il gioco non è attivo o il telefono è già in uso, non fare nulla
        if (!this.scene.gameActive || this.isActive) return;

        // Gestione cooldown (non chiamare troppo spesso)
        if (this.callCooldown > 0) {
            this.callCooldown -= delta;
            return;
        }

        // Ogni 10-15 secondi, c'è una piccola probabilità che suoni
        if (Phaser.Math.Between(0, 500) === 0) {
            this.triggerCall();
        }
    }

    triggerCall() {
        // Se sta già suonando, non sovrapporre
        if (this.isRinging) return;

        this.isRinging = true;
        this.ringIndicator.setVisible(true);
        this.scene.tweens.getTweensOf(this.ringIndicator)[0].paused = false; // Riprendi l'animazione

        // Riproduci vibrazione
        if (this.vibrationSound) {
            this.vibrationSound.play();
        }

        // Determina il tipo di chiamata
        const types = ['boyfriend', 'advertisement', 'machine_break'];
        // Più probabilità di pubblicità (40%), Fidanzato (30%), Guasto (30%)
        const weights = [30, 40, 30]; 
        let cumulative = 0;
        let random = Phaser.Math.Between(1, 100);
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
                // Se passano 8 secondi e il giocatore non clicca
                this.missedCall();
            })
        };
    }

    // --------------------------------------------
    // INTERAZIONE GIOCATORE
    // --------------------------------------------
    onPhoneClick() {
        if (!this.isRinging) {
            this.scene.showFloatingText(this.phoneX, this.phoneY - 40, '📞 Nessuna chiamata', '#999');
            return;
        }

        // Ferma il timer di attesa e la vibrazione
        this.isRinging = false;
        if (this.currentCallData && this.currentCallData.timer) {
            this.currentCallData.timer.remove();
        }
        this.ringIndicator.setVisible(false);
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
        
        if (this.currentCallData.type === 'boyfriend') {
            this.boyfriendAffection -= 15; // Perde 15 punti per aver ignorato il fidanzato
            this.scene.showFloatingText(this.phoneX, this.phoneY - 40, `💔 ${this.boyfriendName} è deluso!`, '#ff4444');
            
            if (this.boyfriendAffection <= 0) {
                this.boyfriendBreakup();
            }
        } else if (this.currentCallData.type === 'advertisement') {
            // Niente, era solo spam
            this.scene.showFloatingText(this.phoneX, this.phoneY - 40, '📞 Chiamata spam ignorata.', '#999');
        } else if (this.currentCallData.type === 'machine_break') {
            // Il macchinario si è rotto, ma la cameriera non ha risposto. 
            // Penalità: il macchinario rimane rotto per 10 secondi in più.
            if (this.scene.kitchen) {
                this.scene.kitchen.addBrokenPenalty(10000);
            }
        }
    }

    // --------------------------------------------
    // LOGICA CHIAMATA (UI e Scelte)
    // --------------------------------------------
    handleCallLogic(callData) {
        if (callData.type === 'boyfriend') {
            this.showBoyfriendUI();
        } else if (callData.type === 'advertisement') {
            this.showAdUI();
        } else if (callData.type === 'machine_break') {
            this.showMachineRepairUI();
        }
    }

    // --- FIDANZATO ---
    showBoyfriendUI() {
        // Messaggio di base
        const text = `📱 ${this.boyfriendName} sta chiamando! Cosa gli dici?`;
        const options = [
            { text: '❤️ "Amore, ti penso sempre!" (+10 Affetto)', value: 10 },
            { text: '😅 "Scusa amore, sono al lavoro!" (+5 Affetto)', value: 5 },
            { text: '😒 "Ora non posso, ti richiamo." (-5 Affetto)', value: -5 },
            { text: '🤬 "Smettila di chiamare mentre lavoro!" (-20 Affetto)', value: -20 }
        ];
        this.showChoiceUI(text, options, (affectionChange) => {
            this.boyfriendAffection += affectionChange;
            this.scene.showFloatingText(this.phoneX, this.phoneY - 40, 
                affectionChange > 0 ? `❤️ +${affectionChange} Affetto` : `💔 ${affectionChange} Affetto`, 
                affectionChange > 0 ? '#2ecc71' : '#e74c3c'
            );

            if (this.boyfriendAffection <= 0) {
                this.boyfriendBreakup();
            }
            this.isActive = false;
            this.callCooldown = 15000; // 15 secondi di pausa
        });
    }

    boyfriendBreakup() {
        this.isActive = false;
        this.scene.gameActive = false;
        this.scene.showFloatingText(400, 300, '💔 HAI ROTTO CON IL FIDANZATO! 💔', '#ff0000');
        // Game Over dopo 3 secondi
        this.scene.time.delayedCall(3000, () => {
            this.scene.scene.start('GameOver');
        });
    }

    // --- PUBBLICITÀ (Spam) ---
    showAdUI() {
        const text = `📞 Pubblicità: "Super offerta lavastoviglie in sconto!"\nDevi ascoltare per 4 secondi.`;
        this.showTimerUI(text, 4000, () => {
            this.isActive = false;
            this.callCooldown = 10000;
        });
    }

    // --- GUASTO MACCHINARIO ---
    showMachineRepairUI() {
        const text = `🔧 Allarme! Un macchinario in cucina si è rotto!\nVuoi chiamare il tecnico?`;
        const options = [
            { text: '✅ Chiama il tecnico (10€, riparazione immediata)', value: 'call_tech' },
            { text: '❌ Prova a ripararlo da sola (risparmi soldi, ma perdi tempo)', value: 'self_fix' }
        ];
        this.showChoiceUI(text, options, (choice) => {
            if (choice === 'call_tech') {
                this.scene.GAME.score -= 10; // Spendi 10€
                this.scene.showFloatingText(400, 300, '🔧 Tecnico in arrivo! -10€', '#f1c40f');
                if (this.scene.kitchen) {
                    this.scene.kitchen.fixAllMachines(); // Ripara tutto
                }
            } else {
                this.scene.showFloatingText(400, 300, '⏳ Riparazione manuale in corso...', '#f39c12');
                if (this.scene.kitchen) {
                    // La riparazione manuale impiega più tempo e blocca la cucina per 3 secondi
                    this.scene.kitchen.setGlobalPause(3000);
                }
            }
            this.isActive = false;
            this.callCooldown = 12000;
        });
    }

    // --------------------------------------------
    // UI GENERICA PER SCELTE E TIMER
    // --------------------------------------------
    showChoiceUI(text, options, callback) {
        // Distrugge eventuali UI precedenti
        if (this.uiContainer) this.uiContainer.destroy();

        this.uiContainer = this.scene.add.container(400, 250);
        const bg = this.scene.add.rectangle(0, 0, 480, 280, 0x110906, 0.95)
            .setStrokeStyle(2, 0xd27d2d);

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
                if (typeof opt.value !== 'undefined') {
                    callback(opt.value);
                } else {
                    callback(opt);
                }
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

        // Tween per il countdown
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