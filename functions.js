// Created a function that when you want to filter the books with author and genre
export const dropDownModelSelector = (
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

// Created an object to place all document selectors in one place
export const elements = {
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

export const lightTheme = () => {
  document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
  document.documentElement.style.setProperty("--color-light", "255, 255, 255");
};
export const darkTheme = () => {
  document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
  document.documentElement.style.setProperty("--color-light", "10, 10, 20");
};
