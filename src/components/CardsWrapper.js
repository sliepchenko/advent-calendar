import { CardItem } from './CardItem.js';

export class CardsWrapper extends HTMLElement {
  #shadow = this.attachShadow({ mode: 'closed' });

  #config = {
    cards: {
      columns: 0,
      rows: 0,
      items: []
    }
  };

  constructor() {
    super();
  }

  async connectedCallback() {
    this.#config = await fetch('./assets/config.json')
      .then(response => response.json());

    this.#addStyles();
    this.#buildUI();
  }

  #addStyles() {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(`
      :host {
        display: grid;
        grid-template-columns: repeat(${ this.#config.cards.columns }, 128px);
        grid-template-rows: repeat(${ this.#config.cards.rows }, 128px);
        gap: 8px;
        justify-content: center;

        margin: 16px auto;
      }
    `);

    this.#shadow.adoptedStyleSheets = [ sheet ];
  }

  #buildUI() {
    this.#config.cards.items
      .map(item => this.#shadow.appendChild(new CardItem(item)));
  }
}

customElements.define('cards-wrapper-container', CardsWrapper);
