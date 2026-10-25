class NewPlayerScene extends Phaser.Scene {
    constructor() {
        super('NewPlayer');
        this.monthNames = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];
        this.monthLetters = 'ABCDEHLMPRST';
        this.birthYear = 2007;
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a0a04');

        this.nickname = localStorage.getItem('waitress_nickname') || '';
        this.birthDay = parseInt(localStorage.getItem('waitress_birth_day') || '1');
        this.birthMonth = parseInt(localStorage.getItem('waitress_birth_month') || '0');


        const card = this.add.rectangle(400, 300, 560, 500, 0x110906, 0.97)
            .setStrokeStyle(2.5, 0xd27d2d);

        this.add.text(400, 65, '👩‍🍳 NUOVA CAMERIERA', {
            fontSize: '28px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        this.add.text(400, 100, 'Crea la tua identità prima di iniziare', {
            fontSize: '12px', color: '#e0d5c1', fontFamily: 'Fredoka'
        }).setOrigin(0.5);


        this.add.text(160, 145, 'NOME', {
            fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0, 0.5);

        const nameBox = this.add.rectangle(400, 175, 480, 40, 0x1a0a04)
            .setStrokeStyle(1.5, 0xd27d2d);


        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.maxLength = 16;
        this.nameInput.value = this.nickname;
        this.nameInput.placeholder = 'Es. Giulia';
        Object.assign(this.nameInput.style, {
            position: 'absolute',
            background: 'transparent',
            color: '#ffd700',
            border: 'none',
            outline: 'none',
            fontFamily: 'Fredoka',
            fontSize: '18px',
            textAlign: 'center',
            zIndex: '1000'
        });

        this.nameInput.addEventListener('keydown', e => e.stopPropagation());
        this.nameInput.addEventListener('keyup', e => e.stopPropagation());
        this.nameInput.addEventListener('input', () => {
            this.nickname = this.nameInput.value.toUpperCase().replace(/[^A-Z]/g, '');
            this.nameInput.value = this.nickname;
            this.refreshPreview();
        });

        const gameContainer = document.getElementById('game-container') || document.body;
        gameContainer.appendChild(this.nameInput);
        this.positionNameInput();
        this.events.once('shutdown', () => this.destroyHtmlInputs());


        this.add.text(160, 235, 'DATA DI NASCITA', {
            fontSize: '13px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0, 0.5);


        this.add.text(200, 265, 'Giorno', {
            fontSize: '11px', color: '#aaaaaa', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const dayMinus = this.createArrowButton(145, 295, '◀', () => {
            this.birthDay = this.birthDay <= 1 ? 31 : this.birthDay - 1;
            this.refreshPreview();
        });
        const dayPlus = this.createArrowButton(255, 295, '▶', () => {
            this.birthDay = this.birthDay >= 31 ? 1 : this.birthDay + 1;
            this.refreshPreview();
        });
        this.dayText = this.add.text(200, 295, String(this.birthDay).padStart(2, '0'), {
            fontSize: '20px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);


        this.add.text(500, 265, 'Mese', {
            fontSize: '11px', color: '#aaaaaa', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        const monthMinus = this.createArrowButton(420, 295, '◀', () => {
            this.birthMonth = (this.birthMonth - 1 + 12) % 12;
            this.refreshPreview();
        });
        const monthPlus = this.createArrowButton(580, 295, '▶', () => {
            this.birthMonth = (this.birthMonth + 1) % 12;
            this.refreshPreview();
        });
        this.monthText = this.add.text(500, 295, this.monthNames[this.birthMonth], {
            fontSize: '16px', color: '#ffd700', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);


        this.add.text(400, 345, `Anno: ${this.birthYear}`, {
            fontSize: '12px', color: '#666666', fontFamily: 'Fredoka'
        }).setOrigin(0.5);


        this.add.rectangle(400, 400, 480, 60, 0x0a0a0a)
            .setStrokeStyle(1, 0x444444);

        this.add.text(160, 385, 'CODICE FISCALE', {
            fontSize: '10px', color: '#aaaaaa', fontFamily: 'Fredoka'
        }).setOrigin(0, 0.5);

        this.cfText = this.add.text(400, 410, '', {
            fontSize: '18px', color: '#2ecc71', fontStyle: 'bold', fontFamily: 'monospace'
        }).setOrigin(0.5);


        const confirmBtn = this.add.rectangle(400, 480, 240, 44, 0x27ae60)
            .setStrokeStyle(1.5, 0xffffff)
            .setInteractive({ useHandCursor: true });
        const confirmTxt = this.add.text(400, 480, '✅ CONFERMA', {
            fontSize: '15px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        confirmBtn.on('pointerover', () => confirmBtn.setFillStyle(0x2ecc71));
        confirmBtn.on('pointerout', () => confirmBtn.setFillStyle(0x27ae60));
        confirmBtn.on('pointerdown', () => this.confirm());

        this.errorText = this.add.text(400, 520, '', {
            fontSize: '11px', color: '#e74c3c', fontFamily: 'Fredoka'
        }).setOrigin(0.5);

        this.refreshPreview();


        this.time.delayedCall(100, () => {
            if (this.nameInput) this.nameInput.focus();
        });
    }

    createArrowButton(x, y, label, callback) {
        const btn = this.add.rectangle(x, y, 30, 30, 0x2c1a11)
            .setStrokeStyle(1, 0xd27d2d)
            .setInteractive({ useHandCursor: true });
        const txt = this.add.text(x, y, label, {
            fontSize: '14px', color: '#ffffff', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5);
        btn.on('pointerover', () => btn.setFillStyle(0xd27d2d));
        btn.on('pointerout', () => btn.setFillStyle(0x2c1a11));
        btn.on('pointerdown', () => {
            if (window.triggerSfx) window.triggerSfx('click');
            callback();
        });
        return { btn, txt };
    }

    positionNameInput() {
        if (!this.nameInput) return;
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / 800;
        const scaleY = rect.height / 600;
        this.nameInput.style.left = `${(200 * scaleX) + rect.left}px`;
        this.nameInput.style.top = `${(158 * scaleY) + rect.top}px`;
        this.nameInput.style.width = `${400 * scaleX}px`;
        this.nameInput.style.height = `${32 * scaleY}px`;
        this.nameInput.style.fontSize = `${18 * scaleX}px`;
    }

    refreshPreview() {
        if (this.dayText) {
            this.dayText.setText(String(this.birthDay).padStart(2, '0'));
        }
        if (this.monthText) {
            this.monthText.setText(this.monthNames[this.birthMonth]);
        }
        if (this.cfText) {
            this.cfText.setText(this.generateCFPreview());
        }
    }

    generateCFPreview() {
        const nickname = (this.nickname || 'CAMERIERA').toUpperCase().replace(/[^A-Z]/g, '');
        const consonants = nickname.replace(/[AEIOU]/g, '');
        const vowels = nickname.replace(/[^AEIOU]/g, '');
        const surname = (consonants + vowels + 'XXX').slice(0, 3);
        const name = 'MRN';

        const year = String(this.birthYear).slice(-2);
        const monthLetter = this.monthLetters[this.birthMonth];
        const femaleDay = this.birthDay + 40;
        const dayStr = String(femaleDay).padStart(2, '0');
        const comune = 'G273';
        const control = 'Z';

        return `${surname}${name}${year}${monthLetter}${dayStr}${comune}${control}`;
    }

    confirm() {
        const cleanName = (this.nickname || '').trim().toUpperCase().replace(/[^A-Z]/g, '');

        if (cleanName.length < 2) {
            if (this.errorText) this.errorText.setText('⚠️ Il nome deve avere almeno 2 lettere');
            return;
        }

        if (this.errorText) this.errorText.setText('');
        if (window.triggerSfx) window.triggerSfx('coin');


        localStorage.setItem('waitress_nickname', cleanName);
        localStorage.setItem('waitress_birth_day', String(this.birthDay));
        localStorage.setItem('waitress_birth_month', String(this.birthMonth));
        localStorage.setItem('waitress_birth_year', String(this.birthYear));
        localStorage.setItem('waitress_identity_created', 'true');


        try {
            const sd = JSON.parse(localStorage.getItem('waitress_save_data') || '{}');
            const data = sd.data || sd;
            data.nickname = cleanName;
            data.birthDay = this.birthDay;
            data.birthMonth = this.birthMonth;
            data.birthYear = this.birthYear;
            if (sd.data) sd.data = data;
            else Object.assign(sd, data);
            localStorage.setItem('waitress_save_data', JSON.stringify(sd));
        } catch (e) {}


        this.destroyHtmlInputs();
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(400, () => {
            const introSeen = localStorage.getItem('waitress_intro_seen') === 'true';
            this.scene.start(introSeen ? 'Game' : 'Intro');
        });
    }

    destroyHtmlInputs() {
        if (this.nameInput && this.nameInput.parentNode) {
            this.nameInput.parentNode.removeChild(this.nameInput);
        }
        this.nameInput = null;
    }
}

window.NewPlayerScene = NewPlayerScene;