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

      @media (max-width: 768px) {
       :host {
          grid-template-columns: repeat(5, 128px);
          grid-template-rows: repeat(6, 128px);
        }
      }

      @media (max-width: 425px) {
       :host {
          grid-template-columns: repeat(3, 120px);
          grid-template-rows: repeat(9, 120px);
        }
      }
    `);

    this.#shadow.adoptedStyleSheets = [ sheet ];
  }

  #buildUI() {
    this.#config.cards.items
      .sort(() => Math.random() - 0.5)
      // item with id 0 is the first card
      .sort((a, b) => a.id === 0 ? -1 : 0)
      .map(item => this.#shadow.appendChild(new CardItem(item)));
  }
}

customElements.define('cards-wrapper-container', CardsWrapper);
