"use strict";
import "../src/scss/styles.scss";

const asideListsContainer = document.querySelector("[data-aside-lists]");
const asideNewListForm = document.querySelector("[data-aside-new-list-form]");
const asideNewListFormInput = document.querySelector("[data-aside-new-list-input]");
const asideNewListFormImg = asideNewListForm.querySelector("img");
const asideDeleteListButton = document.querySelector("[data-aside-delete-list]");
const asidePermanentListsWrapper = document.querySelector("[data-aside-permanent-lists]");
const asideCustomListsWrapper = document.querySelector("[data-aside-custom-lists]");
const mainTasksDisplayContainer = document.querySelector("[data-main-tasks-container]");
const mainListTitle = document.querySelector("[data-main-list-title]");
const mainListCounter = document.querySelector("[data-main-list-count]");
const mainNewTaskForm = document.querySelector("[data-main-new-task-form]");
const mainNewTaskInput = document.querySelector("[data-main-new-task-input]");
const mainNewTaskFormImg = document.querySelector("[data-main-task-img]");
const mainClearCompletedTasksButton = document.querySelector("[data-main-clear-tasks]");
const mainTasksWrapper = document.querySelector("[data-tasks-wrapper]");
const mainTaskHTMLTemplate = document.getElementById("task-template");
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "task.selectedListId";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);
const svgElementOne = document.querySelector("#svgElement-01");
const svgElementTwo = document.querySelector("#svgElement-02");
const svgElementThree = document.querySelector("#svgElement-03");

const inbox = {
    id: "10",
    name: "Inbox",
    tasks: [],
};

const today = {
    id: "20",
    name: "Today",
    tasks: [],
};
const upcoming = {
    id: "30",
    name: "Upcoming",
    tasks: [],
};

// 🔖 - We create new lists and populate the lists array
function createListsForm() {
    // 01 Phase
    const listName = asideNewListFormInput.value;
    if (listName == null || listName === "") return;
    const list = createList(listName);

    // 02 Phase
    asideNewListFormInput.value = null;
    lists.push(list);
    saveAndRender();
}

// Click: ENTER
asideNewListForm.addEventListener("submit", (e) => {
    e.preventDefault(e);
    createListsForm();
});

// Click: IMG BUTTON
asideNewListFormImg.addEventListener("click", function () {
    createListsForm();
});

// 🔖 - Whichever list we click, we set the value of the data-list-id to the selectedListId
function setValueOfDataListId(e) {
    const divElement = e.target.closest("div");
    if (divElement && !divElement.classList.contains("aside__permanents")) {
        selectedListId = divElement.dataset.listId;
        saveAndRender();
    }
}

asidePermanentListsWrapper.addEventListener("click", (e) => {
    setValueOfDataListId(e);
});

asideCustomListsWrapper.addEventListener("click", (e) => {
    setValueOfDataListId(e);
});

// 🔖 - Delete lists button
asideDeleteListButton.addEventListener("click", () => {
    if (selectedListId === "10" || selectedListId === "20" || selectedListId === "30") {
        console.log("Cannot delete permanent lists!");
        return;
    } else {
        lists = lists.filter((list) => list.id !== selectedListId);
        selectedListId = "10";
        saveAndRender();
    }
});

// 🔖 Toggle aside
const btnHamburger = document.querySelector(".hamburger");
const asideMenu = document.querySelector(".aside");
let toggleMe = true;

btnHamburger.addEventListener("click", () => {
    if (toggleMe) {
        asideMenu.classList.add("fade-out");
        asideMenu.classList.remove("fade-in");
        // asideMenu.style.transform = "translateX(-300px)";
        // asideMenu.style.display = "none";
    } else {
        asideMenu.classList.add("fade-in");
        asideMenu.classList.remove("fade-out");
        // asideMenu.style.transform = "translateX(0)";
        // asideMenu.style.display = "";
    }
    toggleMe = !toggleMe;
});

function addNewTask() {
    const taskName = mainNewTaskInput.value;
    if (taskName == null || taskName === "") return;

    const task = createTask(taskName);
    mainNewTaskInput.value = null;

    const selectedList = lists.find((item) => item.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
}

// 🔖 - We create tasks and put them inside the corresponding selectedList tasks array
// Click - ENTER
mainNewTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewTask();
});

// Click - IMG
mainNewTaskFormImg.addEventListener("click", function () {
    addNewTask();
});

// 🔖 - Check and uncheck state of the tasks inside the main container without this the clear completed tasks button will not work
mainTasksWrapper.addEventListener("click", (e) => {
    // console.log(e.target);

    if (e.target.tagName.toLowerCase() === "input") {
        const selectedList = lists.find((item) => item.id === selectedListId);
        // Return: {id: '10', name: 'Inbox', tasks: Array(0)}

        const selectedTask = selectedList.tasks.find((item) => item.id === e.target.id);
        // Return: {id: '1696599101686', name: 'Buy tomatoes', complete: false}

        selectedTask.complete = e.target.checked;
        // We toggle the true and false state of the complete key inside that task (object)

        save();
        renderTaskCount(selectedList);
    }
});

// 🔖 - Clear completed tasks
mainClearCompletedTasksButton.addEventListener("click", () => {
    const selectedList = lists.find((list) => list.id === selectedListId);
    // Return: {id: '10', name: 'Inbox', tasks: Array(0)}

    selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
    // Explain: We are filtering the tasks array and returning only the tasks that are not complete (false)
    saveAndRender();
});

// 🔖
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// 🔖
function createList(name) {
    return {
        id: Date.now().toString(),
        name: name,
        tasks: [],
    };
}

/**
 * This function take a string name and returns an object with an id, name, and complete keys.
 *
 * @param {string} name - Here you put the name of the task you want to finish, for example: "Don't forget to buy milk!"
 * @returns {Object}
 */

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false };
}

function pushPermanentLists() {
    lists.push(inbox);
    lists.push(today);
    lists.push(upcoming);
}

function renderLists() {
    lists.forEach((list) => {
        // 01 - Creating elements
        const divElement = document.createElement("div"); // 01
        const imgElement = document.createElement("img"); // 02
        const inputElement = document.createElement("input"); // 03
        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("readonly", "true");
        const spanElement = document.createElement("span"); // 04
        const tasksCounter = list.tasks.filter((item) => !item.complete).length;

        // 02 - Adding attributes
        imgElement.setAttribute("src", "todothis/svg/list.svg");
        divElement.dataset.listId = list.id;
        divElement.classList.add("listz");
        inputElement.value = list.name;
        spanElement.innerHTML = tasksCounter;

        // 03 - Appending elements to the main divElement
        divElement.appendChild(imgElement);
        divElement.appendChild(inputElement);
        divElement.appendChild(spanElement);

        // 04 - Append custom img elements to permanent lists and divElements into the aside menu
        if (list.id === "10" || list.id === "20" || list.id === "30") {
            if (list.id === "10") {
                imgElement.setAttribute("src", "todothis/svg/inbox.svg");
            } else if (list.id === "20") {
                imgElement.setAttribute("src", "todothis/svg/calendar.svg");
            } else if (list.id === "30") {
                imgElement.setAttribute("src", "todothis/svg/upcoming.svg");
            }
            asidePermanentListsWrapper.appendChild(divElement);
        } else {
            asideCustomListsWrapper.appendChild(divElement);
        }

        // Bonus
        if (list.id === selectedListId) {
            divElement.classList.add("active-list");
        }
    });
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach((task) => {
        const taskDiv = document.createElement("div");
        const checkboxInput = document.createElement("input");
        const label = document.createElement("label");
        // const span = document.createElement("span");
        const inputText = document.createElement("input");
        const editButton = document.createElement("img");
        const saveButton = document.createElement("img");

        taskDiv.classList.add("task");
        checkboxInput.classList.add("task__checkbox");
        checkboxInput.setAttribute("type", "checkbox");
        // span.classList.add("task__custom-checkbox");
        inputText.classList.add("task__input");
        inputText.setAttribute("type", "text");
        inputText.setAttribute("readonly", true);
        editButton.classList.add("edit-button");
        editButton.setAttribute("src", "svg/edit.svg");
        editButton.setAttribute("alt", "Edit button for tasks");
        saveButton.classList.add("save-button");
        saveButton.setAttribute("src", "svg/save.svg");
        saveButton.setAttribute("alt", "Save button for tasks");

        taskDiv.appendChild(checkboxInput);
        taskDiv.appendChild(label);
        taskDiv.appendChild(inputText);
        taskDiv.appendChild(editButton);
        taskDiv.appendChild(saveButton);

        checkboxInput.id = task.id;
        checkboxInput.checked = task.complete;
        label.htmlFor = task.id;
        label.innerHTML = task.name;
        inputText.style.display = "none";
        editButton.id = task.id;
        editButton.dataset.id = task.id;
        saveButton.id = task.id;
        saveButton.dataset.id = task.id;

        // 🔖 Edit feature
        function handleEdit() {
            const taskValue = label.innerHTML;
            label.style.display = "none";
            inputText.style.display = "block";
            inputText.value = taskValue;
            inputText.removeAttribute("readonly");
            inputText.focus();

            saveButton.style.display = "block";
            editButton.style.display = "none";
            saveButton.style.opacity = "1";
        }
        editButton.addEventListener("click", handleEdit);

        // 🔖 Save feature
        function handleSave() {
            const currentTask = selectedList.tasks.find((item) => item.id === editButton.id);

            const inputValue = inputText.value;
            label.innerHTML = inputValue;
            currentTask.name = inputValue;
            label.style.display = "block";
            inputText.style.display = "none";
            inputText.setAttribute("readonly", "true");

            saveButton.style.display = "none";
            editButton.style.display = "block";
            saveAndRender();
        }

        saveButton.addEventListener("click", handleSave);

        // Save on "Enter"
        inputText.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                handleSave();
            }
        });

        mainTasksWrapper.appendChild(taskDiv);
    });
}

function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter((item) => !item.complete).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    mainListCounter.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderGraphics() {
    const selectedList = lists.find((list) => list.id === selectedListId);
    // console.log(selectedList);
    if (selectedList.id === "10" && selectedList.tasks.length === 0) {
        svgElementOne.style.display = "block";
        // svgElementOne.style.opacity = "1";
        // svgElementOne.style.transform = "scaleY(1)";
    } else {
        svgElementOne.style.display = "none";
        // svgElementOne.style.opacity = "0";
    }

    if (selectedList.id === "20" && selectedList.tasks.length === 0) {
        svgElementTwo.style.display = "block";
    } else {
        svgElementTwo.style.display = "none";
    }

    if (selectedList.id === "30" && selectedList.tasks.length === 0) {
        svgElementThree.style.display = "block";
    } else {
        svgElementThree.style.display = "none";
    }
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    // setItem('tasks.lists', [{id: '10', name: 'Inbox', tasks: [] }])

    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedListId);
    // setItem('tasks.selectedListId', 2138917848932)
}

function render() {
    /* First load of the application */
    if (lists.length === 0) {
        console.log("Initial Loading of the Application");

        // 01 Phase
        selectedListId = "10";
        clearElement(asidePermanentListsWrapper);
        // clearElement(asideCustomListsContainer);
        pushPermanentLists();
        save();

        // 02 Phase
        const selectedSheesh = lists.find((item) => (item.id = selectedListId));
        // Return: {id: '10', name: 'Inbox', tasks: Array(0)}
        mainListTitle.innerText = selectedSheesh.name;
        renderLists();
        renderGraphics();
        renderTaskCount(selectedSheesh);
    } else if (lists.length !== 0) {
        /* Normal reloading of the application */
        console.log("Content Reloaded");

        // 01 Phase
        const selectedList = lists.find((item) => item.id === selectedListId);

        clearElement(asidePermanentListsWrapper);
        clearElement(asideCustomListsWrapper);

        // 02 Phase
        mainListTitle.innerText = selectedList.name;
        renderLists();
        renderGraphics();

        // Main function of our application is to clear and re-render the lists and tasks, thats why I was getting an error (duplicatino) when I was trying to render the tasks without clearing them first.
        clearElement(mainTasksWrapper);
        renderTasks(selectedList);
        renderTaskCount(selectedList);
    }
}

function saveAndRender() {
    save();
    render();
}

// 🚀 RUNNING THE APPLICATION 🚀 //
render();

//////////////////////////////////////////////////
// 🚨-----🚨 Archived
// const selectedList = lists.find((item) => item.id === selectedListId);

// mainTasksWrapper.addEventListener("click", (e) => {
//   const currentTasks = selectedList.tasks;
//   console.log(currentTasks);
//   [{…}, {…}, {…}]

//   const task = currentTasks.find((item) => item.id === e.target.id);
//   console.log(task);
//   // {id: '1697025925780', name: 'Kikirikuuu', complete: false}

//   // console.log(currentTasks);
//   // console.log(e.target.id);

//   if (e.target.id === task.id) {
//     console.log("TARGETTEEDD");
//   }

//   // console.log(task);

//   // if (e.target.classList.contains("edit-button")) {
//   //   console.log("Edit Button Clicked!");
//   //   // const currentImage = selectedList.tasks.find(
//   //   //   (item) => item.id === editTaskButton.id
//   //   // );
//   //   // currentImage.addEventListener("click", () => {
//   //   //   console.log("Edit Clicked!");
//   //   // });
//   // }
//   // if (e.target.classList.contains("save-button")) {
//   //   console.log("Save Button Clicked!");
//   // }
// });

// const editTASK = document.querySelector(".edit-button");

// TODO Wanting to remove the edit and save feature from inside the function
// if the lists.find matches with === editButton.id, select it
// const selectedLeest = lists.find((item) => item.id === selectedListId);
// console.log(selectedLeest);

// mainTasksWrapper.addEventListener("click", (e) => {
//   if (e.target.classList.contains("edit-button")) {
//     console.log("EDIT BUTTON");
//     const imgEdit = e.target;
//   } else {
//     console.log("SAVE BUTTON");
//     const imgSave = e.target;
//   }
// });

// INSIDE RENDER LISTS
// const asideListInput = document.createElement("input");
// const asideListElement = document.createElement("li");
// const editButton = document.createElement("img");
// const saveButton = document.createElement("img");
// const imgElement = document.createElement("img");

//
// asideListInput.setAttribute("readonly", true);
// asideListInput.value = list.name;
// asideListInput.dataset.listId = list.id;
// asideListInput.classList.add("aside__input");
// //
// editButton.classList.add("edit-button");
// editButton.id = list.id;
// editButton.setAttribute("src", "/svg/edit.svg");
// editButton.setAttribute("alt", "Edit button for tasks");
// //
// saveButton.classList.add("save-button");
// saveButton.id = list.id;
// saveButton.setAttribute("src", "/svg/save.svg");
// saveButton.setAttribute("alt", "Save button for tasks");

// 🟢 Edit feature
// function handleEdit() {
//   saveButton.style.display = "block";
//   editButton.style.display = "none";

//   asideListInput.removeAttribute("readonly");
//   asideListInput.focus();
// }

// editButton.addEventListener("click", handleEdit);

// 🟢 Save feature
// function handleSave() {
//   const currentList = lists.find((item) => item.id === editButton.id);
//   currentList.name = asideListInput.value;
//   saveButton.style.display = "none";
//   editButton.style.display = "block";
//   saveAndRender();
// }

// saveButton.addEventListener("click", handleSave);

// if (list.id === "10") {
//   imgElement.setAttribute("src", "/svg/inbox.svg");
//   asideListInput.appendChild(imgElement);
// }

// asideListsContainer.appendChild(asideListInput);

// if (list.id === "10" || list.id === "20" || list.id === "30") {
// } else {
//   asideListsContainer.appendChild(asideListInput);
//   // asideListDiv.appendChild(editButton);
//   // asideListDiv.appendChild(saveButton);
// }
