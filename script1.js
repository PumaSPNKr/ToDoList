//Refactoring tasks part in addEventhandlers
//export {}; //Stops TS error `duplicate function implementation` due to JS file being open as well
var UserList = /** @class */ (function () {
    function UserList(listName, tasks, doneTasks) {
        this.listName = listName;
        this.tasks = tasks;
        this.doneTasks = doneTasks;
        this.selected = false;
    }
    return UserList;
}());
function init(userLists) {
    updateLists(userLists); //immediately display userLists
    updateTasks(userLists);
    //Rest of init is for animated header
    runAnimatedText();
}
function createNewList(userLists) {
    var newListName = document.getElementById("list-form").value;
    if (checkInput(newListName, "List")) {
        var newList = new UserList(newListName, [], []);
        userLists.push(newList);
    }
}
function deleteList(userLists) {
    if (getSelectedList(userLists, true) >= 0) {
        if (confirm("You are about to delete the selected list. Are you sure?")) {
            userLists.splice(getSelectedList(userLists, true), 1);
            return true;
        }
    }
    return false;
}
function updateLists(userLists) {
    var currentDisplayedLists = document.getElementById("list-list");
    while (currentDisplayedLists.firstChild) { //Remove all displayed lists first
        currentDisplayedLists.removeChild(currentDisplayedLists.firstChild);
    }
    for (var i = 0; i < userLists.length; i++) { //update with current user lists
        var li = document.createElement("li");
        li.innerHTML = userLists[i]["listName"];
        currentDisplayedLists.appendChild(li);
    }
    var currentList = getSelectedList(userLists, false);
    if (currentList >= 0) { //Keep css style of selected list through update
        currentDisplayedLists.children[currentList].classList.add("bold", "selected-list");
    }
    addEventHandlers(userLists, currentDisplayedLists, "list");
}
function createNewTask(userLists) {
    var newTask = document.getElementById("task-form").value;
    if (checkInput(newTask, "Task")) {
        var currentList = userLists[getSelectedList(userLists, true)];
        currentList["tasks"].push(newTask);
        currentList["doneTasks"].push(false);
        clearSelection();
    }
}
function deleteTasks(userLists) {
    var currentList = userLists[getSelectedList(userLists, true)];
    if (currentList) {
        for (var i = currentList["tasks"].length - 1; i >= 0; i--) {
            if (currentList["doneTasks"][i]) {
                currentList["tasks"].splice(i, 1);
                currentList["doneTasks"].splice(i, 1);
                currentList["doneTasks"][i] = false;
            }
        }
    }
}
function updateTasks(userLists) {
    var currentDisplayedTasks = document.getElementById("task-list");
    while (currentDisplayedTasks.firstChild) { //remove all displayed tasks first
        currentDisplayedTasks.removeChild(currentDisplayedTasks.firstChild);
    }
    var currentList = userLists[getSelectedList(userLists, false)];
    if (currentList) { //If a list is selected
        for (var i = 0; i < currentList["tasks"].length; i++) { //update page with current tasks list
            var li = document.createElement("li");
            li.innerHTML = currentList["tasks"][i];
            currentDisplayedTasks.appendChild(li);
            if (currentList["doneTasks"[i]]) { //Add style if task is already marked done
                currentDisplayedTasks.children[i].classList.add("bold", "selected-task");
            }
        }
    }
    addEventHandlers(userLists, currentDisplayedTasks, "task");
}
function addEventHandlers(userLists, htmlElements, type) {
    if (type === "list") {
        var _loop_1 = function (i) {
            htmlElements.children[i].addEventListener("click", function (event) {
                for (var j = 0; j < htmlElements.childElementCount; j++) {
                    htmlElements.children[j].classList.remove("bold", "selected-list");
                    userLists[j]["selected"] = false;
                }
                htmlElements.children[i].classList.add("bold", "selected-type");
                userLists[i]["selected"] = true;
                save(userLists); //Save list selected for next page reload
                updateTasks(userLists);
            });
        };
        for (var i = 0; i < userLists.length; i++) {
            _loop_1(i);
        }
    }
    else if (type === "task") {
        var currentList_1 = userLists[getSelectedList(userLists, false)];
        var _loop_2 = function (i) {
            if (currentList_1["doneTasks"][i]) { //mark already `done` tasks on page
                htmlElements.children[i].classList.add("bold", "selected-task");
            }
            htmlElements.children[i].addEventListener("click", function (event) {
                if (currentList_1["doneTasks"][i]) { //if clicked task is already `done`
                    htmlElements.children[i].classList.remove("bold", "selected-task");
                    currentList_1["doneTasks"].splice(i, 1, false); //remove selectors
                }
                else { //else add selectors
                    console.log("currentList['doneTasks'[i]]: " + currentList_1["doneTasks"[i]]);
                    htmlElements.children[i].classList.add("bold", "selected-task");
                    currentList_1["doneTasks"].splice(i, 1, true);
                }
                save(userLists); //Save `done` tasks when they are clicked
            });
        };
        for (var i = 0; i < htmlElements.childElementCount; i++) {
            _loop_2(i);
        }
    }
}
function getSelectedList(userLists, provideError) {
    //returns integer index of the selected list, provideError determines if an error alert 
    //should occur when called
    for (var i = 0; i < userLists.length; i++) {
        if (userLists[i]["selected"]) {
            return i;
        }
    }
    if (provideError) {
        alert("No List Selected!");
    }
    return NaN;
}
function checkInput(input, type) {
    if (input === "") {
        alert("No " + type + " name entered!");
        return false;
    }
    else if (input[0] === " ") {
        input = "";
        alert(type + " name cannot begin with a space!");
        return false;
    }
    return true;
}
function clearSelection() {
    document.getElementById("list-form").value = "";
    document.getElementById("task-form").value = "";
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
}
function save(userLists) {
    console.log("save called!");
    var LOCAL_STORAGE_KEY = 'myTodoList.lists';
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userLists));
}
function runAnimatedText() {
    var words = document.getElementsByClassName('word');
    var wordArray = [];
    var currentWord = 0;
    words[currentWord]["style"].opacity = 1;
    for (var i = 0; i < words.length; i++) {
        splitLetters(words[i]);
    }
    function changeWord() {
        var cw = wordArray[currentWord];
        var nw = currentWord == words.length - 1 ? wordArray[0] : wordArray[currentWord + 1];
        for (var i = 0; i < cw.length; i++) {
            animateLetterOut(cw, i);
        }
        for (var i = 0; i < nw.length; i++) {
            nw[i].className = 'letter behind';
            nw[0].parentElement.style.opacity = 1;
            animateLetterIn(nw, i);
        }
        currentWord = (currentWord == wordArray.length - 1) ? 0 : currentWord + 1;
    }
    function animateLetterOut(cw, i) {
        setTimeout(function () {
            cw[i].className = 'letter out';
        }, i * 80);
    }
    function animateLetterIn(nw, i) {
        setTimeout(function () {
            nw[i].className = 'letter in';
        }, 340 + (i * 80));
    }
    function splitLetters(word) {
        var content = word.innerHTML;
        word.innerHTML = '';
        var letters = [];
        for (var i = 0; i < content.length; i++) {
            var letter = document.createElement('span');
            letter.className = 'letter';
            letter.innerHTML = content.charAt(i);
            word.appendChild(letter);
            letters.push(letter);
        }
        wordArray.push(letters);
    }
    changeWord();
    setInterval(changeWord, 6000);
}
window.onload = function () {
    var LOCAL_STORAGE_KEY = "myTodoList.lists";
    var userLists = (JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []);
    init(userLists);
    console.log(userLists);
    var listSubmitButton = document.getElementById("list-submit-button");
    listSubmitButton.addEventListener("click", function () {
        createNewList(userLists);
        updateLists(userLists);
        updateTasks(userLists);
        save(userLists);
        clearSelection();
    });
    var deleteListButton = document.getElementById("delete-list-button");
    deleteListButton.addEventListener("click", function () {
        deleteList(userLists);
        updateLists(userLists);
        updateTasks(userLists);
        save(userLists);
    });
    var taskSubmitButton = document.getElementById("task-submit-button");
    taskSubmitButton.addEventListener("click", function () {
        createNewTask(userLists);
        updateTasks(userLists);
        save(userLists);
    });
    var deleteTasksButton = document.getElementById("delete-task-button");
    deleteTasksButton.addEventListener("click", function () {
        deleteTasks(userLists);
        updateTasks(userLists);
        save(userLists);
    });
};
