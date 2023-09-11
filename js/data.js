/* exported data */

let data = {
  view: 'home-page',
  activities: [],
  favorites: [],
  randomGenerator: {
    activity: 'Learn Express.js',
    accessibility: 0.25,
    type: 'education',
    participants: 1,
    price: 0.1,
    link: 'https://expressjs.com/',
    key: '3943506'
  }
};

localStorage.clear();

const previousData = localStorage.getItem('activities');

if (previousData !== null) {
  data = JSON.parse(previousData);
}

window.addEventListener('beforeunload', event => {
  const jsonString = JSON.stringify(data);
  localStorage.setItem('activities', jsonString);
});
