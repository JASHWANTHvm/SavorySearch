document.addEventListener('DOMContentLoaded', () => {
  const watchListContainer = document.getElementById('watch-list');
  const watchList = JSON.parse(localStorage.getItem('watchList')) || [];

  let html = '';
  if (watchList.length > 0) {
    watchList.forEach(meal => {
      html += `
        <div class="meal-item" data-id="${meal.id}">
          <div class="meal-img">
            <img src="${meal.img}" alt="food">
          </div>
          <div class="meal-name">
            <h3>${meal.name}</h3>
            <a href="#" class="recipe-btn">Get Recipe</a>
            <button class="remove-btn">Remove</button>
          </div>
        </div>
      `;
    });
  } else {
    html = `<img src="hi.jpg" alt="No items" style="width: 500px; height: auto;">`;
  }

  watchListContainer.innerHTML = html;

  // Add event listeners to recipe and remove buttons
  document.querySelectorAll('.recipe-btn').forEach(btn => {
    btn.addEventListener('click', getMealRecipeFromWatchList);
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', removeFromWatchList);
  });
});

// Function to remove an item from the watch list
function removeFromWatchList(e) {
  const mealItem = e.target.parentElement.parentElement;
  const mealId = mealItem.dataset.id;
  
  // Update the watch list in localStorage
  let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
  watchList = watchList.filter(meal => meal.id !== mealId);
  localStorage.setItem('watchList', JSON.stringify(watchList));

  // Remove the item from the DOM without reloading the list
  mealItem.remove();
}


// Function to fetch meal details from watch list
function getMealRecipeFromWatchList(e) {
  e.preventDefault();
  const mealItem = e.target.parentElement.parentElement;
  const mealId = mealItem.dataset.id;
  
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => mealRecipeModal(data.meals[0]));
}
 

function mealRecipeModal(meal) {
  const mealDetailsContent = document.querySelector('.meal-details-content');
  const instructions = meal.strInstructions.split('. ').map(step => `<li>${step}.</li>`).join('');
  const ingredients = [];

  // Collect ingredients
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient) {
      ingredients.push(`<li>${measure} ${ingredient}</li>`);
    }
  }
  
  mealDetailsContent.innerHTML = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
      <h3>Instructions:</h3>
      <ul>${instructions}</ul>
    </div>
    <div class="recipe-ing">
      <h3>Ingredients:</h3>
      <ul>${ingredients.join('')}</ul>
    </div>
    <div class="recipe-meal-img">
      <img src="${meal.strMealThumb}" alt="">
    </div>
    <div class="recipe-link">
      <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
  `;
  mealDetailsContent.parentElement.classList.add('showRecipe');
}
