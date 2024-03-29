import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Grid, IconButton, InputAdornment, OutlinedInput, InputLabel, FormControl, MenuItem, Select, TextField } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { ButtonCustom } from '../../basic/ButtonCustom';
import ModalConfirmacion from '../modal_confirmacion';
import myStyles from '../../../css';

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
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#FFFFFF',
  },
}));

const ModalFormNuevoSalida = (props) => {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    onClickCancel,
    onClickGuardar,
    open,
    dataComplete,
    onChangeTipoSalida,
    tipoSalidas,
    onChange,
    onAgregarSalida,
    empleado,
    previousTipoSalida,
    openModalConfirmacion,
    onCloseModalConfirmacion,
    onConfirmModalConfirmacion,
    setMessage,
    setSeverity,
    setOpenAlert,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open} >
      <div style={modalStyle} className={classes.paper}>
        {
          openModalConfirmacion ?
            <ModalConfirmacion
              open={openModalConfirmacion}
              onClose={onCloseModalConfirmacion}
              onConfirm={onConfirmModalConfirmacion}
              empleado={empleado}
              status={values.status}
              setMessage={setMessage}
              setSeverity={setSeverity}
              setOpenAlert={setOpenAlert} />
            : ''
        }
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h2>AGREGAR SALIDA</h2>
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              name="concepto"
              label="CONCEPTO"
              value={values.concepto}
              onChange={onChange}
              variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              name="descripcion"
              label="DESCRIPCIÓN"
              value={values.descripcion}
              onChange={onChange}
              variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              name="cantidad"
              label="CANTIDAD"
              value={values.cantidad}
              type='Number'
              onInput={(e) => {
                e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 7)
              }}
              onChange={onChange}
              variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-hora">TIPO SALIDA</InputLabel>
              <Select
                labelId="simple-select-outlined-tipo-salida"
                id="simple-select-outlined-tipo-salida"
                value={values.tipo_salida}
                onChange={onChangeTipoSalida}
                label="TIPO SALIDA" >
                {tipoSalidas.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ButtonCustom
              className={classes.buttonCancel}
              color="secondary"
              variant="contained"
              onClick={onClickCancel}
              text='CANCELAR' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ButtonCustom
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={onAgregarSalida}
              disabled={dataComplete}
              text='AGREGAR' />
          </Grid>
        </Grid>
      </div>
    </Modal>

  );
}

export default ModalFormNuevoSalida;