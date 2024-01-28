////////// global ///////////////////////////////////////////////////////
let searchByFirstLitter = document.getElementById('searchByFirstLitter');
let displayMealsMain =document.getElementById('displayMealsMain');// in main section
const sectionsLinks =document.querySelectorAll('li[role="button"]')//nav links
const inputs = document.querySelectorAll('#Contact-Us input'); //inputs of contact section only
const formData = document.querySelector("form");
const loader = document.querySelector('.loading'); 

////////// when start ///////////////////////////////////////////////////
getMeals('https://themealdb.com/api/json/v1/1/search.php?s=', 0);

//////////// EVENTS//////////////////////////////////////////////////////

// open side nav
document.getElementById('open-close').addEventListener('click',function(){
    openClose();
});

// section choose to display
for (let i = 0; i < sectionsLinks.length; i++) {
    const api =sectionsLinks[i].getAttribute('data-api');
    sectionsLinks[i].addEventListener('click',function(){
        hideAllSections();
        openClose();
        document.getElementById(`${sectionsLinks[i].innerHTML}`).classList.remove('d-none');
        getMeals(`https://www.themealdb.com/api/json/v1/1/${api}`, i);
    }) 
}

// call api while searching by name
document.getElementById('searchByName').addEventListener('input',function(){
    getMeals(`https://themealdb.com/api/json/v1/1/search.php?s=${searchByName.value}` , 0)
})

// call api while searching by letter
searchByFirstLitter.addEventListener('input',function(){
    let length = searchByFirstLitter.value.length;
    if (length == 0) {
        getMeals(`https://themealdb.com/api/json/v1/1/search.php?f=a`, 0);
    }else if(length ==1){
        getMeals(`https://themealdb.com/api/json/v1/1/search.php?f=${searchByFirstLitter.value}`, 0);
    }else{
        searchByFirstLitter.value = searchByFirstLitter.value.slice(0, 1);
        getMeals(`https://themealdb.com/api/json/v1/1/search.php?f=${searchByFirstLitter.value}`, 0);
    }
})

///// real time validation call
formData.addEventListener('input',function(e){
    const inputsFeilds =['name' , 'email', 'phone', 'age','password' ,'re-password'];
    for (let i = 0 ; i < inputsFeilds.length ; i++) {
        if(e.target.id == inputsFeilds[i]){
            validation(i);
        }
    }

    if (hasClass(inputs[0], "is-valid") && hasClass(inputs[1], "is-valid") && hasClass(inputs[2], "is-valid") && hasClass(inputs[3], "is-valid") && hasClass(inputs[4], "is-valid") && hasClass(inputs[5], "is-valid")) {
        document.getElementById('submit').classList.remove('disabled')
    } else {
        document.getElementById('submit').classList.add('disabled')
    }
});

// form submit actions
formData.addEventListener('submit',function(e){
    e.preventDefault();
    formReset();
    document.getElementById('msg').classList.remove('d-none');
});

//////////////////////FUNCTIONS //////////////////////////////////////////
// side nav toggle
function openClose(){
    const iconToggle = document.getElementById('iconToggle').classList;
    $('.menu').animate({width:'toggle'}, 500);

    if (iconToggle.contains('fa-bars')){
        for (let i = 0; i < 5; i++) {
            $(".menu #links ul li").eq(i).animate({
                top: 0
            }, (i + 5) * 100)
        }
        iconToggle.remove('fa-bars');
        iconToggle.add('fa-xmark');
    } else {
        $(".menu #links ul li").animate({
            top: 300
        }, 400)
        iconToggle.remove('fa-xmark');
        iconToggle.add('fa-bars');
    }
}

// api fetch 
async function getMeals(api , x){
    loader.classList.remove('d-none');

    let apiData; 
    if(api =="none"){
        displayMealsMain.innerHTML="";
    }else{
        const apiResponse =await fetch(`${api}`);
        if(apiResponse.ok ==true){
            apiData = await apiResponse.json();
            if(x==0){
                displayMeals(apiData.meals);
            }else if (x==1){
                displayCategories(apiData.categories);
            }else if (x==2){
                displayArea(apiData.meals);
            }else if (x==3){
                displayIngredients(apiData.meals);
            }else if (x==4){
                displayInstruction(apiData.meals[0])
            }
        }
    }
    loader.classList.add('d-none')
}

// display Meals
function displayMeals(data){
    displayMealsMain.classList.remove('d-none');
    let cartona =``;
        for( let i =0 ; i < data.length ; i++ ){
            cartona+=`
            <div class="col" >
            <div onclick="getInstruction('${data[i].idMeal}')" class="cursor">
                <div class="imgContainer rounded-3 w-100 h-auto position-relative">
                    <img src="${data[i].strMealThumb}" alt="" class="w-100 rounded-3">
                    <div class="w-100 h-100 position-absolute top-100 d-flex picFade">
                        <h3 class="my-auto text-black">${data[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        </div>
        `}
    displayMealsMain.innerHTML=cartona;
}

// categorieeesssss
function displayCategories(data){
    let cartona =``;
        for( let i =0 ; i < data.length ; i++ ){
            let paragraph = data[i].strCategoryDescription;
            let sentences = paragraph.split(/[.(]/);
            cartona+=`
            <div class="col">
            <div class="cursor" onclick="mealsByCategory('${data[i].strCategory}')">
                <div class="imgContainer rounded-3 w-100 h-auto position-relative">
                    <img src="${data[i].strCategoryThumb}" alt="" class="w-100 rounded-3">
                    <div class="w-100 h-100 position-absolute top-100 picFade mx-auto text-black text-center p-3">
                            <h3 class="m-0">${data[i].strCategory}</h3>
                            <p>${sentences[0]}</p>
                    </div>
                </div>
            </div>
        </div>
        `}
    document.getElementById('displayList').innerHTML=cartona;
}

// area
function displayArea(data){
    // the api return nationality not country name,so I couldn't find a function that generate country codes alpha-2 for the flags , so I wrote the array static
    let flags =["us","gb","ca","cn","hr","nl","eg","ph","fr","gr","in","ie","it","jm","jp","KE","my","mx","ma","pl","pt","ru","es","th","tn","tr","","vn"]
    let cartona =``;
        for( let i =0 ; i < data.length ; i++ ){
            cartona+=`
            <div class="col text-white text-center h-100">
                <div class="rounded-3 w-100 cursor h-100" onclick="mealsByArea('${data[i].strArea}')">
                    <img src="https://www.themealdb.com/images/icons/flags/big/64/${flags[i]}.png" alt="" class="w-75 rounded-3" onerror="this.src='./img/onError.png'">
                    <i class="fa-solid fa-house-laptop fa-4x d-none"></i>
                    <h3 class="m-0">${data[i].strArea}</h3>
                </div>
            </div>
            `
        }
    document.getElementById('displayArea').innerHTML= cartona;
}

// ingerediance
function displayIngredients(data){
    let cartona =``;
        for( let i =0 ; i < 20 ; i++ ){
            let paragraph = data[i].strDescription;
            let sentences = paragraph.split(/[.(]/);
            cartona+=`
            <div class="col text-white text-center">
                <div class="rounded-3 w-100 cursor" onclick="mealsByIngredients('${data[i].strIngredient}')">
                    <img src="https://www.themealdb.com/images/ingredients/${data[i].strIngredient}.png" alt="" class="w-75 rounded-3">
                    <h3 class="m-0">${data[i].strIngredient}</h3>
                    <p>${sentences[0]}</p>
                </div>
            </div>
            `}
    document.getElementById('displayIng').innerHTML= cartona;
}
// instruction call
function getInstruction(x){
    hideAllSections();
    document.getElementById('instructionsContainer').classList.remove('d-none');
    getMeals(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${x}`,4)
}
// instruction display
function displayInstruction(data){
    let ingredients = ``;
    let tagsShow = ``;

    for (let i = 1; i <= 20; i++) {
        if (data[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1 d-inline-block">${data[`strMeasure${i}`]} ${data[`strIngredient${i}`]}</li>`
        }
    }

    let ingTags = `${data.strTags}`;
    let sentences = ingTags.split(/\,/);
    for (let i = 0; i  < sentences.length; i++) {
        if(sentences[i] == "null" || sentences[i] ==""){
            continue;
        }else{
        tagsShow += `<li class="alert alert-danger m-2 p-1 d-inline-block">${sentences[i]}</li>`
        }
    }

    let cartona=`
            <div class="col-md-4">
                <img src="${data.strMealThumb}" alt="" class="w-100 rounded-3">
                <h2>${data.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${data.strInstructions}</P>
                <h3><span class="fw-bolder">Area: </span> ${data.strArea}</h3>
                <h3><span class="fw-bolder">Category: </span> ${data.strCategory}</h3>
                <h3><span class="fw-bolder">Recipes: </span></h3>
                <ul class="list-unstyled">${ingredients}</ul>
                <h3><span class="fw-bolder">Tags:</span></h3>
                <ul class="list-unstyled">${tagsShow}</ul>
                <a href="${data.strSource}" target="_blank" class="btn btn-success m-2">Source</a>
                <a href="${data.strYoutube}" target="_blank" class="btn btn-danger m-2">Youtube</a>
            </div>
    `;
    document.getElementById('Instructions').innerHTML=cartona;
}

// meals api call by area 
function mealsByArea(x){
    hideAllSections();
    displayMealsMain.classList.remove('d-none');
    getMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${x}`,0)
}

// meals api call by ingredients 
function mealsByIngredients(x){
    hideAllSections();
    displayMealsMain.classList.remove('d-none');
    getMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${x}`,0)
}

// meals api call by categories 
function mealsByCategory(x){
    hideAllSections();
    displayMealsMain.classList.remove('d-none');
    getMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${x}`,0)
}

// validation
function validation(x){
    if(x == 5){
        if (inputs[4].value == inputs[5].value ) {
            inputs[x].classList.add("is-valid");
            inputs[x].classList.remove("is-invalid");
        } else {
            inputs[x].classList.add("is-invalid");
            inputs[x].classList.remove("is-valid");
        }
    }else{
        const regex =[ /^[a-zA-Z]{2,}$/, //name
                        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,//email
                        /^01[0-1-2-5]\d{8}$/,//phone number
                        /^([1-7][0-9]|80)$/, //age
                        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,//password
                    ];

        if (regex[x].test(inputs[x].value)) {
            inputs[x].classList.add("is-valid");
            inputs[x].classList.remove("is-invalid");
        } else {
            inputs[x].classList.add("is-invalid");
            inputs[x].classList.remove("is-valid");
        }
    }
}

////check feild validation
function hasClass(element, className) {
    return element.classList.contains(className);
}

function formReset(){
    formData.reset();

    const allInputs = document.querySelectorAll('input');
    for(let i =0 ; i < allInputs.length ; i++){
        allInputs[i].classList.remove("is-valid","is-invalid")
        allInputs[i].value="";
    }
    
    document.getElementById('msg').classList.add('d-none');
}

function hideAllSections(){
    const sectionsDisplay =document.querySelectorAll('section')

    for(let x =0 ; x<sectionsDisplay.length ; x++){
        sectionsDisplay[x].classList.add('d-none');
    }
    displayMealsMain.classList.add('d-none');
    document.getElementById('instructionsContainer').classList.add('d-none');
    displayMealsMain.innerHTML='',
    formReset();
}

