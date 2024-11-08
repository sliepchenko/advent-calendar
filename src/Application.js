import { CardsWrapper } from './components/CardsWrapper.js';

export class Application extends HTMLElement {
  // this value should be replaced by version.js script
  static VERSION = '2024-11-08 14:09:06';

  #shadow = this.attachShadow({ mode: 'closed' });

  constructor() {
    super();
  }

  async connectedCallback() {
    this.#addStyles();
    this.#buildUI();
    this.#initSfx();
  }

  #addStyles() {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(`
      :host {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 32px 0 96px;
      }

      .logo {
        display: block;
        margin: 0 auto;
        width: 256px;

        filter: drop-shadow(0px 0px 3px rgb(0 0 0 / 0.5));
      }

      .version {
        position: fixed;
        bottom: 0;
        right: 0;
        color: var(--white);
      }
    `);

    this.#shadow.adoptedStyleSheets = [ sheet ];
  }

  #buildUI() {
    const logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = './assets/logo.svg';
    logo.alt = 'Logo';
    this.#shadow.appendChild(logo);

    const cardsWrapper = new CardsWrapper();
    this.#shadow.appendChild(cardsWrapper);

    const version = document.createElement('div');
    version.className = 'version';
    version.textContent = `Version: ${ Application.VERSION }`;
    // this.#shadow.appendChild(version);
  }

  #initSfx() {
    const audio = new Audio('./assets/sounds/background.wav');
    audio.loop = true;
    audio.volume = 0.5;

    if (document.hasFocus()) {
      audio.play().catch(err => {
        this.addEventListener('click', () => {
          audio.play();
        }, { once: true });
      });
    }

    window.addEventListener('blur', () => {
      audio.pause();
    });

    window.addEventListener('focus', () => {
      audio.play();
    });
  }
}

customElements.define('application-container', Application);
