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

    function unlockAudioContext() {
        try {
            if (window.game && window.game.sound && window.game.sound.context) {
                const ctx = window.game.sound.context;
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
            }
            if (window.AUDIO && window.AUDIO.ctx && window.AUDIO.ctx.state === 'suspended') {
                window.AUDIO.ctx.resume();
            }
        } catch (e) {}
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
            patienceDuration: 25000,
            eatingDuration: 12000
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

    let notebookLevel = 0;
    let adsLevel = 0;
    let cardsLevel = 0;

    const WAITRESS_SCALE = 0.35;
    const UNIFORM_SIZE = 45;
    const ENTRANCE_X = 240;
    const ENTRANCE_Y = 592;

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

    const NPC_REGISTRY = window.NPC_CONFIG || {};

    let GAME = {
        score: 0,
        level: 1,
        customersServed: 0,
        customersTarget: 10,
        lives: 3,
        dirtyPlates: 0,
        carriedOrder: null,
        isCheater: false,
        suspicion: 0,
        compartmentHidden: false,
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
        CONFIG.customers.patienceDuration = 25000;
        CONFIG.dishes.washDuration = 1200;

        if (HOUSE_STATE.purchased.includes('bed')) {
            CONFIG.waitress.speed = 360;
        }
        if (HOUSE_STATE.purchased.includes('tv')) {
            CONFIG.customers.patienceDuration = 32000;
        }
        if (HOUSE_STATE.purchased.includes('coffee')) {
            CONFIG.dishes.washDuration = 700;
        }
    }

    class SynthAudio {
        constructor() {
            this.ctx = null;
            this.unlocked = false;
        }
        init() {
            if (!this.ctx) {
                try {
                    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    this.ctx = null;
                }
            }
        }
        unlock() {
            this.init();
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            this.unlocked = true;
        }
        playSfx(type) {
            if (!GAME.settings.soundEnabled) return;
            try {
                this.init();
                if (!this.ctx) return;
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
            } catch (e) {}
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
    window.unlockAudioContext = unlockAudioContext;

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

            this.load.on('loaderror', (file) => {});

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
            
            this.load.image('phone', 'assets/Sala/phone.png');
            this.load.image('pacco', 'assets/Sala/pacco.png');
            this.load.image('radio', 'assets/Sala/radio.png');
            
            this.load.audio('vibrazione', 'assets/audio/vibrazione.wav');
            this.load.audio('scarico', 'assets/audio/scarico.mp3');
            this.load.audio('npc_call_center', 'assets/audio/Pubblicita/npc_call_center.mp3');
            this.load.audio('npc_call_center_1', 'assets/audio/Pubblicita/npc_call_center_1.mp3');
            this.load.audio('npc_call_center_2', 'assets/audio/Pubblicita/npc_call_center_2.mp3');

            this.load.image('Piatto Sporco', 'assets/Cibo/Piatto Sporco.png');
            this.load.image('Lavello_vuoto', 'assets/Lavello/Lavello_vuoto.png');
            this.load.image('Lavello_mezzopieno', 'assets/Lavello/Lavello_mezzopieno.png');
            this.load.image('Lavello_pieno', 'assets/Lavello/Lavello_pieno.png');

            this.load.image('cameriera_avanti', 'assets/Cameriera/Cameriera_Avanti.png');
            this.load.image('cameriera_destra', 'assets/Cameriera/Cameriera_Destra.png');
            this.load.image('cameriera_dietro', 'assets/Cameriera/Cameriera_Dietro.png');
            this.load.image('cameriera_sinistra', 'assets/Cameriera/Cameriera_Sinistra.png');

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
                
                if (npcData.textureUp && npcData.textureDown && npcData.textureLeft && npcData.textureRight) {
                    this.load.image(npcData.textureUp, `assets/NPC/${npcName}/${npcData.textureUp}`);
                    this.load.image(npcData.textureDown, `assets/NPC/${npcName}/${npcData.textureDown}`);
                    this.load.image(npcData.textureLeft, `assets/NPC/${npcName}/${npcData.textureLeft}`);
                    this.load.image(npcData.textureRight, `assets/NPC/${npcName}/${npcData.textureRight}`);
                }
            });

            this.load.image('Poliziotto_Avanti', 'assets/NPC/Poliziotto/Poliziotto_Avanti.png');
            this.load.image('Poliziotto_Dietro', 'assets/NPC/Poliziotto/Poliziotto_Dietro.png');
            this.load.image('Poliziotto_Sinistra', 'assets/NPC/Poliziotto/Poliziotto_Sinistra.png');
            this.load.image('Poliziotto_Destra', 'assets/NPC/Poliziotto/Poliziotto_Destra.png');

            this.load.image('bubble_order', 'assets/UI/bubbles/bubble_order.png');
            this.load.image('bubble_talk', 'assets/UI/bubbles/bubble_talk.png');
            this.load.image('bubble_happy', 'assets/UI/bubbles/bubble_happy.png');
            this.load.image('bubble_angry', 'assets/UI/bubbles/bubble_angry.png');
            this.load.image('bubble_sad', 'assets/UI/bubbles/bubble_sad.png');
            this.load.image('bubble_cash', 'assets/UI/engine/bubble_cash.png');
            this.load.image('bubble_pee', 'assets/UI/bubbles/bubble_pee.png');
            this.load.image('bubble_music', 'assets/UI/bubbles/bubble_music.png');
            this.load.image('bubble_mission', 'assets/UI/bubbles/bubble_mission.png');

            if (!document.getElementById('fredoka-font-link')) {
                const link = document.createElement('link');
                link.id = 'fredoka-font-link';
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap';
                document.head.appendChild(link);
            }
        }

        create() {
            const unlockAudio = () => {
                try {
                    if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
                        this.sound.context.resume();
                    }
                    unlockAudioContext();
                    SYNTH.unlock();
                } catch (e) {}
            };

            this.input.on('pointerdown', unlockAudio);
            this.input.on('keydown', unlockAudio);

            this.events.once('shutdown', () => {
                this.input.off('pointerdown', unlockAudio);
                this.input.off('keydown', unlockAudio);
            });

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
            this.playerNickname = 'Cameriera';
            this.callCenterSound = null;
            this.packageClickZone = null;
            this.packageTooltip = null;
            this.sinkCollider = null;
            this.hiddenCompartment = null;
            this.inspectionActive = false;
            
            this.waitressHasOrder = false;
            this.waitressHasFood = false;
            this.carriedFood = null;
            this.currentOrder = null;
            this.levelEarnings = 0;

            this.isCheater = false;
            this.arrestTriggered = false;
            this.policeNPC = null;
        }
        
        cleanupCustomers() {
            if (!this.customers) return;
            this.customers.forEach(customer => {
                if (!customer) return;
                if (customer.timerEvent) {
                    customer.timerEvent.remove();
                    customer.timerEvent = null;
                }
                if (customer.movementTimeout) {
                    customer.movementTimeout.remove();
                    customer.movementTimeout = null;
                }
                ['emoji', 'sprite', 'childGraphic', 'bubble', 'bubbleIcon',
                 'shadow', 'patienceBar', 'patienceBg'].forEach(key => {
                    if (customer[key] && customer[key].destroy) {
                        try { customer[key].destroy(); } catch(e) {}
                        customer[key] = null;
                    }
                });
                customer.isDead = true;
            });
            this.customers = [];
        }
        
        create() {
            this.cameras.main.setBackgroundColor('#1a0a04');

            const unlockAudio = () => {
                try {
                    if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
                        this.sound.context.resume();
                    }
                    unlockAudioContext();
                    SYNTH.unlock();
                } catch (e) {}
            };

            this.input.on('pointerdown', unlockAudio);
            this.input.on('keydown', unlockAudio);

            this.events.once('shutdown', () => {
                this.input.off('pointerdown', unlockAudio);
                this.input.off('keydown', unlockAudio);
            });

            this.cleanupCustomers();
            this.customers = [];
            this.tables = [];

            if (this.spawnEvent) {
                this.spawnEvent.remove();
                this.spawnEvent = null;
            }
            this.time.removeAllEvents();

            this.ordersTaken = 0;
            this.levelEarnings = 0;
            this.isPhoneActive = false;
            this.isPaused = false;
            this.arrestTriggered = false;
            this.policeNPC = null;
            this.packageClickZone = null;
            this.packageTooltip = null;
            this.trayIndicator = null;
            this.waitressState = { tray: [], targetX: 300, targetY: 300 };
            this.pendingAction = null;
            this.currentCustomer = null;
            this.gameActive = true;
            this.cheatClicks = 0;
            this.tutorialActive = false;
            this.hiddenCompartment = null;
            this.inspectionActive = false;

            this.playerNickname = localStorage.getItem('waitress_nickname') || 'Cameriera';

            if (this.sound.get('npc_call_center')) {
                this.callCenterSound = this.sound.add('npc_call_center', {
                    volume: 0.5,
                    loop: false
                });
            }

            if (typeof window.PriceSystem === 'function') {
                this.priceSystem = new window.PriceSystem(this);
            }
            if (typeof window.QuestSystem === 'function') {
                this.quest = new window.QuestSystem(this);
            }
            if (typeof window.CrimeSystem === 'function') {
                this.crime = new window.CrimeSystem(this);
            }
            if (typeof window.SupplierSystem === 'function') {
                this.supplier = new window.SupplierSystem(this);
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

            this.maxOrders = 1 + notebookLevel;

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

                let isSaveTampered = false;
                try {
                    const rawSave = localStorage.getItem('waitress_save_data');
                    if (rawSave) {
                        const parsedSave = JSON.parse(rawSave);
                        if (parsedSave && parsedSave.sig) {
                            isSaveTampered = !window.SaveManager.verifySave(parsedSave);
                        }
                    }
                } catch (e) {}

                GAME.isCheater = isSaveTampered;

                if (isSaveTampered) {
                    localStorage.setItem('waitress_cheater_flag', 'true');
                } else {
                    localStorage.removeItem('waitress_cheater_flag');
                }

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
                GAME.isCheater = false;
                GAME.suspicion = 0;
                GAME.compartmentHidden = false;
                GAME.settings = {
                    soundEnabled: true,
                    difficulty: 'normale',
                    controls: 'wasd',
                    aiEnabled: true
                };
            }

            this.isCheater = GAME.isCheater || false;

            if (typeof GAME.suspicion !== 'number') GAME.suspicion = 0;
            if (typeof GAME.compartmentHidden !== 'boolean') GAME.compartmentHidden = false;

            applyUpgrades();

            this.createWaitress();

            if (typeof window.TilemapSystem === 'function') {
                this.tilemap = new window.TilemapSystem(this);
                this.tilemap.createTileMap();
            } else {
                this.createFallbackTilemap();
            }

            if (this.tilemap && this.tilemap.wallGroup) {
                this.physics.add.collider(this.waitress, this.tilemap.wallGroup);
            }

            this.createRestaurant();
            this.createSink();

            if (typeof window.KitchenSystem === 'function') {
                this.kitchen = new window.KitchenSystem(this);
            } else {
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

            if (this.story && this.crime) {
                if (this.story.canTriggerClanMission(GAME.level)) {
                    this.time.delayedCall(8000, () => {
                        if (this.story && this.story.canTriggerClanMission(GAME.level)) {
                            this.story.triggerClanCall();
                        }
                    });
                }
            }

            if (typeof window.RadioSystem === 'function') {
                this.radio = new window.RadioSystem(this);
                if (this.radio.isPurchased && !this.radio.isPlaced && this.radio.deliveryPending) {
                    const currentDay = window.GAME.level;
                    const deliveryDay = this.radio.getDeliveryDay();
                    if (deliveryDay && currentDay >= deliveryDay) {
                        this.radio.completeDelivery();
                    } else if (deliveryDay && currentDay < deliveryDay) {
                        this.radio.setPendingRadioDelivery();
                    }
                }
            }

            this.createPassPiatti();
            this.createHiddenCompartment();

            const tutorialSkipped = localStorage.getItem('waitress_tutorial_done') === 'true';
            window.FORCE_TUTORIAL = !tutorialSkipped;

            if (window.FORCE_TUTORIAL && typeof window.TutorialSystem === 'function') {
                this.tutorialActive = true;
                this.tutorial = new window.TutorialSystem(this);
                GAME.level = 0;
            } else {
                if (GAME.customersTarget === 0) {
                    GAME.customersTarget = 6 + GAME.level * 4;
                }
                if (!this.isCheater) {
                    this.startSpawning();
                }
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

            if (this.isCheater) {
                this.time.delayedCall(1000, () => {
                    this.spawnPoliceArrest();
                });
            }
        }

        createHiddenCompartment() {
            const compartmentX = 700;
            const compartmentY = 500;

            const textureExists = this.textures.exists('scomparto_nascosto');

            if (textureExists) {
                this.hiddenCompartment = this.add.image(compartmentX, compartmentY, 'scomparto_nascosto')
                    .setInteractive({ useHandCursor: true })
                    .setDepth(100);
            } else {
                this.hiddenCompartment = this.add.rectangle(compartmentX, compartmentY, 60, 60, 0x2c1a11, 0.7)
                    .setStrokeStyle(2, 0xd27d2d)
                    .setInteractive({ useHandCursor: true })
                    .setDepth(100);

                this.add.text(compartmentX, compartmentY, '🗄️', {
                    fontSize: '28px'
                }).setOrigin(0.5).setDepth(101);
            }

            if (GAME.compartmentHidden) {
                this.hiddenCompartment.setVisible(false);
            }

            let clickCount = 0;
            let clickTimer = null;

            this.hiddenCompartment.on('pointerdown', () => {
                if (this.isPhoneActive) return;
                if (GAME.compartmentHidden) return;

                clickCount++;
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                    }, 300);
                } else if (clickCount === 2) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    GAME.compartmentHidden = true;
                    this.hiddenCompartment.setVisible(false);
                    this.showFloatingText(compartmentX, compartmentY - 20, '🔒 Scomparto Nascosto!', '#2ecc71');
                    triggerSfx('pickup');
                }
            });
        }

        checkPoliceInspection() {
            if (GAME.suspicion >= 100 && !this.inspectionActive) {
                this.inspectionActive = true;
                this.gameActive = false;

                this.showFloatingText(400, 300, '🚨 CONTROLLO FINANZA IN CORSO! 🚨', '#ff0000');
                triggerSfx('alert');

                this.time.delayedCall(4000, () => {
                    if (GAME.compartmentHidden) {
                        this.showFloatingText(400, 300, '✅ Ispezione superata! Nessun illecito trovato.', '#2ecc71');
                        GAME.suspicion = 0;
                        this.gameActive = true;
                        this.inspectionActive = false;
                    } else {
                        this.inspectionActive = false;
                        this.arrestWaitress();
                    }
                });
            }
        }

        startSpawning() {
            if (this.tutorialActive) return;
            if (this.isCheater) return;

            this.customers = [];
            this.tables.forEach(t => {
                t.occupied = false;
                t.reserved = false;
                t.customer = null;
                t._seatedCustomer = null;
                t._activeOrder = null;
                if (!t.dirty) t.status = 'libero';
            });

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
            
            this.time.delayedCall(100, () => {
                this.updateHUD();
            });
            
            let spawnInterval = GAME.settings.difficulty === 'facile' ? 11000 : 
                                GAME.settings.difficulty === 'difficile' ? 7000 : 9000;
            
            if (adsLevel > 0) {
                const reduction = 1 - (adsLevel * 0.08);
                spawnInterval = Math.max(4000, spawnInterval * reduction);
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
            if (!this.tutorialActive && !this.isCheater) {
                this.spawnCustomer();
            }
        }

        spawnPoliceArrest() {
            if (!this.isCheater || this.arrestTriggered) return;
            this.arrestTriggered = true;
            this.gameActive = false;
            this.tutorialActive = false;
            
            if (this.spawnEvent) this.spawnEvent.remove();
            
            const police = {
                name: 'Poliziotto',
                hasDirectionalTextures: true,
                textureUp: 'Poliziotto_Dietro',
                textureDown: 'Poliziotto_Avanti',
                textureLeft: 'Poliziotto_Sinistra',
                textureRight: 'Poliziotto_Destra',
                x: ENTRANCE_X,
                y: ENTRANCE_Y,
                sprite: null,
                shadow: null,
                speed: 70,
                movementData: null
            };
            
            if (!this.textures.exists('Poliziotto_Avanti')) {
                police.shadow = this.add.ellipse(police.x, police.y + 10, 20, 5, 0x000000, 0.25).setDepth(police.y - 1);
                police.sprite = this.add.text(police.x, police.y, '👮', {
                    fontSize: '32px'
                }).setOrigin(0.5).setDepth(police.y);
                police.isEmoji = true;
            } else {
                police.shadow = this.add.ellipse(police.x, police.y + 10, 20, 5, 0x000000, 0.25).setDepth(police.y - 1);
                police.sprite = this.add.image(police.x, police.y, police.textureDown)
                    .setDisplaySize(UNIFORM_SIZE, UNIFORM_SIZE)
                    .setDepth(police.y);
            }
            
            const targetX = this.waitress.x;
            const targetY = this.waitress.y;
            const waypoints = [
                { x: ENTRANCE_X, y: ENTRANCE_Y },
                { x: 240, y: 500 },
                { x: targetX, y: targetY }
            ];
            
            police.movementData = {
                waypoints: waypoints,
                currentWaypoint: 1,
                destination: waypoints[1],
                movementComplete: false
            };
            
            this.policeNPC = police;
            
            this.showFloatingText(400, 300, '🚔 La Polizia è arrivata!', '#ff0000');
            triggerSfx('alert');
        }

        arrestWaitress() {
            if (!this.policeNPC || !this.waitress) {
                this.policeNPC = this.policeNPC || { isEmoji: true, sprite: null };
            }
            
            if (this.waitress && this.waitress.setTint) {
                this.waitress.setTint(0x888888);
            }
            if (this.policeNPC && this.policeNPC.sprite && !this.policeNPC.isEmoji && this.policeNPC.textureDown) {
                this.policeNPC.sprite.setTexture(this.policeNPC.textureDown);
            }
            
            this.time.paused = true;
            this.physics.pause();
            
            const arrestText = this.add.text(400, 300, 
                "PROCURA DELLA REPUBBLICA DI PALERMO\n\n" +
                "Mandato di Arresto Esecutivo\n\n" +
                "La S.V. è in arresto per il reato di\n" +
                "Frode Informatica e Alterazione di Dati.\n\n" +
                "Le sue azioni sono state registrate.\n" +
                "Ogni tentativo di manomissione è punito\n" +
                "ai sensi dell'Art. 615-ter C.P.\n\n" +
                "La cameriera è in stato di fermo.", 
                {
                    fontSize: '15px',
                    color: '#ffffff',
                    align: 'center',
                    fontFamily: 'Fredoka',
                    lineSpacing: 6,
                    backgroundColor: '#000000',
                    padding: { x: 20, y: 20 }
                }
            ).setOrigin(0.5).setDepth(5000).setAlpha(0);

            this.tweens.add({
                targets: arrestText,
                alpha: 1,
                duration: 800,
                ease: 'Power2'
            });

            triggerSfx('alert');

            this.time.delayedCall(6000, () => {
                localStorage.removeItem('waitress_save_data');
                localStorage.removeItem('waitress_tutorial_done');
                localStorage.removeItem('waitress_cheater_flag');
                if (window.HOUSE_STATE) window.HOUSE_STATE.purchased = [];
                window.location.reload();
            });
        }

        updatePoliceMovement(delta) {
            if (!this.policeNPC || !this.policeNPC.movementData || !this.policeNPC.sprite) return;
            
            const data = this.policeNPC.movementData;
            if (data.movementComplete) return;
            
            const dx = data.destination.x - this.policeNPC.sprite.x;
            const dy = data.destination.y - this.policeNPC.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= 4) {
                this.policeNPC.sprite.x = data.destination.x;
                this.policeNPC.sprite.y = data.destination.y;
                
                if (data.waypoints && data.currentWaypoint < data.waypoints.length - 1) {
                    data.currentWaypoint++;
                    data.destination = data.waypoints[data.currentWaypoint];
                    return;
                }
                
                data.movementComplete = true;
                this.arrestWaitress();
                return;
            }
            
            const speed = this.policeNPC.speed || 70;
            const step = Math.min(distance, speed * (delta / 1000));
            const ratio = step / distance;
            
            this.policeNPC.sprite.x += dx * ratio;
            this.policeNPC.sprite.y += dy * ratio;
            this.policeNPC.sprite.setDepth(this.policeNPC.sprite.y);
            
            if (this.policeNPC.shadow) {
                this.policeNPC.shadow.x = this.policeNPC.sprite.x;
                this.policeNPC.shadow.y = this.policeNPC.sprite.y + 10;
            }
            
            if (!this.policeNPC.isEmoji) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.policeNPC.sprite.setTexture(dx > 0 ? this.policeNPC.textureRight : this.policeNPC.textureLeft);
                } else {
                    this.policeNPC.sprite.setTexture(dy > 0 ? this.policeNPC.textureDown : this.policeNPC.textureUp);
                }
            }
        }

        playCallCenterAudio() {
            if (!GAME.settings.soundEnabled) return;

            const runPlayback = () => {
                if (this.callCenterSound && this.sound.get('npc_call_center')) {
                    if (this.callCenterSound.isPlaying) {
                        this.callCenterSound.stop();
                    }
                    try {
                        this.callCenterSound.play();
                    } catch (e) {
                        triggerSfx('click');
                    }
                } else {
                    triggerSfx('click');
                }
            };

            if (this.sound && this.sound.context) {
                if (this.sound.context.state === 'suspended') {
                    this.sound.context.resume().then(runPlayback).catch(runPlayback);
                    return;
                }
            }
            runPlayback();
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
                
                this.physics.add.existing(table, true);
                if (table.body) {
                    table.body.setSize(70, 45);
                    table.body.setOffset((table.width - 70) / 2, (table.height - 45) / 2);
                }
                
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
                    reserved: false,
                    customer: null,
                    _seatedCustomer: null,
                    _activeOrder: null,
                    status: 'libero',
                    dirty: false,
                    graphic: table,
                    dirtyLabel: null,
                    dirtySprite: null
                };
                
                table.setInteractive({ useHandCursor: true });
                
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
            this.sinkSprite = this.add.image(
                122.5,
                540,
                'Lavello_vuoto'
            ).setDepth(2);

            this.sinkSprite.setDisplaySize(95, 45);

            this.sinkCollider = this.add.rectangle(
                122.5,
                540,
                88,
                38,
                0xff0000,
                0
            );

            this.physics.add.existing(
                this.sinkCollider,
                true
            );

            this.sinkCollider.body.setSize(88, 38);
            this.sinkCollider.body.setOffset(0, 0);

            this.sinkCollider.setVisible(false);

            this.sinkSprite.setInteractive({
                useHandCursor: true
            });

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

                if (
                    dist <= CONFIG.waitress.interactRange
                ) {
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

        setPhoneGameplayLock(locked) {
            this.isPhoneActive = !!locked;

            if (!this._phoneInputStates) {
                this._phoneInputStates = new Map();
            }

            const interactiveObjects = [];

            if (this.sinkSprite) interactiveObjects.push(this.sinkSprite);
            if (this.passPiattiZone) interactiveObjects.push(this.passPiattiZone);
            
            if (Array.isArray(this.tables)) {
                this.tables.forEach(table => {
                    if (table && table.graphic) interactiveObjects.push(table.graphic);
                });
            }

            if (Array.isArray(this.customers)) {
                this.customers.forEach(customer => {
                    if (!customer) return;
                    ['emoji', 'sprite', 'bubble'].forEach(key => {
                        if (customer[key]) interactiveObjects.push(customer[key]);
                    });
                });
            }

            if (locked) {
                interactiveObjects.forEach(obj => {
                    if (!obj || !obj.input) return;
                    if (!this._phoneInputStates.has(obj)) {
                        this._phoneInputStates.set(obj, obj.input.enabled !== false);
                    }
                    obj.input.enabled = false;
                });

                if (this.waitress && this.waitress.body) {
                    this.waitress.body.setVelocity(0, 0);
                    if (typeof this.waitress.body.stop === 'function') {
                        this.waitress.body.stop();
                    }
                }
            } else {
                this._phoneInputStates.forEach((wasEnabled, obj) => {
                    if (obj && obj.input) {
                        obj.input.enabled = wasEnabled;
                    }
                });
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
                p: Phaser.Input.Keyboard.KeyCodes.P,
                one: Phaser.Input.Keyboard.KeyCodes.ONE,
                two: Phaser.Input.Keyboard.KeyCodes.TWO,
                three: Phaser.Input.Keyboard.KeyCodes.THREE,
                four: Phaser.Input.Keyboard.KeyCodes.FOUR,
                five: Phaser.Input.Keyboard.KeyCodes.FIVE,
                six: Phaser.Input.Keyboard.KeyCodes.SIX,
                seven: Phaser.Input.Keyboard.KeyCodes.SEVEN,
                eight: Phaser.Input.Keyboard.KeyCodes.EIGHT,
                nine: Phaser.Input.Keyboard.KeyCodes.NINE,
                zero: Phaser.Input.Keyboard.KeyCodes.ZERO,
                numpad1: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE,
                numpad2: Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO,
                numpad3: Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE,
                numpad4: Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR,
                numpad5: Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE,
                numpad6: Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX,
                numpad7: Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN,
                numpad8: Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT,
                numpad9: Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE,
                numpad0: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO
            });
        }

        handleDayJumpCheat() {
            if (!this.keys.shift.isDown) return false;
            if (!this.keys.d.isDown) return false;

            const dayMap = [
                { keys: ['one', 'numpad1'], day: 1 },
                { keys: ['two', 'numpad2'], day: 2 },
                { keys: ['three', 'numpad3'], day: 3 },
                { keys: ['four', 'numpad4'], day: 4 },
                { keys: ['five', 'numpad5'], day: 5 },
                { keys: ['six', 'numpad6'], day: 6 },
                { keys: ['seven', 'numpad7'], day: 7 },
                { keys: ['eight', 'numpad8'], day: 8 },
                { keys: ['nine', 'numpad9'], day: 9 },
                { keys: ['zero', 'numpad0'], day: 10 }
            ];

            for (const entry of dayMap) {
                for (const keyName of entry.keys) {
                    const key = this.keys[keyName];
                    if (key && Phaser.Input.Keyboard.JustDown(key)) {
                        this.jumpToDay(entry.day);
                        return true;
                    }
                }
            }
            return false;
        }

        jumpToDay(targetDay) {
            if (!targetDay || targetDay < 1) return;

            if (this.spawnEvent) {
                this.spawnEvent.remove();
                this.spawnEvent = null;
            }

            this.cleanupCustomers();

            this.tables.forEach(t => {
                t.occupied = false;
                t.reserved = false;
                t.customer = null;
                t._seatedCustomer = null;
                t._activeOrder = null;
                if (!t.dirty) t.status = 'libero';
            });

            GAME.level = targetDay;
            GAME.customersServed = 0;
            GAME.customersTarget = 6 + (GAME.level * 4);
            GAME.carriedOrder = null;
            GAME.dirtyPlates = 0;

            this.ordersTaken = 0;
            this.maxOrders = 1 + notebookLevel;
            this.updateNotepadUI(false);
            this.updateHUD();

            this.startSpawning();

            this.showFloatingText(400, 300, `🔧 SALTO AL GIORNO ${targetDay}!`, '#ffd700');
            triggerSfx('coin');

            const saveData = {
                score: GAME.score,
                level: GAME.level,
                customersServed: 0,
                lives: 3,
                dirtyPlates: 0,
                isCheater: GAME.isCheater || false,
                settings: GAME.settings,
                housePurchased: window.HOUSE_STATE ? window.HOUSE_STATE.purchased : []
            };
            localStorage.setItem('waitress_save_data', JSON.stringify(saveData));
            if (window.SaveManager && typeof window.SaveManager.saveGame === 'function') {
                window.SaveManager.saveGame(saveData);
            }
        }

        togglePause() {
            this.isPaused = !this.isPaused;

            if (this.isPaused) {
                this.gameActive = false;
                this.physics.pause();
                this.time.paused = true;

                this.pauseBg = this.add.rectangle(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY,
                    800,
                    600,
                    0x000000,
                    0.7
                )
                .setScrollFactor(0)
                .setDepth(3000)
                .setInteractive();

                this.pauseTitle = this.add.text(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY - 80,
                    '⏸️ PAUSA',
                    {
                        fontSize: '48px',
                        color: '#ffd700',
                        fontStyle: 'bold',
                        fontFamily: 'Fredoka'
                    }
                )
                .setScrollFactor(0)
                .setOrigin(0.5)
                .setDepth(3001);

                this.createPauseButton(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY,
                    'RIPRENDI',
                    '#2ecc71',
                    () => { this.togglePause(); }
                );

                this.createPauseButton(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY + 60,
                    'RICOMINCIA LIVELLO',
                    '#e67e22',
                    () => {
                        this.togglePause();
                        this.scene.restart();
                    }
                );

                this.createPauseButton(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY + 120,
                    'TORNA AL MENU',
                    '#e74c3c',
                    () => {
                        this.togglePause();
                        this.scene.start('Menu');
                    }
                );
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
                this.pauseButtonContainer = this.add.container(0, 0)
                    .setScrollFactor(0)
                    .setDepth(3001);
            }
            
            const bg = this.add.rectangle(x, y, 280, 40, 0x000000)
                .setStrokeStyle(2, color);
            
            const txt = this.add.text(x, y, text, {
                fontSize: '16px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
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
        
        spawnCustomer() {
            if (this.isCheater) return;
            if (this.tutorialActive) return;
            
            const activeCustomers = this.customers.filter(c => !c.isDead);
            if (activeCustomers.length >= this.tables.length) return;

            let freeTable = this.tables.find(
                t => !t.occupied && !t.reserved && !t.customer && t.status === 'libero'
            );

            if (!freeTable) {
                freeTable = this.tables.find(
                    t => !t.occupied && !t.reserved && !t.customer && t.dirty === true
                );
            }

            if (!freeTable) return;

            freeTable.reserved = true;
            freeTable.occupied = true;
            freeTable._seatedCustomer = null;
            freeTable._activeOrder = null;
            freeTable.status = 'in_arrivo';

            let customer = null;
            try {
                if (this.npcManager && typeof this.npcManager.spawnCustomer === 'function') {
                    customer = this.npcManager.spawnCustomer();
                }
                if (!customer) {
                    customer = this.generateFallbackCustomer();
                }
            } catch (e) {
                console.warn('Errore spawn cliente:', e);
            }

            if (!customer) {
                freeTable.reserved = false;
                freeTable.occupied = false;
                freeTable.status = 'libero';
                return;
            }

            if (!customer.order && customer.favoriteFoods && customer.favoriteFoods.length > 0) {
                customer.order = customer.favoriteFoods[Phaser.Math.Between(0, customer.favoriteFoods.length - 1)];
            }
            if (!customer.order) {
                const foods = Object.keys(FOOD_TEXTURES);
                customer.order = foods[Phaser.Math.Between(0, foods.length - 1)];
            }

            customer.table = freeTable;
            customer.x = ENTRANCE_X;
            customer.y = ENTRANCE_Y;
            customer.isDead = false;

            freeTable.customer = customer;

            this.createCustomerGraphics(customer);
            this.customers.push(customer);

            this.moveCustomerToTable(customer);
        }

        moveCustomerToTable(customer) {
            if (!customer || !customer.table) return;

            const table = customer.table;
            const startX = ENTRANCE_X;
            const startY = ENTRANCE_Y;

            const SEATS = {
                1: { x: 180, y: 270 },
                2: { x: 400, y: 270 },
                3: { x: 180, y: 470 },
                4: { x: 400, y: 470 }
            };

            const seat = SEATS[table.id] || { x: table.x, y: table.y + 55 };
            let waypoints = [];

            if (table.id === 1) {
                waypoints = [
                    { x: startX, y: startY },
                    { x: 240, y: 540 },
                    { x: 200, y: 540 },
                    { x: 180, y: 520 },
                    { x: 180, y: seat.y }
                ];
            } else if (table.id === 2) {
                waypoints = [
                    { x: startX, y: startY },
                    { x: 240, y: 540 },
                    { x: 350, y: 540 },
                    { x: 400, y: 530 },
                    { x: 400, y: seat.y }
                ];
            } else if (table.id === 3) {
                waypoints = [
                    { x: startX, y: startY },
                    { x: 240, y: 540 },
                    { x: 200, y: 540 },
                    { x: 180, y: 500 },
                    { x: 180, y: seat.y }
                ];
            } else if (table.id === 4) {
                waypoints = [
                    { x: startX, y: startY },
                    { x: 240, y: 540 },
                    { x: 350, y: 540 },
                    { x: 400, y: 530 },
                    { x: 400, y: seat.y }
                ];
            }

            if (waypoints.length === 0) {
                waypoints = [
                    { x: startX, y: startY },
                    { x: 240, y: 540 },
                    { x: seat.x, y: seat.y }
                ];
            }

            if (customer.sprite) {
                customer.sprite.x = startX;
                customer.sprite.y = startY;
            }

            if (customer.emoji) {
                customer.emoji.x = startX;
                customer.emoji.y = startY;
            }

            if (customer.shadow) {
                customer.shadow.x = startX;
                customer.shadow.y = startY + 10;
            }

            if (customer.bubble) {
                customer.bubble.x = startX;
                customer.bubble.y = startY - 30;
                customer.bubble.setVisible(false);
            }

            if (customer.childGraphic) {
                customer.childGraphic.x = startX + 15;
                customer.childGraphic.y = startY + 15;
            }

            customer.x = startX;
            customer.y = startY;

            customer.movementData = {
                waypoints: waypoints,
                currentWaypoint: 1,
                destination: waypoints[1],
                movementComplete: false
            };

            customer.speed = 55;
            customer._lastPos = null;
            customer._arrivalCheckStart = null;
            
            if (customer.movementTimeout) {
                customer.movementTimeout.remove();
            }
            customer.movementTimeout = this.time.delayedCall(8000, () => {
                if (customer.movementData && !customer.movementData.movementComplete && !customer.isDead) {
                    const seat = customer.movementData.waypoints[customer.movementData.waypoints.length - 1];
                    if (customer.sprite) {
                        customer.sprite.x = seat.x;
                        customer.sprite.y = seat.y;
                    }
                    if (customer.emoji) {
                        customer.emoji.x = seat.x;
                        customer.emoji.y = seat.y;
                    }
                    customer.x = seat.x;
                    customer.y = seat.y;
                    customer.movementData.movementComplete = true;
                    this.onCustomerArrived(customer);
                }
            });
        }

        updateCustomerMovement(customer, delta) {
            if (!customer || !customer.movementData || !customer.sprite) {
                return;
            }

            if (!customer.sprite.active) {
                customer.movementData.movementComplete = true;
                return;
            }

            const data = customer.movementData;

            if (data.movementComplete || !data.destination) {
                return;
            }

            if (!customer._lastPos) {
                customer._lastPos = { x: customer.sprite.x, y: customer.sprite.y, t: 0 };
            }
            customer._lastPos.t += delta;
            if (customer._lastPos.t > 1000) {
                const moved = Phaser.Math.Distance.Between(
                    customer._lastPos.x, customer._lastPos.y,
                    customer.sprite.x, customer.sprite.y
                );
                if (moved < 2) {
                    customer.sprite.x = data.destination.x;
                    customer.sprite.y = data.destination.y;
                    customer.x = data.destination.x;
                    customer.y = data.destination.y;
                    data.movementComplete = true;
                    this.onCustomerArrived(customer);
                    return;
                }
                customer._lastPos = { x: customer.sprite.x, y: customer.sprite.y, t: 0 };
            }

            const dx = data.destination.x - customer.sprite.x;
            const dy = data.destination.y - customer.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 500) {
                customer.sprite.x = data.destination.x;
                customer.sprite.y = data.destination.y;
                customer.x = data.destination.x;
                customer.y = data.destination.y;
                data.movementComplete = true;
                if (typeof this.onCustomerArrived === 'function') {
                    this.onCustomerArrived(customer);
                }
                return;
            }

            if (distance <= 4) {
                customer.sprite.x = data.destination.x;
                customer.sprite.y = data.destination.y;
                customer.x = customer.sprite.x;
                customer.y = customer.sprite.y;

                if (data.waypoints && data.currentWaypoint < data.waypoints.length - 1) {
                    data.currentWaypoint++;
                    data.destination = data.waypoints[data.currentWaypoint];
                    return;
                }

                data.movementComplete = true;
                customer.x = data.destination.x;
                customer.y = data.destination.y;

                if (typeof this.onCustomerArrived === 'function') {
                    this.onCustomerArrived(customer);
                }
                return;
            }

            const speed = customer.speed || 55;
            const step = Math.min(distance, speed * (delta / 1000));
            const ratio = step / distance;

            customer.sprite.x += dx * ratio;
            customer.sprite.y += dy * ratio;
            customer.x = customer.sprite.x;
            customer.y = customer.sprite.y;
            customer.sprite.setDepth(customer.y);

            if (customer.hasDirectionalTextures && customer.sprite) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    customer.sprite.setTexture(
                        dx > 0 ? customer.textureRight : customer.textureLeft
                    );
                } else {
                    customer.sprite.setTexture(
                        dy > 0 ? customer.textureDown : customer.textureUp
                    );
                }
                customer.sprite.setDisplaySize(UNIFORM_SIZE, UNIFORM_SIZE);
            }

            if (customer.shadow) {
                customer.shadow.x = customer.sprite.x;
                customer.shadow.y = customer.sprite.y + 10;
            }

            if (customer.bubble) {
                customer.bubble.x = customer.sprite.x;
                customer.bubble.y = customer.sprite.y - 30;
            }

            if (customer.childGraphic) {
                customer.childGraphic.x = customer.sprite.x + 15;
                customer.childGraphic.y = customer.sprite.y + 15;
            }
        }

        onCustomerArrived(customer) {
            if (!customer || !customer.table || customer.isDead) return;

            const table = customer.table;

            if (!customer.movementData || !customer.movementData.movementComplete) {
                return;
            }

            table.reserved = false;
            table.occupied = true;
            table.customer = customer;

            if (table._seatedCustomer && table._seatedCustomer !== customer) {
                this.removeCustomer(customer);
                return;
            }
            table._seatedCustomer = customer;

            const hadDirtyPlate = table.dirty === true && !customer._dirtyPlateCleared;

            table.status = 'ordinazione_pronta';

            if (customer.bubble && customer.bubble.active) {
                customer.bubble.setTexture('bubble_order');
                customer.bubble.setVisible(true);
            }

            customer.patienceBg = this.add.rectangle(
                table.x,
                table.y - 28,
                50,
                4,
                0x333333
            );

            customer.patienceBg.setDepth(table.y - 1);

            customer.patienceBar = this.add.rectangle(
                table.x - 25,
                table.y - 28,
                50,
                4,
                0x2ecc71
            );

            customer.patienceBar.setOrigin(0, 0.5);
            customer.patienceBar.setDepth(table.y);

            if (hadDirtyPlate) {
                customer.patience = 50;
                customer.patienceBar.setScale(0.5, 1);
                customer.patienceBar.setFillStyle(0xf39c12);
            } else {
                customer.patience = 100;
            }
            customer._dirtyPlateCleared = false;

            customer.timerEvent = this.time.addEvent({
                delay: 100,

                callback: () => {
                    if (
                        !this.gameActive ||
                        customer.isDead ||
                        this.tutorialActive
                    ) {
                        return;
                    }

                    if (
                        !customer.table ||
                        customer.table.customer !== customer ||
                        customer.table.status !== 'ordinazione_pronta'
                    ) {
                        return;
                    }

                    const baseDecay =
                        100 / (CONFIG.customers.patienceDuration / 100);

                    const decayAmount =
                        baseDecay * customer.patienceMultiplier;

                    customer.patience -= decayAmount;

                    if (
                        customer.patienceBar &&
                        customer.patienceBar.active
                    ) {
                        const scale = Math.max(
                            0,
                            customer.patience / 100
                        );

                        customer.patienceBar.setScale(scale, 1);

                        if (customer.patience < 40) {
                            customer.patienceBar.setFillStyle(0xf39c12);
                        }

                        if (customer.patience < 20) {
                            customer.patienceBar.setFillStyle(0xe74c3c);
                            
                            if (customer.bubble && customer.bubble.active && 
                                customer.bubble.texture.key === 'bubble_order') {
                                customer.bubble.setTexture('bubble_angry');
                            }
                        }
                    }

                    if (customer.patience <= 0) {
                        this.angryLeave(customer);
                    }
                },

                loop: true,
                paused: false
            });
        }

        generateFallbackCustomer() {
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
                hasDirectionalTextures: npcConfig.hasDirectionalTextures || false,
                textureUp: npcConfig.textureUp || null,
                textureDown: npcConfig.textureDown || null,
                textureLeft: npcConfig.textureLeft || null,
                textureRight: npcConfig.textureRight || null,
                x: 0,
                y: 0,
                bubble: null,
                childGraphic: null,
                patienceBar: null,
                patienceBg: null,
                emoji: null,
                sprite: null,
                timerEvent: null,
                movementTimeout: null,
                _lastPos: null,
                _arrivalCheckStart: null,
                _dirtyPlateCleared: false,
                noTip: npcConfig.noTip || false,
                tipMultiplier: npcConfig.tipMultiplier || 1.0,
                movementData: null,
                speed: 55,
                serve: () => {
                    this.time.delayedCall(CONFIG.customers.eatingDuration, () => {
                        this.finishMeal(this.customers[this.customers.length - 1]);
                    });
                }
            };
        }
        
        createCustomerGraphics(customer) {
            const startX = customer.x;
            const startY = customer.y;
            
            customer.shadow = this.add.ellipse(startX, startY + 10, 20, 5, 0x000000, 0.25);
            customer.shadow.setDepth(startY - 1);
            
            if (customer.hasDirectionalTextures && this.textures.exists(customer.textureDown)) {
                customer.sprite = this.add.image(startX, startY, customer.textureDown);
                customer.sprite.setDisplaySize(UNIFORM_SIZE, UNIFORM_SIZE);
                customer.sprite.setDepth(startY);
                customer.sprite.setInteractive({ useHandCursor: true });
            } else if (customer.hasDirectionalTextures && this.textures.exists(customer.textureUp)) {
                customer.sprite = this.add.image(startX, startY, customer.textureUp);
                customer.sprite.setDisplaySize(UNIFORM_SIZE, UNIFORM_SIZE);
                customer.sprite.setDepth(startY);
                customer.sprite.setInteractive({ useHandCursor: true });
            } else if (customer.hasTilesheet && customer.tilesheetKey && this.textures.exists(customer.tilesheetKey)) {
                customer.sprite = this.add.sprite(startX, startY, customer.tilesheetKey, 0);
                customer.sprite.setDisplaySize(UNIFORM_SIZE, UNIFORM_SIZE);
                customer.sprite.setDepth(startY);
                customer.sprite.setInteractive({ useHandCursor: true });
                
                if (this.anims.exists(`${customer.tilesheetKey}_idle_0`)) {
                    customer.sprite.play(`${customer.tilesheetKey}_idle_0`);
                }
            } else {
                customer.emoji = this.add.text(startX, startY, customer.emojiChar, {
                    fontSize: '24px'
                }).setOrigin(0.5).setDepth(startY).setInteractive({ useHandCursor: true });
            }

            if (customer.bringsChild) {
                customer.childGraphic = this.add.text(startX + 15, startY + 15, '👶', {
                    fontSize: '12px'
                }).setOrigin(0.5).setDepth(startY);
            }

            customer.bubble = this.add.image(startX, startY - 30, 'bubble_order')
                .setDisplaySize(32, 32)
                .setOrigin(0.5)
                .setDepth(startY + 2);

            customer.bubble.setInteractive({ useHandCursor: true });
            customer.bubble.setVisible(false);

            const table = customer.table;
            
            const handleTableClick = () => {
                if (this.isPhoneActive) return;
                
                const dist = Phaser.Math.Distance.Between(this.waitress.x, this.waitress.y, table.x, table.y);
                if (dist <= CONFIG.waitress.interactRange) {
                    this.interactWithTable(table);
                } else {
                    this.showFloatingText(table.x, table.y - 40, "Avvicinati con WASD!", '#ffd700');
                }
            };

            const handleBubbleClick = (pointer, localX, localY, event) => {
                if (event && typeof event.stopPropagation === 'function') {
                    event.stopPropagation();
                } else if (pointer && pointer.event && typeof pointer.event.stopPropagation === 'function') {
                    pointer.event.stopPropagation();
                }

                if (this.isPhoneActive) return;
                if (!customer.bubble || !customer.bubble.active || !customer.bubble.visible) return;

                if (customer.bubble.texture && customer.bubble.texture.key === 'bubble_talk') {
                    if (
                        !customer.movementData ||
                        !customer.movementData.movementComplete ||
                        !customer.table ||
                        customer.table.customer !== customer
                    ) {
                        return;
                    }

                    this.currentCustomer = customer;

                    if (this.aiManager) {
                        this.aiManager.openChat(customer);
                    }
                    return;
                }

                if (customer.table) {
                    const dist = Phaser.Math.Distance.Between(
                        this.waitress.x, this.waitress.y,
                        customer.table.x, customer.table.y
                    );
                    if (dist <= CONFIG.waitress.interactRange) {
                        this.interactWithTable(customer.table);
                    } else {
                        this.showFloatingText(customer.table.x, customer.table.y - 40, "Avvicinati con WASD!", '#ffd700');
                    }
                }
            };

            customer.bubble.on('pointerdown', handleBubbleClick);
            
            if (customer.emoji) {
                customer.emoji.on('pointerdown', handleTableClick);
            }
            if (customer.sprite) {
                customer.sprite.on('pointerdown', handleTableClick);
            }
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
            let basePay = 14;
            if (this.priceSystem) {
                basePay = this.priceSystem.getFoodPrice(customer.order);
            }
            
            const customerConfig = NPC_REGISTRY[customer.name] || {};
            const tipMultiplier = customerConfig.tipMultiplier || customer.tipMultiplier || 1.0;
            const noTip = customerConfig.noTip || customer.noTip || false;
            
            let multiplier = customer.patience > 50 ? 1.3 : (customer.patience < 20 ? 0.8 : 1.0);
            let tip = Math.floor(basePay * multiplier);
            
            if (noTip) {
                tip = 0;
            } else {
                tip = Math.floor(tip * tipMultiplier);
            }
            
            this.levelEarnings += tip;
            GAME.score += tip;
            GAME.customersServed++;
            this.updateHUD();
            
            const playerNickname = localStorage.getItem('waitress_nickname') || 'Cameriera';
            const customerRelation = this.npcManager ? this.npcManager.getRelationship(customer.name) : 50;
            
            if (customerRelation >= 80) {
                this.showFloatingText(
                    customer.table.x,
                    customer.table.y - 60,
                    `"Grazie ${playerNickname}!"`,
                    '#ffd700'
                );
                const bonusTip = Math.floor(tip * 0.2);
                this.levelEarnings += bonusTip;
                GAME.score += bonusTip;
                this.showFloatingText(
                    customer.table.x,
                    customer.table.y - 80,
                    `💖 Bonus sintonia: +${bonusTip}€`,
                    '#ff6b6b'
                );
            }
            
            this.showFloatingText(customer.table.x, customer.table.y - 40, 
                noTip ? `💰 +${tip}€ (niente mancia)` : `+${tip}€ 💵`, '#2ecc71');
            triggerSfx('coin');
            
            if (customer.bubble && customer.bubble.active) {
                customer.bubble.setTexture('bubble_cash');
                customer.bubble.setVisible(true);
            }
            
            customer.table.status = 'piatto_sporco';
            customer.table.dirty = true;
            
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
            
            if (customer.timerEvent) {
                customer.timerEvent.remove();
                customer.timerEvent = null;
            }
            
            this.removeCustomer(customer);
            
            if (GAME.customersServed >= GAME.customersTarget) {
                this.levelComplete();
            }
        }
        
        removeCustomer(customer) {
            if (!customer) return;
            
            customer.isDead = true;
            
            if (customer.movementData) {
                customer.movementData.movementComplete = true;
                customer.movementData = null;
            }
            
            if (customer.timerEvent) {
                customer.timerEvent.remove();
                customer.timerEvent = null;
            }

            if (customer.movementTimeout) {
                customer.movementTimeout.remove();
                customer.movementTimeout = null;
            }
            
            if (customer.table) {
                const tableId = customer.table.id;

                customer.table.occupied = false;
                customer.table.reserved = false;
                customer.table.customer = null;
                customer.table._seatedCustomer = null;
                customer.table._activeOrder = null;

                if (!customer.table.dirty) {
                    customer.table.status = 'libero';
                } else {
                    customer.table.status = 'piatto_sporco';
                }

                if (
                    GAME.carriedOrder &&
                    GAME.carriedOrder.tableId === tableId
                ) {
                    GAME.carriedOrder = null;
                    this.waitressHasOrder = false;
                    this.currentOrder = null;
                    this.updateNotepadUI(true);
                    this.updateHUD();
                }
            }
            
            const toDestroy = [
                'emoji', 'sprite', 'childGraphic', 'bubble',
                'bubbleIcon', 'shadow', 'patienceBar', 'patienceBg'
            ];
            
            toDestroy.forEach(key => {
                if (customer[key]) {
                    try {
                        customer[key].destroy();
                    } catch(e) {}
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
        
        interactWithTable(table) {
            if (this.isPhoneActive) return;
            if (this.isCheater) return;
            
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

            if (
                table.status === 'in_arrivo' &&
                table.customer &&
                !table.customer.isDead
            ) {
                if (table.dirty === true) {
                } else {
                    const customer = table.customer;
                    if (customer.movementData && !customer.movementData.movementComplete) {
                        this.showFloatingText(
                            table.x,
                            table.y - 40,
                            '🚶 Il cliente sta arrivando...',
                            '#f39c12'
                        );
                        triggerSfx('click');
                        return;
                    } else {
                        table.status = 'ordinazione_pronta';
                    }
                }
            }

            if (
                table.status === 'ordinazione_pronta' &&
                table.customer &&
                !table.customer.isDead &&
                table.customer.movementData &&
                table.customer.movementData.movementComplete
            ) {
                if (this.ordersTaken >= this.maxOrders) {
                    this.showFloatingText(this.waitress.x, this.waitress.y - 30, 
                        `📓 Taccuino pieno! Massimo ${this.maxOrders} comande.`, '#ff4444');
                    triggerSfx('alert');
                    return;
                }
                
                if (this.ordersTaken > 0) {
                    if (GAME.carriedOrder && GAME.carriedOrder.tableId !== table.id) {
                        this.showFloatingText(this.waitress.x, this.waitress.y - 30, 
                            `📝 Hai già la comanda di un altro tavolo nel taccuino! Portala al Pass Piatti.`, '#ff4444');
                        triggerSfx('click');
                        return;
                    }
                }
                
                triggerSfx('pickup');
                
                this.ordersTaken++;

                const orderedFood = String(table.customer.order || '').trim();

                GAME.carriedOrder = {
                    tableId: table.id,
                    foodName: orderedFood
                };

                table._activeOrder = {
                    tableId: table.id,
                    foodName: orderedFood
                };

                table.status = 'attesa_cibo';
                
                if (table.customer.bubble && table.customer.bubble.active) {
                    table.customer.bubble.setVisible(false);
                }
                
                this.updateNotepadUI(true);
                this.updateHUD();
                
                this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                    `📝 Ordine preso! (${this.ordersTaken}/${this.maxOrders})`, '#ffd700');
                this.showFloatingText(table.x, table.y - 30, t('MSG_ORDER_REC'), '#ffd700');
                return;
            }
            
            if (table.status === 'attesa_cibo' && table.customer) {

                const activeOrder =
                    table._activeOrder &&
                    table._activeOrder.tableId === table.id
                        ? table._activeOrder
                        : null;

                if (!activeOrder || !activeOrder.foodName) {
                    const fallbackFood = String(table.customer.order || '').trim();

                    if (!fallbackFood) {
                        this.showFloatingText(
                            table.x,
                            table.y - 40,
                            '❌ Ordine non valido',
                            '#ff4444'
                        );
                        return;
                    }

                    table._activeOrder = {
                        tableId: table.id,
                        foodName: fallbackFood
                    };

                    return;
                }

                const expectedFood = String(
                    activeOrder.foodName
                ).trim().toLowerCase();

                const foodIndex = this.waitressState.tray.findIndex(item => {
                    if (!item || !item.food) return false;

                    return String(item.food)
                        .trim()
                        .toLowerCase() === expectedFood;
                });
                
                if (foodIndex > -1) {
                    triggerSfx('serve');

                    this.waitressState.tray.splice(foodIndex, 1);

                    const servedTableId = table.id;

                    if (
                        GAME.carriedOrder &&
                        GAME.carriedOrder.tableId === servedTableId
                    ) {
                        GAME.carriedOrder = null;
                        this.waitressHasOrder = false;
                        this.currentOrder = null;
                        this.ordersTaken = 0;
                    }

                    table._activeOrder = null;

                    this.ensureTrayIndicator();
                    this.updateTrayGraphics();
                    this.updateHUD();
                    this.updateNotepadUI(true);
                    
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

                    const servedCustomer = table.customer;
                    if (servedCustomer.bubble && servedCustomer.bubble.active) {
                        servedCustomer.bubble.setTexture('bubble_happy');
                        servedCustomer.bubble.setVisible(true);
                        servedCustomer.bubble.setInteractive({ useHandCursor: true });
                        
                        this.time.delayedCall(2000, () => {
                            if (servedCustomer.bubble && servedCustomer.bubble.active && 
                                !servedCustomer.isDead && servedCustomer.table && 
                                servedCustomer.table.status === 'mangia') {
                                servedCustomer.bubble.setTexture('bubble_talk');
                                servedCustomer.bubble.setVisible(true);
                                servedCustomer.bubble.setInteractive({ useHandCursor: true });
                            }
                        });
                    }

                    this.showFloatingText(table.x, table.y - 40, t('MSG_SERVED'), '#2ecc71');
                } else {
                    this.showFloatingText(table.x, table.y - 40, `⏳ Vuole: ${activeOrder.foodName}`, '#f39c12');
                }
                return;
            }
            
            if (table.dirty === true) {
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
                
                table.dirty = false;
                
                if (table.customer && table.customer.patience !== undefined) {
                    table.customer.patience = 100;
                    table.customer._dirtyPlateCleared = true;
                }
                
                if (!table.customer || table.customer.isDead) {
                    table.status = 'libero';
                }
                
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
        
        handleCounterInteraction() {
            if (GAME.carriedOrder) {

                const order = GAME.carriedOrder;

                const foodName = String(order.foodName || '').trim();
                const tableId = order.tableId;

                if (!foodName || tableId === undefined || tableId === null) {
                    GAME.carriedOrder = null;
                    this.waitressHasOrder = false;
                    this.currentOrder = null;
                    this.ordersTaken = 0;

                    this.updateNotepadUI(true);
                    this.updateHUD();

                    return;
                }

                const normalizedFood = foodName
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
                    this.showFloatingText(
                        this.waitress.x,
                        this.waitress.y - 40,
                        `❌ Nessuna stazione per ${foodName}!`,
                        '#ff0000'
                    );
                    return;
                }

                if (!this.kitchen || typeof this.kitchen.addOrder !== 'function') {
                    this.showFloatingText(
                        this.waitress.x,
                        this.waitress.y - 40,
                        '❌ Cucina non disponibile!',
                        '#ff0000'
                    );
                    return;
                }

                const table = this.tables.find(t => t.id === tableId);

                if (!table || !table.customer || table.customer.isDead) {
                    GAME.carriedOrder = null;
                    this.waitressHasOrder = false;
                    this.currentOrder = null;
                    this.ordersTaken = 0;

                    this.updateNotepadUI(true);
                    this.updateHUD();

                    return;
                }

                table._activeOrder = {
                    tableId: tableId,
                    foodName: foodName
                };

                const added = this.kitchen.addOrder(
                    stationKey,
                    foodName,
                    tableId
                );

                if (added) {
                    this.showFloatingText(
                        this.waitress.x,
                        this.waitress.y - 40,
                        `📝 ${t('ORDER_SENT')}`,
                        '#00ff00'
                    );

                    triggerSfx('cook');

                    GAME.carriedOrder = null;
                    this.waitressHasOrder = false;
                    this.currentOrder = null;

                    this.ordersTaken = 0;

                    this.updateNotepadUI(true);
                    this.updateHUD();

                    return;
                }

                this.showFloatingText(
                    this.waitress.x,
                    this.waitress.y - 40,
                    '⚠️ Il cuoco non può prendere l\'ordine!',
                    '#ffaa00'
                );

                triggerSfx('alert');

                const failedTable = this.tables.find(
                    t => t.id === tableId
                );

                if (failedTable && failedTable.customer && !failedTable.customer.isDead) {
                    failedTable.status = 'ordinazione_pronta';

                    if (
                        failedTable.customer.bubble &&
                        failedTable.customer.bubble.active
                    ) {
                        failedTable.customer.bubble.setVisible(true);
                    }
                }

                GAME.carriedOrder = null;
                this.waitressHasOrder = false;
                this.currentOrder = null;

                this.ordersTaken = 0;

                this.updateNotepadUI(true);
                this.updateHUD();

                return;
            }

            if (!this.kitchen) {
                this.showFloatingText(this.waitress.x, this.waitress.y - 40, 
                    '❌ Cucina non disponibile!', '#ff4444');
                return;
            }

            if (this.kitchen.counterSlots) {
                const occupiedSlots = this.kitchen.counterSlots.filter(slot => slot.occupied);
                
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
        
        interactWithClosest() {
            if (!this.gameActive || this.isPaused || this.isPhoneActive) return;
            if (this.isCheater) return;

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
        
        washDishes() {
            if (this.isPhoneActive) return;
            if (this.isCheater) return;
            
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
        
        update(time, delta) {
            if (this.isCheater && this.policeNPC) {
                this.updatePoliceMovement(delta);
            }

            if (this.isCheater && this.gameActive && !this.arrestTriggered) {
                return;
            }
            
            if (!this.gameActive && !this.isPaused) return;
            if (this.isPaused) return;

            if (this.crime && this.crime.hasClanSheet) {
                if (GAME.level > this.crime.clanSheetExpiry) {
                    this.crime.hasClanSheet = false;
                    this.crime.inventory = this.crime.inventory.filter(i => i !== 'clan_sheet');
                    this.crime.saveCrimeData();
                    this.showFloatingText(400, 250, '📄 Il foglio del clan è scaduto.', '#ff4444');
                }
            }

            this.checkPoliceInspection();

            if (this.isPhoneActive) {
                if (this.waitress && this.waitress.body) {
                    this.waitress.body.setVelocity(0, 0);
                    if (typeof this.waitress.body.stop === 'function') {
                        this.waitress.body.stop();
                    }
                }
                
                this.waitress.x = Phaser.Math.Clamp(this.waitress.x, 40, 560);
                this.waitress.y = Phaser.Math.Clamp(this.waitress.y, 70, 560);
                
                return;
            }

            this.customers = this.customers.filter(c => {
                if (c.isDead) {
                    if (c.table) {
                        c.table.occupied = false;
                        c.table.reserved = false;
                        c.table.customer = null;
                    }
                    return false;
                }
                return true;
            });

            if (!this.tutorialActive) {
                if (this.kitchen && typeof this.kitchen.update === 'function') this.kitchen.update();
                if (this.bathroom && typeof this.bathroom.update === 'function') this.bathroom.update(time, delta);
                if (this.phone && typeof this.phone.update === 'function') this.phone.update(time, delta);
            }

            if (this.customers) {
                this.customers.forEach(customer => {
                    if (customer.movementData && !customer.movementData.movementComplete) {
                        this.updateCustomerMovement(customer, delta);
                    }
                });
            }

            this.customers.forEach(customer => {
                if (customer.isDead) return;
                
                if (customer.bubble && customer.bubble.active && customer.sprite) {
                    customer.bubble.x = customer.sprite.x;
                    customer.bubble.y = customer.sprite.y - 30;
                }
                if (customer.emoji && customer.bubble && customer.bubble.active) {
                    customer.bubble.x = customer.emoji.x;
                    customer.bubble.y = customer.emoji.y - 30;
                }
                if (customer.childGraphic && customer.sprite) {
                    customer.childGraphic.x = customer.sprite.x + 15;
                    customer.childGraphic.y = customer.sprite.y + 15;
                }
                if (customer.shadow && customer.sprite) {
                    customer.shadow.x = customer.sprite.x;
                    customer.shadow.y = customer.sprite.y + 10;
                }
            });

            this.customers.forEach(customer => {
                if (customer.isDead) return;
                if (!customer.table) return;
                if (customer.table.status !== 'in_arrivo') return;
                
                if (!customer._arrivalCheckStart) {
                    customer._arrivalCheckStart = time;
                }
                if (time - customer._arrivalCheckStart > 10000) {
                    if (customer.movementData && !customer.movementData.movementComplete) {
                        const seat = customer.movementData.waypoints[customer.movementData.waypoints.length - 1];
                        if (customer.sprite) {
                            customer.sprite.x = seat.x;
                            customer.sprite.y = seat.y;
                        }
                        if (customer.emoji) {
                            customer.emoji.x = seat.x;
                            customer.emoji.y = seat.y;
                        }
                        customer.x = seat.x;
                        customer.y = seat.y;
                        customer.movementData.movementComplete = true;
                        this.onCustomerArrived(customer);
                    }
                    customer._arrivalCheckStart = null;
                }
            });

            if (this.supplier && this.supplier.packageSprite && this.supplier.packageSprite.active) {
                this.supplier.packageSprite.setDisplaySize(55, 55);
                
                if (!this.supplier.packageGlow) {
                    this.supplier.packageGlow = this.add.circle(
                        this.supplier.packageSprite.x,
                        this.supplier.packageSprite.y,
                        35, 0xffd700, 0.15
                    ).setDepth(4);
                }
                if (this.supplier.packageGlow) {
                    this.supplier.packageGlow.x = this.supplier.packageSprite.x;
                    this.supplier.packageGlow.y = this.supplier.packageSprite.y;
                }
            }
            
            if (this.supplier && this.supplier.packageSpawned && this.supplier.packageSprite) {
                if (this.supplier.packageGlow) {
                    this.supplier.packageGlow.x = this.supplier.packageSprite.x;
                    this.supplier.packageGlow.y = this.supplier.packageSprite.y;
                }
                
                if (!this.packageClickZone && this.supplier.packageSprite.active) {
                    const pkg = this.supplier.packageSprite;
                    this.packageClickZone = this.add.zone(pkg.x, pkg.y, 60, 60)
                        .setRectangleDropZone(60, 60)
                        .setInteractive({ useHandCursor: true })
                        .setDepth(pkg.depth + 1);
                    
                    this.packageTooltip = this.add.text(pkg.x, pkg.y - 45, '📦 CLICCA PER RITIRARE!', {
                        fontSize: '11px',
                        color: '#ffd700',
                        fontStyle: 'bold',
                        fontFamily: 'Fredoka',
                        backgroundColor: '#000000aa',
                        padding: { x: 6, y: 3 }
                    }).setOrigin(0.5).setDepth(pkg.depth + 2);
                    
                    this.packageClickZone.on('pointerdown', () => {
                        if (this.isPhoneActive || this.isPaused) return;
                        
                        const dist = Phaser.Math.Distance.Between(
                            this.waitress.x, this.waitress.y,
                            this.supplier.packageSprite.x, this.supplier.packageSprite.y
                        );
                        
                        if (dist <= 80) {
                            this.supplier.pickUpPackage();
                            this.showFloatingText(
                                this.supplier.packageSprite.x,
                                this.supplier.packageSprite.y - 30,
                                '📦 PACCO RITIRATO!',
                                '#2ecc71'
                            );
                            triggerSfx('coin');
                            
                            if (this.packageClickZone) {
                                this.packageClickZone.destroy();
                                this.packageClickZone = null;
                            }
                            if (this.packageTooltip) {
                                this.packageTooltip.destroy();
                                this.packageTooltip = null;
                            }
                            if (this.supplier.packageGlow) {
                                this.supplier.packageGlow.destroy();
                                this.supplier.packageGlow = null;
                            }
                        } else {
                            this.showFloatingText(
                                this.waitress.x,
                                this.waitress.y - 30,
                                '📦 Avvicinati al pacco!',
                                '#ffd700'
                            );
                        }
                    });
                }
                
                if (this.packageClickZone && this.supplier.packageSprite.active) {
                    this.packageClickZone.x = this.supplier.packageSprite.x;
                    this.packageClickZone.y = this.supplier.packageSprite.y;
                    if (this.packageTooltip) {
                        this.packageTooltip.x = this.supplier.packageSprite.x;
                        this.packageTooltip.y = this.supplier.packageSprite.y - 45;
                    }
                }
            } else if (this.packageClickZone) {
                this.packageClickZone.destroy();
                this.packageClickZone = null;
                if (this.packageTooltip) {
                    this.packageTooltip.destroy();
                    this.packageTooltip = null;
                }
                if (this.supplier && this.supplier.packageGlow) {
                    this.supplier.packageGlow.destroy();
                    this.supplier.packageGlow = null;
                }
            }

            if (!this.supplier || !this.supplier.packageSpawned) {
                if (this.packageClickZone) {
                    this.packageClickZone.destroy();
                    this.packageClickZone = null;
                }
                if (this.packageTooltip) {
                    this.packageTooltip.destroy();
                    this.packageTooltip = null;
                }
                if (this.supplier && this.supplier.packageGlow) {
                    this.supplier.packageGlow.destroy();
                    this.supplier.packageGlow = null;
                }
            }

            if (this.quest && typeof this.quest.update === 'function') {
                this.quest.update();
            }

            if (this.crime && typeof this.crime.update === 'function') {
                this.crime.update(time, delta);
            }

            if (this.radio && typeof this.radio.update === 'function') {
                this.radio.update();
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

                    if (elena.bubble) {
                        elena.bubble.setTexture('bubble_mission');
                        elena.bubble.setVisible(true);
                        elena.bubble.setTint(0xffd700);
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

            if (!this.isPhoneActive && this.handleDayJumpCheat()) {
                return;
            }

            if (!this.isPhoneActive && Phaser.Input.Keyboard.JustDown(this.keys.h)) {
                this.goToHouse();
                return;
            }

            if (!this.isPhoneActive && (
                Phaser.Input.Keyboard.JustDown(this.keys.esc) ||
                Phaser.Input.Keyboard.JustDown(this.keys.p)
            )) {
                this.togglePause();
                return;
            }

            let moveX = 0;
            let moveY = 0;

            if (!this.isPhoneActive) {
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
            }

            if (moveX !== 0 && moveY !== 0) {
                moveX *= 0.7071;
                moveY *= 0.7071;
            }

            if (this.waitress.body) {
                if (this.isPhoneActive) {
                    this.waitress.body.setVelocity(0, 0);
                    if (typeof this.waitress.body.stop === 'function') {
                        this.waitress.body.stop();
                    }
                } else {
                    if (moveX !== 0 || moveY !== 0) {
                        this.waitress.body.setVelocity(
                            moveX * CONFIG.waitress.speed,
                            moveY * CONFIG.waitress.speed
                        );
                    } else {
                        this.waitress.body.setVelocity(0, 0);
                    }
                }
            }

            if (!this.isPhoneActive && this.waitress && typeof this.waitress.setTexture === 'function') {
                if (moveX > 0) {
                    this.waitress.setTexture('cameriera_destra');
                    this.waitress.setScale(WAITRESS_SCALE);
                } else if (moveX < 0) {
                    this.waitress.setTexture('cameriera_sinistra');
                    this.waitress.setScale(WAITRESS_SCALE);
                } else if (moveY < 0) {
                    this.waitress.setTexture('cameriera_dietro');
                    this.waitress.setScale(WAITRESS_SCALE);
                } else if (moveY > 0) {
                    this.waitress.setTexture('cameriera_avanti');
                    this.waitress.setScale(WAITRESS_SCALE);
                } else {
                    this.waitress.setTexture('cameriera_avanti');
                    this.waitress.setScale(WAITRESS_SCALE);
                }
            }

            if (this.waitress.body) {
                this.waitress.x = Phaser.Math.Clamp(this.waitress.x, 40, 560);
                this.waitress.y = Phaser.Math.Clamp(this.waitress.y, 70, 560);
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

            if (!this.isPhoneActive && Phaser.Input.Keyboard.JustDown(this.keys.space)) {
                this.interactWithClosest();
            }
        }
        
        updateRelationship(delta, feedback) {
            if (!this.currentCustomer) return;
            
            if (this.npcManager && typeof this.npcManager.updateRelationshipFromMessage === 'function') {
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
                
                if (result.specialEvent === 'BREAKUP') {
                    this.gameOver();
                } else if (result.specialEvent === 'ADOPTION_READY') {
                    if (this.quest && typeof this.quest.startElenaAdoptionQuest === 'function') {
                        this.quest.startElenaAdoptionQuest();
                    }
                }
            } else {
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
                            this.quest.startElenaAdoptionQuest();
                        }
                    }
                }
            }
        }

        levelComplete() {
            this.gameActive = false;
            
            if (this.spawnEvent) {
                this.spawnEvent.remove();
                this.spawnEvent = null;
            }
            
            this.cleanupCustomers();
            
            this.showFloatingText(400, 300, t('DAY_COMPLETE'), '#ffd700');
            triggerSfx('coin');
            
            if (this.priceSystem) {
                this.priceSystem.updateInflation(GAME.level);
            }
            
            if (GAME.score >= 15000) {
                this.showFloatingText(400, 250, '🏆 HAI RAGGIUNTO 15.000€! LOCALE TUO!', '#ffd700');
                triggerSfx('coin');
            }
            
            if (this.story) {
                this.story.onDayComplete(GAME.level);
            }

            const rent = 50;
            const net = Math.max(0, this.levelEarnings - rent);
            GAME.score = net;

            const saveData = {
                score: GAME.score,
                level: GAME.level + 1,
                customersServed: 0,
                lives: 3,
                dirtyPlates: 0,
                isCheater: GAME.isCheater || false,
                settings: GAME.settings,
                housePurchased: window.HOUSE_STATE ? window.HOUSE_STATE.purchased : []
            };
            
            localStorage.setItem('waitress_save_data', JSON.stringify(saveData));
            
            if (window.SaveManager && typeof window.SaveManager.saveGame === 'function') {
                window.SaveManager.saveGame(saveData);
            }
            
            this.time.delayedCall(1200, () => {
                if (window.LevelSummaryScene && !this.scene.get('LevelSummary')) {
                    this.scene.add('LevelSummary', window.LevelSummaryScene, false);
                }
                
                if (this.scene.get('LevelSummary')) {
                    this.scene.start('LevelSummary', {
                        score: GAME.score,
                        earned: this.levelEarnings,
                        rent: rent,
                        net: net,
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
            this.menuButtons = [];
        }
        
        create() {
            this.cameras.main.setBackgroundColor('#1a0a04');
            this.menuButtons = [];

            const unlockAudio = () => {
                try {
                    if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
                        this.sound.context.resume();
                    }
                    unlockAudioContext();
                    SYNTH.unlock();
                } catch (e) {}
            };
            this.input.on('pointerdown', unlockAudio);
            this.input.on('keydown', unlockAudio);
            this.events.once('shutdown', () => {
                this.input.off('pointerdown', unlockAudio);
                this.input.off('keydown', unlockAudio);
            });
            
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

    class GameOverScene extends Phaser.Scene {
        constructor() {
            super('GameOver');
        }

        create() {
            this.cameras.main.setBackgroundColor('#1a0202');

            const card = this.add.rectangle(
                400, 300,
                520, 450,
                0x110202,
                0.95
            );
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

            const statsBox = this.add.rectangle(
                400, 275,
                420, 100,
                0x221111
            );
            statsBox.setStrokeStyle(1, 0x442222);

            this.add.text(
                230, 245,
                t('SAVINGS_LEFT'),
                {
                    fontSize: '13px',
                    color: '#ffd700',
                    fontFamily: 'Fredoka'
                }
            );

            this.add.text(
                530, 245,
                `${GAME.score} €`,
                {
                    fontSize: '13px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(1, 0);

            this.add.text(
                230, 275,
                t('DAYS_WORKED'),
                {
                    fontSize: '13px',
                    color: '#ffd700',
                    fontFamily: 'Fredoka'
                }
            );

            this.add.text(
                530, 275,
                `${GAME.level}`,
                {
                    fontSize: '13px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(1, 0);

            this.add.text(
                230, 305,
                t('FURNITURE_BOUGHT'),
                {
                    fontSize: '13px',
                    color: '#ffd700',
                    fontFamily: 'Fredoka'
                }
            );

            let purchasedCount = 0;

            const savedHouseData =
                localStorage.getItem('waitress_house_data');

            if (savedHouseData) {
                try {
                    const parsed = JSON.parse(savedHouseData);
                    purchasedCount = (parsed.purchased || []).length;
                } catch(e) {}
            }

            this.add.text(
                530, 305,
                `${purchasedCount} / ${HOUSE_STATE.items.length}`,
                {
                    fontSize: '13px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(1, 0);

            const houseBtn = this.add.rectangle(
                400, 380,
                300, 44,
                0x3498db
            );

            houseBtn.setStrokeStyle(1.5, 0xffffff);
            houseBtn.setInteractive({ useHandCursor: true });

            this.add.text(
                400, 380,
                t('VAI A CASA'),
                {
                    fontSize: '14px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            houseBtn.on('pointerdown', () => {
                triggerSfx('click');

                if (window.HouseScene && !this.scene.get('House')) {
                    this.scene.add('House', window.HouseScene, true);
                } else {
                    this.scene.start('House');
                }
            });

            houseBtn.on('pointerover', () => {
                houseBtn.setFillStyle(0x2980b9);
            });

            houseBtn.on('pointerout', () => {
                houseBtn.setFillStyle(0x3498db);
            });

            const settingsBtn = this.add.rectangle(
                400, 440,
                300, 44,
                0xd27d2d
            );

            settingsBtn.setStrokeStyle(1.5, 0xffd700);
            settingsBtn.setInteractive({ useHandCursor: true });

            this.add.text(
                400, 440,
                t('IMPOSTAZIONI'),
                {
                    fontSize: '14px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            settingsBtn.on('pointerdown', () => {
                triggerSfx('click');
                this.scene.start('Settings');
            });

            settingsBtn.on('pointerover', () => {
                settingsBtn.setFillStyle(0xe59866);
            });

            settingsBtn.on('pointerout', () => {
                settingsBtn.setFillStyle(0xd27d2d);
            });

            const backBtn = this.add.rectangle(
                400, 500,
                260, 36,
                0x7f1d1d
            );

            backBtn.setStrokeStyle(2, 0xe74c3c);
            backBtn.setInteractive({ useHandCursor: true });

            this.add.text(
                400, 500,
                t('TORNA'),
                {
                    fontSize: '14px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            backBtn.on('pointerdown', () => {
                triggerSfx('click');
                this.scene.start('Menu');
            });
        }
    }

    class SettingsScene extends Phaser.Scene {
        constructor() {
            super('Settings');
        }

        create() {
            this.cameras.main.setBackgroundColor('#1a0a04');

            const card = this.add.rectangle(
                400, 300,
                560, 500,
                0x110906,
                0.97
            );

            card.setStrokeStyle(2, 0xd27d2d);

            this.add.text(400, 55, '⚙️ IMPOSTAZIONI', {
                fontSize: '30px',
                color: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            this.add.text(400, 115, '🔊 SUONO', {
                fontSize: '16px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const soundBtn = this.add.rectangle(
                400,
                150,
                260,
                38,
                GAME.settings.soundEnabled
                    ? 0x27ae60
                    : 0xe74c3c
            );

            soundBtn.setStrokeStyle(1, 0xffffff);
            soundBtn.setInteractive({ useHandCursor: true });

            const soundTxt = this.add.text(
                400,
                150,
                GAME.settings.soundEnabled
                    ? '🔊 SUONO: ON'
                    : '🔇 SUONO: OFF',
                {
                    fontSize: '13px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            soundBtn.on('pointerdown', () => {
                GAME.settings.soundEnabled =
                    !GAME.settings.soundEnabled;

                soundBtn.setFillStyle(
                    GAME.settings.soundEnabled
                        ? 0x27ae60
                        : 0xe74c3c
                );

                soundTxt.setText(
                    GAME.settings.soundEnabled
                        ? '🔊 SUONO: ON'
                        : '🔇 SUONO: OFF'
                );

                this.saveSettings();

                if (GAME.settings.soundEnabled) {
                    triggerSfx('click');
                }
            });

            this.add.text(400, 205, '🎮 DIFFICOLTÀ', {
                fontSize: '16px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const difficulties = [
                {
                    key: 'facile',
                    label: 'FACILE'
                },
                {
                    key: 'normale',
                    label: 'MEDIA'
                },
                {
                    key: 'difficile',
                    label: 'DIFFICILE'
                }
            ];

            const difficultyButtons = [];

            difficulties.forEach((difficulty, index) => {
                const x = 250 + index * 150;
                const selected =
                    GAME.settings.difficulty === difficulty.key;

                const btn = this.add.rectangle(
                    x,
                    250,
                    125,
                    38,
                    selected
                        ? 0x27ae60
                        : 0xd27d2d
                );

                btn.setStrokeStyle(
                    selected ? 2 : 1,
                    selected ? 0xffffff : 0xffd700
                );

                btn.setInteractive({
                    useHandCursor: true
                });

                const txt = this.add.text(
                    x,
                    250,
                    difficulty.label,
                    {
                        fontSize: '12px',
                        color: '#ffffff',
                        fontStyle: 'bold',
                        fontFamily: 'Fredoka'
                    }
                ).setOrigin(0.5);

                difficultyButtons.push({
                    btn: btn,
                    txt: txt,
                    key: difficulty.key
                });

                btn.on('pointerdown', () => {
                    GAME.settings.difficulty =
                        difficulty.key;

                    triggerSfx('click');

                    difficultyButtons.forEach(item => {
                        const active =
                            item.key === GAME.settings.difficulty;

                        item.btn.setFillStyle(
                            active
                                ? 0x27ae60
                                : 0xd27d2d
                        );

                        item.btn.setStrokeStyle(
                            active ? 2 : 1,
                            active
                                ? 0xffffff
                                : 0xffd700
                        );
                    });

                    this.saveSettings();
                });
            });

            this.difficultyDescription =
                this.add.text(
                    400,
                    290,
                    this.getDifficultyDescription(),
                    {
                        fontSize: '11px',
                        color: '#e0d5c1',
                        fontFamily: 'Fredoka',
                        align: 'center'
                    }
                ).setOrigin(0.5);

            this.add.text(400, 335, '🌐 LINGUA / LANGUAGE', {
                fontSize: '16px',
                color: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            const langs = getLanguages();
            const langKeys = Object.keys(langs);

            let langIndex =
                langKeys.indexOf(getCurrentLang());

            if (langIndex === -1) {
                langIndex = 0;
            }

            const langBox = this.add.rectangle(
                400,
                375,
                210,
                36,
                0x2c1a11
            );

            langBox.setStrokeStyle(
                1,
                0xd27d2d
            );

            const langTxt = this.add.text(
                400,
                375,
                this.getLanguageText(
                    langs,
                    langKeys,
                    langIndex
                ),
                {
                    fontSize: '13px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            const prevBtn = this.add.rectangle(
                270,
                375,
                40,
                36,
                0xd27d2d
            );

            prevBtn.setStrokeStyle(
                1,
                0xffd700
            );

            prevBtn.setInteractive({
                useHandCursor: true
            });

            this.add.text(
                270,
                375,
                '◀',
                {
                    fontSize: '16px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            const nextBtn = this.add.rectangle(
                530,
                375,
                40,
                36,
                0xd27d2d
            );

            nextBtn.setStrokeStyle(
                1,
                0xffd700
            );

            nextBtn.setInteractive({
                useHandCursor: true
            });

            this.add.text(
                530,
                375,
                '▶',
                {
                    fontSize: '16px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            prevBtn.on('pointerdown', () => {
                langIndex =
                    (langIndex - 1 + langKeys.length)
                    % langKeys.length;

                triggerSfx('click');

                switchLanguage(
                    langKeys[langIndex]
                );
            });

            nextBtn.on('pointerdown', () => {
                langIndex =
                    (langIndex + 1)
                    % langKeys.length;

                triggerSfx('click');

                switchLanguage(
                    langKeys[langIndex]
                );
            });

            this.add.text(
                400,
                425,
                '🧠 INTELLIGENZA ARTIFICIALE',
                {
                    fontSize: '15px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            const aiBtn = this.add.rectangle(
                400,
                460,
                260,
                38,
                GAME.settings.aiEnabled
                    ? 0x27ae60
                    : 0xe74c3c
            );

            aiBtn.setStrokeStyle(
                1,
                0xffffff
            );

            aiBtn.setInteractive({
                useHandCursor: true
            });

            const aiTxt = this.add.text(
                400,
                460,
                GAME.settings.aiEnabled
                    ? '🧠 IA: ON'
                    : '🧠 IA: OFF',
                {
                    fontSize: '13px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            aiBtn.on('pointerdown', () => {
                GAME.settings.aiEnabled =
                    !GAME.settings.aiEnabled;

                triggerSfx('click');

                aiBtn.setFillStyle(
                    GAME.settings.aiEnabled
                        ? 0x27ae60
                        : 0xe74c3c
                );

                aiTxt.setText(
                    GAME.settings.aiEnabled
                        ? '🧠 IA: ON'
                        : '🧠 IA: OFF'
                );

                this.saveSettings();
            });

            const backBtn = this.add.rectangle(
                400,
                525,
                260,
                38,
                0xd27d2d
            );

            backBtn.setStrokeStyle(
                2,
                0xffd700
            );

            backBtn.setInteractive({
                useHandCursor: true
            });

            this.add.text(
                400,
                525,
                '↩ TORNA AL MENU',
                {
                    fontSize: '13px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5);

            backBtn.on('pointerdown', () => {
                triggerSfx('click');
                this.scene.start('Menu');
            });
        }

        saveSettings() {
            try {
                const raw =
                    localStorage.getItem(
                        'waitress_save_data'
                    );

                let data = raw
                    ? JSON.parse(raw)
                    : {};

                data.settings = {
                    ...GAME.settings
                };

                localStorage.setItem(
                    'waitress_save_data',
                    JSON.stringify(data)
                );

            } catch (e) {
                console.warn(
                    'Errore salvataggio impostazioni',
                    e
                );
            }
        }

        getDifficultyDescription() {
            switch (GAME.settings.difficulty) {
                case 'facile':
                    return 'I clienti arrivano più lentamente';
                case 'difficile':
                    return 'I clienti arrivano più velocemente';
                default:
                    return 'Velocità normale dei clienti';
            }
        }

        getLanguageText(
            langs,
            langKeys,
            langIndex
        ) {
            const code =
                langKeys[langIndex];

            const data =
                langs[code];

            return `${data.flag} ${data.name}`;
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
        },
        audio: {
            disableWebAudio: false,
            noAudio: false
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

        const globalUnlock = () => {
            try {
                if (game && game.sound && game.sound.context && game.sound.context.state === 'suspended') {
                    game.sound.context.resume();
                }
                unlockAudioContext();
                SYNTH.unlock();
            } catch (e) {}
        };

        window.addEventListener('pointerdown', globalUnlock, { once: true });
        window.addEventListener('touchstart', globalUnlock, { once: true, passive: true });
        window.addEventListener('touchend', globalUnlock, { once: true, passive: true });
        window.addEventListener('mousedown', globalUnlock, { once: true });
        window.addEventListener('click', globalUnlock, { once: true });
        window.addEventListener('keydown', globalUnlock, { once: true });
    });
})();