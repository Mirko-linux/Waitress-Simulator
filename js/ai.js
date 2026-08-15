// ============================================================================
// THE WAITRESS - SISTEMA DI DIALOGO AI (WEBLLM - LATO BROWSER CON TOGGLE)
// File: ai.js - VERSIONE DIALOGO NATURALE
// ============================================================================

class AIDialogueManager {
    constructor(scene) {
        this.scene = scene;
        this.currentCustomer = null;
        this.chatHistory = [];
        this.engine = null;
        this.isLoading = false;
        this.isModelReady = false;
        this.useFallback = false;
        this.isChatOpen = false;
        
        this.injectChatStyles();
        this.createChatDOM();
        this.setupKeyboardFix();
        
        this.checkAISetting();
    }

    checkAISetting() {
        let savedSetting = true;
        try {
            const raw = localStorage.getItem('waitress_save_data');
            if (raw) {
                const data = JSON.parse(raw);
                if (data.settings && typeof data.settings.aiEnabled === 'boolean') {
                    savedSetting = data.settings.aiEnabled;
                }
            }
        } catch(e) {}

        const isAIEnabled = (window.GAME && window.GAME.settings && typeof window.GAME.settings.aiEnabled === 'boolean') 
                            ? window.GAME.settings.aiEnabled 
                            : savedSetting;

        if (!isAIEnabled) {
            console.log("🔇 AI disattivata. Uso modalità classica.");
            this.useFallback = true;
            this.isModelReady = true;
            this.appendMessage("system", "💬 Modalità dialogo classico attiva.");
        } else {
            console.log("🧠 AI attivata. Avvio caricamento modello...");
            this.initializeWebLLM();
        }
    }

    async initializeWebLLM() {
        try {
            this.isLoading = true;
            this.appendMessage("system", "⏳ Caricando il modello di Intelligenza Artificiale (1-2 minuti)...");

            const webllm = await import('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm');

            // --- MODELLO SPECIALIZZATO PER DIALOGHI ---
            // Llama-3.2-1B-Instruct è ottimo per risposte brevi e naturali
            const selectedModel = "Llama-3-8B-Instruct-q4f16_1-MLC";
            
            this.engine = await webllm.CreateMLCEngine(selectedModel, {
                initProgressCallback: (report) => {
                    this.updateLoadingStatus(report.text);
                }
            });

            this.isModelReady = true;
            this.isLoading = false;
            this.appendMessage("system", "✅ AI pronta! Puoi parlare con i clienti.");
        } catch (error) {
            console.error("❌ Errore caricamento WebLLM:", error);
            this.useFallback = true;
            this.isModelReady = true;
            this.appendMessage("system", "⚠️ Impossibile caricare il modello AI. Attivata modalità classica.");
        }
    }

    updateLoadingStatus(text) {
        const log = document.getElementById("ai-chat-log");
        if (!log) return;
        let lastMsg = log.lastElementChild;
        if (lastMsg && lastMsg.classList.contains("system-loading")) {
            lastMsg.textContent = `[Sistema]: ${text}`;
        } else {
            const msgDiv = document.createElement("div");
            msgDiv.className = "ai-msg system system-loading";
            msgDiv.textContent = `[Sistema]: ${text}`;
            log.appendChild(msgDiv);
        }
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
            }
            #ai-chat-log {
                flex: 1;
                padding: 10px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 8px;
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
            }
            #ai-chat-input-area {
                display: flex;
                padding: 10px;
                background: rgba(0,0,0,0.3);
                gap: 6px;
            }
            #ai-chat-input {
                flex: 1;
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid #eccc68;
                background: #2f3542;
                color: #fff;
                outline: none;
            }
            #ai-chat-send {
                padding: 8px 14px;
                background: #2ed573;
                color: #fff;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
            }
            #ai-chat-send:hover {
                background: #26af5f;
            }
            #ai-chat-close {
                cursor: pointer;
                font-weight: bold;
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
        this.currentCustomer = customer;
        this.chatHistory = [];

        const container = document.getElementById("ai-chat-container");
        const log = document.getElementById("ai-chat-log");
        const title = document.getElementById("ai-chat-title");
        const relation = document.getElementById("ai-chat-relation");

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

        // Messaggio iniziale personalizzato in base al piatto
        const initialGreeting = `Ciao! Sono ${customer.name}. Ho sentito parlare molto del vostro ${customer.order || "cibo"}.`;
        this.appendMessage("customer", initialGreeting);
        this.chatHistory.push({ role: "assistant", content: initialGreeting });

        setTimeout(() => {
            const input = document.getElementById("ai-chat-input");
            if (input) input.focus();
        }, 100);
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
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        input.value = "";
        this.appendMessage("player", text);
        this.chatHistory.push({ role: "user", content: text });

        if (this.useFallback || !this.engine) {
            this.handleFallbackResponse(text);
        } else {
            await this.handleAIResponse(text);
        }
    }

    async handleAIResponse(userMessage) {
        if (!this.currentCustomer) return;

        try {
            // --- FIX: PROMPT DI SISTEMA MOLTO STRINGENTE ---
            // Forziamo l'AI a parlare come un cliente, non come un professore.
            const systemPrompt = `Sei ${this.currentCustomer.name}, un cliente di un ristorante. 
Stai parlando con la cameriera.
Regole ASSOLUTE:
- Rispondi SEMPRE in italiano, in modo naturale e colloquiale.
- Rispondi con MASSIMO 1 o 2 frasi brevi.
- Non fare elenchi, non usare numeri, non usare asterischi.
- Non spiegare cose, non fare da insegnante. Sii un semplice cliente che chiacchiera.
- Se ti chiedono del cibo, rispondi che ti piace o che hai fame.
- Non parlare di te in terza persona. Usa "io".`;

            const messages = [
                { role: "system", content: systemPrompt },
                ...this.chatHistory
            ];

            const response = await this.engine.chat.completions.create({
                messages,
                temperature: 0.7,
                max_tokens: 60 // Più basso = risposte più brevi e dirette
            });

            const reply = response.choices[0].message.content.trim();
            
            // Pulizia finale: rimuove eventuali doppi spazi o caratteri strani
            const cleanReply = reply.replace(/\*/g, '').replace(/[0-9]+\./g, '').trim();
            
            this.chatHistory.push({ role: "assistant", content: cleanReply });
            this.appendMessage("customer", cleanReply);
            this.updateRelationship(5, "Ottima risposta!");
        } catch (err) {
            console.error("Errore generazione risposta AI:", err);
            this.handleFallbackResponse(userMessage);
        }
    }

    handleFallbackResponse(userMessage) {
        // Risposte di fallback molto più naturali
        const responses = [
            "Mmmh, mi piace molto come parli!",
            "Sì, il cibo qui è davvero buono.",
            "Che bello chiacchierare con te!",
            "Hai ragione, sai sempre cosa dire.",
            "Mi fai sentire a mio agio.",
            "Spero di tornare presto qui."
        ];
        const randomReply = responses[Math.floor(Math.random() * responses.length)];

        setTimeout(() => {
            this.appendMessage("customer", randomReply);
            this.updateRelationship(3, "Risposta ricevuta");
        }, 500);
    }

    updateRelationship(delta, feedback) {
        if (!this.currentCustomer) return;

        if (typeof this.currentCustomer.relationScore !== "number") {
            this.currentCustomer.relationScore = 50;
        }

        this.currentCustomer.relationScore = Phaser.Math.Clamp(this.currentCustomer.relationScore + delta, 0, 100);
        document.getElementById("ai-chat-relation").textContent = `${Math.floor(this.currentCustomer.relationScore)}%`;

        const infoText = `[Sistema]: ${feedback} (+${delta} Sintonia)`;
        this.appendMessage("system", infoText);

        if (this.scene.showFloatingText) {
            this.scene.showFloatingText(
                this.currentCustomer.x, 
                this.currentCustomer.y - 45, 
                `❤️ +${delta} Sintonia`, 
                "#ff4757"
            );
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
}

window.AIDialogueManager = AIDialogueManager;