const NPC_CONFIG = {
    'Poliziotto': {
        hasTilesheet: false,
        emojiChar: '👮',
        age: 40,
        gender: 'male',
        bio: 'Agente di Polizia in servizio.',
        patienceMultiplier: 99.0,
        tipMultiplier: 0,
        orderPreference: ['Acqua'],
        personality: 'Sei un agente di Polizia formale, rigido e diretto. Esegui un mandato.',
        sensitiveTopics: ['arresto', 'mandato', 'legge'],
        dialogueStyles: {
            greeting: 'Buongiorno. Sono l\'Agente di Polizia. Ho un mandato per lei.',
            order: 'Non sono qui per mangiare.',
            happy: 'La procedura è conclusa.',
            angry: 'Non peggiori la sua posizione.',
            farewell: 'La seguirò in centrale.'
        },
        textureUp: 'Poliziotto_Dietro.png',
        textureDown: 'Poliziotto_Avanti.png',
        textureLeft: 'Poliziotto_Sinistra.png',
        textureRight: 'Poliziotto_Destra.png'
    },
        "Uomo d'Affari": {
        hasTilesheet: false,
        emojiChar: '🕴️',
        age: 45,
        gender: 'male',
        bio: 'Uomo d\'affari losco, rappresentante della Moroni. In realtà è un criminale che usa il birrificio come copertura.',
        patienceMultiplier: 99.0,
        tipMultiplier: 0,
        noTip: true,
        orderPreference: ['Moroni'],
        personality: 'Sei un uomo d\'affari losco e intimidatorio. Rappresenti la Moroni, ma in realtà sei un criminale. Parli in modo formale ma minaccioso, con doppi sensi. Non accetti un no.',
        sensitiveTopics: ['sponsor', 'birra', 'affari', 'polizia', 'denaro'],
        dialogueStyles: {
            greeting: 'Buongiorno. Sono qui per conto della Moroni. Non è una richiesta, è un\'offerta che non può rifiutare.',
            order: 'Le ho lasciato delle casse sul davanzale. Le venda. Tutte. Non deluda la Moroni.',
            happy: 'Bene. La Moroni ricorderà la sua collaborazione.',
            angry: 'La Moroni non apprezza i ritardi. Sa cosa succede a chi non collabora.',
            farewell: 'A presto. La Moroni tiene d\'occhio i suoi investimenti.'
        },
        textureUp: "Uomod'Affari_Dietro.png",
        textureDown: "Uomod'Affari_Avanti.png",
        textureLeft: "Uomod'Affari_Sinistra.png",
        textureRight: "Uomod'Affari_Destra.png"
    },
    'Elena': {
        hasTilesheet: false,
        emojiChar: '👩‍🎓',
        age: 20,
        gender: 'female',
        bio: 'Studentessa universitaria sui 20 anni.',
        adoptTrigger: true,
        patienceMultiplier: 1.0,
        tipMultiplier: 1.0,
        orderPreference: ['Pizza', 'Patatine', 'Caffè'],
        personality: 'Sei una studentessa universitaria solare, spontanea, espressiva e amichevole.',
        sensitiveTopics: ['studi', 'esami', 'soldi', 'tasse'],
        dialogueStyles: {
            greeting: 'Ciao! Come vanno gli studi?',
            order: 'Prendo un po\' di cibo, ho fame dopo le lezioni.',
            happy: 'Grazie mille! Sei sempre gentile!',
            angry: 'Oh no, sto morendo di fame qui!',
            farewell: 'A dopo! Devo andare a studiare.'
        },
        textureUp: 'Elena_Dietro.png',
        textureDown: 'Elena_Avanti.png',
        textureLeft: 'Elena_Sinistra.png',
        textureRight: 'Elena_Destra.png'
    },
    'Maria': {
        hasTilesheet: false,
        emojiChar: '👩',
        age: 30,
        gender: 'female',
        bio: 'Giovane donna di 30 anni, grande amante della bicicletta.',
        patienceMultiplier: 1.2,
        tipMultiplier: 1.1,
        orderPreference: ['Panino', 'Acqua', 'Arancina'],
        personality: 'Sei una donna dinamica ed energica che vive per la bicicletta.',
        sensitiveTopics: ['bici', 'sport', 'velocità'],
        dialogueStyles: {
            greeting: 'Ciao! Ho appena finito un giro in bici!',
            order: 'Ho fame dopo la pedalata!',
            happy: 'Che brava cameriera!',
            angry: 'Ho fame, mi serve il cibo!',
            farewell: 'Devo andare, ho un altro giro in programma!'
        },
        textureUp: 'Maria_Dietro.png',
        textureDown: 'Maria_Avanti.png',
        textureLeft: 'Maria_Sinistra.png',
        textureRight: 'Maria_Destra.png'
    },
    'Francesco': {
        hasTilesheet: false,
        emojiChar: '👱‍♂️',
        age: 25,
        gender: 'male',
        bio: 'Ragazzo innamorato della cameriera.',
        patienceMultiplier: 0.5,
        tipMultiplier: 1.5,
        orderPreference: ['Caffè', 'Cannolo', 'Ginseng'],
        personality: 'Sei un ragazzo romantico, elegante, affettuoso ed estremamente sicuro di sé.',
        sensitiveTopics: ['amore', 'bellezza', 'relazione'],
        dialogueStyles: {
            greeting: 'Ciao bellissima! Sei ancora più bella oggi!',
            order: 'Prendo quello che mi consigli tu.',
            happy: 'Per te farei qualsiasi cosa!',
            angry: 'Aspetto da tanto, tesoro...',
            farewell: 'Arrivederci, splendore! Ci vediamo presto!'
        },
        textureUp: 'Francesco_Dietro.png',
        textureDown: 'Francesco_Avanti.png',
        textureLeft: 'Francesco_Sinistra.png',
        textureRight: 'Francesco_Destra.png'
    },
    'Rosa': {
        hasTilesheet: false,
        emojiChar: '👵',
        age: 80,
        gender: 'female',
        bio: 'Anziana signora di 80 anni.',
        patienceMultiplier: 1.3,
        tipMultiplier: 0.8,
        orderPreference: ['Cassata', 'Caffè', 'Cannolo'],
        personality: 'Sei un\'anziana signora dolce e nostalgica. Parli del passato con calore e affetto.',
        sensitiveTopics: ['età', 'memoria', 'vecchiaia'],
        dialogueStyles: {
            greeting: 'Oh, cara! Come stai oggi? Sai, ai miei tempi...',
            order: 'Vorrei qualcosa di dolce, come la mia vecchia cassata!',
            happy: 'Che gentile! Sei come mia nipote!',
            angry: 'Sono vecchia, non farmi aspettare troppo!',
            farewell: 'A presto, cara! Ti racconterò di nuovo la storia del mio gatto!'
        },
        textureUp: 'Rosa_Dietro.png',
        textureDown: 'Rosa_Avanti.png',
        textureLeft: 'Rosa_Sinistra.png',
        textureRight: 'Rosa_Destra.png'
    },
    'Sofia': {
        hasTilesheet: false,
        emojiChar: '👩‍💼',
        age: 30,
        gender: 'female',
        bio: 'Ricchissima imprenditrice milanese, snob e altezzosa.',
        patienceMultiplier: 0.7,
        tipMultiplier: 2.0,
        orderPreference: ['Risotto', 'Birra', 'Fritto Misto'],
        personality: 'Sei una donna d\'affari milanese ricca, snob, sofisticata, esigente e molto sicura di sé.',
        sensitiveTopics: ['prezzi', 'qualità', 'lusso'],
        dialogueStyles: {
            greeting: 'Spero che il servizio sia all\'altezza della mia posizione.',
            order: 'Vorrei il risotto, spero che non sia come quello della mensa.',
            happy: 'Accettabile. Non male per un posto del genere.',
            angry: 'Questo è inaccettabile! Voglio parlare con il direttore!',
            farewell: 'Spero di non dover tornare in un posto così... o forse sì.'
        },
        textureUp: 'Sofia_Dietro.png',
        textureDown: 'Sofia_Avanti.png',
        textureLeft: 'Sofia_Sinistra.png',
        textureRight: 'Sofia_Destra.png'
    },
    'Chiara': {
        hasTilesheet: false,
        emojiChar: '👩‍🏫',
        age: 40,
        gender: 'female',
        bio: 'Madre di 40 anni, lavora come insegnante.',
        patienceMultiplier: 1.1,
        tipMultiplier: 1.0,
        orderPreference: ['Pizza', 'Cola', 'Panino'],
        personality: 'Sei una professoressa premurosa, seria, organizzata e paziente.',
        sensitiveTopics: ['scuola', 'figli', 'lavoro'],
        dialogueStyles: {
            greeting: 'Buongiorno! Ho appena finito di correggere compiti.',
            order: 'Qualcosa di veloce, ho poco tempo prima di tornare a scuola.',
            happy: 'Grazie! Sei sempre così efficiente!',
            angry: 'Mi dispiace ma devo tornare a lavorare!',
            farewell: 'Arrivederci! Domani ho una riunione con i genitori.'
        },
        textureUp: 'Chiara_Dietro.png',
        textureDown: 'Chiara_Avanti.png',
        textureLeft: 'Chiara_Sinistra.png',
        textureRight: 'Chiara_Destra.png'
    },
    'Massimo': {
        hasTilesheet: false,
        emojiChar: '👨',
        age: 50,
        gender: 'male',
        bio: 'Ingegnere edile di 50 anni, scorbutico e cinico.',
        patienceMultiplier: 0.9,
        tipMultiplier: 0.9,
        orderPreference: ['Birra', 'Panino', 'Patatine'],
        personality: 'Sei un ingegnere pragmatico, scorbutico, sbrigativo e cinico.',
        sensitiveTopics: ['lavoro', 'giovani', 'politica'],
        dialogueStyles: {
            greeting: 'Boh, speriamo che il servizio sia decente.',
            order: 'Una birra e un panino. E sbrigati.',
            happy: 'Mmmh, non male. Forse tornerò.',
            angry: 'Perché ci metti così tanto? Al cantiere sarei già andato via!',
            farewell: 'Vabbè, a dopo. Se il cibo era buono, tornerò.'
        },
        textureUp: 'Massimo_Dietro.png',
        textureDown: 'Massimo_Avanti.png',
        textureLeft: 'Massimo_Sinistra.png',
        textureRight: 'Massimo_Destra.png'
    },
    'Andrea': {
        hasTilesheet: false,
        emojiChar: '👨‍💻',
        age: 35,
        gender: 'male',
        bio: 'Programmatore informatico esperto.',
        patienceMultiplier: 1.0,
        tipMultiplier: 1.2,
        orderPreference: ['Caffè', 'Risotto', 'Cola'],
        personality: 'Sei un programmatore analitico, appassionato di tecnologia, logica e informatica.',
        sensitiveTopics: ['tecnologia', 'coding', 'IA'],
        dialogueStyles: {
            greeting: 'Ciao! Stavo facendo debugging di un\'app, ho bisogno di carburante.',
            order: 'Un caffè doppio, per favore. Devo stare sveglio.',
            happy: 'Ottimo! A proposito, se ti servono consigli tech, chiedimi!',
            angry: 'Il tempo di caricamento è troppo lungo... come il mio debug!',
            farewell: 'A dopo! Devo ottimizzare il codice di un progetto.'
        },
        textureUp: 'Andrea_Dietro.png',
        textureDown: 'Andrea_Avanti.png',
        textureLeft: 'Andrea_Sinistra.png',
        textureRight: 'Andrea_Destra.png'
    },
    'Marco': {
        hasTilesheet: false,
        emojiChar: '🤵',
        age: 28,
        gender: 'male',
        bio: 'Il tuo fidanzato.',
        isBoyfriend: true,
        noTip: true,
        patienceMultiplier: 1.5,
        tipMultiplier: 0,
        orderPreference: ['Pizza', 'Birra', 'Patatine'],
        personality: 'Sei il fidanzato della cameriera, molto dolce, affettuoso, un po\' pigro e spontaneo.',
        sensitiveTopics: ['relazione', 'amore', 'tradimento'],
        dialogueStyles: {
            greeting: 'Ciao amore! Come è andata la giornata?',
            order: 'La solita pizza, tesoro. Sai che la condividiamo.',
            happy: 'Sei la migliore! Amore mio!',
            angry: 'Tesoro, stai impiegando troppo tempo...',
            farewell: 'Ci vediamo a casa! Ti aspetto per cena!'
        },
        textureUp: 'Marco_Dietro.png',
        textureDown: 'Marco_Avanti.png',
        textureLeft: 'Marco_Sinistra.png',
        textureRight: 'Marco_Destra.png'
    }
};

class NPCMemory {
    constructor(npcName) {
        this.npcName = npcName;
        this.storageKey = `waitress_npc_memory_${npcName}`;
        this.maxFacts = 20;
        this.maxSummaryLength = 400;
        this.data = this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                const facts = (parsed.facts || []).map(f => {
                    if (typeof f === 'string') {
                        return { text: f, timestamp: Date.now(), hits: 1 };
                    }
                    return f;
                });
                return {
                    conversations: [],
                    facts: facts,
                    summary: parsed.summary || '',
                    relationship: typeof parsed.relationship === 'number' ? parsed.relationship : 50,
                    lastSeen: parsed.lastSeen || 0,
                    totalInteractions: parsed.totalInteractions || 0,
                    version: 2
                };
            }
        } catch (e) {}
        return {
            conversations: [],
            facts: [],
            summary: '',
            relationship: 50,
            lastSeen: 0,
            totalInteractions: 0,
            version: 2
        };
    }

    save() {
        try {
            this.data.lastSeen = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {}
    }

    addExchange(userMessage, npcReply) {
        this.data.totalInteractions++;
        this.data.lastSeen = Date.now();
        this.save();
    }

    addConcept(concept) {
        if (!concept || typeof concept !== 'string') return;
        const trimmed = concept.trim();
        if (trimmed.length < 3 || trimmed.length > 80) return;

        const lower = trimmed.toLowerCase();
        const exists = this.data.facts.some(f => {
            const fl = f.text.toLowerCase();
            return fl === lower || fl.includes(lower) || lower.includes(fl);
        });
        if (exists) return;

        this.data.facts.push({
            text: trimmed,
            timestamp: Date.now(),
            hits: 1
        });

        if (this.data.facts.length > this.maxFacts) {
            const now = Date.now();
            this.data.facts.sort((a, b) => {
                const ageA = (now - a.timestamp) / (1000 * 60 * 60);
                const ageB = (now - b.timestamp) / (1000 * 60 * 60);
                const scoreA = a.hits * Math.exp(-ageA / 24);
                const scoreB = b.hits * Math.exp(-ageB / 24);
                return scoreB - scoreA;
            });
            this.data.facts = this.data.facts.slice(0, this.maxFacts);
        }
        this.save();
    }

    reinforceConcept(text) {
        if (!text) return false;
        const lower = text.toLowerCase();
        const found = this.data.facts.find(f => {
            const fl = f.text.toLowerCase();
            return fl === lower || fl.includes(lower) || lower.includes(fl);
        });
        if (found) {
            found.hits++;
            found.timestamp = Date.now();
            this.save();
            return true;
        }
        return false;
    }

    setRelationship(value) {
        this.data.relationship = Math.max(0, Math.min(100, value));
        this.save();
    }

    getRelationship() {
        return this.data.relationship;
    }

    setSummary(summary) {
        if (!summary) return;
        this.data.summary = String(summary).slice(0, this.maxSummaryLength);
        this.save();
    }

    getSummary() {
        return this.data.summary;
    }

    buildConceptContext() {
        const parts = [];
        const now = Date.now();
        const lastSeen = this.data.lastSeen;

        if (lastSeen > 0) {
            const hoursAgo = Math.floor((now - lastSeen) / (1000 * 60 * 60));
            if (hoursAgo > 24) parts.push(`(${Math.floor(hoursAgo / 24)}g fa)`);
            else if (hoursAgo > 0) parts.push(`(${hoursAgo}h fa)`);
        }

        if (this.data.summary) parts.push(this.data.summary);

        if (this.data.facts.length > 0) {
            const sorted = [...this.data.facts].sort((a, b) => {
                const ageA = (now - a.timestamp) / (1000 * 60 * 60);
                const ageB = (now - b.timestamp) / (1000 * 60 * 60);
                return (b.hits * Math.exp(-ageB / 24)) - (a.hits * Math.exp(-ageA / 24));
            });
            parts.push(sorted.slice(0, 5).map(f => f.text).join(' · '));
        }

        return parts.join(' | ').slice(0, 280);
    }

    buildMemoryContext() {
        return this.buildConceptContext();
    }

    reset() {
        this.data = {
            conversations: [],
            facts: [],
            summary: '',
            relationship: 50,
            lastSeen: 0,
            totalInteractions: 0,
            version: 2
        };
        localStorage.removeItem(this.storageKey);
    }

    export() {
        return {
            npcName: this.npcName,
            facts: this.data.facts,
            summary: this.data.summary,
            relationship: this.data.relationship,
            lastSeen: this.data.lastSeen,
            totalInteractions: this.data.totalInteractions,
            version: 2
        };
    }

    import(data) {
        if (!data || typeof data !== 'object') return;
        this.data = {
            conversations: [],
            facts: Array.isArray(data.facts) ? data.facts.map(f =>
                typeof f === 'string' ? { text: f, timestamp: Date.now(), hits: 1 } : f
            ) : [],
            summary: data.summary || '',
            relationship: typeof data.relationship === 'number' ? data.relationship : 50,
            lastSeen: data.lastSeen || 0,
            totalInteractions: data.totalInteractions || 0,
            version: 2
        };
        this.save();
    }
}

class SentimentAnalyzer {
    constructor() {
        this.positiveWords = ['grazie', 'brava', 'ottimo', 'perfetto', 'amore', 'gentile', 'bello', 'buono', 'fantastico', 'meraviglioso'];
        this.negativeWords = ['stronzo', 'merda', 'cazzo', 'idiota', 'brutto', 'pessimo', 'schifo', 'odio', 'detesto'];
    }

    analyzeSentiment(text, npcName = '') {
        const lowerText = text.toLowerCase();
        let score = 0;
        this.positiveWords.forEach(w => { if (lowerText.includes(w)) score += 10; });
        this.negativeWords.forEach(w => { if (lowerText.includes(w)) score -= 15; });
        score = Math.max(-50, Math.min(50, score));
        return { score, sentiment: this.getSentimentLabel(score) };
    }

    getSentimentLabel(score) {
        if (score >= 20) return 'very_positive';
        if (score >= 5) return 'positive';
        if (score > -5) return 'neutral';
        if (score > -20) return 'negative';
        return 'very_negative';
    }
}

const WEBLLM_MODELS = {
    'Hermes-3-Llama-3.2-3B-q4f16_1-MLC': {
        label: 'Hermes 3 Llama 3.2 3B',
        size: '~2.3GB',
        vramRequiredMB: 2264
    }
};

class NPCManager {
    constructor(scene) {
        this.scene = scene;
        this.activeCustomers = [];
        this.relationshipScores = this.loadRelationships();
        this.sentimentAnalyzer = new SentimentAnalyzer();
        this.ludovicaAdopted = localStorage.getItem('waitress_ludovica_adopted') === 'true';
    }

    loadRelationships() {
        try {
            const saved = localStorage.getItem('waitress_npc_relationships');
            return saved ? JSON.parse(saved) : {};
        } catch (e) { return {}; }
    }

    saveRelationships() {
        try {
            localStorage.setItem('waitress_npc_relationships', JSON.stringify(this.relationshipScores));
        } catch (e) {}
    }

    getNPCConfig(npcName) {
        return NPC_CONFIG[npcName] || null;
    }

    getAllNPCs() {
        return Object.keys(NPC_CONFIG);
    }

    getAvailableNPCs() {
        return Object.keys(NPC_CONFIG).filter(npc => {
            if (npc === 'Poliziotto') return false;
            if (npc === 'Marco' && !this.scene.story?.storyState?.metMarco) return false;
            if (npc === 'Andrea' && this.scene.level < 3) return false;
            return true;
        });
    }

    spawnCustomer() {
        const available = this.getAvailableNPCs();
        if (available.length === 0) return null;

        const weights = { Elena: 3, Maria: 2, Francesco: 2, Rosa: 2, Sofia: 1, Chiara: 2, Massimo: 1, Andrea: 1, Marco: 1 };
        const totalWeight = available.reduce((sum, npc) => sum + (weights[npc] || 1), 0);
        let random = Math.random() * totalWeight;
        let selectedNPC = available[0];

        for (const npc of available) {
            random -= weights[npc] || 1;
            if (random <= 0) { selectedNPC = npc; break; }
        }

        return this.createCustomer(selectedNPC);
    }

    createCustomer(npcName) {
        const config = NPC_CONFIG[npcName];
        if (!config) return null;

        const allFoods = ['Pizza', 'Patatine', 'Panino', 'Risotto', 'Caponata', 'Caffè', 'Cola', 'Acqua', 'Birra', 'Arancina', 'Cassata', 'Chinotto', 'Cannolo', 'Ginseng', 'Fritto Misto', 'Pasta al Pesto', 'Panino con la Milza'];

        const order = config.orderPreference?.length
            ? config.orderPreference[Math.floor(Math.random() * config.orderPreference.length)]
            : allFoods[Math.floor(Math.random() * allFoods.length)];

        const memory = new NPCMemory(npcName);
        const initialRelation = memory.getRelationship();

        const customer = {
            name: npcName,
            config,
            order,
            patience: config.isBoyfriend ? 70 : 100,
            bladder: 0,
            gender: config.gender,
            isInBathroom: false,
            bubbleIcon: null,
            isDead: false,
            table: null,
            relationScore: initialRelation,
            adoptTrigger: config.adoptTrigger || false,
            patienceMultiplier: config.patienceMultiplier || 1.0,
            bringsChild: false,
            emojiChar: config.emojiChar,
            hasTilesheet: config.hasTilesheet || false,
            tilesheetKey: config.key || null,
            tipMultiplier: config.tipMultiplier || 1.0,
            noTip: config.noTip || false,
            x: 0, y: 0,
            orderBubble: null, chatBubble: null, childGraphic: null,
            patienceBar: null, patienceBg: null, emoji: null, sprite: null, timerEvent: null,
            serve: () => {}
        };

        if (config.textureUp && config.textureDown && config.textureLeft && config.textureRight) {
            customer.hasDirectionalTextures = true;
            customer.textureUp = config.textureUp;
            customer.textureDown = config.textureDown;
            customer.textureLeft = config.textureLeft;
            customer.textureRight = config.textureRight;
        } else {
            customer.hasDirectionalTextures = false;
        }

        return customer;
    }

    getRelationship(npcName) {
        try {
            const memory = new NPCMemory(npcName);
            return memory.getRelationship();
        } catch (e) {
            return this.relationshipScores[npcName] || 50;
        }
    }

    resetRelationships() {
        this.relationshipScores = {};
        localStorage.removeItem('waitress_npc_relationships');
        Object.keys(NPC_CONFIG).forEach(name => {
            try { new NPCMemory(name).reset(); } catch (e) {}
        });
    }

    updateNPCDirection(customer, direction) {
        if (!customer || !customer.sprite) return;
        if (customer.hasDirectionalTextures) {
            const textureKey = customer[`texture${direction}`];
            if (textureKey && this.scene.textures.exists(textureKey)) {
                customer.sprite.setTexture(textureKey);
            }
        }
    }
}

class AIDialogueManager {
    constructor(scene, enabled = true) {
        this.scene = scene;
        this.currentCustomer = null;
        this.chatHistory = [];
        this.engine = null;
        this.isLoading = false;
        this.isModelReady = false;
        this.isChatOpen = false;
        this.isAIActive = enabled;
        this.selectedModel = 'Hermes-3-Llama-3.2-3B-q4f16_1-MLC';
        this.loadError = null;
        this.webllm = null;
        this._initializationPromise = null;
        this._chatInputFocused = false;
        this._pausedCustomerTimers = [];
        this._phaserKeyboardWasEnabled = true;
        this._timeWasPaused = false;
        this._physicsWasPaused = false;
        this._loadingStartedAt = 0;
        this._lastProgress = 0;
        this._loadingCancelled = false;
        this._modelCachedAt = null;
        this._bgTimer = null;
        this._bgPending = [];
        this.npcManager = new NPCManager(scene);
        this.npcMemories = {};
        this.currentMemory = null;
        this.languageToolEndpoint = 'https://api.languagetool.org/v2/check';
        this.languageToolEnabled = false;
        this.languageToolTimeout = 2000;
        this.grammarRules = null;
        this._grammarRulesLoaded = false;
        this._loadGrammarRules();

        this.injectChatStyles();
        this.createLoadingDOM();
        this.createChatDOM();
        this.setupKeyboardFix();
    }

    getMemory(npcName) {
        if (!this.npcMemories[npcName]) {
            this.npcMemories[npcName] = new NPCMemory(npcName);
        }
        return this.npcMemories[npcName];
    }

    async _loadGrammarRules() {
        try {
            const response = await fetch('grammar_rules.json');
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const raw = await response.json();
            this.grammarRules = {};
            for (const [section, rules] of Object.entries(raw)) {
                this.grammarRules[section] = rules.map(([pattern, replacement]) => {
                    return [new RegExp(pattern, 'gi'), replacement];
                });
            }
            this._grammarRulesLoaded = true;
            console.log('[AI] Regole grammaticali caricate dal JSON:', Object.keys(this.grammarRules).length, 'sezioni');
        } catch (e) {
            console.warn('[AI] Impossibile caricare grammar_rules.json, uso fallback inline:', e);
            this._grammarRulesLoaded = false;
            this.grammarRules = null;
        }
    }

    _applyRuleSection(sectionName, text) {
        if (!this.grammarRules || !this.grammarRules[sectionName]) return text;
        let s = text;
        for (const [regex, replacement] of this.grammarRules[sectionName]) {
            s = s.replace(regex, replacement);
        }
        return s;
    }

    async isModelCached(modelId) {
        if (!('caches' in window)) return false;
        try {
            const cacheNames = await caches.keys();
            const webllmCaches = cacheNames.filter(n =>
                n.toLowerCase().includes('webllm') || n.toLowerCase().includes('mlc'));
            for (const name of webllmCaches) {
                const cache = await caches.open(name);
                const keys = await cache.keys();
                if (keys.some(req => req.url.includes(modelId) || req.url.includes('params') || req.url.includes('tokenizer'))) {
                    return true;
                }
            }
            return false;
        } catch (e) { return false; }
    }

    getModelReference() {
        return { id: this.selectedModel, version: '1.0', cachedAt: this._modelCachedAt || Date.now() };
    }

    injectChatStyles() {
        if (document.getElementById('ai-chat-styles')) return;
        const style = document.createElement('style');
        style.id = 'ai-chat-styles';
        style.textContent = `
            #ai-loading-screen { position: fixed; inset: 0; z-index: 1000000; display: none; align-items: center; justify-content: center; background: radial-gradient(circle at center, rgba(70,45,15,.96) 0%, rgba(18,10,5,.985) 55%, rgba(5,3,2,1) 100%); font-family: 'Fredoka', 'Segoe UI', sans-serif; }
            #ai-loading-card { width: min(520px, calc(100vw - 36px)); padding: 32px; border: 3px solid #eccc68; border-radius: 18px; background: rgba(20, 10, 5, .97); box-shadow: 0 20px 80px rgba(0,0,0,.75); text-align: center; color: #fff; }
            #ai-loading-icon { font-size: 58px; margin-bottom: 10px; animation: aiPulse 1.4s infinite ease-in-out; }
            #ai-loading-title { color: #eccc68; font-size: 27px; font-weight: 800; margin-bottom: 8px; }
            #ai-loading-subtitle { color: #ddd; font-size: 14px; line-height: 1.45; min-height: 42px; }
            #ai-loading-percent { margin-top: 22px; font-size: 32px; font-weight: 800; color: #2ed573; }
            #ai-loading-bar-bg { width: 100%; height: 18px; margin-top: 12px; background: rgba(255,255,255,.12); border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,.15); }
            #ai-loading-bar { width: 0%; height: 100%; border-radius: 20px; background: linear-gradient(90deg, #2ed573, #7bed9f); transition: width .25s ease; }
            #ai-loading-details { margin-top: 14px; color: #aaa; font-size: 12px; min-height: 18px; }
            #ai-loading-time { margin-top: 5px; color: #777; font-size: 11px; }
            #ai-loading-error { display: none; margin-top: 18px; padding: 12px; border-radius: 8px; background: rgba(231,76,60,.16); border: 1px solid rgba(231,76,60,.5); color: #ffb3aa; font-size: 13px; line-height: 1.4; white-space: pre-wrap; text-align: left; }
            #ai-loading-close { display: none; margin-top: 18px; padding: 10px 18px; border: 0; border-radius: 8px; background: #eccc68; color: #241508; font-weight: 800; cursor: pointer; font-family: inherit; }
            #ai-loading-close:hover { background: #ffe58f; }
            #ai-loading-cache { margin-top: 14px; color: #777; font-size: 11px; }
            @keyframes aiPulse { 0%,100% { transform: scale(1); opacity: .8; } 50% { transform: scale(1.08); opacity: 1; } }
            #ai-chat-container { position: fixed; bottom: 20px; right: 20px; width: 360px; height: 460px; background: rgba(20, 10, 5, 0.95); border: 3px solid #eccc68; border-radius: 12px; display: none; flex-direction: column; font-family: 'Fredoka', 'Segoe UI', sans-serif; box-shadow: 0 8px 24px rgba(0,0,0,0.6); z-index: 99999; overflow: hidden; }
            #ai-chat-header { background: #2ed573; color: #fff; padding: 10px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eccc68; flex-shrink: 0; }
            #ai-chat-log { flex: 1; padding: 10px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; min-height: 0; }
            .ai-msg { padding: 8px 12px; border-radius: 8px; max-width: 85%; font-size: 14px; line-height: 1.35; word-wrap: break-word; }
            .ai-msg.customer { background: #ffa502; color: #2f3542; align-self: flex-start; }
            .ai-msg.player { background: #70a1ff; color: #fff; align-self: flex-end; }
            .ai-msg.system { background: rgba(255,255,255,0.1); color: #eccc68; align-self: center; font-size: 12px; text-align: center; max-width: 95%; }
            #ai-chat-input-area { display: flex; padding: 10px; background: rgba(0,0,0,0.3); gap: 6px; flex-shrink: 0; }
            #ai-chat-input { flex: 1; padding: 8px 12px; border-radius: 6px; border: 1px solid #eccc68; background: #2f3542; color: #fff; outline: none; font-family: 'Fredoka', sans-serif; }
            #ai-chat-input::placeholder { color: #888; }
            #ai-chat-send { padding: 8px 14px; background: #2ed573; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-family: 'Fredoka', sans-serif; }
            #ai-chat-send:hover { background: #26af5f; }
            #ai-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
            #ai-chat-close { cursor: pointer; font-weight: bold; padding: 0 8px; font-size: 18px; }
            #ai-chat-close:hover { color: #ff6b6b; }
            #ai-chat-status { font-size: 10px; opacity: 0.9; margin-left: auto; margin-right: 8px; max-width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            #ai-chat-relation { background: rgba(0,0,0,0.3); padding: 2px 10px; border-radius: 12px; font-size: 13px; }
        `;
        document.head.appendChild(style);
    }

    createLoadingDOM() {
        if (document.getElementById('ai-loading-screen')) return;
        const screen = document.createElement('div');
        screen.id = 'ai-loading-screen';
        screen.innerHTML = `
            <div id="ai-loading-card">
                <div id="ai-loading-icon">🤖</div>
                <div id="ai-loading-title">Preparazione dell'IA</div>
                <div id="ai-loading-subtitle">Sto preparando il modello per le conversazioni.</div>
                <div id="ai-loading-percent">0%</div>
                <div id="ai-loading-bar-bg"><div id="ai-loading-bar"></div></div>
                <div id="ai-loading-details">Preparazione...</div>
                <div id="ai-loading-time">Tempo trascorso: 0 secondi</div>
                <div id="ai-loading-error"></div>
                <button id="ai-loading-close">Chiudi</button>
                <div id="ai-loading-cache">Primo caricamento: il modello viene salvato nella cache del browser.</div>
            </div>
        `;
        document.body.appendChild(screen);
        document.getElementById('ai-loading-close').addEventListener('click', () => this.hideLoadingScreen());
    }

    showLoadingScreen() {
        const screen = document.getElementById('ai-loading-screen');
        if (!screen) return;
        screen.style.display = 'flex';
        const error = document.getElementById('ai-loading-error');
        const close = document.getElementById('ai-loading-close');
        if (error) { error.style.display = 'none'; error.textContent = ''; }
        if (close) close.style.display = 'none';
        this._loadingStartedAt = Date.now();
        this._lastProgress = 0;
        this.updateLoadingProgress(0, 'Avvio del motore WebGPU...');
        this.startLoadingClock();
    }

    hideLoadingScreen() {
        const screen = document.getElementById('ai-loading-screen');
        if (screen) screen.style.display = 'none';
        if (this._loadingClock) { clearInterval(this._loadingClock); this._loadingClock = null; }
    }

    startLoadingClock() {
        if (this._loadingClock) clearInterval(this._loadingClock);
        this._loadingClock = setInterval(() => {
            if (!this.isLoading) return;
            const elapsed = Math.floor((Date.now() - this._loadingStartedAt) / 1000);
            const time = document.getElementById('ai-loading-time');
            if (time) time.textContent = `Tempo trascorso: ${elapsed} secondi`;
        }, 1000);
    }

    updateLoadingProgress(progress, text = '') {
        const safeProgress = Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0));
        this._lastProgress = safeProgress;
        const percent = document.getElementById('ai-loading-percent');
        const bar = document.getElementById('ai-loading-bar');
        const details = document.getElementById('ai-loading-details');
        if (percent) percent.textContent = `${Math.floor(safeProgress)}%`;
        if (bar) bar.style.width = `${safeProgress}%`;
        if (details && text) details.textContent = this.formatLoadingText(text);
    }

    formatLoadingText(text) {
        if (!text) return 'Preparazione...';
        const value = String(text);
        const match = value.match(/(\d+(?:\.\d+)?)\s*MB\s*fetched/i);
        const percentMatch = value.match(/(\d+(?:\.\d+)?)%\s*completed/i);
        if (match && percentMatch) return `${match[1]} MB scaricati · ${percentMatch[1]}% completato`;
        if (/fetching param cache/i.test(value)) return 'Download dei dati del modello...';
        if (/loading/i.test(value)) return 'Caricamento del modello...';
        if (/shader/i.test(value)) return 'Preparazione della GPU...';
        if (/compile/i.test(value)) return 'Kernel GPU in compilazione...';
        return value.replace(/\s+/g, ' ').trim().slice(0, 100);
    }

    showLoadingError(error) {
        const details = document.getElementById('ai-loading-details');
        const errorBox = document.getElementById('ai-loading-error');
        const close = document.getElementById('ai-loading-close');
        let errorMessage = 'Errore sconosciuto.';
        if (error) {
            if (typeof error === 'string') errorMessage = error;
            else if (error.message) errorMessage = error.message;
            else if (error.toString) errorMessage = error.toString();
        }
        const isWebGPUError = !navigator.gpu;
        const isAdapterError = errorMessage.toLowerCase().includes('adapter') || errorMessage.toLowerCase().includes('gpu');
        let userMessage = errorMessage;
        if (isWebGPUError) {
            userMessage = '❌ WebGPU non è disponibile in questo browser.\n\nSoluzioni:\n1. Usa Chrome 113+ o Edge 113+\n2. Abilita WebGPU in chrome://flags\n3. Aggiorna i driver della scheda video\n4. Usa un dispositivo con GPU dedicata';
        } else if (isAdapterError) {
            userMessage = '❌ La GPU non è compatibile con WebGPU.\n\nDettaglio: ' + errorMessage + '\n\nSoluzioni:\n1. Aggiorna i driver della scheda video\n2. Prova con un altro browser\n3. Verifica che la GPU supporti WebGPU';
        }
        if (details) details.textContent = 'Il caricamento non è riuscito.';
        if (errorBox) { errorBox.style.display = 'block'; errorBox.textContent = userMessage; }
        if (close) close.style.display = 'inline-block';
        console.error('[AI] Errore caricamento WebLLM:', error);
    }

    async initializeWebLLM() {
        if (!this.isAIActive) return false;
        if (this.isModelReady && this.engine) return true;
        if (this._initializationPromise) return this._initializationPromise;
        this._initializationPromise = this._initializeWebLLMInternal();
        try { return await this._initializationPromise; }
        finally { this._initializationPromise = null; }
    }

    async _checkWebGPU() {
        if (typeof navigator === 'undefined' || !navigator.gpu) {
            throw new Error('WebGPU non è disponibile in questo browser.');
        }
        let adapter = null;
        try { adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' }); } catch (e) {}
        if (!adapter) { try { adapter = await navigator.gpu.requestAdapter(); } catch (e) {} }
        if (!adapter) { try { adapter = await navigator.gpu.requestAdapter({ powerPreference: 'low-power' }); } catch (e) {} }
        if (!adapter) throw new Error('Nessun adapter GPU compatibile con WebGPU trovato.');
        try {
            const device = await adapter.requestDevice();
            if (device) { try { if (device.destroy) device.destroy(); } catch (e) {} }
        } catch (e) {
            throw new Error('Impossibile creare il device WebGPU: ' + e.message);
        }
        return adapter;
    }

    async _initializeWebLLMInternal() {
        if (this.isLoading) return false;
        this.isLoading = true;
        this.isModelReady = false;
        this.loadError = null;
        this._loadingCancelled = false;
        this.showLoadingScreen();

        try {
            this.updateLoadingProgress(1, 'Verifica WebGPU...');
            await this._checkWebGPU();
            this.updateLoadingProgress(3, 'GPU compatibile. Carico WebLLM...');

            if (!this.webllm) {
                try { this.webllm = await import('https://esm.run/@mlc-ai/web-llm@0.2.79'); }
                catch (e) { this.webllm = await import('https://esm.run/@mlc-ai/web-llm'); }
            }

            if (!this.webllm || !this.webllm.MLCEngine) {
                throw new Error('WebLLM non caricato correttamente. MLCEngine non trovato.');
            }

            this.updateLoadingProgress(5, 'WebLLM pronto. Inizializzo engine...');

            const wasCached = await this.isModelCached(this.selectedModel);
            if (wasCached) this.updateLoadingProgress(6, 'Modello trovato in cache locale.');
            else this.updateLoadingProgress(6, 'Modello non in cache. Download in corso...');

            if (!this.engine) {
                this.engine = new this.webllm.MLCEngine({
                    initProgressCallback: report => this.handleModelProgress(report)
                });
            } else {
                this.engine.setInitProgressCallback(report => this.handleModelProgress(report));
            }

            this.updateLoadingProgress(8, 'Caricamento del modello...');
            await this.engine.reload(this.selectedModel);

            if (this._loadingCancelled) throw new Error('Caricamento annullato.');

            this._modelCachedAt = Date.now();
            this.updateLoadingProgress(100, 'Modello pronto.');
            this.isModelReady = true;
            this.isLoading = false;
            this.loadError = null;

            const status = document.getElementById('ai-chat-status');
            if (status) status.textContent = 'AI pronta';
            this.setChatControlsReady();

            setTimeout(() => this.hideLoadingScreen(), 500);
            return true;
        } catch (error) {
            console.error('[AI] Errore inizializzazione:', error);
            this.engine = null;
            this.isModelReady = false;
            this.isLoading = false;
            this.loadError = error;
            this.showLoadingError(error);
            const status = document.getElementById('ai-chat-status');
            if (status) status.textContent = 'AI offline';
            this.setChatControlsReady();
            return false;
        }
    }

    handleModelProgress(report) {
        if (!report) return;
        const rawText = report.text || report.message || '';
        let progress = Number(report.progress);
        if (!Number.isFinite(progress)) progress = this.extractProgress(rawText);
        if (progress <= 1 && progress > 0) progress *= 100;
        if (!Number.isFinite(progress)) progress = this._lastProgress;
        progress = Math.max(this._lastProgress, Math.min(100, progress));
        this.updateLoadingProgress(progress, rawText || 'Caricamento del modello...');
    }

    extractProgress(text) {
        if (!text) return 0;
        const match = String(text).match(/(\d+(?:\.\d+)?)%\s*(?:completed|complete)/i);
        if (match) return Number(match[1]);
        return this._lastProgress;
    }

    setChatControlsReady() {
        const input = document.getElementById('ai-chat-input');
        const sendBtn = document.getElementById('ai-chat-send');
        if (input) input.disabled = !this.isModelReady;
        if (sendBtn) sendBtn.disabled = !this.isModelReady;
    }

    createChatDOM() {
        if (document.getElementById('ai-chat-container')) return;
        const container = document.createElement('div');
        container.id = 'ai-chat-container';
        container.innerHTML = `
            <div id="ai-chat-header">
                <span id="ai-chat-title">💬 Conversazione</span>
                <span id="ai-chat-status">AI non caricata</span>
                <span id="ai-chat-relation">50%</span>
                <span id="ai-chat-close">✖</span>
            </div>
            <div id="ai-chat-log"></div>
            <div id="ai-chat-input-area">
                <input type="text" id="ai-chat-input" placeholder="Carica prima l'IA..." autocomplete="off" disabled />
                <button id="ai-chat-send" disabled>Invia</button>
            </div>
        `;
        document.body.appendChild(container);
        container.addEventListener('pointerdown', e => e.stopPropagation());
        container.addEventListener('pointerup', e => e.stopPropagation());
        container.addEventListener('click', e => e.stopPropagation());
        document.getElementById('ai-chat-close').addEventListener('click', e => { e.stopPropagation(); this.closeChat(); });
        document.getElementById('ai-chat-send').addEventListener('click', e => { e.stopPropagation(); this.sendMessage(); });
    }

    setupKeyboardFix() {
        const chatInput = document.getElementById('ai-chat-input');
        if (!chatInput) return;
        chatInput.addEventListener('keydown', e => {
            e.stopImmediatePropagation();
            if (e.key === 'Enter') { e.preventDefault(); this.sendMessage(); }
        }, true);
        chatInput.addEventListener('keyup', e => e.stopImmediatePropagation(), true);
        chatInput.addEventListener('keypress', e => e.stopImmediatePropagation(), true);
        chatInput.addEventListener('input', e => e.stopImmediatePropagation(), true);
        chatInput.addEventListener('focus', () => {
            this._chatInputFocused = true;
            if (this.scene?.input?.keyboard) {
                this._phaserKeyboardWasEnabled = this.scene.input.keyboard.enabled;
                this.scene.input.keyboard.enabled = false;
            }
        });
        chatInput.addEventListener('blur', () => {
            this._chatInputFocused = false;
            if (this.scene?.input?.keyboard) {
                if (this._phaserKeyboardWasEnabled !== false) this.scene.input.keyboard.enabled = true;
            }
        });
        window.addEventListener('keydown', e => { if (this._chatInputFocused) e.stopImmediatePropagation(); }, true);
        window.addEventListener('keyup', e => { if (this._chatInputFocused) e.stopImmediatePropagation(); }, true);
    }

    openChat(customer) {
        if (!customer) return;
        this.currentCustomer = customer;
        this.chatHistory = [];
        this.currentMemory = this.getMemory(customer.name);

        if (typeof customer.relationScore !== 'number') {
            customer.relationScore = this.currentMemory.getRelationship();
        } else {
            this.currentMemory.setRelationship(customer.relationScore);
        }

        const container = document.getElementById('ai-chat-container');
        const log = document.getElementById('ai-chat-log');
        const title = document.getElementById('ai-chat-title');
        const relation = document.getElementById('ai-chat-relation');
        const input = document.getElementById('ai-chat-input');
        if (!container || !log) return;

        log.innerHTML = '';
        container.style.display = 'flex';
        title.textContent = `💬 ${customer.name || 'Cliente'}`;
        const score = typeof customer.relationScore === 'number' ? customer.relationScore : 50;
        relation.textContent = `${Math.floor(score)}%`;

        this.isChatOpen = true;
        this.scene.gameActive = false;

        if (this.scene.time) {
            this._timeWasPaused = this.scene.time.paused;
            this.scene.time.paused = true;
        }
        if (this.scene.physics) {
            this._physicsWasPaused = this.scene.physics.world.isPaused;
            this.scene.physics.pause();
        }

        this._pausedCustomerTimers = [];
        if (this.scene.customers) {
            this.scene.customers.forEach(c => {
                if (!c || c === customer) return;
                if (c.timerEvent && !c.timerEvent.paused) { c.timerEvent.paused = true; this._pausedCustomerTimers.push(c.timerEvent); }
                if (c.movementTimeout && !c.movementTimeout.paused) { c.movementTimeout.paused = true; this._pausedCustomerTimers.push(c.movementTimeout); }
            });
        }
        if (customer.timerEvent) customer.timerEvent.paused = false;
        if (customer.movementTimeout) customer.movementTimeout.paused = false;

        if (this.scene.waitress?.body) {
            this.scene.waitress.body.setVelocity(0, 0);
            if (typeof this.scene.waitress.body.stop === 'function') this.scene.waitress.body.stop();
        }
        if (this.scene.input?.keyboard) {
            this._phaserKeyboardWasEnabled = this.scene.input.keyboard.enabled;
            this.scene.input.keyboard.enabled = false;
        }
        this._chatInputFocused = true;

        this.appendMessage('system', `Inizio conversazione con ${customer.name || 'il cliente'}.`);

        const config = NPC_CONFIG[customer.name] || {};
        const initialGreeting = config.dialogueStyles?.greeting || `Ciao! Sono ${customer.name}.`;
        this.appendMessage('customer', initialGreeting);
        this.chatHistory.push({ role: 'assistant', content: initialGreeting });

        this.setChatControlsReady();
        if (input) {
            input.placeholder = this.isModelReady ? 'Scrivi una risposta...' : 'Preparazione dell\'IA...';
            if (this.isModelReady) setTimeout(() => { input.focus(); input.select(); }, 150);
        }

        if (this.isAIActive && !this.isModelReady && !this.isLoading) {
            this.initializeWebLLM();
        }
    }

    closeChat() {
        const container = document.getElementById('ai-chat-container');
        if (container) container.style.display = 'none';

        if (this._bgTimer) {
            clearTimeout(this._bgTimer);
            this._bgTimer = null;
            this._flushBackground();
        }

        if (this._pausedCustomerTimers) {
            this._pausedCustomerTimers.forEach(t => { if (t) t.paused = false; });
            this._pausedCustomerTimers = [];
        }
        if (this.scene.time) this.scene.time.paused = this._timeWasPaused;
        if (this.scene.physics) { if (!this._physicsWasPaused) this.scene.physics.resume(); }
        if (this.scene.input?.keyboard) {
            if (this._phaserKeyboardWasEnabled !== false) this.scene.input.keyboard.enabled = true;
        }
        this._chatInputFocused = false;
        this.currentCustomer = null;
        this.currentMemory = null;
        this.isChatOpen = false;
        this.scene.gameActive = true;
    }

    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const sendBtn = document.getElementById('ai-chat-send');
        if (!input) return;

        if (!this.isModelReady || !this.engine) {
            this.showLoadingScreen();
            if (!this.isLoading) await this.initializeWebLLM();
            return;
        }

        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this.appendMessage('player', text);
        this.chatHistory.push({ role: 'user', content: text });
        input.disabled = true;
        if (sendBtn) sendBtn.disabled = true;

        try {
            await this.handleAIResponse(text);
        } catch (e) {
            this.appendMessage('system', '❌ Errore: ' + (e?.message || 'sconosciuto'));
        } finally {
            this.setChatControlsReady();
            if (this.isChatOpen) setTimeout(() => input.focus(), 100);
        }
    }

    buildIdentityPrompt(cfg, customer) {
        const relationship = typeof customer.relationScore === 'number'
            ? Math.round(customer.relationScore)
            : 50;
        const memoryContext = this.currentMemory ? this.currentMemory.buildConceptContext() : '';

        return `Sei ${customer.name}, ${cfg.age || 'adulto'} anni. ${cfg.personality || 'Cliente del ristorante.'}
Bio: ${cfg.bio || ''}
Stai parlando con la cameriera. Relazione: ${relationship}/100. Ordine: ${customer.order || 'nessuno'}.
${memoryContext ? 'Ricordi: ' + memoryContext : ''}

Rispondi in italiano, massimo 12 parole, una frase, prima persona. Nessun preambolo.
Output: {"reply": "..."}`;
    }

    getRecentHistory() {
        return this.chatHistory.slice(-4);
    }

    hasEnglishWords(text) {
        const englishWords = ['hey', 'hello', 'hi', 'ok', 'okay', 'yes', 'no problem', 'sure', 'wow', 'cool', 'sorry', 'please', 'thanks', 'thank you', 'bye', 'good', 'bad', 'nice', 'great', 'awesome', 'amazing', 'yeah', 'yep', 'nope', 'lol', 'omg', 'wtf', 'bro', 'dude', 'man', 'guys', 'love', 'like', 'hate', 'what', 'when', 'where', 'why', 'how', 'who', 'the', 'and', 'or', 'but', 'for', 'with', 'you', 'your', 'my', 'me', 'we', 'they', 'she', 'he', 'it'];
        const lower = text.toLowerCase();
        const words = lower.split(/[\s,.!?;:]+/);
        return words.some(w => englishWords.includes(w));
    }

    hasAbbreviations(text) {
        const abbrevs = ['nn', 'cmq', 'xké', 'xke', 'sn', 'dv', 'ke', 'xk', 'xkè', 'qnd', 'qlc', 'qlk', 'tt', 'tvb', 'xò', 'xo', 'cs', 'cn', 'c6'];
        const lower = text.toLowerCase();
        const words = lower.split(/[\s,.!?;:]+/);
        return words.some(w => abbrevs.includes(w));
    }

    hasMarkdown(text) {
        return /\*|_|`|#|\[|\]|\|/.test(text);
    }

    isTooShort(text) {
        const cleaned = text.replace(/[^a-zA-ZàèéìòùÀÈÉÌÒÙ\s]/g, '').trim();
        return cleaned.length < 3;
    }

    isRepetitive(text, history) {
        if (!history || history.length === 0) return false;
        const lower = text.toLowerCase().trim();
        return history.some(h => {
            if (!h || !h.content) return false;
            return h.content.toLowerCase().trim() === lower;
        });
    }

    sanitizeReply(reply) {
        if (!reply) return '';
        reply = String(reply)
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/<\|.*?\|>/g, '')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/`/g, '')
            .replace(/#{1,6}\s/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        reply = reply.replace(/^["“”'«»]|["“”'«»]$/g, '').trim();
        reply = reply.replace(/^\s*(NPC|Personaggio|Assistente|Risposta|Reply|AI)\s*:\s*/i, '');
        reply = this.applyStrictGrammarCheck(reply);
        if (!reply) return '';
        if (reply.length > 280) {
            reply = reply.slice(0, 280);
            const lastEnd = Math.max(reply.lastIndexOf('.'), reply.lastIndexOf('!'), reply.lastIndexOf('?'));
            if (lastEnd > 40) reply = reply.slice(0, lastEnd + 1);
        }
        const forbidden = [/^come intelligenza artificiale/i, /^come modello linguistico/i, /^come assistente/i, /^non posso aiutarti/i, /^non posso rispondere/i, /^mi dispiace, ma non/i];
        if (forbidden.some(p => p.test(reply))) return '';
        return reply.trim();
    }

    applyGrammarFixes(text) {
        let s = text;
        s = s.replace(/\s{2,}/g, ' ');
        s = s.replace(/\s+([,.!?;:])/g, '$1');
        s = s.replace(/([,.!?;:])([A-Za-zÀ-ÿ])/g, '$1 $2');
        s = s.replace(/([.!?])\s+([a-zà-ÿ])/g, (m, p1, p2) => `${p1} ${p2.toUpperCase()}`);
        if (s.length > 0) s = s.charAt(0).toUpperCase() + s.slice(1);
        if (!/[.!?…]$/.test(s)) s += '.';
        return s.trim();
    }

    applyStrictGrammarCheck(text) {
        if (!text) return text;
        let s = text;

        if (this._grammarRulesLoaded && this.grammarRules) {
            s = this._applyRuleSection('firstPersonFixes', s);
            s = this._applyRuleSection('articleFixes', s);
            s = this._applyRuleSection('prepFixes', s);
            s = this._applyRuleSection('doublePrepositionFixes', s);
            s = this._applyRuleSection('reflexiveFixes', s);
            s = this._applyRuleSection('pronounFixes', s);
            s = this._applyRuleSection('subjunctiveFixes', s);
            s = this._applyRuleSection('accentFixes', s);
            s = this._applyRuleSection('apostropheFixes', s);
            s = this._applyRuleSection('forbiddenPatterns', s);
        } else {
            s = this._applyFallbackGrammarFixes(s);
        }

        s = s.replace(/\s{2,}/g, ' ');
        s = s.replace(/\s+([,.!?;:])/g, '$1');
        s = s.replace(/([,.!?;:])([A-Za-zÀ-ÿ])/g, '$1 $2');
        s = s.replace(/([.!?])\s+([a-zà-ÿ])/g, (m, p1, p2) => `${p1} ${p2.toUpperCase()}`);
        if (s.length > 0) s = s.charAt(0).toUpperCase() + s.slice(1);
        if (!/[.!?…]$/.test(s)) s += '.';

        return s.trim();
    }

    _applyFallbackGrammarFixes(text) {
        let s = text;
        const inline = [
            [/\bio\s+insegnano\b/gi, 'io insegno'],
            [/\bio\s+hanno\b/gi, 'io ho'],
            [/\bio\s+fanno\b/gi, 'io faccio'],
            [/\bio\s+dicono\b/gi, 'io dico'],
            [/\bio\s+vanno\b/gi, 'io vado'],
            [/\bio\s+stanno\b/gi, 'io sto'],
            [/\bio\s+possono\b/gi, 'io posso'],
            [/\bio\s+devono\b/gi, 'io devo'],
            [/\bio\s+vogliono\b/gi, 'io voglio'],
            [/\bio\s+sei\b/gi, 'io sono'],
            [/\bio\s+è\b/gi, 'io sono'],
            [/\bio\s+era\b/gi, 'io ero'],
            [/\bio\s+ha\b/gi, 'io ho'],
            [/\bio\s+fa\b/gi, 'io faccio'],
            [/\bio\s+dice\b/gi, 'io dico'],
            [/\bio\s+va\b/gi, 'io vado'],
            [/\bio\s+sta\b/gi, 'io sto'],
            [/\bio\s+può\b/gi, 'io posso'],
            [/\bio\s+deve\b/gi, 'io devo'],
            [/\bio\s+vuole\b/gi, 'io voglio'],
            [/\bperche\b/gi, 'perché'],
            [/\bpiu\b/gi, 'più'],
            [/\bgia\b/gi, 'già'],
            [/\bcosi\b/gi, 'così'],
            [/\bpuo\b/gi, 'può'],
            [/\bpero\b/gi, 'però'],
            [/\bqual'è\b/gi, "qual è"],
            [/\bun\s+po\b/gi, "un po'"],
            [/\bdaccordo\b/gi, "d'accordo"],
            [/\bsopratutto\b/gi, 'soprattutto'],
            [/\bgrazie\s+mica\b/gi, 'grazie mille'],
            [/\bmica\s+grazie\b/gi, 'grazie mille'],
            [/\bsì\s+mica\b/gi, 'sì certo']
        ];
        inline.forEach(([pattern, replacement]) => {
            s = s.replace(pattern, replacement);
        });
        return s;
    }

    async correctItalianWithLanguageTool(text) {
        if (!this.languageToolEnabled || !text || text.length < 4) {
            return text;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.languageToolTimeout);

            const params = new URLSearchParams();
            params.append('text', text);
            params.append('language', 'it-IT');
            params.append('enabledOnly', 'false');
            params.append('level', 'picky');

            const response = await fetch(this.languageToolEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) return text;

            const data = await response.json();
            if (!data.matches || data.matches.length === 0) return text;

            let corrected = text;
            const matches = [...data.matches].sort((a, b) => b.offset - a.offset);

            for (const match of matches) {
                if (!match.replacements || match.replacements.length === 0) continue;

                const ruleId = match.rule?.id || '';
                const categoryId = match.rule?.category?.id || '';

                const isGrammar = categoryId === 'GRAMMAR' ||
                                  categoryId === 'TYPOS' ||
                                  categoryId === 'PUNCTUATION' ||
                                  categoryId === 'CASING' ||
                                  categoryId === 'CONFUSED_WORDS' ||
                                  categoryId === 'AGREEMENT' ||
                                  ruleId.includes('AGREEMENT') ||
                                  ruleId.includes('CONCORDANZA') ||
                                  ruleId.includes('SUBJECT_VERB');

                if (!isGrammar && categoryId !== '') continue;

                const best = match.replacements[0].value;
                corrected = corrected.slice(0, match.offset) + best + corrected.slice(match.offset + match.length);
            }

            return corrected;
        } catch (e) {
            return text;
        }
    }

    isValidItalianReply(reply) {
        if (!reply || reply.length < 2) return false;
        if (this.hasEnglishWords(reply)) return false;
        if (this.hasAbbreviations(reply)) return false;
        if (this.hasMarkdown(reply)) return false;
        if (this.isTooShort(reply)) return false;
        return true;
    }

    scoreReply(reply) {
        let score = 100;
        if (this.hasEnglishWords(reply)) score -= 60;
        if (this.hasAbbreviations(reply)) score -= 40;
        if (this.hasMarkdown(reply)) score -= 30;
        if (reply.length < 8) score -= 25;
        if (reply.length > 150) score -= 25;
        if (reply.length >= 15 && reply.length <= 100) score += 15;
        if (/[.!?]/.test(reply)) score += 5;

        const badConcordance = /\b(io)\s+(insegnano|hanno|fanno|dicono|vanno|stanno|possono|devono|vogliono)\b/i;
        if (badConcordance.test(reply)) score -= 50;

        const thirdPluralSelf = /\b(insegnano|hanno|fanno|dicono|vanno)\s+(geografia|scienze|matematica|storia|italiano|inglese|un dottorato|una laurea|un master)\b/i;
        if (thirdPluralSelf.test(reply)) score -= 50;

        const words = reply.toLowerCase().split(/\s+/).filter(Boolean);
        if (words.length > 3) {
            const unique = new Set(words);
            const ratio = unique.size / words.length;
            if (ratio < 0.5) score -= 30;
            if (ratio < 0.7) score -= 10;
        }
        if (words.length > 20) score -= 20;
        if (/^(sì|no|ok|certo|capisco|va bene)[.!]?$/i.test(reply.trim())) score -= 40;

        return score;
    }

    async generateReply(messages, temperature = 0.1) {
        const response = await this.engine.chat.completions.create({
            messages: messages,
            temperature: temperature,
            top_p: 0.8,
            top_k: 25,
            max_tokens: 80,
            stream: false,
            stop: ['\n', '}', 'Cameriera:', 'Tu:', 'NPC:', 'Utente:']
        });

        const raw = response?.choices?.[0]?.message?.content || '';
        let reply = '';

        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed.reply === 'string') reply = parsed.reply;
        } catch (e) {
            const m = raw.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"/);
            if (m) reply = m[1].replace(/\\"/g, '"').replace(/\\n/g, ' ');
            else reply = raw;
        }

        reply = this.sanitizeReply(reply);
        return reply;
    }

    async generateBestReply(messages) {
        try {
            const reply = await this.generateReply(messages, 0.1);
            if (reply && this.isValidItalianReply(reply)) {
                return reply;
            }
            const retry = await this.generateReply(messages, 0.2);
            if (retry && this.isValidItalianReply(retry)) {
                return retry;
            }
        } catch (e) {
            console.warn('[AI] generateBestReply fallita:', e);
        }
        return '';
    }

    async evaluateExchange(userMessage, npcReply) {
        if (!this.engine || !this.isModelReady) return null;
        const npcName = this.currentCustomer?.name || 'NPC';

        const lower = (userMessage || '').toLowerCase();
        const compliments = [
            'bella', 'bello', 'belli', 'belle', 'complimenti', 'brava', 'bravo',
            'gentile', 'carina', 'carino', 'simpatica', 'simpatico',
            'che bella', 'che bello', 'che carina', 'che carino',
            'mi piace', 'adoro', 'stupenda', 'stupendo',
            'bellissima', 'bellissimo', 'fantastica', 'fantastico',
            'dolce', 'preziosa', 'prezioso', 'unica', 'unico',
            'sei grande', 'sei mitica', 'sei mitico'
        ];
        const insults = [
            'stronzo', 'stronza', 'idiota', 'cretino', 'cretina',
            'brutta', 'brutto', 'schifo', 'fa schifo', 'sei una merda',
            'vaffanculo', 'cazzo', 'merda', 'puttana'
        ];
        const hasCompliment = compliments.some(w => lower.includes(w));
        const hasInsult = insults.some(w => lower.includes(w));

        let preDelta = 0;
        if (hasCompliment && !hasInsult) preDelta = 5;
        else if (hasInsult) preDelta = -8;

        const prompt = `Sei un valutatore. Ricevi UNO scambio già avvenuto tra una cameriera e un cliente. Il tuo compito è dire se la cameriera è stata gentile, educata, professionale.

SCAMBIO DA VALUTARE:
Cameriera: "${userMessage}"
${npcName}: "${npcReply}"

REGOLE:
- Se la cameriera fa complimenti, ringrazia, scherza amichevolmente, mostra interesse per il cliente: delta positivo (+3 a +8).
- Se la cameriera è neutra, breve, solo informativa: delta 0.
- Se la cameriera è scortese, insulta, ignora, risponde a monosillabi con disprezzo: delta negativo (-3 a -10).

Rispondi SOLO con questo JSON, senza altro testo prima o dopo:
{"delta": 0, "reason": "breve motivo"}`;

        try {
            const response = await this.engine.chat.completions.create({
                messages: [
                    { role: 'system', content: 'Sei un valutatore. Rispondi SOLO con il JSON richiesto, nessun testo extra, nessuna spiegazione.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 50,
                stream: false,
                stop: ['\n', '}']
            });

            const raw = response?.choices?.[0]?.message?.content || '';
            let parsed = null;
            try { parsed = JSON.parse(raw); } catch (e) {
                const m = raw.match(/\{[^{}]*"delta"[^{}]*\}/);
                if (m) { try { parsed = JSON.parse(m[0]); } catch (e2) {} }
            }

            if (parsed && typeof parsed.delta === 'number') {
                let delta = Math.round(parsed.delta);
                if (hasCompliment && !hasInsult && delta <= 0) {
                    delta = Math.max(delta, preDelta);
                }
                if (hasInsult && delta > 0) {
                    delta = Math.min(delta, preDelta);
                }
                return {
                    delta: Math.max(-10, Math.min(10, delta)),
                    reason: parsed.reason || ''
                };
            }
        } catch (e) {}

        if (preDelta !== 0) {
            return {
                delta: preDelta,
                reason: hasCompliment ? 'Complimento ricevuto' : 'Risposta scortese'
            };
        }

        return null;
    }

    async handleAIResponse(userMessage) {
        if (!this.currentCustomer) return;

        try {
            const cfg = NPC_CONFIG[this.currentCustomer.name] || {};
            const systemPrompt = this.buildIdentityPrompt(cfg, this.currentCustomer);

            const messages = [
                { role: 'system', content: systemPrompt },
                ...this.getRecentHistory()
            ];

            let reply = await this.generateBestReply(messages);

            if (!reply || !this.isValidItalianReply(reply)) {
                reply = 'Sì, capisco.';
            }

            reply = this.applyStrictGrammarCheck(reply);
            reply = this.sanitizeReply(reply);
            if (!reply || !this.isValidItalianReply(reply)) {
                reply = 'Sì, capisco.';
            }

            if (this.languageToolEnabled) {
                try {
                    const corrected = await this.correctItalianWithLanguageTool(reply);
                    if (corrected && corrected.length > 0 && corrected.length < 280) {
                        reply = this.sanitizeReply(corrected);
                        reply = this.applyStrictGrammarCheck(reply);
                    }
                } catch (e) {}
            }

            if (!reply || !this.isValidItalianReply(reply)) {
                reply = 'Sì, capisco.';
            }

            this.chatHistory.push({ role: 'assistant', content: reply });
            if (this.chatHistory.length > 6) this.chatHistory = this.chatHistory.slice(-6);

            this.appendMessage('customer', reply);

            if (this.currentMemory) this.currentMemory.addExchange(userMessage, reply);

            this._scheduleBackgroundProcessing(userMessage, reply);
        } catch (error) {
            this.appendMessage('system', '❌ Errore: ' + (error?.message || 'generazione fallita'));
        }
    }

    _scheduleBackgroundProcessing(userMessage, npcReply) {
        this._bgPending.push({ userMessage, npcReply });

        if (this._bgTimer) clearTimeout(this._bgTimer);
        this._bgTimer = setTimeout(() => {
            this._bgTimer = null;
            this._flushBackground();
        }, 6000);
    }

    async _flushBackground() {
        if (this._bgPending.length === 0) return;
        const pending = this._bgPending.splice(0);
        if (!this.currentCustomer || !this.engine || !this.isModelReady) return;

        const last = pending[pending.length - 1];
        try {
            await this.updateRelationshipFromSentiment(last.userMessage, last.npcReply);
        } catch (e) {}

        try {
            if (this.currentMemory) {
                const combined = pending.map(p => p.userMessage).join(' | ');
                await this._extractFactsBatch(combined);

                if (this.currentMemory.data.totalInteractions % 10 === 0) {
                    await this.updateSummary();
                }
            }
        } catch (e) {}
    }

    async _extractFactsBatch(userText) {
        if (!this.currentMemory || !this.engine || !this.isModelReady) return;
        try {
            const response = await this.engine.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'Estrai concetti-chiave sulla cameriera in formato "chiave: valore" separati da virgola. Es: "nome: Giulia, lavoro: cameriera, cibo_preferito: pizza". Max 3 concetti. Se non ci sono fatti nuovi rispondi "NESSUNO".'
                    },
                    { role: 'user', content: userText }
                ],
                temperature: 0.1,
                max_tokens: 50,
                stream: false,
                stop: ['\n']
            });
            const factsText = response?.choices?.[0]?.message?.content || '';
            if (factsText && !factsText.toUpperCase().includes('NESSUNO')) {
                factsText.split(',').map(f => f.trim())
                    .filter(f => f.length > 3 && f.length < 80)
                    .forEach(fact => {
                        if (!this.currentMemory.reinforceConcept(fact)) {
                            this.currentMemory.addConcept(fact);
                        }
                    });
            }
        } catch (e) {}
    }

    async updateRelationshipFromSentiment(userMessage, npcReply) {
        if (!this.currentCustomer) return;
        const evaluation = await this.evaluateExchange(userMessage, npcReply);
        if (!evaluation) return;

        const delta = evaluation.delta;
        if (typeof this.currentCustomer.relationScore !== 'number') {
            this.currentCustomer.relationScore = 50;
        }
        this.currentCustomer.relationScore = Math.max(0, Math.min(100, this.currentCustomer.relationScore + delta));

        const relationEl = document.getElementById('ai-chat-relation');
        if (relationEl) relationEl.textContent = `${Math.floor(this.currentCustomer.relationScore)}%`;

        if (delta > 0) this.appendMessage('system', `❤️ +${delta} Sintonia`);
        else if (delta < 0) this.appendMessage('system', `💔 ${delta} Sintonia`);
        else this.appendMessage('system', `➖ 0 Sintonia`);

        if (evaluation.reason) this.appendMessage('system', `📝 ${evaluation.reason}`);

        if (this.currentMemory) this.currentMemory.setRelationship(this.currentCustomer.relationScore);

        if (this.currentCustomer.name === 'Marco' && this.currentCustomer.relationScore <= 0) this.handleBreakup();
        else if (this.currentCustomer.name === 'Elena' && this.currentCustomer.relationScore >= 100) this.handleAdoptionReady();
        else if (this.currentCustomer.name === 'Andrea' && this.currentCustomer.relationScore >= 100) this.handleTechTips();
    }

    async updateMemoryAsync(userMessage, npcReply) {
        this._scheduleBackgroundProcessing(userMessage, npcReply);
    }

    async updateSummary() {
        if (!this.currentMemory || !this.engine) return;
        const facts = this.currentMemory.data.facts;
        if (facts.length < 5) return;

        const factsText = facts.map(f => f.text).join(', ');

        try {
            const response = await this.engine.chat.completions.create({
                messages: [
                    { role: 'system', content: 'Comprimi questi concetti in una frase di massimo 20 parole, in italiano.' },
                    { role: 'user', content: factsText }
                ],
                temperature: 0.2,
                max_tokens: 60,
                stream: false
            });

            const summary = response?.choices?.[0]?.message?.content || '';
            if (summary && summary.length > 10) {
                this.currentMemory.setSummary(summary);
                this.currentMemory.data.facts = [];
                this.currentMemory.save();
            }
        } catch (e) {}
    }

    handleBreakup() {
        if (this.scene?.scene) {
            this.scene.scene.showFloatingText(400, 200, '💔 MARCO TI HA LASCIATA! GAME OVER!', '#e74c3c');
            this.scene.scene.gameActive = false;
            setTimeout(() => this.scene.scene.start('GameOver'), 2000);
        }
    }

    handleAdoptionReady() {
        if (this.scene?.scene) this.scene.scene.showFloatingText(400, 200, '👶 Elena vuole parlarti di Ludovica!', '#ffd700');
    }

    handleTechTips() {
        if (this.scene?.scene) this.scene.scene.showFloatingText(400, 200, '💡 Andrea: "Posso ottimizzare il tuo sistema di prenotazioni!"', '#2ecc71');
    }

    appendMessage(sender, text) {
        const log = document.getElementById('ai-chat-log');
        if (!log) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.textContent = sender === 'system' ? `[Sistema]: ${text}` : text;
        log.appendChild(msgDiv);
        log.scrollTop = log.scrollHeight;
    }

    destroy() {
        this.closeChat();
        if (this._loadingClock) { clearInterval(this._loadingClock); this._loadingClock = null; }
        if (this._bgTimer) { clearTimeout(this._bgTimer); this._bgTimer = null; }
        this._bgPending = [];
        this.engine = null;
        this.webllm = null;
        this.currentCustomer = null;
        this.currentMemory = null;
        this.isModelReady = false;
        this.isAIActive = false;
        this.chatHistory = [];
        this.npcMemories = {};
        const loading = document.getElementById('ai-loading-screen');
        if (loading) loading.remove();
        const chat = document.getElementById('ai-chat-container');
        if (chat) chat.remove();
    }
}

window.AIDialogueManager = AIDialogueManager;
window.NPCManager = NPCManager;
window.NPC_CONFIG = NPC_CONFIG;
window.NPCMemory = NPCMemory;
window.WEBLLM_MODELS = {
    'Hermes-3-Llama-3.2-3B-q4f16_1-MLB': {
        label: 'Hermes 3 Llama 3.2 3B',
        size: '~2.3GB',
        vramRequiredMB: 2263.69
    }
};