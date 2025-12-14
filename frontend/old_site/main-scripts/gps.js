class SVGPS {
  // Zasebni atribut
  #jeVklopljen;

  constructor(showToastFn, fetchLocationFn, resetLocationUICallback = null) {
    this.#jeVklopljen = false;
    this.showToast = showToastFn;
    this.fetchLocation = fetchLocationFn;
    this.resetLocationUI = resetLocationUICallback;
    this.location = null;
  }

  // Metoda za simulacijo pridobivanja lokacije učenca
  pridobiLokacijo() {
    if (this.location) {
      return this.location;
    } else {
      this.showToast("Lokacija ni na voljo.", "warning");
      console.warn("Lokacija ni bila pridobljena.");
      return null;
    }
  }

  // Metoda za vklop GPS in pridobitev lokacije
  async vklopiGPS() {
    this.#jeVklopljen = true;
    this.showToast("GPS je bil vklopljen.", "success");

    try {
      const location = await this.fetchLocation();
      if (location) {
        this.location = location;
        this.showToast(`Vaša lokacija: ${location}`, "info");
      } else {
        this.showToast("Ni mogoče pridobiti lokacije.", "error");
        console.error("GPS: Ni bila pridobljena veljavna lokacija.");
      }
    } catch (err) {
      this.showToast("Ni mogoče pridobiti lokacije.", "error");
      console.error("Napaka pri GPS lokaciji:", err);
      this.location = null; // Ponastavitev lokacije ob napaki
    }
  }

  // Način izklopa sistema GPS
  izklopiGPS() {
    this.#jeVklopljen = false;
    this.showToast("GPS je bil izklopljen.", "info");
    this.location = null;

    // Izbirna ponastavitev uporabniškega vmesnika
    if (typeof this.resetLocationUI === "function") {
      this.resetLocationUI();
    }
  }

  // Metoda za preverjanje, ali je vklopljen GPS
  isGPSVklopljen() {
    return this.#jeVklopljen;
  }

  // Metoda za simulacijo odstranjevanja Redarja
  izslediRedar() {
    return {
      ime: "Redar Novak",
      lokacija: { x: 150, y: 250 },
    };
  }

  // Metoda za pridobitev trenutne lokacije (za zunanji dostop)
  getLokacija() {
    return this.location;
  }

  // Metoda za pridobitev domnevne lokacije Redarja
  kjeBiLahkoBilRedar() {
    return {
      lokacija: { x: 170, y: 230 },
      natančnost: "80%",
    };
  }
}
