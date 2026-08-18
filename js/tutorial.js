// ============================================
// TUTORIAL SYSTEM (VERSIONE COMPLETA FIXATA)
// ============================================

class TutorialSystem {
    constructor(scene) {
        this.scene = scene;
        this.isActive = true;
        this.fakeCustomer = null;
        this.tutorialStep = 0;
        this.welcomeContainer = null; 
        this.tutorialPanel = null;
        this.arrowGraphic = null;
        this.finishTimer = null; // Timer per la chiusura automatica
        
        // Controllo per evitare che si apra due volte
        if (window._tutorialStarting) {
            console.warn("⚠️ Tutorial già in avvio, salto la creazione");
            this.skipTutorial();
            return;
        }
        window._tutorialStarting = true;

        this.createWelcomeScreen();
    }

    // --- 1. SCHERMATA DI BENVENUTO (SÌ / NO) ---
    createWelcomeScreen() {
        const scene = this.scene;

        // Sfondo nero semitrasparente (Depth altissima per coprire tutto)
        this.welcomeBg = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8).setDepth(998);

        // Pannello Principale
        this.welcomeContainer = scene.add.container(400, 300).setDepth(999);
        
        const bg = scene.add.rectangle(0, 0, 520, 320, 0x110906, 0.95);
        bg.setStrokeStyle(2, 0xd27d2d);
        
        const title = scene.add.text(0, -110, '👋 NUOVA CAMERIERA!', {
            fontSize: '28px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const desc = scene.add.text(0, -40, 'Prima di iniziare, vuoi seguire il tutorial per imparare il mestiere?', {
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'Fredoka',
            align: 'center',
            wordWrap: { width: 450 }
        }).setOrigin(0.5);

        // Bottone SÌ (Verde)
        const btnYesBg = scene.add.rectangle(-90, 60, 160, 50, 0x2ecc71).setStrokeStyle(2, 0x27ae60);
        btnYesBg.setInteractive({ useHandCursor: true });
        const btnYesTxt = scene.add.text(-90, 60, '✅ SÌ', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5);
        
        btnYesBg.on('pointerdown', () => {
            triggerSfx('click');
            this.destroyWelcomeScreen();
            this.startTutorialGameplay();
        });
        btnYesBg.on('pointerover', () => btnYesBg.setFillStyle(0x27ae60));
        btnYesBg.on('pointerout', () => btnYesBg.setFillStyle(0x2ecc71));

        // Bottone NO (Rosso)
        const btnNoBg = scene.add.rectangle(90, 60, 160, 50, 0xe74c3c).setStrokeStyle(2, 0xc0392b);
        btnNoBg.setInteractive({ useHandCursor: true });
        const btnNoTxt = scene.add.text(90, 60, '❌ NO', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        btnNoBg.on('pointerdown', () => {
            triggerSfx('click');
            this.destroyWelcomeScreen();
            this.skipTutorial();
        });
        btnNoBg.on('pointerover', () => btnNoBg.setFillStyle(0xc0392b));
        btnNoBg.on('pointerout', () => btnNoBg.setFillStyle(0xe74c3c));

        this.welcomeContainer.add([bg, title, desc, btnYesBg, btnYesTxt, btnNoBg, btnNoTxt]);
    }

    destroyWelcomeScreen() {
        if (this.welcomeBg) this.welcomeBg.destroy();
        if (this.welcomeContainer) this.welcomeContainer.destroy();
        this.welcomeBg = null;
        this.welcomeContainer = null;
        window._tutorialStarting = false;
    }

    // --- 2. SE PREMI "NO" ---
    skipTutorial() {
        localStorage.setItem('waitress_tutorial_done', 'true');
        this.scene.tutorialActive = false;
        this.scene.tutorial = null;
        window._tutorialStarting = false;
        
        if (this.tutorialPanel) this.tutorialPanel.destroy();
        if (this.arrowGraphic) this.arrowGraphic.destroy();
        if (this.finishTimer) this.finishTimer.remove();
        
        window.GAME.level = 1;
        window.GAME.customersTarget = 6 + window.GAME.level * 4;
        this.scene.gameActive = true;
        this.scene.startSpawning();
    }

    // --- 3. SE PREMI "SÌ" ---
    startTutorialGameplay() {
        this.tutorialStep = 1;
        this.scene.tutorialStepTarget = null;
        
        this.createFakeCustomer();
        this.updateTutorialPanel();
        
        this.scene.gameActive = true;
    }

    createFakeCustomer() {
        const firstTable = this.scene.tables[0];
        if (!firstTable) return;

        this.fakeCustomer = {
            name: 'Marco',
            order: 'Pizza',
            patience: 100,
            isDead: false,
            table: firstTable,
            emojiChar: '👨',
            x: firstTable.x,
            y: firstTable.y,
            relationScore: 50,
            timerEvent: { remove: () => {} },
            serve: () => {}
        };

        firstTable.occupied = true;
        firstTable.customer = this.fakeCustomer;
        firstTable.status = 'ordinazione_pronta';

        this.fakeCustomer.shadow = this.scene.add.ellipse(firstTable.x, firstTable.y + 35, 40, 10, 0x000000, 0.25);
        this.fakeCustomer.emoji = this.scene.add.text(firstTable.x, firstTable.y + 10, '👨', {
            fontSize: '36px'
        }).setOrigin(0.5).setDepth(5);
        this.fakeCustomer.orderBubble = this.scene.add.text(firstTable.x - 18, firstTable.y - 15, '📝 ?', {
            fontSize: '11px',
            color: '#ffffff',
            backgroundColor: '#110906',
            padding: { x: 4, y: 3 }
        }).setOrigin(0.5).setDepth(5);
        
        this.fakeCustomer.patienceBg = this.scene.add.rectangle(firstTable.x, firstTable.y - 28, 50, 4, 0x333333).setDepth(4);
        this.fakeCustomer.patienceBar = this.scene.add.rectangle(firstTable.x - 25, firstTable.y - 28, 50, 4, 0x2ecc71).setDepth(5);
        this.fakeCustomer.patienceBar.setOrigin(0, 0.5);
    }

    updateTutorialPanel() {
        // Pulisci elementi precedenti
        if (this.tutorialPanel) this.tutorialPanel.destroy();
        if (this.arrowGraphic) this.arrowGraphic.destroy();
        if (this.finishTimer) {
            this.finishTimer.remove();
            this.finishTimer = null;
        }

        const scene = this.scene;

        // --- STEP DEL TUTORIAL (TUTTI FIXATI) ---
        const steps = [
            {}, 
            { 
                title: '📋 PRENDI L\'ORDINE', 
                desc: 'Avvicinati al tavolo e clicca sul cliente per prendere il suo ordine.', 
                target: 'take_order' 
            },
            { 
                title: '📝 PORTA LA COMANDATA', 
                desc: 'Vai al **PASS PIATTI** e clicca per consegnare la comanda allo chef.', 
                target: 'counter' 
            },
            { 
                title: '🍕 RITIRA IL CIBO', 
                desc: 'Il cibo è pronto! Clicca sul **PASS PIATTI** per prenderlo.', 
                target: 'counter' 
            },
            { 
                title: '🍽️ SERVI IL CLIENTE', 
                desc: 'Torna al tavolo e clicca sul cliente per servirgli il pasto.', 
                target: 'serve_food' 
            },
            { 
                title: '🧹 PULISCI IL TAVOLO', 
                desc: 'Bene! Ora clicca sul tavolo per pulire il piatto sporco.', 
                target: 'clear_table' 
            },
            { 
                title: '🎉 FINE TUTORIAL!', 
                desc: 'Hai imparato tutto! Il gioco inizierà tra 2 secondi...', 
                target: 'finish' 
            }
        ];

        const current = steps[this.tutorialStep];

        // --- CREA IL PANNELLO ---
        this.tutorialPanel = scene.add.container(400, 450).setDepth(999);
        
        const bg = scene.add.rectangle(0, 0, 600, 120, 0x110906, 0.95);
        bg.setStrokeStyle(2, 0xd27d2d);

        const title = scene.add.text(0, -35, current.title || 'Tutorial', {
            fontSize: '20px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const desc = scene.add.text(0, 10, current.desc || '', {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Fredoka',
            align: 'center',
            wordWrap: { width: 550 }
        }).setOrigin(0.5);

        this.tutorialPanel.add([bg, title, desc]);

        // --- AGGIORNA TARGET PER GAME.JS ---
        if (current.target) {
            this.scene.tutorialStepTarget = current.target;
        }

        // --- DISEGNA FRECCIA (SE NON È L'ULTIMO STEP) ---
        if (current.target && this.tutorialStep < 6) {
            let targetX = 0, targetY = 0;
            
            // Gestione target per il tavolo
            if (current.target === 'take_order' || 
                current.target === 'serve_food' || 
                current.target === 'clear_table') {
                targetX = this.fakeCustomer.table.x;
                targetY = this.fakeCustomer.table.y + 32;
            } 
            // Gestione target per il PASS PIATTI (posizione fissa corretta)
            else if (current.target === 'counter') {
                targetX = 560;  // Posizione fissa del Pass Piatti
                targetY = 460;  // La punta della freccia arriverà a Y=420 (460-40)
            }
            
            this.drawArrow(targetX, targetY);
            
            // Rendi la freccia NON cliccabile
            if (this.arrowGraphic) {
                this.arrowGraphic.setInteractive(false);
                this.arrowGraphic.disableInteractive();
            }
        }

        // --- SE È L'ULTIMO STEP, AVVIA IL TIMER PER LA CHIUSURA AUTOMATICA ---
        if (this.tutorialStep === 6) {
            this.finishTimer = this.scene.time.delayedCall(2000, () => {
                this.finishTutorial();
            });
        }
    }

    // METODO drawArrow() AGGIORNATO
    drawArrow(x, y) {
        if (this.arrowGraphic) this.arrowGraphic.destroy();
        
        // Profondità 15: SOPRA il cliente (depth 5), SOTTO il pannello (depth 999)
        this.arrowGraphic = this.scene.add.graphics().setDepth(15);
        
        this.arrowGraphic.fillStyle(0xffd700, 1);
        this.arrowGraphic.fillTriangle(x - 12, y - 70, x + 12, y - 70, x, y - 40);
        this.arrowGraphic.fillRect(x - 2, y - 90, 4, 30);
        
        // Animazione di sfarfallio
        this.scene.tweens.add({
            targets: this.arrowGraphic,
            alpha: 0.6,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    // --- AVANZA AL PROSSIMO STEP ---
    progressStep() {
        if (this.tutorialStep >= 6) {
            // Se per qualche motivo siamo già allo step 6, chiudi direttamente
            this.finishTutorial();
            return;
        }
        this.tutorialStep++;
        this.updateTutorialPanel();
    }

    // --- COMPLETA IL TUTORIAL E AVVIA IL GIOCO ---
    finishTutorial() {
        // Pulisci timer
        if (this.finishTimer) {
            this.finishTimer.remove();
            this.finishTimer = null;
        }

        this.scene.tutorialActive = false;
        this.scene.tutorial = null;
        this.scene.tutorialStepTarget = null;
        window._tutorialStarting = false;
        
        localStorage.setItem('waitress_tutorial_done', 'true');
        
        // Distruggi pannello e freccia
        if (this.tutorialPanel) this.tutorialPanel.destroy();
        if (this.arrowGraphic) this.arrowGraphic.destroy();
        
        // Rimuovi il cliente fittizio
        if (this.fakeCustomer) {
            if (this.fakeCustomer.emoji) this.fakeCustomer.emoji.destroy();
            if (this.fakeCustomer.shadow) this.fakeCustomer.shadow.destroy();
            if (this.fakeCustomer.orderBubble) this.fakeCustomer.orderBubble.destroy();
            if (this.fakeCustomer.patienceBg) this.fakeCustomer.patienceBg.destroy();
            if (this.fakeCustomer.patienceBar) this.fakeCustomer.patienceBar.destroy();
            this.fakeCustomer.table.occupied = false;
            this.fakeCustomer.table.customer = null;
            this.fakeCustomer.table.status = 'libero';
            this.fakeCustomer = null;
        }

        // Avvia il gioco
        window.GAME.level = 1;
        window.GAME.customersTarget = 6 + window.GAME.level * 4;
        
        this.scene.gameActive = true;
        this.scene.startSpawning();
    }
}

window.TutorialSystem = TutorialSystem;