const allTypes = ['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'];
const tbody = document.querySelector('tbody.table-body');

/** *** Fetching the data from the bored API *****/
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
  for (let i = 0; i < data.activities.length; i++) {
    const { activity, type, participants, price, accessibility, link } = data.activities[i];
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
}, 1000);

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
window.addEventListener('resize', () => {
  if (window.innerWidth >= 844) {
    document.querySelector('.participant-column').textContent = 'Participant';
    document.querySelector('.accessibility-column').textContent = 'Accessibility';
  } else {
    document.querySelector('.participant-column').textContent = 'Part-' + '\n' + 'icipant';
    document.querySelector('.accessibility-column').textContent = 'Access-' + '\n' + 'ibility';
  }
});
