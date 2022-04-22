import { 
  centinelaAlmaceMAId,
  centinelaAlmacenCDMPId,
  centinelaAlmacenFedeId,
  centinelaAlmacenOcciId,
  centinelaAlmacenRDId,
  sucursalFederalismoId,
  sucursalManuelAcunaId,
  sucursalOccidentalId,
  sucursalRubenDarioId,
} from "./constants";


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
