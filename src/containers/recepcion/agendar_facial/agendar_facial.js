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
import ModalCita from '../../../components/modales/modal_cita';
import { Multiselect } from 'multiselect-react-dropdown';
import ModalPagos from '../../../components/modales/modal_pagos';
import { toFormatterCurrency } from '../../../utils/utils';
import ModalImprimirTratamiento from '../../../components/modales/imprimir/tratamiento';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalProximaCita from '../../../components/modales/modal_proxima_cita';
import myStyles from '../../../css';
import ModalTraspasoServicio from '../../../components/modales/traspaso_servicio';
import { CheckCustom } from '../../../components/basic/CheckCustom';

export const AgendarFacialContainer = (props) => {

	const {
		values,
		servicios,
		tratamientos,
		areas,
		horarios,
		tipoCitas,
		esHoy,
		onChangeEsHoy,
		onChangeServicio,
		onChangeTratamientos,
		onChangeAreas,
		onChangeFecha,
		onChangeHora,
		onChangeFilterDate,
		onChangeFrecuencia,
		frecuencias,
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
		recepcionistas,
		cosmetologas,
		formasPago,
		onChangeDoctors,
		onChangeTipoCita,
		onChangePromovendedor,
		onChangeCosmetologa,
		onChangePaymentMethod,
		onChangeMedio,
		medios,
		dermatologoDirectoId,
		selectedAreas,
		colorBase,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		citas,
		actions,
		options,
		components,
		// MODAL PROPERTIES
		openModal,
		facial,
		onClickActualizarCita,
		onClickCancel,
		onChangeAsistio,
		loadFaciales,
		setFilterDate,
		setSeverity,
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

	const showPromovendedores = [
		...promovendedores,
		...recepcionistas,
	];

	return (
		<Fragment>
			{
				openModal ?
					<ModalCita
						open={openModal}
						cita={facial}
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
						loadFaciales={loadFaciales}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setSeverity={setSeverity}
						colorBase={colorBase}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalProxima ?
					<ModalProximaCita
						open={openModalProxima}
						cita={facial}
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
						loadFaciales={loadFaciales}
						sucursal={sucursal}
						colorBase={colorBase}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalPagos ?
					<ModalPagos
						open={openModalPagos}
						onClose={onCloseVerPagos}
						servicio={facial}
						empleado={empleado}
						sucursal={sucursal}
						setMessage={setMessage}
						setOpenAlert={setOpenAlert}
						onGuardarModalPagos={onGuardarModalPagos}
						colorBase={colorBase}
						tipoServicioId={facial.servicio._id} />
					: ''
			}
			{
				openModalImprimirCita ?
					<ModalImprimirTratamiento
						open={openModalImprimirCita}
						onClose={onCloseImprimirConsulta}
						sucursal={sucursal}
						colorBase={colorBase}
						datos={datosImpresion} />
					: ''
			}
			{
				openModalTraspaso ?
					<ModalTraspasoServicio
						open={openModalTraspaso}
						onClose={onCloseTraspasos}
						servicio={facial}
						empleado={empleado}
						sucursal={sucursal._id}
						setMessage={setMessage}
						setOpenAlert={setOpenAlert}
						colorBase={colorBase}
						loadServicios={loadFaciales} />
					: ''
			}
			<Paper>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={8}>
						<h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'SELECCIONA UN PACIENTE'}</h1>
					</Grid>
					<Grid item xs={12} sm={true}>
						<h1>{toFormatterCurrency(values.precio)}</h1>
					</Grid>
					{
						sucursal === process.env.REACT_APP_SUCURSAL_OCCI_ID ||
							sucursal === process.env.REACT_APP_SUCURSAL_FEDE_ID ?
							<Grid item xs={12} sm={true} className={classes.grid_center}>
								<CheckCustom
									checked={esHoy}
									onChange={onChangeEsHoy}
									name="checkedH"
									label="HOY"
								/>
							</Grid>
							: ''
					}
					<Grid item xs={12} sm={true} className={classes.grid_center}>
						<ButtonCustom
							className={classes.button}
							color="primary"
							variant="contained"
							disabled={!isValid || isSubmitting || !paciente.nombres || !values.servicio
								|| values.tratamientos.length === 0 || !values.fecha_hora || !values.precio
								|| !values.tiempo || !selectedAreas || !values.hora}
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
						true ?
							<Grid item xs={12} sm={2}>
								<Multiselect
									options={tratamientos} // Options to display in the dropdown
									displayValue="nombre" // Property name to display in the dropdown options
									onSelect={(e) => onChangeTratamientos(e)} // Function will trigger on select event
									onRemove={(e) => onChangeTratamientos(e)} // Function will trigger on remove event
									placeholder="TRATAMIENTOS"
									selectedValues={values.tratamientos} // Preselected value to persist in dropdown
								/>
							</Grid> :
							<Grid item xs={12} sm={2}>
								<FormControl variant="outlined" className={classes.formControl}>
									<InputLabel id="simple-select-outlined-tratamientos">TRATAMIENTOS</InputLabel>
									<Select
										labelId="simple-select-outlined-tratamientos"
										id="simple-select-outlined-tratamientos"
										value={values.tratamientos[0]}
										onChange={(e) => onChangeTratamientos(e)}
										label="TRATAMIENTOS" >
										{tratamientos.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
					}
					{
						values.tratamientos.map(tratamientoValue => {
							return <Grid item xs={12} sm={2}>
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
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-hora">DERMATÓLOGO (A)</InputLabel>
							<Select
								labelId="simple-select-outlined-dermatologo"
								id="simple-select-outlined-dermatologo"
								value={values.dermatologo}
								onChange={onChangeDoctors}
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
						dermatologoDirectoId !== values.dermatologo ?
							<Grid item xs={12} sm={2}>
								<FormControl variant="outlined" className={classes.formControl}>
									<InputLabel id="simple-select-outlined-tipo-cita">TIPO</InputLabel>
									<Select
										labelId="simple-select-outlined-tipo-cita"
										id="simple-select-outlined-tipo-cita"
										value={values.tipo_cita}
										onChange={onChangeTipoCita}
										label="TIPO" >
										{tipoCitas.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
							: ''
					}
					<Grid item xs={12} sm={2}>
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
					<Grid item xs={12} sm={2}>
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
							label="OBSERVACIONES"
							value={values.observaciones}
							onChange={onChangeObservaciones}
							variant="outlined" />
					</Grid>
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
								disabled={!values.fecha_hora}
								label="HORA" >
								{horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField
							className={classes.formControl}
							name="tiempo"
							label="TIEMPO"
							value={values.tiempo}
							type='Number'
							onChange={onChangeTiempo}
							onInput={(e) => {
								e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
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
							label="FILTRADO FACIALES"
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
