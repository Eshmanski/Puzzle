  class Form {
    constructor(mediator) {
      this.mediator = mediator;

      this.form = document.createElement('div');
      this.form.insertAdjacentHTML(`afterbegin`,
      `
        <div class="drawer"><i class="fas fa-arrow-right"></i></div>
        <h3 class="titleForm">Контроллер</h3>
        <hr>
        <h4 class="title">Добавить картинку</h4>
        <form class="addImgForm">
          <p class="validator" >.</p>
          <input name="imgUrl" class="input" placeholder="URL картинки">
          <button type="submit" class="btn addBtn">Добавить картинку</button>
        </form>

        <h4 class="title">Выберете кол-во сегментов</h4>
        <form class="splitForm">
          <p class="validator" >.</p>
          <div>
            <input name="splitX" class="input" placeholder="X">
            <i class="fas fa-times"></i>
            <input name="splitY" class="input" placeholder="Y"> 
          </div>
          <button type="submit" class="btn splitBtn">Разбить</button>
        </form>
        <br>
        <button class="btn showBtn">Показать плитки</button>

        <button class="btn shaflBtn">Перемешать</button>
      `);

      this.form.className = 'Form';

      this.isShow = false;
      this.isOpen = false;
      this.drawer = this.form.querySelector('.drawer');
      this.addImgForm = this.form.querySelector('.addImgForm');
      this.splitForm = this.form.querySelector('.splitForm');
      this.showBtn = this.form.querySelector('.showBtn');
      this.shaflBtn = this.form.querySelector('.shaflBtn');
    }

    init(rootEl) {
      rootEl.insertAdjacentElement('beforeend', this.form);

      this.drawer.onclick = this.drawerSwitcher.bind(this);

      this.showBtn.onclick = () => this.mediator.callMethod('toggleTiles');   
      
      this.shaflBtn.onclick = () => this.mediator.callMethod('shaflTiles'); 

      this.addImgForm.onsubmit = this.addImg.bind(this);

      this.splitForm.onsubmit = this.setSplit.bind(this);

    }

    setSplit(event) {
      event.preventDefault();

      const splitX = Number(event.target.splitX.value);
      const splitY = Number(event.target.splitY.value);
      const validator = event.target.querySelector('.validator');

      
      if(isNaN(splitX * splitY)) {
        this.showValidator(
          validator,
          'Значение должно быть числом');
      } else if(!(splitX > 0 && splitX < 21 && splitY > 0 && splitY < 21)) {
        this.showValidator(
          validator,
          'Значение должно быть от 1 до 20');
        
      } else {
          this.mediator.callMethod('splitTiles', splitX, splitY); 

          event.target.splitX.value = '';
          event.target.splitY.value = '';
          this.hideValidator(validator);
      }
    }

    addImg(event) {
      event.preventDefault();

      const imgUrl = event.target.imgUrl.value;
      const validator = event.target.querySelector('.validator');

      if(imgUrl.match(/^https:\/\/\S+\.jpg|jpeg|png$/)) {
        this.mediator.callMethod('addImage', imgUrl);

        event.target.imgUrl.value = '';
        this.hideValidator(validator);
      } else {
        this.showValidator(
          validator,
          'Введен некорректный Url');
      }
    }

    showValidator(validator, message) {
      validator.textContent = message;
      validator.style.visibility = 'visible';
    }

    hideValidator(validator) {
      validator.textContent = '.';
      validator.style.visibility = 'hidden';
    }

    drawerSwitcher() {
      if(this.isOpen) { 
        this.form.style.right = '-10px';
        this.drawer.innerHTML = '<i class="fas fa-arrow-right"></i>';
        this.isOpen = false;
      } else {
        this.form.style.right = '-215px';
        this.drawer.innerHTML = '<i class="fas fa-times"></i>';
        this.isOpen = true;
      }
    }
  }



  export default Form;