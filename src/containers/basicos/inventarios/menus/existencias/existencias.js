import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import myStyles from '../../../../../css';
import TableComponent from '../../../../../components/table/TableComponent';

export const ExistenciasContainer = (props) => {

  const {
    empleado,
    titulo,
    columns,
    productos,
    sucursal,
    actions,
    components,
    options,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      
      <Grid container>
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
