// price.js - Sistema Prezzi con Inflazione Progressiva

class PriceSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Prezzi base dei piatti (in Euro)
        this.basePrices = {
            'Pizza': 7.00,
            'Patatine': 3.50,
            'Panino': 5.00,
            'Risotto': 8.00,
            'Caponata': 6.00,
            'Caffè': 1.20,
            'Cola': 2.50,
            'Acqua': 1.50,
            'Birra': 4.00,
            'Arancina': 5.00,
            'Cassata': 7.00,
            'Chinotto': 1.50,
            'Cannolo': 4.50,
            'Ginseng': 1.80,
            'Fritto Misto': 5.00,
            'Pasta al Pesto': 4.50,
            "Panino con la milza": 5.00,
        };
        
        this.inflationRate = 0.01;
        this.maxInflation = 0.50; 
        
        // Affitto base della casa
        this.baseRent = 50; 
        
        this.loadInflationData();
    }
    
    loadInflationData() {
        const saved = localStorage.getItem('waitress_inflation_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentLevel = data.level || 0;
                this.currentInflation = data.inflation || 0;
            } catch(e) {
                this.currentLevel = 0;
                this.currentInflation = 0;
            }
        } else {
            this.currentLevel = 0;
            this.currentInflation = 0;
        }
    }
    
    saveInflationData() {
        localStorage.setItem('waitress_inflation_data', JSON.stringify({
            level: this.currentLevel,
            inflation: this.currentInflation
        }));
    }
    
    // Aggiorna l'inflazione quando il giocatore completa un giorno
    updateInflation(level) {
        this.currentLevel = level;
        this.currentInflation = Math.min(this.maxInflation, this.currentLevel * this.inflationRate);
        this.saveInflationData();
        
        // Avviso nella console
        console.log(`📈 Inflazione al livello ${level}: +${(this.currentInflation * 100).toFixed(2)}%`);
    }
    
    // Calcola il prezzo di un piatto con l'inflazione
    getFoodPrice(foodName) {
        const base = this.basePrices[foodName] || 5.00;
        const inflatedPrice = base * (1 + this.currentInflation);
        return Math.round(inflatedPrice * 100) / 100;
    }
    
    // Calcola l'affitto con l'inflazione
    getRentPrice(baseRent) {
        const inflatedRent = baseRent * (1 + this.currentInflation);
        return Math.round(inflatedRent * 100) / 100;
    }
    
    // Mostra l'inflazione come percentuale
    getInflationPercentage() {
        return (this.currentInflation * 100).toFixed(2);
    }
}

window.PriceSystem = PriceSystem;