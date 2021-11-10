const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
const productoConsultaId = process.env.REACT_APP_PRODUCTO_CONSULTA_ID;

export const esquemassCatalogoId = process.env.REACT_APP_ESQUEMAS_CATALOGO_ID;
export const laserTratamientoId = process.env.REACT_APP_LASER_TRATAMIENTO_ID;

export const frecuenciaPrimeraVezObj = {
    _id: frecuenciaPrimeraVezId,
    nombre: "PRIMERA VEZ",
}

export const productoConsultaObj = {
    _id: productoConsultaId,
    nombre: "CONSULTAS",
}