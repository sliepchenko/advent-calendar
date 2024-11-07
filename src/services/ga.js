class Ga {
  static #instance;

  constructor() {
    if (Ga.#instance) {
      return Ga.#instance;
    }

    Ga.#instance = this;
    this.#initGA();
  }

  #initGA() {
    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
      dataLayer.push(arguments);
    };

    gtag('js', new Date());
    gtag('config', 'G-R5K8SM9ZTQ');
  }

  #send(name, body) {
    window.gtag('event', name, {
      ...body
    });
  }

  sendCardOpen(day) {
    this.#send(`card_open_${ day }`);
  }
}

export default Ga;
