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
              </div>
            </div>
          `;
        });
      } else {
        html = "Sorry, we couldn't find any meals.";
      }
      mealList.innerHTML = html;
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
      mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
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
  });
  