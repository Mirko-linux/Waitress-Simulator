// story.js - Sistema di Trama Principale e Dialoghi

class StorySystem {
    constructor(scene) {
        this.scene = scene;
        this.storyState = {
            day: 0,
            isRestaurantForSale: false,
            hasMetThugs: false,
            thugAngerLevel: 0, // 0-100. Se arriva a 100, game over diverso
            moneySaved: 0,
            elenaAdoptionQuest: false, // Diventa true quando sintonia Elena = 100
            ludovicaAdopted: false
        };
        
        this.loadStoryData();
    }

    loadStoryData() {
        const saved = localStorage.getItem('waitress_story_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.storyState = { ...this.storyState, ...data };
            } catch(e) {}
        }
    }

    saveStoryData() {
        localStorage.setItem('waitress_story_data', JSON.stringify(this.storyState));
    }

    // Aggiorna i soldi salvati nella storia (li prende dal GAME.score)
    updateMoney() {
        this.storyState.moneySaved = window.GAME.score || 0;
        this.saveStoryData();
    }

    // CHIAMATA DALLA FINE DEL GIORNO
    onDayComplete(levelCompleted) {
        this.storyState.day = levelCompleted;
        this.updateMoney();

        // 1. Controllo se il locale è in vendita (es. dal giorno 3 in poi)
        if (levelCompleted >= 3 && !this.storyState.isRestaurantForSale) {
            this.triggerSaleEvent();
        }

        // 2. Controllo se Elena è al 100% di sintonia e la quest non è ancora partita
        if (this.storyState.elenaAdoptionQuest && !this.storyState.ludovicaAdopted) {
            // La missione è già attiva, non serve rifarla
        }

        this.saveStoryData();
    }

    triggerSaleEvent() {
        this.storyState.isRestaurantForSale = true;
        // Mostra un messaggio a schermo quando finisce il giorno
        this.scene.showFloatingText(400, 300, "📜 IL PROPRIETARIO HA VENDUTO IL LOCALE!", '#ffd700');
        this.scene.time.delayedCall(2000, () => {
            this.scene.showFloatingText(400, 250, "💰 Devi guadagnare 15.000€ per riacquistarlo!", '#e74c3c');
        });
    }

    // --- GESTIONE DEGLI UOMINI D'AFFARI (Thugs) ---
    triggerRandomThugCheck() {
        // Vengono ogni tanto (es. 30% di probabilità se il livello è alto)
        if (Phaser.Math.Between(0, 100) > 30) return;

        this.storyState.thugAngerLevel += Phaser.Math.Between(5, 15);
        this.saveStoryData();

        const thugDialogues = [
            "🧔‍♂️ 'Hey, non ti immischiare in ciò che non ti riguarda.'",
            "🧔‍♂️ 'Se continui a guardarci male, ti farai male.'",
            "🧔‍♂️ 'Dove sono i soldi del cassiere? Controlliamo.'",
            "🧔‍♂️ 'Ricorda: sei solo una dipendente. Noi siamo i padroni.'"
        ];
        const dialogue = thugDialogues[Phaser.Math.Between(0, thugDialogues.length - 1)];
        this.scene.showFloatingText(400, 150, dialogue, '#ff4444');
        
        if (this.storyState.thugAngerLevel >= 100) {
            this.scene.showFloatingText(400, 300, "💀 GLI UOMINI D'AFFARI TI HANNO CACCIATA!", '#ff0000');
            this.scene.time.delayedCall(2000, () => {
                this.scene.scene.start('GameOver');
            });
        }
    }
}

window.StorySystem = StorySystem;