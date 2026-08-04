{
    const LOCAL_LANGUAGES = {
        'it': { name: 'Italiano', flag: '🇮🇹' },
        'es': { name: 'Español', flag: '🇪🇸' },
        'fr': { name: 'Français', flag: '🇫🇷' },
        'de': { name: 'Deutsch', flag: '🇩🇪' },
        'tr': { name: 'Türkçe', flag: '🇹🇷' },
        'ru': { name: 'Русский', flag: '🇷🇺' },
        'ja': { name: '日本語', flag: '🇯🇵' },
        'pl': { name: 'Polski', flag: '🇵🇱' },
        'hu': { name: 'Magyar', flag: '🇭🇺' },
        'pt': { name: 'Português', flag: '🇵🇹' },
        'pt-BR': { name: 'Português (Brasil)', flag: '🇧🇷' },
        'hi': { name: 'हिन्दी', flag: '🇮🇳' },
        'ko': { name: '한국어', flag: '🇰🇷' },
        'zh': { name: '中文', flag: '🇨🇳' },
        'ar': { name: 'العربية', flag: '🇸🇦' },
        'haw': { name: 'Ōlelo Hawaiʻi', flag: '🌺' },
        'me': { name: 'Crnogorski', flag: '🇲🇪' },
        'ku': { name: 'Kurdî (Kurmancî)', flag: '🌞' }
    };

    const LOCAL_AUTO_TRANSLATIONS = {
        'it': {
            'GIOCA': '▶ GIOCA',
            'IMPOSTAZIONI': '⚙ IMPOSTAZIONI',
            'CREDITI': 'ℹ CREDITI',
            'TORNA': '↩ TORNA AL MENU',
            'VAI A CASA': '🏠 VAI A CASA',
            'GIORNO': '⭐ Giorno',
            'INCASSO': '💰 Incasso:',
            'SERVITI': '👥 Serviti:',
            'VASSOIO': '📋 Vassoio:',
            'PIATTI': '🍽️',
            'LAVELLO': '🚿 LAVELLO',
            'PRONTO': 'Pronto! 👨‍🍳',
            'OCCUPATO': 'Postazione occupata!',
            'LOADING': 'Caricamento...',
            'MENU_TITLE': '🍽️ WAITRESS SIMULATOR',
            'MENU_SUBTITLE': 'SIMULATORE DI CAMERIERA & VITA DA CASALINGA',
            'NOTEPAD_TITLE': '📝 COMANDA',
            'NOTEPAD_EMPTY': 'Taccuino Vuoto',
            'NOTEPAD_READY': 'Pronto per ordini',
            'NOTEPAD_TABLE': 'Tavolo:',
            'DAY_COMPLETE': '⭐ GIORNATA COMPLETATA! ⭐',
            'DAY_FAILED': '💀 GIORNATA FALLITA 💀',
            'DAY_FAILED_DESC': 'Hai perso tutte le vite a causa dei clienti arrabbiati!',
            'SAVINGS_LEFT': '💰 Risparmi rimasti:',
            'DAYS_WORKED': '📅 Giorni lavorati:',
            'FURNITURE_BOUGHT': '🛋️ Mobili acquistati:',
            'AUDIO_SETTINGS': '🔊 Audio di gioco',
            'ACTIVE': 'ATTIVO',
            'DISABLED': 'DISATTIVATO',
            'DIFFICULTY_LEVEL': '📊 Livello di Difficoltà',
            'EASY': 'FACILE',
            'NORMAL': 'NORMALE',
            'HARD': 'DIFFICILE',
            'CONTROL_SYSTEM': '🎮 Sistema di Controlli',
            'KEYBOARD': 'TASTIERA:',
            'LANGUAGE_SELECT': '🌐 Lingua / Language',
            'CREDITS_TITLE': 'ℹ CREDITI DI SVILUPPO',
            'CREDITS_IDEATION': '🎮 IDEAZIONE & CODICE ORIGINALE',
            'CREDITS_SUPPORT': '🏠 CON IL SUPPORTO DI',
            'CREDITS_GRAPHICS': '🎨 GRAFICA & ANIMAZIONI',
            'CREDITS_TECH': '🛠️ TECNOLOGIE INTEGRATE',
            'CREDITS_LICENSE': '📝 LICENZA',
            'ERR_CLOSE_TABLE': '🚫 Avvicinati al tavolo!',
            'ERR_ALREADY_ORDER': '❌ Hai già una comanda!',
            'ERR_SINK_FULL': '🚨 Lavello sovraccarico! Lava i piatti!',
            'ERR_CLOSE_COUNTER': '🚫 Avvicinati al bancone!',
            'ERR_NO_FOOD_SERVED': '❌ Non serviamo questo cibo!',
            'ERR_TRAY_FULL': '❌ Vassoio stracolmo!',
            'ERR_NO_READY_FOOD': '📦 Nessun cibo pronto!',
            'ERR_CLOSE_SINK': '🚫 Avvicinati al lavello!',
            'MSG_ORDER_TAKEN': '📝 Comanda Scritta!',
            'MSG_ORDER_REC': '📝 Ordine preso!',
            'MSG_SERVED': '🍽️ Servito!',
            'MSG_TABLE_CLEARED': '🧹 Tavolo Sbarazzato!',
            'MSG_TABLE_FREE': '🪑 Tavolo libero',
            'FOOD_READY': 'pronto!',
            'FOOD_TAKEN': 'prelevato!',
            'TRICK_CLICKS': '🔑 Trucco:',
            'CLICKS_LEFT': 'clic...',
            'WASHING': '🧼 Lavando...',
            'WASH_CLEAN': '✨ Piatti puliti!',
            'WASH_NONE': '🧼 Nessun piatto',
            'LEAVING_ANGRY': '😡 Se ne va!',
            'TABLE_SHORT': 'Tav.'
        }
    };

    function getLanguages() {
        return window.LANGUAGES || LOCAL_LANGUAGES;
    }

    function getCurrentLang() {
        return window.CURRENT_LANG || localStorage.getItem('waitress_game_lang') || 'it';
    }

    function t(key) {
        if (typeof window.t === 'function' && window.t !== t) {
            const res = window.t(key);
            if (res !== key) return res;
        }

        const lang = getCurrentLang();
        const dicts = window.AUTO_TRANSLATIONS || LOCAL_AUTO_TRANSLATIONS;
        if (dicts && dicts[lang] && dicts[lang][key]) {
            return dicts[lang][key];
        }
        if (dicts && dicts['it'] && dicts['it'][key]) {
            return dicts['it'][key];
        }
        return key;
    }

    function switchLanguage(langCode) {
        if (typeof window.setLanguage === 'function') {
            window.setLanguage(langCode);
        } else {
            window.CURRENT_LANG = langCode;
            localStorage.setItem('waitress_game_lang', langCode);
            if (window.game && window.game.scene) {
                window.game.scene.getScenes(true).forEach(scene => {
                    scene.scene.restart();
                });
            }
        }
    }

    const CONFIG = {
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: { debug: false, gravity: { y: 0 } }
        },
        waitress: {
            speed: 300,
            interactRange: 75
        },
        tray: {
            maxTotal: 4
        },
        customers: {
            patienceDuration: 40000,
            eatingDuration: 3500
        },
        dishes: {
            maxDirty: 8,
            washDuration: 1200
        },
        kitchen: {
            cookingTimes: {
                panino: 3000,
                pizza: 4000,
                patatine: 2500,
                risotto: 4500,
                caponata: 3500,
                acqua: 1000,
                birra: 1500,
                cola: 1200,
                caffe: 1500
            }
        }
    };

    const FOOD_TEXTURES = {
        'Pizza': 'Pizza',
        'Patatine': 'Patatine',
        'Panino': 'Panino',
        'Risotto': 'Risotto',
        'Caponata': 'Caponata',
        'Caffè': 'Caffè',
        'Cola': 'Cola',
        'Acqua': 'Acqua',
        'Birra': 'Birra'
    };

    const NPC_REGISTRY = {
        'Maria': {
            hasTilesheet: false,
            emojiChar: '👩',
            age: 30,
            gender: 'female',
            bio: 'Giovane donna di 30 anni, grande amante della bicicletta.'
        },
        'Elena': {
            hasTilesheet: true,
            key: 'elena_sheet',
            path: 'Elena.jpg',
            frameWidth: 32,
            frameHeight: 32,
            emojiChar: '👩‍🎓',
            age: 20,
            gender: 'female',
            bio: 'Studentessa universitaria sui 20 anni. Gentile ma incasinata con gli studi.',
            adoptTrigger: true
        },
        'Massimo': {
            hasTilesheet: false,
            emojiChar: '👨',
            age: 50,
            gender: 'male',
            bio: 'Ingegnere di 50 anni, classico padre di famiglia.'
        },
        'Francesco': {
            hasTilesheet: false,
            emojiChar: '👱‍♂️',
            age: 25,
            gender: 'male',
            bio: 'Ragazzo innamorato della cameriera che cerca di corteggiarla.',
            patienceMultiplier: 0.5
        },
        'Rosa': {
            hasTilesheet: false,
            emojiChar: '👵',
            age: 80,
            gender: 'female',
            bio: 'Anziana signora di 80 anni, molto gentile e prodiga di consigli.'
        },
        'Chiara': {
            hasTilesheet: false,
            emojiChar: '👩‍🏫',
            age: 40,
            gender: 'female',
            bio: 'Madre di 40 anni, lavora come insegnante.'
        },
        'Sofia': {
            hasTilesheet: false,
            emojiChar: '👩‍💼',
            age: 30,
            gender: 'female',
            bio: 'Donna in carriera sui 30 anni.'
        }
    };

    let GAME = {
        score: 0,
        level: 1,
        customersServed: 0,
        customersTarget: 10,
        lives: 3,
        dirtyPlates: 0,
        carriedOrder: null,
        settings: {
            soundEnabled: true,
            difficulty: 'normale',
            controls: 'wasd'
        }
    };

    let HOUSE_STATE = {
        purchased: [],
        items: [
            { id: 'bed', name: 'Letto Comodo', price: 60, emoji: '🛏️', x: 180, y: 160, desc: 'Dormi meglio! Velocità corsa nel locale aumentata (+20%)' },
            { id: 'tv', name: 'Smart TV', price: 100, emoji: '📺', x: 400, y: 140, desc: 'Rilassati! Aumenta la pazienza di base dei clienti del 25%' },
            { id: 'sofa', name: 'Divano Rosso', price: 50, emoji: '🛋️', x: 400, y: 350, desc: 'Un tocco di comfort nel soggiorno' },
            { id: 'plant', name: 'Monstera Gigante', price: 25, emoji: '🪴', x: 620, y: 160, desc: 'Purifica l\'aria e abbellisce la stanza' },
            { id: 'rug', name: 'Tappeto Soffice', price: 30, emoji: '🧶', x: 400, y: 375, desc: 'Tiene i piedi al caldo la mattina' },
            { id: 'coffee', name: 'Macchina Espresso', price: 140, emoji: '☕', x: 620, y: 280, desc: 'Caffeina pura! Tempo di lavaggio stoviglie ridotto del 45%' }
        ]
    };

    window.HOUSE_STATE = HOUSE_STATE;

    function applyUpgrades() {
        CONFIG.waitress.speed = 300;
        CONFIG.customers.patienceDuration = 40000;
        CONFIG.dishes.washDuration = 1200;

        if (HOUSE_STATE.purchased.includes('bed')) {
            CONFIG.waitress.speed = 360;
        }
        if (HOUSE_STATE.purchased.includes('tv')) {
            CONFIG.customers.patienceDuration = 50000;
        }
        if (HOUSE_STATE.purchased.includes('coffee')) {
            CONFIG.dishes.washDuration = 700;
        }
    }

    class SynthAudio {
        constructor() {
            this.ctx = null;
        }
        init() {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
        }
        playSfx(type) {
            if (!GAME.settings.soundEnabled) return;
            try {
                this.init();
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);

                const now = this.ctx.currentTime;

                if (type === 'click' || type === 'pickup') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                } else if (type === 'coin' || type === 'serve') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523.25, now);
                    osc.frequency.setValueAtTime(880, now + 0.08);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                } else if (type === 'wash') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(100, now);
                    osc.frequency.linearRampToValueAtTime(180, now + 0.3);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                } else if (type === 'alert') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(220, now);
                    osc.frequency.linearRampToValueAtTime(110, now + 0.25);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                    osc.start(now);
                    osc.stop(now + 0.25);
                } else if (type === 'cook' || type === 'order_placed') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                }
            } catch (e) {
                console.warn("Impossibile riprodurre l'audio sintetico", e);
            }
        }
    }
    const SYNTH = new SynthAudio();

    function triggerSfx(name) {
        if (window.AUDIO && typeof window.AUDIO.playSfx === 'function') {
            window.AUDIO.playSfx(name);
        } else {
            SYNTH.playSfx(name);
        }
    }

    window.GAME = GAME;
    window.NPC_REGISTRY = NPC_REGISTRY;
    window.triggerSfx = triggerSfx;

    class PreloadScene extends Phaser.Scene {
        constructor() {
            super('Preload');
        }
        preload() {
            const width = this.cameras.main.width;
            const height = this.cameras.main.height;
            
            const loadingText = this.make.text({
                x: width / 2,
                y: height / 2 - 50,
                text: t('LOADING'),
                style: {
                    font: '20px monospace',
                    fill: '#ffffff'
                }
            }).setOrigin(0.5);

            const progressBar = this.add.graphics();
            const progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(240, 270, 320, 50);

            this.load.on('progress', (value) => {
                progressBar.clear();
                progressBar.fillStyle(0xd27d2d, 1);
                progressBar.fillRect(250, 280, 300 * value, 30);
            });

            this.load.on('complete', () => {
                progressBar.destroy();
                progressBox.destroy();
                loadingText.destroy();
            });

            this.load.on('loaderror', (file) => {
                console.warn('Tilesheet/Texture non trovata:', file.key);
            });

            this.load.image('floor_sala', 'assets/ambiente/1.png');
            this.load.image('floor_cucina', 'assets/ambiente/2.png');
            this.load.image('floor_bagno', 'assets/ambiente/4.png');
            this.load.image('wall', 'assets/ambiente/3.png');
            this.load.image('st_frigo', 'assets/cucina/frigo_acqua.png');
            this.load.image('st_tagliere', 'assets/cucina/banco_lavoro.png');
            this.load.image('st_fornelli', 'assets/cucina/fornelli.png');
            this.load.image('st_forno', 'assets/cucina/forno.png');
            this.load.image('st_friggitrice', 'assets/cucina/friggitrice.png'); 
            this.load.image('st_bevande', 'assets/cucina/dispenser_cola.png');
            this.load.image('st_caffe', 'assets/cucina/macchina_caffe.png');
            this.load.image('st_spillatore', 'assets/cucina/spillatore_birra.png');
            this.load.image('st_cuoco', 'assets/cucina/cuoco_cucina.png');
            this.load.image('st_bancone', 'assets/cucina/bancone_sala.png');
            this.load.image('phone', 'assets/cucina/phone.png'); 

            Object.keys(FOOD_TEXTURES).forEach(foodName => {
                const fileName = FOOD_TEXTURES[foodName];
                this.load.image(foodName, `assets/Cibo/${fileName}.png`);
            });

            Object.keys(NPC_REGISTRY).forEach(npcName => {
                const npcData = NPC_REGISTRY[npcName];
                if (npcData.hasTilesheet && npcData.path) {
                    this.load.spritesheet(npcData.key, npcData.path, {
                        frameWidth: npcData.frameWidth || 32,
                        frameHeight: npcData.frameHeight || 32
                    });
                }
            });

            if (!document.getElementById('fredoka-font-link')) {
                const link = document.createElement('link');
                link.id = 'fredoka-font-link';
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap';
                document.head.appendChild(link);
            }
        }
        create() {
            Object.keys(NPC_REGISTRY).forEach(npcName => {
                const npcData = NPC_REGISTRY[npcName];
                if (npcData.hasTilesheet && npcData.key) {
                    if (this.textures.exists(npcData.key)) {
                        const texture = this.textures.get(npcData.key);
                        const totalFrames = texture.frameTotal - 1;
                        
                        if (totalFrames > 0) {
                            for (let i = 0; i < totalFrames; i++) {
                                if (!this.anims.exists(`${npcData.key}_idle_${i}`)) {
                                    this.anims.create({
                                        key: `${npcData.key}_idle_${i}`,
                                        frames: [{ key: npcData.key, frame: i }],
                                        frameRate: 1,
                                        repeat: -1
                                    });
                                }
                            }
                        }
                    }
                }
            });

            applyUpgrades();
            this.scene.start('Menu');
        }
    }

    class GameScene extends Phaser.Scene {
        constructor() {
            super('Game');
            this.customers = [];
            this.tables = [];
            this.gameActive = true;
            this.cheatClicks = 0;
            this.bathroom = null;
            this.phone = null;
        }
        
        create() {
            this.cameras.main.setBackgroundColor('#1a0a04');
            
            GAME.customersServed = 0;
            GAME.dirtyPlates = 0;
            GAME.lives = 3;
            GAME.customersTarget = 0;
            GAME.level = 0;
            GAME.carriedOrder = null;
            
            this.gameActive = true;
            this.cheatClicks = 0;
            this.tutorialActive = false;

            applyUpgrades();

            if (typeof window.TilemapSystem === 'function') {
                this.tilemap = new window.TilemapSystem(this);
                this.tilemap.createTileMap();
            } else {
                this.createFallbackTilemap();
            }

            this.waitressState = {
                tray: [],
                targetX: 300,
                targetY: 300
            };
            this.pendingAction = null;

            this.createRestaurant();
            if (typeof window.KitchenSystem === 'function') {
                this.kitchen = new window.KitchenSystem(this);
            }
            
            if (typeof window.BathroomSystem === 'function') {
                this.bathroom = new window.BathroomSystem(this);
            }

            if (typeof window.PhoneSystem === 'function') {
                this.phone = new window.PhoneSystem(this);
            }
            
            if (typeof window.AIDialogueManager === 'function') {
                this.aiManager = new window.AIDialogueManager(this);
            }

            this.createWaitress();
            this.createSink();

            this.time.removeAllEvents();

            const tutorialSkipped = localStorage.getItem('waitress_tutorial_done') === 'true';

            if (!tutorialSkipped && typeof window.TutorialSystem === 'function') {
                this.tutorialActive = true;
                this.tutorial = new TutorialSystem(this);
            } else {
                GAME.level = 1;
                GAME.customersTarget = 6 + GAME.level * 4;
                if (GAME.score === 0) {
                    GAME.customersServed = 0;
                    GAME.lives = 3;
                    GAME.dirtyPlates = 0;
                    GAME.carriedOrder = null;
                }
                this.startSpawning();
            }

            this.createBanconeZone();
            this.createHUD();
            this.createNotepadUI();
            this.setupKeyboard();
            
            this.input.on('pointerdown', (pointer, currentlyOver) => {
                if (!this.gameActive || pointer.y < 50) return;
                
                if (!currentlyOver || currentlyOver.length === 0) {
                    this.waitressState.targetX = pointer.x;
                    this.waitressState.targetY = pointer.y;
                    this.pendingAction = null;
                }
            });
        }

        startSpawning() {
            if (GAME.customersTarget === 0) {
                GAME.customersServed = 0;
                GAME.dirtyPlates = 0;
                GAME.lives = 3;
                GAME.level = 1;
                GAME.customersTarget = 6 + GAME.level * 4;
                GAME.carriedOrder = null;
            }
            
            this.gameActive = true;
            this.tutorialActive = false;
            
            this.time.delayedCall(100, () => {
                this.updateHUD();
            });
            
            const spawnInterval = GAME.settings.difficulty === 'facile' ? 11000 : 
                                  GAME.settings.difficulty === 'difficile' ? 7000 : 9000;
            
            this.time.addEvent({
                delay: spawnInterval,
                callback: () => { if (this.gameActive) this.trySpawnCustomer(); },
                loop: true
            });
            
            this.time.delayedCall(500, () => this.trySpawnCustomer());
            this.time.delayedCall(1000, () => this.trySpawnCustomer());
            
            this.showFloatingText(400, 300, `🎉 GIORNO ${GAME.level} INIZIATO!`, '#2ecc71');
        }

        trySpawnCustomer() {
            if (!this.tutorialActive) {
                this.spawnCustomer();
            }
        }

        fixKitchenScales() {
            const checkAndScale = (child) => {
                if (!child) return;
                
                if (child.list && Array.isArray(child.list)) {
                    child.list.forEach(checkAndScale);
                }
                
                let key = '';
                if (child.texture && child.texture.key) {
                    key = child.texture.key.toLowerCase();
                } else if (child.textureKey) {
                    key = child.textureKey.toLowerCase();
                }
                
                if (key.includes('spillatore') || key.includes('birra')) {
                    if (typeof child.setDisplaySize === 'function') {
                        child.setDisplaySize(90, 85);
                    }
                } else if (key.includes('caffe')) {
                    if (typeof child.setDisplaySize === 'function') {
                        child.setDisplaySize(65, 65);
                    }
                }
            };

            if (this.children && this.children.list) {
                this.children.list.forEach(checkAndScale);
            }
            
            if (this.kitchen && this.kitchen.stations) {
                Object.keys(this.kitchen.stations).forEach(stKey => {
                    const st = this.kitchen.stations[stKey];
                    if (!st) return;
                    const lowerKey = stKey.toLowerCase();
                    if (lowerKey.includes('spillatore') || lowerKey.includes('birra')) {
                        ['sprite', 'graphic', 'image', 'icon', 'container'].forEach(prop => {
                            if (st[prop] && typeof st[prop].setDisplaySize === 'function') {
                                st[prop].setDisplaySize(90, 85);
                            }
                        });
                    }
                    if (lowerKey.includes('caffe')) {
                        ['sprite', 'graphic', 'image', 'icon', 'container'].forEach(prop => {
                            if (st[prop] && typeof st[prop].setDisplaySize === 'function') {
                                st[prop].setDisplaySize(65, 65);
                            }
                        });
                    }
                });
            }
        }

        getFoodTexture(foodName) {
            if (this.textures.exists(foodName)) {
                return foodName;
            }
            return null;
        }

        getFoodEmoji(foodName) {
            const map = {
                'Pizza': '🍕',
                'Patatine': '🍟',
                'Panino': '🍔',
                'Risotto': '🍚',
                'Caponata': '🍆',
                'Caffè': '☕',
                'Cola': '🥤',
                'Acqua': '💧',
                'Birra': '🍺'
            };
            return map[foodName] || '🍽️';
        }

        goToHouse() {
            this.gameActive = false;
            this.showFloatingText(400, 300, t('VAI A CASA'), '#3498db');
            triggerSfx('click');
            
            this.time.delayedCall(600, () => {
                if (window.HouseScene && !this.scene.get('House')) {
                    this.scene.add('House', window.HouseScene, true);
                } else {
                    this.scene.start('House');
                }
            });
        }

        createFallbackTilemap() {
            if (this.textures.exists('floor_sala')) {
                for (let x = 0; x < 600; x += 100) {
                    for (let y = 0; y < 600; y += 100) {
                        this.add.image(x + 50, y + 50, 'floor_sala').setDepth(0);
                    }
                }
            }
            if (this.textures.exists('floor_cucina')) {
                for (let x = 600; x < 800; x += 100) {
                    for (let y = 0; y < 600; y += 100) {
                        this.add.image(x + 50, y + 50, 'floor_cucina').setDepth(0);
                    }
                }
            }
            if (this.textures.exists('wall')) {
                for (let y = 0; y < 600; y += 100) {
                    this.add.image(595, y + 50, 'wall').setDepth(2);
                }
            }
        }
        
        createRestaurant() {
            if (!this.textures.exists('floor_sala')) {
                for (let x = 0; x < 6; x++) {
                    for (let y = 0; y < 6; y++) {
                        const color = (x + y) % 2 === 0 ? 0x3d2518 : 0x2f1d13;
                        this.add.rectangle(x * 100 + 50, y * 100 + 50, 100, 100, color).setDepth(0);
                    }
                }
            }
            
            const tablePositions = [
                { x: 125, y: 160, id: 1 },
                { x: 125, y: 400, id: 2 },
                { x: 350, y: 160, id: 3 },
                { x: 350, y: 400, id: 4 }
            ];
            
            tablePositions.forEach(pos => {
                this.add.ellipse(pos.x, pos.y + 38, 80, 20, 0x000000, 0.35);
                
                const table = this.add.rectangle(pos.x, pos.y, 70, 45, 0x5c2c16);
                table.setStrokeStyle(2, 0xd27d2d);
                table.setDepth(1);
                
                const labelTable = t('TABLE_SHORT') !== 'TABLE_SHORT' ? t('TABLE_SHORT') : 'Tav.';
                this.add.text(pos.x, pos.y - 30, `${labelTable} ${pos.id}`, {
                    fontSize: '11px',
                    color: '#ffd700',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }).setOrigin(0.5).setDepth(2);
                
                const tableData = {
                    id: pos.id,
                    x: pos.x,
                    y: pos.y,
                    occupied: false,
                    customer: null,
                    status: 'libero',
                    graphic: table,
                    dirtyLabel: null
                };
                
                table.setInteractive({ useHandCursor: true });
                table.on('pointerdown', () => {
                    this.waitressState.targetX = pos.x;
                    this.waitressState.targetY = pos.y + 32;
                    this.pendingAction = { type: 'table', table: tableData };
                });
                
                this.tables.push(tableData);
            });
        }

        createBanconeZone() {
            const passZone = this.add.rectangle(595, 420, 30, 220, 0x000000, 0.001);
            passZone.setDepth(6);
            passZone.setInteractive({ useHandCursor: true });
            passZone.on('pointerdown', () => {
                this.waitressState.targetX = 550;
                this.waitressState.targetY = this.waitress.y;
                this.pendingAction = { type: 'bancone_interact' };
            });
        }
        
        createWaitress() {
            this.waitressShadow = this.add.ellipse(300, 320, 30, 10, 0x000000, 0.3);
            
            this.waitress = this.add.text(300, 300, '👩‍🍳', {
                fontSize: '36px'
            }).setOrigin(0.5).setDepth(10);

            if (this.tilemap && this.tilemap.wallGroup) {
                this.physics.add.existing(this.waitress, false);
                this.waitress.body.setSize(24, 24);
                this.waitress.body.setOffset(6, 12);
                this.physics.add.collider(this.waitress, this.tilemap.wallGroup);
            }
        }
        
        createHUD() {
            this.hudBg = this.add.rectangle(400, 22, 780, 38, 0x110906, 0.95);
            this.hudBg.setStrokeStyle(1.5, 0xd27d2d);
            this.hudBg.setDepth(100);
            
            this.scoreText = this.add.text(20, 14, `${t('INCASSO')} 0€`, {
                fontSize: '14px',
                color: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setDepth(101);
            
            this.levelText = this.add.text(140, 14, `${t('GIORNO')} 1`, {
                fontSize: '14px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setDepth(101).setInteractive({ useHandCursor: true });

            this.levelText.on('pointerdown', (pointer, localX, localY, event) => {
                if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
                this.cheatClicks++;
                if (this.cheatClicks >= 3) {
                    this.goToHouse();
                } else {
                    this.showFloatingText(140, 450, `${t('TRICK_CLICKS')} ${3 - this.cheatClicks} ${t('CLICKS_LEFT')}`, '#ffd700');
                }
            });
            
            this.servedText = this.add.text(280, 14, `${t('SERVITI')} 0/10`, {
                fontSize: '14px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setDepth(101);
            
            this.livesText = this.add.text(420, 14, '❤️ ❤️ ❤️', {
                fontSize: '14px',
                color: '#e74c3c',
                fontFamily: 'Fredoka'
            }).setDepth(101);
            
            this.trayText = this.add.text(560, 14, `${t('VASSOIO')} 0/4`, {
                fontSize: '14px',
                color: '#3498db',
                fontFamily: 'Fredoka'
            }).setDepth(101);
            
            this.platesText = this.add.text(680, 14, `${t('PIATTI')} 0`, {
                fontSize: '14px',
                color: '#e67e22',
                fontFamily: 'Fredoka'
            }).setDepth(101);

            this.updateHUD();
        }
        
        createSink() {
            const sinkBg = this.add.rectangle(75, 540, 95, 45, 0x7f8c8d);
            sinkBg.setStrokeStyle(2.5, 0x95a5a6);
            sinkBg.setDepth(2);
            sinkBg.setInteractive({ useHandCursor: true });
            
            this.sinkText = this.add.text(75, 535, `${t('LAVELLO')}\n0`, {
                fontSize: '10px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka',
                align: 'center'
            }).setOrigin(0.5).setDepth(3);
            
            sinkBg.on('pointerdown', () => {
                this.waitressState.targetX = 135;
                this.waitressState.targetY = 540;
                this.pendingAction = { type: 'wash' };
            });
        }
        
        createNotepadUI() {
            this.notepadContainer = this.add.container(710, 90);
            this.notepadContainer.setDepth(50);
            
            this.notepadBg = this.add.rectangle(0, 0, 125, 75, 0xfef9e7, 0.95)
                .setStrokeStyle(1.5, 0xd4ac0d);
            
            this.notepadTitle = this.add.text(0, -25, t('NOTEPAD_TITLE'), {
                fontSize: '10px',
                color: '#2c3e50',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            this.notepadTableText = this.add.text(0, -5, t('NOTEPAD_EMPTY'), {
                fontSize: '10px',
                color: '#7f8c8d',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            this.notepadFoodText = this.add.text(0, 12, t('NOTEPAD_READY'), {
                fontSize: '10px',
                color: '#7f8c8d',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            this.notepadContainer.add([
                this.notepadBg,
                this.notepadTitle,
                this.notepadTableText,
                this.notepadFoodText
            ]);
            
            for (let i = 0; i < 4; i++) {
                const line = this.add.rectangle(-55, -20 + i * 14, 110, 1, 0xd4ac0d, 0.15);
                this.notepadContainer.add(line);
                this.notepadContainer.sendToBack(line);
            }
            this.notepadContainer.sendToBack(this.notepadBg);

            this.updateNotepadUI(false);
        }

        animateTornPaper(oldTableStr, oldFoodStr) {
            const tornPaper = this.add.container(710, 90).setDepth(60);
            const tornBg = this.add.rectangle(0, 0, 125, 75, 0xfef9e7, 0.95).setStrokeStyle(1.5, 0xd4ac0d);
            const tornTitle = this.add.text(0, -25, t('NOTEPAD_TITLE'), { fontSize: '10px', color: '#2c3e50', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
            const tornTable = this.add.text(0, -5, oldTableStr, { fontSize: '10px', color: '#e74c3c', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);
            const tornFood = this.add.text(0, 12, oldFoodStr, { fontSize: '10px', color: '#27ae60', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(0.5);

            tornPaper.add([tornBg, tornTitle, tornTable, tornFood]);

            this.tweens.add({
                targets: tornPaper,
                x: 780,
                y: 550,
                angle: Phaser.Math.Between(25, 60),
                alpha: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 650,
                ease: 'Cubic.easeIn',
                onComplete: () => tornPaper.destroy()
            });
        }

        updateNotepadUI(shouldAnimate = false) {
            if (!this.notepadTableText || !this.notepadFoodText) return;

            const prevTable = this.notepadTableText.text;
            const prevFood = this.notepadFoodText.text;

            if (GAME.carriedOrder) {
                const newTableStr = `${t('NOTEPAD_TABLE')} ${GAME.carriedOrder.tableId}`;
                const emoji = this.getFoodEmoji(GAME.carriedOrder.foodName);
                const newFoodStr = `${emoji} ${GAME.carriedOrder.foodName.toUpperCase()}`;

                if (shouldAnimate && (prevTable !== t('NOTEPAD_EMPTY'))) {
                    this.animateTornPaper(prevTable, prevFood);
                }

                this.notepadTableText.setText(newTableStr);
                this.notepadTableText.setColor('#e74c3c');
                this.notepadTableText.setStyle({ fontStyle: 'bold' });
                
                this.notepadFoodText.setText(newFoodStr);
                this.notepadFoodText.setColor('#27ae60');
                this.notepadFoodText.setStyle({ fontStyle: 'bold' });
                
                if (this.notepadContainer) {
                    this.tweens.add({
                        targets: this.notepadContainer,
                        scaleX: 1.1,
                        scaleY: 1.1,
                        duration: 150,
                        yoyo: true,
                        ease: 'Quad.easeInOut'
                    });
                }
            } else {
                if (shouldAnimate && (prevTable !== t('NOTEPAD_EMPTY'))) {
                    this.animateTornPaper(prevTable, prevFood);
                }

                this.notepadTableText.setText(t('NOTEPAD_EMPTY'));
                this.notepadTableText.setColor('#7f8c8d');
                this.notepadTableText.setStyle({ fontStyle: 'normal' });
                
                this.notepadFoodText.setText(t('NOTEPAD_READY'));
                this.notepadFoodText.setColor('#7f8c8d');
                this.notepadFoodText.setStyle({ fontStyle: 'normal' });
            }
        }

        setupKeyboard() {
            this.keys = this.input.keyboard.addKeys({
                w: Phaser.Input.Keyboard.KeyCodes.W,
                a: Phaser.Input.Keyboard.KeyCodes.A,
                s: Phaser.Input.Keyboard.KeyCodes.S,
                d: Phaser.Input.Keyboard.KeyCodes.D,
                h: Phaser.Input.Keyboard.KeyCodes.H,
                k: Phaser.Input.Keyboard.KeyCodes.K,
                shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                down: Phaser.Input.Keyboard.KeyCodes.DOWN,
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                space: Phaser.Input.Keyboard.KeyCodes.SPACE
            });
        }
        
        updateHUD() {
            if (!this.waitressState || !this.scoreText || !this.scoreText.active) return;
            if (this.scoreText && this.scoreText.active) {
                this.scoreText.setText(`${t('INCASSO')} ${GAME.score}€`);
            }
            if (this.levelText && this.levelText.active) {
                this.levelText.setText(`${t('GIORNO')} ${GAME.level}`);
            }
            if (this.servedText && this.servedText.active) {
                this.servedText.setText(`${t('SERVITI')} ${GAME.customersServed}/${GAME.customersTarget}`);
            }
            if (this.livesText && this.livesText.active) {
                this.livesText.setText(`❤️ ${'❤️'.repeat(Math.max(0, GAME.lives))}`);
            }
            if (this.trayText && this.trayText.active) {
                this.trayText.setText(`${t('VASSOIO')} ${this.waitressState.tray.length}/4`);
            }
            if (this.platesText && this.platesText.active) {
                this.platesText.setText(`${t('PIATTI')} ${GAME.dirtyPlates}`);
            }
            if (this.sinkText && this.sinkText.active) {
                this.sinkText.setText(`${t('LAVELLO')}\n${GAME.dirtyPlates}`);
            }
        }
        
        spawnCustomer() {
            const freeTable = this.tables.find(t => !t.occupied);
            if (!freeTable) return;
            
            const foods = ['Pizza', 'Patatine', 'Panino', 'Risotto', 'Caponata', 'Caffè', 'Cola', 'Acqua', 'Birra'];
            const selectedFood = foods[Phaser.Math.Between(0, foods.length - 1)];
            
            const names = Object.keys(NPC_REGISTRY);
            const name = names[Phaser.Math.Between(0, names.length - 1)];
            
            const npcConfig = NPC_REGISTRY[name] || {};

            let gender = npcConfig.gender || 'male';
            let bringsChild = false;
            
            const customer = {
                name: name,
                order: selectedFood,
                patience: 100,
                bladder: 0,
                gender: gender,
                isInBathroom: false,
                bubbleIcon: null,
                isDead: false,
                table: freeTable,
                relationScore: 50,
                adoptTrigger: npcConfig.adoptTrigger || false,
                patienceMultiplier: npcConfig.patienceMultiplier || 1.0,
                bringsChild: bringsChild,
                emojiChar: npcConfig.emojiChar || (gender === 'female' ? '👩' : '👨'),
                hasTilesheet: npcConfig.hasTilesheet || false,
                tilesheetKey: npcConfig.key || null,
                x: freeTable.x,
                y: freeTable.y,
                orderBubble: null,
                chatBubble: null,
                childGraphic: null,
                patienceBar: null,
                patienceBg: null,
                emoji: null,
                sprite: null,
                timerEvent: null,
                serve: () => {
                    this.time.delayedCall(CONFIG.customers.eatingDuration, () => {
                        this.finishMeal(customer);
                    });
                }
            };
            
            freeTable.occupied = true;
            freeTable.customer = customer;
            freeTable.status = 'ordinazione_pronta';
            
            this.createCustomerGraphics(customer);
            this.customers.push(customer);
        }
        
        createCustomerGraphics(customer) {
            const table = customer.table;
            
            customer.shadow = this.add.ellipse(table.x, table.y + 35, 40, 10, 0x000000, 0.25);
            
            if (customer.hasTilesheet && customer.tilesheetKey && this.textures.exists(customer.tilesheetKey)) {
                customer.sprite = this.add.sprite(table.x, table.y + 10, customer.tilesheetKey, 0);
                customer.sprite.setScale(1.2);
                customer.sprite.setDepth(5);
                customer.sprite.setInteractive({ useHandCursor: true });
                
                if (this.anims.exists(`${customer.tilesheetKey}_idle_0`)) {
                    customer.sprite.play(`${customer.tilesheetKey}_idle_0`);
                }
            } else {
                customer.emoji = this.add.text(table.x, table.y + 10, customer.emojiChar, {
                    fontSize: '36px'
                }).setOrigin(0.5).setDepth(5).setInteractive({ useHandCursor: true });
            }

            if (customer.bringsChild) {
                customer.childGraphic = this.add.text(table.x + 24, table.y + 24, '👶', {
                    fontSize: '16px'
                }).setOrigin(0.5).setDepth(5);
            }

            customer.orderBubble = this.add.text(table.x - 18, table.y - 15, '📝 ?', {
                fontSize: '11px',
                color: '#ffffff',
                backgroundColor: '#110906',
                padding: { x: 4, y: 3 }
            }).setOrigin(0.5).setDepth(5).setInteractive({ useHandCursor: true });

            customer.chatBubble = this.add.text(table.x + 22, table.y - 15, '💬', {
                fontSize: '12px',
                color: '#ffffff',
                backgroundColor: '#27ae60',
                padding: { x: 4, y: 3 }
            }).setOrigin(0.5).setDepth(5).setInteractive({ useHandCursor: true });
            
            const handleTableClick = () => {
                this.waitressState.targetX = table.x;
                this.waitressState.targetY = table.y + 32;
                this.pendingAction = { type: 'table', table: table };
            };

            const handleChatClick = (pointer, localX, localY, event) => {
                if (event && typeof event.stopPropagation === 'function') {
                    event.stopPropagation();
                } else if (pointer && pointer.event && typeof pointer.event.stopPropagation === 'function') {
                    pointer.event.stopPropagation();
                }
                
                if (this.aiManager) {
                    this.aiManager.openChat(customer);
                }
            };
            
            if (customer.emoji) {
                customer.emoji.on('pointerdown', handleTableClick);
            }
            if (customer.sprite) {
                customer.sprite.on('pointerdown', handleTableClick);
            }
            
            customer.orderBubble.on('pointerdown', handleTableClick);
            customer.chatBubble.on('pointerdown', handleChatClick);
            
            customer.patienceBg = this.add.rectangle(table.x, table.y - 28, 50, 4, 0x333333);
            customer.patienceBg.setDepth(4);
            
            customer.patienceBar = this.add.rectangle(table.x - 25, table.y - 28, 50, 4, 0x2ecc71);
            customer.patienceBar.setOrigin(0, 0.5);
            customer.patienceBar.setDepth(5);
            
            customer.timerEvent = this.time.addEvent({
                delay: 100,
                callback: () => {
                    if (!this.gameActive || customer.isDead || this.tutorialActive) return;
                    
                    const baseDecay = 100 / (CONFIG.customers.patienceDuration / 100);
                    const decayAmount = baseDecay * customer.patienceMultiplier;
                    customer.patience -= decayAmount;
                    
                    if (customer.patienceBar && customer.patienceBar.active) {
                        const scale = Math.max(0, customer.patience / 100);
                        customer.patienceBar.setScale(scale, 1);
                        
                        if (customer.patience < 40) customer.patienceBar.setFillStyle(0xf39c12);
                        if (customer.patience < 20) customer.patienceBar.setFillStyle(0xe74c3c);
                    }
                    
                    if (customer.patience <= 0) {
                        this.angryLeave(customer);
                    }
                },
                loop: true
            });
        }
        
        angryLeave(customer) {
            this.showFloatingText(customer.table.x, customer.table.y - 40, t('LEAVING_ANGRY'), '#ff0000');
            triggerSfx('alert');
            GAME.lives--;
            this.updateHUD();
            this.removeCustomer(customer);
            
            if (GAME.lives <= 0) {
                this.gameOver();
            }
        }
        
        finishMeal(customer) {
            const basePay = 14;
            const multiplier = customer.patience > 50 ? 1.3 : (customer.patience < 20 ? 0.8 : 1.0);
            const tip = Math.floor(basePay * multiplier);
            
            GAME.score += tip;
            GAME.customersServed++;
            this.updateHUD();
            
            this.showFloatingText(customer.table.x, customer.table.y - 40, `+${tip}€ 💵`, '#2ecc71');
            triggerSfx('coin');
            
            customer.table.status = 'piatto_sporco';
            customer.table.dirtyLabel = this.add.text(customer.table.x, customer.table.y + 15, '🍽️ SPORCO', {
                fontSize: '8px',
                color: '#e67e22',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            this.removeCustomer(customer);
            
            if (GAME.customersServed >= GAME.customersTarget) {
                this.levelComplete();
            }
        }
        
        removeCustomer(customer) {
            customer.isDead = true;
            customer.table.occupied = false;
            customer.table.customer = null;
            if (customer.table.status !== 'piatto_sporco') {
                customer.table.status = 'libero';
            }
            
            if (customer.timerEvent) customer.timerEvent.remove();
            if (customer.emoji) customer.emoji.destroy();
            if (customer.sprite) customer.sprite.destroy();
            if (customer.childGraphic) customer.childGraphic.destroy();
            if (customer.orderBubble) customer.orderBubble.destroy();
            if (customer.chatBubble) customer.chatBubble.destroy();
            if (customer.bubbleIcon) {
                customer.bubbleIcon.destroy();
                customer.bubbleIcon = null;
            }
            if (customer.shadow) customer.shadow.destroy();
            if (customer.patienceBar) customer.patienceBar.destroy();
            if (customer.patienceBg) customer.patienceBg.destroy();
            
            const index = this.customers.indexOf(customer);
            if (index > -1) this.customers.splice(index, 1);
        }
        
        interactWithTable(table) {
            if (this.tutorialActive && this.tutorialStepTarget) {
                if (this.tutorialStepTarget === 'take_order' && table.customer === this.tutorial.fakeCustomer) {
                    this.tutorial.progressStep();
                } else if (this.tutorialStepTarget === 'serve_food' && table.customer === this.tutorial.fakeCustomer) {
                    this.tutorial.progressStep();
                } else if (this.tutorialStepTarget === 'clear_table' && table === this.tutorial.fakeCustomer.table) {
                    this.tutorial.progressStep();
                } else if (this.tutorialActive) {
                    this.showFloatingText(table.x, table.y - 40, "⚠️ Segui le frecce del tutorial!", '#f39c12');
                    return;
                }
            }

            const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, table.x, table.y);
            if (dist > CONFIG.waitress.interactRange) {
                this.showFloatingText(table.x, table.y - 40, t('ERR_CLOSE_TABLE'), '#ff4444');
                triggerSfx('click');
                return;
            }

            if (table.status === 'ordinazione_pronta' && table.customer) {
                if (GAME.carriedOrder) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 30, t('ERR_ALREADY_ORDER'), '#ff4444');
                    triggerSfx('click');
                    return;
                }
                
                triggerSfx('pickup');
                
                GAME.carriedOrder = {
                    tableId: table.id,
                    foodName: table.customer.order
                };
                
                table.status = 'attesa_cibo';
                if (table.customer.orderBubble) {
                    table.customer.orderBubble.setText('⏳ Cibo');
                    table.customer.orderBubble.setColor('#ffd700');
                }
                
                this.updateNotepadUI(true);
                
                this.showFloatingText(this.waitress.x, this.waitress.y - 40, t('MSG_ORDER_TAKEN'), '#ffd700');
                this.showFloatingText(table.x, table.y - 30, t('MSG_ORDER_REC'), '#ffd700');
                return;
            }
            
            if (table.status === 'attesa_cibo' && table.customer) {
                const foodIndex = this.waitressState.tray.findIndex(
                    f => f.food.toLowerCase() === table.customer.order.toLowerCase()
                );
                
                if (foodIndex > -1) {
                    triggerSfx('serve');
                    
                    this.waitressState.tray.splice(foodIndex, 1);
                    this.updateTrayGraphics();
                    this.updateHUD();
                    
                    table.customer.serve();
                    table.status = 'mangia';
                    if (table.customer.orderBubble) {
                        table.customer.orderBubble.setText('🍽️ Mmm!');
                    }
                    
                    this.showFloatingText(table.x, table.y - 40, t('MSG_SERVED'), '#2ecc71');
                } else {
                    this.showFloatingText(table.x, table.y - 40, `⏳ Vuole: ${table.customer.order}`, '#f39c12');
                }
                return;
            }
            
            if (table.status === 'piatto_sporco') {
                if (GAME.dirtyPlates >= CONFIG.dishes.maxDirty) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 40, t('ERR_SINK_FULL'), '#ff4444');
                    triggerSfx('alert');
                    return;
                }
                
                triggerSfx('pickup');
                table.status = 'libero';
                GAME.dirtyPlates++;
                this.updateHUD();
                
                if (table.dirtyLabel) {
                    table.dirtyLabel.destroy();
                    table.dirtyLabel = null;
                }
                
                this.showFloatingText(table.x, table.y - 40, t('MSG_TABLE_CLEARED'), '#3498db');
                return;
            }

            if (table.status === 'libero') {
                this.showFloatingText(table.x, table.y - 20, t('MSG_TABLE_FREE'), '#3498db');
            }
        }
        
        interactWithBancone() {
            if (this.tutorialActive && this.tutorialStepTarget === 'counter') {
                this.tutorial.progressStep();
            } else if (this.tutorialActive && this.tutorialStepTarget) {
                this.showFloatingText(560, this.waitress.y - 30, "⚠️ Segui le frecce del tutorial!", '#f39c12');
                return;
            }

            const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, 560, this.waitress.y);
            if (dist > CONFIG.waitress.interactRange) {
                this.showFloatingText(this.waitress.x, this.waitress.y - 30, t('ERR_CLOSE_COUNTER'), '#ff4444');
                triggerSfx('click');
                return;
            }
            
            if (GAME.carriedOrder) {
                const food = GAME.carriedOrder.foodName.toLowerCase();
                let stationKey = null;
                
                const foodStationMap = {
                    'pizza': 'forno',
                    'patatine': 'friggitrice',
                    'panino': 'fornelli',
                    'risotto': 'fornelli',
                    'caponata': 'fornelli',
                    'caffè': 'caffe', 'caffe': 'caffe',
                    'birra': 'spillatore', 'cola': 'bevande',
                    'acqua': 'frigo'
                };
                
                stationKey = foodStationMap[food] || 'tagliere';
                
                if (stationKey && this.kitchen) {
                    const success = this.kitchen.addOrder(
                        stationKey,
                        GAME.carriedOrder.foodName,
                        GAME.carriedOrder.tableId
                    );
                    
                    if (success) {
                        triggerSfx('order_placed');
                        const tableId = GAME.carriedOrder.tableId;
                        GAME.carriedOrder = null;
                        
                        this.updateNotepadUI(true);
                        
                        const msgChef = t('PRONTO') !== 'PRONTO' ? t('PRONTO') : '👨‍🍳 Comanda allo Chef!';
                        const labelTable = t('TABLE_SHORT') !== 'TABLE_SHORT' ? t('TABLE_SHORT') : 'Tavolo';
                        this.showFloatingText(560, this.waitress.y - 20, msgChef, '#2ecc71');
                        this.showFloatingText(560, this.waitress.y - 45, `📝 ${labelTable} ${tableId}: ${food}`, '#ffd700');
                    } else {
                        this.showFloatingText(560, this.waitress.y - 30, t('OCCUPATO'), '#f39c12');
                        triggerSfx('alert');
                    }
                } else {
                    this.showFloatingText(560, this.waitress.y - 30, t('ERR_NO_FOOD_SERVED'), '#ff4444');
                }
                return;
            }
            
            this.pickUpFoodFromCounter();
        }
        
        pickUpFoodFromCounter() {
            if (this.waitressState.tray.length >= CONFIG.tray.maxTotal) {
                this.showFloatingText(this.waitress.x, this.waitress.y - 30, t('ERR_TRAY_FULL'), '#ff4444');
                triggerSfx('alert');
                return;
            }
            
            if (!this.kitchen) return;

            const food = this.kitchen.pickUpFood();
            if (food) {
                triggerSfx('pickup');
                this.waitressState.tray.push({ food: food });
                this.updateTrayGraphics();
                this.updateHUD();
                
                const textureKey = this.getFoodTexture(food);
                if (textureKey) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 40, `📦 ${food} ${t('FOOD_READY')}`, '#2ecc71');
                } else {
                    const emoji = this.getFoodEmoji(food);
                    this.showFloatingText(this.waitress.x, this.waitress.y - 40, `${emoji} ${food} ${t('FOOD_TAKEN')}`, '#2ecc71');
                }
            } else {
                this.showFloatingText(560, this.waitress.y - 30, t('ERR_NO_READY_FOOD'), '#999999');
                triggerSfx('click');
            }
        }
        
        washDishes() {
            if (this.tutorialActive && this.tutorialStepTarget === 'wash_sink') {
                this.tutorial.progressStep();
                GAME.dirtyPlates = 0;
                this.updateHUD();
                return;
            } else if (this.tutorialActive && this.tutorialStepTarget) {
                this.showFloatingText(75, 510, "⚠️ Segui le frecce del tutorial!", '#f39c12');
                return;
            }

            const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, 100, 540);
            if (dist > CONFIG.waitress.interactRange) {
                this.showFloatingText(this.waitress.x, this.waitress.y - 30, t('ERR_CLOSE_SINK'), '#ff4444');
                triggerSfx('click');
                return;
            }
            
            if (GAME.dirtyPlates > 0) {
                this.gameActive = false;
                this.showFloatingText(75, 510, t('WASHING'), '#3498db');
                triggerSfx('wash');
                
                this.time.delayedCall(CONFIG.dishes.washDuration, () => {
                    GAME.dirtyPlates = 0;
                    this.updateHUD();
                    this.gameActive = true;
                    this.showFloatingText(75, 510, t('WASH_CLEAN'), '#2ecc71');
                    triggerSfx('click');
                });
            } else {
                this.showFloatingText(75, 510, t('WASH_NONE'), '#ffd700');
                triggerSfx('click');
            }
        }
        
        updateTrayGraphics() {
            const count = this.waitressState.tray.length;
            let emoji = '👩‍🍳';
            if (count === 1) emoji = '👩‍🍳🍽️';
            else if (count === 2) emoji = '👩‍🍳🥘🍽️';
            else if (count >= 3) emoji = '👩‍🍳🍕🍔🥤';
            
            this.waitress.setText(emoji);
        }
        
        showFloatingText(x, y, text, color) {
            const txt = this.add.text(x, y, text, {
                fontSize: '13px',
                color: color,
                fontStyle: 'bold',
                fontFamily: 'Fredoka',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5).setDepth(200);
            
            this.tweens.add({
                targets: txt,
                y: y - 40,
                alpha: 0,
                duration: 1200,
                ease: 'Cubic.easeOut',
                onComplete: () => txt.destroy()
            });
        }
        
        update(time, delta) {
            if (!this.gameActive) return;

            if (!this.tutorialActive) {
                if (this.kitchen) {
                    this.kitchen.update();
                }

                if (this.bathroom) {
                    this.bathroom.update(time, delta);
                }

                if (this.phone) {
                    this.phone.update(time, delta);
                }

                this.fixKitchenScales();
            }
            
            if (Phaser.Input.Keyboard.JustDown(this.keys.k) && this.keys.shift.isDown) {
                GAME.customersServed = GAME.customersTarget;
                GAME.score += 100;
                this.showFloatingText(400, 250, '🔑 Trucco attivato!', '#ffd700');
                this.levelComplete();
                return;
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.h)) {
                this.goToHouse();
                return;
            }

            let moveX = 0, moveY = 0;
            const controls = GAME.settings.controls || 'wasd';
            
            if (controls === 'wasd') {
                if (this.keys.w?.isDown) moveY = -1;
                if (this.keys.s?.isDown) moveY = 1;
                if (this.keys.a?.isDown) moveX = -1;
                if (this.keys.d?.isDown) moveX = 1;
            } else {
                if (this.keys.up?.isDown) moveY = -1;
                if (this.keys.down?.isDown) moveY = 1;
                if (this.keys.left?.isDown) moveX = -1;
                if (this.keys.right?.isDown) moveX = 1;
            }
            
            if (moveX !== 0 && moveY !== 0) {
                moveX *= 0.7071;
                moveY *= 0.7071;
            }
            
            if (moveX !== 0 || moveY !== 0) {
                this.waitress.x += moveX * CONFIG.waitress.speed * (delta / 1000);
                this.waitress.y += moveY * CONFIG.waitress.speed * (delta / 1000);
                this.waitressState.targetX = this.waitress.x;
                this.waitressState.targetY = this.waitress.y;
            } else {
                const dist = Phaser.Math.Distance.Between(
                    this.waitress.x, this.waitress.y,
                    this.waitressState.targetX, this.waitressState.targetY
                );
                
                if (dist > 5) {
                    const angle = Phaser.Math.Angle.Between(
                        this.waitress.x, this.waitress.y,
                        this.waitressState.targetX, this.waitressState.targetY
                    );
                    
                    this.waitress.x += Math.cos(angle) * CONFIG.waitress.speed * (delta / 1000);
                    this.waitress.y += Math.sin(angle) * CONFIG.waitress.speed * (delta / 1000);
                }
            }
            
            this.waitress.x = Phaser.Math.Clamp(this.waitress.x, 30, 540);
            this.waitress.y = Phaser.Math.Clamp(this.waitress.y, 70, 560);
            
            if (this.waitressShadow) {
                this.waitressShadow.x = this.waitress.x;
                this.waitressShadow.y = this.waitress.y + 16;
            }
            
            if (this.pendingAction) {
                const targetX = this.pendingAction.table?.x || this.waitressState.targetX;
                const targetY = this.pendingAction.table?.y || this.waitressState.targetY;
                const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, targetX, targetY);
                
                if (dist <= CONFIG.waitress.interactRange) {
                    if (this.pendingAction.type === 'table') {
                        this.interactWithTable(this.pendingAction.table);
                    } else if (this.pendingAction.type === 'bancone_interact') {
                        this.interactWithBancone();
                    } else if (this.pendingAction.type === 'wash') {
                        this.washDishes();
                    }
                    this.pendingAction = null;
                }
            }
            
            if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
                this.interactWithClosest();
            }
        }
        
        interactWithClosest() {
            let closestTable = null;
            let minDist = CONFIG.waitress.interactRange;
            
            this.tables.forEach(t => {
                const d = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, t.x, t.y);
                if (d < minDist) {
                    minDist = d;
                    closestTable = t;
                }
            });
            
            if (closestTable) {
                this.interactWithTable(closestTable);
                return;
            }
            
            if (Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, 560, this.waitress.y) <= CONFIG.waitress.interactRange) {
                this.interactWithBancone();
                return;
            }
            
            if (Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, 100, 540) <= CONFIG.waitress.interactRange) {
                this.washDishes();
            }
        }
        
        levelComplete() {
            this.gameActive = false;
            this.showFloatingText(400, 300, t('DAY_COMPLETE'), '#ffd700');
            triggerSfx('coin');
            
            const saveData = {
                score: GAME.score,
                level: GAME.level + 1,
                customersServed: 0,
                lives: 3,
                dirtyPlates: 0,
                settings: GAME.settings,
                housePurchased: window.HOUSE_STATE ? window.HOUSE_STATE.purchased : []
            };
            
            if (window.SaveManager && typeof window.SaveManager.saveGame === 'function') {
                window.SaveManager.saveGame(saveData).then(() => {
                    console.log("💾 Gioco salvato correttamente!");
                }).catch(err => {
                    console.error("Errore salvataggio:", err);
                });
            }
            
            this.time.delayedCall(1200, () => {
                if (window.LevelSummaryScene && !this.scene.get('LevelSummary')) {
                    this.scene.add('LevelSummary', window.LevelSummaryScene, false);
                }
                
                if (this.scene.get('LevelSummary')) {
                    this.scene.start('LevelSummary', {
                        score: GAME.score,
                        served: GAME.customersServed,
                        target: GAME.customersTarget,
                        lives: GAME.lives,
                        level: GAME.level
                    });
                } else {
                    GAME.level++;
                    GAME.customersServed = 0;
                    GAME.lives = 3;
                    GAME.dirtyPlates = 0;
                    GAME.carriedOrder = null;
                    GAME.customersTarget = 6 + GAME.level * 4;
                    this.scene.restart();
                }
            });
        }
        
        gameOver() {
            this.gameActive = false;
            this.showFloatingText(400, 300, t('DAY_FAILED'), '#ff0000');
            triggerSfx('alert');
            
            this.time.delayedCall(2000, () => {
                this.scene.start('GameOver');
            });
        }
    }

    class MenuScene extends Phaser.Scene {
        constructor() {
            super('Menu');
        }
        
        create() {
            this.cameras.main.setBackgroundColor('#1a0a04');
            
            const bg = this.add.graphics();
            bg.fillStyle(0x2c1a11, 0.35);
            for (let i = 0; i < 800; i += 40) {
                bg.fillRect(i, 0, 20, 600);
            }
            
            const card = this.add.rectangle(400, 300, 520, 440, 0x110906, 0.9);
            card.setStrokeStyle(2.5, 0xd27d2d);
            
            const title = this.add.text(400, 110, t('MENU_TITLE'), {
                fontSize: '42px',
                color: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            this.tweens.add({
                targets: title,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 1200,
                yoyo: true,
                repeat: -1
            });
            
            this.add.text(400, 165, t('MENU_SUBTITLE'), {
                fontSize: '13px',
                color: '#e0d5c1',
                letterSpacing: 3,
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            this.createButton(400, 240, t('GIOCA'), () => {
                triggerSfx('click');
                
                if (typeof window.SaveMenu === 'function') {
                    new window.SaveMenu(this).showMenu();
                } else {
                    this.scene.start('Game');
                }
            });
            
            this.createButton(400, 310, t('IMPOSTAZIONI'), () => {
                triggerSfx('click');
                this.scene.start('Settings');
            });
            
            this.createButton(400, 380, t('CREDITI'), () => {
                triggerSfx('click');
                this.scene.start('Credits');
            });
            
            this.add.text(400, 490, 'Mirko Donato - 2026', {
                fontSize: '11px',
                color: '#d27d2d',
                fontStyle: 'italic',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
        }
        
        createButton(x, y, text, callback) {
            const bg = this.add.rectangle(x, y, 280, 44, 0xd27d2d);
            bg.setStrokeStyle(2, 0xffd700);
            bg.setInteractive({ useHandCursor: true });
            
            const txt = this.add.text(x, y, text, {
                fontSize: '16px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            bg.on('pointerover', () => {
                bg.setFillStyle(0xe59866);
                txt.setColor('#1a0a04');
            });
            
            bg.on('pointerout', () => {
                bg.setFillStyle(0xd27d2d);
                txt.setColor('#ffffff');
            });
            
            bg.on('pointerdown', callback);
        }
    }

    class GameOverScene extends Phaser.Scene {
        constructor() {
            super('GameOver');
        }

        create() {
            this.cameras.main.setBackgroundColor('#1a0202');

            const card = this.add.rectangle(400, 300, 520, 450, 0x110202, 0.95);
            card.setStrokeStyle(2, 0xe74c3c);

            this.add.text(400, 120, t('DAY_FAILED'), {
                fontSize: '36px',
                color: '#e74c3c',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            this.add.text(400, 180, t('DAY_FAILED_DESC'), {
                fontSize: '14px',
                color: '#e0d5c1',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const statsBox = this.add.rectangle(400, 275, 420, 100, 0x221111);
            statsBox.setStrokeStyle(1, 0x442222);

            this.add.text(230, 245, t('SAVINGS_LEFT'), { fontSize: '13px', color: '#ffd700', fontFamily: 'Fredoka' });
            this.add.text(530, 245, `${GAME.score} €`, { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(1, 0);

            this.add.text(230, 275, t('DAYS_WORKED'), { fontSize: '13px', color: '#ffd700', fontFamily: 'Fredoka' });
            this.add.text(530, 275, `${GAME.level}`, { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(1, 0);

            this.add.text(230, 305, t('FURNITURE_BOUGHT'), { fontSize: '13px', color: '#ffd700', fontFamily: 'Fredoka' });
            
            let purchasedCount = 0;
            const savedHouseData = localStorage.getItem('waitress_house_data');
            if (savedHouseData) {
                try {
                    const parsed = JSON.parse(savedHouseData);
                    purchasedCount = (parsed.purchased || []).length;
                } catch(e) {}
            }
            this.add.text(530, 305, `${purchasedCount} / ${HOUSE_STATE.items.length}`, { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka' }).setOrigin(1, 0);

            const houseBtn = this.add.rectangle(400, 375, 300, 44, 0x3498db);
            houseBtn.setStrokeStyle(1.5, 0xffffff);
            houseBtn.setInteractive({ useHandCursor: true });

            this.add.text(400, 375, t('VAI A CASA'), {
                fontSize: '14px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            houseBtn.on('pointerdown', () => {
                triggerSfx('click');
                if (window.HouseScene && !this.scene.get('House')) {
                    this.scene.add('House', window.HouseScene, true);
                } else {
                    this.scene.start('House');
                }
            });
            houseBtn.on('pointerover', () => { houseBtn.setFillStyle(0x2980b9); });
            houseBtn.on('pointerout', () => { houseBtn.setFillStyle(0x3498db); });

            const menuBtn = this.add.rectangle(400, 435, 300, 40, 0xd27d2d);
            menuBtn.setStrokeStyle(1.5, 0xffd700);
            menuBtn.setInteractive({ useHandCursor: true });

            this.add.text(400, 435, t('TORNA'), {
                fontSize: '13px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            menuBtn.on('pointerdown', () => {
                triggerSfx('click');
                this.scene.start('Menu');
            });
            menuBtn.on('pointerover', () => { menuBtn.setFillStyle(0xe59866); });
            menuBtn.on('pointerout', () => { menuBtn.setFillStyle(0xd27d2d); });
        }
    }

    class SettingsScene extends Phaser.Scene {
        constructor() {
            super('Settings');
        }
        
        create() {
            this.cameras.main.setBackgroundColor('#1a0a04');
            
            const card = this.add.rectangle(400, 300, 520, 480, 0x110906, 0.85);
            card.setStrokeStyle(2, 0xd27d2d);
            
            this.add.text(400, 70, t('IMPOSTAZIONI'), {
                fontSize: '28px',
                color: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            this.add.text(400, 125, t('AUDIO_SETTINGS'), {
                fontSize: '15px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            const audioBtn = this.add.rectangle(400, 155, 180, 32, GAME.settings.soundEnabled ? 0x27ae60 : 0xe74c3c);
            audioBtn.setInteractive({ useHandCursor: true });
            audioBtn.setStrokeStyle(1, 0xffffff);
            
            const audioTxt = this.add.text(400, 155, GAME.settings.soundEnabled ? t('ACTIVE') : t('DISABLED'), {
                fontSize: '13px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            audioBtn.on('pointerdown', () => {
                GAME.settings.soundEnabled = !GAME.settings.soundEnabled;
                triggerSfx('click');
                audioBtn.setFillStyle(GAME.settings.soundEnabled ? 0x27ae60 : 0xe74c3c);
                audioTxt.setText(GAME.settings.soundEnabled ? t('ACTIVE') : t('DISABLED'));
            });
            
            this.add.text(400, 205, t('DIFFICULTY_LEVEL'), {
                fontSize: '15px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            const diffs = ['facile', 'normale', 'difficile'];
            const diffKeys = { 'facile': t('EASY'), 'normale': t('NORMAL'), 'difficile': t('HARD') };
            
            diffs.forEach((diff, i) => {
                const x = 230 + i * 170;
                const btn = this.add.rectangle(x, 235, 120, 30, 
                    GAME.settings.difficulty === diff ? 0x27ae60 : 0x2c1a11
                );
                btn.setStrokeStyle(1, 0xd27d2d);
                btn.setInteractive({ useHandCursor: true });
                
                this.add.text(x, 235, diffKeys[diff].toUpperCase(), {
                    fontSize: '12px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }).setOrigin(0.5);
                
                btn.on('pointerdown', () => {
                    triggerSfx('click');
                    GAME.settings.difficulty = diff;
                    this.scene.restart();
                });
            });
            
            this.add.text(400, 285, t('CONTROL_SYSTEM'), {
                fontSize: '15px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            const ctrlBtn = this.add.rectangle(400, 315, 230, 32, 0x2c1a11);
            ctrlBtn.setStrokeStyle(1, 0xd27d2d);
            ctrlBtn.setInteractive({ useHandCursor: true });
            
            const ctrlTxt = this.add.text(400, 315, `${t('KEYBOARD')} ${GAME.settings.controls.toUpperCase()}`, {
                fontSize: '13px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            ctrlBtn.on('pointerdown', () => {
                GAME.settings.controls = GAME.settings.controls === 'wasd' ? 'frecce' : 'wasd';
                triggerSfx('click');
                ctrlTxt.setText(`${t('KEYBOARD')} ${GAME.settings.controls.toUpperCase()}`);
            });

            this.add.text(400, 365, t('LANGUAGE_SELECT'), {
                fontSize: '15px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const langs = getLanguages();
            const langKeys = Object.keys(langs);
            const currentLangCode = getCurrentLang();
            let langIndex = langKeys.indexOf(currentLangCode);
            if (langIndex === -1) langIndex = 0;

            const currentLangData = langs[currentLangCode] || langs['it'];

            const langBtn = this.add.rectangle(400, 395, 260, 34, 0x2c1a11);
            langBtn.setStrokeStyle(1, 0xd27d2d);
            langBtn.setInteractive({ useHandCursor: true });

            const langTxt = this.add.text(400, 395, `${currentLangData.flag} ${currentLangData.name}`, {
                fontSize: '13px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            langBtn.on('pointerdown', () => {
                langIndex = (langIndex + 1) % langKeys.length;
                const newLang = langKeys[langIndex];
                
                triggerSfx('click');
                switchLanguage(newLang);
                this.scene.restart();
            });
            
            const backBtn = this.add.rectangle(400, 465, 260, 38, 0xd27d2d);
            backBtn.setStrokeStyle(2, 0xffd700);
            backBtn.setInteractive({ useHandCursor: true });
            
            this.add.text(400, 465, t('TORNA'), {
                fontSize: '14px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            backBtn.on('pointerdown', () => {
                triggerSfx('click');
                this.scene.start('Menu');
            });
        }
    }

    class CreditsScene extends Phaser.Scene {
        constructor() {
            super('Credits');
        }
        
        create() {
            const card = this.add.rectangle(400, 300, 500, 420, 0x110906, 0.85);
            card.setStrokeStyle(2, 0xd27d2d);
            
            this.add.text(400, 80, t('CREDITS_TITLE'), {
                fontSize: '28px',
                color: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            const credits = [
                t('CREDITS_IDEATION'),
                'Mirko Yuri Donato',
                '',
                t('CREDITS_SUPPORT'),
                'Emanuele Geminiani',
                'Luca Verri',
                '',
                t('CREDITS_GRAPHICS'),
                'Marco Venturi',
                '',
                t('CREDITS_TECH'),
                'Phaser 3 / Web Audio API',
                '',
                t('CREDITS_LICENSE'),
                'MIT - 2026'
            ];
            
            this.add.text(400, 270, credits.join('\n'), {
                fontSize: '13px',
                color: '#e0d5c1',
                align: 'center',
                lineSpacing: 5,
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            const backBtn = this.add.rectangle(400, 460, 240, 40, 0xd27d2d);
            backBtn.setStrokeStyle(1.5, 0xffffff);
            backBtn.setInteractive({ useHandCursor: true });
            
            this.add.text(400, 460, t('TORNA'), {
                fontSize: '14px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            backBtn.on('pointerdown', () => {
                triggerSfx('click');
                this.scene.start('Menu');
            });
        }
    }

    const scenesList = [PreloadScene, MenuScene, SettingsScene, CreditsScene, GameScene, GameOverScene];
    
    if (window.LevelSummaryScene) {
        scenesList.push(window.LevelSummaryScene);
    }
    if (window.HouseScene) {
        scenesList.push(window.HouseScene);
    }

    const config = {
        type: Phaser.AUTO,
        width: CONFIG.width,
        height: CONFIG.height,
        parent: 'game-container',
        backgroundColor: '#1a0a04',
        scene: scenesList,
        physics: CONFIG.physics,
        scale: {
            model: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        render: {
            pixelArt: true,
            antialias: false,
            roundPixels: true
        }
    };

    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        const game = new Phaser.Game(config);
        window.game = game;
    });
}