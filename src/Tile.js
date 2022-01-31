window.pos = []
class Tile {
  constructor({ position, size, id, margin }, el = null) {
    pos.push(position)
    this.position = position;
    this.size = size;
    this.id = id;
    this.margin = margin;
    
    if(!el) {
      this.elTile = document.createElement('div');

      const style = `
      width: ${size.width - margin*2}px; 
      height: ${size.height - margin*2}px; 
      margin: ${margin}px;
      top: ${position.top}px; 
      left: ${position.left}px;
      pointer-events: none;
      `

      this.elTile.style.cssText = style.trim();
      this.elTile.className = 'tile';
      this.elTile.dataset.id = id;
    } else {
      this.elTile = el.cloneNode(true);
    }
  }

  init(rootEl) {
    rootEl.insertAdjacentElement('afterbegin', this.elTile);

    this.elTile.ondragstart = function() {
      return false;
    };
  }

  setImg(imgUrl, width, height) {
    this.elTile.style.backgroundImage = `url(${imgUrl})`;
    this.elTile.style.backgroundSize = `${width + this.margin*2}px ${height + this.margin*2}px`;
    this.elTile.style.backgroundPosition = `-${this.position.left + this.margin}px -${this.position.top + this.margin}px`;
  }

  hideTile() {
    this.elTile.style.visibility = 'hidden';
    this.elTile.style.pointerEvents = 'none';
  }

  showTile() {
    this.elTile.style.visibility = 'visible';
    this.elTile.style.pointerEvents = 'auto';
  }

  clone() {
    return new Tile({
      position: {...this.position}, 
      size: {...this.size},
      id: this.id,
      margin: this.margin,
    }, this.elTile);
  }

  changeToMovingTile(x, y) {
    const body = document.querySelector('body');
    body.insertAdjacentElement('afterbegin', this.elTile);
    this.elTile.style.zIndex = 99;
    this.elTile.style.pointerEvents = 'none';
    this.position.top = (y - this.elTile.offsetHeight / 2);
    this.position.left = (x - this.elTile.offsetWidth / 2);
    this.render();
  }

  activeTransition() {
    this.elTile.style.transition = 'all 0.5s ease-in-out';
  }

  disableTransition() {
    this.elTile.style.transition = '';
  }

  initSwapping(tile) {
    this.activeTransition();
          
    this.elTile.onmouseenter = (event) => {
      Tile.swap(tile, this);
    }
  }

  disableSwapping() {
    this.disableTransition();
    this.elTile.onmouseenter = null;
  }

  static swap(tileA, tileB) {
    const buff = tileA.position;
    tileA.position = tileB.position;
    tileB.position = buff;

    tileA.render();
    tileB.render();
  }

  render() {
    this.elTile.style.top = this.position.top + 'px';
    this.elTile.style.left = this.position.left + 'px';
  }

  onMove() {
    let {left: lastLeft, top: lastTop} = { ...this.position };

    document.onmousemove = (event) => {
      setTimeout(() => {
        const top = (event.y - this.elTile.offsetHeight / 2);
        const left = (event.x - this.elTile.offsetWidth / 2);

        const deltaY = top - lastTop;
        const deltaX = left - lastLeft;

        if(deltaY < -1 || deltaY > 1 || deltaX < -1 || deltaX > 1) {
          this.position.top = top;
          lastTop = top;

          this.position.left = left;
          lastLeft = left;

          this.render();
        }
      }, 50);      
    } 
  }

  disableMove() {
    document.onmousemove = null;
  }
  
  remove() {
    this.elTile.remove();
  }
}

export default Tile;