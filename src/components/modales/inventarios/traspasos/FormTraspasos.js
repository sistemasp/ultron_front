import React, { Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import { FormControl, Grid, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { ButtonCustom } from "../../../basic/ButtonCustom";
import { ComboCustomProductos } from "../../../basic/ComboCustomProductos";
import myStyles from '../../../../css';
import TableComponent from '../../../table/TableComponent';
import { ComboCustom } from '../../../basic/ComboCustom';
import { ComboCustomDescripcion } from '../../../basic/ComboCustomDescripcion';
import { CheckCustom } from '../../../basic/CheckCustom';

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

const FormTraspasos = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    isLoading,
    onChangeFecha,
    onChangeFechaCaducidad,
    onClickAgregar,
    onChange,
    onChangeRegistro,
    open,
    colorBase,
    onClickGuardar,
    onClickActualizar,
    onChangeProveedor,
    onChangeUnidadEntrada,
    onChangeUnidadSalida,
    onChangSinCaducidad,
    proveedores,
    onChangeProducto,
    productos,
    unidades,
    titulo,
    columns,
    registros,
    registro,
    actions,
    options,
    components,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_95}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h1>FACTURA</h1>
              </Grid>

              <Grid item xs={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickGuardar(values)}
                  disabled={isLoading}
                  text='GUARDAR' />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={classes.textField}
                  name="factura"
                  label="SOLICITUD DE TRASPASO"
                  value={values.factura}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              <Grid item xs={2}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="FECHA FACTURA"
                    value={values.fecha}
                    onChange={onChangeFecha}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    invalidDateMessage='SELECCIONA UNA FECHA' />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={3} >
                <FormControl variant="outlined" className={classes.textField}>
                  <ComboCustom
                    label='PROVEEDOR'
                    value={values.proveedor}
                    onChange={onChangeProveedor}
                    options={proveedores} />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onClickActualizar(values)}
                  disabled={isLoading}
                  text='ACTUALIZAR DATOS' />
              </Grid>

              {
                values.factura && values.factura.length > 3 ?
                  <Fragment>
                    <Grid item xs={2}>
                      <TextField
                        className={classes.formControl}
                        name="piezas"
                        label="PIEZAS"
                        value={registro.piezas}
                        onChange={onChangeRegistro}
                        type='Number'
                        variant="outlined" />
                    </Grid>

                    <Grid item xs={4} >
                      <FormControl variant="outlined" className={classes.textField}>
                        <ComboCustomProductos
                          label='PRODUCTO'
                          name="producto"
                          value={registro.producto}
                          onChange={onChangeProducto}
                          options={productos} />
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        className={classes.formControl}
                        name="costo"
                        label="COSTO"
                        value={registro.costo}
                        onChange={onChangeRegistro}
                        type='Number'
                        variant="outlined" />
                    </Grid>

                    <Grid item xs={2} >
                      <FormControl variant="outlined" className={classes.textField}>
                        <ComboCustomDescripcion
                          label='UNIDAD ENTRADA'
                          value={registro.unidad_entrada}
                          onChange={onChangeUnidadEntrada}
                          options={unidades} />
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        className={classes.formControl}
                        name="contenido"
                        label="CONTENIDO"
                        value={registro.contenido}
                        onChange={onChangeRegistro}
                        type='Number'
                        variant="outlined" />
                    </Grid>

                    <Grid item xs={2} >
                      <FormControl variant="outlined" className={classes.textField}>
                        <ComboCustomDescripcion
                          label='UNIDAD SALIDA'
                          value={registro.unidad_salida}
                          onChange={onChangeUnidadSalida}
                          options={unidades} />
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        className={classes.formControl}
                        name="lote"
                        label="LOTE"
                        value={registro.lote}
                        onChange={onChangeRegistro}
                        variant="outlined" />
                    </Grid>

                    <Grid item xs={2}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          autoOk
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="FECHA CADUCIDAD"
                          value={registro.caducidad}
                          onChange={onChangeFechaCaducidad}
                          disabled={registro.sin_caducidad}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                          invalidDateMessage='SELECCIONA UNA FECHA' />
                      </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item xs={2} >
                      <CheckCustom
                        checked={registro.sin_caducidad}
                        onChange={onChangSinCaducidad}
                        name="checkedC"
                        label="SIN CADUCIDAD" />
                    </Grid>

                    <Grid item xs={2}>
                      <ButtonCustom
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        onClick={() => onClickAgregar(registro)}
                        disabled={isLoading || !registro.piezas || !registro.producto
                          || !registro.costo || !registro.unidad_entrada || !registro.contenido
                          || !registro.unidad_salida || !registro.lote}
                        text='AGREGAR' />
                    </Grid>
                  </Fragment> : ''
              }

              <Grid item xs={12}>
                <TableComponent
                  titulo={titulo}
                  columns={columns}
                  data={values.registros}
                  actions={actions}
                  options={options}
                  components={components} />
              </Grid>

            </Grid>

          </form>
        </div>
      </Modal >
    </div >
  );
}

export default FormTraspasos;