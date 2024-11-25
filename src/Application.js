import { CardsWrapper } from './components/CardsWrapper.js';
import Ls               from './services/ls.js';

export class Application extends HTMLElement {
  // this value should be replaced by version.js script
  static VERSION = '2024-11-25 09:42:57';

  #ls = new Ls();

  #shadow = this.attachShadow({ mode: 'closed' });

  #audio;
  #volume;

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
        text-align: end;
        margin: 0 auto;
        width: 256px;
        height: 96px;

        pointer-events: none;
      }

      .logo__img {
        filter: drop-shadow(0px 0px 3px rgb(0 0 0 / 0.5));
      }

      .logo__text {
        position: relative;
        top: -48px;
        margin: 0;
        font-size: 32px;
        color: var(--black);
        filter: drop-shadow(0px 0px 3px rgb(256 256 256 / 0.5));
      }

      .volume {
        position: fixed;
        top: 32px;
        right: 32px;
        width: 48px;
        height: 48px;
        padding: 8px;
        font-size: 24px;
        color: var(--white);
        background-color: var(--black);
        border: 1px solid var(--white);
        border-radius: 100%;
        cursor: pointer;
      }

      .version {
        position: fixed;
        bottom: 0;
        right: 10px;
        color: var(--white);
        opacity: 0;
      }

      .version:hover {
        opacity: 1;
      }
    `);

    this.#shadow.adoptedStyleSheets = [ sheet ];
  }

  #buildUI() {
    const logo = document.createElement('div');
    logo.className = 'logo';
    this.#shadow.appendChild(logo);

    const logoImage = document.createElement('img');
    logoImage.className = 'logo__img';
    logoImage.src = './assets/logo.svg';
    logoImage.alt = 'Logo';
    logo.appendChild(logoImage);

    const logoText = document.createElement('span');
    logoText.className = 'logo__text';
    logoText.textContent = 'Croatia';
    logo.appendChild(logoText);

    this.#volume = document.createElement('button');
    this.#volume.className = 'volume';
    this.#volume.textContent = '🔊';
    this.#shadow.appendChild(this.#volume);

    const cardsWrapper = new CardsWrapper();
    this.#shadow.appendChild(cardsWrapper);

    const version = document.createElement('div');
    version.className = 'version';
    version.textContent = `Version: ${ Application.VERSION }`;
    this.#shadow.appendChild(version);
  }

  #initSfx() {
    const volume = this.#ls.volume;

    console.log(volume);

    this.#audio = new Audio('./assets/sounds/background.wav');
    this.#audio.loop = true;
    this.#audio.volume = volume;
    this.#volume.textContent = volume === 0 ? '🔇' : '🔊';

    this.#volume.addEventListener('click', () => {
      this.#audio.volume = this.#audio.volume === 0 ? 0.5 : 0;
      this.#volume.textContent = this.#audio.volume === 0 ? '🔇' : '🔊';
      this.#ls.volume = this.#audio.volume;
    });

    if (document.hasFocus()) {
      try {
        this.#audio.play();
      } catch (error) {
        console.error(error);
      }
    }

    window.addEventListener('blur', () => {
      this.#audio.pause();
    });

    window.addEventListener('focus', () => {
      this.#audio.play();
    });
  }
}

customElements.define('application-container', Application);
