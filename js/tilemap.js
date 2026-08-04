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
        for (let row = 0; row < this.mapHeight; row++) {
            this.mapData[row] = [];
            this.collisionLayer[row] = [];
            for (let col = 0; col < this.mapWidth; col++) {
                let isWall = false;
                let tileType = 0; 
                
                const isPerimeter = (row === 0 || row === this.mapHeight - 1 || col === 0 || col === this.mapWidth - 1);
                
                if (isPerimeter) {
                    
                    if (row === this.mapHeight - 1 && (col >= 6 && col <= 8)) {
                        tileType = 0;
                        isWall = false;
                    } else {
                        tileType = 3; 
                        isWall = true;
                    }
                } 
                
                else if (col === 18) {
                    if (row >= 5 && row <= 7) { 
                        tileType = 1; 
                        isWall = false;
                    } else if (row >= 13 && row <= 15) { 
                        tileType = 2; 
                        isWall = false;
                    } else {
                        tileType = 3; 
                        isWall = true;
                    }
                }
                
                else if (row === 11 && col > 18) {
                    if (col === 21) { 
                        tileType = 1;
                        isWall = false;
                    } else {
                        tileType = 3;
                        isWall = true;
                    }
                }
                
                else if (col > 18) {
                    if (row < 11) {
                        tileType = 1; 
                        isWall = false;
                    } else if (row > 11) {
                        tileType = 2; 
                        isWall = false;
                    } else {
                        tileType = 3;
                        isWall = true;
                    }
                } 
                else {
                    tileType = 0; 
                    isWall = false;
                }
                
                this.mapData[row][col] = tileType;
                this.collisionLayer[row][col] = isWall;
            }
        }
    }
    
    createTileMap() {
        this.destroy();
        
        if (this.scene.physics) {
            this.wallGroup = this.scene.physics.add.staticGroup();
        }

        
        
        for (let row = 0; row < this.mapHeight; row++) {
            for (let col = 0; col < this.mapWidth; col++) {
                const x = col * this.tileSize;
                const y = row * this.tileSize;
                const isWall = this.collisionLayer[row][col];
                const tileType = this.mapData[row][col];
                
                if (!isWall) {
                    let floorKey = 'floor_sala';
                    if (tileType === 1) floorKey = 'floor_cucina';
                    else if (tileType === 2) floorKey = 'floor_bagno';
                    
                    this.scene.add.image(x, y, floorKey)
                        .setOrigin(0, 0)
                        .setDisplaySize(this.tileSize, this.tileSize)
                        .setDepth(0); 
                }
            }
        }

        
        
        for (let row = 0; row < this.mapHeight; row++) {
            for (let col = 0; col < this.mapWidth; col++) {
                const isWall = this.collisionLayer[row][col];
                
                if (isWall) {
                    const x = col * this.tileSize + 16;
                    const y = row * this.tileSize + 16;
                    
                    
                    const wall = this.wallGroup.create(x, y, 'wall');
                    wall.setDisplaySize(this.tileSize, this.tileSize);
                    wall.setDepth(2);
                    wall.refreshBody();

                    
                    
                    
                }
            }
        }
        
        
        
        
        const rightEdgeCol = this.mapWidth - 1;
        for (let row = 1; row < this.mapHeight - 1; row++) {
            
            if (row !== 11) { 
                
                
                if (this.collisionLayer[row] && this.collisionLayer[row][rightEdgeCol]) {
                    
                    this.collisionLayer[row][rightEdgeCol] = false;
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

    destroy() {
        if (this.wallGroup) {
            this.wallGroup.clear(true, true);
        }
    }
}

window.TilemapSystem = TilemapSystem;