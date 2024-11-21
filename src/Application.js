import { CardsWrapper } from './components/CardsWrapper.js';

export class Application extends HTMLElement {
  // this value should be replaced by version.js script
  static VERSION = '2024-11-21 16:01:23';

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
        margin: 0 auto;
        width: 256px;
        height: 96px;
      }

      .logo__img {
        filter: drop-shadow(0px 0px 3px rgb(0 0 0 / 0.5));
      }

      .logo__text {
        position: relative;
        top: -48px;
        margin: 0;
        font-size: 32px;
        text-align: right;
        color: var(--black);
        filter: drop-shadow(0px 0px 3px rgb(256 256 256 / 0.5));

        display: flex;
        justify-content: flex-end;
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
        right: 0;
        color: var(--white);
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

    const logoText = document.createElement('div');
    logoText.className = 'logo__text';
    logo.appendChild(logoText);

    const text = document.createElement('span');
    text.textContent = 'Croatia';
    logoText.appendChild(text);

    const coa = document.createElement('img');
    coa.src = './assets/coat_of_arms.png';
    coa.alt = 'Coat of arms';
    coa.width = 23;
    coa.height = 30;
    logoText.appendChild(coa);

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
    this.#audio = new Audio('./assets/sounds/background.wav');
    this.#audio.loop = true;
    this.#audio.volume = 0.5;

    this.#volume.addEventListener('click', () => {
      this.#audio.volume = this.#audio.volume === 0 ? 0.5 : 0;
      this.#volume.textContent = this.#audio.volume === 0 ? '🔇' : '🔊';
    });

    if (document.hasFocus()) {
      this.#audio.play().catch(err => {
        this.addEventListener('click', () => {
          this.#audio.play();
        }, { once: true });
      });
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
