"use strict";

// Local Storage Keys
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "task.selectedListId";

// DOM Elements
const elements = {
    asideListsContainer: document.querySelector("[data-aside-lists]"),
    asideNewListForm: document.querySelector("[data-aside-new-list-form]"),
    asideNewListFormInput: document.querySelector("[data-aside-new-list-input]"),
    asideNewListFormImg: document.querySelector("[data-aside-new-list-img]"),
    asideDeleteListButton: document.querySelector("[data-aside-delete-list]"),
    asidePermanentListsWrapper: document.querySelector("[data-aside-permanent-lists]"),
    asideCustomListsWrapper: document.querySelector("[data-aside-custom-lists]"),
    mainTasksDisplayContainer: document.querySelector("[data-main-tasks-container]"),
    mainListTitle: document.querySelector("[data-main-list-title]"),
    mainListCounter: document.querySelector("[data-main-list-count]"),
    mainNewTaskForm: document.querySelector("[data-main-new-task-form]"),
    mainNewTaskInput: document.querySelector("[data-main-new-task-input]"),
    mainNewTaskFormImg: document.querySelector("[data-main-new-task-img]"),
    mainClearCompletedTasksButton: document.querySelector("[data-main-clear-tasks]"),
    mainTasksWrapper: document.querySelector("[data-tasks-wrapper]"),
    mainTaskHTMLTemplate: document.getElementById("task-template"),
    svgElementOne: document.querySelector("#svgElement-01"),
    svgElementTwo: document.querySelector("#svgElement-02"),
    svgElementThree: document.querySelector("#svgElement-03"),
};

// Initialize Lists and Selected List ID
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);

// Permanent Lists
const inbox = { id: "10", name: "Inbox", tasks: [] };
const today = { id: "20", name: "Today", tasks: [] };
const upcoming = { id: "30", name: "Upcoming", tasks: [] };

// Event Listeners
elements.asideNewListForm.addEventListener("submit", handleNewListSubmit);
elements.asideNewListFormImg.addEventListener("click", handleNewListSubmit);
elements.asidePermanentListsWrapper.addEventListener("click", handleListSelection);
elements.asideCustomListsWrapper.addEventListener("click", handleListSelection);
elements.asideDeleteListButton.addEventListener("click", handleDeleteList);
elements.mainNewTaskForm.addEventListener("submit", handleNewTaskSubmit);
elements.mainNewTaskFormImg.addEventListener("click", handleNewTaskSubmit);
elements.mainTasksWrapper.addEventListener("click", handleTaskCheckboxClick);
elements.mainClearCompletedTasksButton.addEventListener("click", handleClearCompletedTasks);
elements.btnHamburger.addEventListener("click", handleToggleSideMenu);

// Rendering Functions
function render() {
    renderLists();
    renderGraphics();
    renderTasksCount();
}

function renderLists() {
    clearElement(elements.asidePermanentListsWrapper);
    clearElement(elements.asideCustomListsWrapper);
    lists.forEach((list) => {
        const listElement = createListElement(list);
        if (list.id === "10" || list.id === "20" || list.id === "30") {
            elements.asidePermanentListsWrapper.appendChild(listElement);
        } else {
            elements.asideCustomListsWrapper.appendChild(listElement);
        }
    });
}

function renderTasksCount() {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const incompleteTasksCount = selectedList.tasks.filter((task) => !task.complete).length;
    elements.mainListCounter.innerText = `${incompleteTasksCount} task${
        incompleteTasksCount === 1 ? "" : "s"
    } remaining`;
}

function renderGraphics() {
    const selectedList = lists.find((list) => list.id === selectedListId);
    elements.svgElementOne.style.display =
        selectedList.id === "10" && selectedList.tasks.length === 0 ? "block" : "none";
    elements.svgElementTwo.style.display =
        selectedList.id === "20" && selectedList.tasks.length === 0 ? "block" : "none";
    elements.svgElementThree.style.display =
        selectedList.id === "30" && selectedList.tasks.length === 0 ? "block" : "none";
}

// Other Functions
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createListElement(list) {
    const listElement = document.createElement("div");
    const imgElement = document.createElement("img");
    const inputElement = document.createElement("input");
    const spanElement = document.createElement("span");
    const tasksCounter = list.tasks.filter((task) => !task.complete).length;

    // Set attributes and properties
    imgElement.setAttribute("src", getIconSource(list.id));
    listElement.dataset.listId = list.id;
    inputElement.value = list.name;
    spanElement.textContent = tasksCounter;

    // Append elements
    listElement.appendChild(imgElement);
    listElement.appendChild(inputElement);
    listElement.appendChild(spanElement);

    // Add active class
    if (list.id === selectedListId) {
        listElement.classList.add("active-list");
    }

    return listElement;
}

function getIconSource(listId) {
    switch (listId) {
        case "10":
            return "svg/inbox.svg";
        case "20":
            return "svg/calendar.svg";
        case "30":
            return "svg/upcoming.svg";
        default:
            return "svg/list.svg";
    }
}

// Event Handlers
function handleNewListSubmit(e) {
    e.preventDefault();
    const listName = elements.asideNewListFormInput.value.trim();
    if (listName) {
        const list = createList(listName);
        lists.push(list);
        saveAndRender();
        elements.asideNewListFormInput.value = "";
    }
}

function handleListSelection(e) {
    const listElement = e.target.closest("div");
    if (listElement && !listElement.classList.contains("aside__lists-permanent")) {
        selectedListId = listElement.dataset.listId;
        saveAndRender();
    }
}

function handleDeleteList() {
    if (selectedListId === "10" || selectedListId === "20" || selectedListId === "30") {
        console.log("Cannot delete permanent lists!");
        return;
    }
    lists = lists.filter((list) => list.id !== selectedListId);
    selectedListId = "10";
    saveAndRender();
}

function handleNewTaskSubmit(e) {
    e.preventDefault();
    const taskName = elements.mainNewTaskInput.value.trim();
    if (taskName) {
        const task = createTask(taskName);
        const selectedList = lists.find((item) => item.id === selectedListId);
        selectedList.tasks.push(task);
        saveAndRender();
        elements.mainNewTaskInput.value = "";
    }
}

function handleTaskCheckboxClick(e) {
    if (e.target.tagName.toLowerCase() === "input") {
        const taskId = e.target.id;
        const selectedList = lists.find((item) => item.id === selectedListId);
        const task = selectedList.tasks.find((item) => item.id === taskId);
        task.complete = e.target.checked;
        saveAndRender();
    }
}

function handleClearCompletedTasks() {
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
    saveAndRender();
}

function handleToggleSideMenu() {
    elements.asideMenu.style.display = toggleMe ? "none" : "";
    toggleMe = !toggleMe;
}

// Initialization
function init() {
    if (lists.length === 0) {
        selectedListId = "10";
        pushPermanentLists();
        saveAndRender();
    } else {
        render();
    }
}

init();
