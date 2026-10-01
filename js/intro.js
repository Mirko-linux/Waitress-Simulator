class IntroScene extends Phaser.Scene {
    constructor() {
        super('Intro');
    }

    preload() {
        
        if (!this.textures.exists('floor_sala')) {
            this.load.image('floor_sala', 'assets/ambiente/1.png');
        }
        if (!this.textures.exists('floor_cucina')) {
            this.load.image('floor_cucina', 'assets/ambiente/2.png');
        }
        if (!this.textures.exists('wall')) {
            this.load.image('wall', 'assets/ambiente/3.png');
        }
        
        
        if (!this.textures.exists('cameriera_avanti')) {
            this.load.image('cameriera_avanti', 'assets/Cameriera/Cameriera_Avanti.png');
        }
        
        
        this.load.image('bubble_dialog', 'assets/UI/bubble_dialog.png');
    }

    create() {
        const W = 800, H = 600;

        
        this.cameras.main.setBackgroundColor('#1a0a04');
        
        
        if (this.textures.exists('floor_sala')) {
            for (let x = 0; x < W; x += 32) {
                for (let y = 0; y < H; y += 32) {
                    this.add.image(x + 16, y + 16, 'floor_sala')
                        .setDisplaySize(32, 32).setDepth(0);
                }
            }
        }

        
        
        this.waitress = this.add.image(250, 350, 'cameriera_avanti')
            .setScale(0.5).setDepth(10).setAlpha(0);

        
        this.owner = this.add.text(550, 350, '👴', {
            fontSize: '80px'
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        
        this.cameras.main.fadeIn(800, 0, 0, 0);

        this.tweens.add({
            targets: this.waitress,
            alpha: 1,
            x: 250,
            duration: 800,
            ease: 'Cubic.easeOut'
        });

        this.tweens.add({
            targets: this.owner,
            alpha: 1,
            x: 550,
            duration: 800,
            delay: 400,
            ease: 'Cubic.easeOut'
        });

        
        this.dialogBox = this.add.container(400, 500);
        this.dialogBox.setDepth(100).setAlpha(0);

        
        if (this.textures.exists('bubble_dialog')) {
            this.bubbleImg = this.add.image(0, 0, 'bubble_dialog')
                .setDisplaySize(700, 220);
            this.dialogBox.add(this.bubbleImg);
        } else {
            
            this.bubbleImg = this.add.rectangle(0, 0, 700, 220, 0xfef9e7)
                .setStrokeStyle(3, 0x000000);
            this.dialogBox.add(this.bubbleImg);
        }

        
        this.nameText = this.add.text(-320, -80, '', {
            fontSize: '20px',
            color: '#d27d2d',
            fontStyle: 'bold',
            fontFamily: 'Fredoka'
        }).setOrigin(0, 0.5);
        this.dialogBox.add(this.nameText);

        
        this.dialogText = this.add.text(0, -10, '', {
            fontSize: '18px',
            color: '#2c1a11',
            fontFamily: 'Fredoka',
            align: 'center',
            wordWrap: { width: 620 },
            lineSpacing: 6
        }).setOrigin(0.5);
        this.dialogBox.add(this.dialogText);

        
        this.arrow = this.add.text(300, 70, '▼', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);
        this.dialogBox.add(this.arrow);

        this.tweens.add({
            targets: this.arrow,
            y: 80,
            alpha: 0.4,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        
        this.script = [
            { who: 'Narratore', name: '', text: 'Palermo, centro storico. Una nuova giornata sta per iniziare.', hide: true },
            { who: 'waitress', name: 'Cameriera', text: 'Eccomi, sono pronta per il turno!' },
            { who: 'owner', name: 'Don Mimmo', text: 'Ah, finalmente! Sei tu la nuova cameriera?' },
            { who: 'waitress', name: 'Cameriera', text: 'Sì, sono io. Piacere di conoscerla!' },
            { who: 'owner', name: 'Don Mimmo', text: 'Questo locale è la mia vita da 40 anni. Ma... le cose non vanno bene.' },
            { who: 'owner', name: 'Don Mimmo', text: 'I debiti mi stanno soffocando. Temo che dovrò vendere.' },
            { who: 'waitress', name: 'Cameriera', text: 'Vendere? Ma è un peccato!' },
            { who: 'owner', name: 'Don Mimmo', text: 'Servi i clienti, sii gentile, e magari... chissà. Forse possiamo salvare questo posto.' },
            { who: 'narrator', name: '', text: 'Improvvisamente, la porta si apre con violenza.', hide: true },
            { who: 'businessman', name: 'Uomo in giacca', text: 'Bene bene. Ecco la nuova manovalanza.' },
            { who: 'businessman2', name: 'Scagnozzo', text: 'Il locale è nostro adesso, vecchio. Fuori dai piedi.' },
            { who: 'owner', name: 'Don Mimmo', text: 'Vi prego, abbiate pietà...' },
            { who: 'businessman', name: 'Uomo in giacca', text: 'Tu. Cameriera. Muoviti, che c\'è da lavorare.' },
            { who: 'narrator', name: '', text: 'Il turno è iniziato. Riuscirai a guadagnare 15.000€ per salvare il ristorante?', hide: true }
        ];

        this.currentLine = 0;
        this.isTyping = false;
        this.canAdvance = false;

        
        this.input.on('pointerdown', () => this.advance());
        this.input.keyboard.on('keydown-SPACE', () => this.advance());
        this.input.keyboard.on('keydown-ENTER', () => this.advance());

        
        this.time.delayedCall(1200, () => {
            this.dialogBox.setAlpha(1);
            this.advance();
        });
    }

    advance() {
        if (this.isTyping) {
            
            this.dialogText.setText(this.fullText);
            this.isTyping = false;
            this.canAdvance = true;
            this.arrow.setVisible(true);
            return;
        }

        if (!this.canAdvance && this.currentLine > 0) return;

        if (this.currentLine >= this.script.length) {
            this.endCutscene();
            return;
        }

        const line = this.script[this.currentLine];
        this.currentLine++;

        
        this.nameText.setText(line.name || '');

        
        if (line.hide) {
            this.nameText.setVisible(false);
            this.bubbleImg.setVisible(false);
        } else {
            this.nameText.setVisible(true);
            this.bubbleImg.setVisible(true);
        }

        
        this.highlightSpeaker(line.who);

        
        this.fullText = line.text;
        this.dialogText.setText('');
        this.isTyping = true;
        this.canAdvance = false;
        this.arrow.setVisible(false);

        let charIndex = 0;
        const typingSpeed = 30; 

        this.typingTimer = this.time.addEvent({
            delay: typingSpeed,
            callback: () => {
                charIndex++;
                this.dialogText.setText(this.fullText.substring(0, charIndex));
                
                if (charIndex >= this.fullText.length) {
                    this.typingTimer.remove();
                    this.isTyping = false;
                    this.canAdvance = true;
                    this.arrow.setVisible(true);
                }
            },
            loop: true
        });
    }

    highlightSpeaker(who) {
        
        if (this.waitress) this.waitress.setAlpha(0.5);
        if (this.owner) this.owner.setAlpha(0.5);

        
        if (who === 'waitress') this.waitress.setAlpha(1);
        if (who === 'owner') this.owner.setAlpha(1);
    }

    endCutscene() {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(800, () => {
            this.scene.start('Game');
        });
    }
}

window.IntroScene = IntroScene;