//For Search
var JSONData;

loadData();

//copied from: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadData() {
    loadJSON(function(response) {
        // Parse JSON string into object
        JSONData = JSON.parse(response);
        console.log("Data is loaded!");
        createElements();
        console.log("Elements created");
        elementArrow();
        console.log("eventListener Ready");
        document.getElementById("loading").classList.add("hidden");
    });
}

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', './data/data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}

function createElements(){
    var lastParents = new Array(4);
    var ulLayer1 = createUl("layer1",null);
    lastParents[1] = ulLayer1;

    createChildren(JSONData.subElements, lastParents);

    document.getElementById("content").appendChild(ulLayer1);
}

function createChildren(dataArray, lastParents){
    if(dataArray){
        dataArray.forEach(element => {
            createItself(element, lastParents);
            createChildren(element.subElements, lastParents);
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

    createLayerNElement(element, lastParents);
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
    //Skip
}

function createLayer1Element(element, lastParents){
    var ul = createSubtitle(element, lastParents[element.layer]);
    lastParents[element.layer + 1] = ul;
}

function createLayer2Element(element, lastParents){
    var ul = createSubtitle(element, lastParents[element.layer]);
    lastParents[element.layer + 1] = ul;
}

function createLayer3Element(element, lastParents){
    var ul = createFoodElement(element, lastParents[element.layer]);
    lastParents[element.layer + 1] = ul;
}

function createLayer4Element(element, lastParents){
    createFoodElement(element, lastParents[element.layer], true);
}

//Creating a Subtitle
function createSubtitle(element, parent){
    var li = createLiItem(parent);
    createH(element, li);

    var classNames = [];
    classNames.push("layer"+(element.layer + 1));
    if(element.layer == 2) classNames.push("elements");

    return createUl(classNames, li);
}

function createFoodElement(element, parent, noVariation){
    var li = createLiItem(parent);
    var elementDiv = createDiv("element",li);
    
    createHeader(element, elementDiv);
    return createBody(element, elementDiv, noVariation);
}


//Create Element
function createHeader(element, parent){
    var headerDiv = createDiv("header",parent);

    //Element Name
    var elName = document.createTextNode(element.name);
    var elNameDiv = createDiv("el_name",headerDiv);
    elNameDiv.appendChild(elName);

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
    var entsprichtText = document.createTextNode("entspricht ");
    unitDiv.appendChild(entsprichtText);

    var entspricht = createSpan("entsprEinh", unitDiv);
    var entsprichtText = document.createTextNode(element.entsprichtEinheit);
    entspricht.appendChild(entsprichtText);
    
    var entsprichtEinheit = createSpan("einheitsGr", unitDiv);
    var entsprichtEinheitText = document.createTextNode(element.einheitsGroesse);
    entsprichtEinheit.appendChild(entsprichtEinheitText);

    unitDiv.appendChild(entspricht);
    unitDiv.appendChild(entsprichtEinheit);

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
    div.classList.add(className);

    return parent.appendChild(div);
}

function createSpan(className, parent){
    var span = document.createElement("SPAN");
    span.classList.add(className);

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