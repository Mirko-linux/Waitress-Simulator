const NPC_CONFIG = {
    'Elena': {
        hasTilesheet: false,
        emojiChar: '👩‍🎓',
        age: 20,
        gender: 'female',
        bio: 'Studentessa universitaria sui 20 anni. Gentile ma incasinata con gli studi.',
        adoptTrigger: true,
        patienceMultiplier: 1.0,
        tipMultiplier: 1.0,
        orderPreference: ['Pizza', 'Patatine', 'Caffè'],
        personality: 'Sei una studentessa universitaria gentile e amichevole. Parli dei tuoi studi e dei tuoi problemi finanziari.',
        sensitiveTopics: ['studi', 'esami', 'soldi', 'tasse'],
        dialogueStyles: {
            greeting: 'Ciao! Come vanno gli studi?',
            order: 'Prendo un po\' di cibo, ho fame dopo le lezioni.',
            happy: 'Grazie mille! Sei sempre gentile!',
            angry: 'Oh no, sto morendo di fame qui!',
            farewell: 'A dopo! Devo andare a studiare.'
        },
        // TEXTURE DIREZIONALI
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
        personality: 'Sei una donna attiva che ama la bicicletta. Parli dei tuoi giri in bici e della tua passione per lo sport.',
        sensitiveTopics: ['bici', 'sport', 'velocità'],
        dialogueStyles: {
            greeting: 'Ciao! Ho appena finito un giro in bici!',
            order: 'Ho fame dopo la pedalata!',
            happy: 'Che brava cameriera!',
            angry: 'Ho fame, mi serve il cibo!',
            farewell: 'Devo andare, ho un altro giro in programma!'
        },
        // TEXTURE DIREZIONALI
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
        bio: 'Ragazzo innamorato della cameriera che cerca di corteggiarla.',
        patienceMultiplier: 0.5,
        tipMultiplier: 1.5,
        orderPreference: ['Caffè', 'Cannolo', 'Ginseng'],
        personality: 'Sei un ragazzo elegante e affascinante innamorato della cameriera. Cerca di far colpo con complimenti e attenzioni romantiche.',
        sensitiveTopics: ['amore', 'bellezza', 'relazione'],
        dialogueStyles: {
            greeting: 'Ciao bellissima! Sei ancora più bella oggi!',
            order: 'Prendo quello che mi consigli tu, amore mio.',
            happy: 'Per te farei qualsiasi cosa!',
            angry: 'Aspetto da tanto, tesoro...',
            farewell: 'Arrivederci, splendore! Ci vediamo presto!'
        },
        // TEXTURE DIREZIONALI
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
        bio: 'Anziana signora di 80 anni, molto gentile e prodiga di consigli.',
        patienceMultiplier: 1.3,
        tipMultiplier: 0.8,
        orderPreference: ['Cassata', 'Caffè', 'Cannolo'],
        personality: 'Sei un\'anziana signora di 80 anni. Racconti storie strane e ripetitive. A volte dimentichi di aver già detto le cose. Parli delle tue soap opera e dei tuoi giochi di carte.',
        sensitiveTopics: ['età', 'memoria', 'vecchiaia'],
        dialogueStyles: {
            greeting: 'Oh, cara! Come stai oggi? Sai, ai miei tempi...',
            order: 'Vorrei qualcosa di dolce, come la mia vecchia cassata!',
            happy: 'Che gentile! Sei come mia nipote!',
            angry: 'Sono vecchia, non farmi aspettare troppo!',
            farewell: 'A presto, cara! Ti racconterò di nuovo la storia del mio gatto!'
        },
        // TEXTURE DIREZIONALI
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
        bio: 'Ricchissima imprenditrice milanese, snob e altezzosa ma molto esigente.',
        patienceMultiplier: 0.7,
        tipMultiplier: 2.0,
        orderPreference: ['Risotto', 'Birra', 'Fritto Misto'],
        personality: 'Sei una ricchissima imprenditrice milanese, snob e altezzosa. Ti lamenti dei prezzi ma paghi bene. Sei molto esigente sulla qualità.',
        sensitiveTopics: ['prezzi', 'qualità', 'lusso'],
        dialogueStyles: {
            greeting: 'Spero che il servizio sia all\'altezza della mia posizione.',
            order: 'Vorrei il risotto, spero che non sia come quello della mensa.',
            happy: 'Accettabile. Non male per un posto del genere.',
            angry: 'Questo è inaccettabile! Voglio parlare con il direttore!',
            farewell: 'Spero di non dover tornare in un posto così... o forse sì.'
        },
        // TEXTURE DIREZIONALI
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
        personality: 'Sei una madre di famiglia che lavora come insegnante. Parli dei tuoi studenti e dei tuoi figli.',
        sensitiveTopics: ['scuola', 'figli', 'lavoro'],
        dialogueStyles: {
            greeting: 'Buongiorno! Ho appena finito di correggere compiti.',
            order: 'Qualcosa di veloce, ho poco tempo prima di tornare a scuola.',
            happy: 'Grazie! Sei sempre così efficiente!',
            angry: 'Mi dispiace ma devo tornare a lavorare!',
            farewell: 'Arrivederci! Domani ho una riunione con i genitori.'
        },
        // TEXTURE DIREZIONALI
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
        personality: 'Sei un ingegnere edile di mezza età, scorbutico e cinico. Parli di lavoro, cemento, e ti lamenti dei giovani d\'oggi.',
        sensitiveTopics: ['lavoro', 'giovani', 'politica'],
        dialogueStyles: {
            greeting: 'Boh, speriamo che il servizio sia decente.',
            order: 'Una birra e un panino. E sbrigati.',
            happy: 'Mmmh, non male. Forse tornerò.',
            angry: 'Perché ci metti così tanto? Al cantiere sarei già andato via!',
            farewell: 'Vabbè, a dopo. Se il cibo era buono, tornerò.'
        },
        // TEXTURE DIREZIONALI
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
        bio: 'Programmatore informatico, esperto di tecnologia. Se raggiungi alta sintonia, darà consigli utili.',
        patienceMultiplier: 1.0,
        tipMultiplier: 1.2,
        orderPreference: ['Caffè', 'Risotto', 'Cola'],
        personality: 'Sei un programmatore informatico esperto. Parli di tecnologia, coding, IA. Sei appassionato e parli con entusiasmo.',
        sensitiveTopics: ['tecnologia', 'coding', 'IA'],
        dialogueStyles: {
            greeting: 'Ciao! Stavo facendo debugging di un\'app, ho bisogno di carburante.',
            order: 'Un caffè doppio, per favore. Devo stare sveglio.',
            happy: 'Ottimo! A proposito, se ti servono consigli tech, chiedimi!',
            angry: 'Il tempo di caricamento è troppo lungo... come il mio debug!',
            farewell: 'A dopo! Devo ottimizzare il codice di un progetto.'
        },
        // TEXTURE DIREZIONALI
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
        bio: 'Il tuo fidanzato. Non lascia mance. Se la sintonia scende a 0, game over.',
        isBoyfriend: true,
        noTip: true,
        patienceMultiplier: 1.5,
        tipMultiplier: 0,
        orderPreference: ['Pizza', 'Birra', 'Patatine'],
        personality: 'Sei il fidanzato della cameriera. Sei affettuoso ma distratto. Non lasci mance perché è il conto cointestato.',
        sensitiveTopics: ['relazione', 'amore', 'tradimento'],
        dialogueStyles: {
            greeting: 'Ciao amore! Come è andata la giornata?',
            order: 'La solita pizza, tesoro. Sai che la condividiamo.',
            happy: 'Sei la migliore! Amore mio!',
            angry: 'Tesoro, stai impiegando troppo tempo...',
            farewell: 'Ci vediamo a casa! Ti aspetto per cena!'
        },
        // TEXTURE DIREZIONALI
        textureUp: 'Marco_Dietro.png',
        textureDown: 'Marco_Avanti.png',
        textureLeft: 'Marco_Sinistra.png',
        textureRight: 'Marco_Destra.png'
    }
};

// ============================================================
// SENTIMENT ANALYZER - Analizza il tono dei messaggi
// ============================================================
class SentimentAnalyzer {
    constructor() {
        // Parole positive
        this.positiveWords = [
            'grazie', 'brava', 'ottimo', 'perfetto', 'amore', 'gentile', 'bello',
            'buono', 'fantastico', 'meraviglioso', 'adoro', 'piaci', 'carino',
            'simpatico', 'eccellente', 'delizioso', 'splendido', 'migliore',
            'ciao', 'salve', 'buongiorno', 'buonasera', 'come stai', 'bene',
            'complimenti', 'ti amo', 'ti adoro', 'sei fantastica', 'sei brava',
            'aiuto', 'per favore', 'ti prego', 'vorrei', 'desidero', 'posso'
        ];
        
        // Parole negative
        this.negativeWords = [
            'stronzo', 'merda', 'cazzo', 'idiota', 'brutto', 'pessimo', 'schifo',
            'odio', 'detesto', 'insopportabile', 'fastidioso', 'lento', 'incapace',
            'maleducato', 'maleducata', 'orribile', 'terribile', 'puzza', 'sporco',
            'vaffanculo', 'cretino', 'stupido', 'ridicolo', 'patetico', 'disastro',
            'vergogna', 'scandaloso', 'inaccettabile', 'vergognati', 'lasciami',
            'vai via', 'non mi rompere', 'non seccarmi', 'smettila', 'basta',
            'taci', 'zitto', 'brutta', 'pessima', 'odiare', 'spreco', 'inutile'
        ];
        
        // Parole neutre/domande
        this.neutralPhrases = [
            'come', 'cosa', 'quanto', 'dove', 'quando', 'perché', 'perche',
            'chi', 'quale', 'puoi', 'potresti', 'vorrei sapere', 'mi chiedo',
            'che ne pensi', 'sai', 'dimmi', 'raccontami', 'spiegami'
        ];
        
        // Domande specifiche per NPC
        this.contextPhrases = {
            'Elena': ['studi', 'università', 'esami', 'prof', 'lezione'],
            'Maria': ['bici', 'bicicletta', 'ciclismo', 'mountain bike', 'pedalata'],
            'Francesco': ['amore', 'bella', 'bellezza', 'appuntamento', 'uscita'],
            'Rosa': ['storia', 'racconto', 'vecchi', 'passato', 'nipoti'],
            'Sofia': ['milano', 'lavoro', 'affari', 'design', 'moda'],
            'Chiara': ['scuola', 'studenti', 'figli', 'insegnamento'],
            'Massimo': ['lavoro', 'cantieri', 'edilizia', 'cemento'],
            'Andrea': ['computer', 'coding', 'programmazione', 'tech', 'app'],
            'Marco': ['amore', 'relazione', 'fidanzamento', 'casa']
        };
    }

    analyzeSentiment(text, npcName = '') {
        const lowerText = text.toLowerCase();
        
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;
        
        // Conta parole positive
        this.positiveWords.forEach(word => {
            if (lowerText.includes(word)) positiveCount++;
        });
        
        // Conta parole negative
        this.negativeWords.forEach(word => {
            if (lowerText.includes(word)) negativeCount++;
        });
        
        // Conta frasi neutre
        this.neutralPhrases.forEach(phrase => {
            if (lowerText.includes(phrase)) neutralCount++;
        });
        
        // Conta parole specifiche per NPC
        let npcContextCount = 0;
        if (npcName && this.contextPhrases[npcName]) {
            this.contextPhrases[npcName].forEach(phrase => {
                if (lowerText.includes(phrase)) npcContextCount++;
            });
        }
        
        // Calcola punteggio
        let score = 0;
        score += positiveCount * 10;
        score -= negativeCount * 15;
        score += neutralCount * 2;
        score += npcContextCount * 8;
        
        // Normalizza
        if (score > 50) score = 50;
        if (score < -50) score = -50;
        
        return {
            score: score,
            sentiment: this.getSentimentLabel(score),
            positiveCount: positiveCount,
            negativeCount: negativeCount,
            neutralCount: neutralCount,
            npcContextCount: npcContextCount,
            isQuestion: neutralCount > 0
        };
    }

    getSentimentLabel(score) {
        if (score >= 20) return 'very_positive';
        if (score >= 5) return 'positive';
        if (score > -5) return 'neutral';
        if (score > -20) return 'negative';
        return 'very_negative';
    }

    getSentimentMultiplier(sentiment) {
        switch(sentiment) {
            case 'very_positive': return 2.0;
            case 'positive': return 1.5;
            case 'neutral': return 0.5;
            case 'negative': return -1.5;
            case 'very_negative': return -3.0;
            default: return 0.5;
        }
    }

    getSentimentMessage(sentiment) {
        const messages = {
            'very_positive': '✨ Hai fatto un\'ottima impressione!',
            'positive': '👍 Il cliente è soddisfatto!',
            'neutral': '🗣️ Conversazione neutrale...',
            'negative': '😒 Il cliente non è contento...',
            'very_negative': '😡 Hai offeso il cliente!'
        };
        return messages[sentiment] || '';
    }
}

// ============================================================
// MODELLI WEBLLM DISPONIBILI
// ============================================================
const WEBLLM_MODELS = {
    // Modelli piccoli e veloci
    'Llama-3.2-1B-Instruct-q4f16_1-MLC': { 
        label: 'Llama 3.2 1B (Piccolo e veloce)',
        size: '~1GB'
    },
    'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC': { 
        label: 'TinyLlama 1.1B (Molto veloce)',
        size: '~0.8GB'
    },
    'Qwen2.5-0.5B-Instruct-q4f16_1-MLC': { 
        label: 'Qwen2.5 0.5B (Ultra leggero)',
        size: '~0.4GB'
    },
    'Phi-2.7-q4f16_1-MLC': { 
        label: 'Phi 2.7 (Piccolo)',
        size: '~1.5GB'
    },
    'SmolLM2-1.7B-Instruct-q4f16_1-MLC': { 
        label: 'SmolLM2 1.7B (Piccolo)',
        size: '~1.2GB'
    },
    'Llama-3.2-3B-Instruct-q4f16_1-MLC': { 
        label: 'Llama 3.2 3B (Medio)',
        size: '~2.5GB'
    },
    'Qwen2.5-1.5B-Instruct-q4f16_1-MLC': { 
        label: 'Qwen2.5 1.5B (Medio-leggero)',
        size: '~1.2GB'
    },
    // Modelli più grandi ma più intelligenti
    'Qwen2.5-7B-Instruct-q4f16_1-MLC': { 
        label: 'Qwen2.5 7B (Grande, consigliato)',
        size: '~4.5GB'
    },
    'Mistral-7B-Instruct-v0.3-q4f16_1-MLC': { 
        label: 'Mistral 7B (Grande e intelligente)',
        size: '~4.5GB'
    },
    'Llama-3.1-8B-Instruct-q4f16_1-MLC': { 
        label: 'Llama 3.1 8B (Grande, molto intelligente)',
        size: '~5GB'
    },
    'Gemma-2-2b-it-q4f16_1-MLC': { 
        label: 'Gemma 2 2B (Medio)',
        size: '~1.5GB'
    },
    'Gemma-2-2B-Instruct-q4f16_1-MLC': { 
        label: 'Gemma 2 2B Instruct (Medio)',
        size: '~1.5GB'
    }
};

// ============================================================
// CLASSE NPC MANAGER
// ============================================================
class NPCManager {
    constructor(scene) {
        this.scene = scene;
        this.activeCustomers = [];
        this.relationshipScores = this.loadRelationships();
        this.sentimentAnalyzer = new SentimentAnalyzer();
        
        // Carica stato adozione Ludovica
        this.ludovicaAdopted = localStorage.getItem('waitress_ludovica_adopted') === 'true';
        this.marcoRelationship = this.relationshipScores['Marco'] || 50;
    }

    loadRelationships() {
        try {
            const saved = localStorage.getItem('waitress_npc_relationships');
            return saved ? JSON.parse(saved) : {};
        } catch(e) {
            return {};
        }
    }

    saveRelationships() {
        localStorage.setItem('waitress_npc_relationships', JSON.stringify(this.relationshipScores));
    }

    getNPCConfig(npcName) {
        return NPC_CONFIG[npcName] || null;
    }

    getAllNPCs() {
        return Object.keys(NPC_CONFIG);
    }

    getAvailableNPCs() {
        return Object.keys(NPC_CONFIG).filter(npc => {
            if (npc === 'Marco' && !this.scene.story?.storyState?.metMarco) return false;
            if (npc === 'Andrea' && this.scene.level < 3) return false; // Andrea appare dal livello 3
            return true;
        });
    }

    spawnCustomer() {
        const available = this.getAvailableNPCs();
        if (available.length === 0) return null;

        // Pesi di spawn (NPC più comuni appaiono più spesso)
        const weights = {
            'Elena': 3, 'Maria': 2, 'Francesco': 2, 'Rosa': 2,
            'Sofia': 1, 'Chiara': 2, 'Massimo': 1, 'Andrea': 1, 'Marco': 1
        };

        const totalWeight = available.reduce((sum, npc) => sum + (weights[npc] || 1), 0);
        let random = Math.random() * totalWeight;
        
        let selectedNPC = available[0];
        for (const npc of available) {
            random -= (weights[npc] || 1);
            if (random <= 0) {
                selectedNPC = npc;
                break;
            }
        }

        return this.createCustomer(selectedNPC);
    }

    createCustomer(npcName) {
        const config = NPC_CONFIG[npcName];
        if (!config) return null;

        // Scegli un ordine preferito o casuale
        const allFoods = ['Pizza', 'Patatine', 'Panino', 'Risotto', 'Caponata', 'Caffè', 'Cola', 'Acqua', 'Birra', 'Arancina', 'Cassata', 'Chinotto', 'Cannolo', 'Ginseng', 'Fritto Misto', 'Pasta al Pesto', 'Panino con la Milza'];
        const order = config.orderPreference && config.orderPreference.length > 0 
            ? config.orderPreference[Math.floor(Math.random() * config.orderPreference.length)]
            : allFoods[Math.floor(Math.random() * allFoods.length)];

        // Sintonia iniziale
        const initialRelation = this.relationshipScores[npcName] || 50;

        const customer = {
            name: npcName,
            config: config,
            order: order,
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
            serve: () => {
            }
        };

        // AGGIUNGI QUESTE RIGHE PER SUPPORTO TEXTURE DIREZIONALI
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

    // NUOVO METODO: Aggiorna relazione basandosi sul sentiment
    updateRelationshipFromMessage(npcName, userMessage) {
        const npcConfig = NPC_CONFIG[npcName];
        if (!npcConfig) return { delta: 0, sentiment: 'neutral', message: '' };
        
        // Analizza il sentiment del messaggio
        const sentimentResult = this.sentimentAnalyzer.analyzeSentiment(userMessage, npcName);
        
        // Calcola il delta in base al sentiment
        const sentimentMultiplier = this.sentimentAnalyzer.getSentimentMultiplier(sentimentResult.sentiment);
        const baseDelta = 5;
        let delta = Math.round(baseDelta * sentimentMultiplier);
        
        // Bonus per domande specifiche su argomenti sensibili
        if (sentimentResult.npcContextCount > 0) {
            delta += 3;
        }
        
        // Penalità per parlare di argomenti sensibili in modo negativo
        const lowerMessage = userMessage.toLowerCase();
        if (npcConfig.sensitiveTopics && npcConfig.sensitiveTopics.some(topic => lowerMessage.includes(topic))) {
            if (sentimentResult.sentiment === 'negative' || sentimentResult.sentiment === 'very_negative') {
                delta -= 5;
            }
        }
        
        // Aggiorna relazione
        if (!this.relationshipScores[npcName]) {
            this.relationshipScores[npcName] = 50;
        }
        
        this.relationshipScores[npcName] = Phaser.Math.Clamp(
            this.relationshipScores[npcName] + delta, 0, 100
        );
        
        this.saveRelationships();
        
        // Controlli speciali
        if (npcName === 'Marco' && this.relationshipScores[npcName] <= 0) {
            return { delta: delta, sentiment: sentimentResult.sentiment, specialEvent: 'BREAKUP' };
        }
        
        if (npcName === 'Elena' && this.relationshipScores[npcName] >= 100) {
            return { delta: delta, sentiment: sentimentResult.sentiment, specialEvent: 'ADOPTION_READY' };
        }
        
        if (npcName === 'Andrea' && this.relationshipScores[npcName] >= 100) {
            return { delta: delta, sentiment: sentimentResult.sentiment, specialEvent: 'TECH_TIPS' };
        }
        
        return { 
            delta: delta, 
            sentiment: sentimentResult.sentiment,
            sentimentMessage: this.sentimentAnalyzer.getSentimentMessage(sentimentResult.sentiment)
        };
    }

    getRelationship(npcName) {
        return this.relationshipScores[npcName] || 50;
    }

    adoptLudovica() {
        this.ludovicaAdopted = true;
        localStorage.setItem('waitress_ludovica_adopted', 'true');
        if (this.scene.scene) {
            this.scene.scene.showFloatingText(400, 200, '👶 Ludovica è arrivata a casa!', '#2ecc71');
        }
    }

    resetRelationships() {
        this.relationshipScores = {};
        localStorage.removeItem('waitress_npc_relationships');
    }
    
    // NUOVO METODO: Aggiorna la direzione del cliente
    updateNPCDirection(customer, direction) {
        if (!customer || !customer.sprite) return;
        
        // Se ha texture direzionali, cambia la texture
        if (customer.hasDirectionalTextures) {
            const textureKey = customer[`texture${direction}`];
            if (textureKey && this.scene.textures.exists(textureKey)) {
                customer.sprite.setTexture(textureKey);
            }
        }
        
        // Altrimenti, se ha uno sprite sheet, usa le animazioni
        else if (customer.tilesheetKey && this.scene.anims.exists(`${customer.tilesheetKey}_${direction}`)) {
            customer.sprite.play(`${customer.tilesheetKey}_${direction}`);
        }
    }
}

// ============================================================
// CLASSE AI DIALOGUE MANAGER
// ============================================================
class AIDialogueManager {
    constructor(scene, enabled = true) {
        this.scene = scene;
        this.currentCustomer = null;
        this.chatHistory = [];
        this.engine = null;
        this.isLoading = false;
        this.isModelReady = false;
        this.useFallback = true;
        this.isChatOpen = false;
        this.isAIActive = enabled;
        this.loadingStarted = false;
        this.loadingComplete = false;
        this.selectedModel = null;
        
        // NPC Manager
        this.npcManager = new NPCManager(scene);
        
        // --- SISTEMA DI CONTESTO TEMPORALE/ECONOMICO ---
        this.currentDate = new Date();
        this.currentContext = this.generateWorldContext();
        // -------------------------------------------------
        
        this.injectChatStyles();
        this.createChatDOM();
        this.setupKeyboardFix();
        
        if (this.isAIActive) {
            console.log("AI attivata. Inizializzazione in corso...");
            this.initializeWebLLM();
        } else {
            console.log("AI disattivata");
            this.useFallback = true;
            this.isModelReady = true;
            this.appendMessage("system", "💬 Modalità dialogo classico attiva.");
        }
    }

    // --- GENERA IL CONTESTO DEL MONDO (Notizie, inflazione, ecc) ---
    generateWorldContext() {
        const now = new Date();
        const mese = now.toLocaleDateString('it-IT', { month: 'long' });
        const anno = now.getFullYear();
        
        // Inflazione simulata ma "realistica" per il periodo attuale
        const inflazione = (1.2 + (Math.sin(now.getDate() / 10) * 0.5)).toFixed(1);
        
        // Prezzo benzina simulato (fluttua ogni giorno)
        const prezzoBenzina = (1.65 + (Math.cos(now.getDate() / 5) * 0.08)).toFixed(2);
        
        // Situazione geopolitica simulata
        const contestoMondiale = {
            'gennaio': "Inizio anno con tensioni commerciali globali.",
            'febbraio': "Sciopero dei trasporti in Europa.",
            'marzo': "Crisi energetica in Medio Oriente.",
            'aprile': "Aumento dei tassi di interesse da parte della BCE.",
            'maggio': "Proteste degli agricoltori in Italia.",
            'giugno': "Turismo in forte aumento, prezzi alle stelle.",
            'luglio': "Ondata di caldo record, raccolti in sofferenza.",
            'agosto': "Vacanze, i ristoranti sono pieni ma il personale scarseggia.",
            'settembre': "Rialzo dei prezzi del grano.",
            'ottobre': "Black Friday anticipato, consumatori attenti al risparmio.",
            'novembre': "Rallentamento economico, le famiglie spendono meno.",
            'dicembre': "Regali di Natale, cene fuori sempre più costose."
        };
        
        let notiziaMese = contestoMondiale[mese] || "Situazione economica stabile.";
        
        // Simula un evento geopolitico importante (es. Stretto di Hormuz)
        const eventiGeopolitici = [
            "Il transito nel Mar Rosso e nello Stretto di Hormuz è rallentato, facendo salire i costi del trasporto marittimo.",
            "Le tensioni in Medio Oriente stanno facendo aumentare il prezzo del petrolio.",
            "L'Unione Europea sta discutendo nuove sanzioni economiche, i prezzi dell'energia sono instabili.",
            "La guerra in Ucraina continua a influenzare i prezzi del grano.",
            "La crisi del Mar Rosso sta causando ritardi nelle consegne."
        ];
        
        const eventoCasuale = eventiGeopolitici[Math.floor(Math.random() * eventiGeopolitici.length)];
        
        return `${mese} ${anno} - Inflazione: ${inflazione}% - Benzina: ${prezzoBenzina}€/L - ${notiziaMese} - ${eventoCasuale}`;
    }
    // -------------------------------------------------------------------------

    async initializeWebLLM() {
        if (this.loadingStarted) return;
        this.loadingStarted = true;
        
        try {
            this.isLoading = true;
            this.useFallback = false;
            this.appendMessage("system", "⏳ Caricamento modello AI in corso...");

            await new Promise(resolve => {
                if (window.requestIdleCallback) {
                    requestIdleCallback(resolve);
                } else {
                    setTimeout(resolve, 100);
                }
            });

            let webllm;
            try {
                webllm = await import('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm');
            } catch (importError) {
                console.warn("⚠️ Import WebLLM fallito, uso fallback:", importError);
                this.useFallback = true;
                this.isModelReady = true;
                this.isLoading = false;
                this.appendMessage("system", "⚠️ Modalità classica attiva (import fallito).");
                return;
            }

            // Modello predefinito: TinyLlama è piccolo e veloce
            const defaultModel = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC";
            
            const loadTimeout = setTimeout(() => {
                if (!this.engine) {
                    console.warn("⏰ Timeout caricamento AI, attivo fallback");
                    this.useFallback = true;
                    this.isModelReady = true;
                    this.isLoading = false;
                    this.appendMessage("system", "⏰ Timeout caricamento. Modalità classica.");
                }
            }, 45000);

            try {
                this.engine = await webllm.CreateMLCEngine(defaultModel, {
                    initProgressCallback: (report) => {
                        this.updateLoadingStatus(report.text);
                    }
                });
            } catch (modelError) {
                console.warn(`⚠️ Modello ${defaultModel} non disponibile, provo con Qwen2.5-0.5B...`, modelError);
                
                try {
                    this.engine = await webllm.CreateMLCEngine("Qwen2.5-0.5B-Instruct-q4f16_1-MLC", {
                        initProgressCallback: (report) => {
                            this.updateLoadingStatus(report.text);
                        }
                    });
                } catch (modelError2) {
                    console.warn(`⚠️ Modello Qwen2.5-0.5B non disponibile, provo con Llama-3.2-1B...`, modelError2);
                    
                    this.engine = await webllm.CreateMLCEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC", {
                        initProgressCallback: (report) => {
                            this.updateLoadingStatus(report.text);
                        }
                    });
                }
            }

            clearTimeout(loadTimeout);
            this.isModelReady = true;
            this.isLoading = false;
            this.loadingComplete = true;
            this.useFallback = false;
            this.appendMessage("system", "✅ AI pronta! Puoi parlare con i clienti.");
            console.log("✅ AI WebLLM caricata con successo!");
            
        } catch (error) {
            console.error("❌ Errore caricamento WebLLM:", error);
            this.useFallback = true;
            this.isModelReady = true;
            this.isLoading = false;
            this.loadingStarted = false;
            this.appendMessage("system", "⚠️ Impossibile caricare il modello AI. Attivata modalità classica.");
        }
    }

    updateLoadingStatus(text) {
        const log = document.getElementById("ai-chat-log");
        if (!log) return;
        
        const loadingMessages = log.querySelectorAll('.system-loading');
        loadingMessages.forEach(el => el.remove());
        
        const msgDiv = document.createElement("div");
        msgDiv.className = "ai-msg system system-loading";
        msgDiv.textContent = `⏳ ${text}`;
        log.appendChild(msgDiv);
        log.scrollTop = log.scrollHeight;
    }

    injectChatStyles() {
        if (document.getElementById("ai-chat-styles")) return;
        const style = document.createElement("style");
        style.id = "ai-chat-styles";
        style.textContent = `
            #ai-chat-container {
                position: absolute;
                bottom: 20px;
                right: 20px;
                width: 320px;
                height: 400px;
                background: rgba(20, 10, 5, 0.92);
                border: 3px solid #eccc68;
                border-radius: 12px;
                display: none;
                flex-direction: column;
                font-family: 'Fredoka', 'Segoe UI', sans-serif;
                box-shadow: 0 8px 24px rgba(0,0,0,0.6);
                z-index: 1000;
                overflow: hidden;
            }
            #ai-chat-header {
                background: #2ed573;
                color: #fff;
                padding: 10px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #eccc68;
                flex-shrink: 0;
            }
            #ai-chat-log {
                flex: 1;
                padding: 10px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-height: 0;
            }
            .ai-msg {
                padding: 8px 12px;
                border-radius: 8px;
                max-width: 85%;
                font-size: 14px;
                line-height: 1.3;
                word-wrap: break-word;
            }
            .ai-msg.customer {
                background: #ffa502;
                color: #2f3542;
                align-self: flex-start;
            }
            .ai-msg.player {
                background: #70a1ff;
                color: #fff;
                align-self: flex-end;
            }
            .ai-msg.system {
                background: rgba(255,255,255,0.1);
                color: #eccc68;
                align-self: center;
                font-size: 12px;
                text-align: center;
                max-width: 95%;
            }
            .ai-msg.system.system-loading {
                background: rgba(46, 204, 113, 0.15);
                color: #2ed573;
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            #ai-chat-input-area {
                display: flex;
                padding: 10px;
                background: rgba(0,0,0,0.3);
                gap: 6px;
                flex-shrink: 0;
            }
            #ai-chat-input {
                flex: 1;
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid #eccc68;
                background: #2f3542;
                color: #fff;
                outline: none;
                font-family: 'Fredoka', sans-serif;
            }
            #ai-chat-input::placeholder {
                color: #888;
            }
            #ai-chat-send {
                padding: 8px 14px;
                background: #2ed573;
                color: #fff;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-family: 'Fredoka', sans-serif;
            }
            #ai-chat-send:hover {
                background: #26af5f;
            }
            #ai-chat-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            #ai-chat-close {
                cursor: pointer;
                font-weight: bold;
                padding: 0 8px;
                font-size: 18px;
            }
            #ai-chat-close:hover {
                color: #ff6b6b;
            }
            #ai-chat-relation {
                background: rgba(0,0,0,0.3);
                padding: 2px 10px;
                border-radius: 12px;
                font-size: 13px;
            }
        `;
        document.head.appendChild(style);
    }

    createChatDOM() {
        if (document.getElementById("ai-chat-container")) return;

        const container = document.createElement("div");
        container.id = "ai-chat-container";
        container.innerHTML = `
            <div id="ai-chat-header">
                <span id="ai-chat-title">💬 Conversazione</span>
                <span id="ai-chat-relation">50%</span>
                <span id="ai-chat-close">✖</span>
            </div>
            <div id="ai-chat-log"></div>
            <div id="ai-chat-input-area">
                <input type="text" id="ai-chat-input" placeholder="Scrivi una risposta..." autocomplete="off" />
                <button id="ai-chat-send">Invia</button>
            </div>
        `;

        document.body.appendChild(container);

        document.getElementById("ai-chat-close").addEventListener("click", () => this.closeChat());
        document.getElementById("ai-chat-send").addEventListener("click", () => this.sendMessage());
    }

    setupKeyboardFix() {
        const chatInput = document.getElementById("ai-chat-input");
        if (!chatInput) return;

        chatInput.addEventListener("keydown", (e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
                e.preventDefault();
                this.sendMessage();
            }
        });

        chatInput.addEventListener("focus", () => {
            if (this.scene && this.scene.input && this.scene.input.keyboard) {
                this.scene.input.keyboard.enabled = false;
            }
        });

        chatInput.addEventListener("blur", () => {
            if (this.scene && this.scene.input && this.scene.input.keyboard) {
                this.scene.input.keyboard.enabled = true;
            }
        });
    }

    openChat(customer) {
        if (!customer) return;
        
        this.currentCustomer = customer;
        this.chatHistory = [];

        const container = document.getElementById("ai-chat-container");
        const log = document.getElementById("ai-chat-log");
        const title = document.getElementById("ai-chat-title");
        const relation = document.getElementById("ai-chat-relation");
        const input = document.getElementById("ai-chat-input");
        const sendBtn = document.getElementById("ai-chat-send");

        if (!container || !log) return;

        log.innerHTML = "";
        container.style.display = "flex";
        title.textContent = `💬 ${customer.name || "Cliente"}`;
        
        const score = typeof customer.relationScore === "number" ? customer.relationScore : 50;
        relation.textContent = `${Math.floor(score)}%`;

        this.isChatOpen = true;
        this.scene.gameActive = false;
        if (this.scene.input && this.scene.input.keyboard) {
            this.scene.input.keyboard.enabled = false;
        }

        this.appendMessage("system", `Inizio conversazione con ${customer.name || "il cliente"}.`);

        const config = NPC_CONFIG[customer.name] || {};
        const initialGreeting = config.dialogueStyles?.greeting || 
            `Ciao! Sono ${customer.name}. Ho sentito parlare molto del vostro ${customer.order || "cibo"}.`;
        
        this.appendMessage("customer", initialGreeting);
        this.chatHistory.push({ role: "assistant", content: initialGreeting });

        if (input && sendBtn) {
            const isAIReady = !this.isLoading && this.isModelReady && !this.useFallback;
            input.disabled = !isAIReady && !this.useFallback;
            sendBtn.disabled = !isAIReady && !this.useFallback;
            if (isAIReady || this.useFallback) {
                setTimeout(() => input.focus(), 200);
            }
        }
    }

    closeChat() {
        const container = document.getElementById("ai-chat-container");
        if (container) container.style.display = "none";
        this.currentCustomer = null;

        this.isChatOpen = false;
        this.scene.gameActive = true;
        if (this.scene.input && this.scene.input.keyboard) {
            this.scene.input.keyboard.enabled = true;
        }
    }

    async sendMessage() {
        const input = document.getElementById("ai-chat-input");
        const sendBtn = document.getElementById("ai-chat-send");
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        input.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
        input.value = "";

        this.appendMessage("player", text);
        this.chatHistory.push({ role: "user", content: text });

        try {
            if (this.useFallback || !this.engine || !this.isModelReady) {
                await this.handleFallbackResponse(text);
            } else {
                await this.handleAIResponse(text);
            }
        } catch (e) {
            console.error("Errore durante invio messaggio:", e);
            await this.handleFallbackResponse(text);
        } finally {
            input.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            if (!this.isChatOpen) return;
            setTimeout(() => input.focus(), 100);
        }
    }

    async handleAIResponse(userMessage) {
        if (!this.currentCustomer) return;

        try {
            // --- CONTESTO AGGIORNATO: INFLazione, prezzo benzina, data, notizie ---
            const dynamicContext = `Oggi è ${this.currentDate.toLocaleDateString('it-IT')}. ${this.currentContext}`;
            // -------------------------------------------------------------

            const customerConfig = NPC_CONFIG[this.currentCustomer.name] || {};
            const personality = customerConfig.personality || 
                "Sei un cliente normale di un ristorante. Parla in modo naturale.";

            const systemPrompt = `Sei ${this.currentCustomer.name}, un cliente di un ristorante. 
${personality}

Regole ASSOLUTE:
- Rispondi SEMPRE in italiano, in modo naturale e colloquiale.
- Rispondi con MASSIMO 1 o 2 frasi brevi.
- Non fare elenchi, non usare numeri, non usare asterischi.
- Non spiegare cose, non fare da insegnante. Sii un semplice cliente che chiacchiera.
- Se ti chiedono del cibo, rispondi che ti piace o che hai fame.
- Non parlare di te in terza persona. Usa "io".
- **IMPORTANTE**: Se il cliente fa riferimento a temi di attualità (inflazione, benzina, economia), usa il seguente contesto per essere coerente: ${dynamicContext}`;

            const messages = [
                { role: "system", content: systemPrompt },
                ...this.chatHistory
            ];

            const responsePromise = this.engine.chat.completions.create({
                messages,
                temperature: 0.7,
                max_tokens: 60
            });

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Timeout risposta AI")), 8000);
            });

            const response = await Promise.race([responsePromise, timeoutPromise]);
            const reply = response.choices[0].message.content.trim();
            
            const cleanReply = reply.replace(/\*/g, '').replace(/[0-9]+\./g, '').trim();
            
            this.chatHistory.push({ role: "assistant", content: cleanReply });
            this.appendMessage("customer", cleanReply);
            
            // AGGIORNATO: Usa il sentiment per aggiornare la relazione
            this.updateRelationshipFromSentiment(userMessage);
            
        } catch (err) {
            console.warn("Errore generazione risposta AI:", err);
            await this.handleFallbackResponse(userMessage);
        }
    }

    async handleFallbackResponse(userMessage) {
        if (!this.currentCustomer) return;

        // --- FALLBACK CONTESTUALIZZATO ---
        const config = NPC_CONFIG[this.currentCustomer.name] || {};
        const styles = config.dialogueStyles || {};
        
        // Estrai valori dal contesto per risposte realistiche
        let inflazione = "3";
        let benzina = "1.70";
        if (this.currentContext.includes('Inflazione')) {
            const match = this.currentContext.match(/Inflazione: ([0-9.]+)%/);
            if (match) inflazione = match[1];
        }
        if (this.currentContext.includes('Benzina')) {
            const match = this.currentContext.match(/Benzina: ([0-9.]+)€/);
            if (match) benzina = match[1];
        }

        // Risposte specifiche per NPC
        const specificReplies = {
            'Elena': [
                `Scusa, stavo pensando ai miei esami... ${userMessage}?`,
                `Sai, con l'inflazione al ${inflazione}% non so come farò con le tasse universitarie!`,
                "Ho appena finito un esame, ho bisogno di carburante!"
            ],
            'Maria': [
                `Ho fatto ${Math.floor(Math.random() * 30) + 10} km in bici oggi! ${userMessage}?`,
                `Con la benzina a ${benzina}€, meglio la bici!`,
                "Che bella pedalata stamattina! Ora ho una fame!"
            ],
            'Francesco': [
                `Tesoro, la tua bellezza illumina la stanza! ${userMessage}?`,
                "Non mi interessa l'inflazione, mi interessa solo il tuo sorriso!",
                "Per te farei qualsiasi cosa, anche pagare il conto!"
            ],
            'Rosa': [
                `Ai miei tempi tutto costava meno... ${userMessage}?`,
                `Sai, una volta ho visto un gatto parlante! E con l'inflazione al ${inflazione}%...`,
                "Che bello vederti, cara! Vuoi sentire la storia del mio canarino?"
            ],
            'Sofia': [
                `Spero che il servizio sia all'altezza, con l'inflazione al ${inflazione}% pago per qualità!`,
                `${userMessage}? A Milano abbiamo standard più alti.`,
                "Questo posto è accettabile, ma non come i ristoranti che frequento di solito."
            ],
            'Chiara': [
                `Ho corretto 50 compiti oggi! ${userMessage}?`,
                "Spero che il cibo sia veloce, ho una riunione tra poco.",
                `Con la benzina a ${benzina}€, dovrò ridurre i viaggi a scuola.`
            ],
            'Massimo': [
                `Al cantiere non aspetteremmo così tanto... ${userMessage}?`,
                "Che fastidio, l'inflazione colpisce tutti tranne i giovani d'oggi.",
                "Vabbè, speriamo che il cibo sia decente almeno."
            ],
            'Andrea': [
                `Stavo ottimizzando un algoritmo e ho avuto fame! ${userMessage}?`,
                `Sai che l'IA può prevedere l'inflazione? ${inflazione}% oggi!`,
                "Ho bisogno di caffeina per il debugging! Ho un bug da fixare."
            ],
            'Marco': [
                `Ciao amore! ${userMessage}?`,
                "Tesoro, sai che non ti lasciare mai la mancia... è il conto cointestato!",
                "Stasera ti porto fuori, okay? Ora però dammi da mangiare!"
            ]
        };

        const replies = specificReplies[this.currentCustomer.name] || [
            `Mmmh, ${userMessage}? Con l'inflazione al ${inflazione}%, ormai si spende un occhio della testa!`,
            `Ho notato che la benzina è di nuovo salita a ${benzina}€... meno male che il cibo qui è ancora buono!`,
            "Che ansia, il costo della vita aumenta ogni mese. Meno male che ci sono posti come questo."
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
        
        if (this.isChatOpen) {
            this.appendMessage("customer", randomReply);
            
            // AGGIORNATO: Usa il sentiment per aggiornare la relazione
            this.updateRelationshipFromSentiment(userMessage);
        }
    }

    // NUOVO METODO: Aggiorna relazione basandosi sul sentiment del messaggio
    updateRelationshipFromSentiment(userMessage) {
        if (!this.currentCustomer) return;
        
        // Usa il NPCManager per analizzare il sentiment
        const result = this.npcManager.updateRelationshipFromMessage(
            this.currentCustomer.name,
            userMessage
        );
        
        const delta = result.delta;
        const sentiment = result.sentiment;
        
        // Aggiorna relazione del cliente corrente
        if (typeof this.currentCustomer.relationScore !== "number") {
            this.currentCustomer.relationScore = 50;
        }
        
        this.currentCustomer.relationScore = Phaser.Math.Clamp(
            this.currentCustomer.relationScore + delta, 0, 100
        );
        
        const relationEl = document.getElementById("ai-chat-relation");
        if (relationEl) {
            relationEl.textContent = `${Math.floor(this.currentCustomer.relationScore)}%`;
        }

        // Mostra messaggio di sistema
        if (result.sentimentMessage) {
            this.appendMessage("system", result.sentimentMessage);
        }
        
        // Mostra feedback
        if (delta > 0) {
            this.appendMessage("system", `❤️ +${delta} Sintonia`);
        } else if (delta < 0) {
            this.appendMessage("system", `💔 ${delta} Sintonia`);
        } else {
            this.appendMessage("system", "⚖️ Nessun cambiamento significativo");
        }

        if (this.scene && this.scene.showFloatingText) {
            const color = delta > 0 ? "#ff4757" : (delta < 0 ? "#e74c3c" : "#f39c12");
            const icon = delta > 0 ? "❤️" : (delta < 0 ? "💔" : "⚖️");
            this.scene.showFloatingText(
                this.currentCustomer.table?.x || this.currentCustomer.x || 300,
                (this.currentCustomer.table?.y || this.currentCustomer.y || 300) - 45,
                `${icon} ${delta > 0 ? '+' : ''}${delta} Sintonia`,
                color
            );
        }

        // Gestisci eventi speciali
        if (result.specialEvent === 'BREAKUP') {
            this.handleBreakup();
        } else if (result.specialEvent === 'ADOPTION_READY') {
            this.handleAdoptionReady();
        } else if (result.specialEvent === 'TECH_TIPS') {
            this.handleTechTips();
        }
    }

    handleBreakup() {
        if (this.scene && this.scene.scene) {
            this.scene.scene.showFloatingText(400, 200, '💔 MARCO TI HA LASCIATA! GAME OVER!', '#e74c3c');
            this.scene.scene.gameActive = false;
            
            setTimeout(() => {
                this.scene.scene.scene.start('GameOver');
            }, 2000);
        }
    }

    handleAdoptionReady() {
        if (this.scene && this.scene.scene) {
            this.scene.scene.showFloatingText(400, 200, '👶 Elena vuole parlarti di Ludovica!', '#ffd700');
        }
    }

    handleTechTips() {
        if (this.scene && this.scene.scene) {
            this.scene.scene.showFloatingText(400, 200, '💡 Andrea: "Posso ottimizzare il tuo sistema di prenotazioni!"', '#2ecc71');
        }
    }

    appendMessage(sender, text) {
        const log = document.getElementById("ai-chat-log");
        if (!log) return;
        
        const msgDiv = document.createElement("div");
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.textContent = sender === "system" ? `[Sistema]: ${text}` : text;
        
        log.appendChild(msgDiv);
        log.scrollTop = log.scrollHeight;
    }

    destroy() {
        this.closeChat();
        this.engine = null;
        this.currentCustomer = null;
        this.isModelReady = false;
        this.useFallback = true;
        this.isAIActive = false;
    }
}

// Esponi le classi globalmente
window.NPCManager = NPCManager;
window.NPC_CONFIG = NPC_CONFIG;
window.WEBLLM_MODELS = WEBLLM_MODELS;