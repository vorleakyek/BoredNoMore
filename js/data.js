/* exported data */

let data = {
  view: 'home-page',
  activities: [],
  favorites: [],
  nextFavoriteId: null
};

const previousData = localStorage.getItem('activities');

window.addEventListener('load', event => {
  setTimeout(() => {
    const jsonString = JSON.stringify(data);
    this.localStorage.setItem('activities', jsonString);
  }, 1000);
});

if (previousData !== null) {
  data = JSON.parse(previousData);
}
