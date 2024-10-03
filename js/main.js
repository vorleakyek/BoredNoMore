const allTypes = ['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'];
const tbody = document.querySelector('tbody.table-body');
const favtBody = document.querySelector('.fav-table-body');
const tableWrapper = document.querySelector('.table-wrapper');
const favTableWrapper = document.querySelector('.fav-table');

// ***************** IMPLEMENTING FEATURE 1 - Fetch data and show table **********//

function getActivityObj(apiData, type) {

  const activityObjArr = apiData.filter(obj => obj.type === type);
  const arr = [];

  while (arr.length < 5) {
    const randomIndex = Math.floor(Math.random() * activityObjArr.length);
    const isExisted = arr.find(obj => obj.key === activityObjArr[randomIndex].key);
    if (!isExisted) {
      arr.push(activityObjArr[randomIndex]);
    }
  }

  return data.activities.push(...arr);
}


// ONLY want to run this code one time initially
if (data.activities.length === 0) {
  for (let j = 0; j < allTypes.length; j++) {
    getActivityObj(apiData, allTypes[j]);
  }
}

function createTableBody(array, tbody) {
  for (let i = 0; i < array.length; i++) {
    const { activity, type, participants, price, accessibility, link, key } = array[i];
    const tr = document.createElement('tr');
    tr.classList.add('border');
    tbody.append(tr);

    const rowData = [
      { textContentValue: i + 1, classNameValue: 'num-cell' },
      { textContentValue: activity, classNameValue: 'activity-cell' },
      { textContentValue: type, classNameValue: 'type-cell' },
      { textContentValue: participants, classNameValue: 'participant-cell' },
      { textContentValue: accessibility, classNameValue: 'accessibility-cell' },
      { textContentValue: price, classNameValue: 'price-cell' }
    ];

    favCell(tr, 'fav-cell', key);
    for (const cellData of rowData) {
      displayEachCell(tr, cellData.textContentValue, cellData.classNameValue);
    }
    linkCell(tr, link, 'link-cell');
  }
}

function favCell(tr, className, key) {
  const td = document.createElement('td');
  const btn = document.createElement('button');
  btn.className = 'star-btn';
  const i = document.createElement('i');
  i.setAttribute('id', `${key}`);
  const isFavStar = data.favorites.find(obj => obj.key === key);
  const starIcon = isFavStar ? 'fav-star fa-solid' : 'not-fav';
  i.className = `fa-regular fa-star ${starIcon}`;
  td.className = className;
  tr.append(td);
  td.append(btn);
  btn.append(i);
}

function displayEachCell(tr, text, className) {
  const td = document.createElement('td');
  td.textContent = text;
  td.classList.add(className);
  tr.append(td);

  if (text === '') {
    td.textContent = 'Not available';
  }
}

function linkCell(tr, link, className) {
  const td = document.createElement('td');
  td.classList.add(className);
  if (link === '') {
    td.textContent = 'Not available';
  } else {
    const a = document.createElement('a');
    td.append(a);
    a.textContent = link;
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
  }
  tr.append(td);
}

// Change the column header text to two lines in a small device
function TableHeaderStyle() {
  if (window.innerWidth >= 844) {
    document.querySelector('.participant-column').textContent = 'Participant';
    document.querySelector('.accessibility-column').textContent = 'Accessibility';
  } else {
    document.querySelector('.participant-column').textContent = 'Part-' + '\n' + 'icipant';
    document.querySelector('.accessibility-column').textContent = 'Access-' + '\n' + 'ibility';
  }
}

window.addEventListener('resize', () => {
  TableHeaderStyle();
});

window.addEventListener('DOMContentLoaded', () => {
  TableHeaderStyle();
});

// *********************** IMPLEMENTING FEATURE 2 - SEARCH ******************** //
const searchInput = document.querySelector('#search-input');
const searchInputFav = document.querySelector('#search-input-fav');
const searchForm = document.querySelector('#search-form');
const searchFormFav = document.querySelector('#search-form-fav');
let searchValue = null;

searchForm.addEventListener('input', event => {
  searchDisplay(searchInput, data.activities, tbody, tableWrapper);
});

searchFormFav.addEventListener('input', event => {
  searchDisplay(searchInputFav, data.favorites, favtBody, favTableWrapper);
});

searchForm.addEventListener('submit', event => {
  event.preventDefault();
});

searchFormFav.addEventListener('submit', event => {
  event.preventDefault();
});

function searchDisplay(inputValue, arr, tbody, tableWrapper) {
  event.preventDefault();
  searchValue = inputValue.value.toLowerCase();
  const result = matchedResult(arr);
  updateBodyTable(result, tbody, tableWrapper, 'No match found!');
}

function matchedResult(arr) {
  const result = arr.filter(element => matchedCriteria(element));
  return result;
}

function matchedCriteria(element) {
  let { activity, type, participants, price, accessibility } = element;
  activity = activity.toLowerCase();
  type = type.toLowerCase();
  participants = participants.toString();
  accessibility = accessibility.toString();
  price = price.toString();
  const matchedType = searchValue.includes(type) || type.includes(searchValue);
  const matchedActivity = searchValue.includes(activity) || activity.includes(searchValue);
  const matchedParticipants = searchValue === participants;
  const matchedAccessibility = searchValue === accessibility;
  const matchedPrice = searchValue === price;
  return matchedType || matchedActivity || matchedParticipants || matchedAccessibility || matchedPrice;
}

function noMatchFound(tbody, displayText) {
  const tr = document.createElement('tr');
  tr.classList.add('not-found');
  tbody.append(tr);
  const td = document.createElement('td');
  tr.append(td);
  td.setAttribute('colspan', '8');
  td.textContent = displayText;
  td.classList.add('not-found-padding');
}

// *********************** IMPLEMENTING FEATURE 3 - Filter ******************** //
const filterButton = document.querySelector('#filter');
const overlay = document.querySelector('.overlay');
const filterModal = document.querySelector('#filter-modal');
const cancel = document.querySelector('#cancel');
const apply = document.querySelector('#apply');
const form = document.querySelector('#form-filter-modal');
const filterPill = document.querySelector('#filter-pill');
const filterPillButton = document.querySelector('#filter-pill-button');

const filterButtonFav = document.querySelector('#filter-fav');
const overlayFav = document.querySelector('.overlay-fav');
const filterModalFav = document.querySelector('#filter-modal-fav');
const cancelFav = document.querySelector('#cancel-fav');
const applyFav = document.querySelector('#apply-fav');
const formFav = document.querySelector('#form-filter-modal-fav');
const filterPillFav = document.querySelector('#filter-pill-fav');
const filterPillButtonFav = document.querySelector('#filter-pill-button-fav');

filterButton.addEventListener('click', event => {
  handleFilterButton(filterModal, overlay);
});

filterButtonFav.addEventListener('click', event => {
  handleFilterButton(filterModalFav, overlayFav);
});

cancel.addEventListener('click', event => {
  handleCancel(filterModal, overlay);
});

cancelFav.addEventListener('click', event => {
  handleCancel(filterModalFav, overlayFav);
});

apply.addEventListener('click', event => {
  handleApply('filter', data.activities, tbody, tableWrapper, filterPill, filterModal, overlay, form);
});

applyFav.addEventListener('click', event => {
  handleApply('filter-fav', data.favorites, favtBody, favTableWrapper, filterPillFav, filterModalFav, overlayFav, formFav);
});

filterPillButton.addEventListener('click', event => {
  displayFavList(filterPill, tbody, data.activities, tableWrapper);
});

filterPillButtonFav.addEventListener('click', event => {
  displayFavList(filterPillFav, favtBody, data.favorites, favTableWrapper);
});

function displayFavList(filterPill, tbody, arr, tableWrapper) {
  event.preventDefault();
  filterPill.classList.add('hidden');
  updateBodyTable(arr, tbody, tableWrapper, 'No Favorite Activity.');
}

function hideModal(modal, overlay) {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
}

function handleCancel(modal, overlay) {
  event.preventDefault();
  hideModal(modal, overlay);
}

function handleFilterButton(modal, overlay) {
  event.preventDefault();
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
}

function handleApply(selector, arr, tbody, tableWrapper, filterPill, modal, overlay, form) {
  event.preventDefault();
  const checked = document.querySelectorAll(`input[name=${selector}]:checked`);
  const arraySelected = [];

  checked.forEach(select => {
    arraySelected.push(select.value);
  });

  const stringInput = arraySelected.join(' ');
  const result = arr.filter(element =>
    element.type.includes(stringInput) || stringInput.includes(element.type));
  updateBodyTable(result, tbody, tableWrapper, 'No match found');
  hideModal(modal, overlay);
  filterPill.classList.remove('hidden');
  form.reset();
}

// ********************* IMPLEMENTING FEATURE 4 - Random Generator ******************** //
const generateButton = document.querySelector('.btn-general');
const addFavBtn = document.querySelector('#add-fav-btn');

const optionForm = document.querySelector('#option-form');
const radioButtons = optionForm.querySelectorAll('input[type="radio"]');
const typeValues = optionForm.querySelectorAll('input[name="filter"]');
const participantNum = document.querySelector('#participant-number');
const accessibilityValues = optionForm.querySelectorAll('input[name="accessibility"]');
const priceMin = document.querySelector('#price-min');
const priceMax = document.querySelector('#price-max');

const optDiv = document.querySelector('.options');
const partiDiv = document.querySelector('.participant-input-wrapper');
const accessDiv = document.querySelector('.accessibility-input-wrapper');
const priceDiv = document.querySelector('.price-input-wrapper');

optionForm.addEventListener('click', event => {
  if (event.target.value === 'type') {
    optDiv.classList.remove('hidden');
    partiDiv.classList.add('hidden');
    accessDiv.classList.add('hidden');
    priceDiv.classList.add('hidden');
  } else if (event.target.value === 'participant') {
    optDiv.classList.add('hidden');
    partiDiv.classList.remove('hidden');
    accessDiv.classList.add('hidden');
    priceDiv.classList.add('hidden');
  } else if (event.target.value === 'accessibility') {
    optDiv.classList.add('hidden');
    partiDiv.classList.add('hidden');
    accessDiv.classList.remove('hidden');
    priceDiv.classList.add('hidden');
  } else if (event.target.value === 'price') {
    optDiv.classList.add('hidden');
    partiDiv.classList.add('hidden');
    accessDiv.classList.add('hidden');
    priceDiv.classList.remove('hidden');
  }
});

generateButton.addEventListener('click', event => {
  event.preventDefault();
  addFavBtn.removeAttribute('disabled');
  addFavBtn.classList.remove('hidden');
  addFavBtn.classList.remove('in-active');

  for (const radio of radioButtons) {
    if (radio.checked && radio.value === 'type') {
      for (const selectedValue of typeValues) {
        if (selectedValue.checked) {
          const result = apiData.filter(obj => obj.type === selectedValue.value);
          getDataType(result);
        }
      }
    } else if (radio.checked && radio.value === 'participant') {
      const result = apiData.filter(obj => obj.participants == participantNum.value);
      getDataType(result);

    } else if (radio.checked && radio.value === 'accessibility') {
      for (const selectedValue of accessibilityValues) {
        if (selectedValue.checked) {
          const result = apiData.filter(obj => obj.accessibility === selectedValue.value);
          getDataType(result);
        }
      }
    } else if (radio.checked && radio.value === 'price') {
      const result = apiData.filter(obj => (obj.price >= priceMin.value) && (obj.price <= priceMax.value));
      getDataType(result);
    }
  }
});




function getDataType(result) {
  const randomIndex = Math.floor(Math.random() * result.length);
  const dataResult = result[randomIndex];

  const { activity, type, participants, price, accessibility, link } = dataResult;
  const activityText = document.querySelector('.activity-text');
  const typeText = document.querySelector('.type-text');
  const participantText = document.querySelector('.participant-text');
  const accessibilityText = document.querySelector('.accessibility-text');
  const priceText = document.querySelector('.price-text');
  const linkSpan = document.querySelector('.link-span');

  activityText.textContent = activity;
  typeText.textContent = type;
  participantText.textContent = participants;
  accessibilityText.textContent = accessibility;
  priceText.textContent = price;

  if (link === '') {
    linkSpan.textContent = 'Not available';
  } else {
    linkSpan.textContent = '';
    const a = document.createElement('a');
    linkSpan.append(a);
    a.className = 'link-text';
    const linkText = document.querySelector('.link-text');
    linkText.setAttribute('href', link);
    linkText.textContent = link;
    linkText.setAttribute('target', '_blank');
  }

  data.randomGenerator = dataResult;
  const jsonString = JSON.stringify(data);
  localStorage.setItem('activities', jsonString);
}



// ********************* IMPLEMENTING FEATURE 5 - User Feedback ******************** //
const feedbackInput = document.querySelector('.feedback-input');
const sendButton = document.querySelector('#btn-send');
const feedbackContainer = document.querySelector('.feedback-container');
const feedbackDiv = document.querySelector('.feedback');
const errMsg = document.querySelector('.error-message');

sendButton.addEventListener('click', event => {
  event.preventDefault();
  const feedback = feedbackInput.value;

  if (feedback.trim() === '') {
    errMsg.classList.remove('hidden');
  } else {
    feedbackContainer.classList.add('hidden');
    const divWrapper = document.createElement('div');
    divWrapper.className = 'reply-wrapper';
    feedbackDiv.append(divWrapper);
    const p2 = document.createElement('p');
    p2.className = 'reply';
    divWrapper.append(p2);
    p2.textContent = 'Thank you for your feedback!';
    const p3 = document.createElement('p');
    divWrapper.append(p3);
    p3.className = 'reply';
    p3.textContent = `Your feedback: ${feedback}`;
  }
});

feedbackInput.addEventListener('input', event => {
  errMsg.classList.add('hidden');
});

// ********************* IMPLEMENTING FEATURE 6 - Adding Favorite ******************** //
const favPage = document.querySelector('[data-view="favorite-page"]');
const homePage = document.querySelector('[data-view="home-page"]');
const favLink = document.querySelector('.fav-link');
const backHomeButton = document.querySelector('#home-page-button');

// Set the initial view based on data.view
viewSwap(data.view);

addFavBtn.addEventListener('click', event => {
  data.favorites.push(data.randomGenerator);
  addFavBtn.setAttribute('disabled', 'true');
  addFavBtn.classList.add('in-active');
});

favLink.addEventListener('click', event => {
  viewSwap('favorite-page');
});

backHomeButton.addEventListener('click', event => {
  viewSwap('home-page');
  favtBody.textContent = '';
});

tbody.addEventListener('click', handleFavActivity);
favtBody.addEventListener('click', handleFavActivity);

function handleFavActivity(event) {
  if (event.target.classList.contains('fa-star')) {
    event.target.classList.toggle('fa-solid');
    const favKey = event.target.id;

    if (event.target.classList.contains('fa-solid')) {
      event.target.style.color = 'rgb(240, 199, 96)';

      const favAct = apiData.filter(obj => obj.key === favKey);
      data.favorites.push(...favAct);
    } else {
      event.target.style.color = 'gray';
      const item = data.favorites.find(obj => obj.key === favKey);
      const indexItem = data.favorites.indexOf(item);
      data.favorites.splice(indexItem, 1);
      updateBodyTable(data.favorites, favtBody, favTableWrapper, 'No favorite activities.');
    }
  }
}

function viewSwap(dataView) {
  if (dataView === 'favorite-page') {
    searchFormFav.reset();
    filterPillFav.classList.add('hidden');
    favLink.classList.add('hidden');
    favPage.classList.remove('hidden');
    homePage.classList.add('hidden');
    data.view = dataView;
    updateBodyTable(data.favorites, favtBody, favTableWrapper, 'No favorite activities.');
  } else if (dataView === 'home-page') {
    searchForm.reset();
    filterPill.classList.add('hidden');
    favLink.classList.remove('hidden');
    favPage.classList.add('hidden');
    homePage.classList.remove('hidden');
    data.view = dataView;
    tbody.textContent = '';
    createTableBody(data.activities, tbody);
  }
}

function updateBodyTable(array, tableBody, tableWrapper, text) {
  tableBody.textContent = '';
  array.length === 0 ? noMatchFound(tableBody, text) : createTableBody(array, tableBody);
  array.length <= 16 ? tableWrapper.classList.remove('height') : tableWrapper.classList.add('height');
}
