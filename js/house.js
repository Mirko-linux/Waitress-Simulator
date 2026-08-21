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
        this.moveDirection = { x: 0, y: 0 };
        this.wallGroup = null;
        this.player = null;
        this.isComputerOpen = false;
        this.houseData = null;
    }

    create() {
        this.loadHouseData();
        this.createTilemap();           // Tilemap + fisica
        this.createPlayer();            // Player con WASD
        this.createObjects();           // Letto e Computer interattivi
        this.createHouseHUD();          // Barra superiore
        this.setupControls();           // Tasti WASD

        this.cameras.main.setBounds(0, 0, 480, 480);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.showWelcomeMessage();
        window.houseScene = this;
    }

    // --- 1. TILEMAP E FISICA (CASA 15x15) ---
    createTilemap() {
        const TILE = 32;
        const W = 15;
        const H = 15;

        // 0 = pavimento, 1 = muro
        const map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        this.wallGroup = this.physics.add.staticGroup();

        for (let row = 0; row < H; row++) {
            for (let col = 0; col < W; col++) {
                const x = col * TILE + TILE / 2;
                const y = row * TILE + TILE / 2;

                if (map[row][col] === 0) {
                    // Pavimento
                    const color = (row + col) % 2 === 0 ? 0x4a2c1a : 0x3d2418;
                    this.add.rectangle(x, y, TILE, TILE, color).setDepth(0);
                } else {
                    // Muro (visivo)
                    this.add.rectangle(x, y, TILE, TILE, 0x1a0a04).setDepth(1);
                    // Muro (fisico)
                    const wall = this.wallGroup.create(x, y, null);
                    wall.setSize(TILE, TILE);
                    wall.setVisible(false);
                }
            }
        }
    }

    // --- 2. PLAYER E MOVIMENTO ---
    createPlayer() {
        this.player = this.add.text(200, 200, '👩‍🍳', { fontSize: '36px' }).setOrigin(0.5).setDepth(10);
        this.physics.add.existing(this.player, false);
        if (this.player.body) {
            this.player.body.setSize(24, 24);
            this.player.body.setOffset(6, 12);
            this.player.body.setCollideWorldBounds(true);
        }
        if (this.wallGroup) {
            this.physics.add.collider(this.player, this.wallGroup);
        }
    }

    setupControls() {
        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'w' || event.key === 'W') this.moveDirection.y = -1;
            if (event.key === 's' || event.key === 'S') this.moveDirection.y = 1;
            if (event.key === 'a' || event.key === 'A') this.moveDirection.x = -1;
            if (event.key === 'd' || event.key === 'D') this.moveDirection.x = 1;
        });

        this.input.keyboard.on('keyup', (event) => {
            if (['w','W','s','S'].includes(event.key)) this.moveDirection.y = 0;
            if (['a','A','d','D'].includes(event.key)) this.moveDirection.x = 0;
        });
    }

    update() {
        if (!this.player || !this.player.body || this.isComputerOpen) return;

        let moveX = 0, moveY = 0;
        if (this.moveDirection.x !== 0) moveX = this.moveDirection.x;
        if (this.moveDirection.y !== 0) moveY = this.moveDirection.y;

        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.7071;
            moveY *= 0.7071;
        }

        const speed = 300;
        this.player.body.setVelocity(moveX * speed, moveY * speed);
    }

    // --- 3. OGGETTI INTERATTIVI (LETTO E COMPUTER) ---
    createObjects() {
        // Letto (a sinistra)
        this.createInteractable(100, 250, '🛏️', 'Dormi', () => {
            this.doSleep();
        });

        // Computer (a destra) - Ora apre il menu Hub
        this.createInteractable(380, 250, '💻', 'Computer', () => {
            this.openComputerHub();
        });
    }

    createInteractable(x, y, emoji, label, actionCallback) {
        const container = this.add.container(x, y);
        const icon = this.add.text(0, -15, emoji, { fontSize: '48px' }).setOrigin(0.5);
        const labelText = this.add.text(0, 35, label, {
            fontSize: '14px', color: '#ecf0f1', fontFamily: 'Fredoka',
            backgroundColor: '#00000088', padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
        container.add([icon, labelText]);
        container.setDepth(10);

        const hitArea = this.add.rectangle(x, y, 80, 80, 0xffffff, 0)
            .setInteractive({ useHandCursor: true })
            .setDepth(20);

        hitArea.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y);
            if (dist <= 80) {
                if (window.triggerSfx) window.triggerSfx('click');
                actionCallback();
            } else {
                this.showMessage('Avvicinati con WASD!', '#ffd700');
            }
        });
    }

    // --- 4. HUB DEL COMPUTER (UPGRADE, SOCIAL, STATISTICHE) ---
    openComputerHub() {
        if (this.isComputerOpen) return;
        this.isComputerOpen = true;
        this.gameActive = false;

        // Pannello sfondo
        this.menuBg = this.add.rectangle(400, 300, 600, 500, 0x110906, 0.95)
            .setStrokeStyle(2, 0xd27d2d)
            .setDepth(200)
            .setScrollFactor(0);

        this.menuTitle = this.add.text(400, 70, '💻 COMPUTER', {
            fontSize: '28px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(201).setScrollFactor(0);

        // Schede
        const tabs = [
            { id: 'upgrades', label: '🔧 UPGRADE' },
            { id: 'social', label: '👤 SOCIAL' },
            { id: 'stats', label: '📊 STATISTICHE' }
        ];

        let currentTab = 'upgrades';
        let contentArea = null;

        const createTabContent = (tabId) => {
            if (contentArea) contentArea.destroy();

            if (tabId === 'upgrades') {
                contentArea = this.createUpgradesMenu();
            } else if (tabId === 'social') {
                contentArea = this.createSocialMenu();
            } else if (tabId === 'stats') {
                contentArea = this.createStatsMenu();
            }
            contentArea.setDepth(202).setScrollFactor(0);
        };

        // Crea i bottoni delle schede
        tabs.forEach((tab, i) => {
            const x = 250 + i * 150;
            const btn = this.add.rectangle(x, 120, 130, 30, 0x2c1a11)
                .setStrokeStyle(1, currentTab === tab.id ? 0xffd700 : 0x444444)
                .setDepth(201)
                .setScrollFactor(0)
                .setInteractive({ useHandCursor: true });

            this.add.text(x, 120, tab.label, {
                fontSize: '12px', color: currentTab === tab.id ? '#ffd700' : '#ffffff',
                fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(202).setScrollFactor(0);

            btn.on('pointerdown', () => {
                currentTab = tab.id;
                // Reset colori
                tabs.forEach((_, idx) => {
                    const b = this.children.list.find(c => c.x === 250 + idx * 150 && c.y === 120 && c.type === 'Rectangle');
                    if (b) b.setStrokeStyle(1, 0x444444);
                });
                btn.setStrokeStyle(1, 0xffd700);
                createTabContent(tab.id);
            });
        });

        // Contenuto iniziale
        createTabContent('upgrades');

        // Pulsante Chiudi
        const closeBtn = this.add.text(680, 70, '✖', {
            fontSize: '32px', color: '#e74c3c', fontStyle: 'bold'
        }).setDepth(201).setScrollFactor(0).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.closeComputerHub());
    }

    // --- 5. MENU UPGRADE ---
    createUpgradesMenu() {
        const container = this.add.container(400, 300);
        const upgrades = [
            { id: 'notebook', name: '📒 Taccuino Intelligente', desc: 'Comande max: +2', cost: 300, maxLevel: 5, currentLevel: 0, icon: '📒' },
            { id: 'ads', name: '📢 Campagna Pubblicitaria', desc: 'Clienti +20%', cost: 500, maxLevel: 1, currentLevel: 0, icon: '📢' },
            { id: 'cards', name: '🃏 Mazzo di Carte', desc: 'Intrattiene i clienti', cost: 150, maxLevel: 10, currentLevel: 0, icon: '🃏' }
        ];

        // Carica i livelli salvati (se li hai salvati da qualche parte)
        const savedUpgrades = JSON.parse(localStorage.getItem('waitress_house_upgrades') || '{}');

        upgrades.forEach((upg, i) => {
            const yPos = -120 + i * 80;
            const currentLvl = savedUpgrades[upg.id] || 0;
            const isMaxed = currentLvl >= upg.maxLevel;
            const cost = Math.floor(upg.cost * (1 + currentLvl * 0.2));

            // Sfondo voce
            const bg = this.add.rectangle(0, yPos, 500, 60, 0x222222, 0.5).setStrokeStyle(1, 0x444444);
            
            // Nome e descrizione
            this.add.text(-200, yPos - 15, upg.name, { fontSize: '16px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);
            this.add.text(-200, yPos + 15, `${upg.desc} (Lv. ${currentLvl}/${upg.maxLevel})`, { fontSize: '12px', color: '#aaaaaa', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);

            // Pulsante Acquista
            const buyBtn = this.add.rectangle(200, yPos, 80, 30, isMaxed ? 0x555555 : 0x27ae60)
                .setStrokeStyle(1, 0xffffff)
                .setDepth(1)
                .setInteractive({ useHandCursor: true });

            const buyTxt = this.add.text(200, yPos, isMaxed ? 'MAX' : `${cost}€`, {
                fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            if (!isMaxed) {
                buyBtn.on('pointerdown', () => {
                    // Controlla soldi
                    if (window.GAME.score >= cost) {
                        window.GAME.score -= cost;
                        savedUpgrades[upg.id] = (savedUpgrades[upg.id] || 0) + 1;
                        localStorage.setItem('waitress_house_upgrades', JSON.stringify(savedUpgrades));
                        this.showMessage(`✅ Comprato ${upg.name}!`, '#2ecc71');
                        // Ricarica il menu
                        this.closeComputerHub();
                        this.openComputerHub();
                    } else {
                        this.showMessage('❌ Soldi insufficienti!', '#e74c3c');
                    }
                });
            }

            container.add([bg, buyBtn, buyTxt]);
        });

        return container;
    }

    // --- 6. MENU SOCIAL ---
    createSocialMenu() {
        const container = this.add.container(400, 250);
        
        this.add.text(0, -100, '👤 IL TUO PROFILO', { fontSize: '20px', color: '#ffd700', fontFamily: 'Fredoka', fontStyle: 'bold' }).setOrigin(0.5);
        
        // Nickname (es. da localStorage)
        let nickname = localStorage.getItem('waitress_nickname') || 'Cameriera';
        
        this.add.text(0, -50, `Nickname: ${nickname}`, { fontSize: '16px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0.5);
        
        // Input per cambiare nickname (HTML puro)
        const input = document.createElement('input');
        input.type = 'text';
        input.value = nickname;
        input.style.position = 'absolute';
        input.style.top = '300px';
        input.style.left = '50%';
        input.style.transform = 'translateX(-50%)';
        input.style.width = '200px';
        input.style.padding = '8px';
        input.style.borderRadius = '8px';
        input.style.border = '1px solid #d27d2d';
        input.style.background = '#1a0a04';
        input.style.color = '#ffffff';
        input.style.fontFamily = 'Fredoka';
        input.style.fontSize = '14px';
        document.body.appendChild(input);

        // Pulsante Salva Nickname
        const saveBtn = this.add.rectangle(0, 20, 120, 30, 0xd27d2d)
            .setStrokeStyle(1, 0xffd700)
            .setInteractive({ useHandCursor: true });
        this.add.text(0, 20, 'SALVA', { fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

        saveBtn.on('pointerdown', () => {
            const newName = input.value.trim() || 'Cameriera';
            localStorage.setItem('waitress_nickname', newName);
            this.showMessage(`✅ Nickname cambiato in ${newName}!`, '#2ecc71');
            this.closeComputerHub();
            this.openComputerHub();
        });

        // Pulisci input quando chiudi
        this.events.once('shutdown', () => {
            if (input.parentNode) input.parentNode.removeChild(input);
        });

        return container;
    }

    // --- 7. MENU STATISTICHE ---
    createStatsMenu() {
        const container = this.add.container(400, 250);
        const stats = [
            `💰 Guadagno totale: ${window.GAME.score}€`,
            `📅 Giorni lavorati: ${window.GAME.level}`,
            `👩‍🍳 Clienti serviti: ${window.GAME.customersServed}`,
            `❤️ Vite rimanenti: ${window.GAME.lives}`,
            `📦 Affitto attuale: ${this.calculateRentDue()}€`
        ];

        stats.forEach((stat, i) => {
            this.add.text(0, -80 + i * 35, stat, { fontSize: '16px', color: '#ecf0f1', fontFamily: 'Fredoka' }).setOrigin(0.5);
        });

        return container;
    }

    // --- 8. CHIUDI COMPUTER ---
    closeComputerHub() {
        this.isComputerOpen = false;
        this.gameActive = true;
        // Rimuovi tutti gli elementi del menu
        this.children.list.forEach(child => {
            if (child.depth >= 200) child.destroy();
        });
        // Rimuovi eventuali input HTML rimasti
        document.querySelectorAll('input[style*="position: absolute"]').forEach(el => el.remove());
    }

    // --- 9. AZIONI LETTO ---
    doSleep() {
        this.showMessage('🛏️ Buonanotte! Energia recuperata! 😴', '#3498db');
        if (window.GAME) window.GAME.lives = Math.min(3, window.GAME.lives + 1);
        this.houseData.bonuses.patienceBoost += 1;
        this.saveHouseData();
    }

    // --- 10. HUD E UTILITY ---
    createHouseHUD() {
        // Sfondo HUD (solo estetico, lo tolgo per renderlo più pulito)
    }

    showMessage(text, color = '#ffffff') {
        const msg = this.add.text(400, 520, text, {
            fontSize: '16px', color: color, fontStyle: 'bold', fontFamily: 'Fredoka',
            backgroundColor: '#000000aa', padding: { x: 12, y: 6 }
        }).setOrigin(0.5).setDepth(200).setScrollFactor(0);
        this.tweens.add({ targets: msg, alpha: 0, delay: 2000, duration: 500, onComplete: () => msg.destroy() });
    }

    showWelcomeMessage() {
        this.showMessage('🏠 Esplora la casa con WASD. Clicca sul 💻 per gli upgrade!', '#ffd700');
    }

    // --- 11. DATI ---
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
            bonuses: { steelBladder: 0, tipsBoost: 0, patienceBoost: 0 },
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

window.HouseScene = HouseScene;