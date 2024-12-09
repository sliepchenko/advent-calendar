import { CardsWrapper } from './components/CardsWrapper.js';
import Ls               from './services/ls.js';
import Ga               from './services/ga.js';

export class Application extends HTMLElement {
  // this value should be replaced by version.js script
  static VERSION = '2024-12-09 16:45:19';

  #ga = new Ga();
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
    this.#initEasteregg();
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

      .easteregg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
      }

      .easteregg__author {
        position: fixed;
        top: 0;
        right: -350px;
        transform: translate(15px, 0) rotate(-90deg);
      }

      .easteregg__author--show {
        animation: show 10s forwards;
        animation-duration: 1s;
        animation-direction: normal;
      }

      .easteregg__author--hide {
        animation: hide 10s forwards;
        animation-duration: 1s;
        animation-direction: normal;
      }

      @keyframes show {
        0% {
            right: -350px;
        }
        100% {
            right: -0px;
        }
      }

      @keyframes hide {
        0% {
            right: 0px;
        }
        100% {
            right: -350px;
        }
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
      try {
        this.#audio.pause();
      } catch (error) {
        // do nothing
      }
    });

    window.addEventListener('focus', () => {
      try {
        this.#audio.play();
      } catch (error) {
        // do nothing
      }
    });
  }

  #initEasteregg() {
    const easteregg = document.createElement('div');
    easteregg.className = 'easteregg';
    this.#shadow.appendChild(easteregg);

    const eastereggAuthor = document.createElement('img');
    eastereggAuthor.className = 'easteregg__author';
    eastereggAuthor.src = './assets/author.png';
    eastereggAuthor.alt = 'Author';
    easteregg.appendChild(eastereggAuthor);

    setInterval(() => {
      const isRightTime = this.#isRightTimeForEasteregg();

      if (isRightTime) {
        this.#ga.easternEggShowed();

        eastereggAuthor.classList.remove('easteregg__author--hide');
        eastereggAuthor.classList.add('easteregg__author--show');

        setTimeout(() => {
          eastereggAuthor.classList.remove('easteregg__author--show');
          eastereggAuthor.classList.add('easteregg__author--hide');
        }, 3000);
      }
    }, 1000);
  }

  #isRightTimeForEasteregg() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const secondsSinceMidnight = Math.round((now - midnight) / 1000);  // converts milliseconds to seconds
    return secondsSinceMidnight % 2025 === 0;
  }
}

customElements.define('application-container', Application);
