(function() {
    class ClanDialogScene extends Phaser.Scene {
        constructor() {
            super('ClanDialog');
        }

        init(data) {
            this.mode = (data && data.mode) || 'face';
            this.onComplete = (data && data.onComplete) || null;
            this.onAccept = (data && data.onAccept) || null;
            this.onRefuse = (data && data.onRefuse) || null;
            this.currentLine = 0;
            this.isClosing = false;
            this.dialogContainer = null;
            this.showAvatar = this.mode === 'face';
            this.typingSpeed = (data && data.typingSpeed) || 25;
        }

        create() {
            const W = 800, H = 600;
            this.cameras.main.setBackgroundColor('#0a0503');

            this.add.rectangle(400, 300, W, H, 0x0a0503, 0.95).setDepth(0);


            const vignette = this.add.graphics().setDepth(1);
            vignette.fillStyle(0x000000, 0.4);
            vignette.fillRect(0, 0, W, 40);
            vignette.fillRect(0, H - 40, W, 40);

            const corner = this.add.rectangle(400, 300, 500, 400, 0x1a0a0a, 1)
                .setStrokeStyle(3, 0x8b0000).setDepth(1);


            const title = this.add.text(400, 130,
                this.mode === 'phone' ? '📞 CHIAMATA ANONIMA' : '🌑 L\'INCONTRO',
                {
                    fontSize: '32px', color: '#ff4444', fontStyle: 'bold', fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5).setDepth(2);

            const subtitle = this.add.text(400, 170,
                this.mode === 'phone' ? '— numero sconosciuto —' : '— qualcuno ti osserva —',
                {
                    fontSize: '12px', color: '#888888', fontStyle: 'italic', fontFamily: 'Fredoka'
                }
            ).setOrigin(0.5).setDepth(2);

            if (this.showAvatar) {

                if (this.textures.exists('Criminale_Avanti')) {
                    this.avatar = this.add.image(400, 250, 'Criminale_Avanti')
                        .setDisplaySize(90, 90).setDepth(3);
                } else {
                    this.avatar = this.add.text(400, 250, '🧔‍♂️', { fontSize: '64px' })
                        .setOrigin(0.5).setDepth(3);
                }

                this.add.ellipse(400, 295, 60, 12, 0x000000, 0.4).setDepth(2);
            } else {
                this.add.text(400, 250, '📞', { fontSize: '64px' })
                    .setOrigin(0.5).setDepth(3);
            }

            this.dialogContainer = this.add.container(400, 460).setDepth(100);
            this.dialogContainer.setScrollFactor(0);

            const bubble = this.add.rectangle(0, 0, 680, 200, 0xfef9e7, 0.98)
                .setStrokeStyle(3, 0x8b0000);
            this.dialogContainer.add(bubble);

            this.nameText = this.add.text(-320, -70, '', {
                fontSize: '18px', color: '#8b0000', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0, 0.5);
            this.dialogContainer.add(this.nameText);

            this.dialogText = this.add.text(0, 10, '', {
                fontSize: '16px',
                color: '#2c1a11',
                fontFamily: 'Fredoka',
                align: 'center',
                wordWrap: { width: 600 },
                lineSpacing: 6
            }).setOrigin(0.5);
            this.dialogContainer.add(this.dialogText);

            this.arrow = this.add.text(300, 75, '▼', {
                fontSize: '20px', color: '#8b0000'
            }).setOrigin(0.5);
            this.dialogContainer.add(this.arrow);

            this.tweens.add({
                targets: this.arrow,
                y: 85, alpha: 0.4,
                duration: 600, yoyo: true, repeat: -1
            });

            this.choiceContainer = this.add.container(400, 480).setDepth(150).setVisible(false).setScrollFactor(0);


            if (this.mode === 'phone') {

                this.script = [
                    {
                        who: 'boss',
                        name: '???',
                        text: 'Buonasera. Non serve che tu sappia chi siamo. Sappiamo noi chi sei tu.'
                    },
                    {
                        who: 'boss',
                        name: '???',
                        text: 'Il tuo locale è in una zona che... diciamo così... è sotto la nostra protezione.'
                    },
                    {
                        who: 'boss',
                        name: '???',
                        text: 'C\'è un cliente che sta diventando un problema. Un tipo che parla troppo. Tu gli servi una cena. Una cena speciale.'
                    },
                    {
                        who: 'boss',
                        name: '???',
                        text: 'Non deve morire. Deve solo... stare zitto per un po\'.'
                    },
                    {
                        who: 'boss',
                        name: '???',
                        text: 'Stasera, dopo la chiusura. Angolo in fondo al locale. Non farti aspettare.'
                    },
                    {
                        who: 'narrator',
                        name: '',
                        text: 'Il telefono riattacca. La voce era calma. Troppo calma.'
                    }
                ];
            } else {

                this.script = [
                    {
                        who: 'boss',
                        name: 'L\'Uomo',
                        text: 'Eccoti. Puntuale. Meglio così.'
                    },
                    {
                        who: 'boss',
                        name: 'L\'Uomo',
                        text: 'Sai chi sono? No? Meglio. Sappi solo che il tuo locale è sotto la nostra... protezione.'
                    },
                    {
                        who: 'boss',
                        name: 'L\'Uomo',
                        text: 'C\'è un cliente che viene qui. Un certo "Avvocato". Parla troppo. Sa cose che non dovrebbe sapere.'
                    },
                    {
                        who: 'boss',
                        name: 'L\'Uomo',
                        text: 'Tu gli servi una cena. Una cena speciale. Non deve morire. Solo... stare zitto.'
                    },
                    {
                        who: 'boss',
                        name: 'L\'Uomo',
                        text: 'In cambio, il locale è protetto. Nessuno ti tocca. I conti tornano. Tutti felici.'
                    },
                    {
                        who: 'boss',
                        name: 'L\'Uomo',
                        text: 'Se rifiuti... be\', diciamo che il locale potrebbe avere problemi. Incendi. Controlli. Clienti che spariscono.'
                    },
                    {
                        who: 'boss',
                        name: 'L\'Uomo',
                        text: 'Allora, cameriera. Cosa scegli?'
                    }
                ];
            }

            this.currentLine = 0;
            this.isTyping = false;
            this.canAdvance = false;

            this.input.keyboard.on('keydown-SPACE', (e) => { e.stopPropagation(); this.advance(); });
            this.input.keyboard.on('keydown-ENTER', (e) => { e.stopPropagation(); this.advance(); });
            this.input.on('pointerdown', () => this.advance());

            this.time.delayedCall(500, () => this.advance());
        }

        advance() {
            if (this.isClosing) return;

            if (this.isTyping) {
                this.dialogText.setText(this.fullText);
                this.isTyping = false;
                this.canAdvance = true;
                this.arrow.setVisible(true);
                return;
            }

            if (!this.canAdvance && this.currentLine > 0) return;

            if (this.currentLine >= this.script.length) {
                if (this.mode === 'phone') {
                    this.showPhoneClose();
                } else {
                    this.showChoices();
                }
                return;
            }

            const line = this.script[this.currentLine];
            this.currentLine++;

            this.nameText.setText(line.name || '');
            this.nameText.setVisible(!!line.name);

            this.fullText = line.text;
            this.dialogText.setText('');
            this.isTyping = true;
            this.canAdvance = false;
            this.arrow.setVisible(false);

            let charIndex = 0;
            if (this.typingTimer) this.typingTimer.remove();
            this.typingTimer = this.time.addEvent({
                delay: this.typingSpeed,
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

        showPhoneClose() {
            this.dialogContainer.setVisible(false);
            this.choiceContainer.setVisible(true);
            this.choiceContainer.removeAll(true);

            const question = this.add.text(0, -60, 'Cosa fai?', {
                fontSize: '16px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            this.choiceContainer.add(question);

            const btn = this.add.rectangle(0, 0, 320, 44, 0x8b0000)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true });
            const txt = this.add.text(0, 0, '📞 "Ci sarò."', {
                fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5);

            btn.on('pointerover', () => btn.setScale(1.03));
            btn.on('pointerout', () => btn.setScale(1));
            btn.on('pointerdown', () => {
                this.isClosing = true;
                if (typeof this.onAccept === 'function') this.onAccept();
                this.closeDialog();
            });

            this.choiceContainer.add(btn);
            this.choiceContainer.add(txt);
        }

        showChoices() {
            this.dialogContainer.setVisible(false);
            this.choiceContainer.setVisible(true);
            this.choiceContainer.removeAll(true);

            const question = this.add.text(0, -120, 'Cosa rispondi?', {
                fontSize: '16px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
            }).setOrigin(0.5);
            this.choiceContainer.add(question);

            const choices = [
                {
                    label: '✅ Accetto la missione',
                    color: 0x2ecc71,
                    callback: () => {
                        this.isClosing = true;
                        if (typeof this.onAccept === 'function') this.onAccept();
                        this.closeDialog();
                    }
                },
                {
                    label: '❌ Rifiuto (conseguenze immediate)',
                    color: 0xe74c3c,
                    callback: () => {
                        this.isClosing = true;
                        if (typeof this.onRefuse === 'function') this.onRefuse(false);
                        this.closeDialog();
                    }
                },
                {
                    label: '🤔 Chiedo tempo per pensarci',
                    color: 0xf39c12,
                    callback: () => {
                        this.isClosing = true;
                        if (typeof this.onRefuse === 'function') this.onRefuse(true);
                        this.closeDialog();
                    }
                }
            ];

            choices.forEach((choice, i) => {
                const y = -60 + i * 55;
                const btn = this.add.rectangle(0, y, 360, 44, choice.color)
                    .setStrokeStyle(2, 0xffffff)
                    .setInteractive({ useHandCursor: true });
                const txt = this.add.text(0, y, choice.label, {
                    fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
                }).setOrigin(0.5);

                btn.on('pointerover', () => btn.setScale(1.03));
                btn.on('pointerout', () => btn.setScale(1));
                btn.on('pointerdown', () => choice.callback());

                this.choiceContainer.add(btn);
                this.choiceContainer.add(txt);
            });
        }

        closeDialog() {
            if (this.typingTimer) this.typingTimer.remove();
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                if (typeof this.onComplete === 'function') this.onComplete();
                this.scene.stop();
            });
        }
    }

    window.ClanDialogScene = ClanDialogScene;
})();