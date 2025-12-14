class PredpostavljenaLokacijaRedarja {
  #lokacija;
  #longituda;
  #latituda;

  constructor(lokacija, longituda, latituda) {
    this.#lokacija = lokacija;
    this.#longituda = longituda;
    this.#latituda = latituda;
  }

  //vrne {longitutde, latitude}
  predpostaviLokacijo() {
    let match = str.match(/Lat:\s*([-+]?\d*\.?\d+)\s*Lon:\s*([-+]?\d*\.?\d+)/);
    let latitude = parseFloat(match[1]);
    let longitude = parseFloat(match[2]);

    // Izračun razdalje
    let distance = Math.sqrt(
      Math.pow(this.#longituda - longitude, 2) +
        Math.pow(this.#latituda - latitude, 2)
    );

    // Izračunaj smer (kot)
    let angle = Math.atan2(
      this.#latituda - latitude,
      this.#longituda - longitude
    );

    // Ocena naslednjo lokacijo s projekcijo naprej
    let estimatedX = this.#longituda + distance * Math.cos(angle);
    let estimatedY = this.#latituda + distance * Math.sin(angle);

    // Namestna logika - tukaj lahko določiko pravo obnašanje
    console.log(
      `Lokacija redarja je predpostavljena kot: ${this.#lokacija} (${
        this.#latituda
      }, ${this.#longituda})`
    );
    return { longitutde: estimatedX, latitude: estimatedY };
  }

  // Getterji in setterji, če potrebujemo dostop zunaj razreda
  get lokacija() {
    return this.#lokacija;
  }

  set lokacija(value) {
    this.#lokacija = value;
  }

  get longituda() {
    return this.#longituda;
  }

  set longituda(value) {
    this.#longituda = value;
  }

  get latituda() {
    return this.#latituda;
  }

  set latituda(value) {
    this.#latituda = value;
  }
}
