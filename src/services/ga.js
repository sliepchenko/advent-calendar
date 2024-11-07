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

  cardClicked(day) {
    this.#send(`card_clicked_${ day }`);
  }

  moreClicked(id) {
    this.#send(`more_clicked_${ id }`);
  }

  continueClicked(id) {
    this.#send(`continue_clicked_${ id }`);
  }
}

export default Ga;
