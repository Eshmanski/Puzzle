import Tile from './Tile';

const defaultOptions = {
  width: 700,
  height: 700,
  segmentsX: 2,
  segmentsY: 2,
}

class Display {
  constructor(mediator, options = defaultOptions) {
      const {width, height, segmentsX, segmentsY} = options;

      this.isShow = false;
      this.mediator = mediator;
      this.imgUrl = 'https://avatarko.ru/img/kartinka/10/kot_mysh_9796.jpg',
      this.margin = 1,
      this.height = height;
      this.width = width;
  

    this.elDisplay = document.createElement('div');
    this.elDisplay.className = 'display';
    this.elDisplay.style.cssText = `
    height: ${height}px; 
    width: ${width}px;
    min-width: ${width}px;
    padding: ${this.margin}px;
    background-image: url("${this.imgUrl}");
    background-size: ${width + this.margin*2}px ${height + this.margin*2}px;
    `;
    
    this.tiles = this.createTiles(segmentsX, segmentsY);
  }

  init(rootEl) {
    rootEl.insertAdjacentElement('afterbegin', this.elDisplay);
    
    this.tiles.forEach((tile) => {
      tile.init(this.elDisplay);
      tile.setImg(this.imgUrl, this.width, this.height);
    });

    this.elDisplay.addEventListener('mousedown', (event) => {
      if(event.target.dataset.id + 1) {
        const id = event.target.dataset.id;
        const tileTarget = this.tiles[id];
        
        const tileNew = tileTarget.clone();
        tileNew.changeToMovingTile(event.x, event.y);
        tileNew.onMove();

        tileTarget.hideTile();
        
        this.tiles.filter((_, i) => id != i).forEach(tile => {
          tile.initSwapping(tileTarget);
        });

        document.onmouseup = () => {
          tileTarget.showTile();
          tileNew.disableMove();
          tileNew.remove();

          this.tiles.filter((_, i) => id != i).forEach(tile => {
            tile.disableSwapping();
          });

          document.mouseup = null;
        }
      }
    });

    this.mediator.addMethod('toggleTiles', () => this.toggleTiles());
    this.mediator.addMethod('addImage', (imgUrl) => this.setImage(imgUrl));
    this.mediator.addMethod('splitTiles', (x, y) => this.splitTiles(x, y));
    this.mediator.addMethod('shaflTiles', () => this.shaflTiles());
  }

  shaflTiles() {
    const amountTiles = this.tiles.length;

    this.activeTransitionAll();

    for(let i = 0; i < amountTiles / 2; i++) {
      const firstId = Math.floor(Math.random() * amountTiles);
      const secondId = Math.floor(Math.random() * amountTiles);
      
      Tile.swap(this.tiles[firstId], this.tiles[secondId]);
    }

    this.disableTransitionAll();
  }

  activeTransitionAll() {
    this.tiles.forEach((tile) => {
      tile.activeTransition();
    });
  }

  disableTransitionAll() {

    setTimeout(() => {
      this.tiles.forEach((tile) => {
        tile.disableTransition();
      });
    }, 500);

  }

  splitTiles(x, y) {
    this.hideTiles();

    this.tiles.forEach((tile) => tile.remove());

    this.tiles = this.createTiles(x, y);

    this.tiles.forEach((tile) => {
      tile.init(this.elDisplay);
      tile.setImg(this.imgUrl, this.width, this.height);
    });

    this.showTiles();
  }

  toggleTiles() {
    this.isShow 
      ? this.hideTiles()
      : this.showTiles();
  }

  hideTiles() {
    this.tiles.map(tile => {
      tile.hideTile();
    });
    this.isShow = false;
    this.elDisplay.style.backgroundImage = `url(${this.imgUrl})`;
    
  }

  showTiles() {
    this.tiles.map(tile => {
      tile.showTile();
    });
    this.isShow = true;
    this.elDisplay.style.backgroundImage = '';

  }

  setImage(imgUrl) {
    this.imgUrl = imgUrl;
    this.isShow = false;
    this.elDisplay.style.backgroundImage = `url(${imgUrl})`
    this.tiles.map(tile => {
      tile.hideTile();
      tile.setImg(imgUrl);
    });
  }

  createTiles(x, y) {
    const tileWidth = this.width / x;
    const tileHeight = this.height / y;

    const tiles = new Array(x * y).fill(' ')
      .map((tile, index) => {
        const size = { width: tileWidth, height: tileHeight};
        const top = Math.floor((index)/x) * tileHeight;
        const left = ((index)%x * tileWidth);
        const position = {top: top, left: left};
        tile = new Tile({
          size,
          position,
          id: index,
          margin: this.margin
        });

        return tile;
      });

    return tiles;
  }
 
}

export default Display;