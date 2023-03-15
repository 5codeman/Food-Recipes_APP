// Code is written by CHIRAG RAJ
"use strict";

// Get HTML element
let search_box = document.getElementById("search_box");
let main = document.getElementById("main");
let container = document.getElementById("container");
let favourite_btn = document.getElementById("favourite_btn");
let fav_exit = document.getElementById("EXIT");
let fav_body = document.getElementById("fav_body");
let heart = []; // it store dom of heart icon
let view = 0;
let btn_array = [];

//set array in local storage for store id of meal
if (localStorage.getItem("meals_id_array") === null) {
    let meals_id = [];
    localStorage.setItem("meals_id_array", JSON.stringify(meals_id));
}

//Create Array
let object_array = [];

//show alert
function show_alert(text) {
    alert(text);
}

//add event listener to the search box
search_box.addEventListener("keyup", find_Recipes);

// fetch the food data from API
function find_Recipes() {
    let search_value = search_box.value;
    // Get request
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + search_value)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // copy the fetch data to array
            object_array = data;
            // call render_cards functions and pass object_array
            render_cards(object_array);
        })
        .catch(function () {
            main.innerHTML = `<div id="error1">
                <p id="sad">😢</p>
                <p>There is no recipe matching your search</p>
            </div>`;
        })
}

//  Run a Loop and call append_cards functions
function render_cards(object_array) {
    //clear cards in each char next search
    main.innerHTML = "";
    let length = object_array.meals.length;
    for (let i = 0; i < length; i++) {
        append_cards(object_array.meals[i]);
    }
}

// set card in HTML
let card_btn_array = [];
let index = 0;
function append_cards(object) {
    let mealCard = document.createElement("div");
    mealCard.classList.add("food_card");
    mealCard.innerHTML = `
        <div class="card_img_div">
            <img class="card_img" src = "${object.strMealThumb}"/>
        </div >
        <p class="card_text_para">${object.strMeal}</p>
        <div class="card_lower_div">
            <button id="${object.idMeal}" class="btn">View Recipe</button>
            <span id="${object.idMeal}1" class="material-symbols-sharp"> favorite </span> 
        </div>`;
    //add 1 in id = ${object.idMeal} becuse i want to make all id unique for heart
    main.append(mealCard);

    //set heart as red color if it is in fav section
    // search in local storage for card is in fav section or not
    let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));
    for (let i = 0; i < mls_id.length; i++) {
        if (mls_id[i].idMeal === object.idMeal) {
            let HEART_ID = `${object.idMeal}1`;
            let element = document.getElementById(HEART_ID);
            element.style.color = "red";
        }
    }

    // for card view btn
    card_btn_array[index] = document.getElementById(`${object.idMeal}`);
    // add event listner for evry card button
    card_btn_array[index].addEventListener("click", Recipe_container);

    // for card heart
    heart[index] = document.getElementById(`${object.idMeal}1`);
    // add event listner for evry heart or fav button
    heart[index].addEventListener("click", add_to_fav);
    index++;
}

// Add recipes card to fav section
function add_to_fav(event) {
    // search in local storage for card is in fav section or not
    let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));
    for (let i = 0; i < mls_id.length; i++) {
        if ((event.target.id).slice(0, -1) === mls_id[i].idMeal) {
            show_alert("🧐 Your Meal Recipe already exists in your favourites list");
            return;
            // dont want to go downside of code if it return
        }
    }
    // find card whaich have to add in fav section
    mls_id = mls_id.concat(object_array.meals.filter(function (object) {
        return object.idMeal === (event.target.id).slice(0, -1);
    }));
    localStorage.setItem("meals_id_array", JSON.stringify(mls_id));
    localStorage_fetch();
    show_alert("😋 Your Meal Recipe has been added to your favourites list");

    // Add red color to heart
    (event.target).style.color = "red";
}

// work on View Recipe
function Recipe_container(event) {
    if (btn_array.includes(event.target.id) === true) {
        show_alert("🔒 Your Meal Recipe is already open\nOR\nClose the Recipes INSTRUCTIONS Page for reaching to your desired page");
    }
    else {
        btn_array.push(event.target.id);
        view++;
        // main.innerHTML = ""; // option1
        main.style.visibility = "hidden"; // alternate option 2
        // filter_array have 1 object whose meal id match with button target id
        let filter_array = object_array.meals.filter(function (object) {
            return object.idMeal === event.target.id;
        });

        let Recipe_div = document.createElement("div");
        Recipe_div.classList.add("Recipe_card");
        Recipe_div.innerHTML = `    
        <div id="left">
            <div id="left_upper">
                <img id="left_upper_img"src="${filter_array[0].strMealThumb}" alt="error">
                <p id="left_upper_p1">${filter_array[0].strMeal}</p>
                <p id="left_upper_p2">Cuisine : ${filter_array[0].strArea}</p>
            </div>
            <div id="left_lower">
                <a href="${filter_array[0].strYoutube}" target="_blank"><button id="left_lower_btn">Watch Video</button></a>
            </div>
        </div>

        <div id="right">
            <span id="${(event.target.id)}5" class="cross material-symbols-outlined">cancel</span>
            <h3 id="right_inst">INSTRUCTIONS</h3>
            <p id="right_p">${filter_array[0].strInstructions}</p>
        </div>`;

        container.append(Recipe_div);
        let cross = document.getElementsByClassName("cross");
        cross[0].addEventListener("click", exit_page);
    }
}

function exit_page(event) {
    //delete div on click of cross
    const index = btn_array.indexOf(event.target.id.slice(0, -1));
    btn_array.splice(index, 1);
    view--;
    let recipes_container_div = document.getElementsByClassName("Recipe_card");
    recipes_container_div[recipes_container_div.length - 1].remove();

    if (view === 0) {
        main.style.visibility = "visible";
    }
}

// work on favourite_section
favourite_btn.addEventListener("click", fav_page);

function fav_page() {
    container.style.filter = "brightness(50%)";
    let favourite_container = document.getElementById("favourite_container");
    favourite_container.style.right = "0vw";
    fav_exit.addEventListener("click", EXIT);

    function EXIT() {
        favourite_container.style.right = "-360px";
        container.style.filter = "brightness(100%)";
    }
    localStorage_fetch();
}

// fetch local storage for render page
function localStorage_fetch() {
    let localStorage_length = JSON.parse(localStorage.getItem("meals_id_array")).length;
    let meals_id_array = JSON.parse(localStorage.getItem("meals_id_array"));
    if (localStorage_length === 0) {
        fav_body.innerHTML = "<h2>No recipes added in your favourites list.</h2>";
    }
    else {
        fav_body.innerHTML = "";
        for (let i = 0; i < localStorage_length; i++) {
            //set card in fav div
            let mealCard = document.createElement("div");
            mealCard.classList.add("food_card");
            mealCard.innerHTML = `
            <div class="card_img_div">
                <img class="card_img" src = "${meals_id_array[i].strMealThumb}"/>
            </div>

            <p class="card_text_para">${meals_id_array[i].strMeal}</p>
            <div class="card_lower_div_fav">
                <button id="${meals_id_array[i].idMeal}2" class="btn1">View</button>
                <button id="${meals_id_array[i].idMeal}3" class="btn1">Remove</button>
            </div>`;

            //add 1 in id = ${object.idMeal} becuse i want to make all id unique for heart
            fav_body.append(mealCard);

            // for card view btn
            card_btn_array[index] = document.getElementById(`${meals_id_array[i].idMeal}2`);
            // add event listner for evry card button
            card_btn_array[index].addEventListener("click", Recipe_container1);

            // for card remove
            heart[index] = document.getElementById(`${meals_id_array[i].idMeal}3`);
            // add event listner for evry remove button
            heart[index].addEventListener("click", remove_from_fav);
            index++;
        }
    }
}

// work on View Recipe
function Recipe_container1(event) {

    if (btn_array.includes((event.target.id).slice(0, -1)) === true) {
        show_alert("🔒 Your Meal Recipe is already open\nOR\nClose the Recipes INSTRUCTIONS Page for reaching to your desired page");
    }
    else {
        btn_array.push((event.target.id).slice(0, -1));
        view++;
        // main.innerHTML = ""; // option1
        main.style.visibility = "hidden"; // alternate option 2
        // filter_array have 1 object whose meal id match with button target id
        let filter_array = JSON.parse(localStorage.getItem("meals_id_array")).filter(function (object) {
            return object.idMeal === (event.target.id).slice(0, -1);
        });

        let Recipe_div = document.createElement("div");
        Recipe_div.classList.add("Recipe_card");
        Recipe_div.innerHTML = `    
        <div id="left">
            <div id="left_upper">
                <img id="left_upper_img"src="${filter_array[0].strMealThumb}" alt="error">
                <p id="left_upper_p1">${filter_array[0].strMeal}</p>
                <p id="left_upper_p2">Cuisine : ${filter_array[0].strArea}</p>
            </div>
            <div id="left_lower">
                <a href="${filter_array[0].strYoutube}" target="_blank"><button id="left_lower_btn">Watch Video</button></a>
            </div>
        </div>

        <div id="right">
            <span id="${(event.target.id).slice(0, -1)}4" class="cross material-symbols-outlined">cancel</span>
            <h3 id="right_inst">INSTRUCTIONS</h3>
            <p id="right_p">${filter_array[0].strInstructions}</p>
        </div>`;

        container.append(Recipe_div);
        let cross = document.getElementsByClassName("cross");
        for (let i = cross.length - 1; i >= 0; i--) {
            cross[i].addEventListener("click", exit_page);
        }
    }
}

// remove recipes card from_fav section

function remove_from_fav(event) {
    // search in local storage for card is in fav section or not
    let mls_id = JSON.parse(localStorage.getItem("meals_id_array"));
    for (let i = 0; i < mls_id.length; i++) {
        if (mls_id[i].idMeal === event.target.id.slice(0, -1)) {
            mls_id.splice(i, 1);
        }
    }
    localStorage.setItem("meals_id_array", JSON.stringify(mls_id));
    localStorage_fetch();
    show_alert("🤪 Your Meal Recipe has been removed from your favourites list");

    // Remove red color from heart
    //fetch or find hert element by their id
    let HEART_ID = event.target.id.slice(0, -1) + 1; // add 1 because heart id is same as target id + 1.
    let element = document.getElementById(HEART_ID);
    // checking here because if browser is refresh and main div doesn't have any card so, it not set a id in heart so it through error in console that in element there is null.  
    if (element !== null) {
        element.style.color = "black";
    }

    // else we normaly remove card from fav div and it dirctly set black color on heart. it is because when main container render card on serach btn id is not present in local storage
}

// End code

