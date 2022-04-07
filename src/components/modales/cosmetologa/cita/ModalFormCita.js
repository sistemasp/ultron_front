import React, { Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { ButtonCustom } from '../../../basic/ButtonCustom';
import { toFormatterCurrency } from '../../../../utils/utils';
import myStyles from '../../../../css';
import { statusReagendoId } from '../../../../utils/constants';

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

const ModalFormCita = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    handleSubmit,
    onChangeTiempo,
    onChangeDisparos,
    onChangeQuienRealiza,
    onChangeFecha,
    onChangeHora,
    onChangeStatus,
    onClickCancel,
    onClickActualizarCita,
    open,
    horarios,
    cosmetologas,
    statements,
    onChangeObservaciones,
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
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h1 className={classes.label}>{values.servicio.nombre} {toFormatterCurrency(values.precio)}</h1>
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
                    onChange={onChangeStatus}
                    label="STATUS" >
                    {statements.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              {
                values.status === statusReagendoId ?
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
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-quien-realiza">QUIEN REALIZA</InputLabel>
                  <Select
                    labelId="simple-select-outlined-quien-realiza"
                    id="simple-select-outlined-quien-realiza"
                    value={values.quien_realiza}
                    onChange={onChangeQuienRealiza}
                    label="QUIEN REALIZA" >
                    {cosmetologas.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
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

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="tiempo"
                  label="TIEMPO (MINUTOS)"
                  value={values.tiempo}
                  type='Number'
                  onChange={onChangeTiempo}
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                  }}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="disparos"
                  label="DISPAROS (CANTIDAD)"
                  value={values.disparos}
                  type='Number'
                  onChange={onChangeDisparos}
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                  }}
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
                  onClick={(e) => onClickActualizarCita(e, values)}
                  text='GUARDAR' />
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormCita;