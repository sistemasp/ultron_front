import React, { Fragment } from 'react';

import TableComponent from '../../../components/table/TableComponent';
import ModHistorico from '../../../components/modales/modal_historico';
import ModalImprimirPagoDermatologo from '../../../components/modales/imprimir/pago_dermatologo';
import ModalImprimirPagoPatologo from '../../../components/modales/imprimir/pago_patologo';

export const DermatologosContainer = (props) => {

  const {
    tituloDermatologos,
    tituloPatologos,
    columnsDermatologos,
    dermatologos,
    patologos,
    dermatologo,
    patologo,
    actionsDermatologo,
    optionsDermatologos,
    openPagoDermatologo,
    openPagoPatologo,
    columnsPatologos,
    actionsPatologos,
    optionsPatologos,
    openHistoric,
    handleClose,
    sucursal,
    empleado,
    colorBase,
  } = props;

  return (
    <Fragment>
      {
        openPagoDermatologo ?
          <ModalImprimirPagoDermatologo
            open={openPagoDermatologo}
            onClose={handleClose}
            dermatologo={dermatologo}
            sucursal={sucursal}
            colorBase={colorBase}
            empleado={empleado} /> : ''
      }
      {
        openPagoPatologo ?
          <ModalImprimirPagoPatologo
            open={openPagoPatologo}
            onClose={handleClose}
            patologo={patologo}
            colorBase={colorBase}
            sucursal={sucursal}
            empleado={empleado} /> : ''
      }
      {
        openHistoric ?
          <ModHistorico
            open={openHistoric}
            colorBase={colorBase}
            onClose={handleClose} /> : ''
      }

      <TableComponent
        titulo={tituloDermatologos}
        columns={columnsDermatologos}
        data={dermatologos}
        actions={actionsDermatologo}
        options={optionsDermatologos} />

      <TableComponent
        titulo={tituloPatologos}
        columns={columnsPatologos}
        data={patologos}
        actions={actionsPatologos}
        options={optionsPatologos} />

    </Fragment>
  );
}
