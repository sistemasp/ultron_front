import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { Paper, TextField, Checkbox, Select } from '@material-ui/core';
import TableComponent from '../../../components/table/TableComponent';
import ModalConsulta from '../../../components/modales/modal_consulta';
import ModalPagos from '../../../components/modales/modal_pagos';
import ModalImprimirConsulta from '../../../components/modales/imprimir/consulta';
import { optionSelect, optionSelect2, toFormatterCurrency } from '../../../utils/utils';
import ModalCuracion from '../../../components/modales/modal_curacion';
import ModalEstetica from '../../../components/modales/modal_estetica';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalProximaConsulta from '../../../components/modales/modal_proxima_consulta';
import ModalTraspasoConsulta from '../../../components/modales/traspaso_consulta';
import myStyles from '../../../css';
import { CheckCustom } from '../../../components/basic/CheckCustom';
import { ComboCustom } from '../../../components/basic/ComboCustom';
import { 
  formaPagoTarjetaId,
  sucursalFederalismoId,
  sucursalManuelAcunaId,
  sucursalOccidentalId,
  sucursalRubenDarioId,
  rolRecepcionistaId
} from '../../../utils/constants';
//import Select from 'react-select';

export const AgendarConsultaContainer = (props) => {

  const {
    values,
    isHoliDay,
    cambioTurno,
    onChangeHoliDay,
    onChangeCambioTurno,
    servicios,
    tratamientos,
    productos,
    horarios,
    frecuencias,
    onChangeServicio,
    onChangeTratamientos,
    onChangeProductos,
    onChangeFecha,
    onChangeHora,
    onChangeFilterDate,
    filterDate,
    paciente,
    onClickAgendar,
    empleado,
    dermatologos,
    formasPago,
    medios,
    promovendedores,
    recepcionistas,
    onChangeDermatologos,
    onChangePromovendedor,
    onChangeObservaciones,
    onChangeFrecuencia,
    onChangePaymentMethod,
    dataComplete,
    frecuenciaPrimeraVezId,
    frecuenciaReconsultaId,
    colorBase,
    // TABLE DATES PROPERTIES
    titulo,
    columns,
    citas,
    actions,
    options,
    components,
    // MODALS PROPERTIES
    openModal,
    consulta,
    onClickActualizarCita,
    onClickCancel,
    onChangeTipoCita,
    onChangeMedio,
    onChangeAsistio,
    loadConsultas,
    sucursal,
    setMessage,
    setSeverity,
    setOpenAlert,
    setFilterDate,
    OnCloseVerPagos,
    openModalPagos,
    openModalImprimirConsultas,
    datosImpresion,
    onCloseImprimirConsulta,
    tipoServicioId,
    onGuardarModalPagos,
    openModalProxima,
    openModalTraspaso,
    onChangeBank,
    bancos,
    onChangeCardType,
    tiposTarjeta,
    onChangeDigitos,
  } = props;

  const classes = myStyles(colorBase)();

  const showPromovendedores = [
    ...promovendedores,
    ...recepcionistas,
  ];

  return (
    <Fragment>
      {
        openModal ?
          <ModalConsulta
            open={openModal}
            consulta={consulta}
            onClickActualizarCita={onClickActualizarCita}
            onClose={onClickCancel}
            onChangeServicio={onChangeServicio}
            onChangeTratamientos={onChangeTratamientos}
            onChangeFecha={onChangeFecha}
            onChangeHora={onChangeHora}
            onChangeTipoCita={onChangeTipoCita}
            onChangeMedio={onChangeMedio}
            onChangeAsistio={onChangeAsistio}
            servicios={servicios}
            tratamientos={tratamientos}
            horarios={horarios}
            empleado={empleado}
            sucursal={sucursal}
            loadConsultas={loadConsultas}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setSeverity={setSeverity}
            setFilterDate={setFilterDate}
            colorBase={colorBase}
          /> : ''
      }
      {
        openModalProxima ?
          <ModalProximaConsulta
            open={openModalProxima}
            consulta={consulta}
            onClickActualizarCita={onClickActualizarCita}
            onClose={onClickCancel}
            onChangeServicio={onChangeServicio}
            onChangeTratamientos={onChangeTratamientos}
            onChangeFecha={onChangeFecha}
            onChangeHora={onChangeHora}
            onChangeTipoCita={onChangeTipoCita}
            onChangeMedio={onChangeMedio}
            onChangeAsistio={onChangeAsistio}
            servicios={servicios}
            tratamientos={tratamientos}
            horarios={horarios}
            empleado={empleado}
            sucursal={sucursal._id}
            loadConsultas={loadConsultas}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setFilterDate={setFilterDate}
            colorBase={colorBase}
          /> : ''
      }
      {
        openModalPagos ?
          <ModalPagos
            open={openModalPagos}
            onClose={OnCloseVerPagos}
            servicio={consulta}
            empleado={empleado}
            sucursal={sucursal._id}
            setMessage={setMessage}
            setOpenAlert={setOpenAlert}
            tipoServicioId={tipoServicioId}
            colorBase={colorBase}
            onGuardarModalPagos={onGuardarModalPagos} />
          : ''
      }
      {
        openModalTraspaso ?
          <ModalTraspasoConsulta
            open={openModalTraspaso}
            onClose={onClickCancel}
            servicio={consulta}
            empleado={empleado}
            sucursal={sucursal._id}
            setMessage={setMessage}
            setOpenAlert={setOpenAlert}
            tipoServicioId={tipoServicioId}
            colorBase={colorBase}
            loadConsultas={loadConsultas} />
          : ''
      }
      {
        openModalImprimirConsultas ?
          <ModalImprimirConsulta
            open={openModalImprimirConsultas}
            onClose={onCloseImprimirConsulta}
            servicio="CONSULTA"
            sucursal={sucursal}
            colorBase={colorBase}
            datos={datosImpresion} />
          : ''
      }
      <Paper>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'SELECCIONA UN PACIENTE'}</h1>
          </Grid>
          <Grid item xs={12} sm={2}>
            <h1>{toFormatterCurrency(values.precio)}</h1>
          </Grid>
          <Grid item xs={12} sm={true} className={classes.grid_center}>
            <CheckCustom
              checked={isHoliDay}
              onChange={onChangeHoliDay}
              name="checkedF"
              label="ES FESTIVO"
            />
          </Grid>
          {/* {
            sucursal._id === process.env.REACT_APP_SUCURSAL_OCCI_ID ||
              sucursal._id === process.env.REACT_APP_SUCURSAL_FEDE_ID ?
              <Grid item xs={12} sm={true} className={classes.grid_center}>
                <CheckCustom
                  checked={cambioTurno}
                  onChange={onChangeCambioTurno}
                  name="checkedCT"
                  label="CAMBIO TURNO"
                />
              </Grid>
              : ''
          } */}

          <Grid item xs={12} sm={true} className={classes.grid_center}>
            <ButtonCustom
              className={classes.button}
              color="primary"
              variant="contained"
              disabled={dataComplete}
              onClick={() => onClickAgendar(values)}
              text='GUARDAR' />
          </Grid>
        </Grid>

        <Grid container spacing={3}>

          <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <ComboCustom
                label='FRECUENCIA'
                value={values.frecuencia}
                onChange={onChangeFrecuencia}
                options={frecuencias} />
            </FormControl>
          </Grid>
          {
            values.frecuencia && values.frecuencia._id === frecuenciaReconsultaId
              ? <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <ComboCustom
                    label='PRODUCTO'
                    value={values.producto}
                    onChange={onChangeProductos}
                    options={productos} />
                </FormControl>
              </Grid>
              : ''
          }
          <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-hora">DERMATÓLOGO (A)</InputLabel>
              <Select
                labelId="simple-select-outlined-dermatologo"
                id="simple-select-outlined-dermatologo"
                value={values.dermatologo}
                onChange={onChangeDermatologos}
                label="DERMATÓLOGO (A)" >
                {dermatologos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
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

          {
            values.frecuencia && values.frecuencia._id === frecuenciaReconsultaId
              ? <Grid item xs={12} sm={2}>
                <h2> {values.promovendedor.nombre} </h2>
              </Grid>
              : <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-promovendedor">PROMOVENDEDOR (A)</InputLabel>
                  <Select
                    labelId="simple-select-outlined-promovendedor"
                    id="simple-select-outlined-promovendedor"
                    value={values.promovendedor}
                    onChange={onChangePromovendedor}
                    label="PROMOVENDEDOR (A)" >
                    {showPromovendedores.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
          }

          <Grid item xs={12} sm={2}>
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

          { 
            values.forma_pago === formaPagoTarjetaId && (sucursal._id === sucursalOccidentalId || sucursal._id === sucursalFederalismoId) ?
              <Fragment>

                <Grid item xs={12} sm={2}>
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

                <Grid item xs={12} sm={2}>
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

                <Grid item xs={12} sm={2}>
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

          <Grid item xs={12} sm={2}>
            <TextField
              className={classes.formControl}
              name="observaciones"
              //helperText={touched.observaciones ? errors.observaciones : ""}
              label="OBSERVACIONES"
              value={values.observaciones}
              onChange={onChangeObservaciones}
              variant="outlined" />
          </Grid>
          <Fragment>
            <Grid item xs={12} sm={2}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                  container
                  justify="center"
                  alignItems="center" >
                  <KeyboardDatePicker
                    disableToolbar
                    //disablePast
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
                    invalidDateMessage='SELECCIONA UNA FECHA' />
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="simple-select-outlined-hora">HORA</InputLabel>
                <Select
                  labelId="simple-select-outlined-hora"
                  id="simple-select-outlined-hora"
                  value={values.hora}
                  onChange={onChangeHora}
                  disabled={values.fecha_show === ''}
                  label="HORA" >
                  {horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Fragment>
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid
            container
            justify="center"
            alignItems="center" >
            <KeyboardDatePicker
              disableToolbar
              loadingIndicator
              autoOk
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline-filter"
              label="FILTRADO CONSULTAS"
              value={filterDate}
              onChange={onChangeFilterDate}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }} />
          </Grid>
        </MuiPickersUtilsProvider>
      </Paper>

      <TableComponent
        titulo={titulo}
        columns={columns}
        data={citas}
        actions={actions}
        options={options}
        components={components} />

    </Fragment>
  );
}
