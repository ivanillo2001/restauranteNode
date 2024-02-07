"use strict"
/**
 * Importaciones necesarias:
 */
import { Router } from "express";
import {cargarRestaurantes,cargarEmpleados, mostrarMesas,confirmarReserva,borrarReserva} from "../controllers/restaurantes.controllers.js";//con esto importamos las funciones desde controller

const router = Router(); //declaración del router

router.get("/restaurantes",cargarRestaurantes);//dirección de la funcion de mostrar zonas
router.get("/empleados/:idRestaurante",cargarEmpleados)
router.get("/mesas/:idRestaurante/:fechaReserva",mostrarMesas)
router.post("/reserva/",confirmarReserva)
router.post("/borrarReserva/",borrarReserva)
// router.get("/inmuebles/:numHabitaciones/:precio/:idZona",mostrarInmuebles)//Direccion de la funcion para mostrar los inmuebles
export default router;//lo exportamos.
