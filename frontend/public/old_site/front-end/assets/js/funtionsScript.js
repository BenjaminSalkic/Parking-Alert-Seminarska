// Vnos parkirne lokacije (ročno ali z GPS)
// Preko GPS-a
document.addEventListener("DOMContentLoaded", async () => {
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));

  if (userData) {
    const student = new ZMStudent(userData);

    // Zdaj uporabimo metodo fetchCurrentLocation
    try {
      await student.fetchCurrentLocation();
    } catch (error) {
      showToast(
        "Napaka pri pridobivanju trenutne lokacije. Prosim, poskusite znova.",
        "error"
      );
      console.warn("Could not fetch user location.", error);
    }
  }
});

// ROČNO VNAŠANJE PARKIRNE LOKACIJE MODALNO OKNO
// IZBERI PARKIRIŠČE MODALNO OKNO
// Funkcija za odprtje modalnega okna za izbiro parkirišča
function izberiLokacijoModal() {
  fetch("modals/izberiParkirisceModal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("izberiParkirisceModal").innerHTML = html;

      const modal = document.querySelector("#izberiParkirisceModal .modal");
      if (modal) {
        modal.style.display = "block";
      }

      // seznam parkirišč dinamično napolni z uvoženimi podatki.
      populateParkingList();

      // Dodaj poslušalca dogodkov za vnos iskanja za filtriranje možnosti parkiranja
      const searchInput = document.getElementById("searchParking");
      searchInput.addEventListener("input", function (e) {
        filterParkingList(e.target.value.toLowerCase());
      });

      // dodaj poslušalca dogodkov za gumb za brisanje
      const deleteButton = document.querySelector("#deleteButton");
      if (deleteButton) {
        // deleteButton.addEventListener("click", () => deleteAccount());
      }

      // Redefiniran closeModal, da bo na voljo po vstavitvi
      window.closeModal = function () {
        modal.style.display = "none";
      };
    })
    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}

// Funkcija za dinamično polnjenje seznama parkirišč z uporabo uvoženih podatkov
function populateParkingList() {
  import("/front-end/assets/js/dummyData/parkingdata.js")
    .then((module) => {
      const parkirnaMesta = module.parkirnaMesta;
      console.log("Parkirna mesta:", parkirnaMesta);

      parkirnaMesta.forEach((parkirisce) => {
        const listItem = document.createElement("li");
        listItem.textContent = parkirisce.ime;
        listItem.onclick = () => selectParking(parkirisce);
        parkingList.appendChild(listItem);
      });

      document.querySelector(".dropdown").classList.add("show");
    })
    .catch((error) => {
      console.error("Error loading parking data:", error);
    });

  // Prikaži spustno okno, ko so možnosti izpolnjene
  document.querySelector(".dropdown-parking").classList.add("show");
}

// Funkcija za filtriranje seznama parkirišč na podlagi vnosa za iskanje
function filterParkingList(searchText) {
  const parkingList = document.getElementById("parkingList");
  const listItems = parkingList.getElementsByTagName("li");

  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];
    const name = item.textContent.toLowerCase();

    if (name.includes(searchText)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  }
}

let selectedParkingLocation = null;

const parkingsWithRedar = [
  "Parkirno mesto Kongresni trg",
  "Parkirno mesto Stožice",
  "Parkirno mesto Tivoli",
  "Parkirno mesto BTC City",
  "Parkirno mesto NUK",
  "Parkirno mesto Polje",
];

// Funkcija za izbiro parkirnega mesta s seznama
function selectParking(parkirisce) {
  document.getElementById("searchParking").value = parkirisce.ime;

  // Poudari izbrani element
  const items = document.querySelectorAll("#parkingList li");
  items.forEach((item) => {
    if (item.textContent === parkirisce.ime) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });

  // Shranjevanje izbrane lokacije v globalno spremenljivko
  selectedParkingLocation = parkirisce;

  // Preveri, ali ima to parkirišče redar
  setTimeout(() => {
    if (parkingsWithRedar.includes(parkirisce.ime)) {
      prikaziOpozoriloZaRedarja(parkirisce.ime);
    }
  }, 2000);
}

function confirmSelectedParking() {
  if (!selectedParkingLocation) {
    showToast("Prosimo, najprej izberite parkirišče.", "warning");
    return;
  }

  const { ime, latitude, longitude } = selectedParkingLocation;

  // Posodobitev zemljevida z izbrano lokacijo parkirišča
  updateCurrentLocationMarker(latitude, longitude, `Izbrana lokacija: ${ime}`);

  // Shranjevanje lokacije v localStorage (po potrebi)
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));
  if (userData) {
    userData.location = ime;
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
  }

  // Posodobitev DOM
  const locationSpan = document.getElementById("last-location");
  if (locationSpan) {
    locationSpan.innerHTML = ` <strong>${ime}</strong>`;
  }

  // Prikaži potrditev
  showToast(`Izbrana lokacija: ${ime}`, "success");

  // Zapri modalno okno
  closeModal();
}

// Izpostavi globalnemu objektu okna, tako da lahko do njega dostopa funkcija onclick
window.confirmSelectedParking = confirmSelectedParking;

function showDropdown() {
  document.querySelector(".dropdown-parking").style.display = "block";
}

function hideDropdown() {
  // Zakasnitev skrivanja za omogočanje izbire elementa seznama
  setTimeout(() => {
    document.querySelector(".dropdown-parking").style.display = "none";
  }, 200);
}

function openToggleGPS() {
  fetch("modals/switchGPSModal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("gpsModal").innerHTML = html;

      const modal = document.querySelector("#gpsModal .modal");
      if (modal) modal.style.display = "block";

      const gpsToggle = document.getElementById("gpsToggle");

      // Geolokacijo preveri samo enkrat ob odprtju modalnega okna
      isGeolocationEnabled().then((geolocationEnabled) => {
        console.log("Initial geolocation check:", geolocationEnabled);
        gpsToggle.checked = geolocationEnabled;
        updateGPSStatus(geolocationEnabled);
      });

      // Dogodek Toggle - posodobi samo uporabniški vmesnik
      if (gpsToggle) {
        gpsToggle.addEventListener("change", (event) => {
          const isChecked = event.target.checked;
          console.log("GPS Toggle Changed: ", isChecked);
          updateGPSStatus(isChecked); // Samo posodobite besedilo
        });
      }

      // Zapri modalno okno
      window.closeModal = function () {
        modal.style.display = "none";
      };
    })
    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}

// Preveri podporo za geografsko lokacijo
function isGeolocationEnabled() {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(false);
    } else {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false)
      );
    }
  });
}

// Posodobi besedilo stanja GPS v modalnem oknu
function updateGPSStatus(isChecked) {
  const gpsStatus = document.getElementById("gpsStatus");
  console.log("Updating GPS Status with innerHTML:", isChecked);

  if (gpsStatus) {
    gpsStatus.innerHTML = isChecked ? "GPS je vklopljen" : "GPS je izklopljen";
    console.log("Status text set to:", gpsStatus.innerHTML);
  }
}

// IZBRIS RAČUNA MODALNO OKNO
// Funkcija za odprtje modalnega okna za izbris računa
function openDeleteModal() {
  fetch("modals/izbrisiRacunModal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("deleteModalContainer").innerHTML = html;

      const modal = document.querySelector("#deleteModalContainer .modal");
      if (modal) {
        modal.style.display = "block";
      }

      // Dodaj poslušalca dogodkov za gumb za brisanje znotraj modalnega okna
      const deleteButton = document.querySelector("#deleteButton");
      if (deleteButton) {
        deleteButton.addEventListener("click", () => deleteAccount());
      }

      // Redefiniraj closeModal, da bo na voljo po vstavitvi
      window.closeModal = function () {
        modal.style.display = "none";
      };
    })
    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}

function deleteAccount() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    // Ustvari primerek ZMStudent
    const loggedInUser = new ZMStudent(user);
    localStorage.removeItem("loggedInUser");
    // Pokliči metodo izbrisiRacun, da izbrišete račun
    loggedInUser.izbrisiProfil();
  } else {
    showToast("Napaka pri brisanju računa.", "error");
  }
}

// DODAJ REDAR MODALNO OKNO
// Funkcija za odprtje modalnega okna za dodajanje redarja
function openPrijaviRedarModal() {
  fetch("modals/prijaviRedarModal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("prijaviRedarModalContainer").innerHTML = html;

      const modal = document.querySelector("#prijaviRedarModal");
      if (modal) {
        modal.style.display = "block";
      }

      // Uvozi podatke o parkiriščih in ulicah
      Promise.all([
        import("/front-end/assets/js/dummyData/parkingdata.js"),
        import("/front-end/assets/js/dummyData/streets.js"),
      ])
        .then(([parkingModule, streetModule]) => {
          const parkirnaMesta = parkingModule.parkirnaMesta;
          const slovenskeUlice = streetModule.slovenskeUlice;

          //  Izpolnite spustno okno za parkiranje
          const lokacijaSelect = document.getElementById("lokacija");
          if (lokacijaSelect) {
            lokacijaSelect.innerHTML = `<option value="">Izberi lokacijo</option>`;
            parkirnaMesta.forEach((parking) => {
              const option = document.createElement("option");
              option.value = parking.ime;
              option.textContent = parking.ime;
              lokacijaSelect.appendChild(option);
            });
          }

          // Izpolni spustno okno ulice
          const headingSelect = document.getElementById("heading");
          if (headingSelect) {
            headingSelect.innerHTML = `<option value="">Izberi ulico</option>`;
            slovenskeUlice.forEach((ulica) => {
              const option = document.createElement("option");
              option.value = ulica;
              option.textContent = ulica;
              headingSelect.appendChild(option);
            });
          }
        })
        .catch((error) => {
          console.error("Napaka pri nalaganju parkirišč ali ulic:", error);
        });

      // Dodaj poslušalca dogodkov za gumb za dodajanje redarja
      const addButton = document.querySelector("#addButtonRedar");
      if (addButton) {
        addButton.addEventListener("click", () => addRedar());
      }

      window.closeModal = function () {
        modal.style.display = "none";
      };
    })
    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}

function addRedar() {
  const lokacija = document.getElementById("lokacija").value;
  const heading = document.getElementById("heading").value;
  const opis = document.getElementById("opis").value;

  if (!lokacija || !heading || !opis) {
    showToast("Prosimo, izpolnite vsa polja.", "warning");
    return;
  }

  const newRow = document.createElement("tr");
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const fullName = `${user.ime || "Uporabnik"} ${user.priimek || ""}`.trim();

  newRow.innerHTML = `
    <td><span class="entypo-user"></span>&nbsp;${fullName}</td>
    <td>${lokacija}</td>
    <td>${heading}</td>
  `;

  const tableBody = document.querySelector("#site table tbody");
  if (tableBody) {
    tableBody.prepend(newRow);
  } else {
    console.error("Tabela ni bila najdena!");
  }

  document.getElementById("prijaviRedarForm").reset();
  closeModal();
  showToast("Prijava uspešno dodana.", "success");
}

function prikaziOpozoriloZaRedarja(parkingName) {
  const opozoriloHTML = `
    <div style="
      background-color: #fff3cd;
      border: 1px solid #ffeeba;
      color: #856404;
      padding: 16px;
      border-radius: 8px;
      margin-top: 10px;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    ">
      ⚠️ Opozorilo: Redar je trenutno prisoten na lokaciji <strong>${parkingName}</strong>!
    </div>
  `;

  // Prikaži ga v toast ali vstavi v DOM
  const container = document.getElementById("toast-container");
  if (container) {
    container.innerHTML = opozoriloHTML;
    setTimeout(() => (container.innerHTML = ""), 6000);
  } else {
    alert(`⚠️ Redar je trenutno prisoten na lokaciji ${parkingName}`);
  }
}
