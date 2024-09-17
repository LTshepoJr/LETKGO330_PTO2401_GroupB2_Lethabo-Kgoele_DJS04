import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import {
  dropDownModelSelector,
  elements,
  lightTheme,
  darkTheme,
} from "./functions.js";

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

elements.dataListItems.appendChild(starting);

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

// Set theme light or dark
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  if (localStorage.getItem("Theme") === "Dark") {
    elements.dataSettingsTheme.value = "night";
    darkTheme();
  } else {
    elements.dataSettingsTheme.value = "day";
    lightTheme();
  }
} else {
  elements.dataSettingsTheme.value = "night";
  darkTheme();
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
    localStorage.setItem("Theme", "Dark");
  } else {
    lightTheme();
    localStorage.setItem("Theme", "Light");
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
