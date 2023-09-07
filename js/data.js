/* exported data */

let data = {
  view: 'home-page',
  activities: [],
  favorites: [],
  nextFavoriteId: null
};

const previousData = localStorage.getItem('activities');

if (previousData !== null) {
  data = JSON.parse(previousData);
}

window.addEventListener('beforeunload', event => {
  const jsonString = JSON.stringify(data);
  localStorage.setItem('activities', jsonString);
});
