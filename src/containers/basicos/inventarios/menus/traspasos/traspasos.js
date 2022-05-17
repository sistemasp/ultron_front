import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import myStyles from '../../../../../css';
import TableComponent from '../../../../../components/table/TableComponent';
import { ButtonCustom } from '../../../../../components/basic/ButtonCustom';
import ModalFacturas from '../../../../../components/modales/inventarios/facturas';
import ModalTraspasos from '../../../../../components/modales/inventarios/traspasos';
import ModalAsignarTraspasos from '../../../../../components/modales/inventarios/asignar_traspasos';
import ModalVerTraspasos from '../../../../../components/modales/inventarios/ver_traspasos';
import ModalRevisarTraspasos from '../../../../../components/modales/inventarios/revisar_traspasos';

export const TraspasosContainer = (props) => {

  const {
    empleado,
    tituloEnviados,
    tituloRecibidos,
    columnsEnviadas,
    columnsRecibidas,
    solicitudesEnviadas,
    solicitudesRecibidas,
    open,
    openVerTraspaso,
    openRevisarTraspaso,
    openAsignar,
    handleClose,
    loadSolicitudesEnviadas,
    loadSolicitudesRecibidas,
    traspaso,
    sucursal,
    almacen,
    actionsEnviados,
    actionsRecibidos,
    components,
    options,
    handleOpen,
    colorBase,
    setMessage,
    setSeverity,
    setOpenAlert,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      {
        open ?
          <ModalTraspasos
            open={open}
            onClose={handleClose}
            sucursal={sucursal}
            colorBase={colorBase}
            loadSolicitudesEnviadas={loadSolicitudesEnviadas}
            loadSolicitudesRecibidas={loadSolicitudesRecibidas}
            traspaso={traspaso}
            empleado={empleado} /> : ''
      }
       {
        openVerTraspaso ?
          <ModalVerTraspasos
            open={openVerTraspaso}
            onClose={handleClose}
            sucursal={sucursal}
            almacen={almacen}
            colorBase={colorBase}
            loadSolicitudesEnviadas={loadSolicitudesEnviadas}
            loadSolicitudesRecibidas={loadSolicitudesRecibidas}
            traspaso={traspaso}
            empleado={empleado} /> : ''
      }
      {
        openRevisarTraspaso ?
          <ModalRevisarTraspasos
            open={openRevisarTraspaso}
            onClose={handleClose}
            sucursal={sucursal}
            almacen={almacen}
            colorBase={colorBase}
            loadSolicitudesEnviadas={loadSolicitudesEnviadas}
            loadSolicitudesRecibidas={loadSolicitudesRecibidas}
            traspaso={traspaso}
            empleado={empleado} /> : ''
      }
      {
        openAsignar ?
          <ModalAsignarTraspasos
            open={openAsignar}
            onClose={handleClose}
            sucursal={sucursal}
            almacen={almacen}
            colorBase={colorBase}
            loadSolicitudesEnviadas={loadSolicitudesEnviadas}
            loadSolicitudesRecibidas={loadSolicitudesRecibidas}
            traspaso={traspaso}
            setMessage={setMessage}
            setSeverity={setSeverity}
            setOpenAlert={setOpenAlert}
            empleado={empleado} /> : ''
      }
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpen}
            text='GENERAR SOLICITUD DE TRASPASO' />
        </Grid>
        <Grid item xs={6}>
          <br />
        </Grid>
        <Grid item xs={6}>
          <TableComponent
            titulo={tituloRecibidos}
            columns={columnsRecibidas}
            data={solicitudesRecibidas}
            actions={actionsRecibidos}
            options={options} />
        </Grid>
        <Grid item xs={6}>
          <TableComponent
            titulo={tituloEnviados}
            columns={columnsEnviadas}
            data={solicitudesEnviadas}
            actions={actionsEnviados}
            options={options} />
        </Grid>

      </Grid>
    </Fragment>
  );
}
