"use strict"
/**
 * Importaciones necesarias:
 */
import { Router } from "express";
import {cargarRestaurantes,cargarEmpleados, mostrarMesas,confirmarReserva,borrarReserva} from "../controllers/restaurantes.controllers.js";//con esto importamos las funciones desde controller

const router = Router(); //declaración del router

router.get("/restaurantes",cargarRestaurantes);//dirección de la funcion de mostrar los restaurantes
router.get("/empleados/:idRestaurante",cargarEmpleados) //funcion que carga los empleados de un restaurante
router.get("/mesas/:idRestaurante/:fechaReserva",mostrarMesas)//funcion que carga las mesas de un restaurante
router.post("/reserva/",confirmarReserva)//funcion para realizar reservas
router.post("/borrarReserva/",borrarReserva)//función para eliminar las reservas
export default router;//lo exportamos.
