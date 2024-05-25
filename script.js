
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

/*-------------------------------------------codigo necesario para api del clima-----------------------------------------------*/
window.addEventListener('load', () => {

    /*variables que capturan el id del HTML*/
    let temperatura = document.getElementById('temperatura')
    let climaDescripcion = document.getElementById('climaDescripcion')
  
    let ubicacionActual =document.getElementById('ubicacionActual')
    let iconoClima = document.getElementById('iconoClima')
  
    let mensajeError = document.getElementById('mensajeError'); // Elemento para mostrar errores
    

    //variable para mostar spiner de carga en lo que se cargan los datos
    let cleanUp = () => {
        let widget = document.getElementById("widgetContainer")
        let loader = document.getElementById("loader")

        loader.style.display = 'none';
        widget.style.display = 'flex'
    }
  
    /*verifica si hay permisoso de ubicacion*/
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
  
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
  
          /*url de la api de openweather*/
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=dafdc851dad1e1a058c3479b6f55ccf2`
  
          /*realiza una solicitud fetch*/
          fetch(url)
            .then(response => {return response.json()})
            .then(datos => {
  
              /*agrega la teperatuta al HTML*/ 
              let temp = Math.round(datos.main.temp)
              temperatura.textContent = `${temp} °C`
  
              let descripcion = datos.weather[0].description
              climaDescripcion.textContent = descripcion.toUpperCase()
  
              ubicacionActual.textContent = datos.name.toUpperCase()
              
  
              /*selecciona el icono correspondiente al clima*/
              switch (datos.weather[0].main) {
                case 'Thunderstorm':
                  iconoClima.src='assets/iconos_clima/thunder.svg'
                  break;
  
                case 'Drizzle':
                  iconoClima.src='assets/iconos_clima/rainy-2.svg'
                  break;
  
                case 'Rain':
                  iconoClima.src='assets/iconos_clima/rainy-7.svg'
                  break;
  
                case 'Snow':
                  iconoClima.src='assets/iconos_clima/snowy-6.svg'
                  break;     
  
                case 'Clear':
                  iconoClima.src='assets/iconos_clima/day.svg'
                  break;
  
                case 'Atmosphere':
                  iconoClima.src='assets/iconos_clima/weather.svg'
                  break;  
                    
                case 'Clouds':
                  iconoClima.src='assets/iconos_clima/cloudy-day-1.svg'
                  break;
  
                default:
                  iconoClima.src='assets/iconos_clima/cloudy-day-1.svg'
              }

              cleanUp()
            })
  
            .catch(error => {
              // Muestra un mensaje de error en el DOM en caso de fallo en la solicitud
              mensajeError.textContent = 'Error al obtener datos del clima. Por favor, inténtelo de nuevo más tarde.';
              
            });
        }, error => {
          // Muestra un mensaje de error en el DOM en caso de fallo en la geolocalización
          mensajeError.textContent = 'Error al obtener la geolocalización. Por favor, revise los permisos de ubicación.';
          
        });
      } else {
        // Muestra un mensaje de error en el DOM si la geolocalización no está disponible en el navegador
        mensajeError.textContent = 'Geolocalización no está disponible en este navegador.';
        
      }
    });

/*------------------------------------------------codigo del simulador----------------------------------------------------------*/
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




