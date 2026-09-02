// quest.js - Sistema Missioni Completo (Missione Principale + Elena Nascosta)

class QuestSystem {
    constructor(scene) {
        this.scene = scene;
        this.activeQuests = [];
        this.completedQuests = [];
        this.isMenuOpen = false;
        this.mainQuestStage = 0;
        
        this.loadQuests();
        this.createQuestButton();
        this.createQuestMenu();
        this.checkMainQuestProgress();
    }

    loadQuests() {
        const saved = localStorage.getItem('waitress_quest_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.activeQuests = data.activeQuests || [];
                this.completedQuests = data.completedQuests || [];
                this.mainQuestStage = data.mainQuestStage || 0;
            } catch(e) {}
        }
    }

    saveQuests() {
        localStorage.setItem('waitress_quest_data', JSON.stringify({
            activeQuests: this.activeQuests,
            completedQuests: this.completedQuests,
            mainQuestStage: this.mainQuestStage
        }));
    }

    // --- PULSANTE ---
    createQuestButton() {
        const x = 620, y = 550;
        this.btnBg = this.scene.add.rectangle(x, y, 90, 30, 0x2c3e50)
            .setStrokeStyle(1.5, 0xffd700)
            .setDepth(200)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });
        this.btnText = this.scene.add.text(x, y, '📜 Missioni', {
            fontSize: '12px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(201).setScrollFactor(0);

        this.btnBg.on('pointerover', () => this.btnBg.setFillStyle(0x34495e));
        this.btnBg.on('pointerout', () => this.btnBg.setFillStyle(0x2c3e50));
        this.btnBg.on('pointerdown', () => this.toggleMenu());
    }

    // --- MENU ---
    createQuestMenu() {
        this.overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.5)
            .setDepth(300).setScrollFactor(0).setInteractive().setVisible(false);

        this.menuPanel = this.scene.add.container(400, 300).setDepth(301).setScrollFactor(0);
        this.menuPanel.setVisible(false);

        const bg = this.scene.add.rectangle(0, 0, 450, 450, 0x110906, 0.95)
            .setStrokeStyle(2, 0xd27d2d);
        const title = this.scene.add.text(0, -190, '📜 MISSIONI', {
            fontSize: '24px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);
        const closeBtn = this.scene.add.text(200, -190, '✖', {
            fontSize: '24px', color: '#e74c3c', fontStyle: 'bold'
        }).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.toggleMenu());

        this.questTextArea = this.scene.add.text(0, -100, 'Caricamento missioni...', {
            fontSize: '14px', color: '#ecf0f1', fontFamily: 'Fredoka', align: 'center', wordWrap: { width: 400 }
        }).setOrigin(0.5);

        this.menuPanel.add([bg, title, closeBtn, this.questTextArea]);
        this.overlay.on('pointerdown', () => this.toggleMenu());
    }

    // --- APRI / CHIUDI ---
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.overlay.setVisible(this.isMenuOpen);
        this.menuPanel.setVisible(this.isMenuOpen);
        if (this.scene) this.scene.gameActive = !this.isMenuOpen;
        if (this.isMenuOpen) {
            this.updateQuestMenuText();
            if (window.triggerSfx) window.triggerSfx('click');
        }
    }

    // --- MISSIONE PRINCIPALE ---
    checkMainQuestProgress() {
        const score = window.GAME.score || 0;
        const level = window.GAME.level || 1;
        
        if (score >= 1000 && this.mainQuestStage < 1) {
            this.mainQuestStage = 1;
            this.completedQuests.push('main_quest_1000');
        }
        
        if (score >= 5000 && this.mainQuestStage < 2) {
            this.mainQuestStage = 2;
            this.completedQuests.push('main_quest_5000');
        }
        
        if (score >= 10000 && this.mainQuestStage < 3) {
            this.mainQuestStage = 3;
            this.completedQuests.push('main_quest_10000');
        }
        
        if (score >= 15000 && this.mainQuestStage < 4) {
            this.mainQuestStage = 4;
            this.completedQuests.push('main_quest_15000');
        }
        
        this.saveQuests();
    }

    // --- MISSIONE ELENA (NASCOSTA) ---
    startElenaAdoptionQuest() {
        if (this.completedQuests.includes('elena_adoption')) return;
        if (this.activeQuests.find(q => q.id === 'elena_adoption')) return;

        // Controlla i requisiti segreti:
        // 1. Sintonia al 100% con TUTTI i clienti
        // 2. Guadagno massimo di 15.000€
        const hasMaxAffection = this.scene.customers && this.scene.customers.length > 0 && 
            this.scene.customers.every(c => c.relationScore >= 100);
        const hasMaxMoney = window.GAME.score >= 15000;

        // Se i requisiti NON sono soddisfatti, la missione NON appare (missione nascosta)
        if (!hasMaxAffection || !hasMaxMoney) return;

        const quest = {
            id: 'elena_adoption',
            icon: '👶',
            title: 'Raggiungi il massimo della sintonia con tutti i clienti',
            progress: 'Raggiungi il massimo della sintonia con tutti i clienti',
            reward: 'Sblocco missione segreta'
        };

        this.activeQuests.push(quest);
        this.saveQuests();
        this.updateQuestMenuText();
    }

    // --- AGGIORNA TESTO MENU ---
    updateQuestMenuText() {
        let text = '';

        // MISSIONE PRINCIPALE (solo testo, senza emoji)
        text += 'MISSIONE PRINCIPALE\n';
        if (this.mainQuestStage < 4) {
            text += 'Raggiungi 15.000€\n';
            text += `Attuale: ${window.GAME.score}€\n\n`;
        } else {
            text += 'COMPLETATA\n\n';
        }

        // MISSIONI ATTIVE (solo testo essenziale)
        if (this.activeQuests.length > 0) {
            text += 'MISSIONI ATTIVE\n\n';
            this.activeQuests.forEach(q => {
                text += `${q.title}\n`;
                text += `${q.progress}\n\n`;
            });
        } else {
            text += 'Nessuna missione attiva\n\n';
        }

        // MISSIONI COMPLETATE
        if (this.completedQuests.length > 0) {
            text += 'COMPLETATE\n';
            this.completedQuests.forEach(id => {
                if (id.includes('main_quest')) {
                    text += `Obiettivo ${id.replace('main_quest_', '')}€\n`;
                } else {
                    text += `${id}\n`;
                }
            });
        }

        this.questTextArea.setText(text);
    }

    // --- COMPLETA MISSIONI ---
    completeQuest(questId) {
        const index = this.activeQuests.findIndex(q => q.id === questId);
        if (index > -1) {
            const quest = this.activeQuests[index];
            this.completedQuests.push(questId);
            this.activeQuests.splice(index, 1);
            this.saveQuests();
            this.updateQuestMenuText();
        }
    }

    // --- AGGIORNA QUANDO IL GIOCO AVANZA ---
    update() {
        this.checkMainQuestProgress();
        
        if (window.GAME.score >= 15000) {
            this.startElenaAdoptionQuest();
        }
    }
}

window.QuestSystem = QuestSystem;