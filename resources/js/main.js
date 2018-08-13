// On Page Load
document.addEventListener("DOMContentLoaded", function() {
    letsGetReadyToRumble();
});

// check for todoList in localStorage if true to JSON otherwise empty object.
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
 todo: [],
 done: []
};

function fillFromStorage () {

    // if !
    if(!data.todo.length && !data.done.length) return;

    for (var i = 0; i < data.todo.length; i++) {
        var value = data.todo[i];
        addItem(value);
    }

    for (var i = 0; i < data.done.length; i++) {
        var value = data.done[i];
        addItem(value, true);
    }

}

// Preparing 
function letsGetReadyToRumble() {
    document.getElementById('add').addEventListener('click', buttonClick);
    document.getElementById('clear').addEventListener('click', clearList);
    document.getElementById('export').addEventListener('click', exportList);
    document.getElementById('import').addEventListener('click', importList);
    document.getElementById('item').addEventListener('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById('add').click();
        }
    });
    fillFromStorage();
    setFocusToTextBox();

};

function exportList() {
    var currentDate = new Date();
    var timeStamp = currentDate.getDate() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getFullYear();   
    var element = document.createElement('a');   

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
    element.setAttribute('download', 'ToDoList ' + timeStamp);
  
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

};


function readFromFile (event) {
    var file = event.target.files;
    var reader = new FileReader();
    console.log("readfromfile");

    
    reader.onload = function() {
        console.log("onload");
        console.log("2. " + this.result);
        
        var importedData = this.result;
        console.log("3. " + importedData);
        var pimportedData = { todo: [],
            done: []
        };

        pimportedData = JSON.parse(importedData);
        console.log(pimportedData.todo.length);
        console.log("4. " + pimportedData);
        for (var i = 0; i < pimportedData.todo.length; i++) {
            var value = pimportedData.todo[i];
            addItem(value);

            // Storage
            data.todo.push(value);
            dataObjectUpdated();
        }
        for (var i = 0; i < pimportedData.done.length; i++) {
            var value = pimportedData.done[i];
            addItem(value, true);

            // Storage
            data.done.push(value);
            dataObjectUpdated();
        }
        
    };
    
    reader.readAsText(file[0]);

};



function importList() {
    


    // Creates an invisible FileUpload-Input 
    var invisibleUpload = document.createElement('input');
    invisibleUpload.setAttribute('type', 'file');
    invisibleUpload.setAttribute('id', 'IMP');
    console.log("pre.addEventListener");
    invisibleUpload.addEventListener('change', readFromFile, false);
    console.log("post.addEventListener");
    invisibleUpload.style.display = 'none';
    console.log(invisibleUpload);
    console.log(invisibleUpload.attributes);
    document.body.appendChild(invisibleUpload);

    console.log("pre.Click");
    invisibleUpload.click();
    console.log("post.Click");
    document.body.removeChild(invisibleUpload);


    /*
    var files = evt.target.files;
    var reader = new FileReader();
    reader.onload = function() {
        console.log(this.result);
    }
    */


};

function clearList() {
    var theToDoList = document.getElementById('todo');
    var theCompletedList = document.getElementById('completed');
    
    /*
    for (;theToDoList.hasChildNodes;) {
        theToDoList.removeChild(theToDoList.firstChild);
        // localstorage
        data.todo.splice(data.todo.indexOf(0), 1);
    }
    */

    while (theToDoList.firstChild) {
        theToDoList.removeChild(theToDoList.firstChild);
         // localstorage
         data.todo.splice(data.todo.indexOf(0), 1);
    }

   while (theCompletedList.firstChild) {
       theCompletedList.removeChild(theCompletedList.firstChild);
        // localstorage
        data.done.splice(data.done.indexOf(0), 1);
    }
    dataObjectUpdated();
}

function dataObjectUpdated() {
    localStorage.setItem('todoList', JSON.stringify(data));
}

// Focus
function setFocusToTextBox(){
    document.getElementById('item').focus();
}


function buttonClick() {
    var value = document.getElementById('item').value;
    var maxCharacters = 750;
    // if value is not null
    if (value && value.length < maxCharacters) {

        // storage
        data.todo.push(value);
        dataObjectUpdated();
        
        addItem(value)
        
        // clears the Input-Field
        document.getElementById('item').value = "";
        
        setFocusToTextBox();

    }

    if (value.length > maxCharacters) {
    	alert("Fass dich kurz, Jan!");
    }
    setFocusToTextBox();
};

function removeItem() {
    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    parent.removeChild(item) 

    // storage
    var id = parent.id;
    var value = item.innerText;

    if (id === 'todo') {
        data.todo.splice(data.todo.indexOf(value), 1);
    } else {
        data.done.splice(data.done.indexOf(value), 1);
    }
    dataObjectUpdated();


}

function completeItem() {
    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;

    // storage
    if (id === 'todo') {
        data.todo.splice(data.todo.indexOf(value), 1);
        data.done.push(value);

    } else {
        data.done.splice(data.done.indexOf(value), 1);
        data.todo.push(value);
    }
    dataObjectUpdated();


    var target = (id === 'todo') ? document.getElementById('completed'):document.getElementById('todo');

    parent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);

}


function addItem(text, completed) {
    // var list = document.getElementById('todo');
    var list = (completed) ? document.getElementById('completed'):document.getElementById('todo');

    var item = document.createElement('li');
    item.innerText = text;

    var buttons = document.createElement('div');
    buttons.classList.add('buttons');

    var remove = document.createElement('button');
    remove.classList.add('remove');

    // Remove
    remove.addEventListener('click', removeItem);

    var complete = document.createElement('button');
    complete.classList.add('complete');

    // Complete
    complete.addEventListener('click', completeItem);

    buttons.appendChild(remove);
    buttons.appendChild(complete);
    item.appendChild(buttons);
    list.insertBefore(item, list.childNodes[0]);

    // old:
    //    list.appendChild(item);

}

