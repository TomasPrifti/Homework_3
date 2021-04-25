/* Foodish */
/* https://foodish-api.herokuapp.com/images/somefoodish/ */

/* Spoonacular */
/* https://spoonacular.com/food-api/ */
const api_key = "47acbd1bd0424de6b34f73a2162b0bd5";
const URLingredient = "https://spoonacular.com/cdn/ingredients_500x500/"


/* Main Code */
const MAX_LATERAL_BLOCK = 5;
let NUM_IMAGE = 0;
const data = ["pasta", "ice", "flour", "sugar", "oil", "salt", "orange"];
const word = data[Math.round(Math.random() * (data.length - 1))];

const section = document.querySelector("section");
const form = document.querySelector("form");
createLateralBlocks();
form.addEventListener("submit", searchBlock);
document.querySelector("#modal").addEventListener("click", closeModal);
document.querySelector("#modal_block").addEventListener("click", doNothing);
document.querySelector("#input_images").addEventListener("click", newImages);
const lateralImageList = document.querySelectorAll(".lateral_image");
newImages();
searchOnWeb1(word);


/* Start Function Declarations */

/* API Functions */

function searchOnWeb1(str) {
    fetch("https://api.spoonacular.com/food/ingredients/search?apiKey=" + api_key + "&query=" + str).then(onResponse, onError).then(onJson1);
}
function searchOnWeb2() {
    fetch("https://foodish-api.herokuapp.com/api/").then(onResponse, onError).then(onJson2);
}
function onResponse(response) {
    return response.json();
}
function onError(error) {
    console.log("Errore: " + error);
}
function onJson1(json) {
    document.querySelector("#all_blocks").innerHTML = "";
    createBlocks(json);
}
function onJson2(json) {
    lateralImageList[NUM_IMAGE++].src = json.image;
    /* Soluzione all'errore */
    /* if (NUM_IMAGE == MAX_LATERAL_BLOCK * 2) {
        NUM_IMAGE = 0;
    } */
}

/* Generic Functions */

function searchBlock(event) {
    event.preventDefault();
    const str = event.currentTarget.querySelector("#input_content").value.toLowerCase();
    searchOnWeb1(str);
}

function openModal(event) {
    const id = event.currentTarget.parentNode.dataset.id;
    fetch("https://api.spoonacular.com/food/ingredients/" + id + "/information?amount=1&apiKey=" + api_key).then(onResponse, onError).then(onJsonModal);
}

function onJsonModal(json) {
    document.querySelector("#modal_image").src = URLingredient + json.image;
    document.querySelector("#modal_name").textContent = json.name[0].toUpperCase() + json.name.substring(1).toLowerCase();
    document.querySelector("#modal_text").innerHTML = jsonDescription(json);
    const modal = document.querySelector("#modal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("no_scroll");
}

function jsonDescription(json) {
    const array = json.nutrition.nutrients;
    let str;

    str = "COST: " + json.estimatedCost.value + " " + json.estimatedCost.unit + "<br>NUTRIENTS:<br>";
    for (const obj of array) {
        str += " - " + obj.name.toUpperCase() + ": " + obj.amount + " " + obj.unit + ";<br>";
    }
    return str;
}

function closeModal(event) {
    document.body.classList.remove("no_scroll");
    document.querySelector("#modal").classList.remove("flex");
    document.querySelector("#modal").classList.add("hidden");
}

function doNothing(event) {
    event.stopPropagation();
}

function newImages() {
    NUM_IMAGE = 0; //Forse è meglio dentro la funzione
    for (let i = 0; i < MAX_LATERAL_BLOCK * 2; i++) {
        searchOnWeb2();
    }
}

/* Main Function */

function createBlocks(json) {

    /* Il JSON contiene un array di elementi chiamato 'results' dove ogni elemento ha il proprio 'id', 'name', 'image' */

    const array = json.results;
    const all_blocks = document.querySelector("#all_blocks");

    if (array.length == 0) {
        const noElement = document.createElement("h1");
        noElement.id = "noElement";
        noElement.textContent = "Nessun Prodotto Disponibile !";
        all_blocks.appendChild(noElement);
        return;
    }

    /* Creation all main blocks */
    let block, name, img, imageURL;

    for (let i = 0; i < array.length; i++) {

        /* Creation Block */
        block = document.createElement("div");
        block.classList.add("block");
        block.dataset.id = array[i].id;
        all_blocks.appendChild(block);

        /* Creation Name */
        name = document.createElement("h1");
        name.classList.add("name");
        name.textContent = array[i].name[0].toUpperCase() + array[i].name.substring(1).toLowerCase();
        block.appendChild(name);

        /* Creation Image */
        imageURL = URLingredient + array[i].image;
        img = document.createElement("img");
        img.classList.add("image");
        img.src = imageURL;
        block.appendChild(img);
    }

    const imageList = document.querySelectorAll(".image");
    for (const image of imageList) {
        image.addEventListener("click", openModal);
    }
}

function createLateralBlocks() {
    const lateral_blockList = document.querySelectorAll(".lateral_block");
    let image;

    for (const lateral_block of lateral_blockList) {
        for (let i = 0; i < MAX_LATERAL_BLOCK; i++) {
            image = document.createElement("img");
            image.classList.add("lateral_image");
            lateral_block.appendChild(image);
        }
    }
}