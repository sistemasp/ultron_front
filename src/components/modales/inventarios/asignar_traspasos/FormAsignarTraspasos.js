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

const FormAsignarTraspasos = (props) => {

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
    onChangeAlmacen,
    onChangeUnidad,
    onChangeCantidad,
    onChangSinCaducidad,
    almacenes,
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
                <h1>ASIGNAR DE TRASPASO</h1>
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
              <Grid item xs={6} >
                <FormControl variant="outlined" className={classes.textField}>
                  <ComboCustomDescripcion
                    label='ALMACEN ORIGEN'
                    value={values.almacen_origen}
                    onChange={onChangeAlmacen}
                    options={almacenes} />
                </FormControl>
              </Grid>
              <Grid item xs={12} >
                <br />
              </Grid>
              {
                true ?
                  <Fragment>
                    <Grid item xs={1}>
                      <TextField
                        className={classes.formControl}
                        name="cantidad"
                        label="CANTIDAD"
                        value={registro.cantidad}
                        onChange={onChange}
                        type='Number'
                        variant="outlined" />
                    </Grid>
                    <Grid item xs={true} >
                      <FormControl variant="outlined" className={classes.textField}>
                        <ComboCustomDescripcion
                          label='UNIDAD'
                          value={registro.unidad}
                          onChange={onChangeUnidad}
                          options={unidades} />
                      </FormControl>
                    </Grid>
                    <Grid item xs={7} >
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
                      <ButtonCustom
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        onClick={() => onClickAgregar(registro)}
                        disabled={isLoading || !registro.cantidad || !registro.producto || !registro.unidad}
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

export default FormAsignarTraspasos;