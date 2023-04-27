import "./css/styles.css";

import { fetchCountries } from "./fetchCountries.js";

import debounce from "lodash.debounce";
import Notiflix from "notiflix";

const DEBOUNCE_DELAY = 300;

const searchEl = document.getElementById("search-box");
const countryListEl = document.querySelector(".country-list");
const countryInfoEl = document.querySelector(".country-info");

// console.log(fetchCountries);

// przechowuje wartość wpisaną przez użytkownika w polu wyszukiwania
let findCountryName = "";

//dodaje zdarzenie input + opoźniam wywołanie funkcji o 300
searchEl.addEventListener("input", debounce(newValue, DEBOUNCE_DELAY));

//pobieram dane  z api + tworzę funkcję pobierającą wartość pola wyszukiwania/ usuwam spacje / pobieram dane z api
//Dokonaj sanityzacji wprowadzonego przez użytkownika ciągu metodą trim(), to rozwiąże problem, gdy w polu wprowadzania są tylko spacje lub widnieją one na początku i na końcu wiersza.
function newValue() {
  findCountryName = searchEl.value.trim();
  if (findCountryName === "") {
    clearEl();
    return;
  } else
    fetchCountries(findCountryName)
      .then((countryNames) => {
        if (countryNames.length < 2) {
          makeNewCard(countryNames);
          Notiflix.Notify.success("Here your result");
        } else if (countryNames.length < 10 && countryNames.length > 1) {
          makeNewList(countryNames);
          Notiflix.Notify.success("Here your results");
        } else {
          clearEl();
          Notiflix.Notify.info(
            "Too many matches found. Please enter a more specific name."
          );
        }
      })
      .catch(() => {
        clearEl();
        Notiflix.Notify.failure("Oops, there is no country with that name.");
      });
}

// console.log(newValue)

//Jeśli w odpowiedzi API przekazało więcej niż 10 krajów, w interfejsie powinno pojawić się powiadomienie o tym, że nazwa musi być bardziej dokładna
//Jeśli użytkownik wprowadził nazwę kraju, który nie istnieje, backend przekaże mu nie pustą tablicę, a błąd z kodem stanu 404 - nie odnaleziono. Jeśli nie przygotujesz kodu na ten błąd, to użytkownik nigdy nie dowie się o tym, że żądanie nie przyniosło wyników. Dodaj powiadomienie "Oops, there is no country with that name" w razie błędu 404, używając biblioteki notiflix.
// zeruje wrtość elem

function clearEl() {
  countryListEl.innerHTML = "";
  countryInfoEl.innerHTML = "";
}
// console.log(clearEl)
//tworze nowa tablice, pobieram i przechowuje info z api o kraju


function makeNewCard([land]) {
  clearEl();
    const {
      name: {official},
      flags: {svg},
      capital,
      population,
      languages,
    } = land;
  const languagesList = Object.values(languages).join(",");
  const myCard = `
    <div class="country-div">
      <div>
        <img src="${svg}" alt="flag" width="75", height="55">
        <h2>${official}</h2>
      </div>
      <p>Capital: <span>${capital}</span></p>
      <p>Population: <span>${population}</span></p>
      <p>Languages: <span>${languagesList}</span></p>
    </div>
  `;
  countryInfoEl.innerHTML = myCard;
}
//console.log(makeNewCard)

function makeNewList(country) {
  clearEl();
  country.forEach(({flags: {svg}, name: {official}}) => {
    const newItem = `
      <li>
        <img src="${svg}" alt="flag" width="60", height="40">
        <span>${official}</span>
      </li>
    `;
    countryListEl.insertAdjacentHTML("beforeend", newItem);
  });
}


// console.log(makeNewList)