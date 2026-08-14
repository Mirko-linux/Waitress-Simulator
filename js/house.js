// house.js - Versione MINIMAL (Solo Letto e Computer)

const HOUSE_CONFIG = {
    rent: {
        base: 50,
        increasePerLevel: 15,
        dueEvery: 3 
    },
    achievements: {
        'Primo Giorno': { icon: '🌟', desc: 'Completa il giorno 1', unlocked: false },
        'Brava Cameriera': { icon: '👩‍🍳', desc: 'Servi 50 clienti', unlocked: false },
        'Milionaria': { icon: '💰', desc: 'Guadagna 1000€', unlocked: false },
        'Affitto Pagato': { icon: '🏠', desc: 'Paga 3 volte l\'affitto', unlocked: false },
        'Cuoco Amico': { icon: '👨‍🍳', desc: 'Usa il trucco segreto', unlocked: false }
    }
};

class HouseScene extends Phaser.Scene {
    constructor() {
        super('House');
        this.cheatActivated = false;
    }

    create() {
        this.loadHouseData();
        this.createHouseBackground();
        this.createPlayer();
        this.createHouseHUD();
        this.createObjects(); // Solo computer e letto

        this.showWelcomeMessage();
        window.houseScene = this;
    }

    // --- 1. SFONDO E PLAYER ---
    createHouseBackground() {
        // Sfondo marrone uniforme, niente tilemap
        this.add.rectangle(400, 300, 800, 600, 0x2c1810).setDepth(-1);

        // Titolo
        this.add.text(400, 30, '🏠 CASA', {
            fontSize: '24px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(10);
    }

    createPlayer() {
        // Player statico al centro, niente fisica, niente WASD
        this.player = this.add.text(400, 300, '👩‍🍳', {
            fontSize: '42px'
        }).setOrigin(0.5).setDepth(5);
    }

    // --- 2. OGGETTI (SOLO COMPUTER E LETTO) ---
    createObjects() {
        // LETTO (a sinistra)
        this.createInteractable(220, 300, '🛏️', 'Dormi', () => {
            this.doSleep();
        });

        // COMPUTER (a destra)
        this.createInteractable(580, 300, '💻', 'Computer', () => {
            this.openComputer();
        });
    }

    createInteractable(x, y, emoji, label, actionCallback) {
        // Contenitore
        const container = this.add.container(x, y);
        
        // Emoji
        const icon = this.add.text(0, -15, emoji, { fontSize: '48px' }).setOrigin(0.5);
        
        // Etichetta
        const labelText = this.add.text(0, 35, label, {
            fontSize: '14px',
            color: '#ecf0f1',
            fontFamily: 'Fredoka',
            backgroundColor: '#00000088',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);

        container.add([icon, labelText]);
        container.setDepth(10);

        // Area cliccabile (invisibile)
        const hitArea = this.add.rectangle(x, y, 80, 80, 0xffffff, 0)
            .setInteractive({ useHandCursor: true })
            .setDepth(20);

        hitArea.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            actionCallback();
        });
    }

    // --- 3. AZIONI ---
    doSleep() {
        this.showMessage('🛏️ Buonanotte! La cameriera si addormenta... 😴', '#3498db');
        this.houseData.bonuses.patienceBoost += 1;
        this.saveHouseData();
    }

    openComputer() {
        // Se hai una scena Computer, avvia quella. Altrimenti messaggio.
        if (this.scene.get('Computer')) {
            this.scene.start('Computer');
        } else {
            this.showMessage('💻 Computer: Sfoglia le statistiche (presto disponibile!)', '#ffd700');
        }
    }

    // --- 4. HUD ---
    createHouseHUD() {
        // Sfondo HUD
        this.add.rectangle(400, 70, 700, 40, 0x110906, 0.9)
            .setStrokeStyle(1.5, 0xd27d2d)
            .setDepth(50)
            .setScrollFactor(0);

        // Testi
        this.hudEarnedText = this.add.text(30, 60, `💰 ${this.houseData.totalEarned}€`, {
            fontSize: '14px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setDepth(51).setScrollFactor(0);

        this.hudRentText = this.add.text(250, 60, `📦 ${this.calculateRentDue()}€`, {
            fontSize: '14px',
            color: '#e74c3c',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setDepth(51).setScrollFactor(0);

        // Pulsante Vai al Lavoro
        const workBtn = this.add.rectangle(600, 70, 150, 30, 0x27ae60)
            .setInteractive({ useHandCursor: true })
            .setDepth(51)
            .setScrollFactor(0);

        this.add.text(600, 70, '🏃 LAVORO', {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(52).setScrollFactor(0);

        workBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            this.scene.start('Game');
        });
    }

    // --- 5. UTILITY ---
    showMessage(text, color = '#ffffff') {
        const msg = this.add.text(400, 500, text, {
            fontSize: '14px',
            color: color,
            fontStyle: 'bold',
            fontFamily: 'Fredoka',
            backgroundColor: '#000000aa',
            padding: { x: 12, y: 6 }
        }).setOrigin(0.5).setDepth(100).setScrollFactor(0);

        this.tweens.add({
            targets: msg,
            alpha: 0,
            delay: 2000,
            duration: 500,
            onComplete: () => msg.destroy()
        });
    }

    showWelcomeMessage() {
        this.showMessage('🏠 Clicca su 🛏️ o 💻 per interagire.', '#ffd700');
    }

    // --- 6. DATI ---
    loadHouseData() {
        const saved = localStorage.getItem('waitress_house_data');
        if (saved) {
            try {
                this.houseData = JSON.parse(saved);
            } catch(e) {
                this.initHouseData();
            }
        } else {
            this.initHouseData();
        }
    }

    initHouseData() {
        this.houseData = {
            totalEarned: 0,
            levelsCompleted: 0,
            bonuses: {
                steelBladder: 0,
                tipsBoost: 0,
                patienceBoost: 0
            },
            achievements: HOUSE_CONFIG.achievements,
            totalRentPaid: 0
        };
        this.saveHouseData();
    }

    saveHouseData() {
        this.houseData.achievements = HOUSE_CONFIG.achievements;
        localStorage.setItem('waitress_house_data', JSON.stringify(this.houseData));
    }

    calculateRentDue() {
        const level = this.houseData.levelsCompleted || 0;
        return HOUSE_CONFIG.rent.base + (level * HOUSE_CONFIG.rent.increasePerLevel);
    }
}

// FONDAMENTALE: Esponi la scena al mondo
window.HouseScene = HouseScene;