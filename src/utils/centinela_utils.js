import {
  sucursalFederalismoId,
  sucursalManuelAcunaId,
  sucursalOccidentalId,
  sucursalRubenDarioId,
} from "./constants";

import {
  centinelaAlmaceMAId,
  centinelaAlmacenCDMPId,
  centinelaAlmacenFedeId,
  centinelaAlmacenOcciId,
  centinelaAlmacenRDId,
} from "./centinela_constants";


export const sucursalToAlmacen = (sucursalId) => {
  let almacen = centinelaAlmacenCDMPId;
  switch (sucursalId) {
    case sucursalOccidentalId:
      almacen = centinelaAlmacenOcciId;
      break;
    case sucursalFederalismoId:
      almacen = centinelaAlmacenFedeId;
      break;
    case sucursalManuelAcunaId:
      almacen = centinelaAlmaceMAId;
      break;
    case sucursalRubenDarioId:
      almacen = centinelaAlmacenRDId;
      break;
  }
  return almacen;
}
