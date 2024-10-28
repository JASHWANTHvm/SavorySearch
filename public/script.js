document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const searchBtn = document.getElementById('search-btn');
    const mealList = document.getElementById('meal');
    const mealDetailsContent = document.querySelector('.meal-details-content');
    const recipeCloseBtn = document.getElementById('recipe-close-btn');

    if (registerBtn) registerBtn.addEventListener('click', registerUser);
    if (loginBtn) loginBtn.addEventListener('click', loginUser);
    if (searchBtn) searchBtn.addEventListener('click', getMealList);
    if (mealList) mealList.addEventListener('click', getMealRecipe);
    if (recipeCloseBtn) recipeCloseBtn.addEventListener('click', () => {
        mealDetailsContent.parentElement.classList.remove('showRecipe');
    });

    async function registerUser() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message);
    }

    async function loginUser() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index1.html';
        } else {
            alert(data.message);
        }
    }

    async function getMealList() {
        const searchInputTxt = document.getElementById('search-input').value.trim();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        const response = await fetch(`http://localhost:5000/meals/${searchInputTxt}`, {
            headers: { 'Authorization': token }
        });

        const data = await response.json();
        let html = '';
        if (data.meals) {
            data.meals.forEach(meal => {
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
            mealList.classList.remove('notFound');
        } else {
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
    }

    async function getMealRecipe(e) {
        e.preventDefault();
        if (e.target.classList.contains('recipe-btn')) {
            let mealItem = e.target.parentElement.parentElement;
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`);
            const data = await response.json();
            mealRecipeModal(data.meals[0]);
        }
    }

    function mealRecipeModal(meal) {
        let html = `
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
        mealDetailsContent.innerHTML = html;
        mealDetailsContent.parentElement.classList.add('showRecipe');
    }
});
