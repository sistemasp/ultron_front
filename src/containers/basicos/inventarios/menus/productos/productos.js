import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import myStyles from '../../../../../css';
import TableComponent from '../../../../../components/table/TableComponent';
import { ButtonCustom } from '../../../../../components/basic/ButtonCustom';
import ModalProductos from '../../../../../components/modales/inventarios/productos';

export const ProductosContainer = (props) => {

  const {
    empleado,
    titulo,
    columns,
    productos,
    producto,
    sucursal,
    actions,
    loadProductos,
    components,
    options,
    open,
    handleClose,
    colorBase,
    handleOpen,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      {
        open ?
          <ModalProductos
            open={open}
            onClose={handleClose}
            sucursal={sucursal}
            colorBase={colorBase}
            loadProductos={loadProductos}
            producto={producto}
            empleado={empleado} /> : ''
      }
      <Grid container>
        <Grid item xs={12} sm={4}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpen}
            text='NUEVO PRODUCTO' />
        </Grid>
        <Grid item xs={12}>
          <TableComponent
            titulo={titulo}
            columns={columns}
            data={productos}
            actions={actions}
            options={options}
            components={components} />
        </Grid>
      </Grid>
    </Fragment>
  );
}
