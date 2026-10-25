class PriceSystem {
    constructor(scene) {
        this.scene = scene;
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
            'Moroni': 4.00
        };
        
        this.inflationRate = 0.01;
        this.maxInflation = 0.50; 
        this.baseRent = 50; 
        
        this.loadInflationData();
    }
    
    loadInflationData() {
        const saved = localStorage.getItem('waitress_inflation_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentLevel = data.level || 1;
                this.currentInflation = data.inflation || 0;
            } catch(e) {
                this.currentLevel = 1;
                this.currentInflation = 0;
            }
        } else {
            this.currentLevel = 1;
            this.currentInflation = 0;
        }
    }
    
    saveInflationData() {
        localStorage.setItem('waitress_inflation_data', JSON.stringify({
            level: this.currentLevel,
            inflation: this.currentInflation
        }));
    }
    

    updateInflation(level) {
        this.currentLevel = level;
        this.currentInflation = Math.min(this.maxInflation, (this.currentLevel - 1) * this.inflationRate);
        this.saveInflationData();
        
        console.log(`📈 Inflazione al livello ${level}: +${(this.currentInflation * 100).toFixed(2)}%`);
    }
    

    getFoodPrice(foodName) {
        const base = this.basePrices[foodName] || 5.00;
        const inflatedPrice = base * (1 + this.currentInflation);
        return Math.round(inflatedPrice * 100) / 100;
    }
    

    getRentPrice(baseRent = 50) {
        const inflatedRent = baseRent * (1 + this.currentInflation);
        return Math.round(inflatedRent * 100) / 100;
    }
    
    getInflationPercentage() {
        return (this.currentInflation * 100).toFixed(2);
    }
}

window.PriceSystem = PriceSystem;