const NPC_CONFIG = {
    'Poliziotto': {
        hasTilesheet: false,
        isCustomer: false,
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
        isCustomer: false,
        patienceMultiplier: 1.0,
        tipMultiplier: 2.0,
        orderPreference: ['Birra'],
        personality: 'Sei un uomo d\'affari losco, sicuro di te, ambiguo e molto persuasivo.',
        sensitiveTopics: ['Moroni', 'birrificio', 'affari', 'business'],
        dialogueStyles: {
            greeting: 'Ho una proposta di business importante per te.',
            order: 'Una birra. Abbiamo questioni più importanti di cui parlare.',
            happy: 'Mi piace come ragioni.',
            angry: 'Non farmi perdere tempo.',
            farewell: 'Ci rivedremo presto.'
        },
        speed: 100,
        textures: {
            front: "UomoDAffari_Avanti",
            back: "UomoDAffari_Dietro",
            left: "UomoDAffari_Sinistra",
            right: "UomoDAffari_Destra"
        },
        dialogue: "Ho una proposta di business importante per te.",
        rewardMultiplier: 2.0
    },

    'Elena': {
        hasTilesheet: false,
        isCustomer: true,
        emojiChar: '👩‍🎓',
        age: 20,
        gender: 'female',
        bio: 'Studentessa universitaria di 20 anni. Studi ECONOMIA. Ti trovi al bancone di un bar.',
        adoptTrigger: true,
        patienceMultiplier: 1.0,
        tipMultiplier: 1.0,
        orderPreference: ['Pizza', 'Patatine', 'Caffè'],
        personality: 'Sei una studentessa universitaria di Economia, solare, spontanea, espressiva e amichevole.',
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
        isCustomer: true,
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
        isCustomer: true,
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
        isCustomer: true,
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
        isCustomer: true,
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
        isCustomer: true,
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
        isCustomer: true,
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
        isCustomer: true,
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
        isCustomer: true,
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
            greeting: 'Ciao amore! Come sta andando la giornata?',
            order: 'La solita pizza, tesoro. Sai che la condividiamo.',
            happy: 'Sei la migliore! Amore mio!',
            angry: 'Tesoro, stai impiegando troppo tempo...',
            farewell: 'Ci vediamo a casa! Ti aspetto per cena!'
        }
    },

    'Anziano_Carte': {
        hasTilesheet: false,
        isCustomer: false,
        emojiChar: '🧓',
        age: 75,
        gender: 'male',
        bio: 'Un anziano appassionato di briscola.',
        patience: 0,
        bladder: 0,
        patienceMultiplier: 0,
        tipMultiplier: 0,
        orderPreference: [],
        textureUp: 'Anziano_Carte_Dietro.png',
        textureDown: 'Anziano_Carte_Avanti.png',
        textureLeft: 'Anziano_Carte_Sinistra.png',
        textureRight: 'Anziano_Carte_Destra.png'
    }
};

class LiveNewsManager {
    constructor() {
        this.latestNews = [];
        this.lastFetch = null;
    }

    async fetchLatestNews() {
        try {
            const rssUrl = encodeURIComponent('https://www.ansa.it/sito/ansait_rss.xml');
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
            const data = await res.json();

            if (data.status === 'ok' && data.items) {
                this.latestNews = data.items.slice(0, 5).map(item => ({
                    title: item.title,
                    snippet: (item.description || '').replace(/<[^>]*>?/gm, '')
                }));
                this.lastFetch = new Date();
                console.log("[News System] Notizie in tempo reale caricate:", this.latestNews);
            }
        } catch (e) {
            console.warn("[News System] Impossibile scaricare le notizie in tempo reale:", e);
        }
    }

    getNewsContext() {
        if (!this.latestNews || this.latestNews.length === 0) return "";
        const headlines = this.latestNews.map((n, i) => `${i + 1}. ${n.title}`).join(" | ");
        return `NOTIZIE REALI DI OGGI DAL MONDO: [ ${headlines} ]`;
    }
}

const newsManager = new LiveNewsManager();

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
                        return {
                            text: f,
                            timestamp: Date.now(),
                            hits: 1
                        };
                    }

                    return f;
                });

                return {
                    conversations: [],
                    facts,
                    learnedReplies: Array.isArray(parsed.learnedReplies)
                        ? parsed.learnedReplies.filter(
                            item =>
                                item &&
                                typeof item.input === 'string' &&
                                typeof item.reply === 'string'
                        )
                        : [],
                    summary: parsed.summary || '',
                    relationship:
                        typeof parsed.relationship === 'number'
                            ? parsed.relationship
                            : 50,
                    lastSeen: parsed.lastSeen || 0,
                    totalInteractions: parsed.totalInteractions || 0,
                    version: 2
                };
            }
        } catch (e) {}

        return {
            conversations: [],
            facts: [],
            learnedReplies: [],
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
            localStorage.setItem(
                this.storageKey,
                JSON.stringify(this.data)
            );
        } catch (e) {}
    }

    addExchange(userMessage, npcReply) {
        this.data.totalInteractions++;
        this.data.lastSeen = Date.now();
        this.save();
    }

    getLearnedReply(userMessage) {
        const normalizedInput =
            normalizeDialogueText(userMessage);

        const learned =
            this.data.learnedReplies || [];

        for (let i = learned.length - 1; i >= 0; i--) {
            if (
                normalizeDialogueText(learned[i].input) ===
                normalizedInput
            ) {
                return learned[i].reply;
            }
        }

        return '';
    }

    addLearnedReply(userMessage, npcReply) {
        const input = String(userMessage || '').trim();
        const reply = String(npcReply || '').trim();

        if (!input || !reply) {
            return;
        }

        const normalizedInput =
            normalizeDialogueText(input);

        this.data.learnedReplies =
            (this.data.learnedReplies || []).filter(
                item =>
                    normalizeDialogueText(item.input) !==
                    normalizedInput
            );

        this.data.learnedReplies.push({
            input,
            reply,
            timestamp: Date.now()
        });

        if (this.data.learnedReplies.length > 50) {
            this.data.learnedReplies =
                this.data.learnedReplies.slice(-50);
        }

        this.save();
    }

    addConcept(concept) {
        if (!concept || typeof concept !== 'string') return;

        const trimmed = concept.trim();

        if (trimmed.length < 3 || trimmed.length > 80) {
            return;
        }

        const lower = trimmed.toLowerCase();

        const exists = this.data.facts.some(f => {
            const fl = String(f.text || '').toLowerCase();

            return (
                fl === lower ||
                fl.includes(lower) ||
                lower.includes(fl)
            );
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
                const ageA =
                    (now - a.timestamp) /
                    (1000 * 60 * 60);

                const ageB =
                    (now - b.timestamp) /
                    (1000 * 60 * 60);

                const scoreA =
                    a.hits *
                    Math.exp(-ageA / 24);

                const scoreB =
                    b.hits *
                    Math.exp(-ageB / 24);

                return scoreB - scoreA;
            });

            this.data.facts =
                this.data.facts.slice(0, this.maxFacts);
        }

        this.save();
    }

    reinforceConcept(text) {
        if (!text) return false;

        const lower = String(text).toLowerCase();

        const found = this.data.facts.find(f => {
            const fl = String(f.text || '').toLowerCase();

            return (
                fl === lower ||
                fl.includes(lower) ||
                lower.includes(fl)
            );
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
        this.data.relationship =
            Math.max(0, Math.min(100, value));

        this.save();
    }

    getRelationship() {
        return this.data.relationship;
    }

    setSummary(summary) {
        if (!summary) return;

        this.data.summary =
            String(summary).slice(
                0,
                this.maxSummaryLength
            );

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
            const hoursAgo = Math.floor(
                (now - lastSeen) /
                (1000 * 60 * 60)
            );

            if (hoursAgo > 24) {
                parts.push(
                    `(${Math.floor(hoursAgo / 24)}g fa)`
                );
            } else if (hoursAgo > 0) {
                parts.push(`(${hoursAgo}h fa)`);
            }
        }

        if (this.data.summary) {
            parts.push(this.data.summary);
        }

        if (this.data.facts.length > 0) {
            const sorted = [...this.data.facts].sort(
                (a, b) => {
                    const ageA =
                        (now - a.timestamp) /
                        (1000 * 60 * 60);

                    const ageB =
                        (now - b.timestamp) /
                        (1000 * 60 * 60);

                    return (
                        b.hits *
                            Math.exp(-ageB / 24) -
                        a.hits *
                            Math.exp(-ageA / 24)
                    );
                }
            );

            parts.push(
                sorted
                    .slice(0, 5)
                    .map(f => f.text)
                    .join(' · ')
            );
        }

        return parts
            .join(' | ')
            .slice(0, 280);
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
            totalInteractions:
                this.data.totalInteractions,
            version: 2
        };
    }

    import(data) {
        if (!data || typeof data !== 'object') {
            return;
        }

        this.data = {
            conversations: [],
            facts: Array.isArray(data.facts)
                ? data.facts.map(f =>
                    typeof f === 'string'
                        ? {
                            text: f,
                            timestamp: Date.now(),
                            hits: 1
                        }
                        : f
                )
                : [],
            summary: data.summary || '',
            relationship:
                typeof data.relationship === 'number'
                    ? data.relationship
                    : 50,
            lastSeen: data.lastSeen || 0,
            totalInteractions:
                data.totalInteractions || 0,
            version: 2
        };

        this.save();
    }
}

function normalizeDialogueText(text) {
    return String(text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

class SentimentAnalyzer {
    constructor() {
        this.positiveWords = [
            'grazie',
            'brava',
            'ottimo',
            'perfetto',
            'amore',
            'gentile',
            'bello',
            'buono',
            'fantastico',
            'meraviglioso'
        ];

        this.negativeWords = [
            'stronzo',
            'merda',
            'cazzo',
            'idiota',
            'brutto',
            'pessimo',
            'schifo',
            'odio',
            'detesto'
        ];
    }

    analyzeSentiment(text, npcName = '') {
        const lowerText =
            String(text || '').toLowerCase();

        let score = 0;

        this.positiveWords.forEach(w => {
            if (lowerText.includes(w)) {
                score += 10;
            }
        });

        this.negativeWords.forEach(w => {
            if (lowerText.includes(w)) {
                score -= 15;
            }
        });

        score = Math.max(
            -50,
            Math.min(50, score)
        );

        return {
            score,
            sentiment: this.getSentimentLabel(score)
        };
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
    'Qwen2.5-3B-Instruct-q4f32_1-MLC': {
        label: 'Qwen 2.5 3B Instruct',
        size: '~1.8GB',
        vramRequiredMB: 2200
    }
};

class NPCManager {
    constructor(scene) {
        this.scene = scene;
        this.activeCustomers = [];
        this.relationshipScores =
            this.loadRelationships();

        this.sentimentAnalyzer =
            new SentimentAnalyzer();

        this.ludovicaAdopted =
            localStorage.getItem(
                'waitress_ludovica_adopted'
            ) === 'true';
    }

    loadRelationships() {
        try {
            const saved =
                localStorage.getItem(
                    'waitress_npc_relationships'
                );

            return saved
                ? JSON.parse(saved)
                : {};
        } catch (e) {
            return {};
        }
    }

    saveRelationships() {
        try {
            localStorage.setItem(
                'waitress_npc_relationships',
                JSON.stringify(
                    this.relationshipScores
                )
            );
        } catch (e) {}
    }

    getNPCConfig(npcName) {
        return NPC_CONFIG[npcName] || null;
    }

    getAllNPCs() {
        return Object.keys(NPC_CONFIG);
    }

    getAvailableNPCs() {
        return Object.keys(NPC_CONFIG).filter(
            npc => {
                const config = NPC_CONFIG[npc];

                if (!config || config.isCustomer !== true) {
                    return false;
                }

                if (
                    npc === 'Marco' &&
                    !this.scene.story?.storyState?.metMarco
                ) {
                    return false;
                }

                if (
                    npc === 'Andrea' &&
                    this.scene.level < 3
                ) {
                    return false;
                }

                return true;
            }
        );
    }

    spawnCustomer() {
        const available =
            this.getAvailableNPCs();

        if (available.length === 0) {
            return null;
        }

        const weights = {
            Elena: 3,
            Maria: 2,
            Francesco: 2,
            Rosa: 2,
            Sofia: 1,
            Chiara: 2,
            Massimo: 1,
            Andrea: 1,
            Marco: 1
        };

        const totalWeight =
            available.reduce(
                (sum, npc) =>
                    sum + (weights[npc] || 1),
                0
            );

        let random =
            Math.random() * totalWeight;

        let selectedNPC =
            available[0];

        for (const npc of available) {
            random -=
                weights[npc] || 1;

            if (random <= 0) {
                selectedNPC = npc;
                break;
            }
        }

        return this.createCustomer(
            selectedNPC
        );
    }

    createCustomer(npcName) {
        const config =
            NPC_CONFIG[npcName];

        if (!config || config.isCustomer !== true) {
            return null;
        }

        const allFoods = [
            'Pizza',
            'Patatine',
            'Panino',
            'Risotto',
            'Caponata',
            'Caffè',
            'Cola',
            'Acqua',
            'Birra',
            'Arancina',
            'Cassata',
            'Chinotto',
            'Cannolo',
            'Ginseng',
            'Fritto Misto',
            'Pasta al Pesto',
            'Panino con la Milza'
        ];

        const orderOptions = config.orderPreference?.length
            ? [...config.orderPreference]
            : allFoods;
        if (this.scene.sponsorSystem &&
            this.scene.sponsorSystem.hasMoroniInMenu() &&
            !orderOptions.includes('Moroni')) {
            orderOptions.push('Moroni');
        }

        const order =
            orderOptions[
                Math.floor(
                    Math.random() *
                    orderOptions.length
                )
            ];

        const memory =
            new NPCMemory(npcName);

        const initialRelation =
            memory.getRelationship();

        const customer = {
            name: npcName,
            config,
            order,
            patience:
                config.isBoyfriend
                    ? 70
                    : 100,
            bladder: 0,
            gender: config.gender,
            isInBathroom: false,
            bubbleIcon: null,
            isDead: false,
            table: null,
            relationScore:
                initialRelation,
            adoptTrigger:
                config.adoptTrigger || false,
            patienceMultiplier:
                config.patienceMultiplier || 1.0,
            bringsChild: false,
            emojiChar:
                config.emojiChar,
            hasTilesheet:
                config.hasTilesheet || false,
            tilesheetKey:
                config.key || null,
            tipMultiplier:
                config.tipMultiplier || 1.0,
            noTip:
                config.noTip || false,
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
            serve: () => {}
        };

        if (
            config.textureUp &&
            config.textureDown &&
            config.textureLeft &&
            config.textureRight
        ) {
            customer.hasDirectionalTextures =
                true;

            customer.textureUp =
                config.textureUp;

            customer.textureDown =
                config.textureDown;

            customer.textureLeft =
                config.textureLeft;

            customer.textureRight =
                config.textureRight;
        } else {
            customer.hasDirectionalTextures =
                false;
        }

        return customer;
    }

    getRelationship(npcName) {
        try {
            const memory =
                new NPCMemory(npcName);

            return memory.getRelationship();
        } catch (e) {
            return (
                this.relationshipScores[npcName] ||
                50
            );
        }
    }

    resetRelationships() {
        this.relationshipScores = {};

        localStorage.removeItem(
            'waitress_npc_relationships'
        );

        Object.keys(NPC_CONFIG).forEach(
            name => {
                try {
                    new NPCMemory(name).reset();
                } catch (e) {}
            }
        );
    }

    updateNPCDirection(
        customer,
        direction
    ) {
        if (
            !customer ||
            !customer.sprite
        ) {
            return;
        }

        if (
            customer.hasDirectionalTextures
        ) {
            const textureKey =
                customer[
                    `texture${direction}`
                ];

            if (
                textureKey &&
                this.scene.textures.exists(
                    textureKey
                )
            ) {
                customer.sprite.setTexture(
                    textureKey
                );
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
        this._destroyed = false;

        this.selectedModel = 'Qwen2.5-3B-Instruct-q4f32_1-MLC';

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

        this._replyTimeoutMs = 15000;
        this._replyMaxTokens = 40;
        this._replyGenerationActive = false;
        this._generationRequestId = 0;

        this._bgTimer = null;
        this._bgPending = [];
        this._backgroundGenerationQueue = Promise.resolve();
        this.pendingNpcReplies = {};
        this._chatSessionId = 0;

        this.npcManager = new NPCManager(scene);
        this.npcMemories = {};
        this.currentMemory = null;

        this.languageToolEndpoint = 'https://api.languagetool.org/v2/check';
        this.languageToolEnabled = false;
        this.languageToolTimeout = 2000;

        this.grammarRules = null;
        this._grammarRulesLoaded = false;
        this.dialogueDatabase = null;
        this._dialogueDatabaseLoaded = false;

        newsManager.fetchLatestNews();

        this._loadGrammarRules();
        this._loadDialogueDatabase();

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
            const response = await fetch('json/grammar_rules.json');

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

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
            console.warn('[AI] Impossibile caricare json/grammar_rules.json, uso fallback inline:', e);
            this._grammarRulesLoaded = false;
            this.grammarRules = null;
        }
    }

    async _loadDialogueDatabase() {
        try {
            const response = await fetch('json/npc_dialogues.json');

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            const database = await response.json();

            if (!database || !database.npcs || typeof database.npcs !== 'object') {
                throw new Error('Formato del database dialoghi non valido.');
            }

            this.dialogueDatabase = database;
            this._dialogueDatabaseLoaded = true;

            console.log('[AI] Database dialoghi caricato:', Object.keys(database.npcs).length, 'clienti');
        } catch (error) {
            this.dialogueDatabase = null;
            this._dialogueDatabaseLoaded = false;
            console.warn('[AI] Impossibile caricare json/npc_dialogues.json; uso i fallback inline:', error);
        }
    }

    _applyRuleSection(sectionName, text) {
        if (!this.grammarRules || !this.grammarRules[sectionName]) {
            return text;
        }

        let s = text;
        for (const [regex, replacement] of this.grammarRules[sectionName]) {
            s = s.replace(regex, replacement);
        }

        return s;
    }

    async isModelCached(modelId) {
        if (!('caches' in window)) {
            return false;
        }

        try {
            const cacheNames = await caches.keys();
            const webllmCaches = cacheNames.filter(n => n.toLowerCase().includes('webllm') || n.toLowerCase().includes('mlc'));

            for (const name of webllmCaches) {
                const cache = await caches.open(name);
                const keys = await cache.keys();

                for (const request of keys) {
                    if (request.url.includes(modelId)) {
                        return true;
                    }
                }
            }
        } catch (e) {}

        return false;
    }

    injectChatStyles() {
        if (document.getElementById('ai-chat-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'ai-chat-styles';

        style.textContent = `
            #ai-chat-container {
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: min(720px, 92vw);
                max-height: min(720px, 86vh);
                display: none;
                flex-direction: column;
                z-index: 100000;
                background: #151515;
                color: #fff;
                border: 2px solid #444;
                border-radius: 12px;
                box-shadow: 0 12px 45px rgba(0,0,0,.55);
                overflow: hidden;
                font-family: Arial, sans-serif;
            }

            #ai-chat-header {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 14px;
                background: #202020;
                border-bottom: 1px solid #383838;
                font-weight: 700;
            }

            #ai-chat-title {
                flex: 1;
            }

            #ai-chat-status {
                font-size: 12px;
                color: #9ee493;
            }

            #ai-chat-relation {
                font-size: 12px;
                color: #ffd166;
            }

            #ai-chat-close {
                cursor: pointer;
                padding: 2px 6px;
            }

            #ai-chat-log {
                flex: 1;
                min-height: 180px;
                max-height: 55vh;
                overflow-y: auto;
                padding: 14px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .ai-msg {
                max-width: 85%;
                padding: 9px 12px;
                border-radius: 10px;
                line-height: 1.35;
                white-space: pre-wrap;
                word-break: break-word;
            }

            .ai-msg.customer {
                align-self: flex-start;
                background: #2a2a2a;
            }

            .ai-msg.player {
                align-self: flex-end;
                background: #3b5ccc;
            }

            .ai-msg.system {
                align-self: center;
                color: #aaa;
                font-size: 12px;
                background: transparent;
            }

            #ai-chat-input-area {
                display: flex;
                gap: 8px;
                padding: 10px;
                border-top: 1px solid #383838;
                background: #1b1b1b;
            }

            #ai-chat-input {
                flex: 1;
                min-width: 0;
                padding: 10px;
                border: 1px solid #444;
                border-radius: 8px;
                background: #101010;
                color: #fff;
                outline: none;
            }

            #ai-chat-input:focus {
                border-color: #777;
            }

            #ai-chat-send {
                padding: 10px 16px;
                border: 0;
                border-radius: 8px;
                background: #4f6bed;
                color: white;
                cursor: pointer;
                font-weight: 700;
            }

            #ai-chat-send:disabled,
            #ai-chat-input:disabled {
                opacity: .55;
                cursor: not-allowed;
            }

            #ai-loading-screen {
                position: fixed;
                inset: 0;
                z-index: 999999;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,.82);
                color: white;
                font-family: Arial, sans-serif;
            }

            #ai-loading-box {
                width: min(600px, 90vw);
                background: #181818;
                border: 1px solid #444;
                border-radius: 14px;
                padding: 22px;
                box-shadow: 0 15px 50px rgba(0,0,0,.6);
            }

            #ai-loading-title {
                font-size: 22px;
                font-weight: 700;
                margin-bottom: 14px;
            }

            #ai-loading-percent {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 8px;
            }

            #ai-loading-track {
                width: 100%;
                height: 12px;
                background: #333;
                border-radius: 999px;
                overflow: hidden;
            }

            #ai-loading-bar {
                width: 0%;
                height: 100%;
                background: #5c7cfa;
                transition: width .15s ease;
            }

            #ai-loading-details {
                margin-top: 12px;
                color: #ccc;
                font-size: 14px;
                min-height: 40px;
            }

            #ai-loading-time {
                margin-top: 8px;
                color: #999;
                font-size: 12px;
            }

            #ai-loading-error {
                display: none;
                margin-top: 14px;
                padding: 10px;
                background: #4b1e1e;
                border: 1px solid #7b3434;
                border-radius: 8px;
                white-space: pre-wrap;
                color: #ffd4d4;
            }

            #ai-loading-close {
                display: none;
                margin-top: 14px;
                padding: 9px 14px;
                border: 0;
                border-radius: 8px;
                cursor: pointer;
            }

            #ai-streaming-reply {
                opacity: .92;
            }
        `;

        document.head.appendChild(style);
    }

    createLoadingDOM() {
        if (document.getElementById('ai-loading-screen')) {
            return;
        }

        const screen = document.createElement('div');
        screen.id = 'ai-loading-screen';

        screen.innerHTML = `
            <div id="ai-loading-box">
                <div id="ai-loading-title">🤖 Caricamento Modello IA (Qwen 2.5 3B)</div>
                <div id="ai-loading-percent">0%</div>
                <div id="ai-loading-track">
                    <div id="ai-loading-bar"></div>
                </div>
                <div id="ai-loading-details">Preparazione download WebGPU...</div>
                <div id="ai-loading-time">Tempo trascorso: 0 secondi</div>
                <div id="ai-loading-error"></div>
                <button id="ai-loading-close">Chiudi</button>
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

        if (error) {
            error.style.display = 'none';
            error.textContent = '';
        }

        if (close) {
            close.style.display = 'none';
        }

        this._loadingStartedAt = Date.now();
        this._lastProgress = 0;
        this.updateLoadingProgress(0, 'Inizializzazione motore WebGPU...');
        this.startLoadingClock();
    }

    hideLoadingScreen() {
        const screen = document.getElementById('ai-loading-screen');
        if (screen) {
            screen.style.display = 'none';
        }

        if (this._loadingClock) {
            clearInterval(this._loadingClock);
            this._loadingClock = null;
        }
    }

    startLoadingClock() {
        if (this._loadingClock) {
            clearInterval(this._loadingClock);
        }

        this._loadingClock = setInterval(() => {
            if (!this.isLoading) return;
            const elapsed = Math.floor((Date.now() - this._loadingStartedAt) / 1000);
            const time = document.getElementById('ai-loading-time');
            if (time) {
                time.textContent = `Tempo trascorso: ${elapsed} secondi`;
            }
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

        if (match && percentMatch) {
            return `${match[1]} MB scaricati · ${percentMatch[1]}% completato`;
        }

        if (/fetching param cache/i.test(value)) return 'Download file del modello in corso...';
        if (/loading/i.test(value)) return 'Caricamento nella memoria GPU...';
        if (/shader/i.test(value)) return 'Compilazione shader GPU...';

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

        if (details) details.textContent = 'Caricamento fallito.';
        if (errorBox) {
            errorBox.style.display = 'block';
            errorBox.textContent = `Impossibile caricare l'IA locale WebLLM.\n${errorMessage}`;
        }
        if (close) close.style.display = 'inline-block';

        console.error('[AI] Errore caricamento WebLLM:', error);
    }

    async initializeWebLLM(options = {}) {
        if (!this.isAIActive) return false;
        if (this.isModelReady && this.engine) return true;
        if (this._initializationPromise) return this._initializationPromise;

        this._initializationPromise = this._initializeWebLLMInternal(options);
        try {
            return await this._initializationPromise;
        } finally {
            this._initializationPromise = null;
        }
    }

    async _checkWebGPU() {
        if (typeof navigator === 'undefined' || !navigator.gpu) {
            throw new Error('WebGPU non supportato in questo browser. Usa Chrome o Edge aggiornati.');
        }

        let adapter = null;
        try {
            adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        } catch (e) {}

        if (!adapter) {
            try {
                adapter = await navigator.gpu.requestAdapter();
            } catch (e) {}
        }

        if (!adapter) {
            throw new Error('Nessuna scheda grafica compatibile con WebGPU trovata.');
        }

        return adapter;
    }

async _initializeWebLLMInternal(options = {}) {
        if (this.isLoading) return false;

        const silent = options.silent === true;
        this.isLoading = true;
        this.isModelReady = false;
        this.loadError = null;
        this._loadingCancelled = false;

        if (!silent) {
            this.showLoadingScreen();
        }


        const maxRetries = 3;
        let attempt = 0;
        let success = false;

        while (attempt < maxRetries && !success && !this._loadingCancelled) {
            attempt++;
            try {
                this.updateLoadingProgress(1, `Verifica WebGPU (Tentativo ${attempt}/${maxRetries})...`);
                await this._checkWebGPU();

                if (!this.webllm) {
                    this.webllm = await import('https://esm.run/@mlc-ai/web-llm');
                }

                this.updateLoadingProgress(5, 'Inizializzazione motore e download modello...');


                this.engine = await this.webllm.CreateMLCEngine(this.selectedModel, {
                    initProgressCallback: (report) => this.handleModelProgress(report)
                });

                success = true;
            } catch (error) {
                console.warn(`[AI] Tentativo ${attempt} fallito:`, error);
                if (attempt >= maxRetries) {
                    throw error;
                }

                await new Bun.sleep(2000).catch(() => new Promise(r => setTimeout(r, 2000)));
            }
        }

        if (!success) {
            throw new Error('Impossibile completare il download del modello dopo vari tentativi.');
        }

        this.isModelReady = true;
        this.isLoading = false;
        this.loadError = null;
        
        if (!silent) {
            setTimeout(() => this.hideLoadingScreen(), 500);
        }
        return true;
    }

    handleModelProgress(report) {
        if (!report) return;

        const rawText = report.text || report.message || '';
        let progress = Number(report.progress);

        if (!Number.isFinite(progress)) {
            progress = this.extractProgress(rawText);
        }

        if (progress <= 1 && progress > 0) {
            progress *= 100;
        }

        if (!Number.isFinite(progress)) {
            progress = this._lastProgress;
        }

        progress = Math.max(this._lastProgress, Math.min(100, progress));
        this.updateLoadingProgress(progress, rawText || 'Caricamento in corso...');
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

        const customerConfig = this.currentCustomer && NPC_CONFIG[this.currentCustomer.name];
        const canChat = this.isChatOpen && customerConfig && customerConfig.isCustomer === true;

        if (input) input.disabled = !canChat;
        if (sendBtn) sendBtn.disabled = !canChat;
    }

    createChatDOM() {
        if (document.getElementById('ai-chat-container')) {
            return;
        }

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
                <input type="text" id="ai-chat-input" placeholder="Scrivi una risposta..." autocomplete="off" disabled />
                <button id="ai-chat-send" disabled>Invia</button>
            </div>
        `;

        document.body.appendChild(container);

        container.addEventListener('pointerdown', e => e.stopPropagation());
        container.addEventListener('pointerup', e => e.stopPropagation());
        container.addEventListener('click', e => e.stopPropagation());

        document.getElementById('ai-chat-close').addEventListener('click', e => {
            e.stopPropagation();
            this.closeChat();
        });

        document.getElementById('ai-chat-send').addEventListener('click', e => {
            e.stopPropagation();
            this.sendMessage();
        });
    }

    setupKeyboardFix() {
        const chatInput = document.getElementById('ai-chat-input');
        if (!chatInput) return;

        chatInput.addEventListener('keydown', e => {
            e.stopImmediatePropagation();
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
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
                if (this._phaserKeyboardWasEnabled !== false) {
                    this.scene.input.keyboard.enabled = true;
                }
            }
        });

        window.addEventListener('keydown', e => {
            if (this._chatInputFocused) e.stopImmediatePropagation();
        }, true);

        window.addEventListener('keyup', e => {
            if (this._chatInputFocused) e.stopImmediatePropagation();
        }, true);
    }

    openChat(customer) {
        if (!customer) return;

        const customerConfig = NPC_CONFIG[customer.name];
        if (!customerConfig || customerConfig.isCustomer !== true) {
            console.warn('[AI] Conversazione rifiutata: il personaggio non è un cliente.', customer.name);
            return;
        }

        this._chatSessionId++;
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
                if (c.timerEvent && !c.timerEvent.paused) {
                    c.timerEvent.paused = true;
                    this._pausedCustomerTimers.push(c.timerEvent);
                }
                if (c.movementTimeout && !c.movementTimeout.paused) {
                    c.movementTimeout.paused = true;
                    this._pausedCustomerTimers.push(c.movementTimeout);
                }
            });
        }

        if (customer.timerEvent) customer.timerEvent.paused = false;
        if (customer.movementTimeout) customer.movementTimeout.paused = false;

        if (this.scene.waitress?.body) {
            this.scene.waitress.body.setVelocity(0, 0);
            if (typeof this.scene.waitress.body.stop === 'function') {
                this.scene.waitress.body.stop();
            }
        }

        if (this.scene.input?.keyboard) {
            this._phaserKeyboardWasEnabled = this.scene.input.keyboard.enabled;
            this.scene.input.keyboard.enabled = false;
        }

        this._chatInputFocused = true;

        this.appendMessage('system', `Inizio conversazione con ${customer.name || 'il cliente'}.`);

        const initialGreeting = customerConfig.dialogueStyles?.greeting || `Ciao! Sono ${customer.name}.`;
        this.appendMessage('customer', initialGreeting);
        this.chatHistory.push({ role: 'assistant', content: initialGreeting });

        this._showPendingReplies(customer.name);
        this.setChatControlsReady();

        if (input) {
            input.placeholder = 'Scrivi una risposta...';
            setTimeout(() => {
                input.focus();
                input.select();
            }, 150);
        }

        if (!this.isModelReady && !this.isLoading) {
            this.initializeWebLLM();
        }
    }

    closeChat() {
        const container = document.getElementById('ai-chat-container');
        if (container) container.style.display = 'none';

        if (this._pausedCustomerTimers) {
            this._pausedCustomerTimers.forEach(t => {
                if (t) t.paused = false;
            });
            this._pausedCustomerTimers = [];
        }

        if (this.scene.time) this.scene.time.paused = this._timeWasPaused;
        if (this.scene.physics && !this._physicsWasPaused) this.scene.physics.resume();

        if (this.scene.input?.keyboard && this._phaserKeyboardWasEnabled !== false) {
            this.scene.input.keyboard.enabled = true;
        }

        this._chatInputFocused = false;
        this.currentCustomer = null;
        this.currentMemory = null;
        this.isChatOpen = false;
        this.scene.gameActive = true;

        this._clearStreamingReply();
    }

    sendMessage() {
        const input = document.getElementById('ai-chat-input');
        if (!input || !this.isChatOpen || !this.currentCustomer) return;

        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this.appendMessage('player', text);
        this.chatHistory.push({ role: 'user', content: text });

        try {
            this.handleAIResponse(text);
        } catch (e) {
            this.appendMessage('system', '❌ Errore: ' + (e?.message || 'sconosciuto'));
        }

        if (this.isChatOpen) {
            setTimeout(() => input.focus(), 0);
        }
    }

    buildIdentityPrompt(cfg, customer, userMessage, memory = this.currentMemory) {
        const relationship = typeof customer.relationScore === 'number' ? Math.round(customer.relationScore) : 50;
        const memoryContext = memory ? memory.buildConceptContext() : '';
        const liveNews = newsManager.getNewsContext();

        const lowerMsg = userMessage.toLowerCase();
        const isAskingAboutNews = ["novità", "giornale", "notizie", "successo", "mondo", "oggi", "tv", "radio"].some(kw => lowerMsg.includes(kw));

        let newsInstruction = "";
        if (isAskingAboutNews && liveNews) {
            newsInstruction = `\n${liveNews}\nISTRUZIONE NOTIZIE: Il giocatore ti sta chiedendo del mondo/notizie. Mensiona BREVEMENTE una notizia di oggi esprimento un parere veloce da studentessa/personaggio.`;
        }

        return `Sei ${customer.name}, ${cfg.age || 'adulto'} anni. ${cfg.personality || 'Cliente del bar.'}
CONTESTO FISICO: Ti trovi seduta/o AL BANCONE DI UN BAR/LOCALE. Stai parlando con la cameriera.
PROFESSIONE E BIO: ${cfg.bio || 'Cliente abituale.'}
Relazione attuale: ${relationship}/100. Ordine scelto: ${customer.order || 'nessuno'}.
${memoryContext ? 'Ricordi recenti: ' + memoryContext : ''}${newsInstruction}

DIVIETI ASSOLUTI (NON VIOLARE MAI):
1. NON DIRE MAI che sei in un hotel, albergo o che devi prenotare stanze. Ti trovi in un BAR!
2. NON INVENTARE mai altre materie o professioni non presenti nella tua bio.
3. NON RISPONDERE MAI in lingua inglese. Rispondi SOLO ed ESCLUSIVAMENTE in italiano.
4. NON USARE preamboli come "Certo,", "Guarda,", "In effetti,".
5. NON SCRIVERE il tuo nome o etichette prima della frase (es. NO "Elena: ...").

REGOLE DI RISPOSTA:
- Parla in italiano fluido, naturale e diretto.
- Rispondi in prima persona ("io").
- Una sola frase breve (massimo 12-15 parole).

ESEMPI CORRETTI:
Cameriera: "Cosa ti porto?"
Risposta: "Un caffè doppio ben caldo, sto crollando sugli appunti!"

Cameriera: "Che hai fatto ultimamente?"
Risposta: "Sono stata chiusa in biblioteca tutto il giorno a studiare!"`;
    }

    getRecentHistory() {
        return this.chatHistory.slice(-4);
    }

    hasEnglishWords(text) {
        const englishWords = ['hey', 'hello', 'hi', 'ok', 'okay', 'yes', 'no problem', 'sure', 'wow', 'cool', 'sorry', 'please', 'thanks', 'thank you', 'bye', 'good', 'bad', 'nice', 'great', 'awesome', 'amazing', 'yeah', 'yep', 'nope', 'lol', 'omg', 'wtf', 'bro', 'dude', 'man', 'guys', 'love', 'like', 'hate', 'what', 'when', 'where', 'why', 'how', 'who', 'the', 'and', 'or', 'but', 'for', 'with', 'you', 'your', 'my', 'me', 'we', 'they', 'she', 'he', 'it'];
        const lower = String(text || '').toLowerCase();
        const words = lower.split(/[\s,.!?;:]+/);
        return words.some(w => englishWords.includes(w));
    }

    hasAbbreviations(text) {
        const abbrevs = ['nn', 'cmq', 'xké', 'xke', 'sn', 'dv', 'ke', 'xk', 'xkè', 'qnd', 'qlc', 'qlk', 'tt', 'tvb', 'xò', 'xo', 'cs', 'cn', 'c6'];
        const lower = String(text || '').toLowerCase();
        const words = lower.split(/[\s,.!?;:]+/);
        return words.some(w => abbrevs.includes(w));
    }

    hasMarkdown(text) {
        return /\*|_|`|#|\[|\]|\|/.test(String(text || ''));
    }

    isTooShort(text) {
        const cleaned = String(text || '').replace(/[^a-zA-ZàèéìòùÀÈÉÌÒÙ\s]/g, '').trim();
        return cleaned.length < 3;
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
        reply = reply.replace(/^(Elena|Maria|Francesco|Rosa|Sofia|Chiara|Massimo|Andrea|Marco|NPC|Personaggio|Assistente|Risposta|Reply|AI)\s*:\s*/i, '');

        reply = this.applyStrictGrammarCheck(reply);
        if (!reply) return '';

        if (reply.length > 280) {
            reply = reply.slice(0, 280);
            const lastEnd = Math.max(reply.lastIndexOf('.'), reply.lastIndexOf('!'), reply.lastIndexOf('?'));
            if (lastEnd > 40) {
                reply = reply.slice(0, lastEnd + 1);
            }
        }

        const forbidden = [
            /^come intelligenza artificiale/i,
            /^come modello linguistico/i,
            /^come assistente/i,
            /^non posso aiutarti/i,
            /^non posso rispondere/i,
            /^mi dispiace, ma non/i
        ];

        if (forbidden.some(p => p.test(reply))) {
            return '';
        }

        return reply.trim();
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

        if (s.length > 0) {
            s = s.charAt(0).toUpperCase() + s.slice(1);
        }

        if (!/[.!?…]$/.test(s)) {
            s += '.';
        }

        return s.trim();
    }

    _applyFallbackGrammarFixes(text) {
        let s = text;
        const inline = [
            [/\bio\s+insegnano\b/gi, 'io insegno'],
            [/\bio\s+hanno\b/gi, 'io ho'],
            [/\bio\s+fanno\b/gi, 'io faccio'],
            [/\bperche\b/gi, 'perché'],
            [/\bpiu\b/gi, 'più'],
            [/\bgia\b/gi, 'già'],
            [/\bcosi\b/gi, 'così'],
            [/\bpuo\b/gi, 'può'],
            [/\bpero\b/gi, 'però'],
            [/\bqual'è\b/gi, 'qual è'],
            [/\bun\s+po\b/gi, "un po'"]
        ];

        inline.forEach(([pattern, replacement]) => {
            s = s.replace(pattern, replacement);
        });

        return s;
    }

    isValidItalianReply(reply) {
        if (!reply || reply.length < 2) return false;
        if (this.hasEnglishWords(reply)) return false;
        if (this.hasAbbreviations(reply)) return false;
        if (this.hasMarkdown(reply)) return false;
        if (this.isTooShort(reply)) return false;
        return true;
    }

    async generateReply(messages, temperature = 0.6, streamToChat = true) {
        if (!this.engine || !this.isModelReady) return '';

        const requestId = ++this._generationRequestId;
        this._replyGenerationActive = true;

        let timeoutId = null;
        let timedOut = false;
        let streamedText = '';

        const interrupt = () => {
            try {
                if (this.engine && typeof this.engine.interruptGenerate === 'function') {
                    this.engine.interruptGenerate();
                }
            } catch (e) {}
        };

        try {
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                    timedOut = true;
                    interrupt();
                    reject(new Error('TIMEOUT'));
                }, this._replyTimeoutMs);
            });

            const generationPromise = (async () => {
                const response = await this.engine.chat.completions.create({
                    messages,
                    temperature,
                    top_p: 0.9,
                    max_tokens: this._replyMaxTokens,
                    stream: true
                });

                if (response && typeof response[Symbol.asyncIterator] === 'function') {
                    for await (const chunk of response) {
                        if (requestId !== this._generationRequestId) break;
                        const piece = chunk?.choices?.[0]?.delta?.content ?? '';
                        if (piece) {
                            streamedText += piece;
                            if (streamToChat) {
                                this._updateStreamingReply(streamedText);
                            }
                        }
                    }
                    return streamedText;
                }

                return response?.choices?.[0]?.message?.content || '';
            })();

            const raw = await Promise.race([generationPromise, timeoutPromise]);
            if (timeoutId) clearTimeout(timeoutId);

            return this.sanitizeReply(raw);
        } catch (e) {
            if (timeoutId) clearTimeout(timeoutId);
            console.warn('[AI] Generazione interrotta o errore:', e);
            return '';
        } finally {
            this._replyGenerationActive = false;
            this._clearStreamingReply();
        }
    }

    _updateStreamingReply(text) {
        const log = document.getElementById('ai-chat-log');
        if (!log) return;

        let div = document.getElementById('ai-streaming-reply');
        if (!div) {
            div = document.createElement('div');
            div.id = 'ai-streaming-reply';
            div.className = 'ai-msg customer';
            div.textContent = '…';
            log.appendChild(div);
        }

        const cleaned = this.sanitizeReplyForStreaming(text);
        div.textContent = cleaned || '…';
        log.scrollTop = log.scrollHeight;
    }

    _clearStreamingReply() {
        const div = document.getElementById('ai-streaming-reply');
        if (div) div.remove();
    }

    sanitizeReplyForStreaming(text) {
        if (!text) return '';
        return String(text)
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/<\|.*?\|>/g, '')
            .replace(/^(Elena|Maria|Francesco|Rosa|Sofia|Chiara|Massimo|Andrea|Marco|NPC|AI)\s*:\s*/i, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    getCachedDialogueReply(npcName, userMessage) {
        if (!this.dialogueDatabase || !this.dialogueDatabase.npcs) return '';
        const npcData = this.dialogueDatabase.npcs[npcName];
        if (!npcData || !Array.isArray(npcData.intents)) return '';

        const normalizedInput = normalizeDialogueText(userMessage);

        for (const intent of npcData.intents) {
            const matches = Array.isArray(intent.keywords) && intent.keywords.some(keyword => {
                const normalizedKeyword = normalizeDialogueText(keyword);
                return normalizedKeyword && normalizedInput.includes(normalizedKeyword);
            });

            if (matches && Array.isArray(intent.replies) && intent.replies.length > 0) {
                return intent.replies[Math.floor(Math.random() * intent.replies.length)];
            }
        }

        return '';
    }

    _showPendingReplies(npcName) {
        const pending = this.pendingNpcReplies[npcName] || [];
        for (const item of pending) {
            this.appendMessage('customer', item.reply);
            this.chatHistory.push({ role: 'assistant', content: item.reply });
        }
        delete this.pendingNpcReplies[npcName];
    }

    handleAIResponse(userMessage) {
        const customer = this.currentCustomer;
        if (!customer) return;

        const config = NPC_CONFIG[customer.name];
        if (!config || config.isCustomer !== true) return;

        const memory = this.currentMemory || this.getMemory(customer.name);
        const history = this.getRecentHistory();


        const learnedReply = memory.getLearnedReply(userMessage);
        const databaseReply = learnedReply || this.getCachedDialogueReply(customer.name, userMessage);

        if (databaseReply) {
            const reply = this.sanitizeReply(databaseReply);
            this.chatHistory.push({ role: 'assistant', content: reply });
            this.appendMessage('customer', reply);
            memory.addExchange(userMessage, reply);
            this.updateRelationshipFromSentiment(userMessage, reply);
            return;
        }


        const waitingPhrases = [
            "Mmm, fammi pensare un attimo...",
            "Fammi un secondo pensare...",
            "Aspetta, sto riflettendo..."
        ];
        const initialWaiting = waitingPhrases[Math.floor(Math.random() * waitingPhrases.length)];
        const placeholderDiv = this.appendMessage('customer', initialWaiting);

        const historyEntry = { role: 'assistant', content: initialWaiting };
        this.chatHistory.push(historyEntry);


        this._queueBackgroundReply(userMessage, customer, memory, history, placeholderDiv, historyEntry, this._chatSessionId);
    }

    async _queueBackgroundReply(userMessage, customer, memory, history, placeholder, historyEntry, chatSessionId) {
        if (!this.isAIActive) return;

        const config = NPC_CONFIG[customer.name];
        const systemPrompt = this.buildIdentityPrompt(config, customer, userMessage, memory);

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: userMessage }
        ];

        const generate = async () => {
            if (this._destroyed || !this.isAIActive) return;

            if (!this.isModelReady || !this.engine) {
                const ready = await this.initializeWebLLM({ silent: false });
                if (!ready) return;
            }

            const rawReply = await this.generateReply(messages, 0.6, true);
            const corrected = this.sanitizeReply(rawReply);

            if (!corrected || !this.isValidItalianReply(corrected)) return;

            memory.addLearnedReply(userMessage, corrected);

            if (this.isChatOpen && this._chatSessionId === chatSessionId && this.currentCustomer === customer && placeholder && placeholder.isConnected) {
                placeholder.textContent = corrected;
                historyEntry.content = corrected;
                return;
            }

            if (!this.pendingNpcReplies[customer.name]) {
                this.pendingNpcReplies[customer.name] = [];
            }

            this.pendingNpcReplies[customer.name].push({ userMessage, reply: corrected });
        };

        this._backgroundGenerationQueue = this._backgroundGenerationQueue.then(generate).catch(e => {
            console.error('[AI] Errore generazione asincrona:', e);
        });
    }

    extractFactsDeterministically(userText) {
        if (!this.currentMemory || !userText) return;
        const text = String(userText).trim();
        if (!text) return;

        const patterns = [
            { regex: /\bmi chiamo\s+([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'-]{1,24})/i, format: m => `nome: ${m[1]}` },
            { regex: /\bsono\s+(?:un|una)\s+([A-Za-zÀ-ÖØ-öø-ÿ' -]{2,35})/i, format: m => `professione: ${m[1].trim()}` },
            { regex: /\blavoro\s+(?:come|da)\s+([A-Za-zÀ-ÖØ-öø-ÿ' -]{2,35})/i, format: m => `lavoro: ${m[1].trim()}` }
        ];

        for (const item of patterns) {
            const match = text.match(item.regex);
            if (!match) continue;
            const fact = item.format(match).trim();
            if (fact.length >= 4 && fact.length <= 80) {
                if (!this.currentMemory.reinforceConcept(fact)) {
                    this.currentMemory.addConcept(fact);
                }
            }
        }
    }

    updateRelationshipFromSentiment(userMessage, npcReply) {
        if (!this.currentCustomer) return;

        const lower = String(userMessage || '').toLowerCase();
        let delta = 0;

        if (/\b(grazie|gentile|bello|brava|ottimo)\b/i.test(lower)) delta = 5;
        if (/\b(stronzo|idiota|brutto|schifo)\b/i.test(lower)) delta = -8;

        if (typeof this.currentCustomer.relationScore !== 'number') {
            this.currentCustomer.relationScore = 50;
        }

        this.currentCustomer.relationScore = Math.max(0, Math.min(100, this.currentCustomer.relationScore + delta));

        const relationEl = document.getElementById('ai-chat-relation');
        if (relationEl) relationEl.textContent = `${Math.floor(this.currentCustomer.relationScore)}%`;

        if (this.currentMemory) {
            this.currentMemory.setRelationship(this.currentCustomer.relationScore);
        }
    }

    appendMessage(sender, text) {
        const log = document.getElementById('ai-chat-log');
        if (!log) return;

        if (sender === 'customer') {
            this._clearStreamingReply();
        }

        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.textContent = sender === 'system' ? `[Sistema]: ${text}` : text;

        log.appendChild(msgDiv);
        log.scrollTop = log.scrollHeight;

        return msgDiv;
    }

    destroy() {
        this._destroyed = true;
        this.closeChat();
        if (this._loadingClock) clearInterval(this._loadingClock);
        this.engine = null;
        this.webllm = null;
        this.isModelReady = false;
        this.isAIActive = false;

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
window.WEBLLM_MODELS = WEBLLM_MODELS;