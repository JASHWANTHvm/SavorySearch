document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const mealList = document.getElementById('meal');
  const mealDetailsContent = document.querySelector('.meal-details-content');
  const recipeCloseBtn = document.getElementById('recipe-close-btn');
  const categoryDropdown = document.getElementById('category-dropdown');
  const areaDropdown = document.getElementById('area-dropdown');
  const allListDropdown = document.getElementById('all-list-dropdown');

  // Event listeners
  searchBtn.addEventListener('click', getMealList);
  mealList.addEventListener('click', getMealRecipe);
  recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    alert('Logged out successfully!');
  });

  // Alphabet list for "All List"
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let html = '';
  alphabet.forEach(letter => {
    html += `<li><a class="dropdown-item" href="#" data-letter="${letter}">${letter}</a></li>`;
  });
  allListDropdown.innerHTML = html;

  allListDropdown.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      fetchMealsByFirstLetter(e.target.dataset.letter);
    });
  });

  // Fetch categories and populate dropdown
  fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
    .then(response => response.json())
    .then(data => {
      let html = '';
      data.meals.forEach(category => {
        html += `<li><a class="dropdown-item" href="#" data-category="${category.strCategory}">${category.strCategory}</a></li>`;
      });
      categoryDropdown.innerHTML = html;

      categoryDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          fetchMealsByCategory(e.target.dataset.category);
        });
      });
    });

  // Fetch areas and populate dropdown
  fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    .then(response => response.json())
    .then(data => {
      let html = '';
      data.meals.forEach(area => {
        html += `<li><a class="dropdown-item" href="#" data-area="${area.strArea}">${area.strArea}</a></li>`;
      });
      areaDropdown.innerHTML = html;

      areaDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          fetchMealsByArea(e.target.dataset.area);
        });
      });
    });

  function fetchMealsByCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then(response => response.json())
      .then(data => displayMeals(data.meals));
  }

  function fetchMealsByArea(area) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
      .then(response => response.json())
      .then(data => displayMeals(data.meals));
  }

  function fetchMealsByFirstLetter(letter) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
      .then(response => response.json())
      .then(data => displayMeals(data.meals));
  }

  function displayMeals(meals) {
    let html = '';
    if (meals) {
      meals.forEach(meal => {
        html += `
          <div class="meal-item" data-id="${meal.idMeal}">
            <div class="meal-img">
              <img src="${meal.strMealThumb}" alt="food">
            </div>
            <div class="meal-name">
              <h3>${meal.strMeal}</h3>
              <a href="#" class="recipe-btn">Get Recipe</a>
              <a href="#" class="watchlist-btn">Add to Wish List</a>
            </div>
          </div>
        `;
      });
    } else {
      html = "Sorry, we couldn't find any meals.";
    }
    mealList.innerHTML = html;

    // Add event listeners for the Watch List button
    document.querySelectorAll('.watchlist-btn').forEach(button => {
      button.addEventListener('click', addToWatchList);
    });
  }

  function getMealList() {
    const searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
      .then(response => response.json())
      .then(data => displayMeals(data.meals));
  }

  function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
      const mealItem = e.target.parentElement.parentElement;
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals[0]));
    }
  }
  
  function mealRecipeModal(meal) {
    // Prepare the instructions as a bullet list
    const instructionsList = meal.strInstructions.split('. ').map(step => `<li>${step.trim()}</li>`).join('');
  
    // Prepare the ingredients
    const ingredientsList = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient) {
        ingredientsList.push(`<li>${measure ? measure + ' ' : ''}${ingredient}</li>`);
      }
    }
  
    mealDetailsContent.innerHTML = `
      <h2 class="recipe-title">${meal.strMeal}</h2>
      <p class="recipe-category">${meal.strCategory}</p>
      <div class="recipe-instruct">
        <h3>Instructions:</h3>
        <p>${instructionsList}</p>
      </div>
      <div class="recipe-ingredients">
        <h3>Ingredients:</h3>
        <p>${ingredientsList.join('')}</p>
      </div>
      <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      </div>
      <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
      </div>
    `;
    mealDetailsContent.parentElement.classList.add('showRecipe');
  }
  
  function addToWatchList(e) {
    e.preventDefault();
    const mealItem = e.target.parentElement.parentElement;
    const mealId = mealItem.dataset.id;
    const mealName = mealItem.querySelector('.meal-name h3').innerText;
    const mealImg = mealItem.querySelector('.meal-img img').src;

    const watchList = JSON.parse(localStorage.getItem('watchList')) || [];
    if (!watchList.some(meal => meal.id === mealId)) {
      watchList.push({ id: mealId, name: mealName, img: mealImg });
      localStorage.setItem('watchList', JSON.stringify(watchList));
      alert('Added to Wish List!');
    } else {
      alert('Already in Wish List');
    }
  }
});