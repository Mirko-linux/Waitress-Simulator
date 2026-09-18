class StorySystem {
    constructor(scene) {
        this.scene = scene;
        this.storyState = {
            day: 0,
            isRestaurantForSale: false,
            hasMetThugs: false,
            thugAngerLevel: 0,
            moneySaved: 0,
            elenaAdoptionQuest: false,
            ludovicaAdopted: false,
            clanCallReceived: false,
            clanCallDay: 0,
            clanMissionAccepted: false,
            clanMissionCompleted: false,
            clanSecondTaskOffered: false,
            clanSecondTaskAccepted: false,
            clanBetrayed: false
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

    updateMoney() {
        this.storyState.moneySaved = window.GAME.score || 0;
        this.saveStoryData();
    }

    onDayComplete(levelCompleted) {
        this.storyState.day = levelCompleted;
        this.updateMoney();

        if (levelCompleted >= 3 && !this.storyState.isRestaurantForSale) {
            this.triggerSaleEvent();
        }

        if (levelCompleted >= 5 && !this.storyState.clanCallReceived) {
            this.storyState.clanCallReceived = true;
            this.storyState.clanCallDay = levelCompleted;
            this.saveStoryData();
        }

        if (this.storyState.elenaAdoptionQuest && !this.storyState.ludovicaAdopted) {
        }

        this.saveStoryData();
    }

    triggerSaleEvent() {
        this.storyState.isRestaurantForSale = true;
        this.scene.showFloatingText(400, 300, "📜 IL PROPRIETARIO HA VENDUTO IL LOCALE!", '#ffd700');
        this.scene.time.delayedCall(2000, () => {
            this.scene.showFloatingText(400, 250, "💰 Devi guadagnare 15.000€ per riacquistarlo!", '#e74c3c');
        });
    }

    triggerRandomThugCheck() {
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

    canTriggerClanMission(currentLevel) {
        if (this.storyState.clanMissionCompleted) return false;
        if (this.storyState.clanBetrayed) return false;
        if (this.storyState.clanMissionAccepted) return false;
        if (currentLevel < 5) return false;
        if (this.storyState.clanCallReceived) return false;
        return true;
    }

    triggerClanCall() {
        this.storyState.clanCallReceived = true;
        this.saveStoryData();
        if (this.scene.crime) {
            this.scene.crime.triggerClanCall();
        }
    }
}

window.StorySystem = StorySystem;