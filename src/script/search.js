var input = document.getElementById("searchbar_input");
var lastStr = "";
var filterData;
var searchResults = Array(9); resetSearchResults();

input.addEventListener("keyup",(e)=>{
    handleSearchInput(e);
});

input.addEventListener("focusout",(e)=>{
});

function handleSearchInput(e){
    //debugText(e);
    if(e.key != "Shift"    && 
       e.key != "Alt"      &&
       e.key != "Control"  &&
       e.key != "AltGraph" && 
       e.key != "CapsLock"   ){
        if(e.key == "Escape"){
            hideSearch();
        }else if(e.key == "Enter"){
            var searchStr = input.value.trim();
            
            startSearch(searchStr);
        } else {
            /*
            if(input.value != "" && input.value != lastStr){
                if(input.value.includes(lastStr)){
                    //continue search
                } else {
                    //new search
                    filterData = JSON.parse(dataStringResponse);
                    filterWithString(input.value);
                }
            }
            */
        }
    }
}

function startSearch(searchStr){
    maxElementNum = dataLoadInterval;
    clearContent();
    if(searchStr != ""){
        isSearch = true;
        var inputRegexString = searchStr.replace(" ","|");
        var inputRegexValidate = "(?=.*" + searchStr.replace(" ",")(?=.*") + ").*";

        var searchRegex = new RegExp(inputRegexString, "gi");
        var validRegex = new RegExp(inputRegexValidate, "gi");
        // /wordA|wordB|wordC/

        filterWithString(searchRegex, validRegex); //.match(searchRegex);
    } else{
        isSearch = false;
        resetElements();
    }
    updateCategory();
    selectFirstCategory();
    hideSearch();
}

function clearContent(){
    resetSearchResults();
    removeOldCategory(activeCategory);
}

function filterWithString(searchRegex, validRegex){
    filterData = JSON.parse(dataStringResponse);
    filterData.subElements.forEach((element, index, arr) => {
        var relevant = checkElement(element, searchRegex, validRegex, index);
        if(!relevant) arr[index] = null;
    });
    dataToUse = filterData;
    createElements(activeCategory);
}

function checkElement(element, searchRegex, validRegex, category){
    var selfRelevant = false;
    //if(element.name.includes("Kräuterquark")) console.log("Kräuterquark");
    //console.log(element.layer, element.name);
    if(element.name.match(validRegex) && element.layer > 2){
        element.searchStrFoundStart = [];
        element.searchStrFoundEnd = [];
        selfRelevant = true;
        while ((match = searchRegex.exec(element.name)) != null) {
            element.searchStrFoundStart.push(match.index);
            element.searchStrFoundEnd.push(match.index + match[0].length);
        }
        searchResults[category]++;
    }
    if(element.subElements){
        element.subElements.forEach((childElement, index, arr) => {
            var childRelevant = checkElement(childElement, searchRegex, validRegex, category);
            if(childRelevant) {
                selfRelevant = true;
                if(element.layer == 3) element.expanded = true;
            } else {
                element.subElements[index] = null;
            }
        });
    }
    return selfRelevant;
}

//Searchbar Input:
document.getElementById("searchbar_clear").addEventListener("click",clearSearchbarInput);

function clearSearchbarInput(){
    if(input.value == ''){
        startSearch('');
    } else {
        input.value = '';
        input.focus();  
    }  
}

function resetElements(){
    dataToUse = JSONData;
    createElements(activeCategory);
}

function updateCategory(){
    var categoryUl = document.querySelector("#category>ul");
    var indices = getIndices(searchResults);
    for(let i = 0; i < categoryUl.children.length; i++){
        var child = categoryUl.children[i];
        
        var resultIndicator = child.querySelector(".search_result_num");
        resultIndicator.innerText = searchResults[i];

        var brEl = child.querySelector("br.single_line");
        if(isSearch){
            resultIndicator.classList.add("shown");
            child.style.order = indices[i];
            if(brEl) brEl.classList.remove("hidden");
        } else {
            resultIndicator.classList.remove("shown");
            child.style.order = "";
            if(brEl) brEl.classList.add("hidden");
        }
    }
}

function getIndices(array){
    if(array){
        var indices = new Array(array.length);
        for(let i = 0; i < indices.length; i++){
            indices[i] = 1;
        }

        for(let i = 0; i < array.length; i++){
            for(let j = 0; j < array.length; j++){
                if(array[j] > array[i] && i != j){
                    indices[i]++;
                }
            }
        }
        return indices;
    }
    return null;
}

function resetSearchResults(){
    for(let i = 0; i < searchResults.length; i++){
        searchResults[i] = 0;
    }
}

function selectFirstCategory(){
    var firstChild = document.querySelector('#category>ul>li[style*="1"]');
    if(!firstChild) firstChild = document.querySelector('#category>ul>li');
    changeToCategoryByItem(firstChild);
    firstChild.scrollIntoView();
}