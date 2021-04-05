import React, { Fragment } from 'react';
import TableComponent from '../../../components/table/TableComponent';
import { Grid, makeStyles } from '@material-ui/core';
import ModalPaciente from '../../../components/modales/modal_paciente';
import MenuHistoricos from '../../../components/modales/modal_historico';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import { baseUrl } from '../../../services';
import myStyles from '../../../css';

export const PacientesContainer = (props) => {

  const classes = myStyles();

  const {
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
    onClickGuardar,
    onClickGuardarAgendar
  } = props;

  const pacientes = query =>
    new Promise((resolve, reject) => {
      const url = `${baseUrl}/paciente/remote?per_page=${query.pageSize}&page=${query.page + 1}&search=${query.search}`
      fetch(url)
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
        open ?
          <ModalPaciente
            open={open}
            onClose={handleClose}
            paciente={paciente}
            onClickGuardar={onClickGuardar}
            onClickGuardarAgendar={onClickGuardarAgendar} /> : ''
      }
      {
        openHistoric ?
          <MenuHistoricos
            open={openHistoric}
            onClose={handleClose}
            paciente={paciente} /> : ''
      }
      <Grid container>
        <Grid item xs={12} sm={4}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpen}
            text='NUEVO PACIENTE' />
        </Grid>
        <TableComponent
          titulo={titulo}
          columns={columns}
          data={pacientes}
          actions={actions}
          options={options}
          components={components} />
      </Grid>
    </Fragment>
  );
}
