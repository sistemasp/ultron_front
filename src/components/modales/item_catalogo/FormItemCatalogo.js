import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ButtonCustom } from '../../basic/ButtonCustom';
import myStyles from '../../../css';
import { CheckCustom } from '../../basic/CheckCustom';
import { Fragment } from 'react';
import { ComboCustom } from '../../basic/ComboCustom';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const FormItemCatalogo = (props) => {

  const dermatologosCatalogoId = process.env.REACT_APP_DERMATOLOGOS_CATALOGO_ID;

  const {
    handleSubmit,
    values,
    onChange,
    onChangeSelect,
    onChangeDate,
    booleanObjects,
    onChangeCombo,
    onGuardarItem,
    onClickCancel,
    open,
    catalogo,
    colorBase,
    //COLLECTIONS
    laboratorios,
    esquemas,
  } = props;

  const classes = myStyles(colorBase)();

  const getOptions = (collection) => {
    switch (collection) {
      case 'esquemas':
        return esquemas
      case 'laboratorios':
        return laboratorios;
    }
  }

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div className={classes.paper_95}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.label}>
                <h1 className={classes.label}>{`${catalogo.nombre}`}</h1>
              </Grid>

              {

                catalogo.columns.map(column => {
                  switch (column.type) {
                    case 'text':
                      return <Fragment>
                        <Grid item xs={12}>
                          <TextField
                            className={classes.textField}
                            name={column.field}
                            label={column.title}
                            value={values[column.field]}
                            onChange={onChange}
                            variant="outlined" />
                        </Grid>

                      </Fragment>
                    case 'bool':
                      return <Fragment>
                        <Grid item xs={6}>
                          <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="simple-select-outlined">{column.title}</InputLabel>
                            <Select
                              labelId={column.field}
                              id={column.field}
                              name={column.field}
                              value={values[column.field]}
                              onChange={onChangeSelect}
                              label={column.title} >
                              {booleanObjects.sort().map((item, index) => <MenuItem key={index} value={item.value}>{item.descripcion}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Fragment>
                    case 'text_date':
                      return <Fragment>
                        <Grid item xs={12}>
                          <TextField
                            className={classes.textField}
                            name={column.field}
                            label={column.title}
                            value={values[column.field]}
                            onChange={onChange}
                            inputProps={{
                              maxLength: "10",
                              placeholder: "dd/mm/aaaa"
                            }}
                            variant="outlined" />
                        </Grid>
                      </Fragment>
                    case 'date':
                      return <Fragment>
                        <Grid item xs={6}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid
                              container
                              justify="center"
                              alignItems="center" >
                              <KeyboardDatePicker
                                className={classes.formControl}
                                autoOk
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label={column.title}
                                value={values[column.field]}
                                onChange={(date, show) =>onChangeDate(date, show, column.field)}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                                invalidDateMessage='SELECCIONA UNA FECHA' />
                            </Grid>
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Fragment>
                    case 'autocomplete':
                      return <Fragment>
                        <Grid item xs={12}>
                          <FormControl variant="outlined" className={classes.margin, classes.textField}>
                            <ComboCustom
                              label={column.title}
                              name={column.value}
                              value={values[column.value]}
                              onChange={onChangeCombo}
                              options={getOptions(column.collection)} />
                          </FormControl>
                        </Grid>

                      </Fragment>
                    case 'porcentaje':
                      return <Fragment>
                        <Grid item xs={12}>
                          <TextField
                            className={classes.textField}
                            name={column.field}
                            label={column.title}
                            value={values[column.field]}
                            onChange={onChange}
                            type='Number'
                            onInput={(e) => {
                              e.target.value = e.target.value > 100 ? 100 : e.target.value;
                              e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 3)
                            }}
                            variant="outlined" />
                        </Grid>

                      </Fragment>
                  }

                })
              }
              {/* <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="nombre"
                  label="NOMBRE"
                  value={values.nombre}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              {
                catalogo._id === dermatologosCatalogoId ?
                  <Fragment>
                    <h2>DERMA</h2>
                  </Fragment>
                  : ''
              }

              {
                catalogo.columns.filter(column => column.title === 'LABORATORIO').length > 0 ?
                  <Grid item xs={12}>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-hora">LABORATORIO</InputLabel>
                      <Select
                        labelId="simple-select-outlined-dermatologo"
                        id="simple-select-outlined-dermatologo"
                        value={values.laboratorio}
                        onChange={onChangeSelect}
                        name="laboratorio"
                        label="LABORATORIO" >
                        {laboratorios.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  : ''
              } */}

              <Grid item xs={12}>

              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
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
                  onClick={(e) => onGuardarItem(e, values)}
                  text='GUARDAR' />
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default FormItemCatalogo;