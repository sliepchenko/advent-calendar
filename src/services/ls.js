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

  #set(data) {
    localStorage.setItem('advent-calendar', JSON.stringify({
      ...data
    }));
  }

  #get() {
    return JSON.parse(localStorage.getItem('advent-calendar'));
  }

  get volume() {
    const data = this.#get();

    return data.volume === undefined ? 0.5 : Number(data.volume);
  }

  set volume(value) {
    const data = this.#get();

    data.volume = Number(value);

    this.#set(data);
  }

  setCardOpen(day) {
    const data = this.#get();

    data.opened.push(day);
    data.opened.sort((a, b) => a - b);

    this.#set(data);
  }

  isCardOpen(day) {
    const data = this.#get();

    return data.opened.includes(day);
  }
}

export default Ls;
