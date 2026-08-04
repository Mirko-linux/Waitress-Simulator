const HOUSE_CONFIG = {
    rent: {
        base: 50,
        increasePerLevel: 15,
        dueEvery: 3 
    },
    rooms: {
        soggiorno: { x: 400, y: 300, name: 'Soggiorno', emoji: '🛋️' },
        camera: { x: 400, y: 150, name: 'Camera', emoji: '🛏️' },
        cucina: { x: 200, y: 300, name: 'Cucina', emoji: '🍳' },
        studio: { x: 600, y: 300, name: 'Studio', emoji: '💻' },
        bagno: { x: 400, y: 450, name: 'Bagno', emoji: '🚿' }
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
        this.currentRoom = 'soggiorno';
        this.cameraOffset = { x: 0, y: 0 };
        this.roomObjects = {};
        this.player = null;
        this.isMoving = false;
        this.cheatActivated = false;
    }

    create() {
        this.loadHouseData();
        this.createHouseBackground();
        this.createPlayer();
        this.createRooms();
        this.createHouseHUD();
        this.setupControls();

        this.cameras.main.setBounds(0, 0, 1200, 800);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.showWelcomeMessage();
        window.houseScene = this;
    }

    
    
    
    createHouseHUD() {
        const hudBg = this.add.rectangle(400, 25, 780, 40, 0x110906, 0.9)
            .setStrokeStyle(1.5, 0xd27d2d)
            .setDepth(150)
            .setScrollFactor(0);

        this.hudEarnedText = this.add.text(30, 16, `💰 Risparmi: ${this.houseData.totalEarned}€`, {
            fontSize: '14px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setDepth(151).setScrollFactor(0);

        this.hudRentText = this.add.text(260, 16, `📦 Affitto: ${this.calculateRentDue()}€`, {
            fontSize: '14px',
            color: '#e74c3c',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setDepth(151).setScrollFactor(0);

        const workBtn = this.add.rectangle(680, 25, 160, 30, 0x27ae60)
            .setInteractive({ useHandCursor: true })
            .setDepth(151)
            .setScrollFactor(0);

        this.add.text(680, 25, '🏃 VAI AL LAVORO', {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(152).setScrollFactor(0);

        workBtn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            this.scene.start('Game');
        });

        workBtn.on('pointerover', () => workBtn.setFillStyle(0x2ecc71));
        workBtn.on('pointerout', () => workBtn.setFillStyle(0x27ae60));
    }

    
    
    
    loadHouseData() {
        const saved = localStorage.getItem('waitress_house_data');
        if (saved) {
            try {
                this.houseData = JSON.parse(saved);
                if (this.houseData.achievements) {
                    HOUSE_CONFIG.achievements = this.houseData.achievements;
                }
            } catch(e) {
                this.initHouseData();
            }
        } else {
            this.initHouseData();
        }
    }

    initHouseData() {
        this.houseData = {
            rentPaid: 0,
            totalEarned: 0,
            levelsCompleted: 0,
            totalCustomers: 0,
            bonuses: {
                steelBladder: 0,
                tipsBoost: 0,
                patienceBoost: 0
            },
            achievements: HOUSE_CONFIG.achievements,
            lastRentLevel: 0,
            totalRentPaid: 0
        };
        this.saveHouseData();
    }

    saveHouseData() {
        this.houseData.achievements = HOUSE_CONFIG.achievements;
        localStorage.setItem('waitress_house_data', JSON.stringify(this.houseData));
    }

    
    
    
    createHouseBackground() {
        const bg = this.add.graphics();
        bg.fillStyle(0x2c1810);
        bg.fillRect(0, 0, 1200, 800);

        for (let x = 0; x < 1200; x += 60) {
            for (let y = 0; y < 800; y += 60) {
                const color = (x + y) % 120 === 0 ? 0x3d2418 : 0x2c1810;
                bg.fillStyle(color);
                bg.fillRect(x, y, 60, 60);
            }
        }

        this.add.text(50, 50, '🏠 CASA DELLA CAMERIERA', {
            fontSize: '18px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setDepth(100);
    }

    
    
    
    createPlayer() {
        this.player = this.add.text(400, 300, '👩‍🍳', {
            fontSize: '42px'
        }).setOrigin(0.5).setDepth(50);

        this.playerShadow = this.add.ellipse(400, 320, 30, 10, 0x000000, 0.3).setDepth(49);
    }

    
    
    
    createRooms() {
        this.createRoom('soggiorno', 400, 300, [
            { type: 'divano', x: 400, y: 280, emoji: '🛋️', label: 'Riposati', action: 'rest' },
            { type: 'tv', x: 450, y: 250, emoji: '📺', label: 'TV', action: 'tv' },
            { type: 'tavolo', x: 350, y: 320, emoji: '🪑', label: 'Tavolo' }
        ]);

        this.createRoom('camera', 400, 130, [
            { type: 'letto', x: 400, y: 130, emoji: '🛏️', label: 'Dormi', action: 'sleep' },
            { type: 'armadio', x: 320, y: 100, emoji: '🚪', label: 'Armadio' }
        ]);

        this.createRoom('cucina', 200, 300, [
            { type: 'frigo', x: 180, y: 280, emoji: '🧊', label: 'Frigo', action: 'fridge' },
            { type: 'fornello', x: 220, y: 320, emoji: '🔥', label: 'Cucina' }
        ]);

        this.createRoom('studio', 600, 300, [
            { type: 'computer', x: 600, y: 280, emoji: '💻', label: 'Computer', action: 'computer' },
            { type: 'libri', x: 650, y: 320, emoji: '📚', label: 'Libreria' },
            { type: 'bonus', x: 550, y: 320, emoji: '⭐', label: 'Bonus Shop', action: 'shop' }
        ]);

        this.createRoom('bagno', 400, 450, [
            { type: 'doccia', x: 400, y: 450, emoji: '🚿', label: 'Doccia', action: 'shower' },
            { type: 'specchio', x: 350, y: 430, emoji: '🪞', label: 'Specchio' }
        ]);

        this.createRoomSigns();
    }

    createRoom(roomId, x, y, objects) {
        const roomArea = this.add.rectangle(x, y, 350, 280, 0x000000, 0.05).setDepth(1);

        this.add.text(x, y - 120,
            `${HOUSE_CONFIG.rooms[roomId].emoji} ${HOUSE_CONFIG.rooms[roomId].name}`,
            {
                fontSize: '18px',
                color: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }
        ).setOrigin(0.5).setDepth(5);

        objects.forEach(obj => {
            const objContainer = this.add.container(obj.x, obj.y);

            const icon = this.add.text(0, -10, obj.emoji, { fontSize: '32px' }).setOrigin(0.5);
            const label = this.add.text(0, 20, obj.label, {
                fontSize: '10px',
                color: '#ecf0f1',
                fontFamily: 'Fredoka',
                backgroundColor: '#00000088',
                padding: { x: 4, y: 2 }
            }).setOrigin(0.5);

            objContainer.add([icon, label]);
            objContainer.setDepth(10);

            const hitArea = this.add.rectangle(obj.x, obj.y, 60, 60, 0xffffff, 0.01)
                .setInteractive({ useHandCursor: true })
                .setDepth(20);

            hitArea.on('pointerdown', () => {
                this.interactWithObject(obj, hitArea);
            });

            if (!this.roomObjects[roomId]) this.roomObjects[roomId] = [];
            this.roomObjects[roomId].push({
                ...obj,
                icon,
                label,
                container: objContainer,
                hitArea
            });
        });
    }

    createRoomSigns() {
        const signs = [
            { room: 'cucina', x: 120, y: 200, emoji: '🍳' },
            { room: 'soggiorno', x: 400, y: 200, emoji: '🛋️' },
            { room: 'studio', x: 680, y: 200, emoji: '💻' },
            { room: 'camera', x: 400, y: 80, emoji: '🛏️' },
            { room: 'bagno', x: 400, y: 500, emoji: '🚿' }
        ];

        signs.forEach(sign => {
            this.add.text(sign.x, sign.y, sign.emoji, {
                fontSize: '28px',
                backgroundColor: '#00000066',
                padding: { x: 8, y: 4 }
            }).setOrigin(0.5).setDepth(2).setScrollFactor(1);
        });
    }

    
    
    
    interactWithObject(obj) {
        if (this.isMoving) return;
        this.movePlayerTo(obj.x, obj.y, () => {
            this.handleObjectAction(obj);
        });
    }

    handleObjectAction(obj) {
        switch(obj.action) {
            case 'rest':
                this.doRest();
                break;
            case 'sleep':
                this.doSleep();
                break;
            case 'computer':
                this.openComputer();
                break;
            case 'shop':
                this.openBonusShop();
                break;
            case 'tv':
                this.watchTV();
                break;
            case 'fridge':
                this.openFridge();
                break;
            case 'shower':
                this.doShower();
                break;
            default:
                this.showMessage(`${obj.emoji} ${obj.label} - Non c'è niente di speciale qui`);
        }
    }

    
    
    
    movePlayerTo(targetX, targetY, callback) {
        this.isMoving = true;
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY);
        const duration = Math.min(distance * 2, 500);

        this.tweens.add({
            targets: this.player,
            x: targetX,
            y: targetY - 10,
            duration,
            ease: 'Quad.easeInOut',
            onUpdate: () => {
                this.playerShadow.x = this.player.x;
                this.playerShadow.y = this.player.y + 20;
            },
            onComplete: () => {
                this.isMoving = false;
                if (callback) callback();
            }
        });
    }

    
    
    
    setupControls() {
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER
        });

        this.moveDirection = { x: 0, y: 0 };

        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'w' || event.key === 'W') this.moveDirection.y = -1;
            if (event.key === 's' || event.key === 'S') this.moveDirection.y = 1;
            if (event.key === 'a' || event.key === 'A') this.moveDirection.x = -1;
            if (event.key === 'd' || event.key === 'D') this.moveDirection.x = 1;

            if (event.ctrlKey && event.shiftKey && event.key === 'G') {
                this.activateCheat();
            }
        });

        this.input.keyboard.on('keyup', (event) => {
            if (['w','W','s','S'].includes(event.key)) this.moveDirection.y = 0;
            if (['a','A','d','D'].includes(event.key)) this.moveDirection.x = 0;
        });
    }

    
    
    
    activateCheat() {
        if (this.cheatActivated) return;
        this.cheatActivated = true;

        HOUSE_CONFIG.achievements['Cuoco Amico'].unlocked = true;
        this.saveHouseData();

        this.showMessage('🔮 TRUCCO SEGRETO ATTIVATO! Livello completato!', '#ffd700');

        this.cameras.main.shake(300, 0.02);
        this.cameras.main.flash(500, 0xffd700, 0.3);

        this.time.delayedCall(1500, () => {
            this.cheatActivated = false;
            this.scene.start('Game');
        });
    }

    
    
    
    doRest() {
        this.showMessage('🛋️ La cameriera si riposa sul divano... Energia recuperata!', '#2ecc71');
        this.houseData.bonuses.patienceBoost += 0.5;
        this.saveHouseData();
    }

    doSleep() {
        this.showMessage('🛏️ Buonanotte! 💤 La cameriera dorme profondamente...', '#3498db');
        this.houseData.bonuses.patienceBoost += 1;
        this.saveHouseData();
    }

    watchTV() {
        const shows = ['📺 "MasterChef Italia"', '📺 "The Bear"', '📺 "Cucina da Incubo"'];
        const show = shows[Phaser.Math.Between(0, shows.length - 1)];
        this.showMessage(`${show} - Un po' di relax!`, '#ffd700');
    }

    openFridge() {
        const foods = ['🧀 Formaggio', '🥚 Uova', '🥛 Latte', '🍎 Mela', '🥕 Carota'];
        const food = foods[Phaser.Math.Between(0, foods.length - 1)];
        this.showMessage(`🧊 Nel frigo trovi: ${food}!`, '#3498db');
    }

    doShower() {
        this.showMessage('🚿 Doccia rinfrescante! La cameriera è pronta per il prossimo turno!', '#2ecc71');
        this.houseData.bonuses.steelBladder += 0.5;
        this.saveHouseData();
    }
    openComputer() {
        this.computerScene.start('Computer');
    }
}