// ============================================================================
// THE WAITRESS - SISTEMA DI DIALOGO AI GENERATIVO (CON SUPPORTO ADOZIONE)
// File: ai.js
// ============================================================================

class AIDialogueManager {
    constructor(scene) {
        this.scene = scene;
        this.currentCustomer = null;
        this.chatHistory = [];
        this.apiEndpoint = "http://192.168.56.1:1234/v1/chat/completions";
        this.injectChatStyles();
        this.createChatDOM();
    }

    injectChatStyles() {
        if (document.getElementById("ai-chat-styles")) return;
        const style = document.createElement("style");
        style.id = "ai-chat-styles";
        style.textContent = `
            #ai-chat-modal {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                width: 440px;
                height: 500px;
                background: linear-gradient(135deg, rgba(35, 21, 19, 0.98) 0%, rgba(17, 9, 7, 0.99) 100%);
                backdrop-filter: blur(12px);
                border: 2px solid rgba(255, 112, 67, 0.4);
                border-radius: 20px;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: none;
                flex-direction: column;
                font-family: 'Poppins', sans-serif;
                overflow: hidden;
                color: #f5efe6;
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
                opacity: 0;
            }
            #ai-chat-modal.active { display: flex; transform: translate(-50%, -50%) scale(1); opacity: 1; }
            .ai-chat-header { background: rgba(17, 9, 7, 0.85); padding: 16px 20px; border-bottom: 1px solid rgba(255, 112, 67, 0.2); display: flex; align-items: center; justify-content: space-between; }
            .ai-profile-info { display: flex; align-items: center; gap: 12px; }
            .ai-avatar { font-size: 24px; background: rgba(255, 112, 67, 0.15); padding: 6px; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
            .ai-name-box h3 { margin: 0; font-size: 16px; font-weight: 600; color: #ffb74d; }
            .ai-relation-badge { font-size: 11px; color: #ff7043; font-weight: bold; }
            .ai-chat-log { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
            .ai-msg { max-width: 82%; padding: 12px 16px; border-radius: 16px; font-size: 13.5px; line-height: 1.45; }
            .ai-msg.customer { background: rgba(255, 255, 255, 0.05); color: #f5efe6; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1); }
            .ai-msg.waitress { background: linear-gradient(135deg, #ff7043 0%, #ffb74d 100%); color: #110907; align-self: flex-end; border-bottom-right-radius: 4px; font-weight: 500; }
            .ai-msg.system { background: rgba(255, 183, 77, 0.05); color: #ffb74d; align-self: center; font-size: 11px; border-radius: 20px; border: 1px dashed rgba(255, 183, 77, 0.3); padding: 6px 16px; }
            .ai-chat-input-area { padding: 16px; background: rgba(17, 9, 7, 0.95); border-top: 1px solid rgba(255, 112, 67, 0.2); display: flex; gap: 10px; }
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
        const gameWrapper = document.getElementById("game-wrapper") || document.body;
        gameWrapper.appendChild(modal);

        document.getElementById("ai-chat-close").addEventListener("click", () => this.closeChat());
        document.getElementById("ai-send-btn").addEventListener("click", () => this.sendMessage());
        document.getElementById("ai-input-field").addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.sendMessage();
        });
    }

    openChat(customer) {
        if (!this.scene.gameActive) return;
        this.currentCustomer = customer;
        this.chatHistory = [];

        this.scene.gameActive = false;
        if (this.scene.input && this.scene.input.keyboard) {
            this.scene.input.keyboard.enabled = false;
        }
        if (this.scene.waitress && this.scene.waitress.body) {
            this.scene.waitress.body.setVelocity(0, 0);
        }

        document.getElementById("ai-chat-avatar").textContent = customer.emojiChar || "🧑";
        document.getElementById("ai-chat-name").textContent = customer.name || "Cliente";
        document.getElementById("ai-chat-relation").textContent = `${Math.floor(customer.relationScore)}%`;

        const log = document.getElementById("ai-chat-log");
        log.innerHTML = "";

        // Saluto iniziale condizionato
        let initialGreeting = `Ciao! Sono ${customer.name}. Grazie per il fantastico piatto di ${customer.order}!`;
        
        // Se Elena raggiunge il 100% di relazione scatta la proposta di adozione
        if (customer.adoptTrigger && Math.floor(customer.relationScore) >= 100) {
            initialGreeting = `Senti... la nostra sintonia è incredibile. Ludovica ha bisogno di un futuro radioso. Ti andrebbe di adottarla e farle da seconda mamma/famiglia? ❤️👶`;
        }

        this.appendMessage("customer", initialGreeting);
        this.chatHistory.push({ role: "assistant", content: initialGreeting });

        const modal = document.getElementById("ai-chat-modal");
        modal.classList.add("active");
        setTimeout(() => {
            const f = document.getElementById("ai-input-field");
            if (f) f.focus();
        }, 100);
    }

    closeChat() {
        document.getElementById("ai-chat-modal").classList.remove("active");
        if (this.scene.input && this.scene.input.keyboard) {
            this.scene.input.keyboard.enabled = true;
        }
        this.scene.gameActive = true;
        this.currentCustomer = null;
    }

    async sendMessage() {
        const inputField = document.getElementById("ai-input-field");
        const userText = inputField.value.trim();
        if (!userText || !this.currentCustomer) return;

        inputField.value = "";
        this.appendMessage("waitress", userText);
        this.chatHistory.push({ role: "user", content: userText });

        const typingIndicator = this.appendMessage("customer", "Scrive...");

        try {
            const response = await this.fetchLocalAI(userText);
            typingIndicator.remove();
            this.appendMessage("customer", response.reply);
            this.chatHistory.push({ role: "assistant", content: response.reply });
            this.updateRelationship(response.deltaScore, response.feedbackText);
        } catch (e) {
            typingIndicator.remove();
            const fallback = this.generateFallbackResponse(userText);
            this.appendMessage("customer", fallback.reply);
            this.chatHistory.push({ role: "assistant", content: fallback.reply });
            this.updateRelationship(fallback.deltaScore, fallback.feedbackText);
        }
    }

    async fetchLocalAI(userText) {
        const systemPrompt = `Sei ${this.currentCustomer.name}. Rispondi in italiano brevemente (massimo 2 frasi). Genera alla fine un indicatore del tipo [SINTONIA: +10] o [SINTONIA: -5].`;
        const response = await fetch(this.apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "local-model",
                messages: [{ role: "system", content: systemPrompt }, ...this.chatHistory.slice(-4)],
                temperature: 0.7,
                max_tokens: 100
            })
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        let reply = data.choices[0].message.content.trim();
        let deltaScore = 0;
        let feedbackText = "Conversazione in corso";
        const scoreMatch = reply.match(/\[SINTONIA:\s*([+-]?\d+)\]/i);
        if (scoreMatch) {
            deltaScore = parseInt(scoreMatch[1], 10);
            reply = reply.replace(/\[SINTONIA:\s*[+-]?\d+\]/i, "").trim();
            feedbackText = deltaScore > 0 ? "Ottima risposta! 😊" : "Tensione... 😐";
        }
        return { reply, deltaScore, feedbackText };
    }

    generateFallbackResponse(userText) {
        const text = userText.toLowerCase();
        let reply = "È bello fare quattro chiacchiere!";
        let deltaScore = 2;
        let feedbackText = "Chiacchierata";

        if (this.currentCustomer.adoptTrigger && Math.floor(this.currentCustomer.relationScore) >= 100) {
            if (text.includes("sì") || text.includes("accetto") || text.includes("voglio") || text.includes("volentieri")) {
                reply = "Oh mio dio, grazie! Ludovica avrà una famiglia fantastica! ❤️😭";
                deltaScore = 0;
                feedbackText = "Adozione completata con successo! 🍼⭐";
                return { reply, deltaScore, feedbackText };
            }
        }

        if (text.includes("grazie") || text.includes("gentile") || text.includes("prego")) {
            reply = "Sei davvero una splendida professionista!";
            deltaScore = 12;
            feedbackText = "Cura per il cliente! 🌟";
        } else if (text.includes("bagno")) {
            reply = "Grazie per l'informazione sul bagno!";
            deltaScore = 5;
        }

        return { reply, deltaScore, feedbackText };
    }

    updateRelationship(delta, feedback) {
        if (!this.currentCustomer) return;
        this.currentCustomer.relationScore = Phaser.Math.Clamp(this.currentCustomer.relationScore + delta, 0, 100);
        document.getElementById("ai-chat-relation").textContent = `${Math.floor(this.currentCustomer.relationScore)}%`;

        const infoText = `[Sistema]: ${feedback} (${delta > 0 ? "+" : ""}${delta} Sintonia)`;
        this.appendMessage("system", infoText);

        this.scene.showFloatingText(
            this.currentCustomer.x, 
            this.currentCustomer.y - 45, 
            `${delta > 0 ? "❤️" : "💔"} Sintonia`, 
            delta > 0 ? "#ff4757" : "#888888"
        );
    }

    appendMessage(sender, text) {
        const log = document.getElementById("ai-chat-log");
        const msgDiv = document.createElement("div");
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.textContent = text;
        log.appendChild(msgDiv);
        log.scrollTop = log.scrollHeight;
        return msgDiv;
    }
}

window.AIDialogueManager = AIDialogueManager;