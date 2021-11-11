// For Navigation in Category
var startXMouse, startXUl, wasMoved, lastRoundFalse;

categoryFunctionality();

function categoryFunctionality(){
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
        categoryClicked(e);
    });

    category.addEventListener("mousedown", (e)=>{
        categoryDragStart(e);
    });

    category.addEventListener("mousemove", (e)=>{
        mouseMovedOnCategory(e);
    });

    //Scroll preload
    document.addEventListener("scroll", ()=>{
        setTimeout(checkIfPreloadIsRequired,500);
    });
}

function categoryClicked(e){
    if(!wasMoved){
        changeToCategoryByItem(e.target);
    }
}

function categoryDragStart(e){
    wasMoved = false;

    startXMouse = e.clientX;

    var categoryUl = document.querySelector("#category ul");
    var lastLeft = parseInt(categoryUl.style.left.replace("px"));
    if(!lastLeft) lastLeft = 0;
    startXUl = lastLeft;
}

function mouseMovedOnCategory(e){
    if(e.buttons != 0){
        lastRoundFalse = false;
        if(Math.abs(startXMouse - e.clientX) > 5){
            wasMoved = true;
            var categoryUl = document.querySelector("#category ul");

            categoryUl.classList.add("dragged");

            var newLeft = startXUl + (e.clientX - startXMouse);
            if(newLeft > 0) newLeft = 0;
            if(newLeft + categoryUl.offsetWidth < window.innerWidth) newLeft = window.innerWidth - categoryUl.offsetWidth;
            categoryUl.style.left = newLeft + "px"; 
        }
    } else if(!lastRoundFalse){
        lastRoundFalse = true;
        var categoryUl = document.querySelector("#category ul");

        categoryUl.classList.remove("dragged");
    }
}

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
        if(bodyEl.classList.contains("body_shown")){
            bodyEl.classList.remove("body_shown");
            elementEl.querySelector(".header .arrow svg").classList.remove("arrow_up");
        } else {
            bodyEl.classList.add("body_shown");
            elementEl.querySelector(".header .arrow svg").classList.add("arrow_up");
        }
    }
}

function checkIfPreloadIsRequired(){
    if(document.documentElement.scrollHeight - document.documentElement.scrollTop - 30 < document.documentElement.clientHeight){
        if(!loadedAllElements[activeCategory]){
            loadFurtherData(activeCategory);
            console.log("Data preloaded");
        }
    }
}