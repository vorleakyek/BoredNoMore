const allTypes = ['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'];
const tbody = document.querySelector('tbody.table-body');
const activityHeader = document.querySelector('.activity-column');
const tableWrapper = document.querySelector('.table-wrapper');

// ***************** IMPLEMENTING FEATURE 1 - Fetch data and show table **********//
async function getActivityObj(type) {
  try {
    const response = await fetch(`https://www.boredapi.com/api/activity?type=${type}`);

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
const searchForm = document.querySelector('#search-form');
let searchValue = null;

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

function hideModal() {
  overlay.classList.add('hidden');
  filterModel.classList.add('hidden');
}

// ********************* IMPLEMENTING FEATURE 4 - Random Generator ******************** //
const generateButton = document.querySelector('.btn-general');
let link = 'https://www.boredapi.com/api/activity/';

const optionForm = document.querySelector('#option-form');
const radioButtons = optionForm.querySelectorAll('input[type="radio"]');
const checkBoxes = optionForm.querySelectorAll('input[type="checkbox"]');
const participantNum = document.querySelector('#participant-number');
const accessMin = document.querySelector('#access-min');
const accessMax = document.querySelector('#access-max');
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

  for (const radio of radioButtons) {
    if (radio.checked && radio.value === 'type') {
      for (const checkbox of checkBoxes) {
        if (checkbox.checked) {
          link = `https://www.boredapi.com/api/activity?type=${checkbox.value}`;
          generate(link);
        }
      }
    } else if (radio.checked && radio.value === 'participant') {
      link = `https://www.boredapi.com/api/activity?participants=${participantNum.value}`;
      generate(link);
    } else if (radio.checked && radio.value === 'accessibility') {
      if (accessMin.value !== accessMax.value) {
        link = `https://www.boredapi.com/api/activity?minaccessibility=${accessMin.value}&maxaccessibility=${accessMax.value}`;
      } else {
        link = `https://www.boredapi.com/api/activity?accessibility=${accessMin.value}`;
      }
      generate(link);
    } else if (radio.checked && radio.value === 'price') {
      if (priceMin.value !== priceMax.value) {
        link = `https://www.boredapi.com/api/activity?minprice=${priceMin.value}&maxprice=${priceMax.value}`;
      } else {
        link = `https://www.boredapi.com/api/activity?price=${priceMin.value}`;
      }
      generate(link);
    }
  }
});

function generate(link) {
  fetch(link)
    .then(response => {
      if (!response.ok) {
        throw new Error(`server status code: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const { activity, type, participants, price, accessibility, link } = data;
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
    })
    .catch(error => {
      console.error('Error', error);
    });
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
