import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import myStyles from '../../../../../css';
import TableComponent from '../../../../../components/table/TableComponent';
import { ButtonCustom } from '../../../../../components/basic/ButtonCustom';
import ModalFacturas from '../../../../../components/modales/inventarios/facturas';

export const FacturasContainer = (props) => {

  const {
    empleado,
    titulo,
    columns,
    facturas,
    open,
    handleClose,
    loadFacturas,
    factura,
    sucursal,
    actions,
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
          <ModalFacturas
            open={open}
            onClose={handleClose}
            sucursal={sucursal}
            colorBase={colorBase}
            loadFacturas={loadFacturas}
            factura={factura}
            empleado={empleado} /> : ''
      }
      <Grid container>
        <Grid item xs={12} sm={4}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpen}
            text='NUEVA FACTURA' />
        </Grid>
        <Grid item xs={12}>
          <TableComponent
            titulo={titulo}
            columns={columns}
            data={facturas}
            actions={actions}
            options={options}
            components={components} />
        </Grid>
      </Grid>
    </Fragment>
  );
}
