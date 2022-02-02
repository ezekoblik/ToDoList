const input = document.getElementById("input");
const button = document.getElementById("btn");
const text = document.querySelector(".text");
const listaTarea = document.getElementById("listado");
const template = document.getElementById("template").content;
const fragment = document.createDocumentFragment();
let tareas = {};

// EVENTOS
button.addEventListener("click", (e) => {
  e.preventDefault();

  agregarTarea();
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("tareas")) {
    tareas = JSON.parse(localStorage.getItem("tareas"));
  }

  if (input.value === "") {
    button.disabled = true;
  }
  pintarTarea();
});

listaTarea.addEventListener("click", (e) => {
  btnAction(e);
  pintarTarea();
});

input.addEventListener("click", () => {
  button.disabled = false;
});

// FUNCIONES
const agregarTarea = () => {
  //antes de pintarlas tengo que agregar las tareas, en este caso a la coleccion de objetos

  if (input.value.trim() === "") {
    return;
  }

  const tarea = {
    id: Date.now(),
    texto: input.value,
    estado: false,
  };
  tareas[tarea.id] = tarea;

  // text.style.display = "none";
  input.focus();
  pintarTarea();
};

const pintarTarea = () => {
  localStorage.setItem("tareas", JSON.stringify(tareas));

  if (Object.values(tareas).length === 0) {
    listaTarea.innerHTML = `
    <section id="parrafo" class="parrafo-text">
    <p class="text">No hay tareas pendientes</p>
  </section>`;
    return;
  }

  listaTarea.innerHTML = "";
  Object.values(tareas).forEach((tarea) => {
    const clone = template.cloneNode(true);

    clone.querySelector("li").textContent = tarea.texto;

    if (tarea.estado) {
      clone.querySelector("ul").classList.replace("lista", "list");
      clone.querySelector("li").style.textDecoration = "line-through";
      clone
        .querySelectorAll(".fas")[0]
        .classList.replace("fa-check-circle", "fa-undo-alt");
    }

    clone.querySelectorAll(".fas")[0].dataset.id = tarea.id;
    clone.querySelectorAll(".fas")[1].dataset.id = tarea.id;

    fragment.appendChild(clone);
  });

  listaTarea.appendChild(fragment);
  input.value = "";
};

const btnAction = (e) => {
  if (e.target.classList.contains("fas")) {
    tareas[e.target.dataset.id].estado = true;
    pintarTarea();
  }

  if (e.target.classList.contains("fa-trash-alt")) {
    delete tareas[e.target.dataset.id];
    pintarTarea();
    // console.log(tareas);
  }

  if (e.target.classList.contains("fa-undo-alt")) {
    tareas[e.target.dataset.id].estado = false;
    pintarTarea();
  }

  e.stopPropagation();
};
