export class CardItem extends HTMLElement {
  #shadow = this.attachShadow({ mode: 'closed' });

  #id = 0;
  #title = '';
  #description = '';

  #column = '';
  #row = '';

  #opened = false;
  #locked = true;

  constructor({ id, title, description, column, row, opened, locked }) {
    super();

    this.#id = id;
    this.#title = title;
    this.#description = description;

    this.#column = column;
    this.#row = row;

    this.#opened = opened;
    this.#locked = locked;
  }

  async connectedCallback() {
    this.#addStyles();
    this.#buildUI();
  }

  #addStyles() {
    const sheet = new CSSStyleSheet();

    sheet.replaceSync(`
      :host {
        grid-column: ${ this.#column };
        grid-row: ${ this.#row };

        padding: 8px;

        background-color: ${ this.#id ? '#e64c3d' : '#94bad5' };
        border-radius: 8px;

        cursor: pointer;

        opacity: ${ this.#id ? 0.9 : 1 };
        transition: opacity 0.3s;
      }

      :host(:hover) {
        opacity: 1;
      }

      .card-item__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;

        border: 2px dashed #fff;
        border-radius: 8px;
        box-sizing: border-box;

        width: 100%;
        height: 100%;
      }

      .card-item__title {
        user-select: none;
      }
    `);

    this.#shadow.adoptedStyleSheets = [ sheet ];
  }

  #buildUI() {
    this.className = 'card-item';

    const wrapper = document.createElement('div');
    wrapper.className = 'card-item__wrapper';
    this.#shadow.appendChild(wrapper);

    const title = document.createElement('h2');
    title.className = 'card-item__title';
    title.textContent = this.#opened ? this.#title : this.#id;
    wrapper.appendChild(title);

    const description = document.createElement('p');
    description.className = 'card-item__description';
    description.textContent = this.#description;
    wrapper.appendChild(description);
  }
}

customElements.define('card-item-container', CardItem);
