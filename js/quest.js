class QuestSystem {
    constructor(scene) {
        this.scene = scene;
        this.activeQuests = [];
        this.completedQuests = [];
        this.isMenuOpen = false;
        
        this.loadQuests();
        this.createQuestButton(); // Crea il pulsante accanto alla Radio
        this.createQuestMenu();   // Crea il menu (nascosto inizialmente)
    }

    loadQuests() {
        const saved = localStorage.getItem('waitress_quest_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.activeQuests = data.activeQuests || [];
                this.completedQuests = data.completedQuests || [];
            } catch(e) {}
        }
    }

    saveQuests() {
        localStorage.setItem('waitress_quest_data', JSON.stringify({
            activeQuests: this.activeQuests,
            completedQuests: this.completedQuests
        }));
    }

    // --- 1. PULSANTE ACCANTO ALLA RADIO (FIXATO) ---
    createQuestButton() {
        // Crea i singoli elementi invece del Container
        const x = 620, y = 550;

        // Sfondo del pulsante (è questo che riceve il click)
        this.btnBg = this.scene.add.rectangle(x, y, 90, 30, 0x2c3e50)
            .setStrokeStyle(1.5, 0xffd700)
            .setDepth(200)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true }); // <--- QUI L'INTERACTIVE È SUL RETTANGOLO

        // Testo del pulsante
        this.btnText = this.scene.add.text(x, y, '📜 Missioni', {
            fontSize: '12px',
            color: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(201).setScrollFactor(0);

        // Effetti hover
        this.btnBg.on('pointerover', () => this.btnBg.setFillStyle(0x34495e));
        this.btnBg.on('pointerout', () => this.btnBg.setFillStyle(0x2c3e50));
        
        // Apre il menu al click
        this.btnBg.on('pointerdown', () => this.toggleMenu());
    }

    // --- 2. MENU MISSIONI A COMPARSA ---
    createQuestMenu() {
        // Sfondo scuro per offuscare il gioco quando il menu è aperto
        this.overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.5)
            .setDepth(300)
            .setScrollFactor(0)
            .setInteractive()
            .setVisible(false); // Nascosto di default

        // Il pannello del menu
        this.menuPanel = this.scene.add.container(400, 300).setDepth(301).setScrollFactor(0);
        this.menuPanel.setVisible(false);

        // Sfondo del pannello
        const bg = this.scene.add.rectangle(0, 0, 400, 400, 0x110906, 0.95)
            .setStrokeStyle(2, 0xd27d2d);

        // Titolo
        const title = this.scene.add.text(0, -170, '📜 MISSIONI', {
            fontSize: '24px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        // Pulsante Chiudi (X)
        const closeBtn = this.scene.add.text(180, -170, '✖', {
            fontSize: '24px',
            color: '#e74c3c',
            fontStyle: 'bold'
        }).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.toggleMenu());

        // Area testo per le missioni
        this.questTextArea = this.scene.add.text(0, -100, 'Caricamento missioni...', {
            fontSize: '14px',
            color: '#ecf0f1',
            fontFamily: 'Fredoka',
            align: 'center',
            wordWrap: { width: 350 }
        }).setOrigin(0.5);

        this.menuPanel.add([bg, title, closeBtn, this.questTextArea]);

        // Se l'utente clicca fuori dal menu, lo chiude
        this.overlay.on('pointerdown', () => this.toggleMenu());
    }

    // --- 3. APRI / CHIUDI MENU ---
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        this.overlay.setVisible(this.isMenuOpen);
        this.menuPanel.setVisible(this.isMenuOpen);
        
        // Congela il gioco quando il menu è aperto
        if (this.scene) {
            this.scene.gameActive = !this.isMenuOpen;
        }

        // Aggiorna il contenuto ogni volta che si apre
        if (this.isMenuOpen) {
            this.updateQuestMenuText();
            if (window.triggerSfx) window.triggerSfx('click');
        }
    }

    // --- 4. AGGIORNA IL TESTO DEL MENU ---
    updateQuestMenuText() {
        let text = '';

        if (this.activeQuests.length > 0) {
            text += '🟢 MISSIONI ATTIVE:\n\n';
            this.activeQuests.forEach(q => {
                text += `${q.icon} ${q.title}\n`;
                text += `   📍 ${q.progress}\n\n`;
            });
        } else {
            text += '✅ Nessuna missione attiva.\n\n';
        }

        if (this.completedQuests.length > 0) {
            text += '🏆 COMPLETATE:\n';
            this.completedQuests.forEach(id => {
                text += `   ✔️ ${id}\n`;
            });
        }

        this.questTextArea.setText(text);
    }

    // --- 5. LOGICA MISSIONI ---
    startElenaAdoptionQuest() {
        if (this.completedQuests.includes('elena_adoption')) return;
        if (this.activeQuests.find(q => q.id === 'elena_adoption')) return;

        const quest = {
            id: 'elena_adoption',
            icon: '👶',
            title: 'Raggiungi il massimo dell\'amicizia con Elena',
            progress: 'Raggiungi il 100% di sintonia con Elena',
            reward: 'Una nuova vita in famiglia'
        };

        this.activeQuests.push(quest);
        this.saveQuests();
        this.updateQuestMenuText();

        // Notifica a schermo
        this.scene.showFloatingText(400, 200, "👶 NUOVA MISSIONE: Raggiungi il massimo dell'amicizia con Elena!", '#3498db');
    }

    completeQuest(questId) {
        const index = this.activeQuests.findIndex(q => q.id === questId);
        if (index > -1) {
            const quest = this.activeQuests[index];
            this.completedQuests.push(questId);
            this.activeQuests.splice(index, 1);
            this.saveQuests();
            this.updateQuestMenuText();
            
            this.scene.showFloatingText(400, 200, `✅ Missione Completata: ${quest.title}!`, '#2ecc71');
        }
    }
}

window.QuestSystem = QuestSystem;