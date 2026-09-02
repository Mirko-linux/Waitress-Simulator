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
        this.currentMenuTab = 'upgrades';
        this.isTyping = false;
        this.computerUIContainer = null;
        this.allHtmlInputs = [];
    }

    preload() {
        this.load.image('cameriera_avanti', 'assets/Cameriera/Cameriera_Avanti.png');
        this.load.image('cameriera_destra', 'assets/Cameriera/Cameriera_Destra.png');
        this.load.image('cameriera_dietro', 'assets/Cameriera/Cameriera_Dietro.png');
        this.load.image('cameriera_sinistra', 'assets/Cameriera/Cameriera_Sinistra.png');
        this.load.image('casa_letto', 'assets/Casa/Letto.png');
        this.load.image('casa_scrivania', 'assets/Casa/Scrivania.png');
        this.load.image('casa_computer', 'assets/Casa/Computer.png');
    }

    create() {
        this.loadHouseData();
        this.createTilemap();
        this.createPlayer();
        this.createObjects();
        this.setupControls();

        const workBtn = this.add.rectangle(700, 550, 150, 40, 0x27ae60).setDepth(100).setScrollFactor(0).setInteractive({ useHandCursor: true });
        this.add.text(700, 550, '🏃 LAVORO', { fontSize: '16px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5).setDepth(101).setScrollFactor(0);
        workBtn.on('pointerdown', () => { this.scene.start('Game'); });

        this.cameras.main.setBounds(0, 0, 800, 600);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.showWelcomeMessage();
        window.houseScene = this;
    }

    createSafeHtmlInput() {
        const input = document.createElement('input');
        const gameContainer = document.getElementById('game-container') || document.body;
        
        Object.assign(input.style, {
            position: 'absolute',
            background: 'transparent',
            color: '#ffffff',
            border: 'none',
            outline: 'none',
            fontFamily: 'Fredoka',
            fontSize: '16px',
            zIndex: '1000'
        });

        input.addEventListener('focus', () => { this.isTyping = true; });
        input.addEventListener('blur', () => { this.isTyping = false; });
        input.addEventListener('keydown', (e) => e.stopPropagation());
        input.addEventListener('keyup', (e) => e.stopPropagation());

        gameContainer.appendChild(input);
        this.allHtmlInputs.push(input);
        return input;
    }

    positionHtmlInput(input, canvasX, canvasY, width) {
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / 800;
        const scaleY = rect.height / 600;

        input.style.left = `${(canvasX * scaleX) + rect.left}px`;
        input.style.top = `${(canvasY * scaleY) + rect.top}px`;
        input.style.width = `${width * scaleX}px`;
        input.style.height = `${32 * scaleY}px`;
        input.style.fontSize = `${16 * scaleX}px`;
    }

    createTilemap() {
        const TILE = 32;
        const W = 25;
        const H = 19;

        this.wallGroup = this.physics.add.staticGroup();
        this.add.rectangle(400, 300, 800, 600, 0x000000).setDepth(-10);

        const floorKeys = ['floor_sala', 'floor_cucina', 'floor_bagno'];

        for (let row = 0; row < H; row++) {
            for (let col = 0; col < W; col++) {
                const x = col * TILE + TILE / 2;
                const y = row * TILE + TILE / 2;

                let floorType = 0;
                let isWall = false;

                if (row === 0 || row === H - 1 || col === 0 || col === W - 1) isWall = true;
                if (col >= 19 && col <= 23 && !isWall) floorType = 1;
                if (col >= 19 && col <= 21 && row >= 15 && row <= 17 && !isWall) floorType = 2;

                if (col === 18 && !isWall) {
                    isWall = true;
                    if (row >= 8 && row <= 10) { isWall = false; floorType = 0; }
                }
                if (col === 18 && row >= 15 && row <= 17 && !isWall) isWall = true;
                if (col >= 19 && col <= 21 && row === 14 && !isWall) {
                    isWall = true;
                    if (col === 20) isWall = false;
                }
                if (row === H - 1 && col >= 6 && col <= 8) { isWall = false; floorType = 0; }

                if (!isWall && this.textures.exists(floorKeys[floorType])) {
                    this.add.image(x, y, floorKeys[floorType]).setDisplaySize(TILE, TILE).setDepth(0);
                }

                if (isWall) {
                    if (this.textures.exists('wall')) {
                        const wall = this.wallGroup.create(x, y, 'wall');
                        wall.setDisplaySize(TILE, TILE).setDepth(1);
                        if (wall.body) { wall.body.setSize(TILE, TILE); wall.body.setOffset(0, 0); wall.refreshBody(); }
                    } else {
                        const wallRect = this.add.rectangle(x, y, TILE, TILE, 0x111111).setDepth(1);
                        this.wallGroup.create(x, y, null).setSize(TILE, TILE).setVisible(false);
                    }
                }
            }
        }
    }

    createPlayer() {
        if (this.textures.exists('cameriera_avanti')) {
            this.player = this.add.image(200, 200, 'cameriera_avanti').setOrigin(0.5).setDepth(10).setScale(0.35);
        } else {
            this.player = this.add.text(200, 200, '👩‍🍳', { fontSize: '36px' }).setOrigin(0.5).setDepth(10);
        }
        
        this.physics.add.existing(this.player, false);
        if (this.player.body) {
            this.player.body.setSize(24, 24);
            this.player.body.setOffset(6, 12);
            this.player.body.setCollideWorldBounds(true);
        }
        if (this.wallGroup) this.physics.add.collider(this.player, this.wallGroup);
    }

    setupControls() {
        this.keys = this.input.keyboard.addKeys({ w: Phaser.Input.Keyboard.KeyCodes.W, a: Phaser.Input.Keyboard.KeyCodes.A, s: Phaser.Input.Keyboard.KeyCodes.S, d: Phaser.Input.Keyboard.KeyCodes.D });

        this.input.keyboard.on('keydown', (event) => {
            if (this.isTyping || this.isComputerOpen) return;
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
        if (!this.player || !this.player.body || this.isComputerOpen || this.isTyping) {
            if (this.player && this.player.body) this.player.body.setVelocity(0, 0);
            return;
        }
        let moveX = 0, moveY = 0;
        if (this.moveDirection.x !== 0) moveX = this.moveDirection.x;
        if (this.moveDirection.y !== 0) moveY = this.moveDirection.y;
        if (moveX !== 0 && moveY !== 0) { moveX *= 0.7071; moveY *= 0.7071; }
        const speed = 300;
        this.player.body.setVelocity(moveX * speed, moveY * speed);

        if (this.player.setTexture) {
            if (moveX > 0 && this.textures.exists('cameriera_destra')) {
                this.player.setTexture('cameriera_destra');
            } else if (moveX < 0 && this.textures.exists('cameriera_sinistra')) {
                this.player.setTexture('cameriera_sinistra');
            } else if (moveY < 0 && this.textures.exists('cameriera_dietro')) {
                this.player.setTexture('cameriera_dietro');
            } else if (moveY > 0 && this.textures.exists('cameriera_avanti')) {
                this.player.setTexture('cameriera_avanti');
            }
        }
    }

    createObjects() {
        this.createInteractableImage(150, 250, 'casa_letto', 'Dormi', () => { this.doSleep(); }, 50, 60);
        
        const deskX = 450;
        const deskY = 250;
        this.add.image(deskX, deskY, 'casa_scrivania').setDisplaySize(60, 40).setDepth(5);
        this.createInteractableImage(deskX, deskY - 10, 'casa_computer', 'Computer', () => { this.openComputerHub(); }, 40, 30, 6);
    }

    createInteractableImage(x, y, textureKey, label, actionCallback, width = 40, height = 40, depth = 5) {
        const container = this.add.container(x, y);
        
        if (this.textures.exists(textureKey)) {
            const img = this.add.image(0, 0, textureKey).setDisplaySize(width, height);
            container.add(img);
        } else {
            const txt = this.add.text(0, -15, '📦', { fontSize: '32px' }).setOrigin(0.5);
            container.add(txt);
        }

        const labelText = this.add.text(0, height / 2 + 10, label, {
            fontSize: '12px', color: '#ecf0f1', fontFamily: 'Fredoka',
            backgroundColor: '#00000088', padding: { x: 6, y: 3 }
        }).setOrigin(0.5);
        
        container.add(labelText);
        container.setDepth(depth);

        const hitArea = this.add.rectangle(x, y, Math.max(width, 60), Math.max(height, 60), 0xffffff, 0).setInteractive({ useHandCursor: true }).setDepth(depth + 10);
        hitArea.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y);
            if (dist <= 80) { if (window.triggerSfx) window.triggerSfx('click'); actionCallback(); }
            else this.showMessage('Avvicinati con WASD!', '#ffd700');
        });
    }

    openComputerHub() {
        if (this.isComputerOpen) return;
        this.isComputerOpen = true;
        this.currentMenuTab = 'upgrades';
        this.renderComputerUI();
    }

    destroyComputerUI() {
        if (this.computerUIContainer) {
            this.computerUIContainer.destroy();
            this.computerUIContainer = null;
        }
        this.allHtmlInputs.forEach(input => { if (input.parentNode) input.parentNode.removeChild(input); });
        this.allHtmlInputs = [];
    }

    renderComputerUI() {
        this.destroyComputerUI();

        this.computerUIContainer = this.add.container(0, 0).setDepth(200).setScrollFactor(0);
        this.computerUIContainer.add(this.add.rectangle(400, 300, 600, 500, 0x110906, 0.97).setStrokeStyle(2, 0xd27d2d));
        this.computerUIContainer.add(this.add.text(400, 70, '💻 COMPUTER', { fontSize: '26px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5));

        const closeBtn = this.add.text(680, 70, '✖', { fontSize: '32px', color: '#e74c3c', fontStyle: 'bold' }).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.closeComputerHub());
        this.computerUIContainer.add(closeBtn);

        const tabs = [
            { id: 'upgrades', label: '🔧 UPGRADE' },
            { id: 'social', label: '👤 SOCIAL' },
            { id: 'stats', label: '📊 STATISTICHE' },
            { id: 'search', label: '🔍 WEB' }
        ];

        tabs.forEach((tab, i) => {
            const x = 180 + i * 140;
            const btn = this.add.rectangle(x, 120, 120, 30, this.currentMenuTab === tab.id ? 0xd27d2d : 0x2c1a11).setInteractive({ useHandCursor: true });
            const btnText = this.add.text(x, 120, tab.label, { fontSize: '11px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
            btn.on('pointerdown', () => { this.currentMenuTab = tab.id; this.renderComputerUI(); });
            this.computerUIContainer.add(btn);
            this.computerUIContainer.add(btnText);
        });

        if (this.currentMenuTab === 'upgrades') this.renderUpgradesContent();
        else if (this.currentMenuTab === 'social') this.renderSocialContent();
        else if (this.currentMenuTab === 'stats') this.renderStatsContent();
        else if (this.currentMenuTab === 'search') this.renderSearchContent();
    }

    renderUpgradesContent() {
        const upgrades = [
            { id: 'notebook', name: '📒 Taccuino Intelligente', desc: 'Comande max: +2', cost: 300, maxLevel: 5 },
            { id: 'ads', name: '📢 Campagna Pubblicitaria', desc: 'Clienti +20%', cost: 500, maxLevel: 1 },
            { id: 'cards', name: '🃏 Mazzo di Carte', desc: 'Intrattiene i clienti', cost: 150, maxLevel: 10 }
        ];

        const savedUpgrades = JSON.parse(localStorage.getItem('waitress_house_upgrades') || '{}');

        upgrades.forEach((upg, i) => {
            const yPos = 170 + i * 60;
            const currentLvl = savedUpgrades[upg.id] || 0;
            const isMaxed = currentLvl >= upg.maxLevel;
            const cost = Math.floor(upg.cost * (1 + currentLvl * 0.2));

            this.computerUIContainer.add(this.add.rectangle(400, yPos, 500, 50, 0x222222, 0.8).setStrokeStyle(1, 0x444444));
            this.computerUIContainer.add(this.add.text(230, yPos - 10, upg.name, { fontSize: '16px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0, 0.5));
            this.computerUIContainer.add(this.add.text(230, yPos + 12, `${upg.desc} (Lv. ${currentLvl}/${upg.maxLevel})`, { fontSize: '11px', color: '#aaaaaa', fontFamily: 'Fredoka' }).setOrigin(0, 0.5));

            const buyBtn = this.add.rectangle(560, yPos, 80, 30, isMaxed ? 0x555555 : 0x27ae60).setInteractive({ useHandCursor: true });
            this.computerUIContainer.add(buyBtn);
            this.computerUIContainer.add(this.add.text(560, yPos, isMaxed ? 'MAX' : `${cost}€`, { fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5));

            if (!isMaxed) {
                buyBtn.on('pointerdown', () => {
                    if (window.GAME.score >= cost) {
                        window.GAME.score -= cost;
                        savedUpgrades[upg.id] = (savedUpgrades[upg.id] || 0) + 1;
                        localStorage.setItem('waitress_house_upgrades', JSON.stringify(savedUpgrades));
                        this.showMessage(`✅ Comprato ${upg.name}!`, '#2ecc71');
                        this.renderComputerUI();
                    } else this.showMessage('❌ Soldi insufficienti!', '#e74c3c');
                });
            }
        });
    }

    renderSocialContent() {
        let nickname = localStorage.getItem('waitress_nickname') || 'Cameriera';

        this.computerUIContainer.add(this.add.text(400, 180, '👤 IL TUO PROFILO', { fontSize: '20px', color: '#ffd700', fontFamily: 'Fredoka', fontStyle: 'bold' }).setOrigin(0.5));
        this.computerUIContainer.add(this.add.text(400, 220, `Nickname: ${nickname}`, { fontSize: '16px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0.5));

        const input = this.createSafeHtmlInput();
        input.value = nickname;
        input.style.top = '260px';
        input.style.left = '50%';
        input.style.transform = 'translateX(-50%)';
        input.style.width = '250px';
        input.style.padding = '10px';
        input.style.borderRadius = '10px';
        input.style.border = '2px solid #d27d2d';
        input.style.background = '#1a0a04';
        input.style.fontSize = '14px';

        const saveBtn = this.add.rectangle(400, 310, 150, 35, 0xd27d2d).setInteractive({ useHandCursor: true });
        this.computerUIContainer.add(saveBtn);
        this.computerUIContainer.add(this.add.text(400, 310, 'SALVA', { fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5));
        saveBtn.on('pointerdown', () => {
            const newName = input.value.trim() || 'Cameriera';
            localStorage.setItem('waitress_nickname', newName);
            this.showMessage(`✅ Nickname cambiato in ${newName}!`, '#2ecc71');
            this.renderComputerUI();
        });
    }

    renderStatsContent() {
        const stats = [
            `💰 Guadagno totale: ${window.GAME.score}€`,
            `📅 Giorni lavorati: ${window.GAME.level}`,
            `👩‍🍳 Clienti serviti: ${window.GAME.customersServed}`,
            `❤️ Vite rimanenti: ${window.GAME.lives}`,
            `📦 Affitto attuale: ${this.calculateRentDue()}€`
        ];

        stats.forEach((stat, i) => {
            this.computerUIContainer.add(this.add.text(400, 180 + i * 40, stat, { fontSize: '18px', color: '#ecf0f1', fontFamily: 'Fredoka' }).setOrigin(0.5));
        });
    }

    renderSearchContent() {
        this.computerUIContainer.add(this.add.text(400, 180, 'Gugol', { fontSize: '48px', color: '#d27d2d', fontFamily: 'Fredoka', fontStyle: 'bold' }).setOrigin(0.5));
        this.computerUIContainer.add(this.add.rectangle(400, 250, 450, 50, 0x222222).setStrokeStyle(2, 0x777777));
        this.computerUIContainer.add(this.add.text(280, 250, '🔍', { fontSize: '20px', color: '#aaaaaa' }).setOrigin(0.5));

        const searchInput = this.createSafeHtmlInput();
        searchInput.placeholder = 'Cerca nel web...';
        this.positionHtmlInput(searchInput, 320, 235, 250);
        searchInput.style.border = 'none';
        searchInput.style.background = 'transparent';
        searchInput.style.fontSize = '16px';

        const searchBtn = this.add.rectangle(400, 320, 180, 40, 0xd27d2d).setInteractive({ useHandCursor: true });
        this.computerUIContainer.add(searchBtn);
        this.computerUIContainer.add(this.add.text(400, 320, 'Cerca', { fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5));

        const resultsText = this.add.text(400, 400, '', {
            fontSize: '14px', color: '#ffffff', fontFamily: 'Fredoka', align: 'center', wordWrap: { width: 400 }
        }).setOrigin(0.5);
        this.computerUIContainer.add(resultsText);

        const searchDatabase = {
            'veleno': '⚠️ ATTENZIONE! Il veleno è illegale. Non comprarlo!',
            'pos contraffatto': '⚠️ ATTENZIONE! Il POS contraffatto è illegale. Non comprarlo!',
            'clan': '🕵️ Il clan rivale ti sta osservando. Fai attenzione!',
            'missione': '📜 Le missioni secondarie si accettano dal computer.',
            'ludovica': '👶 Ludovica è la figlia di Elena. La missione si sblocca con la sintonia al 100%.',
            'dark web': '🕵️ Il Dark Web è accessibile solo dal computer di casa.',
            'hiddenvault.com': '🌐 Accesso al Dark Web consentito...',
            'hiddenvault': '🌐 Accesso al Dark Web consentito...',
            'default': '🔍 Nessun risultato trovato.'
        };

        searchBtn.on('pointerdown', () => {
            const query = searchInput.value.trim().toLowerCase();
            const result = searchDatabase[query] || searchDatabase['default'];
            resultsText.setText(result);
            
            if (query === 'hiddenvault.com' || query === 'hiddenvault') {
                if (window.CrimeSystem && window.houseScene && window.houseScene.crime) {
                    window.houseScene.crime.openHiddenVault();
                } else {
                    this.showMessage('❌ Devi prima ricevere il foglio dal clan!', '#e74c3c');
                }
            }
        });
    }

    closeComputerHub() {
        this.isComputerOpen = false;
        this.gameActive = true;
        this.destroyComputerUI();
    }

    doSleep() {
        this.showMessage('🛏️ Buonanotte! Energia recuperata! 😴', '#3498db');
        if (window.GAME) window.GAME.lives = Math.min(3, window.GAME.lives + 1);
        this.houseData.bonuses.patienceBoost += 1;
        this.saveHouseData();
    }

    showMessage(text, color = '#ffffff') {
        if (this.msgContainer) {
            try { this.msgContainer.destroy(); } catch(e) {}
            this.msgContainer = null;
        }
        this.msgContainer = this.add.container(200, 550).setDepth(500).setScrollFactor(0);
        const bg = this.add.rectangle(0, 0, 350, 40, 0x000000, 0.9).setStrokeStyle(2, color);
        const msg = this.add.text(0, 0, text, { fontSize: '14px', color: color, fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
        this.msgContainer.add([bg, msg]);
        this.tweens.add({
            targets: this.msgContainer,
            alpha: 0,
            delay: 2500,
            duration: 500,
            onComplete: () => {
                if (this.msgContainer) { try { this.msgContainer.destroy(); } catch(e) {} this.msgContainer = null; }
            }
        });
    }

    showWelcomeMessage() {
        this.showMessage('🏠 Esplora la casa con WASD. Clicca sul 💻 per gli upgrade!', '#ffd700');
    }

    loadHouseData() {
        const saved = localStorage.getItem('waitress_house_data');
        if (saved) {
            try { this.houseData = JSON.parse(saved); }
            catch(e) { this.initHouseData(); }
        } else { this.initHouseData(); }
    }

    initHouseData() {
        this.houseData = {
            totalEarned: 0, levelsCompleted: 0,
            bonuses: { steelBladder: 0, tipsBoost: 0, patienceBoost: 0 },
            achievements: HOUSE_CONFIG.achievements, totalRentPaid: 0
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