// ============================================
// TUTORIAL SYSTEM - Versione Stabile (Sequenziale)
// ============================================

class TutorialSystem {
    constructor(scene) {
        this.scene = scene;
        this.active = true;
        this.step = 0;
        this.totalSteps = 7;
        this.arrowTarget = null;
        this.fakeCustomer = null;
        
        this.scene.tutorialActive = true;
        this.scene.gameActive = true;
        
        // Pulisce eventuali timer di spawn attivi
        if (this.scene.time) {
            this.scene.time.removeAllEvents();
        }

        this.createTutorialUI();
        this.runNextStep();
    }

    createTutorialUI() {
        this.overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.3);
        this.overlay.setDepth(150);

        this.panel = this.scene.add.rectangle(400, 460, 700, 130, 0x110906, 0.95);
        this.panel.setStrokeStyle(2, 0xd27d2d);
        this.panel.setDepth(151);

        this.titleText = this.scene.add.text(400, 405, "📖 TUTORIAL", { fontSize: '20px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(152);
        this.missionText = this.scene.add.text(400, 440, "Caricamento...", { fontSize: '18px', color: '#ffffff', align: 'center', fontFamily: 'Fredoka', wordWrap: { width: 650 } }).setOrigin(0.5).setDepth(152);
        this.hintText = this.scene.add.text(400, 475, "Premi WASD per muoverti", { fontSize: '15px', color: '#e0d5c1', align: 'center', fontStyle: 'italic', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(152);
        this.progressText = this.scene.add.text(400, 505, "1 / 7", { fontSize: '13px', color: '#7f8c8d', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(152);
    }

    runNextStep() {
        this.step++;
        if (this.step > this.totalSteps) {
            this.completeTutorial();
            return;
        }
        this.updateUI();
        this.executeStepLogic();
    }

    updateUI() {
        const steps = {
            1: { title: "🚶‍♀️ Movimento", mission: "Usa i tasti W, A, S, D per muoverti.", hint: "Cammina verso destra." },
            2: { title: "📝 Prendere l'ordine", mission: "Avvicinati al cliente e cliccaci sopra.", hint: "Clicca sul cliente seduto al tavolo 1." },
            3: { title: "🍳 In Cucina", mission: "Vai al bancone e clicca per consegnare l'ordine.", hint: "Il cuoco cucinerà in 3 secondi." },
            4: { title: "🍽️ Servire", mission: "Prendi il cibo dal bancone e clicca sul tavolo del cliente.", hint: "Porta il piatto al tavolo 1." },
            5: { title: "🧹 Pulire", mission: "Ritira il piatto sporco.", hint: "Clicca sul piatto al tavolo 1." },
            6: { title: "🚿 Lavare", mission: "Avvicinati al lavello e cliccalo.", hint: "Lava il piatto in basso a sinistra." },
            7: { title: "🎉 Tutorial Completato!", mission: "Ora sei pronta per il tuo primo vero giorno!", hint: "Clicca qui per iniziare il Giorno 1!" }
        };
        const current = steps[this.step];
        this.titleText.setText(current.title);
        this.missionText.setText(current.mission);
        this.hintText.setText(current.hint);
        this.progressText.setText(`${this.step} / ${this.totalSteps}`);
    }

    executeStepLogic() {
        this.scene.tutorialStepTarget = null;

        if (this.step === 1) {
            const startX = this.scene.waitress.x;
            const startY = this.scene.waitress.y;
            const checkMove = () => {
                if (this.step !== 1) return;
                if (Phaser.Math.Distance.Between(startX, startY, this.scene.waitress.x, this.scene.waitress.y) > 80) {
                    this.runNextStep();
                } else {
                    this.scene.time.delayedCall(200, checkMove);
                }
            };
            this.scene.time.delayedCall(200, checkMove);

        } else if (this.step === 2) {
            this.fakeCustomer = this.spawnTutorialCustomer();
            this.showArrow(this.fakeCustomer.x, this.fakeCustomer.y);
            this.scene.tutorialStepTarget = 'take_order';

        } else if (this.step === 3) {
            this.showArrow(560, 300);
            this.scene.tutorialStepTarget = 'counter';

        } else if (this.step === 4) {
            this.showArrow(this.fakeCustomer.x, this.fakeCustomer.y);
            this.scene.tutorialStepTarget = 'serve_food';

        } else if (this.step === 5) {
            this.fakeCustomer.table.status = 'piatto_sporco';
            this.fakeCustomer.isDead = true;
            if (this.fakeCustomer.emoji) this.fakeCustomer.emoji.destroy();
            
            this.fakeCustomer.table.dirtyLabel = this.scene.add.text(
                this.fakeCustomer.x, this.fakeCustomer.y + 15, '🍽️ SPORCO', 
                { fontSize: '8px', color: '#e67e22', fontStyle: 'bold', fontFamily: 'Fredoka' }
            ).setOrigin(0.5);
            this.showArrow(this.fakeCustomer.x, this.fakeCustomer.y);
            this.scene.tutorialStepTarget = 'clear_table';

        } else if (this.step === 6) {
            this.showArrow(135, 540);
            this.scene.tutorialStepTarget = 'wash_sink';

        } else if (this.step === 7) {
            // L'utente deve cliccare sul pannello per iniziare
            const clickHandler = () => {
                if (this.active) {
                    this.active = false;
                    this.overlay.off('pointerdown', clickHandler);
                    this.panel.off('pointerdown', clickHandler);
                    this.completeTutorial();
                }
            };
            this.overlay.setInteractive({ useHandCursor: true });
            this.panel.setInteractive({ useHandCursor: true });
            this.overlay.on('pointerdown', clickHandler);
            this.panel.on('pointerdown', clickHandler);
        }
    }

    progressStep() {
        if (this.step === 2) {
            this.hideArrow();
            this.runNextStep();
        } else if (this.step === 3) {
            this.hideArrow();
            this.scene.showFloatingText(560, 250, "👨‍🍳 Cucinando...", '#f39c12');
            this.scene.time.delayedCall(3000, () => {
                // Prendiamo il cibo UNA SOLA VOLTA
                this.scene.kitchen.pickUpFood(); 
                this.scene.waitressState.tray.push({ food: this.fakeCustomer.order });
                this.scene.updateTrayGraphics();
                this.scene.showFloatingText(560, 250, "✅ Cibo pronto!", '#2ecc71');
                this.runNextStep();
            });
        } else if (this.step === 4) {
            this.hideArrow();
            this.fakeCustomer.patience = 100;
            this.fakeCustomer.serve();
            this.runNextStep();
        } else if (this.step === 5) {
            this.hideArrow();
            this.runNextStep();
        } else if (this.step === 6) {
            this.hideArrow();
            GAME.dirtyPlates = 0;
            this.scene.updateHUD();
            this.runNextStep();
        }
    }

    spawnTutorialCustomer() {
        const table = this.scene.tables[0];
        const customer = {
            name: "Tutorial", order: "Pizza", patience: 100, bladder: 0, gender: "female",
            isDead: false, table: table, x: table.x, y: table.y, emojiChar: "🧑‍🍳",
            serve: () => { this.scene.time.delayedCall(1000, () => {}); }, 
             isInBathroom: false, timerEvent: { paused: false, remove: () => {} }
        };
        table.occupied = true; 
        table.customer = customer; 
        table.status = 'ordinazione_pronta';
        this.scene.createCustomerGraphics(customer);
        return customer;
    }

    showArrow(x, y) {
        if (this.arrowTarget) this.arrowTarget.destroy();
        this.arrowTarget = this.scene.add.text(x, y - 60, '⬇️', { fontSize: '40px', color: '#ffd700' }).setDepth(200).setOrigin(0.5);
        this.scene.tweens.add({ targets: this.arrowTarget, y: y - 80, duration: 500, yoyo: true, repeat: -1 });
    }

    hideArrow() { if (this.arrowTarget) { this.arrowTarget.destroy(); this.arrowTarget = null; } }
    completeTutorial() {
        this.hideArrow(); 
        this.overlay.destroy(); 
        this.panel.destroy();
        this.titleText.destroy(); 
        this.missionText.destroy();
        this.hintText.destroy(); 
        this.progressText.destroy();
        if (this.fakeCustomer) this.scene.removeCustomer(this.fakeCustomer);

        this.scene.tutorialStepTarget = null;
        this.scene.tutorialActive = false;

        // --- SALVATAGGIO DEI DATI INIZIALI ---
        const saveData = {
            score: 0,
            level: 1,
            customersServed: 0,
            lives: 3,
            dirtyPlates: 0,
            settings: GAME.settings || { soundEnabled: true, difficulty: 'normale', controls: 'wasd' },
            housePurchased: []
        };
        
        if (window.SaveManager && typeof window.SaveManager.saveGame === 'function') {
            window.SaveManager.saveGame(saveData).then(() => {
                console.log("💾 Gioco del tutorial salvato con successo!");
            }).catch(err => {
                console.error("Errore salvataggio tutorial:", err);
            });
        }
        // ----------------------------------

        this.scene.showFloatingText(400, 300, "🎉 Torna al Menu e inizia il Giorno 1!", '#2ecc71');
        this.scene.scene.start('Menu');
    }
}

window.TutorialSystem = TutorialSystem;