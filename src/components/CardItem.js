import Ga from '../services/ga.js';
import Ls from '../services/ls.js';

export class CardItem extends HTMLElement {
  #ga = new Ga();
  #ls = new Ls();

  #shadow = this.attachShadow({ mode: 'closed' });

  #content = null;

  #day = '';
  #title = '';
  #description = '';

  #column = '';
  #row = '';

  #main = false;
  #opened = false;
  #locked = true;

  constructor({ day, title, description, column, row, main, opened, locked }) {
    super();

    this.#day = day;
    this.#title = title;
    this.#description = description;

    this.#column = column;
    this.#row = row;

    this.#main = main;
    this.#opened = opened || false;
    this.#locked = locked;
  }

  async connectedCallback() {
    this.#addStyles();
    this.#buildUI();
    this.#addInteraction();
  }

  #addStyles() {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(`
      :host {
        grid-column: ${ this.#column };
        grid-row: ${ this.#row };

        perspective: 1000px;
      }

      .card-item__content--opened {
        transform: rotateY(180deg);
      }

      .card-item__content {
        position: relative;

        width: 100%;
        height: 100%;

        transition: transform 0.8s;
        transform-style: preserve-3d;
      }

      .card-item__front,
      .card-item__back {
        position: absolute;

        width: 100%;
        height: 100%;

        padding: 8px;
        box-sizing: border-box;

        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }

      .card-item__front-wrapper,
      .card-item__back-wrapper {
        border-radius: 8px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;

        box-sizing: border-box;
      }

      .card-item__front {
        background-color: ${ this.#main ? '#94bad5' : '#e64c3d' };
        border-radius: 8px;

        cursor: ${ this.#main ? 'default' : 'pointer' };
      }

      .card-item__back {
        background-color: #ffffff;
        border-radius: 8px;
        transform: rotateY(180deg);
      }

      .card-item__front-wrapper,
      .card-item__back-wrapper {
        width: 100%;
        height: 100%;
      }

      .card-item__front-wrapper {
        color: #fff;
        border: 2px dashed #fff;
      }

      .card-item__back-wrapper {
        color: #000;
        border: 2px dashed #000;
      }

      .card-item__wrapper * {
        user-select: none;
      }

      .card-item__title {
        font-size: 14px;
        font-weight: 700;
        margin: 0;
      }

      .card-item__description {
        font-size: 12px;
        font-weight: 700;
        margin: 0;
      }
    `);

    this.#shadow.adoptedStyleSheets = [ sheet ];
  }

  #buildUI() {
    this.className = 'card-item';

    this.#content = document.createElement('div');
    this.#content.className = 'card-item__content';
    this.#shadow.appendChild(this.#content);

    const frontSide = document.createElement('div');
    frontSide.className = 'card-item__front';
    this.#content.appendChild(frontSide);

    const frontWrapper = document.createElement('div');
    frontWrapper.className = 'card-item__front-wrapper';
    frontSide.appendChild(frontWrapper);

    const day = document.createElement('h2');
    day.className = 'card-item__day';
    day.textContent = this.#day;
    frontWrapper.appendChild(day);


    const backSide = document.createElement('div');
    backSide.className = 'card-item__back';
    this.#content.appendChild(backSide);

    const backWrapper = document.createElement('div');
    backWrapper.className = 'card-item__back-wrapper';
    backSide.appendChild(backWrapper);

    const title = document.createElement('h3');
    title.className = 'card-item__title';
    title.textContent = this.#title;
    backWrapper.appendChild(title);

    const description = document.createElement('p');
    description.className = 'card-item__description';
    description.textContent = this.#description;
    backWrapper.appendChild(description);
  }

  #addInteraction() {
    if (this.#active) {
      this.addEventListener('click', () => this.#onClick());
    }
  }

  #onClick() {
    if (this.#locked || this.#opened) return;

      this.#opened = true;
      this.#content.classList.add('card-item__content--opened');
    });
    this.#opened = true;
    this.#content.classList.add('card-item__content--opened');

    this.#ga.sendCardOpen(this.#id);
    this.#ls.setCardOpen(this.#id);
  }
}

customElements.define('card-item-container', CardItem);
