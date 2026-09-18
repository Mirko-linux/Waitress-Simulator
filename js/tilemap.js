// tilemap.js - Versione CORRETTA
class TilemapSystem {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = 32;
        this.mapWidth = 25;
        this.mapHeight = 19;
        
        this.mapData = [];
        this.collisionLayer = [];
        this.wallGroup = null;

        this.initMap();
    }

    initMap() {
        this.mapData = [];
        this.collisionLayer = [];

        for (let row = 0; row < this.mapHeight; row++) {
            this.mapData[row] = [];
            this.collisionLayer[row] = [];

            for (let col = 0; col < this.mapWidth; col++) {
                let floorType = 0;
                let isWall = false;

                // MURI ESTERNI
                if (row === 0 || row === this.mapHeight - 1 || col === 0 || col === this.mapWidth - 1) {
                    isWall = true;
                }

                // ZONA CUCINA (colonne 19-23)
                if (col >= 19 && col <= 23 && !isWall) {
                    floorType = 1;
                }

                // MURO VERTICALE TRA SALA E CUCINA (colonna 18)
                if (col === 18 && !isWall) {
                    // Apri passaggio centrale (righe 8-10)
                    if (row >= 8 && row <= 10) {
                        isWall = false;
                    } else {
                        isWall = true;
                    }
                }

                // ZONA BAGNO (colonne 19-21, righe 15-17)
                if (col >= 19 && col <= 21 && row >= 15 && row <= 17 && !isWall) {
                    floorType = 2;
                }

                // PORTA DI INGRESSO (riga 18, colonne 6-8)
                if (row === 18 && col >= 6 && col <= 8) {
                    isWall = false;
                    floorType = 0;
                }

                // CORRIDOIO DALLA PORTA AI TAVOLI (colonne 6-8, righe 17-18)
                if (row === 17 && col >= 6 && col <= 8) {
                    isWall = false;
                    floorType = 0;
                }

                // CORRIDOIO ORIZZONTALE (colonne 0-18, riga 17)
                if (row === 17 && col >= 2 && col <= 18) {
                    isWall = false;
                    floorType = 0;
                }

                // CORRIDOIO VERTICALE DAL LAVELLO (colonna 2-3, righe 10-17)
                if (col >= 2 && col <= 3 && row >= 10 && row <= 17) {
                    isWall = false;
                    floorType = 0;
                }

                this.mapData[row][col] = floorType;
                this.collisionLayer[row][col] = isWall;
            }
        }
    }

    createTileMap() {
        this.destroy();

        if (this.scene.physics) {
            this.wallGroup = this.scene.physics.add.staticGroup();
        }

        this.scene.add.rectangle(400, 300, 800, 600, 0x000000).setDepth(-10);

        for (let row = 0; row < this.mapHeight; row++) {
            for (let col = 0; col < this.mapWidth; col++) {
                const x = col * this.tileSize + this.tileSize / 2;
                const y = row * this.tileSize + this.tileSize / 2;
                const floorType = this.mapData[row][col];
                let floorKey = null;

                if (floorType === 0) floorKey = 'floor_sala';
                else if (floorType === 1) floorKey = 'floor_cucina';
                else if (floorType === 2) floorKey = 'floor_bagno';

                if (floorKey && this.scene.textures.exists(floorKey)) {
                    const floor = this.scene.add.image(x, y, floorKey);
                    floor.setOrigin(0.5, 0.5);
                    floor.setDisplaySize(this.tileSize, this.tileSize);
                    floor.setDepth(0);
                }

                if (this.collisionLayer[row][col]) {
                    if (this.scene.textures.exists('wall')) {
                        const wall = this.wallGroup.create(x, y, 'wall');
                        wall.setOrigin(0.5, 0.5);
                        wall.setDisplaySize(this.tileSize, this.tileSize);
                        wall.setDepth(1);
                        if (wall.body) {
                            wall.body.setSize(this.tileSize, this.tileSize);
                            wall.body.setOffset(0, 0);
                            wall.refreshBody();
                        }
                    } else {
                        const wallRect = this.scene.add.rectangle(x, y, this.tileSize, this.tileSize, 0x111111).setDepth(1);
                        this.wallGroup.create(x, y, null).setSize(this.tileSize, this.tileSize).setVisible(false);
                    }
                }
            }
        }
    }

    isWalkable(x, y) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        if (col < 0 || col >= this.mapWidth || row < 0 || row >= this.mapHeight) return false;
        return !this.collisionLayer[row][col];
    }

    worldToTile(x, y) {
        return { col: Math.floor(x / this.tileSize), row: Math.floor(y / this.tileSize) };
    }

    tileToWorld(col, row) {
        return { x: col * this.tileSize + this.tileSize / 2, y: row * this.tileSize + this.tileSize / 2 };
    }

    destroy() {
        if (this.wallGroup) {
            this.wallGroup.clear(true, true);
            this.wallGroup = null;
        }
    }
}

if (typeof window.TilemapSystem === 'undefined') {
    window.TilemapSystem = TilemapSystem;
}