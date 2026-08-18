// radio.js - Sistema Radio Locale (Lettore MP3 personale) - VERSIONE AUDIO FIX

class RadioSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentAudio = null;
        this.isPlaying = false;
        this.audioBuffer = null; // Salva il buffer decodificato

        // Crea i componenti della radio
        this.createRadioUI();
        this.setupFileInput();
    }
        // Aggiungi questo metodo dentro RadioSystem
    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying) {
                this.stopMusic(); // Ferma la radio se il giocatore cambia scheda
            }
        });
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

    // 3. FIX: Carica e decodifica l'audio manualmente
    async loadAndPlayMusic(file) {
        // Se c'è già musica, fermala
        if (this.isPlaying) {
            this.stopMusic();
        }

        try {
            // Legge il file come ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();
            
            // Decodifica l'audio usando il contesto audio del browser
            const audioContext = this.scene.sound.context;
            this.audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Sblocca il contesto audio (se sospeso)
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // Crea la sorgente audio e la collega
            const source = audioContext.createBufferSource();
            source.buffer = this.audioBuffer;
            source.loop = true;
            
            // Crea un gain per il volume
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.5; // Volume al 50%

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            source.start(0);

            // Salva il riferimento per fermarla dopo
            this.currentAudio = {
                source: source,
                gainNode: gainNode
            };
            
            this.isPlaying = true;
            
            // Aggiorna l'interfaccia
            this.radioBtn.setText('⏹️ Ferma Radio');
            this.statusText.setText(`🎵 Ora: ${file.name.substring(0, 25)}...`);

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

    // 5. Ferma la musica
    stopMusic() {
        if (this.currentAudio) {
            try {
                this.currentAudio.source.stop();
            } catch (e) {
                // Ignora errori se già fermo
            }
            this.currentAudio = null;
            this.audioBuffer = null; // Pulisce la memoria
        }
        this.isPlaying = false;
        this.radioBtn.setText('📻 Radio');
        this.statusText.setText('');
    }

    // 6. Pulizia automatica
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