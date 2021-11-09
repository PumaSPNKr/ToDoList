//Refactoring tasks part in addEventhandlers
//export {}; //Stops TS error `duplicate function implementation` due to JS file being open as well

class UserList{
	
	listName: string;
	tasks: string[];
	doneTasks: boolean[];
	selected: boolean;

	constructor(listName, tasks, doneTasks){
		this.listName = listName;
		this.tasks = tasks;
		this.doneTasks = doneTasks;
		this.selected = false;
	}
}

function init(userLists: object[]){
	updateLists(userLists);						//immediately display userLists
	updateTasks(userLists);
}

function createNewList(userLists: object[]){
	const newListName = (<HTMLInputElement>document.getElementById(`list-form`)).value;
	if (checkInput(newListName, `List`)){
		const newList = new UserList(newListName, [], []);
		userLists.push(newList);
	}
}

function deleteList(userLists: object[]){
	if (getSelectedList(userLists, true) >= 0){
		if (confirm(`You are about to delete the selected list. Are you sure?`)) {
			userLists.splice(getSelectedList(userLists, true), 1);
			return true;
		}
	}
	return false;
}

function updateLists(userLists: object[]){
	const currentDisplayedLists = document.getElementById(`list-list`);
	while (currentDisplayedLists.firstChild){				//Remove all displayed lists first
		currentDisplayedLists.removeChild(currentDisplayedLists.firstChild);
	}
	
	for (let i = 0; i < userLists.length; i++){				//update with current user lists
		const li = document.createElement(`li`);
		li.innerHTML = userLists[i][`listName`];
		currentDisplayedLists.appendChild(li);	
	}

	const currentList = getSelectedList(userLists, false);
	if (currentList >= 0){									//Keep css style of selected list through update
		currentDisplayedLists.children[currentList].classList.add(`bold`, `selected-list`);
	}
	addEventHandlers(userLists, currentDisplayedLists, `list`);
}

function createNewTask(userLists: object[]){
	let newTask = (<HTMLInputElement>document.getElementById(`task-form`)).value;
		if (checkInput(newTask, `Task`)){
			const currentList = userLists[getSelectedList(userLists, true)];
			currentList[`tasks`].push(newTask);
			currentList[`doneTasks`].push(false);
			clearSelection();
		}
}

function deleteTasks(userLists: object[]){
	const currentList = userLists[getSelectedList(userLists, true)];
	if (currentList){
		for (let i = currentList[`tasks`].length - 1; i >= 0; i--){
			if (currentList[`doneTasks`][i]){
				currentList[`tasks`].splice(i, 1);
				currentList[`doneTasks`].splice(i, 1);
				currentList[`doneTasks`][i] = false;
			}
		}
	}
}

function updateTasks(userLists: object[]){
	const currentDisplayedTasks = document.getElementById(`task-list`);
	while (currentDisplayedTasks.firstChild){				//remove all displayed tasks first
		currentDisplayedTasks.removeChild(currentDisplayedTasks.firstChild);
	}

	const currentList = userLists[getSelectedList(userLists, false)];
	if (currentList){ 											//If a list is selected
		for (let i = 0; i < currentList[`tasks`].length; i++){	//update with current tasks in userlist
			const li = document.createElement(`li`);
			li.innerHTML = currentList[`tasks`][i];
			currentDisplayedTasks.appendChild(li);	

			if (currentList[`doneTasks`[i]]){					//Add style if task is already marked done
				currentDisplayedTasks.children[i].classList.add(`bold`, `selected-task`);	
			}
		}
	}
	addEventHandlers(userLists, currentDisplayedTasks, `task`);
}

function addEventHandlers(userLists: object[], htmlElements: HTMLElement, type: string){
	if (type === `list`){
		for (let i = 0; i < userLists.length; i++){
			htmlElements.children[i].addEventListener(`click`, (event) => {	//adds styles/selectors to list elements
				for (let j = 0; j < htmlElements.childElementCount; j++){	
					htmlElements.children[j].classList.remove(`bold`, `selected-list`);
					userLists[j][`selected`] = false;
				}
				htmlElements.children[i].classList.add(`bold`, `selected-type`);
				userLists[i][`selected`] = true;
				save(userLists);											//Save list is selected for next page reload
				updateTasks(userLists);
			});
		}
	} else if (type === `task`){
		const currentList = userLists[getSelectedList(userLists, false)];
		for (let i = 0; i < htmlElements.childElementCount; i++){
			if (currentList[`doneTasks`][i]){		//mark already `done` tasks
				htmlElements.children[i].classList.add(`bold`, `selected-task`);
			}
			htmlElements.children[i].addEventListener(`click`, (event) => {	 //add selectors to task elements
				if (currentList[`doneTasks`][i]){		 			//if selected task is already `done`
					htmlElements.children[i].classList.remove(`bold`, `selected-task`);
					currentList[`doneTasks`].splice(i, 1, false);	//remove selectors
				} else {											//else add selectors
					console.log(`currentList['doneTasks'[i]]: ${currentList[`doneTasks`[i]]}`);
					htmlElements.children[i].classList.add(`bold`, `selected-task`);
					currentList[`doneTasks`].splice(i, 1, true);
				}
				save(userLists);									//Save `done` tasks when they are clicked
			});	
		}
		
	}
}

function getSelectedList(userLists: object[], provideError: boolean){		
	//returns integer index of the selected list, provideError determines if an error alert 
	//should occur when called
	for (let i = 0; i < userLists.length; i++){
		if (userLists[i][`selected`]){
			return i;
		}
	}
	if (provideError) {alert(`No List Selected!`);}
	return NaN;
}



function checkInput(input: string, type: string){
	if (input === ""){
		alert(`No ${type} name entered!`);
		return false;
	}
	else if (input[0] === " "){
		input = "";
		alert(`${type} name cannot begin with a space!`);
		return false;
	}
	return true;
}

function clearSelection(){									//clears HTML focus and form text
	(<HTMLInputElement>document.getElementById(`list-form`)).value = "";
	(<HTMLInputElement>document.getElementById(`task-form`)).value = "";
	
	if (document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
 	}
}

function save(userLists){						//Save called at addEventHandlers() to ensure often saves
	console.log(`save called!`);
	const LOCAL_STORAGE_KEY = 'myTodoList.lists';
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userLists));
}

window.onload = function(){
	const LOCAL_STORAGE_KEY =	`myTodoList.lists`;
	let userLists: object[] = (JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []);
	
	init(userLists);
	console.log(userLists);
	const listSubmitButton = document.getElementById(`list-submit-button`);
		listSubmitButton.addEventListener(`click`, () => {
		createNewList(userLists);
		updateLists(userLists);
		updateTasks(userLists);
		save(userLists);
		clearSelection();
	});

	const deleteListButton = document.getElementById(`delete-list-button`);
	deleteListButton.addEventListener(`click`, () => {
			deleteList(userLists);
			updateLists(userLists);
			updateTasks(userLists);
			save(userLists);
	});

	const taskSubmitButton = document.getElementById(`task-submit-button`);
	taskSubmitButton.addEventListener(`click`, () => {
		createNewTask(userLists);
		updateTasks(userLists);
		save(userLists);
	});

	const deleteTasksButton = document.getElementById(`delete-task-button`);
	deleteTasksButton.addEventListener(`click`, () => {
		deleteTasks(userLists);
		updateTasks(userLists);
		save(userLists);
	});
}