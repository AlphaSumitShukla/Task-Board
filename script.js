let tasksData = {}


const todo = document.querySelector('#todo');
const progress = document.querySelector('#Progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];
const tasks = document.querySelectorAll('.task');

let draggedItem = null;

function addTask(title, desc, column) {
    const div = document.createElement("div");

    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
      <h2>${title}</h2>
      <p>${desc}</p>  
      <button class="delete-btn">Delete</button>   
    `;

    column.appendChild(div);

    // drag
    div.addEventListener("dragstart", () => {
        draggedItem = div;
    });

    // delete task
    div.querySelector(".delete-btn").addEventListener("click", () => {
        div.remove();
        updateTaskCount();
        localStorage.setItem("tasks", JSON.stringify(tasksData));
    });

    return div;
}


function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        tasksData[col.id] = Array.from(tasks).map(t => ({
            title: t.querySelector("h2").innerText,
            desc: t.querySelector("p").innerText
        }));

        count.innerText = tasks.length;
    });

}

if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title, task.desc, column);
        });
    }
    updateTaskCount();

}

tasks.forEach(task => {
    task.addEventListener("dragstart", (e) => {
        draggedItem = task;
    })
})

function addDragEventOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave", (e) => {
        column.classList.remove("hover-over");
    })

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    })

    column.addEventListener('drop', (e) => {
        e.preventDefault();




        column.appendChild(draggedItem);
        column.classList.remove("hover-over");


        updateTaskCount();


        localStorage.setItem("tasks", JSON.stringify(tasksData));

    });
}



addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);

/* modal */
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");

});


addTaskButton.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title").value;
    const taskDesc = document.querySelector("#task-desc-input").value;

    if (!taskTitle) return; 

    addTask(taskTitle, taskDesc, todo);
    updateTaskCount();
    localStorage.setItem("tasks", JSON.stringify(tasksData));

    document.querySelector("#task-title").value = "";
    document.querySelector("#task-desc-input").value = "";

    modal.classList.remove("active");
});


