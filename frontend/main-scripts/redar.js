class Redar {
  #redarID;
  #trenutnaLokacija;

  constructor(redarID) {
    this.#redarID = redarID;
    this.#trenutnaLokacija = "";

    let redarji = [];

    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const [key, value] = cookies[i].split("=");
      if (key === "Redarji") {
        redarji = JSON.parse(decodeURIComponent(value));
      }
    }

    redarji = redarji.concat([
      {
        id: redarID,
        longitute: 0,
        latitude: 0,
        expected: { longitude: 0, latitude: 0 },
      },
    ]);

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 100);
    document.cookie =
      "Redarji" +
      "=" +
      encodeURIComponent(JSON.stringify(redarji)) +
      "; expires=" +
      expires.toUTCString() +
      "; path=/";
  }

  // Metoda za vnos nove lokacije (začetni vnos)
  vnesiLokacijo(latitude, longitude) {
    let expected = new PredpostavljenaLokacijaRedarja(
      this.#trenutnaLokacija,
      longitude,
      latitude
    );
    this.#trenutnaLokacija = `Lat: ${latitude}, Lon: ${longitude}`;
    console.log(`Lokacija vnesena: ${this.#trenutnaLokacija}`);

    let redarji = [];

    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const [key, value] = cookies[i].split("=");
      if (key === "Redarji") {
        redarji = JSON.parse(decodeURIComponent(value));
      }
    }

    redarji = redarji.map((x) =>
      x.id === this.#redarID
        ? ((x.longitude = longitude),
          (x.latitude = latitude),
          (x.expected = expected.predpostaviLokacijo()))
        : x
    );

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 100);
    document.cookie =
      "Redarji" +
      "=" +
      encodeURIComponent(JSON.stringify(redarji)) +
      "; expires=" +
      expires.toUTCString() +
      "; path=/";
  }

  // Metoda za posodobitev obstoječe lokacije
  posodobiLokacijo(latitude, longitude) {
    let expected = new PredpostavljenaLokacijaRedarja(
      this.#trenutnaLokacija,
      longitude,
      latitude
    );
    this.#trenutnaLokacija = `Lat: ${latitude}, Lon: ${longitude}`;
    console.log(`Lokacija posodobljena: ${this.#trenutnaLokacija}`);

    let redarji = [];

    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const [key, value] = cookies[i].split("=");
      if (key === "Redarji") {
        redarji = JSON.parse(decodeURIComponent(value));
      }
    }

    redarji = redarji.map((x) =>
      x.id === this.#redarID
        ? ((x.longitude = longitude),
          (x.latitude = latitude),
          (x.expected = expected.predpostaviLokacijo()))
        : x
    );

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 100);
    document.cookie =
      "Redarji" +
      "=" +
      encodeURIComponent(JSON.stringify(redarji)) +
      "; expires=" +
      expires.toUTCString() +
      "; path=/";
  }

  // Izbirni getter za dostop do redarID ali lokacije zunaj razreda
  getRedarID() {
    return this.#redarID;
  }

  getTrenutnaLokacija() {
    return this.#trenutnaLokacija;
  }
}
