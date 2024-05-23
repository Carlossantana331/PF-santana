
//codigo para hacer que el menu sea dinamico (aparezca y desaparezca)
let mostrarElementos = document.querySelectorAll('.menuMostrarClick');

mostrarElementos.forEach(listarElementos => {
    listarElementos.addEventListener('click', () => {
        mostrarElementos.forEach(menu => {
            if (menu !== listarElementos && menu.classList.contains('arrow')) {
                menu.classList.remove('arrow');
                menu.nextElementSibling.style.height = "0px";
            }
        });

        listarElementos.classList.toggle('arrow');

        let height = 0;
        let menu = listarElementos.nextElementSibling;
        if (menu.clientHeight == "0") {
            height = menu.scrollHeight;
        }

        menu.style.height = `${height}px`;
    })
});


// Array para almacenar las tareas
let tareas = [];
let tareasCompletadas = [];



// Función constructora de objetos para representar una tarea
function tareasPendientes(tarea, fechaLimite) {
    this.tarea = tarea;
    this.fechaLimite = fechaLimite;
}

/*-----------------------------------------lista de tareas por hacer y sub-funciones-----------------------------------------*/
function actualizarListaTareas() {
    let listaTareasElemento = document.getElementById("listaTareas");
    if (tareas.length !== 0) {
        let lista = "<ul class = 'listaTareasContainer'>"; // Inicia una lista no ordenada

        // Recorre todas las tareas y las agrega a la lista con un botón de eliminación
        for (let i = 0; i < tareas.length; i++) {
            lista += "<li class = 'listaTareasItem'>"; // Inicia un ítem de lista
            lista += "Tarea por hacer: " + tareas[i].tarea.charAt(0).toUpperCase() + tareas[i].tarea.slice(1) + "<br>"; // Contenido de la tarea
            lista += "Fecha límite: " + tareas[i].fechaLimite; // Fecha límite
            lista += "<div class = 'botonesListaTareas'>"
            lista += `<button id="completar-${i}" class="boton"><img src="assets/check.svg"></button>`; // Botón de finalizacion de una tarea
            lista += `<button id="eliminar-${i}" class="boton"><img src="assets/basura.svg"></button>`; // Botón de eliminación
            lista += "</div>"
            lista += "</li>"; // Termina el ítem de lista
            lista += "<div class = 'lineaDivisora'></div>";
        }

        lista += "</ul>"; // Termina la lista no ordenada
        listaTareasElemento.innerHTML = lista;


        // Asignar eventos a los botones
        for (let i = 0; i < tareas.length; i++) {
            document.getElementById(`completar-${i}`).addEventListener('click', () => tareaCompletada(i));
            document.getElementById(`eliminar-${i}`).addEventListener('click', () => eliminarTarea(i));
        }

    } else {
        listaTareasElemento.innerHTML = "<h2>Aun no hay tareas en la lista.</h2>";
    }
}

//funcion boton de tarea completada
function tareaCompletada(index) {
    tareasCompletadas.push({
        tarea: tareas[index].tarea,
        fechaLimite: tareas[index].fechaLimite,
        fechaCompletado: new Date().toLocaleDateString(), // Fecha actual
    });
    tareas.splice(index, 1);
    localStorage.setItem("tareas", JSON.stringify(tareas));
    localStorage.setItem("tareasCompletadas", JSON.stringify(tareasCompletadas));
    actualizarListaTareas();
    actualizarListaTareasCompletadas();
    mostrarMensaje("Tareas completada, enviada a la lista de 'tareas completadas'")
}

//funcion boton de eliminar tarea 
function eliminarTarea(index) {
    tareas.splice(index, 1);
    localStorage.setItem("tareas", JSON.stringify(tareas));
    actualizarListaTareas();
    mostrarMensaje("Tareas eliminada exitosamente")
}



/*----------------------------------------Función para agregar una nueva tarea--------------------------------------*/ 

// Función para agregar una nueva tarea al array
function agregarTarea(nuevaTarea) {
    tareas.push(nuevaTarea);
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function agregarNuevaTarea() {
    let tareaInput = document.getElementById("input-tarea").value.trim();
    let fechaInput = document.getElementById("input-fecha").value;

    if (tareaInput !== "" && fechaInput !== "") {
        let nuevaFecha = new Date(fechaInput); // Convertir el valor del input de fecha a un objeto de fecha
        let fechaFormateada = nuevaFecha.toLocaleDateString(); // Formatear la fecha si es necesario
        let nuevaTarea = new tareasPendientes(tareaInput, fechaFormateada);
        agregarTarea(nuevaTarea);
        document.getElementById("input-tarea").value = "";
        document.getElementById("input-fecha").value = "";
        actualizarListaTareas();
        mostrarMensaje("Tareas agregada exitosamente")
    } else {
        document.getElementById("boton-agregar-tarea").addEventListener('click', () => {
            popup.showModal();
        });
    }
}

//variables para hacer funcionar la ventana emergente (popup)
let popupBoton = document.querySelector('#popupBoton')
let popup = document.querySelector('#popup')
document.getElementById("popupBoton").addEventListener('click', () => {
    popup.close();
});





/*-----------------------------------------lista de tareas completadas y sub-funciones-----------------------------------------*/

//funcion para mover tareas a la lista de completadas 
function actualizarListaTareasCompletadas() {
    let listaTareasCompletadasElemento = document.getElementById("listaTareasCompletadas");
    if (tareasCompletadas.length !== 0) {
        let lista = "<ul class = 'listaTareasContainer'>"; // Inicia una lista no ordenada

        // Recorre todas las tareas completadas y las agrega a la lista
        for (let i = 0; i < tareasCompletadas.length; i++) {
            lista += "<li class = 'listaTareasItem'>"; 
            lista += "Tarea completada: " + tareasCompletadas[i].tarea.charAt(0).toUpperCase() + tareasCompletadas[i].tarea.slice(1) + "<br>"; // Contenido de la tarea completada
            lista += "Fecha límite: " + tareasCompletadas[i].fechaLimite + "<br>"; // Fecha límite
            lista += "Fecha en la que se realizo: " + tareasCompletadas[i].fechaCompletado; // Fecha de completado
            lista += "</li>"; 
            lista += "<div class = 'lineaDivisora'></div>";
        }

        lista += "</ul>"; // Termina la lista no ordenada
        lista += '<button id="limpiarTareas" class="botonLimpiar"><img src="assets/basura.svg" alt=""></button>'
        listaTareasCompletadasElemento.innerHTML = lista;

         // Asignar evento al botón de limpiar tareas completadas
         document.getElementById('limpiarTareas').addEventListener('click', limpiarTareasCompletadas);

    } else {
        listaTareasCompletadasElemento.innerHTML = "<h2>No hay tareas completadas.</h2>";
    }
}


//funcion para limpiar el historial de tareas completadas
function limpiarTareasCompletadas() {
    tareasCompletadas = []; // Vaciar el array de tareas completadas
    localStorage.removeItem("tareasCompletadas"); // Remover las tareas completadas del almacenamiento local
    actualizarListaTareasCompletadas(); // Actualizar la visualización de la lista de tareas completadas
    mostrarMensaje("Tareas completadas eliminadas")
}





/*-----------------------------------------variables y eventos varios-----------------------------------------*/

// Cargar tareas desde localStorage al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    let tareasGuardadas = localStorage.getItem("tareas");
    if (tareasGuardadas) {
        tareas = JSON.parse(tareasGuardadas);
        actualizarListaTareas();
    }

    let tareasCompletadasGuardadas = localStorage.getItem("tareasCompletadas");
    if (tareasCompletadasGuardadas) {
        tareasCompletadas = JSON.parse(tareasCompletadasGuardadas);
        actualizarListaTareasCompletadas();
    }
});


//funcion para mostrar mensaje 
function mostrarMensaje(mensaje) {
    let mensajeElemento = document.createElement("div");
    mensajeElemento.id = "mostrarMensaje";
    mensajeElemento.textContent = mensaje;
    document.body.appendChild(mensajeElemento);

    // Mostrar el mensaje
    mensajeElemento.style.display = "block";

    // Ocultar el mensaje después de 1 segundo
    setTimeout(function() {
        mensajeElemento.style.display = "none";
        // Eliminar el elemento del DOM después de ocultarlo
        mensajeElemento.parentNode.removeChild(mensajeElemento);
    }, 2000);
}



// Obtener el botón "Agregar tarea" por su ID
let botonAgregarTarea = document.getElementById("boton-agregar-tarea");

// Agregar un event listener para el clic en el botón
botonAgregarTarea.addEventListener("click", agregarNuevaTarea);




