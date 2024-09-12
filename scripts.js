import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let page = 1;
let matches = books;

const starting = document.createDocumentFragment();

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = document.createElement("button");
  element.classList = "preview";
  element.setAttribute("data-preview", id);

  element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
        </div>
        `;

  starting.appendChild(element);
}

// Created an object to place all document selectors in one place
const elements = {
  dataListButton: document.querySelector("[data-list-button]"),
  dataListItems: document.querySelector("[data-list-items]"),
  dataSearchCancel: document.querySelector("[data-search-cancel]"),
  dataSearchOverlay: document.querySelector("[data-search-overlay]"),
  dataSettingsCancel: document.querySelector("[data-settings-cancel]"),
  dataSettingsOverlay: document.querySelector("[data-settings-overlay]"),
  dataHeaderSearch: document.querySelector("[data-header-search]"),
  dataSearchTitle: document.querySelector("[data-search-title]"),
  dataHeaderSettings: document.querySelector("[data-header-settings]"),
  dataListClose: document.querySelector("[data-list-close]"),
  dataListActive: document.querySelector("[data-list-active]"),
  dataSettingsForm: document.querySelector("[data-settings-form]"),
  dataSearchForm: document.querySelector("[data-search-form]"),
  dataListMessage: document.querySelector("[data-list-message]"),
  dataListBlur: document.querySelector("[data-list-blur]"),
  dataListImage: document.querySelector("[data-list-image]"),
  dataListTitle: document.querySelector("[data-list-title]"),
  dataListSubtitle: document.querySelector("[data-list-subtitle]"),
  dataListDescription: document.querySelector("[data-list-description]"),
  dataSettingsTheme: document.querySelector("[data-settings-theme]"),
};
elements.dataListItems.appendChild(starting);

// Created a function that when you want to filter the books with author and genre
const dropDownModelSelector = (
  fragmentCreationHTML,
  firstElement,
  genreOrAuthor,
  allGenreOrAuthor,
  dataSearch
) => {
  firstElement.value = "any";
  firstElement.innerText = allGenreOrAuthor;
  fragmentCreationHTML.appendChild(firstElement);

  for (const [id, name] of Object.entries(genreOrAuthor)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    fragmentCreationHTML.appendChild(element);
  }

  document.querySelector(dataSearch).appendChild(fragmentCreationHTML);
};

// Called the function for filtering the genres
dropDownModelSelector(
  document.createDocumentFragment(),
  document.createElement("option"),
  genres,
  "All Genres",
  "[data-search-genres]"
);
// Called the function for filtering the authors
dropDownModelSelector(
  document.createDocumentFragment(),
  document.createElement("option"),
  authors,
  "All Authors",
  "[data-search-authors]"
);

const lightTheme = () => {
  document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
  document.documentElement.style.setProperty("--color-light", "255, 255, 255");
};
const darkTheme = () => {
  document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
  document.documentElement.style.setProperty("--color-light", "10, 10, 20");
};

// Set theme light or dark
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  elements.dataSettingsTheme.value = "night";
  darkTheme();
} else {
  elements.dataSettingsTheme.value = "day";
  lightTheme();
}

elements.dataListButton.innerText = `Show more (${
  books.length - BOOKS_PER_PAGE
})`;
elements.dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE > 0;

elements.dataListButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
`;

elements.dataSearchCancel.addEventListener("click", () => {
  elements.dataSearchOverlay.open = false;
});

elements.dataSettingsCancel.addEventListener("click", () => {
  elements.dataSettingsOverlay.open = false;
});

elements.dataHeaderSearch.addEventListener("click", () => {
  elements.dataSearchOverlay.open = true;
  elements.dataSearchTitle.focus();
});

elements.dataHeaderSettings.addEventListener("click", () => {
  elements.dataSettingsOverlay.open = true;
});

elements.dataListClose.addEventListener("click", () => {
  elements.dataListActive.open = false;
});

elements.dataSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === "night") {
    darkTheme();
  } else {
    lightTheme();
  }

  elements.dataSettingsOverlay.open = false;
});

elements.dataSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of books) {
    let genreMatch = filters.genre === "any";

    for (const singleGenre of book.genres) {
      if (genreMatch) break;
      if (singleGenre === filters.genre) {
        genreMatch = true;
      }
    }

    if (
      (filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === "any" || book.author === filters.author) &&
      genreMatch
    ) {
      result.push(book);
    }
  }

  page = 1;
  matches = result;

  if (result.length < 1) {
    elements.dataListMessage.classList.add("list__message_show");
  } else {
    elements.dataListMessage.classList.remove("list__message_show");
  }

  elements.dataListItems.innerHTML = "";
  const newItems = document.createDocumentFragment();

  for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    newItems.appendChild(element);
  }

  elements.dataListItems.appendChild(newItems);
  elements.dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE < 1;

  elements.dataListButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${
          matches.length - page * BOOKS_PER_PAGE > 0
            ? matches.length - page * BOOKS_PER_PAGE
            : 0
        })</span>
    `;

  window.scrollTo({ top: 0, behavior: "smooth" });
  elements.dataSearchOverlay.open = false;
});

elements.dataListButton.addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    fragment.appendChild(element);
  }

  elements.dataListItems.appendChild(fragment);
  page += 1;
});

elements.dataListItems.addEventListener("click", (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    if (active) break;

    if (node?.dataset?.preview) {
      let result = null;

      for (const singleBook of books) {
        if (result) break;
        if (singleBook.id === node?.dataset?.preview) result = singleBook;
      }

      active = result;
    }
  }

  if (active) {
    elements.dataListActive.open = true;
    elements.dataListBlur.src = active.image;
    elements.dataListImage.src = active.image;
    elements.dataListTitle.innerText = active.title;
    elements.dataListSubtitle.innerText = `${
      authors[active.author]
    } (${new Date(active.published).getFullYear()})`;
    elements.dataListDescription.innerText = active.description;
  }
});
