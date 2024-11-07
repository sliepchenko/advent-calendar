class Ls {
  static #instance;

  constructor() {
    if (Ls.#instance) {
      return Ls.#instance;
    }

    Ls.#instance = this;
    this.#initLS();
  }

  #initLS() {
    const storage = localStorage.getItem('advent-calendar');

    if (!storage) {
      localStorage.setItem('advent-calendar', JSON.stringify({
        opened: []
      }));
    }
  }

  setCardOpen(day) {
    const storage = localStorage.getItem('advent-calendar');
    const data = JSON.parse(storage);

    data.opened.push(day);
    data.opened.sort((a, b) => a - b);

    localStorage.setItem('advent-calendar', JSON.stringify({
      ...data
    }));
  }

  isCardOpen(day) {
    const storage = localStorage.getItem('advent-calendar');
    const data = JSON.parse(storage);

    return data.opened.includes(day);
  }
}

export default Ls;
