// ============================================
// TUTORIAL SYSTEM (DESIGN ORIGINALE + FIX CRASH)
// ============================================

class TutorialSystem {
    constructor(scene) {
        this.scene = scene;
        this.isActive = true;
        this.fakeCustomer = null;
        this.tutorialStep = 0;
        this.uiContainer = null; // Per il pannello di benvenuto
        this.tutorialPanel = null; // Per i passaggi successivi
        
        this.createWelcomeScreen();
    }

    // --- 1. SCHERMATA DI BENVENUTO (SÌ / NO) ---
    createWelcomeScreen() {
        const scene = this.scene;

        // Sfondo nero semitrasparente
        scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setDepth(998);

        // Pannello Principale
        this.uiContainer = scene.add.container(400, 300).setDepth(999);
        
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
            this.uiContainer.destroy();
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
            this.uiContainer.destroy();
            this.skipTutorial();
        });
        btnNoBg.on('pointerover', () => btnNoBg.setFillStyle(0xc0392b));
        btnNoBg.on('pointerout', () => btnNoBg.setFillStyle(0xe74c3c));

        this.uiContainer.add([bg, title, desc, btnYesBg, btnYesTxt, btnNoBg, btnNoTxt]);
    }

    // --- 2. SE PREMI "NO" (SALTA IL TUTORIAL) ---
    skipTutorial() {
        localStorage.setItem('waitress_tutorial_done', 'true');
        this.scene.tutorialActive = false;
        this.scene.tutorial = null;
        
        // Rimuovi eventuali UI rimanenti
        if (this.tutorialPanel) this.tutorialPanel.destroy();
        
        window.GAME.level = 1;
        window.GAME.customersTarget = 6 + window.GAME.level * 4;
        this.scene.gameActive = true;
        this.scene.startSpawning();
    }

    // --- 3. SE PREMI "SÌ" (INIZIA IL TUTORIAL VERO) ---
    startTutorialGameplay() {
        this.createFakeCustomer();
        this.tutorialStep = 1;
        this.updateTutorialPanel();
    }

    createFakeCustomer() {
        const firstTable = this.scene.tables[0];
        if (!firstTable) return;

        this.fakeCustomer = {
            name: 'Marco (Tutorial)',
            order: 'Pizza',
            patience: 100,
            isDead: false,
            table: firstTable,
            emojiChar: '👨',
            x: firstTable.x,
            y: firstTable.y,
            relationScore: 50,
            timerEvent: { remove: () => {} },
            serve: () => { /* Logica placeholder */ }
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
        // Rimuovi il pannello precedente se esiste
        if (this.tutorialPanel) this.tutorialPanel.destroy();

        const scene = this.scene;

        // Testi dei passaggi
        const steps = [
            {}, // Step 0 vuoto
            { title: '📋 PRENDI L\'ORDINE', desc: 'Avvicinati al tavolo e clicca sul cliente per prendere il suo ordine.', target: 'take_order' },
            { title: '🍕 VAI IN CUCINA', desc: 'Ora vai al bancone "PASS PIATTI" e clicca per dare l\'ordine allo chef.', target: 'counter' },
            { title: '⏳ RITIRA IL CIBO', desc: 'Il cibo è pronto! Clicca sul bancone per prenderlo.', target: 'counter_pickup' },
            { title: '🍽️ SERVI IL CLIENTE', desc: 'Torna al tavolo e clicca sul cliente per servirgli il pasto.', target: 'serve_food' },
            { title: '🧹 PULISCI IL TAVOLO', desc: 'Bene! Ora clicca sul tavolo per pulire il piatto sporco.', target: 'clear_table' },
            { title: '🎉 FINE TUTORIAL!', desc: 'Hai imparato tutto! Inizia la tua avventura!', target: 'finish' }
        ];

        const current = steps[this.tutorialStep];

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

        // Aggiorna il target di interazione per la scena di gioco
        if (this.tutorialStep <= 6) {
            this.scene.tutorialStepTarget = current.target;
        }

        // Disegna una freccia guida verso il target
        if (current.target && this.tutorialStep < 6) {
            let targetX = 0, targetY = 0;
            if (current.target === 'take_order' || current.target === 'serve_food' || current.target === 'clear_table') {
                targetX = this.fakeCustomer.table.x;
                targetY = this.fakeCustomer.table.y;
            } else {
                targetX = 560;
                targetY = this.scene.waitress.y;
            }
            this.drawArrow(targetX, targetY);
        }
    }

    drawArrow(x, y) {
        if (this.arrowGraphic) this.arrowGraphic.destroy();
        this.arrowGraphic = this.scene.add.graphics().setDepth(900);
        
        this.arrowGraphic.fillStyle(0xffd700, 1);
        this.arrowGraphic.fillTriangle(x - 12, y - 70, x + 12, y - 70, x, y - 40);
        this.arrowGraphic.fillRect(x - 2, y - 90, 4, 30);
        
        this.scene.tweens.add({
            targets: this.arrowGraphic,
            alpha: 0.6,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    // --- 4. INTERAZIONI DEL GIOCO VERO ---
    // (Questa funzione viene chiamata dal tuo game.js quando il giocatore interagisce)
    progressStep() {
        if (this.tutorialStep >= 6) {
            this.finishTutorial();
            return;
        }
        this.tutorialStep++;
        this.updateTutorialPanel();
    }

    finishTutorial() {
        this.scene.tutorialActive = false;
        this.scene.tutorial = null;
        this.scene.tutorialStepTarget = null;
        
        localStorage.setItem('waitress_tutorial_done', 'true');
        
        // Rimuovi UI e frecce
        if (this.tutorialPanel) this.tutorialPanel.destroy();
        if (this.arrowGraphic) this.arrowGraphic.destroy();
        
        // Rimuovi il cliente finto
        if (this.fakeCustomer) {
            if (this.fakeCustomer.emoji) this.fakeCustomer.emoji.destroy();
            if (this.fakeCustomer.shadow) this.fakeCustomer.shadow.destroy();
            if (this.fakeCustomer.orderBubble) this.fakeCustomer.orderBubble.destroy();
            if (this.fakeCustomer.patienceBg) this.fakeCustomer.patienceBg.destroy();
            if (this.fakeCustomer.patienceBar) this.fakeCustomer.patienceBar.destroy();
            this.fakeCustomer.table.occupied = false;
            this.fakeCustomer.table.customer = null;
            this.fakeCustomer.table.status = 'libero';
        }

        // --- CORREZIONE CRASH QUI ---
        // Usiamo window.GAME, NON this.scene.GAME
        window.GAME.level = 1;
        window.GAME.customersTarget = 6 + window.GAME.level * 4;
        
        this.scene.gameActive = true;
        this.scene.startSpawning();
    }
}

window.TutorialSystem = TutorialSystem;