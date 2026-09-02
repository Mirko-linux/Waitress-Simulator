(function() {
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
            eatingDuration: 5500
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
                caffe: 1500,
                arancina: 3500,
                cassata: 4000,
                chinotto: 1200,
                cannolo: 3500,
                ginseng: 1500,
                'fritto misto': 4000,
                'pasta al pesto': 3500,
                'panino milza': 3000
            }
        }
    };

    // --- VARIABILI PER GLI UPGRADE ---
    let notebookLevel = 0;
    let adsLevel = 0;
    let cardsLevel = 0;
    // ---------------------------------

    // --- SCALA CAMERIERA (MODIFICA QUESTO VALORE PER RIDIMENSIONARE) ---
    const WAITRESS_SCALE = 0.35;
    // -----------------------------------------------------------------

    const FOOD_TEXTURES = {
        'Pizza': 'Pizza',
        'Patatine': 'Patatine',
        'Panino': 'Panino',
        'Risotto': 'Risotto',
        'Caponata': 'Caponata',
        'Caffè': 'Caffè',
        'Cola': 'Cola',
        'Acqua': 'Acqua',
        'Birra': 'Birra',
        'Arancina': 'Arancina',
        'Cassata': 'Cassata',
        'Chinotto': 'Chinotto',
        'Cannolo': 'Cannolo',
        'Ginseng': 'Ginseng',
        'Fritto Misto': 'Fritto Misto',
        'Pasta al Pesto': 'Pasta al Pesto',
        'Panino con la Milza': 'Panino Milza'
    };

    // NPC_REGISTRY viene caricato da ai.js
    const NPC_REGISTRY = window.NPC_CONFIG || {};

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
            controls: 'wasd',
            aiEnabled: true
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

            // --- TEXTURE TILEMAP ---
            this.load.image('floor_sala', 'assets/ambiente/1.png');
            this.load.image('floor_cucina', 'assets/ambiente/2.png');
            this.load.image('floor_bagno', 'assets/ambiente/4.png');
            this.load.image('wall', 'assets/ambiente/3.png');
            
            // --- TEXTURE CUCINA ---
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
            
            // --- TELEFONO (ora in assets/Sala) ---
            this.load.image('phone', 'assets/Sala/phone.png');
            
            // --- PACCO (fornitore) ---
            this.load.image('pacco', 'assets/Sala/pacco.png');
            
            // --- AUDIO ---
            this.load.audio('vibrazione', 'assets/audio/vibrazione.wav');
            this.load.audio('scarico', 'assets/audio/scarico.mp3');
            
            // --- PIATTI E LAVELLO ---
            this.load.image('Piatto Sporco', 'assets/Cibo/Piatto Sporco.png');
            this.load.image('Lavello_vuoto', 'assets/Lavello/Lavello_vuoto.png');
            this.load.image('Lavello_mezzopieno', 'assets/Lavello/Lavello_mezzopieno.png');
            this.load.image('Lavello_pieno', 'assets/Lavello/Lavello_pieno.png');

            // --- TEXTURE CAMERIERA ---
            this.load.image('cameriera_avanti', 'assets/Cameriera/Cameriera_Avanti.png');
            this.load.image('cameriera_destra', 'assets/Cameriera/Cameriera_Destra.png');
            this.load.image('cameriera_dietro', 'assets/Cameriera/Cameriera_Dietro.png');
            this.load.image('cameriera_sinistra', 'assets/Cameriera/Cameriera_Sinistra.png');

            // --- CIBO ---
            Object.keys(FOOD_TEXTURES).forEach(foodName => {
                const fileName = FOOD_TEXTURES[foodName];
                this.load.image(foodName, `assets/Cibo/${fileName}.png`);
            });

            // --- NPC (caricati da NPC_CONFIG) ---
            Object.keys(NPC_REGISTRY).forEach(npcName => {
                const npcData = NPC_REGISTRY[npcName];
                if (npcData.hasTilesheet && npcData.path) {
                    this.load.spritesheet(npcData.key, npcData.path, {
                        frameWidth: npcData.frameWidth || 32,
                        frameHeight: npcData.frameHeight || 32
                    });
                }
            });

            // --- FONT ---
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
            this.isPaused = false;
            this.spawnEvent = null;
            this.priceSystem = null;
            this.quest = null;
            this.crime = null;
            this.supplier = null;
            this.trayIndicator = null;
            this.tilemap = null;
            this.isPhoneActive = false;
            this.ordersTaken = 0;
            this.maxOrders = 1;
            this.passPiattiZone = null;
            this.npcManager = null;
            this._phoneInputStates = null;
            
            // --- VARIABILI PER IL SISTEMA DI INTERAZIONE ---
            this.waitressHasOrder = false;
            this.waitressHasFood = false;
            this.carriedFood = null;
            this.currentOrder = null;
            // ----------------------------------------------------
        }
        
        create() {
            this.cameras.main.setBackgroundColor('#1a0a04');

            if (typeof window.PriceSystem === 'function') {
                this.priceSystem = new window.PriceSystem(this);
                console.log('💰 Sistema prezzi attivato!');
            }

            if (typeof window.QuestSystem === 'function') {
                this.quest = new window.QuestSystem(this);
                console.log('📋 Sistema missioni attivato!');
            }

            if (typeof window.CrimeSystem === 'function') {
                this.crime = new window.CrimeSystem(this);
                console.log('🕵️ Sistema criminale attivato!');
            }

            if (typeof window.SupplierSystem === 'function') {
                this.supplier = new window.SupplierSystem(this);
                console.log('📦 Sistema fornitore attivato!');
            }

            try {
                const savedUpgrades = JSON.parse(localStorage.getItem('waitress_house_upgrades') || '{}');
                notebookLevel = savedUpgrades.notebook || 0;
                adsLevel = savedUpgrades.ads || 0;
                cardsLevel = savedUpgrades.cards || 0;
            } catch(e) {
                notebookLevel = 0;
                adsLevel = 0;
                cardsLevel = 0;
            }

            if (notebookLevel > 0) {
                console.log(`📓 Taccuino livello ${notebookLevel}: puoi prendere ${1 + notebookLevel} comande`);
            } else {
                console.log('📓 Taccuino non acquistato: 1 comanda alla volta');
            }

            this.maxOrders = 1 + notebookLevel;
            this.ordersTaken = 0;
            console.log(`📓 Taccuino livello ${notebookLevel}: maxOrders = ${this.maxOrders}`);

            let savedData = null;
            try {
                const raw = localStorage.getItem('waitress_save_data');
                if (raw) savedData = JSON.parse(raw);
            } catch(e) {}

            if (savedData && savedData.level > 0) {
                GAME.score = savedData.score || 0;
                GAME.level = savedData.level || 1;
                GAME.customersServed = savedData.customersServed || 0;
                GAME.lives = savedData.lives || 3;
                GAME.dirtyPlates = savedData.dirtyPlates || 0;
                GAME.customersTarget = 6 + (GAME.level * 4);
                GAME.carriedOrder = null;

                if (savedData.housePurchased && window.HOUSE_STATE) {
                    window.HOUSE_STATE.purchased = savedData.housePurchased;
                }
                
                if (savedData.settings) {
                    GAME.settings = { ...GAME.settings, ...savedData.settings };
                }
            } else {
                GAME.customersServed = 0;
                GAME.dirtyPlates = 0;
                GAME.lives = 3;
                GAME.customersTarget = 10;
                GAME.level = 1;
                GAME.carriedOrder = null;
                GAME.score = 0;
                GAME.settings = {
                    soundEnabled: true,
                    difficulty: 'normale',
                    controls: 'wasd',
                    aiEnabled: true
                };
            }

            this.gameActive = true;
            this.cheatClicks = 0;
            this.tutorialActive = false;

            applyUpgrades();

            // 1. PRIMA crea lo stato della cameriera
            this.waitressState = {
                tray: [],
                targetX: 300,
                targetY: 300
            };
            this.pendingAction = null;

            // 2. POI crea la fisica e lo sprite della cameriera
            this.createWaitress();

            // 3. POI crea la Tilemap
            if (typeof window.TilemapSystem === 'function') {
                this.tilemap = new window.TilemapSystem(this);
                this.tilemap.createTileMap();
            } else {
                this.createFallbackTilemap();
            }

            // 4. Collider con i muri
            if (this.tilemap && this.tilemap.wallGroup) {
                this.physics.add.collider(this.waitress, this.tilemap.wallGroup);
            }

            // 5. POI crea tavoli, lavello, cucina, ecc.
            this.createRestaurant();
            this.createSink();
            
            if (typeof window.KitchenSystem === 'function') {
                this.kitchen = new window.KitchenSystem(this);
                console.log('✅ KitchenSystem inizializzato!');
                if (this.kitchen && this.kitchen.stations) {
                    console.log('🔍 Stazioni disponibili:', Object.keys(this.kitchen.stations));
                }
            } else {
                console.error('❌ KitchenSystem non trovato!');
                this.kitchen = null;
            }
            
            if (typeof window.BathroomSystem === 'function') {
                this.bathroom = new window.BathroomSystem(this);
            }
            
            if (typeof window.AIDialogueManager === 'function') {
                if (GAME.settings.aiEnabled) {
                    this.aiManager = new window.AIDialogueManager(this, true);
                } else {
                    this.aiManager = {
                        useFallback: true,
                        isModelReady: true,
                        openChat: (customer) => {
                            if (window.AIDialogueManager) {
                                const dummy = new window.AIDialogueManager(this, false);
                                dummy.openChat(customer);
                            }
                        }
                    };
                }
            }
            
            // Inizializza NPCManager
            if (this.aiManager && this.aiManager.npcManager) {
                this.npcManager = this.aiManager.npcManager;
            } else if (window.NPCManager) {
                this.npcManager = new window.NPCManager(this);
            }

            if (typeof window.StorySystem === 'function') {
                this.story = new window.StorySystem(this);
            }
            
            if (this.story) {
                this.story.storyState.moneySaved = GAME.score;
            }

            if (typeof window.RadioSystem === 'function') {
                this.radio = new window.RadioSystem(this);
            }

            // --- CREA LA ZONA PASS PIATTI ---
            this.createPassPiatti();

            this.time.removeAllEvents();

            const tutorialSkipped = localStorage.getItem('waitress_tutorial_done') === 'true';

            if (!tutorialSkipped) {
                window.FORCE_TUTORIAL = true;
            } else {
                window.FORCE_TUTORIAL = false;
            }

            if (window.FORCE_TUTORIAL && typeof window.TutorialSystem === 'function') {
                this.tutorialActive = true;
                this.tutorial = new window.TutorialSystem(this);
                GAME.level = 0; 
            } else {
                if (GAME.customersTarget === 0) {
                    GAME.customersTarget = 6 + GAME.level * 4;
                }
                this.startSpawning();
            }

            this.createBanconeZone();
            this.createHUD();
            this.createNotepadUI();

            if (typeof window.PhoneSystem === 'function') {
                this.phone = new window.PhoneSystem(this);
            }

            this.setupKeyboard();

            if (this.phone) {
                if (this.phone.phoneSprite) this.phone.phoneSprite.setDepth(30);
                if (this.phone.idleGlow) this.phone.idleGlow.setDepth(29);
                if (this.phone.ringIndicator) this.phone.ringIndicator.setDepth(31);
            }

            this.time.delayedCall(100, () => {
                this.children.list.forEach(child => {
                    if (child.texture && child.texture.key) {
                        const key = child.texture.key.toLowerCase();
                        if (key === 'birra') {
                            if (typeof child.setDisplaySize === 'function') {
                                child.setDisplaySize(28, 40);
                            }
                        }
                    }
                });
            });
        }

        startSpawning() {
            if (this.tutorialActive) return;

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
            
            this.ordersTaken = 0;
            this.maxOrders = 1 + notebookLevel;
            
            console.log(`📓 Taccuino: maxOrders = ${this.maxOrders}`);
            
            this.time.delayedCall(100, () => {
                this.updateHUD();
            });
            
            let spawnInterval = GAME.settings.difficulty === 'facile' ? 11000 : 
                                GAME.settings.difficulty === 'difficile' ? 7000 : 9000;
            
            if (adsLevel > 0) {
                const reduction = 1 - (adsLevel * 0.08);
                spawnInterval = Math.max(4000, spawnInterval * reduction);
                console.log(`📢 Campagna Pubblicitaria livello ${adsLevel}: spawn interval = ${Math.round(spawnInterval)}ms`);
            }
            
            if (this.spawnEvent) {
                this.spawnEvent.remove();
            }
            
            this.spawnEvent = this.time.addEvent({
                delay: spawnInterval,
                callback: () => { 
                    if (this.gameActive && this.customers.length < this.tables.length) {
                        this.trySpawnCustomer();
                    }
                },
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
                
                if (key.includes('spillatore') || (key.includes('birra') && key.includes('st_'))) {
                    if (typeof child.setDisplaySize === 'function') {
                        child.setDisplaySize(90, 85);
                    }
                } else if (key === 'birra') {
                    if (typeof child.setDisplaySize === 'function') {
                        child.setDisplaySize(28, 40);
                    }
                } else if (key.includes('caffe') && key.includes('st_')) {
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
                    if (lowerKey.includes('spillatore') || lowerKey.includes('st_birra')) {
                        ['sprite', 'graphic', 'image', 'icon', 'container'].forEach(prop => {
                            if (st[prop] && typeof st[prop].setDisplaySize === 'function') {
                                st[prop].setDisplaySize(90, 85);
                            }
                        });
                    }
                    if (lowerKey.includes('caffe') && lowerKey.includes('st_')) {
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
                'Birra': '🍺',
                'Arancina': '🧆',
                'Cassata': '🍰',
                'Chinotto': '🥤',
                'Cannolo': '🥐',
                'Ginseng': '☕',
                'Fritto Misto': '🍤',
                'Pasta al Pesto': '🍝',
                'Panino con la Milza': '🥖'
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
            const tileSize = 32;
            const mapWidth = 25;
            const mapHeight = 18;

            if (this.textures.exists('floor_sala')) {
                for (let x = 0; x < 576; x += tileSize) {
                    for (let y = 0; y < mapHeight * tileSize; y += tileSize) {
                        this.add.image(x + tileSize/2, y + tileSize/2, 'floor_sala')
                            .setDisplaySize(tileSize, tileSize)
                            .setDepth(0);
                    }
                }
            }
            if (this.textures.exists('floor_cucina')) {
                for (let x = 608; x < mapWidth * tileSize; x += tileSize) {
                    for (let y = 0; y < mapHeight * tileSize; y += tileSize) {
                        this.add.image(x + tileSize/2, y + tileSize/2, 'floor_cucina')
                            .setDisplaySize(tileSize, tileSize)
                            .setDepth(0);
                    }
                }
            }
            if (this.textures.exists('wall')) {
                for (let y = 0; y < mapHeight * tileSize; y += tileSize) {
                    const wall = this.add.image(592, y + tileSize/2, 'wall');
                    wall.setDisplaySize(tileSize, tileSize);
                    wall.setDepth(2);
                }
            }
        }
        
        createRestaurant() {
            const tablePositions = [
                { x: 180, y: 220, id: 1 },
                { x: 400, y: 220, id: 2 },
                { x: 180, y: 420, id: 3 },
                { x: 400, y: 420, id: 4 }
            ];
            
            tablePositions.forEach(pos => {
                this.add.ellipse(pos.x, pos.y + 38, 80, 20, 0x000000, 0.35).setDepth(pos.y - 1);
                
                const table = this.add.rectangle(pos.x, pos.y, 70, 45, 0x5c2c16);
                table.setStrokeStyle(2, 0xd27d2d);
                table.setDepth(pos.y);
                
                const labelTable = t('TABLE_SHORT') !== 'TABLE_SHORT' ? t('TABLE_SHORT') : 'Tav.';
                this.add.text(pos.x, pos.y - 30, `${labelTable} ${pos.id}`, {
                    fontSize: '11px',
                    color: '#ffd700',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }).setOrigin(0.5).setDepth(pos.y + 1);
                
                const tableData = {
                    id: pos.id,
                    x: pos.x,
                    y: pos.y,
                    occupied: false,
                    customer: null,
                    status: 'libero',
                    graphic: table,
                    dirtyLabel: null,
                    dirtySprite: null
                };
                
                table.setInteractive({ useHandCursor: true });
                
                // --- BLOCCA IL CLICK DIRETTO SUI TAVOLI ---
                table.on('pointerdown', () => {
                    if (this.isPhoneActive) {
                        return;
                    }
                    
                    const dist = Phaser.Math.Distance.Between(
                        this.waitress.x,
                        this.waitress.y,
                        pos.x,
                        pos.y
                    );
                    if (dist <= CONFIG.waitress.interactRange) {
                        this.interactWithTable(tableData);
                    } else {
                        this.showFloatingText(
                            pos.x,
                            pos.y - 40,
                            "Avvicinati con WASD!",
                            '#ffd700'
                        );
                    }
                });
                
                this.tables.push(tableData);
            });
        }

        createBanconeZone() {
            const passZone = this.add.rectangle(595, 420, 60, 80, 0x000000, 0.001);
            passZone.setDepth(6);
            passZone.setInteractive({ useHandCursor: true });
            
            // --- BLOCCA IL CLICK SUL BANCONE ---
            passZone.on('pointerdown', () => {
                if (this.isPhoneActive) {
                    return;
                }
                
                const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, 595, 420);
                if (dist <= CONFIG.waitress.interactRange + 30) {
                    this.handleCounterInteraction();
                } else {
                    this.showFloatingText(595, 420 - 30, 'Avvicinati al Pass Piatti!', '#ffd700');
                }
            });
        }

        createPassPiatti() {
            const passX = 595;
            const passY = 420;
            
            this.passPiattiZone = this.add.zone(passX, passY, 60, 80);
            this.passPiattiZone.setRectangleDropZone(60, 80);
            this.passPiattiZone.setInteractive({ useHandCursor: true });
            
            // --- BLOCCA IL CLICK SUL PASS PIATTI ---
            this.passPiattiZone.on('pointerdown', () => {
                if (this.isPhoneActive) {
                    return;
                }
                
                const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, passX, passY);
                if (dist <= CONFIG.waitress.interactRange + 30) {
                    this.handleCounterInteraction();
                } else {
                    this.showFloatingText(passX, passY - 30, 'Avvicinati al Pass Piatti!', '#ffd700');
                }
            });
        }
        
        createWaitress() {
            this.waitressShadow = this.add.ellipse(300, 320, 30, 10, 0x000000, 0.3);
            
            if (this.textures.exists('cameriera_avanti')) {
                this.waitress = this.add.image(300, 300, 'cameriera_avanti')
                    .setOrigin(0.5)
                    .setDepth(10)
                    .setScale(WAITRESS_SCALE);
            } else {
                this.waitress = this.add.text(300, 300, '👩‍🍳', {
                    fontSize: '36px'
                }).setOrigin(0.5).setDepth(10);
            }

            this.physics.add.existing(this.waitress, false);
            if (this.waitress.body) {
                this.waitress.body.setSize(24, 24);
                this.waitress.body.setOffset(6, 12);
                this.waitress.body.setCollideWorldBounds(true);
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
            
            this.trayText = this.add.text(560, 14, `${t('VASSOIO')} 0/${CONFIG.tray.maxTotal}`, {
                fontSize: '14px',
                color: '#3498db',
                fontFamily: 'Fredoka'
            }).setDepth(101);
            
            this.ordersText = this.add.text(670, 14, `📝 ${this.ordersTaken}/${this.maxOrders}`, {
                fontSize: '14px',
                color: '#9b59b6',
                fontFamily: 'Fredoka'
            }).setDepth(101);
            
            this.platesText = this.add.text(750, 14, `${t('PIATTI')} 0`, {
                fontSize: '12px',
                color: '#e67e22',
                fontFamily: 'Fredoka'
            }).setDepth(101);

            this.updateHUD();
        }
        
        createSink() {
            this.sinkSprite = this.add.image(122.5, 540, 'Lavello_vuoto').setDepth(2);
            this.sinkSprite.setDisplaySize(95, 45);
            
            this.sinkSprite.setInteractive({ useHandCursor: true });
            
            // --- BLOCCA IL CLICK SUL LAVELLO ---
            this.sinkSprite.on('pointerdown', () => {
                if (this.isPhoneActive) {
                    return;
                }
                
                const dist = Phaser.Math.Distance.Between(
                    this.waitress.x,
                    this.waitress.y,
                    100,
                    540
                );
                if (dist <= CONFIG.waitress.interactRange) {
                    this.washDishes();
                } else {
                    this.showFloatingText(
                        75,
                        510,
                        "Avvicinati con WASD!",
                        '#ffd700'
                    );
                }
            });

            this.updateSinkSprite();
        }

        updateSinkSprite() {
            if (!this.sinkSprite) return;
            let textureKey = 'Lavello_vuoto';
            const plates = GAME.dirtyPlates;
            if (plates >= 8) {
                textureKey = 'Lavello_pieno';
            } else if (plates >= 2) {
                textureKey = 'Lavello_mezzopieno';
            } else {
                textureKey = 'Lavello_vuoto';
            }
            if (this.sinkSprite.texture && this.sinkSprite.texture.key !== textureKey) {
                this.sinkSprite.setTexture(textureKey);
                this.sinkSprite.setDisplaySize(95, 45);
            }
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

        // ============================================================
        // BLOCCO GAMEPLAY DURANTE IL TELEFONO
        // ============================================================
        //
        // IMPORTANTE:
        // questo metodo NON mette in pausa Phaser.
        // NON ferma i timer.
        // NON ferma la pazienza dei clienti.
        //
        // Blocca esclusivamente:
        // - movimento cameriera
        // - click sui tavoli
        // - click sui clienti
        // - click sul lavello
        // - click sul pass piatti
        //
        // ============================================================

        setPhoneGameplayLock(locked) {

            this.isPhoneActive = !!locked;

            if (!this._phoneInputStates) {
                this._phoneInputStates = new Map();
            }

            const interactiveObjects = [];

            // --------------------------------------------------------
            // LAVELLO
            // --------------------------------------------------------

            if (this.sinkSprite) {
                interactiveObjects.push(
                    this.sinkSprite
                );
            }

            // --------------------------------------------------------
            // PASS PIATTI
            // --------------------------------------------------------

            if (this.passPiattiZone) {
                interactiveObjects.push(
                    this.passPiattiZone
                );
            }

            // --------------------------------------------------------
            // TAVOLI
            // --------------------------------------------------------

            if (Array.isArray(this.tables)) {

                this.tables.forEach(table => {

                    if (
                        table &&
                        table.graphic
                    ) {

                        interactiveObjects.push(
                            table.graphic
                        );
                    }
                });
            }

            // --------------------------------------------------------
            // CLIENTI
            // --------------------------------------------------------

            if (Array.isArray(this.customers)) {

                this.customers.forEach(customer => {

                    if (!customer) {
                        return;
                    }

                    [
                        'emoji',
                        'sprite',
                        'orderBubble',
                        'chatBubble'
                    ].forEach(key => {

                        if (customer[key]) {

                            interactiveObjects.push(
                                customer[key]
                            );
                        }
                    });
                });
            }

            // --------------------------------------------------------
            // BLOCCA
            // --------------------------------------------------------

            if (locked) {

                interactiveObjects.forEach(obj => {

                    if (
                        !obj ||
                        !obj.input
                    ) {
                        return;
                    }

                    if (
                        !this._phoneInputStates.has(obj)
                    ) {

                        this._phoneInputStates.set(
                            obj,
                            obj.input.enabled !== false
                        );
                    }

                    obj.input.enabled = false;
                });

                // ----------------------------------------------------
                // STOP IMMEDIATO CAMERIERA
                // ----------------------------------------------------

                if (
                    this.waitress &&
                    this.waitress.body
                ) {

                    this.waitress.body.setVelocity(
                        0,
                        0
                    );

                    if (
                        typeof this.waitress.body.stop ===
                        'function'
                    ) {

                        this.waitress.body.stop();
                    }
                }

            } else {

                // ----------------------------------------------------
                // RIPRISTINA INPUT
                // ----------------------------------------------------

                this._phoneInputStates.forEach(
                    (wasEnabled, obj) => {

                        if (
                            obj &&
                            obj.input
                        ) {

                            obj.input.enabled =
                                wasEnabled;
                        }
                    }
                );

                this._phoneInputStates.clear();
            }
        }

        setupKeyboard() {
            this.keys = this.input.keyboard.addKeys({
                w: Phaser.Input.Keyboard.KeyCodes.W,
                a: Phaser.Input.Keyboard.KeyCodes.A,
                s: Phaser.Input.Keyboard.KeyCodes.S,
                d: Phaser.Input.Keyboard.KeyCodes.D,
                e: Phaser.Input.Keyboard.KeyCodes.E,
                h: Phaser.Input.Keyboard.KeyCodes.H,
                k: Phaser.Input.Keyboard.KeyCodes.K,
                m: Phaser.Input.Keyboard.KeyCodes.M,
                shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                down: Phaser.Input.Keyboard.KeyCodes.DOWN,
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                space: Phaser.Input.Keyboard.KeyCodes.SPACE,
                esc: Phaser.Input.Keyboard.KeyCodes.ESC,
                p: Phaser.Input.Keyboard.KeyCodes.P
            });
        }

        togglePause() {
            this.isPaused = !this.isPaused;

            if (this.isPaused) {
                this.gameActive = false;
                this.physics.pause();
                this.time.paused = true;

                this.pauseBg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setDepth(200);
                this.pauseBg.setInteractive();

                this.pauseTitle = this.add.text(400, 220, '⏸️ PAUSA', {
                    fontSize: '48px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
                }).setOrigin(0.5).setDepth(201);

                this.createPauseButton(400, 300, 'RIPRENDI', '#2ecc71', () => {
                    this.togglePause();
                });

                this.createPauseButton(400, 360, 'RICOMINCIA LIVELLO', '#e67e22', () => {
                    this.togglePause();
                    this.scene.restart();
                });

                this.createPauseButton(400, 420, 'TORNA AL MENU', '#e74c3c', () => {
                    this.togglePause();
                    this.scene.start('Menu');
                });
            } else {
                this.gameActive = true;
                this.physics.resume();
                this.time.paused = false;

                if (this.pauseBg) this.pauseBg.destroy();
                if (this.pauseTitle) this.pauseTitle.destroy();
                if (this.pauseButtonContainer) {
                    this.pauseButtonContainer.destroy();
                    this.pauseButtonContainer = null;
                }
            }
        }

        createPauseButton(x, y, text, color, callback) {
            if (!this.pauseButtonContainer) {
                this.pauseButtonContainer = this.add.container(0, 0).setDepth(201);
            }
            
            const bg = this.add.rectangle(x, y, 280, 40, 0x000000).setStrokeStyle(2, color);
            const txt = this.add.text(x, y, text, {
                fontSize: '16px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            bg.setInteractive({ useHandCursor: true });
            bg.on('pointerover', () => { bg.setFillStyle(color, 0.3); });
            bg.on('pointerout', () => { bg.setFillStyle(0x000000, 1); });
            bg.on('pointerdown', callback);
            
            this.pauseButtonContainer.add([bg, txt]);
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
                this.trayText.setText(`${t('VASSOIO')} ${this.waitressState.tray.length}/${CONFIG.tray.maxTotal}`);
            }
            if (this.ordersText && this.ordersText.active) {
                this.ordersText.setText(`📝 ${this.ordersTaken}/${this.maxOrders}`);
                if (this.ordersTaken >= this.maxOrders) {
                    this.ordersText.setColor('#e74c3c');
                } else {
                    this.ordersText.setColor('#9b59b6');
                }
            }
            if (this.platesText && this.platesText.active) {
                this.platesText.setText(`${t('PIATTI')} ${GAME.dirtyPlates}`);
            }

            this.updateSinkSprite();
        }
        
        // ============================================================
        // MODIFICATO: spawnCustomer() usa NPCManager
        // ============================================================
        spawnCustomer() {
            if (this.customers.length >= this.tables.length) return;

            let freeTable = this.tables.find(t => !t.occupied && t.status === 'libero');
            if (!freeTable) {
                freeTable = this.tables.find(t => !t.occupied && t.status === 'piatto_sporco');
            }
            if (!freeTable) return;

            if (freeTable.occupied === true) return;

            freeTable.occupied = true;

            // Usa il NPCManager per generare il cliente
            let customer = null;
            if (this.npcManager && typeof this.npcManager.spawnCustomer === 'function') {
                customer = this.npcManager.spawnCustomer();
            }
            
            // Fallback se NPCManager non disponibile
            if (!customer) {
                customer = this.generateFallbackCustomer();
            }
            
            if (!customer) {
                freeTable.occupied = false;
                return;
            }

            // Se il customer ha già un ordine ma ha anche una lista di piatti preferiti
            // e l'ordine non è stato impostato, usa il primo piatto della lista
            if (!customer.order && customer.favoriteFoods && customer.favoriteFoods.length > 0) {
                customer.order = customer.favoriteFoods[Phaser.Math.Between(0, customer.favoriteFoods.length - 1)];
            }
            
            // Se ancora non ha un ordine, usa un piatto casuale dalla lista completa
            if (!customer.order) {
                const foods = Object.keys(FOOD_TEXTURES);
                customer.order = foods[Phaser.Math.Between(0, foods.length - 1)];
            }

            customer.table = freeTable;
            customer.x = freeTable.x;
            customer.y = freeTable.y;
            
            freeTable.customer = customer;
            freeTable.status = 'ordinazione_pronta';

            if (freeTable.dirtySprite) {
                freeTable.dirtySprite.destroy();
                freeTable.dirtySprite = null;
            }
            if (freeTable.dirtyLabel) {
                freeTable.dirtyLabel.destroy();
                freeTable.dirtyLabel = null;
            }
            
            this.createCustomerGraphics(customer);
            this.customers.push(customer);
        }

        // ============================================================
        // NUOVO: generateFallbackCustomer() per emergenza
        // ============================================================
        generateFallbackCustomer() {
            // Metodo di emergenza se NPCManager non è disponibile
            const fallbackNames = ['Elena', 'Maria', 'Francesco', 'Rosa'];
            const foods = Object.keys(FOOD_TEXTURES);
            const name = fallbackNames[Phaser.Math.Between(0, fallbackNames.length - 1)];
            const npcConfig = NPC_REGISTRY[name] || {};
            
            return {
                name: name,
                order: foods[Phaser.Math.Between(0, foods.length - 1)],
                patience: 100,
                bladder: 0,
                gender: npcConfig.gender || 'female',
                isInBathroom: false,
                bubbleIcon: null,
                isDead: false,
                table: null,
                relationScore: 50,
                adoptTrigger: npcConfig.adoptTrigger || false,
                patienceMultiplier: npcConfig.patienceMultiplier || 1.0,
                bringsChild: false,
                emojiChar: npcConfig.emojiChar || '👩',
                hasTilesheet: npcConfig.hasTilesheet || false,
                tilesheetKey: npcConfig.key || null,
                x: 0,
                y: 0,
                orderBubble: null,
                chatBubble: null,
                childGraphic: null,
                patienceBar: null,
                patienceBg: null,
                emoji: null,
                sprite: null,
                timerEvent: null,
                noTip: npcConfig.noTip || false,
                tipMultiplier: npcConfig.tipMultiplier || 1.0,
                serve: () => {
                    this.time.delayedCall(CONFIG.customers.eatingDuration, () => {
                        this.finishMeal(this.customers[this.customers.length - 1]);
                    });
                }
            };
        }
        
        createCustomerGraphics(customer) {
            const table = customer.table;
            
            customer.shadow = this.add.ellipse(table.x, table.y + 35, 40, 10, 0x000000, 0.25);
            customer.shadow.setDepth(table.y - 1);
            
            if (customer.hasTilesheet && customer.tilesheetKey && this.textures.exists(customer.tilesheetKey)) {
                customer.sprite = this.add.sprite(table.x, table.y + 10, customer.tilesheetKey, 0);
                customer.sprite.setScale(1.2);
                customer.sprite.setDepth(table.y);
                customer.sprite.setInteractive({ useHandCursor: true });
                
                if (this.anims.exists(`${customer.tilesheetKey}_idle_0`)) {
                    customer.sprite.play(`${customer.tilesheetKey}_idle_0`);
                }
            } else {
                customer.emoji = this.add.text(table.x, table.y + 10, customer.emojiChar, {
                    fontSize: '36px'
                }).setOrigin(0.5).setDepth(table.y).setInteractive({ useHandCursor: true });
            }

            if (customer.bringsChild) {
                customer.childGraphic = this.add.text(table.x + 24, table.y + 24, '👶', {
                    fontSize: '16px'
                }).setOrigin(0.5).setDepth(table.y);
            }

            customer.orderBubble = this.add.text(table.x - 18, table.y - 15, '📝 ?', {
                fontSize: '11px',
                color: '#ffffff',
                backgroundColor: '#110906',
                padding: { x: 4, y: 3 }
            }).setOrigin(0.5).setDepth(table.y + 2).setInteractive({ useHandCursor: true });

            customer.chatBubble = this.add.text(table.x + 22, table.y - 15, '💬', {
                fontSize: '12px',
                color: '#ffffff',
                backgroundColor: '#27ae60',
                padding: { x: 4, y: 3 }
            }).setOrigin(0.5).setDepth(table.y + 2).setInteractive({ useHandCursor: true });
            
            const handleTableClick = () => {
                if (this.isPhoneActive) return;
                
                const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, table.x, table.y);
                if (dist <= CONFIG.waitress.interactRange) {
                    this.interactWithTable(table);
                } else {
                    this.showFloatingText(table.x, table.y - 40, "Avvicinati con WASD!", '#ffd700');
                }
            };

            const handleChatClick = (pointer, localX, localY, event) => {
                if (event && typeof event.stopPropagation === 'function') {
                    event.stopPropagation();
                } else if (pointer && pointer.event && typeof pointer.event.stopPropagation === 'function') {
                    pointer.event.stopPropagation();
                }
                
                if (this.isPhoneActive) return;
                
                this.currentCustomer = customer;
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
            
            const npcConfig = NPC_REGISTRY[customer.name] || {};
            const isElderly = npcConfig.age && npcConfig.age >= 60;
            let patienceBonus = 0;
            
            if (isElderly && cardsLevel > 0) {
                patienceBonus = cardsLevel * 5;
                customer.patienceMultiplier = Math.max(0.5, customer.patienceMultiplier - (patienceBonus / 100));
                console.log(`🃏 Mazzo di carte livello ${cardsLevel}: anziano ${customer.name} pazienza +${patienceBonus}%`);
            }
            
            customer.patienceBg = this.add.rectangle(table.x, table.y - 28, 50, 4, 0x333333);
            customer.patienceBg.setDepth(table.y - 1);
            
            customer.patienceBar = this.add.rectangle(table.x - 25, table.y - 28, 50, 4, 0x2ecc71);
            customer.patienceBar.setOrigin(0, 0.5);
            customer.patienceBar.setDepth(table.y);
            
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
                loop: true,
                paused: false
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
        
        // ============================================================
        // MODIFICATO: finishMeal() - CONSUMA CIBO
        // ============================================================
        finishMeal(customer) {
            let basePay = 14;
            if (this.priceSystem) {
                basePay = this.priceSystem.getFoodPrice(customer.order);
            }
            
            // Considera il moltiplicatore mancia specifico dell'NPC
            const customerConfig = NPC_REGISTRY[customer.name] || {};
            const tipMultiplier = customerConfig.tipMultiplier || customer.tipMultiplier || 1.0;
            const noTip = customerConfig.noTip || customer.noTip || false;
            
            let multiplier = customer.patience > 50 ? 1.3 : (customer.patience < 20 ? 0.8 : 1.0);
            let tip = Math.floor(basePay * multiplier);
            
            // Marco non lascia mance
            if (noTip) {
                tip = 0;
            } else {
                tip = Math.floor(tip * tipMultiplier);
            }
            
            GAME.score += tip;
            GAME.customersServed++;
            this.updateHUD();
            
            this.showFloatingText(customer.table.x, customer.table.y - 40, 
                noTip ? `💰 +${tip}€ (niente mancia)` : `+${tip}€ 💵`, '#2ecc71');
            triggerSfx('coin');
            
            // ============================================================
            // CONSUMA CIBO DALLE SCORTE
            // ============================================================
            if (this.supplier && typeof this.supplier.consumeFood === 'function') {
                const consumed = this.supplier.consumeFood(1);
                if (!consumed) {
                    // Se non c'è cibo, non dovrebbe succedere, ma logghiamo
                    console.warn('⚠️ Scorte esaurite! Il cliente ha mangiato ma le scorte sono a 0!');
                }
            }
            
            customer.table.status = 'piatto_sporco';
            
            if (this.textures.exists('Piatto Sporco')) {
                customer.table.dirtySprite = this.add.image(customer.table.x, customer.table.y + 15, 'Piatto Sporco')
                    .setDisplaySize(32, 32)
                    .setDepth(customer.table.y + 1);
            } else {
                customer.table.dirtyLabel = this.add.text(customer.table.x, customer.table.y + 15, '🍽️ SPORCO', {
                    fontSize: '8px',
                    color: '#e67e22',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }).setOrigin(0.5).setDepth(customer.table.y + 1);
            }
            
            // FERMA IL TIMER DEL CLIENTE PRIMA DI RIMUOVERLO
            if (customer.timerEvent) {
                customer.timerEvent.remove();
                customer.timerEvent = null;
            }
            
            this.removeCustomer(customer);
            
            if (GAME.customersServed >= GAME.customersTarget) {
                this.levelComplete();
            }
        }
        
        // ============================================================
        // MODIFICATO: removeCustomer() - CON FERMO TIMER
        // ============================================================
        removeCustomer(customer) {
            if (!customer) return;
            
            customer.isDead = true;
            
            // FERMA IL TIMER
            if (customer.timerEvent) {
                customer.timerEvent.remove();
                customer.timerEvent = null;
            }
            
            if (customer.table) {
                customer.table.occupied = false;
                customer.table.customer = null;
                if (customer.table.status !== 'piatto_sporco') {
                    customer.table.status = 'piatto_sporco';
                }
            }
            
            const toDestroy = [
                'emoji', 'sprite', 'childGraphic', 'orderBubble', 'chatBubble',
                'bubbleIcon', 'shadow', 'patienceBar', 'patienceBg'
            ];
            
            toDestroy.forEach(key => {
                if (customer[key]) {
                    try {
                        customer[key].destroy();
                    } catch(e) {
                        // Ignora errori di distruzione
                    }
                    customer[key] = null;
                }
            });
            
            const index = this.customers.indexOf(customer);
            if (index > -1) {
                this.customers.splice(index, 1);
            }
        }
        
        ensureTrayIndicator() {
            if (!this.trayIndicator || !this.trayIndicator.active) {
                this.trayIndicator = this.add.text(0, 0, '', {
                    fontSize: '16px',
                    fontFamily: 'Fredoka',
                    stroke: '#000000',
                    strokeThickness: 3
                }).setDepth(11).setOrigin(0.5);
                
                if (this.waitress) {
                    this.trayIndicator.x = this.waitress.x;
                    this.trayIndicator.y = this.waitress.y - 30;
                }
            }
        }
        
        // ============================================================
        // interactWithTable() - con blocco telefono
        // ============================================================
        interactWithTable(table) {
            if (this.isPhoneActive) return;
            
            if (!table) return;
            
            if (table.customer && table.customer.isDead) {
                table.customer = null;
                table.occupied = false;
                return;
            }
            
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
                if (this.ordersTaken >= this.maxOrders) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 30, 
                        `📓 Taccuino pieno! Massimo ${this.maxOrders} comande.`, '#ff4444');
                    triggerSfx('alert');
                    return;
                }
                
                if (GAME.carriedOrder) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 30, t('ERR_ALREADY_ORDER'), '#ff4444');
                    triggerSfx('click');
                    return;
                }
                
                triggerSfx('pickup');
                
                this.ordersTaken++;
                
                GAME.carriedOrder = {
                    tableId: table.id,
                    foodName: table.customer.order
                };
                
                table.status = 'attesa_cibo';
                
                if (table.customer.orderBubble && table.customer.orderBubble.active) {
                    table.customer.orderBubble.setText('⏳ Cibo');
                    table.customer.orderBubble.setColor('#ffd700');
                }
                
                this.updateNotepadUI(true);
                this.updateHUD();
                
                this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                    `📝 Ordine preso! (${this.ordersTaken}/${this.maxOrders})`, '#ffd700');
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
                    
                    this.ensureTrayIndicator();
                    this.updateTrayGraphics();
                    this.updateHUD();
                    
                    this.ordersTaken = Math.max(0, this.ordersTaken - 1);
                    this.updateHUD();
                    
                    // ============================================================
                    // FASE MANGIA - GESTIONE CORRETTA DEL TIMER
                    // ============================================================
                    const eatingCustomer = table.customer;

                    if (eatingCustomer.timerEvent) {
                        eatingCustomer.timerEvent.remove();
                        eatingCustomer.timerEvent = null;
                    }

                    table.status = 'mangia';

                    eatingCustomer.timerEvent = this.time.delayedCall(
                        CONFIG.customers.eatingDuration,
                        () => {
                            if (
                                eatingCustomer.isDead ||
                                !eatingCustomer.table ||
                                eatingCustomer.table.customer !== eatingCustomer ||
                                eatingCustomer.table.status !== 'mangia'
                            ) {
                                return;
                            }

                            eatingCustomer.timerEvent = null;
                            this.finishMeal(eatingCustomer);
                        }
                    );

                    if (table.customer.orderBubble && table.customer.orderBubble.active) {
                        table.customer.orderBubble.setText('🍽️ Mmm!');
                    }

                    this.showFloatingText(table.x, table.y - 40, t('MSG_SERVED'), '#2ecc71');
                } else {
                    this.showFloatingText(table.x, table.y - 40, `⏳ Vuole: ${table.customer.order}`, '#f39c12');
                }
                return;
            }
            
            if (table.status === 'piatto_sporco') {
                if (this.waitressState.tray.length >= CONFIG.tray.maxTotal) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 40, 'Vassoio pieno!', '#ff4444');
                    triggerSfx('alert');
                    return;
                }
                if (GAME.dirtyPlates >= CONFIG.dishes.maxDirty) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 40, t('ERR_SINK_FULL'), '#ff4444');
                    triggerSfx('alert');
                    return;
                }
                
                triggerSfx('pickup');
                table.status = 'libero';
                
                this.waitressState.tray.push({ food: 'piatto_sporco' });
                
                this.ensureTrayIndicator();
                this.updateTrayGraphics();
                this.updateHUD();
                
                if (table.dirtySprite) {
                    table.dirtySprite.destroy();
                    table.dirtySprite = null;
                }
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
        
        // ============================================================
        // interactWithBancone() - con blocco telefono
        // ============================================================
        interactWithBancone() {
            if (this.isPhoneActive) return;
            
            if (this.tutorialActive && this.tutorialStepTarget === 'counter') {
                this.tutorial.progressStep();
                return;
            }

            const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, 595, 420);
            if (dist > CONFIG.waitress.interactRange + 30) {
                this.showFloatingText(this.waitress.x, this.waitress.y - 30, t('ERR_CLOSE_COUNTER'), '#ff4444');
                triggerSfx('click');
                return;
            }
            
            this.handleCounterInteraction();
        }
        
        pickUpFoodFromCounter() {
            if (this.waitressState.tray.length >= CONFIG.tray.maxTotal) {
                this.showFloatingText(this.waitress.x, this.waitress.y - 30, t('ERR_TRAY_FULL'), '#ff4444');
                triggerSfx('alert');
                return;
            }
            
            if (!this.kitchen) {
                this.showFloatingText(595, this.waitress.y - 30, '❌ Cucina non disponibile!', '#ff4444');
                return;
            }

            const food = this.kitchen.pickUpFood();
            if (food) {
                triggerSfx('pickup');
                this.waitressState.tray.push({ food: food });
                
                this.ensureTrayIndicator();
                this.updateTrayGraphics();
                this.updateHUD();
                
                const emoji = this.getFoodEmoji(food);
                this.showFloatingText(this.waitress.x, this.waitress.y - 40, `${emoji} ${food} pronto!`, '#2ecc71');
            } else {
                this.showFloatingText(595, this.waitress.y - 30, '📦 Nessun cibo pronto', '#999999');
            }
        }
        
        // ============================================================
        // handleCounterInteraction() - decrementa ordersTaken
        // ============================================================
        handleCounterInteraction() {
            if (GAME.carriedOrder) {
                const order = GAME.carriedOrder;
                const foodName = order.foodName;
                const tableId = order.tableId;

                const normalizedFood = String(foodName || '')
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .trim();

                const foodStationMap = {
                    'pizza': 'forno',
                    'patatine': 'friggitrice',
                    'panino': 'fornelli',
                    'risotto': 'fornelli',
                    'pasta al pesto': 'fornelli',
                    'panino milza': 'fornelli',
                    'caponata': 'fornelli',
                    'arancina': 'friggitrice',
                    'fritto misto': 'friggitrice',
                    'cassata': 'forno',
                    'cannolo': 'forno',
                    'chinotto': 'bevande',
                    'caffe': 'caffe',
                    'ginseng': 'caffe',
                    'birra': 'spillatore',
                    'cola': 'bevande',
                    'acqua': 'frigo'
                };

                const stationKey = foodStationMap[normalizedFood];

                if (!stationKey) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                        '❌ Nessuna stazione per questo cibo!', '#ff0000');
                    console.warn('Nessuna stazione per foodName:', foodName, 'normalizzato:', normalizedFood);
                    return;
                }

                if (this.kitchen && typeof this.kitchen.addOrder === 'function') {
                    const added = this.kitchen.addOrder(stationKey, foodName, tableId);
                    if (added) {
                        this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                            `📝 ${t('ORDER_SENT')}`, '#00ff00');
                        triggerSfx('cook');
                        
                        // DECREMENTA ordersTaken quando l'ordine viene consegnato al cuoco
                        this.ordersTaken = Math.max(0, this.ordersTaken - 1);
                        
                        GAME.carriedOrder = null;
                        this.waitressHasOrder = false;
                        this.currentOrder = null;
                        this.updateNotepadUI(true);
                        this.updateHUD();
                        return;
                    }
                    this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                        '⚠️ Il cuoco non può prendere l\'ordine!', '#ffaa00');
                    return;
                }
                return;
            }

            if (!this.kitchen) {
                this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                    '❌ Cucina non disponibile!', '#ff4444');
                return;
            }

            if (this.kitchen.counterSlots) {
                const occupiedSlots = this.kitchen.counterSlots.filter(slot => slot.occupied);
                console.log(`🔍 Slot occupati nel pass: ${occupiedSlots.length}`, occupiedSlots);
                
                if (occupiedSlots.length === 0) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                        'Nessun piatto pronto nel pass', '#999999');
                    return;
                }
            }

            if (typeof this.kitchen.pickUpFood === 'function') {
                const food = this.kitchen.pickUpFood();
                if (food) {
                    this.waitressState.tray.push({ food: food });
                    
                    this.ensureTrayIndicator();
                    this.updateTrayGraphics();
                    this.updateHUD();
                    
                    const emoji = this.getFoodEmoji(food);
                    this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                        `${emoji} ${food} ${t('FOOD_TAKEN')}`, '#2ecc71');
                    triggerSfx('pickup');
                    
                    console.log(`✅ Cibo preso dal pass: ${food}`);
                    return;
                }
            }

            this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                '⚠️ Problema nel prelevare il cibo!', '#ffaa00');
        }
        
        updateTrayGraphics() {
            const count = this.waitressState.tray.length;
            const dirtyCount = this.waitressState.tray.filter(item => item.food === 'piatto_sporco').length;
            const foodCount = count - dirtyCount;
            
            this.ensureTrayIndicator();
            
            let indicatorText = '';
            if (count > 0) {
                if (dirtyCount > 0 && foodCount > 0) {
                    indicatorText = '🍽️🍕';
                } else if (dirtyCount > 0) {
                    indicatorText = dirtyCount === 1 ? '🍽️' : dirtyCount === 2 ? '🍽️🍽️' : '🍽️🍽️🍽️';
                } else if (foodCount > 0) {
                    indicatorText = foodCount === 1 ? '🍕' : foodCount === 2 ? '🍕🍕' : '🍕🍕🍕';
                }
            }
            
            if (this.trayIndicator && this.trayIndicator.active) {
                this.trayIndicator.setText(indicatorText);
                this.trayIndicator.x = this.waitress.x;
                this.trayIndicator.y = this.waitress.y - 30;
            }
        }
        
        // ============================================================
        // interactWithClosest() - con blocco telefono
        // ============================================================
        interactWithClosest() {
            if (!this.gameActive || this.isPaused || this.isPhoneActive) return;

            const passDist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, 595, 420);
            if (passDist <= CONFIG.waitress.interactRange + 30) {
                this.handleCounterInteraction();
                return;
            }

            let closestTable = null;
            let minDistance = Infinity;

            this.tables.forEach(table => {
                const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, table.x, table.y);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestTable = table;
                }
            });

            if (closestTable && minDistance <= CONFIG.waitress.interactRange) {
                this.interactWithTable(closestTable);
                return;
            }
            
            this.showFloatingText(this.waitress.x, this.waitress.y - 30, 'Niente da fare qui', '#999999');
        }
        
        // ============================================================
        // washDishes() - con blocco telefono
        // ============================================================
        washDishes() {
            if (this.isPhoneActive) return;
            
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

            const dirtyInTray = this.waitressState.tray.filter(item => item.food === 'piatto_sporco').length;
            if (dirtyInTray > 0) {
                for (let i = this.waitressState.tray.length - 1; i >= 0; i--) {
                    if (this.waitressState.tray[i].food === 'piatto_sporco') {
                        this.waitressState.tray.splice(i, 1);
                        GAME.dirtyPlates++;
                        break;
                    }
                }
                
                this.ensureTrayIndicator();
                this.updateTrayGraphics();
                this.updateHUD();
                this.showFloatingText(75, 510, '🧹 Piatto depositato!', '#3498db');
                triggerSfx('pickup');
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
        
        // ============================================================
        // MODIFICATO: update() - CON BLOCO ALL'INIZIO
        // ============================================================
        update(time, delta) {
            if (!this.gameActive && !this.isPaused) return;
            if (this.isPaused) return;

            // ============================================================
            // BLOCCA TUTTO SE IL TELEFONO È ATTIVO
            // ============================================================
            if (this.isPhoneActive) {
                // Ferma la cameriera
                if (this.waitress && this.waitress.body) {
                    this.waitress.body.setVelocity(0, 0);
                    if (typeof this.waitress.body.stop === 'function') {
                        this.waitress.body.stop();
                    }
                }
                
                // Blocca il movimento
                this.waitress.x = Phaser.Math.Clamp(this.waitress.x, 40, 560);
                this.waitress.y = Phaser.Math.Clamp(this.waitress.y, 70, 560);
                
                // Non processare altro
                return;
            }
            // ============================================================

            // +++ PULISCI I CLIENTI MORTI +++
            this.customers = this.customers.filter(c => {
                if (c.isDead) {
                    if (c.table) {
                        c.table.occupied = false;
                        c.table.customer = null;
                    }
                    return false;
                }
                return true;
            });

            // I timer dei clienti CONTINUANO anche durante il telefono
            // (non fermiamo i customer.timerEvent)

            // Aggiorna sistemi che devono continuare
            if (!this.tutorialActive) {
                if (this.kitchen && typeof this.kitchen.update === 'function') this.kitchen.update();
                if (this.bathroom && typeof this.bathroom.update === 'function') this.bathroom.update(time, delta);
                if (this.phone && typeof this.phone.update === 'function') this.phone.update(time, delta);
            }

            if (this.quest && typeof this.quest.update === 'function') {
                this.quest.update();
            }

            if (this.crime && typeof this.crime.update === 'function') {
                this.crime.update(time, delta);
            }

            if (this.supplier && this.supplier.packageSpawned && this.waitress) {
                const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, 100, 480);
                if (dist <= 50) {
                    this.supplier.pickUpPackage();
                }
            }

            if (this.supplier && this.supplier.foodStock <= 0) {
                if (!this.supplier._lowStockWarningShown) {
                    this.showFloatingText(400, 140, '📦 SCORTE ESAURITE! Chiama il fornitore!', '#ff4d4d');
                    this.supplier._lowStockWarningShown = true;
                }
            } else if (this.supplier) {
                this.supplier._lowStockWarningShown = false;
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.k) && this.keys.shift.isDown) {
                GAME.customersServed = GAME.customersTarget;
                GAME.score += 100;
                this.showFloatingText(400, 250, '🔑 Trucco attivato!', '#ffd700');
                this.levelComplete();
                return;
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.e) && this.keys.shift.isDown) {
                const elena = this.customers.find(c => c.name === 'Elena');
                if (elena) {
                    elena.relationScore = 100;
                    this.showFloatingText(elena.x, elena.y - 50, '❤️ SINTONIA MASSIMA!', '#ff4757');
                    triggerSfx('coin');
                    
                    if (this.quest && typeof this.quest.startElenaAdoptionQuest === 'function') {
                        this.quest.startElenaAdoptionQuest();
                    }
                    if (this.story) {
                        this.story.storyState.elenaAdoptionQuest = true;
                        this.story.saveStoryData();
                    }
                } else {
                    this.showFloatingText(400, 250, '❌ Elena non è nel locale.', '#ff4444');
                }
                return;
            }

            if (Phaser.Input.Keyboard.JustDown(this.keys.m) && this.keys.shift.isDown) {
                GAME.score = 15000;
                this.updateHUD();
                this.showFloatingText(400, 250, '💰 15.000€ OTTENUTI! ORA COMPRA IL LOCALE!', '#ffd700');
                triggerSfx('coin');
                
                if (this.story) {
                    this.story.updateMoney();
                }
                return;
            }

            // --- BLOCCA H / ESC / P DURANTE LA CHIAMATA ---
            if (
                !this.isPhoneActive &&
                Phaser.Input.Keyboard.JustDown(this.keys.h)
            ) {
                this.goToHouse();
                return;
            }

            if (
                !this.isPhoneActive &&
                (
                    Phaser.Input.Keyboard.JustDown(
                        this.keys.esc
                    ) ||
                    Phaser.Input.Keyboard.JustDown(
                        this.keys.p
                    )
                )
            ) {
                this.togglePause();
                return;
            }

            // ===========================================================
            // MOVIMENTO CAMERIERA
            // ===========================================================

            let moveX = 0;
            let moveY = 0;

            // Durante il telefono NON leggiamo WASD/frecce.
            if (!this.isPhoneActive) {

                const controls =
                    GAME.settings.controls || 'wasd';

                if (controls === 'wasd') {

                    if (this.keys.w?.isDown) {
                        moveY = -1;
                    }

                    if (this.keys.s?.isDown) {
                        moveY = 1;
                    }

                    if (this.keys.a?.isDown) {
                        moveX = -1;
                    }

                    if (this.keys.d?.isDown) {
                        moveX = 1;
                    }

                } else {

                    if (this.keys.up?.isDown) {
                        moveY = -1;
                    }

                    if (this.keys.down?.isDown) {
                        moveY = 1;
                    }

                    if (this.keys.left?.isDown) {
                        moveX = -1;
                    }

                    if (this.keys.right?.isDown) {
                        moveX = 1;
                    }
                }
            }

            // Movimento diagonale
            if (
                moveX !== 0 &&
                moveY !== 0
            ) {
                moveX *= 0.7071;
                moveY *= 0.7071;
            }

            // ===========================================================
            // VELOCITÀ
            // ===========================================================

            if (this.waitress.body) {

                if (this.isPhoneActive) {

                    // BLOCCO ASSOLUTO
                    this.waitress.body.setVelocity(
                        0,
                        0
                    );

                    // Cancella anche eventuale velocità residua
                    if (
                        typeof this.waitress.body.stop ===
                        'function'
                    ) {
                        this.waitress.body.stop();
                    }

                } else {

                    if (
                        moveX !== 0 ||
                        moveY !== 0
                    ) {
                        this.waitress.body.setVelocity(
                            moveX * CONFIG.waitress.speed,
                            moveY * CONFIG.waitress.speed
                        );
                    } else {
                        this.waitress.body.setVelocity(
                            0,
                            0
                        );
                    }
                }
            }

            // ===========================================================
            // ANIMAZIONE / DIREZIONE
            // ===========================================================

            if (
                !this.isPhoneActive &&
                this.waitress &&
                typeof this.waitress.setTexture ===
                    'function'
            ) {

                if (moveX > 0) {

                    this.waitress.setTexture(
                        'cameriera_destra'
                    );

                    this.waitress.setScale(
                        WAITRESS_SCALE
                    );

                } else if (moveX < 0) {

                    this.waitress.setTexture(
                        'cameriera_sinistra'
                    );

                    this.waitress.setScale(
                        WAITRESS_SCALE
                    );

                } else if (moveY < 0) {

                    this.waitress.setTexture(
                        'cameriera_dietro'
                    );

                    this.waitress.setScale(
                        WAITRESS_SCALE
                    );

                } else if (moveY > 0) {

                    this.waitress.setTexture(
                        'cameriera_avanti'
                    );

                    this.waitress.setScale(
                        WAITRESS_SCALE
                    );
                }
            }

            if (this.waitress.body) {
                this.waitress.x = Phaser.Math.Clamp(
                    this.waitress.x,
                    40,
                    560
                );

                this.waitress.y = Phaser.Math.Clamp(
                    this.waitress.y,
                    70,
                    560
                );
            }

            this.waitress.setDepth(this.waitress.y);

            if (this.waitressShadow) {
                this.waitressShadow.x = this.waitress.x;
                this.waitressShadow.y = this.waitress.y + 16;
            }

            if (this.trayIndicator && this.trayIndicator.active) {
                this.trayIndicator.x = this.waitress.x;
                this.trayIndicator.y = this.waitress.y - 30;
            }

            // SPACE = interazione.
            // Durante il telefono NON deve funzionare.
            if (
                !this.isPhoneActive &&
                Phaser.Input.Keyboard.JustDown(this.keys.space)
            ) {
                this.interactWithClosest();
            }
        }
        
        // ============================================================
        // MODIFICATO: updateRelationship() usa sentiment-based
        // ============================================================
        updateRelationship(delta, feedback) {
            if (!this.currentCustomer) return;
            
            if (this.npcManager && typeof this.npcManager.updateRelationshipFromMessage === 'function') {
                // Usa il NPCManager per gestire la relazione
                const result = this.npcManager.updateRelationshipFromMessage(
                    this.currentCustomer.name,
                    feedback
                );
                
                this.currentCustomer.relationScore = this.npcManager.getRelationship(
                    this.currentCustomer.name
                );
                
                const relationEl = document.getElementById("ai-chat-relation");
                if (relationEl) {
                    relationEl.textContent = `${Math.floor(this.currentCustomer.relationScore)}%`;
                }
                
                if (this.showFloatingText) {
                    const color = result.delta > 0 ? "#ff4757" : "#e74c3c";
                    this.showFloatingText(
                        this.currentCustomer.x,
                        this.currentCustomer.y - 45,
                        `${result.delta > 0 ? '❤️ +' : '💔 '}${result.delta} Sintonia`,
                        color
                    );
                }
                
                // Gestisci eventi speciali
                if (result.specialEvent === 'BREAKUP') {
                    this.gameOver();
                } else if (result.specialEvent === 'ADOPTION_READY') {
                    if (this.quest && typeof this.quest.startElenaAdoptionQuest === 'function') {
                        this.quest.startElenaAdoptionQuest();
                    }
                }
            } else {
                // Fallback: metodo originale
                if (typeof this.currentCustomer.relationScore !== "number") {
                    this.currentCustomer.relationScore = 50;
                }
                let newScore = this.currentCustomer.relationScore + delta;
                this.currentCustomer.relationScore = Phaser.Math.Clamp(newScore, 0, 100);
                
                const relationEl = document.getElementById("ai-chat-relation");
                if (relationEl) {
                    relationEl.textContent = `${Math.floor(this.currentCustomer.relationScore)}%`;
                }
                
                const infoText = `[Sistema]: ${feedback} (+${delta} Sintonia)`;
                if (typeof this.appendMessage === 'function') {
                    this.appendMessage("system", infoText);
                }
                
                if (this.showFloatingText) {
                    this.showFloatingText(
                        this.currentCustomer.x,
                        this.currentCustomer.y - 45,
                        `❤️ +${delta} Sintonia`,
                        "#ff4757"
                    );
                }
                
                if (this.currentCustomer.name === 'Elena' && this.currentCustomer.relationScore >= 100) {
                    if (this.quest && typeof this.quest.startElenaAdoptionQuest === 'function') {
                        const alreadyActive = this.quest.activeQuests && this.quest.activeQuests.find(q => q.id === 'elena_adoption');
                        const alreadyCompleted = this.quest.completedQuests && this.quest.completedQuests.includes('elena_adoption');
                        
                        if (!alreadyActive && !alreadyCompleted) {
                            console.log("Hai raggiunto il massimo della sintonia con Elena.");
                            this.quest.startElenaAdoptionQuest();
                        }
                    }
                }
            }
        }

        levelComplete() {
            this.gameActive = false;
            this.showFloatingText(400, 300, t('DAY_COMPLETE'), '#ffd700');
            triggerSfx('coin');
            
            if (this.priceSystem) {
                this.priceSystem.updateInflation(GAME.level);
                console.log(`📈 Inflazione aggiornata al giorno ${GAME.level}`);
            }
            
            if (GAME.score >= 15000) {
                this.showFloatingText(400, 250, '🏆 HAI RAGGIUNTO 15.000€! LOCALE TUO!', '#ffd700');
                triggerSfx('coin');
            }
            
            if (this.story) {
                this.story.onDayComplete(GAME.level);
            }

            const saveData = {
                score: GAME.score,
                level: GAME.level + 1,
                customersServed: 0,
                lives: 3,
                dirtyPlates: 0,
                settings: GAME.settings,
                housePurchased: window.HOUSE_STATE ? window.HOUSE_STATE.purchased : []
            };
            
            localStorage.setItem('waitress_save_data', JSON.stringify(saveData));
            
            if (window.SaveManager && typeof window.SaveManager.saveGame === 'function') {
                window.SaveManager.saveGame(saveData).then(() => {
                    console.log("💾 Backup IndexedDB aggiornato!");
                }).catch(err => {
                    console.error("Errore backup IndexedDB:", err);
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

    // ==================== MENU SCENE ====================
    class MenuScene extends Phaser.Scene {
        constructor() {
            super('Menu');
            this.menuButtons = [];
        }
        
        create() {
            this.cameras.main.setBackgroundColor('#1a0a04');
            this.menuButtons = [];
            
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
                
                if (localStorage.getItem('waitress_tutorial_done') === 'true') {
                    window.FORCE_TUTORIAL = false;
                } else {
                    window.FORCE_TUTORIAL = true;
                }
                
                if (typeof window.SaveMenu === 'function') {
                    this.openSaveMenu();
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

        openSaveMenu() {
            if (this.menuButtons) {
                this.menuButtons.forEach(btn => btn.disableInteractive());
            }

            const blocker = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.75)
                .setDepth(150)
                .setInteractive();

            const backBtnBg = this.add.rectangle(400, 520, 220, 38, 0xe74c3c)
                .setStrokeStyle(1.5, 0xffffff)
                .setDepth(300)
                .setInteractive({ useHandCursor: true });

            const backBtnTxt = this.add.text(400, 520, '⬅️ TORNA AL MENU', {
                fontSize: '14px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5).setDepth(301);

            let saveMenuInstance = null;
            if (typeof window.SaveMenu === 'function') {
                saveMenuInstance = new window.SaveMenu(this);
                if (typeof saveMenuInstance.showMenu === 'function') {
                    saveMenuInstance.showMenu();
                }
            }

            const closeSaveMenu = () => {
                triggerSfx('click');

                if (saveMenuInstance) {
                    if (typeof saveMenuInstance.hide === 'function') saveMenuInstance.hide();
                    if (typeof saveMenuInstance.hideMenu === 'function') saveMenuInstance.hideMenu();
                    if (typeof saveMenuInstance.close === 'function') saveMenuInstance.close();
                    if (typeof saveMenuInstance.destroy === 'function') saveMenuInstance.destroy();
                    if (saveMenuInstance.container && typeof saveMenuInstance.container.destroy === 'function') {
                        saveMenuInstance.container.destroy();
                    }
                }

                const domOverlays = document.querySelectorAll('.save-menu-overlay, .save-menu-modal, #saveMenuOverlay, .save-modal');
                domOverlays.forEach(el => el.remove());

                this.scene.restart();
            };

            backBtnBg.on('pointerdown', closeSaveMenu);
            backBtnBg.on('pointerover', () => backBtnBg.setFillStyle(0xc0392b));
            backBtnBg.on('pointerout', () => backBtnBg.setFillStyle(0xe74c3c));
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

            if (!this.menuButtons) this.menuButtons = [];
            this.menuButtons.push(bg);
        }
    }

    // ==================== GAME OVER SCENE ====================
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

            this.add.text(400, 340, t('LANGUAGE_SELECT'), {
                fontSize: '14px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const langs = getLanguages();
            const langKeys = Object.keys(langs);
            const currentLangCode = getCurrentLang();
            let langIndex = langKeys.indexOf(currentLangCode);
            if (langIndex === -1) langIndex = 0;

            const currentLangData = langs[currentLangCode] || langs['it'];

            const langBox = this.add.rectangle(400, 370, 200, 30, 0x2c1a11);
            langBox.setStrokeStyle(1, 0xd27d2d);

            const langTxt = this.add.text(400, 370, `${currentLangData.flag} ${currentLangData.name}`, {
                fontSize: '13px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const prevBtn = this.add.rectangle(270, 370, 40, 30, 0xd27d2d);
            prevBtn.setStrokeStyle(1, 0xffd700);
            prevBtn.setInteractive({ useHandCursor: true });
            
            this.add.text(270, 370, '◀', {
                fontSize: '16px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            prevBtn.on('pointerover', () => prevBtn.setFillStyle(0xe59866));
            prevBtn.on('pointerout', () => prevBtn.setFillStyle(0xd27d2d));
            prevBtn.on('pointerdown', () => {
                langIndex = (langIndex - 1 + langKeys.length) % langKeys.length;
                triggerSfx('click');
                switchLanguage(langKeys[langIndex]);
                this.scene.restart();
            });

            const nextBtn = this.add.rectangle(530, 370, 40, 30, 0xd27d2d);
            nextBtn.setStrokeStyle(1, 0xffd700);
            nextBtn.setInteractive({ useHandCursor: true });

            this.add.text(530, 370, '▶', {
                fontSize: '16px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            nextBtn.on('pointerover', () => nextBtn.setFillStyle(0xe59866));
            nextBtn.on('pointerout', () => nextBtn.setFillStyle(0xd27d2d));
            nextBtn.on('pointerdown', () => {
                langIndex = (langIndex + 1) % langKeys.length;
                triggerSfx('click');
                switchLanguage(langKeys[langIndex]);
                this.scene.restart();
            });

            this.add.text(400, 415, t('INTELLIGENZA ARTIFICIALE'), {
                fontSize: '14px',
                color: '#ffffff',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const aiBtn = this.add.rectangle(400, 445, 240, 30, GAME.settings.aiEnabled ? 0x27ae60 : 0xe74c3c);
            aiBtn.setStrokeStyle(1, 0xffffff);
            aiBtn.setInteractive({ useHandCursor: true });

            const aiTxt = this.add.text(400, 445, GAME.settings.aiEnabled ? 'INTELLIGENZA ARTIFICIALE: ON' : 'INTELLIGENZA ARTIFICIALE: OFF', {
                fontSize: '12px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            aiBtn.on('pointerdown', () => {
                GAME.settings.aiEnabled = !GAME.settings.aiEnabled;
                triggerSfx('click');
                aiBtn.setFillStyle(GAME.settings.aiEnabled ? 0x27ae60 : 0xe74c3c);
                aiTxt.setText(GAME.settings.aiEnabled ? 'INTELLIGENZA ARTIFICIALE: ON' : 'INTELLIGENZA ARTIFICIALE: OFF');
                
                try {
                    const raw = localStorage.getItem('waitress_save_data');
                    let data = raw ? JSON.parse(raw) : {};
                    data.settings = GAME.settings;
                    localStorage.setItem('waitress_save_data', JSON.stringify(data));
                } catch(e) {}
            });

            const backBtn = this.add.rectangle(400, 500, 260, 36, 0xd27d2d);
            backBtn.setStrokeStyle(2, 0xffd700);
            backBtn.setInteractive({ useHandCursor: true });
            
            this.add.text(400, 500, t('TORNA'), {
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

    // ==================== CREDITS SCENE ====================
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

    // Nota: La classe SettingsScene deve essere definita altrove o commentata se non presente
    // Per ora la lascio come placeholder
    class SettingsScene extends Phaser.Scene {
        constructor() {
            super('Settings');
        }
        
        create() {
            this.cameras.main.setBackgroundColor('#1a0a04');
            
            const card = this.add.rectangle(400, 300, 500, 400, 0x110906, 0.9);
            card.setStrokeStyle(2, 0xd27d2d);
            
            this.add.text(400, 80, 'IMPOSTAZIONI', {
                fontSize: '28px',
                color: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            this.add.text(400, 150, 'Impostazioni in sviluppo...', {
                fontSize: '16px',
                color: '#e0d5c1',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            
            const backBtn = this.add.rectangle(400, 350, 240, 40, 0xd27d2d);
            backBtn.setStrokeStyle(1.5, 0xffffff);
            backBtn.setInteractive({ useHandCursor: true });
            
            this.add.text(400, 350, 'TORNA AL MENU', {
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

    // ==================== CONFIGURAZIONE PHASER ====================
    const scenesList = [PreloadScene, MenuScene, SettingsScene, CreditsScene, GameScene, GameOverScene];
    
    if (window.HouseScene) {
        scenesList.push(window.HouseScene);
    }
    if (window.LevelSummaryScene) {
        scenesList.push(window.LevelSummaryScene);
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
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        render: {
            pixelArt: true,
            antialias: false,
            roundPixels: true
        }
    };

    // ==================== AVVIO GIOCO ====================
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
})();