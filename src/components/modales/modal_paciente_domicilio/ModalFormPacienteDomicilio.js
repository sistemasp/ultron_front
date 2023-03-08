import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import myStyles from '../../../css';
import { ButtonCustom } from '../../basic/ButtonCustom';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflow: 'scroll',
    height: '90%',
  };
}

const ModalFormPacienteDomicilio = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    touched,
    handleSubmit,
    onClickCancel,
    onChangeSelect,
    ocupaciones,
    estados,
    municipios,
    ciudades,
    colonias,
    open,
    onChange,
    onChangeEstado,
    onChangeMunicipio,
    onChangeColonia,
    onClickBuscar,
    onClickGuardar,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="nombres"
                  label="NOMBRES"
                  value={values.nombres}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="apellidos"
                  label="APELLIDOS"
                  value={values.apellidos}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="fecha_nacimiento"
                  label="FECHA DE NACIMIENTO"
                  value={values.fecha_nacimiento}
                  onChange={onChange}
                  inputProps={{
                    maxLength: "10",
                    placeholder: "dd/mm/aaaa"
                  }}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-ocupacion">OCUPACIÓN</InputLabel>
                  <Select
                    labelId="simple-select-outlined-ocupacion"
                    id="simple-select-outlined-ocupacion"
                    name="ocupacion"
                    value={values.ocupacion}
                    onChange={onChangeSelect}
                    label="OCUPACIÓN" >
                    {ocupaciones.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} >
                <TextField
                  className={classes.textField}
                  name="codigo_postal"
                  label="CÓDIGO POSTAL"
                  value={values.codigo_postal}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6} >
                <TextField
                  className={classes.textField}
                  name="telefono"
                  label="TELÉFONO"
                  value={values.telefono}
                  onChange={onChange}
                  inputProps={{
                    maxLength: "10",
                  }}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="email"
                  label="EMAIL"
                  value={values.email}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClickCancel}
                  text="CANCELAR" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickGuardar()}
                  text="GUARDAR" />
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div >
  );
}

export default ModalFormPacienteDomicilio;