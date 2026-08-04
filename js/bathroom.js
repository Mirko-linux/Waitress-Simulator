class BathroomSystem {
    constructor(scene) {
        this.scene = scene;
        
        
        this.baseIncrementRate = 0.08; 
        
        
        this.bathroomX = 620;
        this.bathroomY = 440;
        this.bathroomWidth = 150;
        this.bathroomHeight = 130;
        
        
        this.entryX = this.bathroomX - 6;    
        this.entryY = this.bathroomY + 65;   

        this.bathroomOccupied = false;
        this.occupiedText = null;
        this.customersInQueue = [];
        
        this.createBathroomGraphics();
    }

    createBathroomGraphics() {
        const scene = this.scene;
        
        
        const floorBg = scene.add.rectangle(
            this.bathroomX + 75, 
            this.bathroomY + 65, 
            this.bathroomWidth, 
            this.bathroomHeight, 
            0x2c3e50, 0.9
        );
        floorBg.setDepth(0); 
        floorBg.setStrokeStyle(2, 0x1a252f);
        
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const color = (i + j) % 2 === 0 ? 0x34495e : 0x2c3e50;
                const tile = scene.add.rectangle(
                    this.bathroomX + 20 + i * 35, 
                    this.bathroomY + 20 + j * 30, 
                    32, 28, 
                    color
                );
                tile.setDepth(1);
            }
        }
        
        
        
        const leftWallTop = scene.add.rectangle(
            this.bathroomX - 6, 
            this.bathroomY + 25, 
            12, 
            45, 
            0x1a252f
        );
        leftWallTop.setDepth(2);
        
        const leftWallBottom = scene.add.rectangle(
            this.bathroomX - 6, 
            this.bathroomY + 105, 
            12, 
            50, 
            0x1a252f
        );
        leftWallBottom.setDepth(2);
        
        
        const rightWall = scene.add.rectangle(
            this.bathroomX + this.bathroomWidth + 6, 
            this.bathroomY + 65, 
            12, 
            this.bathroomHeight, 
            0x1a252f
        );
        rightWall.setDepth(2);
        
        
        const topWall = scene.add.rectangle(
            this.bathroomX + 75, 
            this.bathroomY - 6, 
            this.bathroomWidth, 
            12, 
            0x1a252f
        );
        topWall.setDepth(2);
        
        
        const bottomWall = scene.add.rectangle(
            this.bathroomX + 75, 
            this.bathroomY + this.bathroomHeight + 6, 
            this.bathroomWidth, 
            12, 
            0x1a252f
        );
        bottomWall.setDepth(2);

        
        
        const doorFrame = scene.add.rectangle(
            this.entryX + 6, 
            this.entryY + 2, 
            38,  
            54,  
            0x2c3e50
        );
        doorFrame.setDepth(3);
        doorFrame.setStrokeStyle(2, 0x7f8c8d);
        
        
        const handle = scene.add.rectangle(
            this.entryX + 12, 
            this.entryY + 2, 
            4, 10, 
            0xf1c40f
        );
        handle.setDepth(4);

        
        const doorSign = scene.add.text(
            this.entryX + 6, 
            this.entryY - 20, 
            '🚻 INGRESSO', {
                fontSize: '10px',
                color: '#1abc9c',
                fontStyle: 'bold',
                fontFamily: 'Fredoka',
                backgroundColor: '#110906',
                padding: { x: 4, y: 2 }
            }
        ).setOrigin(0.5).setDepth(4);

        
        const wcX = this.bathroomX + 95;
        const wcY = this.bathroomY + 60;
        
        const cubicle = scene.add.rectangle(wcX, wcY, 55, 65, 0x3d2518);
        cubicle.setDepth(3);
        cubicle.setStrokeStyle(2, 0x5c2c16);
        
        const toilet = scene.add.text(wcX, wcY, '🚽', { fontSize: '40px' }).setOrigin(0.5).setDepth(4);
        const tp = scene.add.text(wcX + 20, wcY - 15, '🧻', { fontSize: '16px' }).setOrigin(0.5).setDepth(4);
        
        
        const sign = scene.add.text(this.bathroomX + 75, this.bathroomY - 20, '🚻 WC', {
            fontSize: '16px', color: '#1abc9c', fontStyle: 'bold', fontFamily: 'Fredoka'
        }).setOrigin(0.5).setDepth(4);
        
        this.occupiedText = scene.add.text(this.bathroomX + 75, this.bathroomY + 25, '🔴 OCCUPATO', {
            fontSize: '12px', color: '#e74c3c', fontStyle: 'bold', fontFamily: 'Fredoka', 
            backgroundColor: '#110906', padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setDepth(5).setVisible(false);
        
        
        this.wcX = wcX;
        this.wcY = wcY;
    }

    
    update(time, delta) {
        if (!this.scene || !this.scene.gameActive) return;
        const deltaSec = delta / 1000;

        this.scene.customers.forEach(customer => {
            if (!customer || customer.isInBathroom || customer.isDead) return;

            customer.bladder = customer.bladder || 0; 
            
            let rate = this.baseIncrementRate;
            if (customer.gender === 'female') rate *= 1.4;

            customer.bladder += rate * deltaSec;
            
            
            if (customer.liquidBonus && customer.liquidBonus > 0) {
                customer.bladder += customer.liquidBonus;
                customer.liquidBonus = 0;
            }

            if (customer.bladder > 100) customer.bladder = 100;

            this.updateBathroomBubble(customer);

            const threshold = customer.gender === 'female' ? 75 : 95;
            if (customer.bladder >= threshold && !customer.isInBathroom) {
                this.goToBathroom(customer);
            }
        });

        this.processQueue();
    }

    forceBathroom(customer) {
        if (!customer || customer.isDead || customer.isInBathroom) return false;
        customer.bladder = 100;
        this.goToBathroom(customer);
        return true;
    }

    updateBathroomBubble(customer) {
        if (customer.bladder > 40 && !customer.bubbleIcon) {
            customer.bubbleIcon = this.scene.add.text(
                customer.x, customer.y - 40, '🚽', { fontSize: '28px' }
            ).setOrigin(0.5).setDepth(10);
        } else if (customer.bladder <= 40 && customer.bubbleIcon) {
            customer.bubbleIcon.destroy();
            customer.bubbleIcon = null;
        }
    }

    goToBathroom(customer) {
        if (this.bathroomOccupied) {
            if (!this.customersInQueue.includes(customer)) {
                this.customersInQueue.push(customer);
                customer.patience -= 0.5;
            }
            return;
        }

        this.bathroomOccupied = true;
        customer.isInBathroom = true;
        this.occupiedText.setVisible(true);
        
        if (customer.bubbleIcon) {
            customer.bubbleIcon.destroy();
            customer.bubbleIcon = null;
        }

        const originalX = customer.x;
        const originalY = customer.y;

        
        this.scene.tweens.add({
            targets: customer,
            x: this.entryX,    
            y: this.entryY,
            duration: 500,
            ease: 'Quad.easeIn',
            onComplete: () => {
                
                customer.x = this.wcX;
                customer.y = this.wcY + 20;
                
                if (customer.sprite) customer.sprite.setVisible(false);
                if (customer.emoji) customer.emoji.setVisible(false);
                if (customer.shadow) customer.shadow.setVisible(false);
                if (customer.orderBubble) customer.orderBubble.setVisible(false);
                if (customer.chatBubble) customer.chatBubble.setVisible(false);
                
                const stayTime = Phaser.Math.Between(3000, 6000);
                if (customer.timerEvent) customer.timerEvent.paused = true;

                this.scene.time.delayedCall(stayTime, () => {
                    this.bathroomOccupied = false;
                    this.occupiedText.setVisible(false);
                    customer.isInBathroom = false;
                    customer.bladder = 0;
                    if (customer.timerEvent) customer.timerEvent.paused = false;

                    if (customer.sprite) customer.sprite.setVisible(true);
                    if (customer.emoji) customer.emoji.setVisible(true);
                    if (customer.shadow) customer.shadow.setVisible(true);
                    if (customer.orderBubble) customer.orderBubble.setVisible(true);
                    if (customer.chatBubble) customer.chatBubble.setVisible(true);

                    this.scene.tweens.add({
                        targets: customer,
                        x: originalX,
                        y: originalY,
                        duration: 500,
                        ease: 'Quad.easeOut'
                    });
                    this.processQueue();
                });
            }
        });
    }

    processQueue() {
        if (!this.bathroomOccupied && this.customersInQueue.length > 0) {
            const nextCustomer = this.customersInQueue.shift();
            if (nextCustomer && !nextCustomer.isDead) {
                this.goToBathroom(nextCustomer);
            }
        }
    }

    reset() {
        this.bathroomOccupied = false;
        this.customersInQueue = [];
        if (this.occupiedText) this.occupiedText.setVisible(false);
    }
}
window.BathroomSystem = BathroomSystem;
console.log('🚻 BathroomSystem: Coordinate di ingresso e dimensioni porta corrette!');