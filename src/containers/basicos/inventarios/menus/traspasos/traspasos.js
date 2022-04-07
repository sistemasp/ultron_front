import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import myStyles from '../../../../../css';
import TableComponent from '../../../../../components/table/TableComponent';
import { ButtonCustom } from '../../../../../components/basic/ButtonCustom';
import ModalFacturas from '../../../../../components/modales/inventarios/facturas';
import ModalTraspasos from '../../../../../components/modales/inventarios/traspasos';

export const TraspasosContainer = (props) => {

  const {
    empleado,
    tituloEnviados,
    tituloRecibidos,
    columns,
    facturas,
    open,
    handleClose,
    loadFacturas,
    factura,
    sucursal,
    actionsEnviados,
    actionsRecibidos,
    components,
    options,
    handleOpen,
    colorBase,
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
            loadProductos={loadFacturas}
            factura={factura}
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
            columns={columns}
            data={facturas}
            actions={actionsRecibidos}
            options={options}
            components={components} />
        </Grid>
        <Grid item xs={6}>
          <TableComponent
            titulo={tituloEnviados}
            columns={columns}
            data={facturas}
            actions={actionsEnviados}
            options={options}
            components={components} />
        </Grid>

      </Grid>
    </Fragment>
  );
}
