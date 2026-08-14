// ============================================================================
// THE WAITRESS - SISTEMA DI DIALOGO AI (WEBLLM - LATO BROWSER)
// File: ai.js
// ============================================================================

class AIDialogueManager {
    constructor(scene) {
        this.scene = scene;
        this.currentCustomer = null;
        this.chatHistory = [];
        this.engine = null;
        this.isLoading = false;
        this.isModelReady = false;
        this.useFallback = false; // Attivato se WebGPU non è supportata
        
        this.injectChatStyles();
        this.createChatDOM();
        
        // Avvia il caricamento del modello in background
        this.initializeWebLLM();
    }

    async initializeWebLLM() {
        if (this.isLoading || this.isModelReady) return;
        
        this.isLoading = true;
        this.appendMessage("system", "⏳ Inizializzazione AI in corso... (Potrebbe richiedere WebGPU)");
        
        try {
            // Importazione corretta dell'ultima release stabile di WebLLM
            const webllm = await import('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm');

            // Verifica presenza di WebGPU nel browser
            if (!navigator.gpu) {
                throw new Error("WebGPU non supportata dal browser.");
            }

            // Inizializzazione corretta tramite CreateMLCEngine
            const selectedModel = "Phi-3-mini-4k-instruct-q4f16_1-MLC";
            
            this.engine = await webllm.CreateMLCEngine(
                selectedModel,
                {
                    initProgressCallback: (progress) => {
                        // Mostra lo stato di avanzamento del download
                        if (progress.text) {
                            console.log("WebLLM Progress:", progress.text);
                        }
                    }
                }
            );
            
            this.isModelReady = true;
            this.isLoading = false;
            this.appendMessage("system", "✅ AI pronta! Puoi chattare in tempo reale con i clienti.");
            
        } catch (error) {
            console.warn("WebLLM non disponibile, attivazione modalità Fallback:", error);
            this.isLoading = false;
            this.useFallback = true;
            this.isModelReady = true; // Permette di chattare usando la simulazione integrata
            
            this.appendMessage("system", "⚠️ AI locale non disponibile (WebGPU disattivata o non supportata). Attivata modalità simulata!");
        }
    }

    injectChatStyles() {
        if (document.getElementById("ai-chat-styles")) return;
        const style = document.createElement("style");
        style.id = "ai-chat-styles";
        style.textContent = `
            #ai-chat-modal {
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                width: 440px; height: 500px;
                background: linear-gradient(135deg, rgba(35, 21, 19, 0.98) 0%, rgba(17, 9, 7, 0.99) 100%);
                border: 2px solid rgba(255, 112, 67, 0.4); border-radius: 20px;
                z-index: 10000; display: none; flex-direction: column;
                font-family: 'Poppins', sans-serif; color: #f5efe6;
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
                opacity: 0;
            }
            #ai-chat-modal.active { display: flex; transform: translate(-50%, -50%) scale(1); opacity: 1; }
            .ai-chat-header { padding: 16px 20px; border-bottom: 1px solid rgba(255, 112, 67, 0.2); display: flex; justify-content: space-between; background: rgba(17, 9, 7, 0.85); border-radius: 20px 20px 0 0; }
            .ai-profile-info { display: flex; align-items: center; gap: 12px; }
            .ai-avatar { font-size: 24px; background: rgba(255, 112, 67, 0.15); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
            .ai-name-box h3 { margin: 0; font-size: 16px; font-weight: 600; color: #ffb74d; }
            .ai-relation-badge { font-size: 11px; color: #ff7043; font-weight: bold; }
            .ai-chat-log { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
            .ai-msg { max-width: 82%; padding: 12px 16px; border-radius: 16px; font-size: 13.5px; line-height: 1.45; word-wrap: break-word; }
            .ai-msg.customer { background: rgba(255, 255, 255, 0.05); color: #f5efe6; align-self: flex-start; border: 1px solid rgba(255, 255, 255, 0.1); border-bottom-left-radius: 4px; }
            .ai-msg.waitress { background: linear-gradient(135deg, #ff7043 0%, #ffb74d 100%); color: #110907; align-self: flex-end; border-bottom-right-radius: 4px; font-weight: 500; }
            .ai-msg.system { background: rgba(255, 183, 77, 0.05); color: #ffb74d; align-self: center; font-size: 11px; border-radius: 20px; padding: 6px 16px; border: 1px dashed rgba(255, 183, 77, 0.3); text-align: center; }
            .ai-chat-input-area { padding: 16px; background: rgba(17, 9, 7, 0.95); border-top: 1px solid rgba(255, 112, 67, 0.2); display: flex; gap: 10px; border-radius: 0 0 20px 20px; }
            #ai-input-field { flex: 1; background: rgba(255, 255, 255, 0.03); border: 1.5px solid rgba(255, 112, 67, 0.3); border-radius: 12px; padding: 10px 16px; color: #ffffff; outline: none; }
            .ai-btn-send { background: linear-gradient(135deg, #ff7043 0%, #ff5722 100%); border: none; color: white; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; }
            .ai-close-btn { background: rgba(231, 76, 60, 0.1); border: 1px solid rgba(231, 76, 60, 0.3); color: #e74c3c; font-size: 12px; padding: 6px 14px; border-radius: 8px; cursor: pointer; }
        `;
        document.head.appendChild(style);
    }

    createChatDOM() {
        const existing = document.getElementById("ai-chat-modal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "ai-chat-modal";
        modal.innerHTML = `
            <div class="ai-chat-header">
                <div class="ai-profile-info">
                    <div class="ai-avatar" id="ai-chat-avatar">🧑</div>
                    <div class="ai-name-box">
                        <h3 id="ai-chat-name">Cliente</h3>
                        <div class="ai-relation-badge">
                            <span>❤️ Sintonia:</span>
                            <span id="ai-chat-relation">50%</span>
                        </div>
                    </div>
                </div>
                <button class="ai-close-btn" id="ai-chat-close">Torna al Lavoro 🏃‍♀️</button>
            </div>
            <div class="ai-chat-log" id="ai-chat-log"></div>
            <div class="ai-chat-input-area">
                <input type="text" id="ai-input-field" placeholder="Scrivi alla clientela..." autocomplete="off">
                <button class="ai-btn-send" id="ai-send-btn">Invia</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("ai-chat-close").addEventListener("click", () => this.closeChat());
        document.getElementById("ai-send-btn").addEventListener("click", () => this.sendMessage());
        document.getElementById("ai-input-field").addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.sendMessage();
        });
    }

    openChat(customer) {
        if (!this.scene.gameActive) return;
        if (!this.isModelReady) {
            this.appendMessage("system", "⏳ L'AI sta terminando la configurazione, attendi un istante...");
            return;
        }

        this.currentCustomer = customer;
        this.chatHistory = [];

        this.scene.gameActive = false;
        if (this.scene.input && this.scene.input.keyboard) this.scene.input.keyboard.enabled = false;

        document.getElementById("ai-chat-avatar").textContent = customer.emojiChar || "🧑";
        document.getElementById("ai-chat-name").textContent = customer.name || "Cliente";
        document.getElementById("ai-chat-relation").textContent = `${Math.floor(customer.relationScore || 50)}%`;

        const log = document.getElementById("ai-chat-log");
        log.innerHTML = "";

        const orderName = customer.order || "questo piatto";
        const initialGreeting = `Ciao! Sono ${customer.name}. Grazie mille per il servizio e per ${orderName}!`;
        this.appendMessage("customer", initialGreeting);
        this.chatHistory.push({ role: "assistant", content: initialGreeting });

        document.getElementById("ai-chat-modal").classList.add("active");
        setTimeout(() => document.getElementById("ai-input-field").focus(), 100);
    }

    closeChat() {
        document.getElementById("ai-chat-modal").classList.remove("active");
        if (this.scene.input && this.scene.input.keyboard) this.scene.input.keyboard.enabled = true;
        this.scene.gameActive = true;
        this.currentCustomer = null;
    }

    async sendMessage() {
        const inputField = document.getElementById("ai-input-field");
        const userText = inputField.value.trim();
        if (!userText || !this.currentCustomer || !this.isModelReady) return;

        inputField.value = "";
        this.appendMessage("waitress", userText);
        this.chatHistory.push({ role: "user", content: userText });

        const typingIndicator = this.appendMessage("customer", "Sta digitando...");

        try {
            let aiResponse = "";

            if (this.useFallback) {
                // Generazione risposte simulate dinamiche
                await new Promise(res => setTimeout(res, 800)); // Simula tempo di risposta
                aiResponse = this.generateFallbackResponse(userText);
            } else {
                // Generazione risposta tramite WebLLM
                const systemPrompt = `Sei ${this.currentCustomer.name}, un cliente del ristorante. Rispondi sempre in italiano, in modo amichevole e breve (massimo 2-3 frasi). Non usare simboli strani o asterischi.`;

                const reply = await this.engine.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...this.chatHistory
                    ],
                    temperature: 0.7,
                    max_tokens: 100
                });

                aiResponse = reply.choices[0].message.content.trim();
            }

            typingIndicator.remove();
            this.appendMessage("customer", aiResponse);
            this.chatHistory.push({ role: "assistant", content: aiResponse });

            // Calcolo automatico incremento sintonia
            const deltaScore = Phaser.Math.Between(3, 8);
            this.updateRelationship(deltaScore, "Ottima conversazione!");

        } catch (e) {
            console.error("Errore nella generazione del messaggio:", e);
            typingIndicator.remove();
            
            // Passa alla modalità fallback se la GPU va in crash durante la risposta
            this.useFallback = true;
            const fallbackReply = this.generateFallbackResponse(userText);
            this.appendMessage("customer", fallbackReply);
        }
    }

    generateFallbackResponse(text) {
        const lower = text.toLowerCase();
        const customerName = this.currentCustomer ? this.currentCustomer.name : "Cliente";

        if (lower.includes("ciao") || lower.includes("salve")) {
            return `Ciao! È davvero un piacere parlare con te. Come sta andando il turno?`;
        } else if (lower.includes("buono") || lower.includes("piatto") || lower.includes("cibo")) {
            return `Sì, era davvero delizioso! Tornerò sicuramente in questo locale.`;
        } else if (lower.includes("grazie")) {
            return `Grazie a te per l'ottima accoglienza e il servizio impeccabile!`;
        } else {
            const generic = [
                `Hai davvero un bell'atteggiamento con i clienti, si vede che ci tieni!`,
                `Il servizio qui è sempre fantastico, ti ringrazio ancora.`,
                `Spero di rivederci presto al mio prossimo pranzo qui!`
            ];
            return generic[Math.floor(Math.random() * generic.length)];
        }
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
        msgDiv.textContent = text;
        log.appendChild(msgDiv);
        log.scrollTop = log.scrollHeight;
        return msgDiv;
    }
}

window.AIDialogueManager = AIDialogueManager;