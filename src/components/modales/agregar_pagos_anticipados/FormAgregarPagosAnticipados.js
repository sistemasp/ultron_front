import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Multiselect } from 'multiselect-react-dropdown';
import { ButtonCustom } from "../../basic/ButtonCustom";
import { CheckCustom } from '../../basic/CheckCustom';
import { toFormatterCurrency } from '../../../utils/utils';
import myStyles from '../../../css';
import SesionesAnticipadas from '../pagos_anticipados/sesiones_anicipadas/SesionesAnticipadas';
import TableComponent from '../../table/TableComponent';
import PagosMultiservicios from '../pagos_multiservicios';

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

const FormAgregarPagosAnticipados = (props) => {

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    pagoAnticipado,
    empleado,
    sucursal,
    servicios,
    tratamientos,
    areas,
    bancos,
    isLoading,
    formasPago,
    tiposTarjeta,
    onClickCancel,
    onClickPagar,
    onChangeServicio,
    onChangeTratamientos,
    onChangeAreas,
    onChangePaymentMethod,
    onChangeBank,
    onChangeCardType,
    onChangeCantidad,
    onChangeDescuento,
    onChangeConfirmado,
    onChange,
    onChangeDigitos,
    onChangePagoAnticipado,
    onChangDescuentoDermatologo,
    onClickAgregarSesion,
    open,
    colorBase,
    totalPagar,
    onClickPagosMultiservicios,
    // TABLE COMPONENT
    titulo,
    columns,
    sesionesAnticipadas,
    actions,
    options,
    components,
    // MODALES
    openModalPagosMultiservicios,
    onClosePagosMultiservicios,
    onGuardarModalPagosMultiservicios,
    setMessage,
    setSeverity,
    setOpenAlert,
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
            {
              openModalPagosMultiservicios ?
                <PagosMultiservicios
                  open={openModalPagosMultiservicios}
                  onClose={onClosePagosMultiservicios}
                  pagoAnticipado={pagoAnticipado}
                  empleado={empleado}
                  sucursal={sucursal}
                  setMessage={setMessage}
                  setSeverity={setSeverity}
                  setOpenAlert={setOpenAlert}
                  colorBase={colorBase}
                  onGuardarModalPagosMultiservicios={onGuardarModalPagosMultiservicios} />
                : ''
            }
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
                    {servicios.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
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
              {
                values.tratamientos ?
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
                  }) : ''
              }


              <Grid item xs={12} />
              <Grid item xs={12} sm={3} className={classes.grid_center}>
                <h2 className={classes.label}>{`PRECIO: ${toFormatterCurrency(values.precio)}`}</h2>
              </Grid>

              <Grid item xs={12} sm={3} className={classes.grid_center}>
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
              <Grid item xs={12} sm={3} className={classes.grid_center}>
                <h2 className={classes.label}>{`TOTAL: ${toFormatterCurrency(values.total)}`}</h2>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  className={classes.textField}
                  name="observaciones"
                  //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                  label="OBSERVACIONES"
                  value={values.observaciones}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickAgregarSesion(e, values)}
                  disabled={isLoading}
                  text='AGREGAR' />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TableComponent
                  titulo={titulo}
                  columns={columns}
                  data={sesionesAnticipadas}
                  actions={actions}
                  options={options}
                  components={components} />
              </Grid>

              <Grid item xs={12} sm={12} className={classes.label_right}>
                <h1 className={classes.label}>{`TOTAL A PAGAR: ${toFormatterCurrency(totalPagar)}`}</h1>
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
                  onClick={(e) => onClickPagosMultiservicios(e, values)}
                  disabled={isLoading}
                  text='PAGAR' />
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

export default FormAgregarPagosAnticipados;