const addButton = document.getElementById("addButton");
const closeButton = document.getElementById("cancel");
const show = document.getElementById("popup");
const container = document.querySelector(".container");

//Display top header
const greet = document.getElementById("greet");
const dateDisplay = document.getElementById("date");
const timeDisplay = document.getElementById("time");

const form = document.querySelector("form");
const addTask = document.getElementById("add-task");

//Input Values
const titleValue = document.getElementById("task-title-value");
const descriptionValue = document.getElementById("task-description");
const dateValue = document.getElementById("task-date");

//Sticky note dispaly
const stickyNote = document.querySelector(".sticky-note");
const displayTitle = document.getElementById("display-title");
const displayDescription = document.getElementById("display-description");
const displayDate = document.getElementById("display-date");

const taskContainer = document.getElementById("tasks-container");
const dashboardContainer = document.querySelector(".dashboard-container");
const noTask = document.getElementById("notask");
const background = document.querySelector("html");
const formTaskTitle = document.querySelector(".form-task-title");
const errorMessageTitle = document.getElementById("error_message_title");
const errorMessageDate = document.getElementById("error_message_date");
const errorMessageDescription = document.getElementById("error_message_description");

//Task count display
const taskCountAll = document.querySelector(".all");
const taskCountToday = document.querySelector(".today");
const taskCountUpcoming = document.querySelector(".upcoming");
const taskCountOverdue = document.querySelector(".overdue");

//Mobile screen button
const menuBtn = document.getElementById("menu-btn");

//Popup message
const popupMsg = document.getElementById("popupMsg");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

//Adding data into the array
const saveData = () => {

    const dataArrIndex = taskData.findIndex(task => task.id === currentTask.id);
    const inputObj = {
        id: `${titleValue.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        title: titleValue.value,
        date: dateValue.value,
        description: descriptionValue.value,
        status: "ongoing",
    };

    //Adding data into the object
    if(dataArrIndex === -1){
        taskData.unshift(inputObj);
    }else{
        taskData[dataArrIndex] = inputObj;
    }

    if(addTask.innerText === "Update"){
        popupMsg.classList.toggle("visible-success");
        popupMsg.innerText = "Task updated succesfully!";
        setTimeout(() => {
        popupMsg.classList.toggle("fade-out");
        }, 1800);
    }else{
        popupMsg.classList.toggle("visible-success");
        popupMsg.innerText = "Task added succesfully!";
        setTimeout(() => {
        popupMsg.classList.toggle("fade-out");
        }, 1800);
    }

    setTimeout(() => {
        popupMsg.classList.remove("visible-success");
        popupMsg.classList.remove("visible-delete");
        popupMsg.classList.remove("fade-out");
    }, 2100);
    
    displayData(taskData);
    reset();
   
    addTask.innerText = "Add";
    localStorage.setItem("data", JSON.stringify(taskData));
}

//Filter tasks
const showDashboard = () => {

    const active = taskData.filter(tasks => tasks.status === "ongoing");
    const completed = taskData.filter(tasks => tasks.status === "done");
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const overdue = taskData.filter(tasks => tasks.date < formattedDate);

    taskContainer.innerHTML = ` <div class="dashboard-container">
            <div class="active-container">
                <h1>In Progress:</h1>
                <h1>${active.length}</h1>
            </div>
            <div class="completed-container">
                <h1>Completed:</h1>
                <h1>${completed.length}</h1>
            </div>
            <div class="overdue-container">
                <div class="overdue-header">
                    <h2>Overdue Tasks:</h2>
                    <h2>${overdue.length}</h2>
                </div>
                 <div class="overdue-list-container">
            
                </div>
            </div>
          </div>`;

          if(overdue.length === 0){
            document.querySelector(".overdue-list-container").innerHTML = "";
          }else{
            overdue.forEach(({id, title, description, date}) => {
                document.querySelector(".overdue-list-container").innerHTML += `<div class="dashboard-tasklist-container" id="${id}">
                        <div class="tasklist-data">
                            <p class="task-title-list">${title}</p>
                        </div>
                        <div class="tasklist-data">
                            <p class="task-description-list">${description}</p>
                        </div>
                        <div class="tasklist-data">
                            <p class="task-date-list">${date}</p>
                        </div>
                    </div>`;
            });
            document.querySelector(".overdue-list-container").style.textDecoration = "line-through";
          }
          closeMobileNav();
}

const showUpcoming = () => {
    taskContainer.innerHTML = "";
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const upcomingTasks = taskData.filter(tasks => tasks.date > formattedDate);

    if(upcomingTasks.length === 0){
        taskContainer.innerHTML = `<h2>No Upcoming Tasks</h2>`;
    }else{
        displayData(upcomingTasks);
    }
    closeMobileNav();
}

const showToday = () => {
    taskContainer.innerHTML = "";
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const todayTasks = taskData.filter(tasks => tasks.date === formattedDate && tasks.status === "ongoing");
    
    if(todayTasks.length === 0){
        taskContainer.innerHTML = `<h2>No available tasks today</h2>`;
    }else{
        displayData(todayTasks);
    }
    console.log(formattedDate);
    closeMobileNav();
}

const showOverdue = () => {
    taskContainer.innerHTML = "";
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const overdueTasks = taskData.filter(tasks => tasks.date < formattedDate);

    if(overdueTasks.length === 0){
        taskContainer.innerHTML = `<h2>No Overdue Tasks</h2>`;
    }else{
        displayData(overdueTasks);
        overdueTasks.forEach(tasks => {
            if(tasks.date < formattedDate){
                tasks.status = "overdue";
                document.getElementById(tasks.id).classList.add("red");
                document.querySelector(`#${tasks.id}-edit`).classList.add("disabled");
                document.querySelector(`#${tasks.id}-edit`).disabled = true;
                document.querySelector(`#${tasks.id}-done`).classList.add("disabled");
                document.querySelector(`#${tasks.id}-done`).disabled = true;
            }
        });
    }
    console.log(overdueTasks);
    closeMobileNav();
}

const showHistory = () => {
    taskContainer.innerHTML = "";

    const historyData = taskData.filter(tasks => tasks.status === "done");
   

    if(historyData.length === 0){
        taskContainer.innerHTML = `<h2>No Task history</h2>`;
    }else{
        displayData(historyData);
        
        historyData.forEach(tasks => {
            if(tasks.status === "done"){
                document.querySelector(`#${tasks.id}-edit`).classList.add("disabled");
                document.querySelector(`#${tasks.id}-edit`).disabled = true;
                document.querySelector(`#${tasks.id}-done`).classList.add("disabled");
                document.querySelector(`#${tasks.id}-done`).disabled = true;
            }   
        });     
    }
    closeMobileNav();
}

//Display all the data saved from the localStorage
const displayData = (tasks) => {
    taskContainer.innerHTML = ""; 

    tasks.forEach(({id, title, date, description}) => {

        taskContainer.innerHTML += `<div class="tasklist-container" id="${id}">
            <div class="tasklist-data" id="${id}" onclick="showStickyNote(this)">
                <p class="task-title-list">${title}</p>
            </div>
            <div class="tasklist-data" id="${id}" onclick="showStickyNote(this)">
                <p class="task-description-list">${description.length >= 80 ? description.substring(0, 80) + `...` : description}</p>
            </div>
            <div class="tasklist-data">
                <p class="task-date-list">${date}</p>
            </div>
            <div class="button-icon-container">
                <button type="button" class="icon-button" id="${id}-edit" onclick="editTask(this)">
                    <span class="tooltip-edit">Edit</span>
                    <i class="fa-solid fa-edit fa-lg"></i>
                </button>
                <button type="button" class="icon-button" id="${id}-delete" onclick="deleteTask(this)">
                    <span class="tooltip-delete">Delete</span>
                    <i class="fa-solid fa-trash fa-lg"></i>
                </button>
                <button type="button" class="icon-button" id="${id}-done" onclick="doneTask(this)">
                <span class="tooltip-done">Mark as done</span>
                <i class="fa-solid fa-check fa-lg"></i>
                </button
            </div>
          </div>`;
    });

}

const showStickyNote = (el) => {
    const dataArrIndex = taskData.findIndex(task => task.id === el.id);
    const taskList = taskData[dataArrIndex];

    stickyNote.classList.add("show-data-modal");
    container.classList.add("blur");
    stickyNote.setAttribute("id", taskList.id);
    displayTitle.innerHTML = taskList.title;
    displayDate.innerHTML = taskList.date;
    displayDescription.innerHTML = taskList.description;
}

//Handle deletion of tasks
const deleteTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(task => task.id === buttonEl.parentElement.parentElement.id);

        buttonEl.parentElement.parentElement.remove();
        taskData.splice(dataArrIndex, 1);

        popupMsg.classList.toggle("visible-delete");
        popupMsg.innerText = "Task deleted successfully!";
        setTimeout(() => {
            popupMsg.classList.toggle("fade-out");
            }, 1800);
        setTimeout(() => {
            popupMsg.classList.remove("visible-success");
            popupMsg.classList.remove("visible-delete");
            popupMsg.classList.remove("fade-out");
        }, 2100);

        localStorage.setItem("data", JSON.stringify(taskData));  
}


//Handle editing of tasks
const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(task => task.id === buttonEl.parentElement.parentElement.id);

    currentTask = taskData[dataArrIndex];

    showModal();
    titleValue.value = currentTask.title;
    dateValue.value = currentTask.date;
    descriptionValue.value = currentTask.description;

    addTask.innerText = "Update";
    formTaskTitle.innerHTML = `<h2>Update Task</h2>`;

}

const doneTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(task => task.id === buttonEl.parentElement.parentElement.id);

    currentTask = taskData[dataArrIndex];
    
    currentTask.status = "done";
    buttonEl.parentElement.parentElement.remove();
    popupMsg.classList.toggle("visible-success");
        popupMsg.innerText = "Task added to history!";
        setTimeout(() => {
            popupMsg.classList.toggle("fade-out");
            }, 1800);
        setTimeout(() => {
            popupMsg.classList.remove("visible-success");
            popupMsg.classList.remove("fade-out");
        }, 2100);


    localStorage.setItem("data", JSON.stringify(taskData));
}

const reset = () => {
    titleValue.value = "";
    dateValue.value = "";
    descriptionValue.value = "";
    errorMessageDate.innerHTML = "";
    errorMessageTitle.innerHTML = "";
    errorMessageDescription.innerHTML = "";
    currentTask = {};
}

/* Modal Script */
const showModal = () => {
    show.classList.add("show-modal");
    formTaskTitle.innerHTML = `<h2>Add New Task</h2>`;
    addTask.innerText = "Add";
    container.classList.add("blur");
    
}
const closeModal = () => {
    stickyNote.classList.remove("show-data-modal");
    container.classList.remove("blur");
    show.classList.remove("show-modal");
    titleValue.classList.remove("error");
    dateValue.classList.remove("error");
    formTaskTitle.innerHTML = `<h2>Add New Task</h2>`;
    closeDiscardModal();
    reset();
}

const closeDiscardModal = () => {
    document.querySelector(".discard-modal-container").classList.remove("show-discard-modal");
}


/* Dsiplay Date and Time */
const formatDate = () => {
    const date = new Date();
    const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    dateDisplay.innerHTML = `${DAY[date.getDay()]}, ${MONTH[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    
}
const formatTime = () => {
    setInterval(() => {
        const date = new Date();
        const hour = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const isAm = date.getHours() < 12;

        timeDisplay.innerHTML = `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${isAm ? "AM" : "PM"}`;
    }, 1000);
}

const disablePastDate = () => {
    const date = new Date();
    today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate()}`;
    dateValue.setAttribute("min", today);
}

/*Display Greetings */
const Greetings = () => {
    const date = new Date();
    if(date.getHours() < 12){
        greet.innerText = "Good Morning!";
        background.style.backgroundImage = "url(./resources/morning.jpeg)";
        
    }else if(date.getHours() === 12){
        greet.innerText = "Good Noon!";
        background.style.backgroundImage = "url(./resources/afternoon.jpg)";

    }else if(date.getHours() > 12 && date.getHours() < 17){
        greet.innerText = "Good Afternoon!";
        background.style.backgroundImage = "url(./resources/afternoon.jpg)";
    }else{
        greet.innerText = "Good Evening!";
        background.style.backgroundImage = "url(./resources/evening.jpg)";
    }
}

//Mobile scripting
const closeMobileNav = () => {
    document.querySelector(".left-container").classList.remove("show-nav");
    menuBtn.style.display = "block";
}

if(taskData.length){
    showDashboard();
    showToday();
    showUpcoming();
    showOverdue();
}else{
    noTask.innerHTML = `<h2>No Available Tasks</h2>`;
}

formatDate();
formatTime();
Greetings();
// disablePastDate();

addButton.addEventListener("click", () => {
    showModal();
});
closeButton .addEventListener("click", () => {
    if(titleValue.value === ""){
        closeModal();
    }else{
        document.querySelector(".discard-modal-container").classList.add("show-discard-modal");
    }
   
});

menuBtn.addEventListener("click", () => {
    document.querySelector(".left-container").classList.add("show-nav");
    menuBtn.style.display = "none";
});

form.addEventListener("submit", e => {
    e.preventDefault();
    if(titleValue.value === ''){
        errorMessageTitle.innerHTML = "*Title is required!";
        titleValue.classList.add("error");
           titleValue.addEventListener("keypress", () => {
            errorMessageTitle.innerHTML = "";
            titleValue.classList.remove("error");
           });
    }
    if(dateValue.value === ''){
        errorMessageDate.innerHTML = "*Date is required!";
        dateValue.classList.add("error");
        dateValue.addEventListener("change", () => {
            errorMessageDate.innerHTML = "";
            dateValue.classList.remove("error");
           });
    }

    const checkfirst25Char = descriptionValue.value.substring(0, 45);
    const nowhiteSpace = !/\s/.test(checkfirst25Char);

    if(nowhiteSpace){
            errorMessageDescription.innerHTML = "* Invalid input. Please provide a readable description with white spaces and punctuation.";
            descriptionValue.classList.add("error");
            descriptionValue.addEventListener("keypress", () => {
                errorMessageDescription.innerHTML = "";
                descriptionValue.classList.remove("error");
               });
    }

    if(titleValue.value && dateValue.value && !nowhiteSpace){
        saveData();
        closeModal();
    }
});




