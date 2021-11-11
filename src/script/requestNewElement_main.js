counter = 0;

document.querySelector('input[name^="el_be_val"]').addEventListener("change",(e)=>{updateOther(e,"ke");});
document.querySelector('input[name^="el_ke_val"]').addEventListener("change",(e)=>{updateOther(e,"be");});

function updateOther(e,otherName){
    e.target.value.replace(",",".");
    var mult = otherName == "ke" ? 12 / 10 : 10 / 12;
    var ke_input = e.target.closest("table").querySelector(`input[name^="el_${otherName}_val"]`);
    if(ke_input.value == ""){
        try{
            ke_input.value = Math.round((parseInt(e.target.value) * mult)*100)/100;
        }catch(err){
            console.log(err.message);
        }
    }
}

document.getElementById("add_new_element_trigger").addEventListener("click",(e)=>{
    addNewElementContainer(e);
});

function addNewElementContainer(e){
    var addNewElementTrigger = e.target.closest("#add_new_element_trigger");
    var parent = document.getElementById("value_input_form");
    var newElement = document.createElement("DIV");
    newElement.classList.add("new_element");
    counter++;
    var newInputDiv = getHTMLCode();
    newElement.innerHTML = newInputDiv;
    parent.insertBefore(newElement, addNewElementTrigger);

    document.querySelector('input[name^="el_be_val_'+counter+'"]').addEventListener("change",(e)=>{updateOther(e,"ke");});
    document.querySelector('input[name^="el_ke_val_'+counter+'"]').addEventListener("change",(e)=>{updateOther(e,"be");});
    document.querySelector('input[name^="el_ke_val_'+counter+'"]').closest(".new_element").querySelector(".close").addEventListener("click",(e)=>{
        removeElement(e);
    });
}

function removeElement(e){
    var elementToRemove = e.target.closest(".new_element");
    updateFollowingChildsFromElement(elementToRemove);
    elementToRemove.remove();
    counter--;
}

function updateFollowingChildsFromElement(removedElement){
    var nextSibl = removedElement;
    while(nextSibl = nextSibl.nextSibling){
        if(nextSibl != null && nextSibl.classList.contains("new_element")){
            var nameAttr = nextSibl.querySelector('input[name^="el_name_"]').getAttribute("name");
            var counter = nameAttr.substring(nameAttr.indexOf("el_name_")+"el_name_".length);
            var inputs = nextSibl.querySelectorAll("input");
            for(input of inputs){
                var newName = input.getAttribute("name").replace("_" + counter,"_" + (parseInt(counter) - 1));
                input.setAttribute("name", newName);
            }
        } else {
            break;
        }
    }
}

function getHTMLCode(){
    return `
    <div class="close">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/>
        </svg>
    </div>
    <table>
    <tr>
        <td><label>Bezeichnung</label></td>
        <td><input name="el_name_${counter}" type="text" placeholder="Käsekuchen"required="required" ></td>
    </tr>
    <tr>
        <td><label>BE-Wert</label></td>
        <td><input name="el_be_val_${counter}" type="number" placeholder="3.5" step="0.01" class="ending" required="required"><label>BE</label></td>
    </tr>
    <tr>
        <td><label>KE-Wert</label></td>
        <td><input name="el_ke_val_${counter}" type="number" placeholder="3.9" step="0.01" class="ending" required="required"><label>KE</label></td>
    </tr>
    <tr>
        <td><label>Referenz-Menge</label></td>
        <td><input name="el_ref_val_${counter}" type="number" placeholder="100" step="0.01"required="required" ></td>
    </tr>
    <tr>
        <td><label>Referenz-Einheit</label></td>
        <td>
            <select name="el_ref_unit_${counter}" name="" id="" required="required" >
                <option value="g">g</option>
                <option value="ml">ml</option>
            </select>
        </td>
    </tr>
    <tr>
        <td><label>Referenz-Bezeichnung</label></td>
        <td><input name="el_ref_title_${counter}" type="text" placeholder="Ein Stück"></td>
    </tr>
</table>`;
}