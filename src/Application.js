import { CardsWrapper } from './CardsWrapper.js';

export class Application extends HTMLElement {
  // this value should be replaced by version.js script
  static VERSION = '2024-10-30 15:46:49';

  #shadow = this.attachShadow({ mode: 'closed' });

  constructor() {
    super();
  }

  async connectedCallback() {
    this.#addStyles();
    this.#buildUI();
  }

  #addStyles() {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(`
      :host {

      }

      .logo {
        display: block;
        margin: 0 auto;
        width: 256px;

        margin-top: 32px;
        filter: drop-shadow(0px 0px 3px rgb(0 0 0 / 0.5));
      }
    `);

    this.#shadow.adoptedStyleSheets = [ sheet ];
  }

  #buildUI() {
    const logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = '../assets/logo.svg';
    logo.alt = 'Logo';
    this.#shadow.appendChild(logo);

    const cardsWrapper = new CardsWrapper();
    this.#shadow.appendChild(cardsWrapper);
  }
}

customElements.define('application-container', Application);
