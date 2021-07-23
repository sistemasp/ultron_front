import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Multiselect } from 'multiselect-react-dropdown';
import { ButtonCustom } from "../../basic/ButtonCustom";
import { CheckCustom } from '../../basic/CheckCustom';
import { toFormatterCurrency } from '../../../utils/utils';
import myStyles from '../../../css';

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

const FormPagosAnticipados = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    servicios,
    tratamientos,
    areas,
    bancos,
    isLoading,
    formasPago,
    tiposTarjeta,
    onClickCancel,
    onClickGuardar,
    onChangeServicio,
    onChangeTratamientos,
    onChangeAreas,
    onChangePaymentMethod,
    onChangeBank,
    onChangeCardType,
    onChangeCantidad,
    onChangeDescuento,
    onChangeConfirmado,
    onChangeObservaciones,
    onChangeDigitos,
    onChangePagoAnticipado,
    onChangDescuentoDermatologo,
    open,
    colorBase,
  } = props;

  console.log("KAOZ", tratamientos);

  const classes = myStyles(colorBase)();

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_95}>
          <form>
            <Grid container spacing={3}>

              <Grid item xs={3}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-payment">SERVICIO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-payment"
                    id="simple-select-outlined-payment"
                    value={values.servicio}
                    onChange={onChangeServicio}
                    disabled={isLoading}
                    label="SERVICIO" >
                    {servicios.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              {
                tratamientos.length > 0 ?
                  <Grid item xs={3}>
                    <Multiselect
                      options={tratamientos} // Options to display in the dropdown
                      displayValue="nombre" // Property name to display in the dropdown options
                      onSelect={(e) => onChangeTratamientos(e)} // Function will trigger on select event
                      onRemove={(e) => onChangeTratamientos(e)} // Function will trigger on remove event
                      placeholder={`TRATAMIENTOS`}
                      selectedValues={values.tratamientos} // Preselected value to persist in dropdown
                    />
                  </Grid> : ''
              }
              {/* {
                values.tratamientos.map(tratamientoValue => {
                  return <Grid item xs={3} sm={3}>
                    <Multiselect
                      options={tratamientoValue.areas} // Options to display in the dropdown
                      displayValue="nombre" // Property name to display in the dropdown options
                      onSelect={(e) => onChangeAreas(e, tratamientoValue)} // Function will trigger on select event
                      onRemove={(e) => onChangeAreas(e, tratamientoValue)} // Function will trigger on remove event
                      placeholder={`ÁREAS ${tratamientoValue.nombre}`}
                      selectedValues={tratamientoValue.areasSeleccionadas} // Preselected value to persist in dropdown
                    />
                  </Grid>
                })
              } */}

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-payment">FORMA DE PAGO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-payment"
                    id="simple-select-outlined-payment"
                    value={values.forma_pago}
                    onChange={onChangePaymentMethod}
                    disabled={isLoading}
                    label="FORMA DE PAGO" >
                    {formasPago.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              {
                values.forma_pago !== process.env.REACT_APP_FORMA_PAGO_EFECTIVO &&
                  values.forma_pago !== process.env.REACT_APP_FORMA_PAGO_NO_PAGA &&
                  values.forma_pago !== '' ?
                  <Fragment>

                    <Grid item xs={12}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-banks">BANCOS</InputLabel>
                        <Select
                          labelId="simple-select-outlined-banks"
                          id="simple-select-outlined-banks"
                          value={values.banco}
                          onChange={onChangeBank}
                          label="BANCOS" >
                          {bancos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-card-type">TIPO TARJETA</InputLabel>
                        <Select
                          labelId="simple-select-outlined-card-type"
                          id="simple-select-outlined-card-type"
                          value={values.tipoTarjeta}
                          onChange={onChangeCardType}
                          label="TIPO TARJETA" >
                          {tiposTarjeta.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        className={classes.textField}
                        name="digitos"
                        //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                        label="DÍGITOS"
                        value={values.digitos}
                        onInput={(e) => {
                          e.target.value = (e.target.value).toString().slice(0, 4)
                        }}
                        onChange={onChangeDigitos}
                        variant="outlined" />
                    </Grid>
                  </Fragment> : ''
              }

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="cantidad"
                  //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                  label="CANTIDAD A COBRAR"
                  value={values.cantidad}
                  onChange={onChangeCantidad}
                  type='Number'
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 7)
                  }}
                  variant="outlined" />
              </Grid>
              {/*
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="porcentaje_descuento_clinica"
                  error={Boolean(errors.porcentaje_descuento_clinica)}
                  label="% DESCUENTO"
                  value={values.porcentaje_descuento_clinica}
                  onChange={onChangeDescuento}
                  type='Number'

                  onInput={(e) => {
                    e.target.value = e.target.value > 100 ? 100 : e.target.value;
                    e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 5)
                  }}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <CheckCustom
                  checked={values.has_descuento_dermatologo}
                  onChange={onChangDescuentoDermatologo}
                  name="checkedC"
                  label="DESCUENTO DERMATÓLOGO" />
              </Grid>

              <Grid item xs={12}>
                <h3 className={classes.label}>{`${values.porcentaje_descuento_clinica}% DESCUENTO CLINICA: ${toFormatterCurrency(values.descuento_clinica)}`}</h3>
              </Grid>

              <Grid item xs={12}>
                <h3 className={classes.label}>{`DESCUENTO DERMATÓLOGO: ${toFormatterCurrency(values.descuento_dermatologo)}`}</h3>
              </Grid>
                */}
              <Grid item xs={12}>
                <h2 className={classes.label}>{`TOTAL: ${toFormatterCurrency(values.total)}`}</h2>
              </Grid>

              {
                values.forma_pago !== process.env.REACT_APP_FORMA_PAGO_EFECTIVO &&
                  values.forma_pago !== process.env.REACT_APP_FORMA_PAGO_NO_PAGA &&
                  values.forma_pago !== '' ?
                  <Grid item xs={6}>
                    <CheckCustom
                      checked={values.confirmado}
                      onChange={onChangeConfirmado}
                      name="checkedC"
                      label="PAGO CONFIRMADO"
                    />
                  </Grid> : ''
              }

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="observaciones"
                  //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                  label="OBSERVACIONES"
                  value={values.observaciones}
                  onChange={onChangeObservaciones}
                  variant="outlined" />
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
                  onClick={(e) => onClickGuardar(e, values)}
                  disabled={isLoading}
                  text='GUARDAR' />
              </Grid>
              {/*
                <Grid item xs={12}>
                  <CheckCustom
                    checked={values.pago_anticipado}
                    onChange={onChangePagoAnticipado}
                    name="checkedC"
                    label="PAGO ANTICIPADO" />
              </Grid>
              */}
            </Grid>

          </form>
        </div>
      </Modal>
    </div>
  );
}

export default FormPagosAnticipados;