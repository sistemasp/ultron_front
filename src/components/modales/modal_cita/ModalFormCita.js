import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Multiselect } from 'multiselect-react-dropdown';
import ModalConfirmacion from '../modal_confirmacion';
import { ButtonCustom } from '../../basic/ButtonCustom';
import { toFormatterCurrency } from '../../../utils/utils';

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

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 500,
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
    color: '#FFFFFF',
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  }
}));

const canceloStatusId = process.env.REACT_APP_CANCELO_STATUS_ID;
const noAsistioStatusId = process.env.REACT_APP_NO_ASISTIO_STATUS_ID;
const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;

const ModalFormCita = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    errors,
    handleSubmit,
    onChangeTratamientos,
    onChangeAreas,
    onChangeFecha,
    onChangeHora,
    onChangeTiempo,
    onChangeTipoCita,
    onChangeStatus,
    onChangePromovendedor,
    onChangeCosmetologa,
    isValid,
    onClickCancel,
    onClickActualizarCita,
    open,
    tratamientos,
    areas,
    horarios,
    promovendedores,
    cosmetologas,
    doctores,
    tipoCitas,
    statements,
    onChangeSesion,
    onChangePrecio,
    onChangeMotivos,
    onChangeObservaciones,
    onChangeDermatologo,
    onChangeFrecuencia,
    onChangeMedio,
    onChangePaymentMethod,
    formasPago,
    medios,
    frecuencias,
    onCloseModalPagos,
    onGuardarModalPagos,
    cita,
    empleado,
    sucursal,
    openModalConfirmacion,
    onCloseModalConfirmacion,
    onConfirmModalConfirmacion,
    setMessage,
    setSeverity,
    setOpenAlert,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            {
              openModalConfirmacion ?
                <ModalConfirmacion
                  open={openModalConfirmacion}
                  onClose={onCloseModalConfirmacion}
                  onConfirm={onConfirmModalConfirmacion}
                  empleado={empleado}
                  servicio={cita}
                  status={values.status}
                  setMessage={setMessage}
                  setSeverity={setSeverity}
                  setOpenAlert={setOpenAlert} />
                : ''
            }
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h1 className={classes.label}>{values.servicio.nombre} {toFormatterCurrency(values.precio)}</h1>
              </Grid>
              <Grid item xs={12}>
                <h2 className={classes.label}>{values.fecha_actual} - {values.hora_actual} HRS</h2>
              </Grid>
              <Grid item xs={12}>
                <h2 className={classes.label}>{values.paciente_nombre}</h2>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-statements">STATUS</InputLabel>
                  <Select
                    labelId="simple-select-outlined-statements"
                    id="simple-select-outlined-statements"
                    value={values.status}
                    error={Boolean(errors.statements)}
                    onChange={onChangeStatus}
                    label="STATUS" >
                    {statements.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-frecuencia">FRECUENCIA</InputLabel>
                  <Select
                    labelId="simple-select-outlined-frecuencia"
                    id="simple-select-outlined-frecuencia"
                    value={values.frecuencia}
                    onChange={onChangeFrecuencia}
                    label="FRECUENCIA" >
                    {frecuencias.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              {
                values.status === reagendoStatusId ?
                  <Fragment>
                    <Grid item xs={12} sm={6}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          disablePast
                          autoOk
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="FECHA"
                          value={values.nueva_fecha_hora}
                          onChange={onChangeFecha}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                          invalidDateMessage='Selecciona una fecha' />
                      </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-hora">HORA</InputLabel>
                        <Select
                          labelId="simple-select-outlined-hora"
                          id="simple-select-outlined-hora"
                          value={values.hora}
                          error={Boolean(errors.hora)}
                          disabled={!values.nueva_fecha_hora}
                          onChange={onChangeHora}
                          label="HORA" >
                          {horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Fragment>
                  : ''
              }

              {
                values.status === canceloStatusId || values.status === noAsistioStatusId || values.status === reagendoStatusId ?
                  <Grid item xs={12}>
                    <TextField
                      className={classes.textField}
                      name="motivos"
                      //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                      error={Boolean(errors.motivos)}
                      label="MOTIVOS"
                      value={values.motivos}
                      onChange={onChangeMotivos}
                      variant="outlined" />
                  </Grid> : ''
              }
              <Grid item xs={12}>
                <h2 className={classes.label}>{`TIPO: ${values.tipo_cita.nombre}`}</h2>
              </Grid>
              <Grid item xs={12}>
                <Multiselect
                  options={tratamientos} // Options to display in the dropdown
                  displayValue="nombre" // Property name to display in the dropdown options
                  onSelect={(e) => onChangeTratamientos(e)} // Function will trigger on select event
                  onRemove={(e) => onChangeTratamientos(e)} // Function will trigger on remove event
                  placeholder={`TRATAMIENTOS`}
                  selectedValues={values.tratamientos} // Preselected value to persist in dropdown
                />
              </Grid>
              {
                values.tratamientos.map(tratamientoValue => {
                  return <Grid item xs={12} sm={12}>
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
              }

              <Grid item xs={12}>
                {
                  /* values.dermatologo*/ false ?
                    <h3 className={classes.label}>DERMATÓLOGO (A): {values.dermatologo.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-hora">DERMATÓLOGO (A)</InputLabel>
                      <Select
                        labelId="simple-select-outlined-dermatologo"
                        id="simple-select-outlined-dermatologo"
                        value={values.dermatologo}
                        error={Boolean(errors.dermatologo)}
                        onChange={onChangeDermatologo}
                        label="DERMATÓLOGO (A)" >
                        {doctores.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-tipo-cita">MEDIO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-tipo-cita"
                    id="simple-select-outlined-tipo-cita"
                    value={values.medio}
                    onChange={onChangeMedio}
                    label="MEDIO" >
                    {medios.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {
                  /* values.promovendedor */ false ?
                    <h3 className={classes.label}>PROMOVENDEDOR (A): {values.promovendedor.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-promovendedor">PROMOVENDEDOR (A)</InputLabel>
                      <Select
                        labelId="simple-select-outlined-promovendedor"
                        id="simple-select-outlined-promovendedor"
                        value={values.promovendedor}
                        error={Boolean(errors.promovendedor)}
                        onChange={onChangePromovendedor}
                        label="PROMOVENDEDOR (A)" >
                        {promovendedores.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>

              <Grid item xs={12}>
                {
                  /* values.cosmetologa */ false ?
                    <h3 className={classes.label}>COSMETÓLOGA: {values.cosmetologa.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-cosmetologa">COSMETÓLOGA</InputLabel>
                      <Select
                        labelId="simple-select-outlined-cosmetologa"
                        id="simple-select-outlined-cosmetologa"
                        value={values.cosmetologa}
                        error={Boolean(errors.cosmetologa)}
                        onChange={onChangeCosmetologa}
                        label="COSMETÓLOGA" >
                        {cosmetologas.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-payment">FORMA DE PAGO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-payment"
                    id="simple-select-outlined-payment"
                    value={values.forma_pago}
                    onChange={onChangePaymentMethod}
                    label="FORMA DE PAGO" >
                    {formasPago.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="observaciones"
                  //helperText={touched.observaciones ? errors.observaciones : ""}
                  error={Boolean(errors.observaciones)}
                  label="OBSERVACIONES"
                  value={values.observaciones}
                  onChange={onChangeObservaciones}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="tiempo"
                  //helperText={touched.tiempo ? errors.tiempo : ""}
                  error={Boolean(errors.tiempo)}
                  label="TIEMPO (MINUTOS)"
                  value={values.tiempo}
                  type='Number'
                  onChange={onChangeTiempo}
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                  }}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  disabled={!isValid}
                  onClick={(e) => onClickActualizarCita(e, values)}
                  text='GUARDAR' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  disabled={!isValid}
                  onClick={onClickCancel}
                  text='CANCELAR' />
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormCita;