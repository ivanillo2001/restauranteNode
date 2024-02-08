"use strict";
//variables globales
let idRestaurante;
let fechaReserva;
let idEmpleado;
/**
 * Codificamos el ContentLoaded, que almacenará las siguientes funciones:
 * - mostrarRestaurantes(); -> será la encargada de cargar los restaurantes
 */
window.addEventListener("DOMContentLoaded", () => {
  mostrarRestaurantes(); //al cargar la pagina deben haberse cargado los restaurantes
  validarFormulario(); //valida formulario
});

/**
 * @description Función encargada de cargar los restaurantes
 * al cargar la página. Utilizaremos la librería Axios
 */
function mostrarRestaurantes() {
  //obtenemos los restaurantes que hay en la consulta
  axios
    .get("http://localhost:3000/restaurantes")
    //ahora trabajamos con ellos:
    .then((result) => {
      // Por cada restaurante hay que añadir un option al select para que se vayan añadiendo
      $(result.data).each((ind, restaurante) => {
        $("#rest").append(
          `<option value=${restaurante.idrest} num-mesas=${restaurante.mesas}>${restaurante.name}</option>`
        );
      });
      /**
       * Ahora añadimos el metodo on Change, que llama a la funcion cargarEmpleados
       */
      $("#rest").on("change", function () {
        //llamamos a la funcion de mostrarEmpleados
        cargarEmpleados($("#rest").val()); //con esto obtenemos el valor del restaurante seleccionado
        
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

/**
 * @description Función que se encarga de cambiar los empleados y se
 * muestren solo los que trabajan en el restaurante seleccionado
 */
function cargarEmpleados(restauranteSeleccionado) {
  idRestaurante = restauranteSeleccionado;
  $.ajax({
    type: "GET",
    url: `http://localhost:3000/empleados/${idRestaurante}`,
  }).done(function (responseText) {
    $("#emp").empty();
    $(responseText).each((ind, trabajador) => {
      $("#emp").append(
        `<option value=${trabajador.idemp}>${trabajador.nomape}</option>`
      );
    });
  });
}

/**
 * @description Función encargada de verificar que tanto el
 * restaurante como el empleado y la fecha están rellenos
 */
function validarFormulario() {
  $(".form-datos").validate({
    errorElement: "em",
    errorPlacement: function (error, element) {
      error.addClass("invalid-feedback"); //recuadro rojo y un icono
    },
    //Establecemos las reglas del formulario
    rules: {
      rest: {
        required: true,
      },
      emp: {
        required: true,
      },
      fechaR: {
        required: true,
      },
    },
    //Mensajes de error:
    messages: {
      rest: {
        required: "<span class='error'>Campo obligatorio</span>",
      },
      emp: {
        required: "<span class='error'>Campo obligatorio</span>",
      },
      fechaR: {
        required: "<span class='error'>Campo obligatorio</span>",
      },
    },
    submitHandler: (form, event) => {
      event.preventDefault();
      fechaReserva = $("#fechaR").val();
      idEmpleado = $("#emp").val();
      mostrarMesas(idRestaurante, fechaReserva); //al validar el formulario se muestran las mesas
    },
  });
}

/**
 * @description Funcion que se encarga de mostrar las mesas del restaurante.
 * Si está la mesa reservada, se mostrará una mesa roja, y si está libre
 * se mostrará verde.
 * @param {*} restaurante
 * @param {*} fechaReserva
 */
function mostrarMesas(restaurante, fechaReserva) {
  idRestaurante = restaurante;
  $("#comedor").empty();
  $.ajax({
    type: "GET",
    url: `http://localhost:3000/mesas/${idRestaurante}/${fechaReserva}`,
  }).done(function (responseText) {
    //ahora mostramos las mesas que tiene el restaurante que hemos puesto según el formulario
    let mesasTotal = $("#rest option:selected").attr("num-mesas");
    for (let numeroMesa = 1; numeroMesa <= mesasTotal; numeroMesa++) {
      // Verifico si hay una reserva para la mesa actual
      let reservaParaMesa = $(responseText).filter(
        (ind, reserva) => reserva.mesa == numeroMesa
      )[0];
      if (reservaParaMesa) {
        // Si hay una reserva, añado mesa ocupada
        $("#comedor").append(
          `<div><div id=${numeroMesa} class='mesaOcupada' title='Mesa ${numeroMesa} - Cliente: ${reservaParaMesa.nomapecli}'></div></div>`
        );
      } else {
        // Si no hay reserva, añado mesa libre
        $("#comedor").append(
          `<div><div id=${numeroMesa} class='mesaLibre' title='Mesa ${numeroMesa}'></div></div>`
        );
      }
    }

    accionesMesas();
  });
}

/**
 * @description Función encargada de darle funcionalidad a las mesas
 */
function accionesMesas() {
  //ocupamos mesa
  let mesasLibres = document.querySelectorAll(".mesaLibre");
  mesasLibres.forEach((mesaLibre) => {
    mesaLibre.addEventListener("click", function () {
      //llamamos a hacerReserva
      hacerReserva(mesaLibre.getAttribute("id"), fechaReserva, idRestaurante);
    });
  });

  //eliminar reserva:
  let mesasOcupadas = document.querySelectorAll(".mesaOcupada");
  mesasOcupadas.forEach((mesaOcupada) => {
    mesaOcupada.addEventListener("click", function () {
      //elimina la clase mesaOcupada
      borrarReserva(
        mesaOcupada.getAttribute("id"),
        idRestaurante,
        fechaReserva
      );
    });
  });
}

/**
 * @description Función encargada de hacer una reserva.
 * Mostrará una ventana modal para rellenar los datos pedidos
 * y al darle al botón de guardar se guardará la reserva
 */
function hacerReserva(numMesa, fecha, idRestaurante) {
  //mostramos ventana modal:
  $("#frmModal").modal("show");
  const botonReservar = $(".subtn-mit");
  botonReservar.on("click", function (event) {
    event.preventDefault();
    //recogemos datos del formulario
    let nomCliente = $("#nameApeCli").val();
    let numComensales = $("#numCom").val();
    confirmarReserva(
      numMesa,
      fecha,
      idRestaurante,
      idEmpleado,
      nomCliente,
      numComensales
    );
    // cambiamos clase a la mesa seleccionada
    let mesasLibres = document.querySelectorAll(".mesaLibre");
    mesasLibres.forEach((mesa) => {
      if (mesa.getAttribute("id") == numMesa) {
        mesa.classList.remove("mesaLibre");
        mesa.classList.add("mesaOcupada");
      }
    });
    $("#frmModal").modal("hide");
  });
}

/**
 * @description Funcion encargada de realizar la reserva de la mesa. Se pasan los parametros necesarios
 * para el insert en la bbdd.
 * @param {*} numMesa
 * @param {*} fechaReserva
 * @param {*} idRestaurante
 * @param {*} idEmpleado
 * @param {*} nomCliente
 * @param {*} numComensales
 */

function confirmarReserva(
  numMesa,
  fechaReserva,
  idRestaurante,
  idEmpleado,
  nomCliente,
  numComensales
) {
  //Codificaremos el código para guardar nuestra  reserva:
  const datos = {
    idRestaurante: idRestaurante,
    idEmpleado: idEmpleado,
    fecha: fechaReserva,
    mesa: numMesa,
    cliente: nomCliente,
    comensales: numComensales,
  };

  fetch("http://localhost:3000/reserva/", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(datos),
  })
    .then((datos) => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Insertado con éxito!",
        showConfirmButton: false,
        timer: 1500,
      });
    })
    .catch((error) => {
      alert("Error al insertar los datos");
    });

  limpiarDatos();
  //ocultamos ventana modal:
  $("#frmModal").modal("hide");
}

/**
 * @description Funcion encargada de eliminar la reserva de una mesa
 */
function borrarReserva(numMesa, idRestaurante, fechaReserva) {
  Swal.fire({
    title: "Quieres cancelar la reserva de la mesa " + numMesa + "?",
    showDenyButton: true,
    confirmButtonText: "Sí, cancelar",
    denyButtonText: `No`,
  }).then((result) => {
    if (result.isConfirmed) {
      //preparamos los datos para la consulta:
      const datos = {
        numMesa: numMesa,
        idRestaurante: idRestaurante,
        fecha: fechaReserva,
      };
      //hacemos el fetch
      fetch("http://localhost:3000/borrarReserva", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(datos),
      })
        .then((datos) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Eliminado con éxito!",
            showConfirmButton: false,
            timer: 1000,
          });
          let mesasOcupadas = document.querySelectorAll(".mesaOcupada");
          mesasOcupadas.forEach((mesaOcupada) => {
            if (mesaOcupada.getAttribute("id") == numMesa) {
              mesaOcupada.classList.remove("mesaOcupada");
              mesaOcupada.classList.add("mesaLibre");
              limpiarDatos();
            }
          });
        })
        .catch((error) => {
          alert("Error al eliminar la reserva");
        });

    } else if (result.isDenied) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Okey!",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  });
}

/**
 * @description Función encargada de limpiar los datos
 * de la pantalla
 */
function limpiarDatos() {
  //borramos el contenido de la ventana modal
  $("#nameApeCli").val("");
  $("#numCom").val("");

  //borramos los campos del formulario inicial:
  $("#rest").val("");
  $("#emp").val("");
  $("#fechaR").val("");

  //borramos comedor
  $("#comedor").empty();
}
