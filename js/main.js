const allTypes = ['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'];
const tbody = document.querySelector('tbody.table-body');
const activityHeader = document.querySelector('.activity-column');
const tableWrapper = document.querySelector('.table-wrapper');

// ***************** IMPLEMENTING FEATURE 1 - Fetch data and show table **********//
async function getActivityObj(type) {
  try {
    const response = await fetch(`http://www.boredapi.com/api/activity?type=${type}`);

    if (!response.ok) {
      throw new Error(`server status code: ${response.status}`);
    }

    const activityObj = await response.json();
    return data.activities.push(activityObj);

  } catch (error) {
    console.error('Error:', error);
  }
}

// ONLY want to run this code one time initially
if (data.activities.length === 0) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < allTypes.length; j++) {
      getActivityObj(allTypes[j]);
    }
  }
}

// Need to wait for a few seconds for all the data from API to be fully retrieved
setTimeout(() => {
  createTableBody(data.activities);
}, 1000);

function createTableBody(array) {
  for (let i = 0; i < array.length; i++) {
    activityHeader.classList.add('activity-column-padding');
    const { activity, type, participants, price, accessibility, link } = array[i];
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

    for (const cellData of rowData) {
      displayEachCell(tr, cellData.textContentValue, cellData.classNameValue);
    }
    linkCell(tr, link, 'link-cell');
  }
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
let searchValue = null;

const searchForm = document.querySelector('#search-form');

searchForm.addEventListener('input', event => {
  event.preventDefault();
  activityHeader.classList.add('activity-column-padding');
  searchValue = searchInput.value.toLowerCase();
  const result = matchedResult();
  tbody.textContent = '';
  result.length === 0 ? noMatchFound() : createTableBody(result);
  result.length <= 16 ? tableWrapper.classList.remove('height') : tableWrapper.classList.add('height');
});

searchForm.addEventListener('submit', event => {
  event.preventDefault();
});

function matchedResult() {
  const result = data.activities.filter(element => matchedCriteria(element));
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

function noMatchFound() {
  const tr = document.createElement('tr');
  tr.classList.add('not-found');
  tbody.append(tr);
  const td = document.createElement('td');
  tr.append(td);
  td.setAttribute('colspan', '7');
  td.textContent = 'No match found!';
  td.classList.add('not-found-padding');
  activityHeader.classList.remove('activity-column-padding');
}

// *********************** IMPLEMENTING FEATURE 3 - Filter ******************** //
const filterButton = document.querySelector('.filter');
const overlay = document.querySelector('.overlay');
const filterModel = document.querySelector('.filter-modal');
const cancel = document.querySelector('#cancel');
const apply = document.querySelector('#apply');
const form = document.querySelector('#form-filter-modal');
const filterPill = document.querySelector('.filter-pill');
const filterPillButton = document.querySelector('.filter-pill-button');

filterButton.addEventListener('click', event => {
  event.preventDefault();
  overlay.classList.remove('hidden');
  filterModel.classList.remove('hidden');
});

cancel.addEventListener('click', event => {
  event.preventDefault();
  hideModal();
});

function hideModal() {
  overlay.classList.add('hidden');
  filterModel.classList.add('hidden');
}

apply.addEventListener('click', event => {
  event.preventDefault();
  const checked = document.querySelectorAll('input[name="filter"]:checked');
  const arraySelected = [];

  checked.forEach(select => {
    arraySelected.push(select.value);
  });

  const stringInput = arraySelected.join(' ');
  const result = data.activities.filter(element =>
    element.type.includes(stringInput) || stringInput.includes(element.type));
  tbody.textContent = '';
  createTableBody(result);
  result.length <= 16 ? tableWrapper.classList.remove('height') : tableWrapper.classList.add('height');
  hideModal();
  filterPill.classList.remove('hidden');
  form.reset();
});

filterPillButton.addEventListener('click', event => {
  event.preventDefault();
  filterPill.classList.add('hidden');
  tbody.textContent = '';
  createTableBody(data.activities);
  tableWrapper.classList.add('height');
});
