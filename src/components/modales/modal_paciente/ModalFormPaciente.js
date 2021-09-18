import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ButtonCustom } from '../../basic/ButtonCustom';
import myStyles from '../../../css';
import { CheckCustom } from '../../basic/CheckCustom';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const ModalFormPaciente = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    handleSubmit,
    onChange,
    onChangeSexo,
    onChangeEmail,
    onChangeFamiliar,
    dataComplete,
    onClickCancel,
    onClickGuardar,
    onClickcConsulta,
    open,
    sexos,
    colorBase,
    sucursal,
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
              <Grid item xs={12} sm={12} className={classes.grid_center}>
                <CheckCustom
                  checked={values.familiar}
                  onChange={onChangeFamiliar}
                  name="checkedF"
                  label="ES FAMILIAR"
                />
              </Grid>
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
              {/*
              <Grid item xs={12}>
                <TextField
                className={classes.textField}
                name="domicilio"
                helperText={touched.domicilio ? errors.domicilio : ""}
                error={Boolean(errors.domicilio)}
                label="Direccion"
                value={values.domicilio}
                onChange={handleChange}
                variant="outlined" />
              </Grid>
              */}
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="telefono"
                  label="TELÉFONO"
                  value={values.telefono}
                  onChange={onChange}
                  inputProps={{
                    maxLength: "10",
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="email"
                  label="EMAIL"
                  value={values.email}
                  onChange={onChangeEmail}
                  variant="outlined"
                />
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
                  <InputLabel id="simple-select-outlined-hora">SEXO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-dermatologo"
                    id="simple-select-outlined-dermatologo"
                    value={values.sexo}
                    onChange={onChangeSexo}
                    name="sexo"
                    label="SEXO" >
                    {sexos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
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
                  disabled={dataComplete}
                  onClick={(e) => onClickGuardar(e, values)}
                  text='GUARDAR' />
              </Grid>
              { sucursal._id === process.env.REACT_APP_SUCURSAL_OCCI_ID ||
                sucursal._id === process.env.REACT_APP_SUCURSAL_FEDE_ID ?
                <Grid item xs={12} sm={6}>
                  <ButtonCustom
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    disabled={dataComplete}
                    onClick={(e) => onClickcConsulta(e, values)}
                    text='CONSULTA' />
                </Grid>
                : ''
              }

            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormPaciente;