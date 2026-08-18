class AIDialogueManager {
    constructor(scene, enabled = true) {
        this.scene = scene;
        this.currentCustomer = null;
        this.chatHistory = [];
        this.engine = null;
        this.isLoading = false;
        this.isModelReady = false;
        this.useFallback = true; // default a true per evitare blocchi
        this.isChatOpen = false;
        this.isAIActive = enabled;
        this.loadingStarted = false;
        this.loadingComplete = false;
        
        this.injectChatStyles();
        this.createChatDOM();
        this.setupKeyboardFix();
        
        // Solo se AI attiva, avvia il caricamento in modo asincrono non bloccante
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

    async initializeWebLLM() {
        // Evita caricamenti multipli
        if (this.loadingStarted) return;
        this.loadingStarted = true;
        
        try {
            this.isLoading = true;
            this.useFallback = false;
            this.appendMessage("system", "⏳ Caricamento modello AI in corso...");

            // CARICAMENTO ASINCRONO CON requestIdleCallback per non bloccare il game loop
            await new Promise(resolve => {
                if (window.requestIdleCallback) {
                    requestIdleCallback(resolve);
                } else {
                    setTimeout(resolve, 100);
                }
            });

            // Import dinamico con fallback
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

            // Modello più leggero per risposte veloci
            const selectedModel = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
            
            // Timeout per evitare blocchi infiniti
            const loadTimeout = setTimeout(() => {
                if (!this.engine) {
                    console.warn("⏰ Timeout caricamento AI, attivo fallback");
                    this.useFallback = true;
                    this.isModelReady = true;
                    this.isLoading = false;
                    this.appendMessage("system", "⏰ Timeout caricamento. Modalità classica.");
                }
            }, 30000);

            this.engine = await webllm.CreateMLCEngine(selectedModel, {
                initProgressCallback: (report) => {
                    this.updateLoadingStatus(report.text);
                }
            });

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
        
        // Rimuovi vecchi messaggi di caricamento
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

        // Messaggio iniziale personalizzato
        const initialGreeting = `Ciao! Sono ${customer.name}. Ho sentito parlare molto del vostro ${customer.order || "cibo"}.`;
        this.appendMessage("customer", initialGreeting);
        this.chatHistory.push({ role: "assistant", content: initialGreeting });

        // Abilita/disabilita input in base allo stato AI
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

        // Disabilita input durante l'elaborazione
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
            // Riabilita input
            input.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            if (!this.isChatOpen) return;
            setTimeout(() => input.focus(), 100);
        }
    }

    async handleAIResponse(userMessage) {
        if (!this.currentCustomer) return;

        try {
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

            // Timeout per la risposta
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
            this.updateRelationship(5, "Ottima risposta!");
            
        } catch (err) {
            console.warn("Errore generazione risposta AI:", err);
            await this.handleFallbackResponse(userMessage);
        }
    }

    async handleFallbackResponse(userMessage) {
        // Risposte di fallback naturali
        const responses = [
            "Mmmh, mi piace molto come parli!",
            "Sì, il cibo qui è davvero buono.",
            "Che bello chiacchierare con te!",
            "Hai ragione, sai sempre cosa dire.",
            "Mi fai sentire a mio agio.",
            "Spero di tornare presto qui.",
            "Che bella giornata oggi, vero?",
            "Il tuo servizio è fantastico!"
        ];
        const randomReply = responses[Math.floor(Math.random() * responses.length)];

        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
        
        if (this.isChatOpen) {
            this.appendMessage("customer", randomReply);
            this.updateRelationship(3, "Risposta ricevuta");
        }
    }

    updateRelationship(delta, feedback) {
        if (!this.currentCustomer) return;

        if (typeof this.currentCustomer.relationScore !== "number") {
            this.currentCustomer.relationScore = 50;
        }

        this.currentCustomer.relationScore = Phaser.Math.Clamp(this.currentCustomer.relationScore + delta, 0, 100);
        
        const relationEl = document.getElementById("ai-chat-relation");
        if (relationEl) {
            relationEl.textContent = `${Math.floor(this.currentCustomer.relationScore)}%`;
        }

        if (feedback) {
            this.appendMessage("system", `${feedback} (+${delta} Sintonia)`);
        }

        if (this.scene && this.scene.showFloatingText) {
            this.scene.showFloatingText(
                this.currentCustomer.table?.x || this.currentCustomer.x || 300,
                (this.currentCustomer.table?.y || this.currentCustomer.y || 300) - 45,
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

    // Metodo per pulire risorse se necessario
    destroy() {
        this.closeChat();
        this.engine = null;
        this.currentCustomer = null;
        this.isModelReady = false;
        this.useFallback = true;
        this.isAIActive = false;
    }
}

window.AIDialogueManager = AIDialogueManager;