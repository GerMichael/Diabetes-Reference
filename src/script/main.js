/*
window.onerror = (errorMsg, 
    url, 
    lineNumber, 
    column, 
    errorObj)=>{
    debugText(errorMsg);
};
*/

// For Navigation in Category
//copied from: https://codepen.io/thenutz/pen/VwYeYEE
const slider = document.querySelector("#category");
let wasMoved = false;
let isDown = false;
let startX;
let scrollLeft;

//For convert
var defaultValue, defaultBe, defaultKe;

//Searchbar form prevent default
document.querySelector("#searchbar_background>form").addEventListener("submit", (e)=>{
    e.preventDefault();
    return false;
});

//Category Scroll and Click
(function categoryFunctionality(){
    // //Change to new Category via click
    // var categoryLis = document.querySelectorAll("#category ul li");
    
    // for(li of categoryLis){
    //     li.addEventListener("mouseup", (e)=>{
    //         categoryClicked(e);
    //     });
    // }

    //Scroll new Category
    var category = document.querySelector("#category");

    category.addEventListener("click", (e)=>{
        console.log("category clicked");
        categoryClicked(e);
    });

    category.addEventListener("mousedown", (e)=>{
        isDown = true;
        slider.classList.add('dragged');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    category.addEventListener("mouseleave", (e)=>{
        isDown = false;
        slider.classList.remove('dragged');
    });

    category.addEventListener("mouseup", (e)=>{
        isDown = false;
        slider.classList.remove('dragged');
    });

    category.addEventListener("mousemove", (e)=>{
        if(!isDown) {
            wasMoved = false;
            return;
        }
        wasMoved = true;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
        console.log(walk);
    });
})();

function categoryClicked(e){
    if(!wasMoved){
        var categoryLiItem = e.target.closest("li");
        changeToCategoryByItem(categoryLiItem);
    }
}

//Toggle Body of Subtitle (e.g. Milk)
function toggleSubtitleElements(e){
    if(e.target.classList.contains("hide_body_of_subtitle")){
        e.target.classList.remove("hide_body_of_subtitle");
    } else {
        e.target.classList.add("hide_body_of_subtitle");
    }
    var layer0 = document.getElementsByClassName("layer0")[0];
    var interruptIn = 1000;
    while(parseInt(window.getComputedStyle(layer0).height.replace("px","")) < window.innerHeight && interruptIn > 0){
        interruptIn--;
        if(!loadedAllElements){
            loadFurtherData(activeCategory);
        } else {
            break;
        }
    }
}


//Expand Body of Element
function expandElement(e){
    var basis = e.target;
    var elementEl = basis;
    var i = 0;
    while(!elementEl.classList.contains("element") && i < 100){
        elementEl = elementEl.parentElement;
        i++;
    }
    //if(basis.nodeName.toUpperCase() == "SVG".toUpperCase()) basis = basis.parentElement;
    
    var bodyEl = elementEl.querySelector(".body");

    if(bodyEl){
        if(elementEl.classList.contains("body_shown")){
            elementEl.classList.remove("body_shown");
            elementEl.querySelector(".header .arrow svg").classList.remove("arrow_up");
        } else {
            elementEl.classList.add("body_shown");
            elementEl.querySelector(".header .arrow svg").classList.add("arrow_up");
        }
    }
}

//Check if preload of Data is required (Scrolling Elements)
document.addEventListener("scroll", (e)=>{
    if(!document.getElementById("calc_background").classList.contains("calc_shown") && 
       !document.getElementById("settings_container").classList.contains("settings_shown")){
        hideSearch();
        setTimeout(checkIfPreloadIsRequired,500);
    } 
});

function checkIfPreloadIsRequired(){
    if((document.documentElement.scrollHeight - document.documentElement.scrollTop) - 1000 < document.documentElement.clientHeight){
        if(!loadedAllElements){
            loadFurtherData(activeCategory);
            console.log("Data preloaded");
        }
    }
}

//Hide or Show Header
document.getElementById("search_logo").addEventListener("click",showSearch);
//document.getElementById("searchbar_input").addEventListener("blur", requestHeaderHide);  

function toggleHeader(){
    var header = document.querySelector("body>header");

    if(header.classList.contains("header_hidden")){
        showSearch();
    } else {
        hideSearch();
    }
}

function requestHeaderHide(){
    var activeElement = document.activeElement;
    var header = document.querySelector("body>header");
    if(!header.contains(activeElement)){
        hideSearch();
    }
}

function hideSearch(){
    document.getElementById("settings_container").classList.remove("settings_shown");
    document.getElementById("settings_icon").classList.remove("rotate");
    document.querySelector("body>header").classList.add("header_hidden");
    document.getElementById("category").classList.add("category_only");
    document.getElementById("content").classList.add("category_only");
    document.querySelector("body>header #searchbar_input").blur();
}

function showSearch(){
    document.querySelector("body>header").classList.remove("header_hidden");
    document.getElementById("category").classList.remove("category_only");
    document.getElementById("content").classList.remove("category_only");
    var input = document.querySelector("body>header #searchbar_input");
    input.style.transform = 'TranslateY(-10000px)'; //Avoid display bug on first focus on searchbar_input: pretend that no scroll is required then focus and then reset
    input.focus();
    input.style.transform = 'none';
}

//Settings
document.getElementById("settings_icon").addEventListener("click", (e)=>{
    e.target.closest("#settings_icon").classList.add("rotate");
    setTimeout(()=>{
        document.getElementById("settings_icon").classList.remove("rotate");
    }, 1000);

    var settings_container = document.getElementById("settings_container"); 
    if(settings_container.classList.contains("settings_shown")){
        settings_container.classList.remove("settings_shown");
    } else {
        settings_container.classList.add("settings_shown");
    }
});

//Cookie
//copied from: https://www.w3schools.com/js/js_cookies.asp
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function checkCookieForColor() {
    var color = getCookie("color");
    if (color != "") {
      changeColorTo(color);
    } else {
      //no cookie set
    }
  }

checkCookieForColor();


//Change Color Scheme
(()=>{
    var colorElements = document.querySelectorAll("#color_container div");
    for(colEl of colorElements){
        colEl.addEventListener("click", (e)=>{
            var id = e.target.id;
            var color = id.substring(0,id.indexOf("-"));
            changeColorTo(color);
            setCookie("color", color, 365);
            var settings_container = document.getElementById("settings_container");
            settings_container.classList.remove("settings_shown");
        });
    }
})();

function changeColorTo(color){
    document.documentElement.style.setProperty('--main-color', `var(--color-${color})`);
    document.documentElement.style.setProperty('--main-color-background', `var(--background-${color})`);
    document.documentElement.style.setProperty('--main-color-background-hover', `var(--background-${color}-hover)`);
    document.documentElement.style.setProperty('--main-color-background-active', `var(--background-${color}-active)`);
    document.documentElement.style.setProperty('--main-color-mark', `var(--mark-${color})`);
}

//Convert Data to customers needs
document.getElementById("calc_background").addEventListener("click",(e)=>{
    closeCalc(e);
});
document.getElementById("calc_close_button").addEventListener("click",(e)=>{
    closeCalc(e);
});

function closeCalc(e){
    if(e.target == document.getElementById("calc_background") || e.target.closest("#calc_close_button") == document.getElementById("calc_close_button")){
        document.getElementById("calc_background").classList.remove("calc_shown");
        //unfreeze();
    }
}

document.getElementById("calc_value_input").addEventListener("change",updateBeKe);
document.getElementById("calc_value_input").addEventListener("focusout",updateBeKe);
document.getElementById("calc_value_input").addEventListener("focusin",(e)=>{e.target.select();});

document.querySelector("#calc_input>form").addEventListener("submit", (e)=>{
    e.preventDefault();
    return false;
});

function openConverter(foodElement){
    var valuesValide = false;
    var valueInput = document.getElementById("calc_value_input");
    var unitSpan = document.getElementById("calc_unit");
    if(valueInput && unitSpan){
        var text = foodElement.querySelector(".einheitsGr").innerText;
        var be = foodElement.querySelector(".el_be_val").innerText;
        var ke = foodElement.querySelector(".el_ke_val").innerText;
        if(value != ""){
            valuesValide = true;
            var textParts = text.split(" ");
            var value = textParts[0];
            var unit = textParts[1];

            defaultValue = value;
            defaultBe = be;
            defaultKe = ke;

            valueInput.value = value;
            unitSpan.innerText = unit;
            document.querySelector("#calc_result_be>span:nth-child(1)").innerText = be;
            document.querySelector("#calc_result_ke>span:nth-child(1)").innerText = ke;
        }
    } 

    if(valuesValide){
        document.getElementById("calc_error").classList.add("hidden");
        document.getElementById("calc_input").classList.remove("hidden");
    } else {
        document.getElementById("calc_error").classList.remove("hidden");
        document.getElementById("calc_input").classList.add("hidden");
    }
    document.getElementById("calc_background").classList.add("calc_shown");
    //freeze();
}

function updateBeKe(){
    var valueInput = document.getElementById("calc_value_input");
    var value = valueInput.value.replace(",", ".");
    if(value > 9999) {
        valueInput.value = 9999;
        value = "9999";
    }
    var numbers = /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/;
    if(value.match(numbers)){
        
        var isPlus = defaultBe.includes("+") || defaultKe.includes("+");
        if(!isPlus){
            var isStar = defaultBe.includes("*") || defaultKe.includes("*");
            var beNorm = defaultBe.replace("*","");
            var keNorm = defaultKe.replace("*","");
    
            var mult = value / defaultValue;
            var be = Math.round((beNorm * mult)*100)/100;
            var ke = Math.round((keNorm * mult)*100)/100;
            document.querySelector("#calc_result_be>span:nth-child(1)").innerText = be + (isStar ? "*" : "");
            document.querySelector("#calc_result_ke>span:nth-child(1)").innerText = ke + (isStar ? "*" : "");
        }
    }
}

//Freeze body
function freeze() {
    var top= window.scrollY;
      
    document.body.style.overflow= 'hidden';
  
    window.onscroll= function() {
      window.scroll(0, top);
    }
  }
  
  function unfreeze() {
    document.body.style.overflow= '';
    window.onscroll= null;
  }

//Debug text
function debugText(str){
    if(document.getElementById("debug")){
        document.getElementById("debug").innerText = str;
        setTimeout(()=>{
            document.getElementById("debug").innerText = "";
        },2000);
    }
}