import Ga from '../services/ga.js';
import Ls from '../services/ls.js';

import { Dialog } from './Dialog.js';

export class CardItem extends HTMLElement {
  #ga = new Ga();
  #ls = new Ls();

  #shadow = this.attachShadow({ mode: 'closed' });

  #content = null;

  #id = null;

  #frontTitle = '';

  #backTitle = '';
  #backDescription = '';

  #modalTitle;
  #modalDescription;
  #modalLink;

  #column = '';
  #row = '';

  #active = false;
  #opened = false;
  #locked = true;

  constructor(config) {
    super();

    this.#id = config.id;

    this.#frontTitle = config.front.title

    this.#backTitle = config.back.title;
    this.#backDescription = config.back.description;

    this.#modalTitle = config.modal.title;
    this.#modalDescription = config.modal.description;
    this.#modalLink = config.modal.link;

    this.#column = config.position.column;
    this.#row = config.position.row;

    this.#active = config.state.active;
    this.#opened = this.#ls.isCardOpen(config.id) || config.state.opened;
    this.#locked = config.state.locked;
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
        background-color: ${ this.#active ? '#e64c3d' : '#94bad5' };
        border-radius: 8px;

        cursor: ${ this.#active ? 'pointer' : 'default' };
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
        color: #213a4b;
        border: 2px dashed #213a4b;
      }

      .card-item__wrapper * {
        user-select: none;
      }

      .card-item__title {
        font-size: 14px;
        line-height: 1.2;
        font-weight: 500;
        margin: 0;
      }

      .card-item__description {
        font-family: 'Calibri', sans-serif;
        font-size: 12px;
        font-weight: 100;
        margin: 4px 0 0;
        padding: 2px;
      }

      .card-item__button {
        margin-top: 8px;
        padding: 2px 8px;
        border: 1px solid #213a4b;
        border-radius: 4px;
        color: #fff;
        background-color: #213a4b;
        cursor: pointer;
      }
    `);

    this.#shadow.adoptedStyleSheets = [ sheet ];
  }

  #buildUI() {
    this.className = 'card-item';

    this.#content = document.createElement('div');
    this.#content.className = 'card-item__content';
    this.#shadow.appendChild(this.#content);

    if (this.#opened) {
      this.#content.classList.add('card-item__content--opened');
    }

    const frontSide = document.createElement('div');
    frontSide.className = 'card-item__front';
    this.#content.appendChild(frontSide);

    const frontWrapper = document.createElement('div');
    frontWrapper.className = 'card-item__front-wrapper';
    frontSide.appendChild(frontWrapper);

    const day = document.createElement('h2');
    day.className = 'card-item__day';
    day.textContent = this.#frontTitle;
    frontWrapper.appendChild(day);


    const backSide = document.createElement('div');
    backSide.className = 'card-item__back';
    this.#content.appendChild(backSide);

    const backWrapper = document.createElement('div');
    backWrapper.className = 'card-item__back-wrapper';
    backSide.appendChild(backWrapper);

    const title = document.createElement('h3');
    title.className = 'card-item__title';
    title.textContent = this.#backTitle;
    backWrapper.appendChild(title);

    const description = document.createElement('p');
    description.className = 'card-item__description';
    description.textContent = this.#backDescription;
    backWrapper.appendChild(description);

    const button = document.createElement('button');
    button.className = 'card-item__button';
    button.textContent = 'Learn more';
    button.addEventListener('click', () => this.#onMoreClick());
    backWrapper.appendChild(button);
  }

  #addInteraction() {
    if (this.#active) {
      this.addEventListener('click', () => this.#onFlipClick());
    }
  }

  #onFlipClick() {
    if (this.#locked || this.#opened) return;

    this.#opened = true;
    this.#content.classList.add('card-item__content--opened');

    this.#ga.sendCardOpen(this.#id);
    this.#ls.setCardOpen(this.#id);
  }

  #onMoreClick() {
    if (this.#locked || !this.#opened) return;

    Dialog.open({
      title: this.#modalTitle,
      description: this.#modalDescription,
      link: this.#modalLink
    });

    this.#ga.sendMoreOpen(this.#id);
  }
}

customElements.define('card-item-container', CardItem);
