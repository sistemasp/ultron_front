import React, { Fragment } from 'react';
import TableComponent from '../../../components/table/TableComponent';
import { Grid, makeStyles } from '@material-ui/core';
import MenuHistoricos from '../../../components/modales/modal_historico';
import { baseUrl } from '../../../services';
import myStyles from '../../../css';

export const PacientesContainer = (props) => {

  const {
    empleado,
    titulo,
    columns,
    paciente,
    actions,
    components,
    options,
    open,
    openHistoric,
    handleOpen,
    handleClose,
  } = props;

  const pacientes = query =>
    new Promise((resolve, reject) => {
      const url = `${baseUrl}/paciente/remote?per_page=${query.pageSize}&page=${query.page + 1}&search=${query.search}`
      fetch(url, {
        headers: {
          Authorization: `Bearer ${empleado.access_token}`
        }
      })
        .then(response => response.json())
        .then(result => {
          resolve({
            data: result.data,
            page: result.page - 1,
            totalCount: result.total,
          })
        })
    });

  return (
    <Fragment>
      {
        openHistoric ?
          <MenuHistoricos
            open={openHistoric}
            empleado={empleado}
            onClose={handleClose}
            paciente={paciente} /> : ''
      }
      <Grid container>
        <Grid item xs={12}>
          <TableComponent
            titulo={titulo}
            columns={columns}
            data={pacientes}
            actions={actions}
            options={options}
            components={components} />
        </Grid>

      </Grid>
    </Fragment>
  );
}
