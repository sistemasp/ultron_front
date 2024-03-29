import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ButtonCustom } from "../../basic/ButtonCustom";
import { CheckCustom } from '../../basic/CheckCustom';
import TableComponent from '../../table/TableComponent';
import ModalPago from '../modal_pago';
import ModalBuscarRazonSocial from '../modal_buscar_razon_social';
import { toFormatterCurrency } from '../../../utils/utils';
import myStyles from '../../../css';
import { Fragment } from 'react';

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

const ModalFormPagos = (props) => {
  const classes = myStyles(colorBase)();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    pago,
    pagos,
    titulo,
    isValid,
    onClickCancel,
    onClickGuardar,
    isLoading,
    open,
    columns,
    options,
    openModalPago,
    onClickNewPago,
    onClickCancelPago,
    loadPagos,
    servicio,
    empleado,
    sucursal,
    onGuardarModalPagos,
    openModalFactura,
    onCloseBuscarRazonSocial,
    actions,
    restante,
    tipoServicioId,
    onChangeFactura,
    onChangeDescuento,
    onChangDescuentoDermatologo,
    values,
    onChangeDescuentoCantidad,
    onChangePaymentMethod,
    bancos,
    formasPago,
    tiposTarjeta,
    onChangeCantidad,
    onChange,
    colorBase,
  } = props;

  return (
    <div>
      {
        openModalPago ?
          <ModalPago
            open={openModalPago}
            onClose={onClickCancelPago}
            servicio={servicio}
            pago={pago}
            empleado={empleado}
            sucursal={sucursal}
            loadPagos={loadPagos}
            restante={restante}
            tipoServicioId={tipoServicioId} />
          : ''
      }
      {
        openModalFactura ?
          <ModalBuscarRazonSocial
            open={openModalFactura}
            onClose={onCloseBuscarRazonSocial}
            pago={pago}
            servicio={servicio}
          /> : ''
      }
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_95}>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={6} className={classes.grid_center}>
              <CheckCustom
                checked={servicio.factura}
                onChange={onChangeFactura}
                //disabled={servicio.factura}
                name="checkedF"
                label="REQUIERE FACTURA" />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.grid_center}>
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={onClickNewPago}
                disabled={!servicio.factura}
                text='IMPRIMIR DATOS DE FACTURACIÓN' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <h2>{`SERVICIO: ${servicio.show_tratamientos}`}</h2>
            </Grid>

            <Grid item xs={12} sm={6}>
              <h1>{`PRECIO: ${servicio.precio_moneda}`}</h1>
            </Grid>

            <Grid item xs={12} sm={6} className={classes.grid_center}>
              <TextField
                className={classes.textField}
                name="porcentaje_descuento_clinica"
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

            <Grid item xs={12} sm={6} className={classes.grid_center}>
              <TextField
                className={classes.textField}
                name="cantidad_descuento_clinica"
                label="$ DESCUENTO"
                value={values.cantidad_descuento_clinica}
                onChange={onChangeDescuentoCantidad}
                type='Number'

                onInput={(e) => {
                  e.target.value = e.target.value > values.precio ? values.precio : e.target.value;
                  e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 5)
                }}
                variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={6} className={classes.grid_center}>
              <CheckCustom
                checked={values.has_descuento_dermatologo}
                onChange={onChangDescuentoDermatologo}
                name="checkedC"
                label="DESCUENTO DERMATÓLOGO" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <h1>{`$ 0.00`}</h1>
            </Grid>

          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={true}>
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
            <Grid item xs={true}>
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
            <Grid item xs={true}>
              <TextField
                className={classes.textField}
                name="observaciones"
                //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                label="OBSERVACIONES"
                value={values.observaciones}
                onChange={onChange}
                variant="outlined" />
            </Grid>
          </Grid>

          {
            servicio.hasBiopsia ?
              <Grid container spacing={2}>
                <Grid item xs={true}>
                  <h1>{`BIOPSIAS (${toFormatterCurrency(servicio.costo_biopsias)})`}</h1>
                </Grid>
                <Grid item xs={true}>
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
                <Grid item xs={true}>
                  <TextField
                    className={classes.textField}
                    name="cantidad"
                    //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                    label="CANTIDAD A COBRAR"
                    value={servicio.costo_biopsias}
                    onChange={onChangeCantidad}
                    type='Number'
                    onInput={(e) => {
                      e.target.value = Math.max(0, parseFloat(servicio.costo_biopsias)).toString().slice(0, 7)
                    }}
                    variant="outlined" />
                </Grid>
                <Grid item xs={true}>
                  <TextField
                    className={classes.textField}
                    name="observaciones"
                    //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                    label="OBSERVACIONES"
                    value={values.observaciones}
                    onChange={onChange}
                    variant="outlined" />
                </Grid>
              </Grid>
              : ''
          }

          {
            servicio.materiales.length > 0 ?
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <h1>{`MATERIALES`}</h1>
                </Grid>
                {
                  servicio.materiales.map(material => {
                    return <Grid container spacing={2}>
                      <Grid item xs={true}>
                        <h2>{`${material.nombre} (${toFormatterCurrency(material.precio)})`}</h2>
                      </Grid>
                      <Grid item xs={true}>
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
                      <Grid item xs={true}>
                        <TextField
                          className={classes.textField}
                          name="cantidad"
                          //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                          label="CANTIDAD A COBRAR"
                          value={material.precio}
                          onChange={onChangeCantidad}
                          type='Number'
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseFloat(material.precio)).toString().slice(0, 7)
                          }}
                          variant="outlined" />
                      </Grid>
                      <Grid item xs={true}>
                        <TextField
                          className={classes.textField}
                          name="observaciones"
                          //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                          label="OBSERVACIONES"
                          value={values.observaciones}
                          onChange={onChange}
                          variant="outlined" />
                      </Grid>
                    </Grid>
                  })
                }
              </Grid>
              : ''
          }

          <Grid container xs={12}>
            <Grid item xs={true} sm={true}>
              <h1>{`PRECIO: ${toFormatterCurrency(servicio.precio)}`}</h1>
            </Grid>
            <Grid item xs={true} sm={true}>
              <h1>{`TOTAL: ${toFormatterCurrency(values.total)}`}</h1>
            </Grid>
            <Grid item xs={true} sm={true}>
              <h1>{`RESTANTE: ${toFormatterCurrency(restante)}`}</h1>
            </Grid>
          </Grid>

          <Grid container xs={12}>
            <Grid item xs={12} sm={6}>
              <ButtonCustom
                className={classes.button}
                color="secondary"
                variant="contained"
                onClick={onClickCancel}
                text={!servicio.pagado ? 'CANCELAR' : 'SALIR'} />
            </Grid>
            {
              //!servicio.pagado ?
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => onGuardarModalPagos(servicio)}
                  disabled={pagos == ![]}
                  text='Guardar' />
              </Grid> //: ''
            }
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormPagos;