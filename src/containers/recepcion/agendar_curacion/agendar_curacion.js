import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Paper, TextField } from '@material-ui/core';
import TableComponent from '../../../components/table/TableComponent';
import { Multiselect } from 'multiselect-react-dropdown';
import ModalPagos from '../../../components/modales/modal_pagos';
import { toFormatterCurrency } from '../../../utils/utils';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalProximaCita from '../../../components/modales/modal_proxima_cita';
import ModalCuracion from '../../../components/modales/modal_curacion';
import ModalImprimirCuracion from '../../../components/modales/imprimir/curacion';
import myStyles from '../../../css';
import ModalProximaCuracion from '../../../components/modales/modal_proxima_curacion';
import ModalTraspasoServicio from '../../../components/modales/traspaso_servicio';

export const AgendarCuracionContainer = (props) => {

	const {
		values,
		errors,
		servicios,
		tratamientos,
		areas,
		horarios,
		tipoCitas,
		onChangeServicio,
		onChangeTratamientos,
		onChangeAreas,
		onChangeFecha,
		onChangeHora,
		onChangeMinutos,
		onChangeFilterDate,
		filterDate,
		paciente,
		onClickAgendar,
		isValid,
		isSubmitting,
		onChangeTiempo,
		onChangeObservaciones,
		empleado,
		disableDate,
		dermatologos,
		promovendedores,
		cosmetologas,
		onChangeDermatologos,
		onChangeTipoCita,
		onChangeTotal,
		onChangeCosmetologa,
		onChangeMedio,
		medios,
		dermatologoDirectoId,
		materiales,
		onChangeMateriales,
		onChangeItemPrecio,
		onChangeFrecuencia,
		onChangePaymentMethod,
		frecuencias,
		onChangeProductos,
		productos,
		formasPago,
		frecuenciaReconsultaId,
		colorBase,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		curaciones,
		actions,
		options,
		components,
		// MODAL PROPERTIES
		openModal,
		curacion,
		onClickActualizarCita,
		onClickCancel,
		onChangeAsistio,
		loadCuraciones,
		setFilterDate,
		// MODAL PROXIMA
		openModalProxima,
		// MODAL PAGOS
		onCloseVerPagos,
		openModalPagos,
		sucursal,
		setMessage,
		setOpenAlert,
		onGuardarModalPagos,
		// MODAL IMPRIMIR
		openModalImprimirCita,
		datosImpresion,
		onCloseImprimirConsulta,
		// MODAL TRASPASO
		openModalTraspaso,
		onCloseTraspasos,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<Fragment>
			{
				openModal ?
					<ModalCuracion
						open={openModal}
						curacion={curacion}
						paciente={paciente}
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
						loadCuraciones={loadCuraciones}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						colorBase={colorBase}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalProxima ?
					<ModalProximaCuracion
						open={openModalProxima}
						curacion={curacion}
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
						loadCuraciones={loadCuraciones}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						colorBase={colorBase}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalPagos ?
					<ModalPagos
						open={openModalPagos}
						onClose={onCloseVerPagos}
						servicio={curacion}
						empleado={empleado}
						sucursal={sucursal}
						setMessage={setMessage}
						setOpenAlert={setOpenAlert}
						colorBase={colorBase}
						onGuardarModalPagos={onGuardarModalPagos}
						tipoServicioId={curacion.servicio._id} />
					: ''
			}
			{
				openModalImprimirCita ?
					<ModalImprimirCuracion
						open={openModalImprimirCita}
						onClose={onCloseImprimirConsulta}
						servicio="CURACIÓN"
						colorBase={colorBase}
						datos={datosImpresion} />
					: ''
			}
			{
				openModalTraspaso ?
					<ModalTraspasoServicio
						open={openModalTraspaso}
						onClose={onCloseTraspasos}
						servicio={curacion}
						sucursal={sucursal}
						empleado={empleado}
						setMessage={setMessage}
						setOpenAlert={setOpenAlert}
						colorBase={colorBase}
						loadServicios={loadCuraciones} />
					: ''
			}
			<Paper>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={8} className={classes.grid_center}>
						<h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'SELECCIONA DESDE UNA CONSULTA'}</h1>
					</Grid>
					<Grid item xs={12} sm={2} className={classes.grid_center}>
						<h1>{toFormatterCurrency(values.precio)}</h1>
					</Grid>
					<Grid item xs={12} sm={2} className={classes.grid_center}>
						<ButtonCustom
							className={classes.button}
							color="primary"
							variant="contained"
							disabled={!isValid || isSubmitting || !paciente.nombres || !values.dermatologo || !values.fecha_hora}
							onClick={() => onClickAgendar(values)}
							text='GUARDAR' />
					</Grid>
				</Grid>

				<Grid container spacing={3}>
					<Grid item xs={12} sm={2}>
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
						values.frecuencia === frecuenciaReconsultaId
							? <Grid item xs={12} sm={2}>
								<FormControl variant="outlined" className={classes.formControl}>
									<InputLabel id="simple-select-outlined-hora">PRODUCTO</InputLabel>
									<Select
										labelId="simple-select-outlined-producto"
										id="simple-select-outlined-producto"
										value={values.producto}
										onChange={onChangeProductos}
										label="PRODUCTO" >
										{productos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
									</Select>
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
								error={Boolean(errors.dermatologo)}
								onChange={onChangeDermatologos}
								label="DERMATÓLOGO (A)" >
								{dermatologos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
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
					<Grid item xs={12} sm={2}>
						<TextField
							className={classes.formControl}
							name="observaciones"
							error={Boolean(errors.observaciones)}
							label="OBSERVACIONES"
							value={values.observaciones}
							onChange={onChangeObservaciones}
							variant="outlined" />
					</Grid>
					{sucursal._id === process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID ||
						sucursal._id === process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID ?
						<Fragment>
							<Grid item xs={12} sm={2}>
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<Grid
										container
										justify="center"
										alignItems="center" >
										<KeyboardDatePicker
											className={classes.formControl}
											disableToolbar
											//disablePast
											autoOk
											disabled={disableDate}
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
									</Grid>
								</MuiPickersUtilsProvider>
							</Grid>
							<Grid item xs={12} sm={2}>
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
							<Grid item xs={12} sm={2}>
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
						</Fragment> : ''}

					<Grid item xs={12} sm={2}>
						<TextField
							className={classes.textField}
							name="total"
							label="TOTAL CURACIÓN"
							value={values.precio}
							type='Number'
							onChange={onChangeTotal}
							onInput={(e) => {
								e.target.value = e.target.value < 0 ? 0 : e.target.value;
								e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 6)
							}}
							variant="outlined" />
					</Grid>
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
							label="FILTRADO CURACIÓN"
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
				data={curaciones}
				actions={actions}
				options={options}
				components={components} />

		</Fragment>
	);
}
