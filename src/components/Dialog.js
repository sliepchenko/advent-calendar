import Ga from '../services/ga.js';

export class Dialog extends HTMLElement {
  static #dialog = null;

  #ga = new Ga();

  #shadow = this.attachShadow({ mode: 'closed' });

  #id = null;
  #title = '';
  #subtitle = '';
  #description = '';
  #link = '';

  constructor({ id, title, subtitle, description, link }) {
    super();

    this.#id = id;
    this.#title = title;
    this.#subtitle = subtitle;
    this.#description = description;
    this.#link = link;
  }

  static open({ id, title, subtitle, description, link }) {
    if (Dialog.#dialog) {
      Dialog.#dialog.parentNode.removeChild(Dialog.#dialog);
    }

    Dialog.#dialog = new Dialog({ id, title, subtitle, description, link });
    document.body.appendChild(Dialog.#dialog);
  }

  async connectedCallback() {
    this.#addStyles();
    this.#buildUI();
  }

  #addStyles() {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: var(--black);
        background-color: rgba(0, 0, 0, 0.5);
      }

      .dialog__wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 16px 64px;
        width: 240px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 0 16px rgba(0, 0, 0, 0.5);
      }

      @media (min-width: 768px) {
        .dialog__wrapper {
          width: 480px;
        }
      }

      .dialog__header {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .dialog__title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin: 0;
      }

      .dialog__subtitle {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        margin: 0;
      }

      .dialog__description {
        font-family: 'Calibri', sans-serif;
        font-size: 16px;
        text-align: justify;
        white-space: pre-wrap;
        margin: 0;
      }

      .dialog__buttons {
        display: flex;
        gap: 8px;
      }

      .dialog__close,
      .dialog__continue {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 14px;
        cursor: pointer;
      }

      .dialog__close {
        background-color: var(--red);
      }

      .dialog__continue {
        background-color: var(--green);
      }
    `);

    this.#shadow.adoptedStyleSheets = [ sheet ];
  }

  #buildUI() {
    this.className = 'dialog';

    const wrapper = document.createElement('div');
    wrapper.className = 'dialog__wrapper';
    this.#shadow.appendChild(wrapper);

    const header = document.createElement('header');
    header.className = 'dialog__header';
    wrapper.appendChild(header);

    const title = document.createElement('h2');
    title.className = 'dialog__title';
    title.textContent = this.#title;
    header.appendChild(title);

    if (this.#subtitle) {
      const subtitle = document.createElement('h3');
      subtitle.className = 'dialog__subtitle';
      subtitle.textContent = this.#subtitle;
      header.appendChild(subtitle);
    }

    const description = document.createElement('p');
    description.className = 'dialog__description';
    description.textContent = this.#description;
    wrapper.appendChild(description);

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'dialog__buttons';
    wrapper.appendChild(buttonsWrapper);

    const close = document.createElement('button');
    close.className = 'dialog__close';
    close.textContent = 'Close';
    close.addEventListener('click', () => this.#onCloseClick());
    buttonsWrapper.appendChild(close);

    if (this.#link) {
      const follow = document.createElement('button');
      follow.className = 'dialog__continue';
      follow.textContent = 'Continue';
      follow.addEventListener('click', () => this.#onContinueClick());
      buttonsWrapper.appendChild(follow);
    }
  }

  #onCloseClick() {
    Dialog.#dialog = null;

    this.remove();
  }

  #onContinueClick() {
    window.open(this.#link, '_blank');

    this.#onCloseClick();

    console.log(this.#id);

    this.#ga.continueClicked(this.#id);
  }
}

customElements.define('modal-dialog-container', Dialog);
