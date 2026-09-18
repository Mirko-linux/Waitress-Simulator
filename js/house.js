const HOUSE_CONFIG = {
    rent: {
        base: 50,
        increasePerLevel: 15,
        dueEvery: 3
    }
};

const MAX_LIVES = 3;

class HouseScene extends Phaser.Scene {
    constructor() {
        super('House');
        this.moveDirection = { x: 0, y: 0 };
        this.wallGroup = null;
        this.player = null;
        this.isComputerOpen = false;
        this.houseData = null;
        this.currentMenuTab = 'upgrades';
        this.iveaCategory = 'casa';
        this.isTyping = false;
        this.computerUIContainer = null;
        this.scrollableContentContainer = null;
        this.allHtmlInputs = [];
        this.scrollOffsetY = 0;
        this.purchasedSpritesGroup = null;
        this.iveaPendingDeliveries = [];
        this.iveaPackageSprite = null;
        this.iveaPackageZone = null;
        this.iveaPackageGlow = null;
        this.iveaPlacementMode = false;
        this.iveaItemToPlace = null;
        this.iveaPlacementPreview = null;
        this.crime = null;
        this.coffeeUsedToday = false;
        this.coffeeInProgress = false;
        this.interactables = [];

        this.hudBg = null;
        this.scoreText = null;
        this.levelText = null;
        this.livesText = null;
        this.rentText = null;

        this.coffeeSound = null;
        this.exitZone = null;
        this.isLeaving = false;
    }

    preload() {
        this.load.image('cameriera_avanti', 'assets/Cameriera/Cameriera_Avanti.png');
        this.load.image('cameriera_destra', 'assets/Cameriera/Cameriera_Destra.png');
        this.load.image('cameriera_dietro', 'assets/Cameriera/Cameriera_Dietro.png');
        this.load.image('cameriera_sinistra', 'assets/Cameriera/Cameriera_Sinistra.png');
        this.load.image('casa_letto', 'assets/Casa/Letto.png');
        this.load.image('casa_scrivania', 'assets/Casa/Scrivania.png');
        this.load.image('casa_computer', 'assets/Casa/Computer.png');
        this.load.image('casa_macchinetta', 'assets/Casa/Macchinetta.png');
        this.load.image('pacco', 'assets/Sala/pacco.png');

        this.load.audio('caffe', [
            'assets/audio/caffe.wav',
            'assets/audio/caffè.wav'
        ]);
    }

    create() {
        window.houseScene = this;

        if (!window.GAME) {
            window.GAME = { score: 0, level: 1, lives: 3, customersServed: 0, dirtyPlates: 0 };
        }

        if (typeof window.GAME.lives !== 'number') window.GAME.lives = 3;
        window.GAME.lives = Math.min(MAX_LIVES, Math.max(0, window.GAME.lives));

        try {
            const rawSave = localStorage.getItem('waitress_save_data');
            if (rawSave) {
                const parsed = JSON.parse(rawSave);
                if (typeof parsed.score === 'number') window.GAME.score = parsed.score;
                if (typeof parsed.level === 'number') window.GAME.level = parsed.level;
                if (typeof parsed.lives === 'number') {
                    window.GAME.lives = Math.min(MAX_LIVES, Math.max(0, parsed.lives));
                }
            }
        } catch(e) {}

        const coffeeDay = localStorage.getItem('waitress_coffee_day');
        const currentDay = window.GAME.level || 1;
        this.coffeeUsedToday = (coffeeDay === String(currentDay));

        if (!window.HOUSE_STATE) {
            window.HOUSE_STATE = { purchased: [], items: [] };
        }

        if (this.sound.get('caffe')) {
            this.coffeeSound = this.sound.get('caffe');
        }

        this.loadHouseData();
        this.loadIveaDeliveries();
        this.createTilemap();
        this.createPlayer();
        this.createObjects();
        this.spawnPurchasedItems();
        this.setupControls();
        this.createHouseHUD();
        this.createExitDoor();

        if (typeof CrimeSystem !== 'undefined') {
            this.crime = new CrimeSystem(this);
        }

        this.cameras.main.setBounds(0, 0, 800, 600);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    createExitDoor() {
        const doorX = 250;
        const doorY = 578;

        this.exitZone = this.add.zone(doorX, doorY, 140, 40).setDepth(5);
        this.exitZone.setRectangleDropZone(140, 40);
        this.exitZone.setInteractive({ useHandCursor: true });

        this.exitZone.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, doorX, doorY);
            if (dist <= 120) {
                this.goToWork();
            }
        });
    }

    goToWork() {
        if (this.isLeaving) return;
        if (this.isComputerOpen || this.iveaPlacementMode || this.isTyping) return;

        this.isLeaving = true;
        if (window.triggerSfx) window.triggerSfx('click');

        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.time.delayedCall(500, () => {
            this.closeComputerHub();
            this.scene.start('Game');
        });
    }

    createHouseHUD() {
        this.hudBg = this.add.rectangle(400, 22, 780, 38, 0x110906, 0.95);
        this.hudBg.setStrokeStyle(1.5, 0xd27d2d);
        this.hudBg.setDepth(100).setScrollFactor(0);

        this.scoreText = this.add.text(30, 14, `INCASSO: ${window.GAME.score}€`, {
            fontSize: '14px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setDepth(101).setScrollFactor(0);

        this.levelText = this.add.text(230, 14, `GIORNO: ${window.GAME.level}`, {
            fontSize: '14px', color: '#ffffff', fontFamily: 'Fredoka'
        }).setDepth(101).setScrollFactor(0);

        this.rentText = this.add.text(410, 14, `AFFITTO: ${this.calculateRentDue()}€`, {
            fontSize: '14px', color: '#e67e22', fontFamily: 'Fredoka'
        }).setDepth(101).setScrollFactor(0);

        this.livesText = this.add.text(610, 14, '❤️'.repeat(Math.max(0, window.GAME.lives || 3)), {
            fontSize: '14px', color: '#e74c3c', fontFamily: 'Fredoka'
        }).setDepth(101).setScrollFactor(0);

        this.updateHouseHUD();
    }

    updateHouseHUD() {
        if (!this.scoreText) return;
        const score = (window.GAME && typeof window.GAME.score === 'number') ? window.GAME.score : 0;
        const level = (window.GAME && window.GAME.level) ? window.GAME.level : 1;
        const lives = (window.GAME && typeof window.GAME.lives === 'number') ? window.GAME.lives : 3;

        this.scoreText.setText(`INCASSO: ${score}€`);
        this.levelText.setText(`GIORNO: ${level}`);
        this.rentText.setText(`AFFITTO: ${this.calculateRentDue()}€`);
        this.livesText.setText('❤️'.repeat(Math.max(0, lives)));
    }

    showFloatingText(x, y, text, color = '#ffffff') {
        const txt = this.add.text(x, y, text, {
            fontSize: '13px', color: color, fontStyle: 'bold', fontFamily: 'Fredoka',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(300).setScrollFactor(0);

        this.tweens.add({
            targets: txt,
            y: y - 40,
            alpha: 0,
            duration: 1400,
            ease: 'Cubic.easeOut',
            onComplete: () => txt.destroy()
        });
    }

    loadIveaDeliveries() {
        try {
            const raw = localStorage.getItem('waitress_ivea_deliveries');
            this.iveaPendingDeliveries = raw ? JSON.parse(raw) : [];
        } catch(e) {
            this.iveaPendingDeliveries = [];
        }

        const now = Date.now();
        this.iveaPendingDeliveries.forEach(delivery => {
            if (delivery.target === 'restaurant') return;
            const elapsed = now - delivery.orderTime;
            const remaining = Math.max(0, delivery.deliveryTime - elapsed);
            this.time.delayedCall(remaining, () => this.spawnIveaPackage(delivery));
        });
    }

    saveIveaDeliveries() {
        localStorage.setItem('waitress_ivea_deliveries', JSON.stringify(this.iveaPendingDeliveries));
    }

    queueIveaDelivery(item) {
        const deliveryTime = 120000;
        const delivery = {
            id: item.id,
            name: item.name,
            emoji: item.emoji,
            price: item.price,
            target: item.target || 'house',
            orderTime: Date.now(),
            deliveryTime: deliveryTime
        };

        this.iveaPendingDeliveries.push(delivery);
        this.saveIveaDeliveries();

        if (delivery.target === 'house') {
            this.time.delayedCall(deliveryTime, () => {
                if (this.scene && this.scene.isActive()) {
                    this.spawnIveaPackage(delivery);
                }
            });
        }

        this.showMessage(`📦 Ordine effettuato: ${item.name}!`, '#2ecc71');
    }

    spawnIveaPackage(delivery) {
        if (delivery.target === 'restaurant') return;

        this.iveaPendingDeliveries = this.iveaPendingDeliveries.filter(d => d.orderTime !== delivery.orderTime);
        this.saveIveaDeliveries();

        const entryX = 200;
        const entryY = 520;

        if (this.textures.exists('pacco')) {
            this.iveaPackageSprite = this.add.image(entryX, entryY, 'pacco')
                .setDepth(20)
                .setDisplaySize(48, 48);
        } else {
            this.iveaPackageSprite = this.add.text(entryX, entryY, '📦', {
                fontSize: '36px'
            }).setOrigin(0.5).setDepth(20);
        }

        this.iveaPackageSprite.setScale(0.3);
        this.iveaPackageSprite.y = 600;

        this.tweens.add({
            targets: this.iveaPackageSprite,
            y: entryY,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        this.iveaPackageGlow = this.add.graphics()
            .setDepth(18)
            .fillStyle(0x3498db, 0.25)
            .fillCircle(entryX, entryY, 38);

        this.tweens.add({
            targets: this.iveaPackageGlow,
            alpha: 0.05,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.iveaPackageZone = this.add.zone(entryX, entryY, 70, 70)
            .setDepth(19)
            .setInteractive({ useHandCursor: true });

        this.iveaPackageZone.on('pointerdown', () => {
            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, entryX, entryY
            );
            if (dist <= 100) {
                this.openIveaPackage(delivery);
            }
        });
    }

    openIveaPackage(delivery) {
        if (this.iveaPackageSprite) { this.iveaPackageSprite.destroy(); this.iveaPackageSprite = null; }
        if (this.iveaPackageZone) { this.iveaPackageZone.destroy(); this.iveaPackageZone = null; }
        if (this.iveaPackageGlow) { this.iveaPackageGlow.destroy(); this.iveaPackageGlow = null; }

        this.iveaPlacementMode = true;
        this.iveaItemToPlace = delivery;

        this.iveaPlacementPreview = this.add.text(0, 0, delivery.emoji || '📦', {
            fontSize: '32px'
        }).setOrigin(0.5).setDepth(50).setAlpha(0.7);

        this.iveaPlacementHandler = (pointer) => {
            const worldPoint = pointer.positionToCamera(this.cameras.main);
            const x = worldPoint.x;
            const y = worldPoint.y;

            if (x < 50 || x > 750 || y < 50 || y > 550) {
                return;
            }

            this.placeIveaItem(this.iveaItemToPlace, x, y);

            this.iveaPlacementMode = false;
            this.iveaItemToPlace = null;
            if (this.iveaPlacementPreview) {
                this.iveaPlacementPreview.destroy();
                this.iveaPlacementPreview = null;
            }
            this.input.off('pointermove', this.iveaPlacementMoveHandler);
            this.input.off('pointerdown', this.iveaPlacementHandler);
        };

        this.iveaPlacementMoveHandler = (pointer) => {
            if (!this.iveaPlacementMode || !this.iveaPlacementPreview) return;
            const worldPoint = pointer.positionToCamera(this.cameras.main);
            this.iveaPlacementPreview.x = worldPoint.x;
            this.iveaPlacementPreview.y = worldPoint.y;
        };

        this.input.on('pointermove', this.iveaPlacementMoveHandler);
        this.input.on('pointerdown', this.iveaPlacementHandler);
    }

    placeIveaItem(item, x, y) {
        if (!window.HOUSE_STATE.purchased.includes(item.id)) {
            window.HOUSE_STATE.purchased.push(item.id);
        }

        let customPositions = {};
        try {
            customPositions = JSON.parse(localStorage.getItem('waitress_ivea_positions') || '{}');
        } catch(e) {}

        customPositions[item.id] = { x: x, y: y };
        localStorage.setItem('waitress_ivea_positions', JSON.stringify(customPositions));

        this.saveHouseData();

        const saveData = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
        saveData.housePurchased = window.HOUSE_STATE.purchased;
        saveData.score = window.GAME.score;
        localStorage.setItem('waitress_save_data', JSON.stringify(saveData));

        this.spawnPurchasedItems();

        if (window.triggerSfx) window.triggerSfx('coin');
    }

    spawnPurchasedItems() {
        if (this.purchasedSpritesGroup) {
            this.purchasedSpritesGroup.destroy(true);
        }
        this.purchasedSpritesGroup = this.add.group();
        this.interactables = [];

        const purchased = (window.HOUSE_STATE && Array.isArray(window.HOUSE_STATE.purchased)) ? window.HOUSE_STATE.purchased : [];

        let customPositions = {};
        try {
            customPositions = JSON.parse(localStorage.getItem('waitress_ivea_positions') || '{}');
        } catch(e) {}

        const allItems = [
            { id: 'wardrobe', name: 'Armadio', emoji: '🚪' },
            { id: 'coffee_machine', name: 'Macchinetta del Caffè', emoji: '☕', texture: 'casa_macchinetta', width: 40, height: 50, interactable: true, label: 'Caffè', action: 'coffee' },
            { id: 'display_case', name: 'Espositore', emoji: '🖼️' },
            { id: 'house_plant', name: 'Pianta da Interno', emoji: '🪴' },
            { id: 'house_radio', name: 'Radio', emoji: '📻' },
            { id: 'crib', name: 'Culla', emoji: '🛏️' },
            { id: 'double_bed', name: 'Letto Matrimoniale', emoji: '🛋️' },
            { id: 'alarm_system', name: 'Allarme Antifurto', emoji: '🚨' },
            { id: 'resto_tv', name: 'Televisione', emoji: '📺' },
            { id: 'resto_radio', name: 'Radio', emoji: '📻' },
            { id: 'resto_plant', name: 'Pianta', emoji: '🪴' },
            { id: 'smoke_detector', name: 'Rilevatore di Fumo', emoji: '🚨' }
        ];

        purchased.forEach(itemId => {
            const itemInfo = allItems.find(i => i.id === itemId);
            if (!itemInfo) return;

            const custom = customPositions[itemId];
            let x = custom ? custom.x : Phaser.Math.Between(100, 700);
            let y = custom ? custom.y : Phaser.Math.Between(100, 500);

            if (itemInfo.interactable && itemInfo.texture && this.textures.exists(itemInfo.texture)) {
                const container = this.add.container(x, y);
                const img = this.add.image(0, 0, itemInfo.texture).setDisplaySize(itemInfo.width || 40, itemInfo.height || 40);
                container.add(img);
                container.setDepth(5);

                const labelText = this.add.text(0, (itemInfo.height || 40) / 2 + 10, itemInfo.label || itemInfo.name, {
                    fontSize: '12px', color: '#ecf0f1', fontFamily: 'Fredoka',
                    backgroundColor: '#00000088', padding: { x: 6, y: 3 }
                }).setOrigin(0.5);
                container.add(labelText);

                const hitArea = this.add.rectangle(x, y, Math.max(itemInfo.width || 40, 60), Math.max(itemInfo.height || 40, 60), 0xffffff, 0)
                    .setInteractive({ useHandCursor: true })
                    .setDepth(16);

                hitArea.on('pointerdown', () => {
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y);
                    if (dist <= 80) {
                        if (window.triggerSfx) window.triggerSfx('click');
                        if (itemInfo.action === 'coffee') this.doCoffee();
                    }
                });

                this.purchasedSpritesGroup.add(container);
                this.purchasedSpritesGroup.add(hitArea);
                this.interactables.push({ id: itemId, x: x, y: y, action: itemInfo.action });
            } else {
                const iconTxt = this.add.text(x, y, itemInfo.emoji, { fontSize: '28px' }).setOrigin(0.5).setDepth(5);
                const labelTxt = this.add.text(x, y + 22, itemInfo.name, {
                    fontSize: '10px', color: '#ffffff', fontFamily: 'Fredoka', backgroundColor: '#00000088', padding: { x: 4, y: 2 }
                }).setOrigin(0.5).setDepth(5);

                this.purchasedSpritesGroup.add(iconTxt);
                this.purchasedSpritesGroup.add(labelTxt);
            }
        });
    }

    clearHtmlInputs() {
        this.allHtmlInputs.forEach(input => {
            if (input && input.parentNode) input.parentNode.removeChild(input);
        });
        this.allHtmlInputs = [];
        this.isTyping = false;
    }

    createSafeHtmlInput() {
        const input = document.createElement('input');
        const gameContainer = document.getElementById('game-container') || document.body;

        Object.assign(input.style, {
            position: 'absolute', background: 'transparent', color: '#ffffff',
            border: 'none', outline: 'none', fontFamily: 'Fredoka', fontSize: '16px', zIndex: '1000'
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
                        this.add.rectangle(x, y, TILE, TILE, 0x111111).setDepth(1);
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
            if (this.isTyping || this.isComputerOpen || this.iveaPlacementMode) return;
            if (event.key === 'w' || event.key === 'W') this.moveDirection.y = -1;
            if (event.key === 's' || event.key === 'S') this.moveDirection.y = 1;
            if (event.key === 'a' || event.key === 'A') this.moveDirection.x = -1;
            if (event.key === 'd' || event.key === 'D') this.moveDirection.x = 1;
        });

        this.input.keyboard.on('keyup', (event) => {
            if (['w','W','s','S'].includes(event.key)) this.moveDirection.y = 0;
            if (['a','A','d','D'].includes(event.key)) this.moveDirection.x = 0;
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (this.isComputerOpen && this.scrollableContentContainer) {
                if (this.currentMenuTab === 'upgrades' || this.currentMenuTab === 'ivea' || this.currentMenuTab === 'hiddenvault') {
                    this.scrollOffsetY = Phaser.Math.Clamp(this.scrollOffsetY - deltaY * 0.5, -250, 0);
                    this.scrollableContentContainer.setY(this.scrollOffsetY);
                }
            }
        });
    }

    update() {
        if (!this.player || !this.player.body || this.isComputerOpen || this.isTyping || this.iveaPlacementMode) {
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

        if (!this.isLeaving && this.player.y >= 555) {
            this.goToWork();
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
        });
    }

    doCoffee() {
        if (this.coffeeUsedToday) {
            this.showFloatingText(this.player.x, this.player.y - 40, '☕ Hai già preso il caffè oggi!', '#f39c12');
            return;
        }

        if (this.coffeeInProgress) {
            return;
        }

        const COFFEE_COST = 1;

        if (window.GAME.score < COFFEE_COST) {
            this.showFloatingText(this.player.x, this.player.y - 40, '❌ Non hai abbastanza soldi!', '#e74c3c');
            return;
        }

        const hasMaxLives = window.GAME.lives >= MAX_LIVES;

        this.coffeeInProgress = true;

        window.GAME.score -= COFFEE_COST;

        const saveData = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
        saveData.score = window.GAME.score;
        localStorage.setItem('waitress_save_data', JSON.stringify(saveData));

        this.updateHouseHUD();

        this.showFloatingText(this.player.x, this.player.y - 40, '☕ Preparando il caffè...', '#f39c12');

        this.playCoffeeSound();

        this.time.delayedCall(3000, () => {
            this.coffeeInProgress = false;
            this.coffeeUsedToday = true;
            localStorage.setItem('waitress_coffee_day', String(window.GAME.level || 1));

            if (!hasMaxLives && window.GAME.lives < MAX_LIVES) {
                window.GAME.lives = Math.min(MAX_LIVES, window.GAME.lives + 1);

                const saveData2 = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
                saveData2.lives = window.GAME.lives;
                localStorage.setItem('waitress_save_data', JSON.stringify(saveData2));

                this.showFloatingText(this.player.x, this.player.y - 40, '❤️ +1 Vita!', '#2ecc71');
            } else {
                localStorage.setItem('waitress_coffee_sprint', 'true');
                this.showFloatingText(this.player.x, this.player.y - 40, '⚡ Sprint per il prossimo turno!', '#f1c40f');
            }

            this.updateHouseHUD();
        });
    }

    playCoffeeSound() {
        try {
            if (this.sound.get('caffe')) {
                this.sound.play('caffe', { volume: 0.7 });
                return;
            }

            const audio = new Audio('assets/audio/caffe.wav');
            audio.volume = 0.7;
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    const altAudio = new Audio('assets/audio/caffè.wav');
                    altAudio.volume = 0.7;
                    altAudio.play().catch(() => {});
                });
            }
        } catch (e) {}
    }

    doSleep() {
        if (!window.GAME || typeof window.GAME.level !== 'number') {
            return;
        }

        this.cameras.main.fadeOut(1000, 0, 0, 0);

        this.time.delayedCall(1000, () => {
            const previousLevel = window.GAME.level;

            window.GAME.level = previousLevel + 1;
            window.GAME.lives = MAX_LIVES;
            window.GAME.customersServed = 0;
            window.GAME.dirtyPlates = 0;
            window.GAME.carriedOrder = null;
            window.GAME.customersTarget = 6 + (window.GAME.level * 4);

            this.coffeeUsedToday = false;
            localStorage.removeItem('waitress_coffee_day');
            localStorage.removeItem('waitress_coffee_sprint');

            const saveData = {
                score: window.GAME.score,
                level: window.GAME.level,
                customersServed: 0,
                lives: MAX_LIVES,
                dirtyPlates: 0,
                settings: window.GAME.settings,
                housePurchased: window.HOUSE_STATE ? window.HOUSE_STATE.purchased : []
            };
            localStorage.setItem('waitress_save_data', JSON.stringify(saveData));

            this.cameras.main.fadeIn(1000, 0, 0, 0);
            this.updateHouseHUD();

            this.showFloatingText(400, 300, `☀️ Giorno ${window.GAME.level}!`, '#ffd700');
        });
    }

    openComputerHub() {
        if (this.isComputerOpen) return;
        this.isComputerOpen = true;
        this.currentMenuTab = 'upgrades';
        this.scrollOffsetY = 0;
        this.renderComputerUI();
    }

    destroyComputerUI() {
        if (this.computerUIContainer) {
            this.computerUIContainer.destroy();
            this.computerUIContainer = null;
        }
        this.scrollableContentContainer = null;
        this.clearHtmlInputs();
    }

    renderComputerUI() {
        this.destroyComputerUI();

        this.computerUIContainer = this.add.container(0, 0).setDepth(200).setScrollFactor(0);
        this.computerUIContainer.add(this.add.rectangle(400, 300, 600, 500, 0x110906, 0.97).setStrokeStyle(2, 0xd27d2d));
        this.computerUIContainer.add(this.add.text(400, 70, '💻 COMPUTER', { fontSize: '24px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5));

        const closeBtn = this.add.text(670, 65, '✖', { fontSize: '28px', color: '#e74c3c', fontStyle: 'bold' }).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.closeComputerHub());
        this.computerUIContainer.add(closeBtn);

        const tabs = [
            { id: 'upgrades', label: 'Potenziamenti' },
            { id: 'social', label: 'SOCIAL NETWORK' },
            { id: 'stats', label: 'STATISTICHE' },
            { id: 'search', label: 'WEB' }
        ];

        tabs.forEach((tab, i) => {
            const x = 190 + i * 140;
            const btn = this.add.rectangle(x, 115, 125, 28, this.currentMenuTab === tab.id ? 0xd27d2d : 0x2c1a11).setInteractive({ useHandCursor: true });
            const btnText = this.add.text(x, 115, tab.label, { fontSize: '11px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
            btn.on('pointerdown', () => { this.currentMenuTab = tab.id; this.scrollOffsetY = 0; this.renderComputerUI(); });
            this.computerUIContainer.add(btn);
            this.computerUIContainer.add(btnText);
        });

        if (this.currentMenuTab === 'upgrades') this.renderUpgradesContent();
        else if (this.currentMenuTab === 'social') this.renderSocialContent();
        else if (this.currentMenuTab === 'stats') this.renderStatsContent();
        else if (this.currentMenuTab === 'search') this.renderSearchContent();
        else if (this.currentMenuTab === 'ivea') this.renderIveaShopContent();
        else if (this.currentMenuTab === 'hiddenvault') this.renderHiddenVaultStoreContent();
    }

    renderUpgradesContent() {
        const upgrades = [
            { id: 'notebook', name: 'Taccuino Intelligente', desc: 'Comande max: +2', cost: 300, maxLevel: 5 },
            { id: 'ads', name: 'Campagna Pubblicitaria', desc: 'Aumenta del 20% i clienti', cost: 500, maxLevel: 1 },
            { id: 'cards', name: 'Mazzo di Carte', desc: 'Intrattiene i clienti più anziani', cost: 150, maxLevel: 10 },
            { id: 'wifi', name: '5G', desc: 'Miglioramento della connessione', cost: 500, maxLevel: 1 },
            { id: 'internetwork', name: 'VPN', desc: 'Maggiore sicurezza online', cost: 500, maxLevel: 1 },
            { id: 'amica di tutti', name: 'Amica di Tutti', desc: 'Aumenta la sintonia con i clienti', cost: 800, maxLevel: 5 },
            { id: 'shopping', name: 'Cliente esperta', desc: 'Sconto 30% sui prodotti online', cost: 1000, maxLevel: 1 }
        ];

        const savedUpgrades = JSON.parse(localStorage.getItem('waitress_house_upgrades') || '{}');

        const maskShape = this.make.graphics();
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(110, 140, 580, 390);
        const mask = maskShape.createGeometryMask();

        this.scrollableContentContainer = this.add.container(0, this.scrollOffsetY);
        this.scrollableContentContainer.setMask(mask);
        this.computerUIContainer.add(this.scrollableContentContainer);

        upgrades.forEach((upg, i) => {
            const yPos = 165 + i * 46;
            const currentLvl = savedUpgrades[upg.id] || 0;
            const isMaxed = currentLvl >= upg.maxLevel;
            const cost = Math.floor(upg.cost * (1 + currentLvl * 0.2));

            const card = this.add.rectangle(400, yPos, 520, 40, 0x222222, 0.85).setStrokeStyle(1, 0x444444);
            const nameTxt = this.add.text(150, yPos - 8, upg.name, { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);
            const descTxt = this.add.text(150, yPos + 8, `${upg.desc} (Lv. ${currentLvl}/${upg.maxLevel})`, { fontSize: '10px', color: '#aaaaaa', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);

            const buyBtn = this.add.rectangle(610, yPos, 70, 26, isMaxed ? 0x555555 : 0x27ae60).setInteractive({ useHandCursor: true });
            const btnText = this.add.text(610, yPos, isMaxed ? 'MAX' : `${cost}€`, { fontSize: '11px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

            this.scrollableContentContainer.add([card, nameTxt, descTxt, buyBtn, btnText]);

            if (!isMaxed) {
                buyBtn.on('pointerdown', () => {
                    if (window.GAME.score >= cost) {
                        window.GAME.score -= cost;
                        savedUpgrades[upg.id] = (savedUpgrades[upg.id] || 0) + 1;
                        localStorage.setItem('waitress_house_upgrades', JSON.stringify(savedUpgrades));

                        const saveData = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
                        saveData.score = window.GAME.score;
                        localStorage.setItem('waitress_save_data', JSON.stringify(saveData));

                        this.updateHouseHUD();
                        this.renderComputerUI();
                    }
                });
            }
        });
    }

    renderSocialContent() {
        let nickname = localStorage.getItem('waitress_nickname') || 'Cameriera';

        this.computerUIContainer.add(this.add.text(400, 160, '👤 IL TUO PROFILO', { fontSize: '18px', color: '#ffd700', fontFamily: 'Fredoka', fontStyle: 'bold' }).setOrigin(0.5));
        this.computerUIContainer.add(this.add.text(400, 190, `Nickname: ${nickname}`, { fontSize: '14px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0.5));

        const input = this.createSafeHtmlInput();
        input.value = nickname;
        input.placeholder = 'Inserisci il tuo nome...';
        input.style.top = '220px';
        input.style.left = '50%';
        input.style.transform = 'translateX(-50%)';
        input.style.width = '220px';
        input.style.padding = '6px';
        input.style.borderRadius = '6px';
        input.style.border = '2px solid #d27d2d';
        input.style.background = '#1a0a04';
        input.style.fontSize = '14px';

        const saveBtn = this.add.rectangle(400, 270, 130, 30, 0xd27d2d).setInteractive({ useHandCursor: true });
        this.computerUIContainer.add(saveBtn);
        this.computerUIContainer.add(this.add.text(400, 270, 'SALVA', { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5));

        saveBtn.on('pointerdown', () => {
            const newName = input.value.trim() || 'Cameriera';
            localStorage.setItem('waitress_nickname', newName);
            this.renderComputerUI();
        });

        this.computerUIContainer.add(this.add.text(400, 320, '📋 CLIENTI CONOSCIUTI', { fontSize: '15px', color: '#ffd700', fontFamily: 'Fredoka', fontStyle: 'bold' }).setOrigin(0.5));

        const relationships = JSON.parse(localStorage.getItem('waitress_npc_relationships') || '{}');
        const npcList = Object.keys(window.NPC_CONFIG || {});

        npcList.forEach((npcName, index) => {
            const relation = relationships[npcName] || 50;
            const relationColor = relation >= 80 ? '#2ecc71' : relation >= 50 ? '#f39c12' : '#e74c3c';
            const relationText = `${npcName} - ${relation}%`;

            const y = 350 + (index * 22);
            this.computerUIContainer.add(this.add.text(400, y, relationText, { fontSize: '12px', color: relationColor, fontFamily: 'Fredoka' }).setOrigin(0.5));
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
            this.computerUIContainer.add(this.add.text(400, 180 + i * 35, stat, { fontSize: '16px', color: '#ecf0f1', fontFamily: 'Fredoka' }).setOrigin(0.5));
        });
    }

    renderSearchContent() {
        this.computerUIContainer.add(this.add.text(400, 180, 'Gugol', { fontSize: '42px', color: '#d27d2d', fontFamily: 'Fredoka', fontStyle: 'bold' }).setOrigin(0.5));
        this.computerUIContainer.add(this.add.rectangle(400, 240, 420, 45, 0x222222).setStrokeStyle(2, 0x777777));
        this.computerUIContainer.add(this.add.text(210, 240, '🔍', { fontSize: '18px', color: '#aaaaaa' }).setOrigin(0.5));

        const searchInput = this.createSafeHtmlInput();
        searchInput.placeholder = 'Cerca nel web...';
        this.positionHtmlInput(searchInput, 240, 225, 320);
        searchInput.style.border = 'none';
        searchInput.style.background = 'transparent';
        searchInput.style.fontSize = '15px';

        const searchBtn = this.add.rectangle(400, 300, 150, 35, 0xd27d2d).setInteractive({ useHandCursor: true });
        this.computerUIContainer.add(searchBtn);
        this.computerUIContainer.add(this.add.text(400, 300, 'Cerca', { fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5));

        const resultsText = this.add.text(400, 380, '', {
            fontSize: '13px', color: '#ffffff', fontFamily: 'Fredoka', align: 'center', wordWrap: { width: 380 }
        }).setOrigin(0.5);
        this.computerUIContainer.add(resultsText);

        const searchDatabase = {
            'polizia': '🌐 Accesso al casellario giudiziale in corso.',
            'hiddenvault.com': '🌐 Accesso al Dark Web consentito...',
            'hiddenvault': '🌐 Accesso al Dark Web consentito...',
            'ivea': '🛋️ Apertura IVEA Store in corso...',
            'default': '🔍 Nessun risultato trovato.'
        };

        searchBtn.on('pointerdown', () => {
            const query = searchInput.value.trim().toLowerCase();
            const result = searchDatabase[query] || searchDatabase['default'];
            resultsText.setText(result);

            if (query === 'ivea') {
                this.time.delayedCall(400, () => {
                    this.currentMenuTab = 'ivea';
                    this.scrollOffsetY = 0;
                    this.renderComputerUI();
                });
            } else if (query === 'hiddenvault.com' || query === 'hiddenvault') {
                this.time.delayedCall(400, () => {
                    this.currentMenuTab = 'hiddenvault';
                    this.scrollOffsetY = 0;
                    this.renderComputerUI();
                });
            }
        });
    }

    renderIveaShopContent() {
        const headerBg = this.add.rectangle(400, 160, 540, 40, 0x0051ba).setStrokeStyle(2, 0xffda1a);
        const logoText = this.add.text(150, 160, 'IVEA', { fontSize: '22px', color: '#ffda1a', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);
        const subText = this.add.text(230, 160, 'Arredamento per Casa & Ristorante', { fontSize: '11px', color: '#ffffff', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);
        this.computerUIContainer.add([headerBg, logoText, subText]);

        const catCasaBtn = this.add.rectangle(300, 200, 120, 25, this.iveaCategory === 'casa' ? 0xffda1a : 0x222222).setInteractive({ useHandCursor: true });
        const catCasaTxt = this.add.text(300, 200, '🏠 CASA', { fontSize: '11px', color: this.iveaCategory === 'casa' ? 0x0051ba : '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

        const catRistoBtn = this.add.rectangle(500, 200, 120, 25, this.iveaCategory === 'ristorante' ? 0xffda1a : 0x222222).setInteractive({ useHandCursor: true });
        const catRistoTxt = this.add.text(500, 200, '🍽️ RISTORANTE', { fontSize: '11px', color: this.iveaCategory === 'ristorante' ? 0x0051ba : '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

        catCasaBtn.on('pointerdown', () => { this.iveaCategory = 'casa'; this.scrollOffsetY = 0; this.renderComputerUI(); });
        catRistoBtn.on('pointerdown', () => { this.iveaCategory = 'ristorante'; this.scrollOffsetY = 0; this.renderComputerUI(); });

        this.computerUIContainer.add([catCasaBtn, catCasaTxt, catRistoBtn, catRistoTxt]);

        const itemsCasa = [
            { id: 'wardrobe', name: 'Armadio', price: 120, emoji: '🚪', desc: 'Capiente armadio per organizzare i tuoi abiti.', target: 'house' },
            { id: 'coffee_machine', name: 'Macchinetta del Caffè', price: 140, emoji: '☕', desc: 'Un po\' di caffeina non fa mai male', target: 'house' },
            { id: 'display_case', name: 'Espositore', price: 180, emoji: '🖼️', desc: 'Esponi i tuoi risultati.', target: 'house' },
            { id: 'house_plant', name: 'Pianta da Interno', price: 30, emoji: '🪴', desc: 'Rende l\'ambiente più accogliente e rilassante.', target: 'house' },
            { id: 'house_radio', name: 'Radio', price: 75, emoji: '📻', desc: 'Diffonde musica d\'ambiente nel locale.', target: 'house' },
            { id: 'crib', name: 'Culla', price: 200, emoji: '🛏️', desc: 'Culla per bimbi piccoli', target: 'house' },
            { id: 'double_bed', name: 'Letto Matrimoniale', price: 350, emoji: '🛋️', desc: 'Grande letto per una grande famiglia.', target: 'house' },
            { id: 'alarm_system', name: 'Allarme Antifurto', price: 300, emoji: '🚨', desc: 'Protegge la tua casa da intrusioni e furti.', target: 'house' }
        ];

        const itemsRistorante = [
            { id: 'resto_tv', name: 'Televisione', price: 1500, emoji: '📺', desc: 'Intrattiene e aumenta la pazienza dei clienti.', target: 'restaurant' },
            { id: 'resto_radio', name: 'Radio', price: 120, emoji: '📻', desc: 'Diffonde musica d\'ambiente nel locale.', target: 'restaurant' },
            { id: 'resto_plant', name: 'Pianta', price: 50, emoji: '🪴', desc: 'Abbellisce la sala del ristorante.', target: 'restaurant' },
            { id: 'smoke_detector', name: 'Rilevatore di Fumo', price: 250, emoji: '🚨', desc: 'Garantisce la sicurezza antincendio in cucina.', target: 'restaurant' }
        ];

        const activeList = this.iveaCategory === 'casa' ? itemsCasa : itemsRistorante;

        const maskShape = this.make.graphics();
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(110, 220, 580, 300);
        const mask = maskShape.createGeometryMask();

        this.scrollableContentContainer = this.add.container(0, this.scrollOffsetY);
        this.scrollableContentContainer.setMask(mask);
        this.computerUIContainer.add(this.scrollableContentContainer);

        const purchasedList = (window.HOUSE_STATE && window.HOUSE_STATE.purchased) ? window.HOUSE_STATE.purchased : [];

        activeList.forEach((item, i) => {
            const yPos = 250 + i * 55;
            const purchased = purchasedList.includes(item.id);
            const isPending = this.iveaPendingDeliveries.some(d => d.id === item.id);

            const card = this.add.rectangle(400, yPos, 520, 48, 0x1f2937).setStrokeStyle(1, 0x374151);
            const icon = this.add.text(150, yPos, item.emoji || '📦', { fontSize: '22px' }).setOrigin(0.5);
            const title = this.add.text(180, yPos - 8, item.name, { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);
            const desc = this.add.text(180, yPos + 8, item.desc || '', { fontSize: '10px', color: '#9ca3af', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);

            let btnColor = purchased ? 0x4b5563 : (isPending ? 0xf39c12 : 0x059669);
            let btnLabel = purchased ? 'POSSEDUTO' : (isPending ? 'IN CONSEGNA...' : `${item.price}€`);

            const buyBtn = this.add.rectangle(610, yPos, 80, 26, btnColor).setInteractive({ useHandCursor: true });
            const buyTxt = this.add.text(610, yPos, btnLabel, { fontSize: '10px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

            this.scrollableContentContainer.add([card, icon, title, desc, buyBtn, buyTxt]);

            if (!purchased && !isPending) {
                buyBtn.on('pointerdown', () => {
                    if (window.GAME && window.GAME.score >= item.price) {
                        window.GAME.score -= item.price;

                        const saveData = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
                        saveData.score = window.GAME.score;
                        localStorage.setItem('waitress_save_data', JSON.stringify(saveData));

                        this.updateHouseHUD();
                        this.queueIveaDelivery(item);
                        this.renderComputerUI();
                    }
                });
            }
        });
    }

    renderHiddenVaultStoreContent() {
        const headerBg = this.add.rectangle(400, 160, 540, 40, 0x052e16).setStrokeStyle(2, 0x22c55e);
        const logoText = this.add.text(150, 160, '🌐 HIDDEN VAULT', { fontSize: '20px', color: '#22c55e', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);
        const subText = this.add.text(340, 160, 'Dark Web Marketplace', { fontSize: '11px', color: '#86efac', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);
        this.computerUIContainer.add([headerBg, logoText, subText]);

        const items = [
            { id: 'poison', name: 'Veleno', price: 150, emoji: '🧪', desc: 'Avvelena un piatto senza uccidere' },
            { id: 'fake_pos', name: 'POS Contraffatto', price: 250, emoji: '💳', desc: 'Raddoppia le entrate del giorno' },
            { id: 'vpn', name: 'VPN', price: 200, emoji: '🛡️', desc: 'Dimezza il sospetto dal dark web' },
            { id: 'compartment', name: 'Scomparto Segreto', price: 300, emoji: '📦', desc: 'Nasconde oggetti illegali dalla finanza' }
        ];

        const maskShape = this.make.graphics();
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(110, 190, 580, 330);
        const mask = maskShape.createGeometryMask();

        this.scrollableContentContainer = this.add.container(0, this.scrollOffsetY);
        this.scrollableContentContainer.setMask(mask);
        this.computerUIContainer.add(this.scrollableContentContainer);

        if (!this.crime && typeof CrimeSystem !== 'undefined') {
            this.crime = new CrimeSystem(this);
        }

        items.forEach((item, i) => {
            const yPos = 225 + i * 55;
            const owned = this.crime ? (
                (item.id === 'poison' && this.crime.hasPoison) ||
                (item.id === 'fake_pos' && this.crime.hasFakePOS) ||
                (item.id === 'vpn' && this.crime.hasVPN) ||
                (item.id === 'compartment' && this.crime.hasSecretCompartment)
            ) : false;

            const card = this.add.rectangle(400, yPos, 520, 48, 0x0f172a).setStrokeStyle(1, 0x1e293b);
            const icon = this.add.text(150, yPos, item.emoji, { fontSize: '22px' }).setOrigin(0.5);
            const title = this.add.text(180, yPos - 8, item.name, { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);
            const desc = this.add.text(180, yPos + 8, item.desc, { fontSize: '10px', color: '#94a3b8', fontFamily: 'Fredoka' }).setOrigin(0, 0.5);

            let btnColor = owned ? 0x475569 : 0x166534;
            let btnLabel = owned ? 'POSSEDUTO' : `${item.price}€`;

            const buyBtn = this.add.rectangle(610, yPos, 80, 26, btnColor).setInteractive({ useHandCursor: true });
            const buyTxt = this.add.text(610, yPos, btnLabel, { fontSize: '10px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

            this.scrollableContentContainer.add([card, icon, title, desc, buyBtn, buyTxt]);

            if (!owned) {
                buyBtn.on('pointerdown', () => {
                    if (window.GAME && window.GAME.score >= item.price) {
                        window.GAME.score -= item.price;

                        const saveData = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
                        saveData.score = window.GAME.score;
                        localStorage.setItem('waitress_save_data', JSON.stringify(saveData));

                        this.updateHouseHUD();

                        if (this.crime) {
                            this.crime.inventory.push(item.id);
                            if (item.id === 'poison') { this.crime.hasPoison = true; this.crime.addSuspicion(15, 'darkweb'); }
                            if (item.id === 'fake_pos') { this.crime.hasFakePOS = true; this.crime.addSuspicion(20, 'darkweb'); }
                            if (item.id === 'vpn') this.crime.hasVPN = true;
                            if (item.id === 'compartment') this.crime.hasSecretCompartment = true;
                            this.crime.darkWebAccessCount++;
                            this.crime.saveCrimeData();
                        }
                        this.renderComputerUI();
                    }
                });
            }
        });
    }

    closeComputerHub() {
        this.isComputerOpen = false;
        this.destroyComputerUI();
        this.spawnPurchasedItems();
    }

    showMessage(text, color = '#ffffff') {
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
            totalEarned: 0,
            levelsCompleted: 0,
            bonuses: { steelBladder: 0, tipsBoost: 0, patienceBoost: 0 },
            totalRentPaid: 0
        };
        this.saveHouseData();
    }

    saveHouseData() {
        if (!this.houseData) this.initHouseData();
        if (window.HOUSE_STATE) {
            this.houseData.purchased = window.HOUSE_STATE.purchased;
        }
        localStorage.setItem('waitress_house_data', JSON.stringify(this.houseData));
    }

    calculateRentDue() {
        const level = (window.GAME && window.GAME.level) ? window.GAME.level : (this.houseData ? this.houseData.levelsCompleted || 0 : 0);
        return HOUSE_CONFIG.rent.base + (level * HOUSE_CONFIG.rent.increasePerLevel);
    }
}

window.HouseScene = HouseScene;