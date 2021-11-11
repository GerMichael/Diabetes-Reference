var dataStringResponse; 
var JSONData;
var dataToUse;
var dataLoadInterval = 100;
var maxElementNum = dataLoadInterval;
var loadedAllElements = false;
var elementsCount = 0;
var activeCategory = 0;
var startTime;
var isSearch = false;

loadData();

//copied from: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadData() {
    console.log("Data Download started!");
    loadJSON(function(response) {
        dataStringResponse = response;
        // Parse JSON string into object
        var loadingTime = Date.now() - startTime;
        console.log("Data is loaded within " + (loadingTime) + "ms!");
        JSONData = JSON.parse(response);
        console.log("Data is parsed within " + ((Date.now() - startTime) - loadingTime) + "ms!");
        createContent();
        console.log(maxElementNum + " Elements created within " + ((Date.now() - startTime) - loadingTime) + "ms!");
        checkCookieForCategory();
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("content").classList.remove("hidden");
    });
}

function loadJSON(callback) {
    let url = './data/data.min.json';
    startTime = Date.now();
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
       
    xobj.open('GET',url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        document.getElementById("loading_indicator").innerHTML = "Loading<br/>" + (Math.round(byteCount(xobj.responseText) / xobj.getResponseHeader('content-length') * 100)) + "%";
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}

function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}

function createContent(){
    var ulLayer0 = createUl(["layer0"],null);
    document.getElementById("content").appendChild(ulLayer0);
    dataToUse = JSONData;
    createElements(0);
}

function createElements(category){    
    var lastParents = new Array(4);
    lastParents[0] = document.getElementById("content").querySelector(".layer0");

    createElementsFromCategory(category, lastParents);
}

function createElementsFromCategory(category, lastParents){
    elementsCount = 0;

    if(category >= 0 && category < dataToUse.subElements.length){
        var categoryData = [dataToUse.subElements[category]];
        if(categoryData[0]){
            document.getElementById("nothing_found").classList.add("hidden");
            createChildren(categoryData, lastParents, dataToUse.subElements[category].id);
        } else {
            document.getElementById("nothing_found").classList.remove("hidden");
        }
    }
}

function createChildren(dataArray, lastParents, catStartVal){
    if(dataArray){
        dataArray.forEach((element,index,arr) => {
            if(element){
                if(elementsCount <= maxElementNum){
                    if(elementsCount >= maxElementNum - dataLoadInterval || maxElementNum - dataLoadInterval == 0 && elementsCount == 0){
                        var newUlParent = createItself(element, lastParents);
                        lastParents[element.layer + 1] = newUlParent;
                    }else {
                        lastParents[element.layer + 1] = element.liItem.querySelector("ul");
                    }
                    
                    createChildren(element.subElements, lastParents, catStartVal);
                    
                    if(activeCategory < JSONData.subElements.length - 1){
                        if(element.id == JSONData.subElements[activeCategory + 1].id - 1){
                            loadedAllElements = true;
                        }
                    } else {
                        if(element.id == JSONData.lastId){
                            loadedAllElements = true;
                        }
                    }
                }
                arr[index] = element;
                elementsCount++;
            }
        });
    }
}

function createItself(element, lastParents){
    //console.log(element);
    switch(element.layer){
        case 0: createLayerNElement = createLayer0Element; break;
        case 1: createLayerNElement = createLayer1Element; break;
        case 2: createLayerNElement = createLayer2Element; break;
        case 3: createLayerNElement = createLayer3Element; break;
        case 4: createLayerNElement = createLayer4Element; break;
    }

    return createLayerNElement(element, lastParents);
}

/*****************************************
 * Layer 0: Kategorie
 * Layer 1: Subtitle 1
 * Layer 2: Subtitle 2
 * Layer 3: Element 1
 * Layer 4: Variation
 *
 *****************************************/

//Controller
function createLayer0Element(element, lastParents){
    return createCategory(element, lastParents[element.layer]);
}

function createLayer1Element(element, lastParents){
    return createSubtitle(element, lastParents[element.layer]);
    lastParents[element.layer + 1] = ul;
}

function createLayer2Element(element, lastParents){
    return createSubtitle(element, lastParents[element.layer]);
    lastParents[element.layer + 1] = ul;
}

function createLayer3Element(element, lastParents){
    return createFoodElement(element, lastParents[element.layer]);
    lastParents[element.layer + 1] = ul;
}

function createLayer4Element(element, lastParents){
    createFoodElement(element, lastParents[element.layer], true);
}

//Creating Layer 0 (Category Listitems)
function createCategory(element, parent){
    var li = createLiItem(parent);
    li.classList.add("cat" + activeCategory);
    element["liItem"] = li;

    return createUl(["layer" + (element.layer + 1)], li);
}

//Creating Layer 1 & 2 Listitems
function createSubtitle(element, parent){
    var li = createLiItem(parent);
    element["liItem"] = li;
    var hEl = createH(element, li);
    hEl.addEventListener("click", (e)=>{toggleSubtitleElements(e)});

    var classNames = [];
    classNames.push("layer"+(element.layer + 1));
    if(element.layer == 2) classNames.push("elements");

    return createUl(classNames, li);
}

function createFoodElement(element, parent, noVariation){
    var li = createLiItem(parent);
    element["liItem"] = li;
    var elementDiv = createDiv("element",li);
    if(element.expanded){
        elementDiv.classList.add("body_shown");
    }
    
    createHeader(element, elementDiv);
    return createBody(element, elementDiv, noVariation);
}


//Create Element
function createHeader(element, parent){
    var headerDiv = createDiv("header",parent);

    //Click Eventlistener;
    headerDiv.addEventListener("click", (e)=>{
        expandElement(e);
    });

    //Element Name
    var elNameDiv = createDiv("el_name",headerDiv);
    var spanEl = createSpan(null, elNameDiv);

    if(isSearch && element.searchStrFoundStart != null){ //if search mark is required to highlight searched text
        //Splitting the name into the part before mark, mark and after mark -> then add all 
        var lastIndex = 0;
        for(let i = 0; i < element.searchStrFoundStart.length + 1; i++){
            var elNamePart1 = element.name.substring(lastIndex, element.searchStrFoundStart[i]);
            if(elNamePart1.startsWith(" ")) elNamePart1 = "\u00A0" + elNamePart1.substring(1);
            spanEl.append(document.createTextNode(elNamePart1));
            if(i < element.searchStrFoundStart.length){
                var markEl = createMark(null,spanEl);
                var elNamePartSearch = element.name.substring(element.searchStrFoundStart[i], element.searchStrFoundEnd[i]);
                markEl.append(document.createTextNode(elNamePartSearch));
            }
            lastIndex = element.searchStrFoundEnd[i];
        }
    } else { //or just add the name
        var elName = document.createTextNode(element.name);
        spanEl.appendChild(elName);
    }

    //Element Values
    var valueDiv = createDiv("values", headerDiv);
    createValues(element, valueDiv);

    //Arrow
    var arrowDiv = createDiv("arrow", headerDiv);
    var arrow = createArrow(arrowDiv);
}

function createValues(element, parent){
    var beSpan = createSpan("el_be", parent);
    var keSpan = createSpan("el_ke", parent);

    createBeKe("be",element, beSpan);
    createBeKe("ke",element, keSpan);

}

function createBeKe(unit,element, parent){
    var val = unit == "be" ? element.be : element.ke;

    var beVal = document.createTextNode(val);
    var beValSpan = createSpan("el_" + unit + "_val", parent);
    beValSpan.appendChild(beVal);
    
    var beUni = document.createTextNode(unit.toUpperCase());
    var beUniSpan = createSpan("el_" + unit + "_uni", parent);
    beUniSpan.appendChild(beUni);
}

function createArrow(parent){
    var svg = createSvg();

    parent.appendChild(svg);
}

function createBody(element, parent, noVariation){
    var bodyDiv = createDiv("body",parent);

    //Unit
    var unitDiv = createDiv("unit", bodyDiv);
    var spanContainer = createSpan("equals_container", unitDiv);
    var entsprichtText = document.createTextNode("entspricht ");
    spanContainer.appendChild(entsprichtText);

    var entspricht = createSpan("entsprEinh", unitDiv);
    var entsprichtText = document.createTextNode(element.entsprichtEinheit ? element.entsprichtEinheit : "-");
    entspricht.appendChild(entsprichtText);
    
    spanContainer.appendChild(entspricht);
    
    var entsprichtEinheit = createSpan("einheitsGr", unitDiv);
    var entsprichtEinheitText = document.createTextNode(element.einheitsGroesse ? element.einheitsGroesse : "-");
    entsprichtEinheit.appendChild(entsprichtEinheitText);

    spanContainer.appendChild(entsprichtEinheit);

    if(element.einheitsGroesse){
        var calc = createSpan("calc_container",unitDiv);
        var aEl = createA("calc_button",calc,"","Umrechnen ");
        aEl.addEventListener("click", (e)=>{
            var foodElement = e.target.closest(".element");
            openConverter(foodElement);
        });
    }


    //Variation
    if(!noVariation){
        var variationDiv = createDiv("variation", bodyDiv);
        var ul = createUl([],variationDiv);
    }

    return ul;
}


//Creating certain Elements
function createLiItem(parent){
    var li = document.createElement("LI");

    return parent.appendChild(li);
}

function createH(element, parent){
    var t = document.createTextNode(element.name);
    var h = document.createElement("H"+(element.layer));
    h.appendChild(t);

    return parent.appendChild(h);
}

function createUl(classNames, parent){
    var ul = document.createElement("UL");
    for(let i = 0; i < classNames.length; i++){
        ul.classList.add(classNames[i]);
    }

    if(parent) return parent.appendChild(ul);
    return ul;
}

function createDiv(className, parent){
    var div = document.createElement("DIV");
    if(className)div.classList.add(className);

    return parent.appendChild(div);
}

function createSpan(className, parent){
    var span = document.createElement("SPAN");
    if(className)span.classList.add(className);

    return parent.appendChild(span);
}

function createSvg(className){
    var svg = document. createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    if(className) svg.classList.add(className);

    var pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d","M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z");

    var pathEl2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl2.setAttribute("d","M0 0h24v24H0V0z");
    pathEl2.setAttribute("fill","none");

    svg.appendChild(pathEl);
    svg.appendChild(pathEl2);

    return svg;
}

function createMark(className, parent){
    var mark = document.createElement("MARK");
    if(className)mark.classList.add(className);

    return parent.appendChild(mark);
}

function createA(className, parent, href, displayText){
    var aEl = document.createElement("A");
    if(className)aEl.classList.add(className);
    if(href)aEl.href = href;
    if(displayText)aEl.appendChild(document.createTextNode(displayText));

    return parent.appendChild(aEl);
}

function createP(className, parent, text){
    var pEl = document.createElement("P");
    if(className)pEl.classList.add(className);
    if(text)pEl.appendChild(document.createTextNode(text));

    return parent.appendChild(pEl);
}



//Change Category and load further Data
function loadFurtherData(category){
    maxElementNum += dataLoadInterval;
    createElements(category);
}

function changeToCategory(oldCategory){
    if(oldCategory != activeCategory){
        removeOldCategory(oldCategory);
        createElements(activeCategory);
        showNewCategory(activeCategory);
        scrollTo(0,0);
        setCookie("category",activeCategory,365);
    }
}

function hideOtherCategory(category){
    if(category != activeCategory){
        var catElement = document.querySelector("#content>.layer0>.cat" + category);
        catElement.classList.add("hidden");
    }
}

function removeOldCategory(oldCategory){
    var catElements = document.querySelectorAll("#content>.layer0>li");
    for (li of catElements){
        li.remove();
    }
}

function showNewCategory(newCategory){
    //var catContentElement = document.querySelector("#content>.layer0>.cat" + newCategory);
    //catContentElement.classList.remove("hidden");

    var catElement = document.querySelector("#category>ul>li:nth-child(" + (newCategory + 1) + ")");
    catElement.classList.remove("hidden");
}

function setCategoryAsActive(categoryLiElement){
    var categoryLis = document.querySelectorAll("#category>ul>li");

    var counter = 0;
    for(li of categoryLis){
        if(li != categoryLiElement){
            li.classList.remove("active");
        } else {
            activeCategory = counter;
        }
        counter++;
    }
    categoryLiElement.classList.add("active");
}

function changeToCategoryByItem(categoryItem){
    var oldCategory = activeCategory;
    maxElementNum = dataLoadInterval;
    loadedAllElements = false;

    setCategoryAsActive(categoryItem);
    changeToCategory(oldCategory);
}

function checkCookieForCategory(){
    var category = getCookie("category");
    if (category != "") {
        var liItem = document.querySelector(`#category li:nth-child(${parseInt(category) + 1})`);
        if(liItem){
            changeToCategoryByItem(liItem);
            liItem.scrollIntoView();
        }
    } else {
        //no cookie set
    }
}