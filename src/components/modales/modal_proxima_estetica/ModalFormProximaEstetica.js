import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Multiselect } from 'multiselect-react-dropdown';
import { ButtonCustom } from '../../basic/ButtonCustom';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflow: 'scroll',
    height: '50%',
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 600,
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

const ModalFormProximaEstetica = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    handleSubmit,
    onChangeFecha,
    onChangeHora,
    onChangeMinutos,
    onClose,
    onClickProximarEstetica,
    open,
    onChangeTotal,
    onChangeObservaciones,
    onChangeDermatologo,
    cosmetologas,
    areas,
    onChangeTratamientos,
    onChangeAreas,
    onChangeTiempo,
    onChangeCosmetologa,
    onChangeProductos,
    onChangeMedio,
    medios,
    onChangePromovendedor,
    promovendedores,
    onChangePaymentMethod,
    formasPago,
    productos,
    dermatologos,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h2 className={classes.label}>{values.paciente_nombre} ({values.telefono})</h2>
              </Grid>
              <Grid item xs={12}>
                <Multiselect
                  options={productos} // Options to display in the dropdown
                  displayValue="nombre" // Property name to display in the dropdown options
                  onSelect={(e) => onChangeProductos(e)} // Function will trigger on select event
                  onRemove={(e) => onChangeProductos(e)} // Function will trigger on remove event
                  placeholder={`PRODUCTO`}
                  selectedValues={values.producto} // Preselected value to persist in dropdown
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-hora">DERMATÓLOGO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-dermatologo"
                    id="simple-select-outlined-dermatologo"
                    value={values.dermatologo}
                    onChange={onChangeDermatologo}
                    label="DERMATÓLOGO" >
                    {dermatologos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-tipo-dermapen">MEDIO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-tipo-dermapen"
                    id="simple-select-outlined-tipo-dermapen"
                    value={values.medio}
                    onChange={onChangeMedio}
                    label="MEDIO" >
                    {medios.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-promovendedor">PROMOVENDEDOR</InputLabel>
                  <Select
                    labelId="simple-select-outlined-promovendedor"
                    id="simple-select-outlined-promovendedor"
                    value={values.promovendedor}
                    onChange={onChangePromovendedor}
                    label="PROMOVENDEDOR" >
                    {promovendedores.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-cosmetologa">COSMETÓLOGA</InputLabel>
                  <Select
                    labelId="simple-select-outlined-cosmetologa"
                    id="simple-select-outlined-cosmetologa"
                    value={values.cosmetologa}
                    onChange={onChangeCosmetologa}
                    label="COSMETÓLOGA" >
                    {cosmetologas.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  label="OBSERVACIONES"
                  value={values.observaciones}
                  onChange={onChangeObservaciones}
                  variant="outlined" />
              </Grid>
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
                    value={values.fecha_hora}
                    onChange={onChangeFecha}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    invalidDateMessage='Selecciona una fecha' />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  className={classes.textField}
                  name="hora"
                  label="HORA"
                  value={values.hora}
                  type='Text'
                  onChange={onChangeHora}
                  onInput={(e) => {
                    e.target.value = e.target.value < 0 ? 0 : (e.target.value > 24 ? 24 : e.target.value);
                    e.target.value = (e.target.value).toString().slice(0, 2)
                  }}
                  variant="outlined" />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  className={classes.textField}
                  name="minutos"
                  label="MINUTOS"
                  value={values.minutos}
                  type='Text'
                  onChange={onChangeMinutos}
                  onInput={(e) => {
                    e.target.value = e.target.value < 0 ? 0 : (e.target.value > 60 ? 60 : e.target.value);
                    e.target.value = (e.target.value).toString().slice(0, 2)
                  }}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.textField}
                  name="total"
                  label="TOTAL CIRUGíA"
                  value={values.total}
                  type='Number'
                  onChange={onChangeTotal}
                  onInput={(e) => {
                    e.target.value = e.target.value < 0 ? 0 : e.target.value;
                    e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 6)
                  }}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClose}
                  text='CANCELAR' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickProximarEstetica(values)}
                  text='REAGENDAR' />
              </Grid>

            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormProximaEstetica;