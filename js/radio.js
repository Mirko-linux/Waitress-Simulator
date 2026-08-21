// radio.js - Sistema Radio Locale con Bonus Pazienza per i Clienti

class RadioSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentAudio = null;
        this.isPlaying = false;
        this.audioBuffer = null; 
        
        // Variabile per il bonus di pazienza
        this.patienceBonus = 0.15; // 15% di riduzione del calo della pazienza

        // Crea i componenti della radio
        this.createRadioUI();
        this.setupFileInput();
    }

    // 1. Crea il pulsante Radio e il testo
    createRadioUI() {
        // Pulsante Radio
        this.radioBtn = this.scene.add.text(700, 550, '📻 Radio', {
            fontSize: '16px',
            color: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Fredoka',
            backgroundColor: '#000000',
            padding: { x: 12, y: 6 },
            stroke: '#d27d2d',
            strokeThickness: 2
        })
        .setInteractive({ useHandCursor: true })
        .setDepth(200)
        .setScrollFactor(0);

        // Testo di stato
        this.statusText = this.scene.add.text(700, 530, '', {
            fontSize: '10px',
            color: '#cccccc',
            fontFamily: 'Fredoka'
        })
        .setDepth(201)
        .setScrollFactor(0);

        this.radioBtn.on('pointerdown', () => this.toggleRadio());
        this.radioBtn.on('pointerover', () => this.radioBtn.setStyle({ color: '#ffffff' }));
        this.radioBtn.on('pointerout', () => this.radioBtn.setStyle({ color: '#ffd700' }));
    }

    // 2. Crea l'input HTML nascosto
    setupFileInput() {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = 'audio/mp3, audio/wav, audio/ogg, audio/flac';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);

        this.fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                this.loadAndPlayMusic(file);
            }
        });
    }

    // 3. Carica e decodifica l'audio manualmente
    async loadAndPlayMusic(file) {
        // Se c'è già musica, fermala
        if (this.isPlaying) {
            this.stopMusic();
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioContext = this.scene.sound.context;
            this.audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const source = audioContext.createBufferSource();
            source.buffer = this.audioBuffer;
            source.loop = true;
            
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.5;

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            source.start(0);

            this.currentAudio = {
                source: source,
                gainNode: gainNode
            };
            
            this.isPlaying = true;
            
            this.radioBtn.setText('⏹️ Ferma Radio');
            this.statusText.setText(`🎵 Ora: ${file.name.substring(0, 25)}...`);

            // --- NUOVO: APPLICA IL BONUS DI PAZIENZA AI CLIENTI ---
            this.applyPatienceBonus();
            // ----------------------------------------------------

        } catch (error) {
            console.error("Errore nel caricamento dell'audio:", error);
            this.statusText.setText('❌ Errore formato audio');
            this.isPlaying = false;
        }
    }

    // 4. Toggle On/Off
    toggleRadio() {
        if (this.isPlaying) {
            this.stopMusic();
        } else {
            this.fileInput.click();
        }
    }

    // 5. Ferma la musica e rimuovi il bonus
    stopMusic() {
        if (this.currentAudio) {
            try {
                this.currentAudio.source.stop();
            } catch (e) {
                // Ignora errori se già fermo
            }
            this.currentAudio = null;
            this.audioBuffer = null; 
        }
        this.isPlaying = false;
        this.radioBtn.setText('📻 Radio');
        this.statusText.setText('');

        // --- NUOVO: RIMUOVI IL BONUS DI PAZIENZA ---
        this.removePatienceBonus();
        // -------------------------------------------
    }

    // --- NUOVO: APPLICA BONUS AI CLIENTI ---
    applyPatienceBonus() {
        if (!this.scene.customers) return;
        this.scene.customers.forEach(c => {
            if (!c.isDead && c.patienceMultiplier) {
                // Riduce il moltiplicatore (più basso = calo più lento)
                c.patienceMultiplier = Math.max(0.3, c.patienceMultiplier - this.patienceBonus);
            }
        });
    }

    removePatienceBonus() {
        if (!this.scene.customers) return;
        this.scene.customers.forEach(c => {
            if (!c.isDead && c.patienceMultiplier) {
                // Ripristina il moltiplicatore originale
                const npcConfig = window.NPC_REGISTRY[c.name] || {};
                c.patienceMultiplier = npcConfig.patienceMultiplier || 1.0;
            }
        });
    }

    // 6. Pulizia automatica (se la scena viene chiusa)
    setupAudioEvents() {
        this.scene.events.on('shutdown', () => {
            if (this.isPlaying) {
                this.stopMusic();
            }
            if (this.fileInput && this.fileInput.parentNode) {
                this.fileInput.parentNode.removeChild(this.fileInput);
            }
        });
    }
}

window.RadioSystem = RadioSystem;