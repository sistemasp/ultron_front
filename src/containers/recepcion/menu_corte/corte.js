import React, { Fragment } from 'react';

import TableComponent from '../../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalNuevoEntrada from '../../../components/modales/modal_nuevo_entrada';
import ModalNuevoSalida from '../../../components/modales/modal_nuevo_salida';
import ModalImprimirCorte from '../../../components/modales/imprimir/corte';
import { toFormatterCurrency } from '../../../utils/utils';

export const CorteContainer = (props) => {

  const {
    tituloEntrada,
    tituloSalida,
    tituloPagoAnticipado,
    columnsEntrada,
    columnsSalida,
    dataEntradas,
    dataPagosAnticipados,
    dataSalidas,
    options,
    openModal,
    handleOpen,
    handleClose,
    handleClickGuardar,
    turno,
    onCambioTurno,
    onObtenerInformacion,
    onGenerarCorte,
    openModalNuevoEntrada,
    openModalNuevoSalida,
    openModalImprimir,
    handleOpenImprimir,
    handleOpenNuevoEntrada,
    handleOpenNuevoSalida,
    turnoActual,
    sucursal,
    empleado,
    setOpenAlert,
    setMessage,
    setSeverity,
    detailPanelEntrada,
    detailPanelSalida,
    handleCerrarCorte,
    corte,
    colorBase,
  } = props;

  const useStyles = makeStyles(theme => ({
    button: {
      background: colorBase,
      color: '#FFFFFF',
      width: '100%',
      fontSize: '32px',
    },
    label_positivo: {
      color: '#42C58F',
      fontSize: '45px',
    },
    label_negativo: {
      color: '#E13838',
      fontSize: '45px',
    },
  }));

  const classes = useStyles();

  let totalEntradas = 0;
  let totalSalidas = 0;
  let totalEfectivo = 0;

  const newEntradas = [...dataEntradas, ...dataPagosAnticipados];

  newEntradas.forEach(data => {
    if (data.forma_pago === 'EFECTIVO') {
      totalEfectivo = data.total;
    }
    totalEntradas += data.forma_pago !== 'NO PAGA' ? Number(data.total) : 0;
  });

  dataSalidas.forEach(data => {
    totalSalidas += Number(data.total);
  });

  return (
    <Fragment>
      {
        openModalNuevoEntrada ?
          <ModalNuevoEntrada
            open={openModalNuevoEntrada}
            onClose={handleClose}
            handleClickGuardar={handleClickGuardar}
            sucursal={sucursal}
            empleado={empleado}
            corte={corte}
            onObtenerInformacion={turnoActual}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            colorBase={colorBase}
            setSeverity={setSeverity} /> : ''
      }

      {
        openModalNuevoSalida ?
          <ModalNuevoSalida
            open={openModalNuevoSalida}
            onClose={handleClose}
            handleClickGuardar={handleClickGuardar}
            sucursal={sucursal}
            empleado={empleado}
            corte={corte}
            onObtenerInformacion={turnoActual}
            setOpenAlert={setOpenAlert}
            colorBase={colorBase}
            setMessage={setMessage}
            setSeverity={setSeverity} /> : ''
      }

      {
        openModalImprimir ?
          <ModalImprimirCorte
            open={openModalImprimir}
            onClose={handleClose}
            corte={corte}
            sucursal={sucursal}
            empleado={empleado}
            dataEntradas={newEntradas}
            dataPagosAnticipados={dataPagosAnticipados}
            dataSalidas={dataSalidas}
            setOpenAlert={setOpenAlert}
            colorBase={colorBase}
            setMessage={setMessage}
            setSeverity={setSeverity} /> : ''
      }

      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.label}>
          <h2 className={classes.labelItemCenter}>CORTE DEL TURNO: {turno === 'm' ? 'MATUTINO' : 'VESPERTINO'}</h2>
        </Grid>
        <Grid item xs={4} className={classes.label}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={onCambioTurno}
            text='CAMBIO TURNO' />
        </Grid>
        <Grid item xs={4} className={classes.label}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={() => onObtenerInformacion(turno)}
            text='TRAER INFORMACIÓN' />
        </Grid>
        <Grid item xs={4} className={classes.label}>
          {
            corte.hora_cierre ?
              corte.generado ?
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={handleOpenImprimir}
                  text='IMPRIMIR' />
                :
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={onGenerarCorte}
                  text='GENERAR' />
              :
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={handleCerrarCorte}
                text='CERRAR CORTE' />
          }
        </Grid>
        <Grid item xs={12} sm={8}>
          <TableComponent
            titulo={tituloEntrada}
            columns={columnsEntrada}
            data={newEntradas}
            options={options}
            detailPanel={detailPanelEntrada} />
        </Grid>
        <Grid container xs={4} className={classes.label} spacing={2}>
          {
            !corte.generado ?
              <Grid item xs={12} sm={12}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={handleOpenNuevoEntrada}
                  text='AGREGAR ENTRADA' />
              </Grid>
              : ''
          }
          <Grid item sm={12}>
            <h1>TOTAL ENTRADAS</h1>
          </Grid>
          <Grid item sm={12}>
            <h1>{toFormatterCurrency(totalEntradas)}</h1>
          </Grid>
        </Grid>
        {/* {
          dataPagosAnticipados.length > 0 ?
            <Grid item xs={12} sm={8}>
              <TableComponent
                titulo={tituloPagoAnticipado}
                columns={columnsEntrada}
                data={dataPagosAnticipados}
                options={options}
                detailPanel={detailPanelEntrada} />
            </Grid>
            : ''
        } */}
        <Grid item xs={12} sm={8}>
          <TableComponent
            titulo={tituloSalida}
            columns={columnsSalida}
            data={dataSalidas}
            options={options}
            detailPanel={detailPanelSalida} />
        </Grid>
        <Grid container xs={4} className={classes.label} spacing={2}>
          {
            !corte.generado ?
              <Grid item xs={12} sm={12}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={handleOpenNuevoSalida}
                  text='AGREGAR SALIDA' />
              </Grid>
              : ''
          }
          <Grid item sm={12}>
            <h1>TOTAL SALIDAS</h1>
          </Grid>
          <Grid item sm={12}>
            <h1>{toFormatterCurrency(totalSalidas)}</h1>
          </Grid>
        </Grid>
        <Grid item sm={8}>
          <h1 className={totalEfectivo > totalSalidas ? classes.label_positivo : classes.label_negativo} >TOTAL CORTE EFECTIVO: {toFormatterCurrency(Number(totalEfectivo) - Number(totalSalidas))}</h1>
        </Grid>

      </Grid>

    </Fragment>
  );
}
