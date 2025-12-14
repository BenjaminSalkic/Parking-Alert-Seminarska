class Opozorilo {
  constructor() {
    this._opozoriloID = 0;
    this._redar = null;
    this._oddaljenost = 0.0;
    this._casovniZig = new Date();
    this._parkirisce = null;
  }

  // Getters
  get opozoriloID() {
    return this._opozoriloID;
  }

  get redar() {
    return this._redar;
  }

  get oddaljenost() {
    return this._oddaljenost;
  }

  get casovniZig() {
    return this._casovniZig;
  }

  get parkirisce() {
    return this._parkirisce;
  }

  // Setters
  set opozoriloID(value) {
    this._opozoriloID = Number(value) || 0;
  }

  set redar(value) {
    this._redar = value;
  }

  set oddaljenost(value) {
    this._oddaljenost = parseFloat(value) || 0.0;
  }

  set casovniZig(value) {
    this._casovniZig = value instanceof Date ? value : new Date(value);
  }

  set parkirisce(value) {
    this._parkirisce = value;
  }
}
