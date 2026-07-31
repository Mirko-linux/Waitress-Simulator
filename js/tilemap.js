// ============================================
// TILEMAP SYSTEM NORMALIZZATO (TOP-DOWN 2D)
// ============================================

class TilemapSystem {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = 32;
        this.mapWidth = 25;  // 800px / 32
        this.mapHeight = 19; // 600px / 32
        
        // Tipi di Tile
        this.tiles = {
            FLOOR_SALA: 0,
            FLOOR_CUCINA: 1,
            WALL_TOP: 2,
            WALL_FRONT: 3
        };
        
        this.mapData = [];
        this.collisionLayer = [];
        this.wallGroup = null;
        
        this.initMap();
    }
    
    initMap() {
        // Inizializza le matrici
        for (let row = 0; row < this.mapHeight; row++) {
            this.mapData[row] = [];
            this.collisionLayer[row] = [];
            
            for (let col = 0; col < this.mapWidth; col++) {
                let isWall = false;
                let tileType = this.tiles.FLOOR_SALA;
                
                // Muro Perimetrale Superiore (Riga 0 = Tetto del muro, Riga 1 = Facciata frontale)
                if (row === 0) {
                    tileType = this.tiles.WALL_TOP;
                    isWall = true;
                } else if (row === 1) {
                    tileType = this.tiles.WALL_FRONT;
                    isWall = true;
                } 
                // Muri Perimetrali Laterali ed Inferiori
                else if (row === this.mapHeight - 1 || col === 0 || col === this.mapWidth - 1) {
                    tileType = this.tiles.WALL_TOP;
                    isWall = true;
                }
                // Muro divisorio centrale (es. colonna 18 con varco/porta al centro)
                else if (col === 18 && (row < 8 || row > 11)) {
                    tileType = this.tiles.WALL_TOP;
                    isWall = true;
                }
                // Pavimenti
                else if (col > 18) {
                    tileType = this.tiles.FLOOR_CUCINA;
                } else {
                    tileType = this.tiles.FLOOR_SALA;
                }
                
                this.mapData[row][col] = tileType;
                this.collisionLayer[row][col] = isWall;
            }
        }
    }
    
    createTileMap() {
        this.destroy(); // Pulizia
        
        // Gruppo di fisica statico per le collisioni con i muri
        if (this.scene.physics) {
            this.wallGroup = this.scene.physics.add.staticGroup();
        }

        for (let row = 0; row < this.mapHeight; row++) {
            for (let col = 0; col < this.mapWidth; col++) {
                const x = col * this.tileSize;
                const y = row * this.tileSize;
                const tileType = this.mapData[row][col];
                
                // 1. Disegna SEMPRE prima il pavimento di fondo (depth: 0)
                const floorKey = (col > 18) ? 'floor_cucina' : 'floor_sala';
                const floor = this.scene.add.image(x, y, floorKey);
                floor.setOrigin(0, 0);
                floor.setDisplaySize(this.tileSize, this.tileSize);
                floor.setDepth(0);

                // 2. Disegna i Muri sopra il pavimento
                if (tileType === this.tiles.WALL_TOP || tileType === this.tiles.WALL_FRONT) {
                    const wallKey = 'wall'; // Puoi separare in 'wall_top' e 'wall_front' se hai sprite dedicati
                    
                    if (this.wallGroup) {
                        const wall = this.wallGroup.create(x + 16, y + 16, wallKey);
                        wall.setDisplaySize(this.tileSize, this.tileSize);
                        wall.refreshBody();
                        wall.setDepth(10); // Imposta la profondità sopra il pavimento
                    } else {
                        const wall = this.scene.add.image(x, y, wallKey);
                        wall.setOrigin(0, 0);
                        wall.setDisplaySize(this.tileSize, this.tileSize);
                        wall.setDepth(10);
                    }
                }
            }
        }
    }

    isWalkable(x, y) {
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        
        if (col < 0 || col >= this.mapWidth || row < 0 || row >= this.mapHeight) {
            return false;
        }
        
        return !this.collisionLayer[row][col];
    }

    destroy() {
        if (this.wallGroup) {
            this.wallGroup.clear(true, true);
        }
    }
}

window.TilemapSystem = TilemapSystem;