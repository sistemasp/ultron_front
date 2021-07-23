import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Grid } from '@material-ui/core';

import TableComponent from '../../../table/TableComponent';
import myStyles from '../../../../css';
import { ButtonCustom } from '../../../basic/ButtonCustom';
import AgregarPagosAnticipados from '../../agregar_pagos_anticipados';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '95%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    width: '100%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  button: {
    width: '100%',
  }
}));

const SesionesAnticipadas = (props) => {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    historial,
    titulo,
    columns,
    options,
    colorBase,
    sucursal,
    onClickAgregarPagos,
    openModalAgregarSesionesAnticipadas,
    onClickAgregarSesionesAnticipadas,
    onCerrarAgregarSesionesAnticipadas,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      {
        openModalAgregarSesionesAnticipadas ?
          <AgregarPagosAnticipados
            open={openModalAgregarSesionesAnticipadas}
            sucursal={sucursal}
            onClose={onCerrarAgregarSesionesAnticipadas}
            colorBase={colorBase} />
          : ''
      }
      <Grid item xs={12} sm={12}>
        <ButtonCustom
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={onClickAgregarSesionesAnticipadas}
          text='AGREGAR PAGOS ANTICIPADOS' />
      </Grid>
      <TableComponent
        titulo={titulo}
        columns={columns}
        data={historial}
        options={options} />
    </Fragment>
  );
}

export default SesionesAnticipadas;