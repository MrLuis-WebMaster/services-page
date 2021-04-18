let pagina = 1;
const cita = {
    nombre:"",
    fecha:"",
    hora:"",
    servicios: []
}

document.addEventListener('DOMcontentLoaded', function(){
    iniciarApp();

})

iniciarApp();

function iniciarApp (){
    
    mostrarServicios();

    // resalta el div actual segun donde se encuentre
    mostrarseccion();

    // oculta o muestra una seccion segun el tab
    cambiarseccion();

     // Paginacion siguiente y anterior
     paginaSiguiente();
     paginaAnterior();

    //comprueba la pagina para ocultar o mostrar la paginacion

    botonesPaginador();

    // muestra el resumen de la cita
     mostrarResumen();


     //almacena el nombre en el objeto de cita
     nombreCita();
     //almacena fecha 
     fechaCita();
     //Desahabilitar fechas anteriores
     deshabilitarFechaAnterior();
    //hora

     horaCita();
}

function mostrarseccion () {

    //Eliminar mostrar seccion

    const seccionAnterior = document.querySelector(".mostrar-seccion");
    if (seccionAnterior) {
        seccionAnterior.classList.remove("mostrar-seccion");
    }

    const seccionActual = document.querySelector(`#paso${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector(".tabs .actual");
    if (tabAnterior) {
        tabAnterior.classList.remove("actual");
    }

    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
} 

function cambiarseccion () {
    const enlaces = document.querySelectorAll(".tabs button");
    enlaces.forEach( enlace => {
        enlace.addEventListener("click", e => {
            e.preventDefault();
            pagina = parseInt (e.target.dataset.paso);

            //llamar la funcion mostrar la seccion
            mostrarseccion();

            //llamar botones paginador 
            botonesPaginador();
        })
    } )
}

async function mostrarServicios() {
    try {

        const url = "http://localhost:3000/servicios.php";
        const resultado = await fetch(url);
        const db = await resultado.json();

/*         const { servicios } = db; */

       // Generar el HTML
       db.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            // DOM Scripting
            // Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            // Generar el precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            // Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.servicioId = id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarservicio;


            // Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
       } )
    } catch (error) {
        console.log(error);
    }
}

function seleccionarservicio (e) {

    let elemento;
    // forzar el elemento al que le damos click sea el div

    if (e.target.tagName === "P") {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    // sirve para ver si el elemento ya tiene una clase agregada
    // en caso de que no agrega la clase
    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove ("seleccionado");

        //llamaremos una funcion que eliminara el servicio
        const id = parseInt(elemento.dataset.servicioId);
        eliminarServicio(id);
    } else {
        elemento.classList.add ("seleccionado");

        //llamaremos una funcion que agregara el servicio
        const servicioObj = {
            id: parseInt(elemento.dataset.servicioId),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        agregrarServicio(servicioObj);
    }

}

function eliminarServicio (id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter (servicio => servicio.id !== id );

    console.log(cita);
    
}

function agregrarServicio (servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente() {
    const next = document.getElementById('#siguiente');
    next.addEventListener ("click", () => {
        pagina++;
        console.log(pagina);
        botonesPaginador();
    })
}

function paginaAnterior() {
    const anterior = document.getElementById('#anterior');
    anterior.addEventListener ("click", () => {
        pagina--;
        console.log(pagina);
        botonesPaginador();
    })
    
}
function botonesPaginador () {
    const next = document.getElementById('#siguiente');
    const anterior = document.getElementById('#anterior');

    if (pagina === 1) {
        anterior.classList.add("ocultar");
    }  else if (pagina === 3) {
        next.classList.add("ocultar");
        anterior.classList.remove("ocultar");
        mostrarResumen (); // estamos en la pagina 3 carga el resumen;
    } else {
        anterior.classList.remove("ocultar");
        next.classList.remove("ocultar");
    }

    mostrarseccion(); // cambia la seccion
}

function mostrarResumen () {
    //Destructuring 
    const {nombre,fecha,hora,servicios} = cita;

    //seleccionar el resumen
    const resumenDiv = document.querySelector(".resumen");
    //Limpia el html 

    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    } 
    //validar
    if  (Object.values(cita).includes("")) {
        const Noservicios = document.createElement("P");
        Noservicios.textContent = "Faltan llenar campos";
        Noservicios.classList.add("invalidar-cita");

        //agregar a resumen 
        resumenDiv.appendChild(Noservicios);

        return;
    }
    const HeadingCita = document.createElement("H3");
    HeadingCita.textContent = "Resumen de servicios";

    //mostrar el resumen

    const nombreCita = document.createElement("P");
    nombreCita.innerHTML= `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML= `<span>Fecha: </span>${fecha}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML= `<span>Hora:</span> ${hora}`;


    const serviciosCita = document.createElement("DIV");
    serviciosCita.classList.add("resumen-servicios");

    const Heading = document.createElement("H3");
    Heading.textContent="Detalles";
    serviciosCita.appendChild(Heading);

    //iterar sobre el arreglo 
    let cantidad = 0;

    servicios.forEach(servicio => {

        const {nombre, precio } = servicio;

        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement("P");
        precioServicio.textContent = precio;
        precioServicio.classList.add("precio");

        const TotalServicio = precio.split("$");

        cantidad += parseInt(TotalServicio[1].trim());




        //colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        //agregar a un elemento que existe
        serviciosCita.appendChild(contenedorServicio);

    })

    //Mostrar en el html
    resumenDiv.appendChild(HeadingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const TotalPago= document.createElement("P");
    TotalPago.classList.add("total");
    TotalPago.innerHTML=`<span>Total a pagar: </span> $ ${cantidad}`;

    resumenDiv.appendChild(TotalPago);
}

function nombreCita () {
    const nombre = document.querySelector("#nombre");
    nombre.addEventListener("input", e => {
        const nombreTexto = e.target.value.trim();
        if (nombreTexto === "" || nombreTexto.length < 3) {
            mostrarMensaje("Nombre no valido", "error");
        } else {
            const alerta = document.querySelector(".alerta");
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    })
}

function fechaCita () {
    const fecha = document.querySelector("#fecha");
    fecha.addEventListener("input", e => {
        const dia = new Date(e.target.value).getUTCDay();
        if ([0].includes(dia)){
            e.preventDefault();
            fecha.value="";
            mostrarMensaje("Los domingos no recibo citas", "error");
        } else {
            cita.fecha = fecha.value;
        }

    })
}


function mostrarMensaje (mensaje, tipo) {

    //si hay una alerta no crear mas 
    const alertaPrevia = document.querySelector(".alerta");
    if (alertaPrevia ) {
        return;
    }
    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if (tipo === "error") {
        alerta.classList.add("error");
    }
    //insertar html

    const form  = document.querySelector(".formulario");
    form.appendChild(alerta);

    //eliminar la alerta despues de 3 segundos 
    setTimeout (()=>{
        alerta.remove();
    },3000);
}



function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` :mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18 ) {
            mostrarMensaje('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 2000);
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}