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
  const classes = myStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    touched,
    handleSubmit,
    onClickCancel,
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
  } = props;

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
                <TextField
                  className={classes.textField}
                  name="domicilio"
                  label="DOMICILIO"
                  value={values.domicilio}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.textField}
                  name="numero_exterior"
                  label="NUMERO EXTERIOR"
                  value={values.numero_exterior}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.textField}
                  name="numero_interior"
                  label="NUMERO INTERIOR"
                  value={values.numero_interior}
                  onChange={onChange}
                  variant="outlined" />
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
              <Grid item xs={12} sm={6} className={classes.grid_center}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={onClickBuscar}
                  text="BUSCAR" />
              </Grid>

              {
                values.codigo_postal ?
                  <Fragment>
                    <Grid item xs={12}>
                      <h3 className={classes.label}>ESTADO: {values.estado}</h3>
                    </Grid>
                    <Grid item xs={12}>
                      <h3 className={classes.label}>MUNICIPIO: {values.municipio}</h3>
                    </Grid>
                    <Grid item xs={12}>
                      <h3 className={classes.label}>CIUDAD: {values.ciudad}</h3>
                    </Grid>
                  </Fragment> :
                  <Fragment>
                    <Grid item xs={12}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-estados">ESTADOS</InputLabel>
                        <Select
                          labelId="simple-select-outlined-estados"
                          id="simple-select-outlined-estados"
                          value={values.estado}
                          onChange={onChangeEstado}
                          isSearchable={true}
                          label="ESTADOS" >
                          {estados.sort().map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-municipio">MUNICIPIO</InputLabel>
                        <Select
                          labelId="simple-select-outlined-municipio"
                          id="simple-select-outlined-municipio"
                          value={values.municipio}
                          onChange={onChangeMunicipio}
                          label="MUNICIPIO" >
                          {municipios.sort().map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        className={classes.textField}
                        name="ciudad"
                        label="CIUDAD"
                        value={values.ciudad}
                        onChange={onChange}
                        variant="outlined" />
                    </Grid>
                  </Fragment>
              }

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-colonia">COLONIA</InputLabel>
                  <Select
                    labelId="simple-select-outlined-colonia"
                    id="simple-select-outlined-colonia"
                    value={values.colonia}
                    onChange={onChangeColonia}
                    label="COLONIA" >
                    {colonias.sort().map((item, index) => <MenuItem key={index} value={item}>{item.toUpperCase()}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
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
                  color="primary"
                  variant="contained"
                  onClick={() => onClickGuardar()}
                  text="GUARDAD" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClickCancel}
                  text="CANCELAR" />
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div >
  );
}

export default ModalFormPacienteDomicilio;