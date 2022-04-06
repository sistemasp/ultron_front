import { sucursalFederalismoId, sucursalOccidentalId, tipoCitaDerivado, tipoCitaDirecto, tipoCitaRealizado, tipoCitaRevisado } from "./constants";

const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;

export const toFormatterCurrency = (value) => {
  const formatterDolar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  return formatterDolar.format(value);
}

export const addZero = (value) => {
  return value < 10 ? '0' + value : value;
}

export const getToken = (empleado) => {
  return empleado.access_token;
}

export const exportTableToExcel = (tableID, filename = '') => {
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

  // Specify file name
  filename = filename ? filename + '.xls' : 'excel_data.xls';

  // Create download link element
  downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob(['ufeff', tableHTML], {
      type: dataType
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();
  }
}

export const generateFolio = (servicio) => {
  const date = new Date(servicio.fecha_hora);
  const cons = servicio.consecutivo;
  /*const consecutivo =  cons ? 
  (
      cons < 10 ? '00' + cons : 
          (
              cons < 100 ?  '0' + cons : cons
          ) 
  ) : 
  'S/C';*/

  //const turno = date.getUTCHours() >= (date.getDay() === 6 ? 13 : 14) ? 'TV' : 'TM';

  //const folio = `${cita.sucursal.clave}${cita.servicio ? cita.servicio.clave : 'CON'}${date.getFullYear()}${addZero(date.getMonth() + 1)}${addZero(date.getDate())}${turno}${consecutivo}`;
  //return folio;
  return cons;
}

export const dateToString = (date) => {
  const parseDate = new Date(date);
  return `${addZero(parseDate.getDate())}/${addZero(parseDate.getMonth() + 1)}/${parseDate.getFullYear()}`;
}

export const culcularEdad = (fecha_nacimiento) => {
  const today = new Date();

  const fechaNacimiento = fecha_nacimiento.split('/');
  const anioNacimiento = Number(fechaNacimiento[2]);
  const mesNacimiento = Number(fechaNacimiento[1]);
  const diaNacimiento = Number(fechaNacimiento[0]);

  const edad = (today.getFullYear() - anioNacimiento) - (mesNacimiento >= (today.getMonth() + 1) ? 1 : 0);

  return edad;
}

export const optionSelect = (items) => {
  return items.map(item => {
    item = {
      ...item,
      value: item._id,
      label: item.nombre,
    };
    return item;
  });
}

export const optionSelect2 = (items) => {
  return items.map(item => {
    item = {
      ...item,
      value: item._id,
      name: item.nombre,
    };
    return item;
  });
}

export const redondearDecimales = (value) => {
  const porcentaje = value + '';
  if (porcentaje.includes(".")) {
    return porcentaje.substr(0, (porcentaje.indexOf(".") + 3));
  } else {
    return porcentaje;
  }
}

export const precioAreaBySucursal = (sucursalId, area) => {
  const itemPrecio =
    sucursalId === sucursalManuelAcunaId ? area.precio_ma // PRECIO MANUEL ACUÑA
      : (sucursalId === sucursalOcciId ? area.precio_oc // PRECIO OCCIDENTAL
        : (sucursalId === sucursalFedeId ? area.precio_fe // PRECIO FEDERALISMO
          : (sucursalId === sucursalRubenDarioId ? area.precio_rd // PRECIO RUBEN DARIO
            : 0))); // ERROR
  return itemPrecio;
}

export const comisionAreaBySucursalAndTipo = (sucursalId, tipoId, area) => {
  let comision = 0;
  switch (tipoId) {
    case tipoCitaRevisado:
      comision = sucursalId === sucursalManuelAcunaId ? area.comision_revisado_ma
        : (sucursalId === sucursalRubenDarioId ? area.comision_revisado_rd
          : (
            area.comision_revisado
          ));
      break;
    case tipoCitaDerivado:
      comision = sucursalId === sucursalManuelAcunaId ? area.comision_derivado_ma
        : (sucursalId === sucursalRubenDarioId ? area.comision_derivado_rd
          : (
            area.comision_derivado
          ));

      break;
    case tipoCitaRealizado:
      comision = sucursalId === sucursalManuelAcunaId ? area.comision_realizado_ma
        : (sucursalId === sucursalRubenDarioId ? area.comision_realizado_rd
          : (
            area.comision_realizado
          ));
      break;
    case tipoCitaDirecto:
      comision = sucursalId === sucursalManuelAcunaId ? area.precio_ma
        : (sucursalId === sucursalRubenDarioId ? area.precio_rd
          : (
            area.precio_oc
          ));
      break;
  }

  return comision;
}

export const productoMaximoSucursal = (producto, sucursalId) => {
  let maximo = 0;
  switch (sucursalId) {
    case sucursalOccidentalId:
      maximo = producto.maximo_oc;
      break;
    case sucursalFederalismoId:
      maximo = producto.maximo_fe;
      break;
    case sucursalManuelAcunaId:
      maximo = producto.maximo_ma;
      break;
    case sucursalRubenDarioId:
      maximo = producto.maximo_rd;
      break;
  }
  return maximo;
}

export const productoMinimoSucursal = (producto, sucursalId) => {
  let minimo = 0;
  switch (sucursalId) {
    case sucursalOccidentalId:
      minimo = producto.minimo_oc;
      break;
    case sucursalFederalismoId:
      minimo = producto.minimo_fe;
      break;
    case sucursalManuelAcunaId:
      minimo = producto.minimo_ma;
      break;
    case sucursalRubenDarioId:
      minimo = producto.minimo_rd;
      break;
  }
  return minimo;
}