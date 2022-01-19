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
import { formaPagoTarjetaId, sucursalFederalismoId, sucursalOccidentalId } from '../../../utils/constants';
import { CheckCustom } from '../../../components/basic/CheckCustom';

export const AgendarAparatologiaContainer = (props) => {

	const {
		isSubmitting,
		values,
		errors,
		servicios,
		tratamientos,
		esHoy,
		onChangeEsHoy,
		horarios,
		tipoCitas,
		formasPago,
		onChangePaymentMethod,
		onChangeFrecuencia,
		frecuencias,
		onChangeServicio,
		onChangeTratamientos,
		onChangeAreas,
		onChangeFecha,
		onChangeHora,
		onChangeFilterDate,
		filterDate,
		paciente,
		onClickAgendar,
		isValid,
		onChangeTiempo,
		onChangeObservaciones,
		empleado,
		disableDate,
		dermatologos,
		promovendedores,
		recepcionistas,
		cosmetologas,
		onChangeDoctors,
		onChangeTipoCita,
		onChangePromovendedor,
		onChangeCosmetologa,
		onChangeMedio,
		medios,
		dermatologoDirectoId,
		selectedAreas,
		colorBase,
		onChangeBank,
		bancos,
		onChangeCardType,
		tiposTarjeta,
		onChangeDigitos,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		aparatologias,
		actions,
		options,
		components,
		// MODAL PROPERTIES
		openModal,
		aparatologia,
		onClickActualizarCita,
		onClickCancel,
		onChangeAsistio,
		loadAparatologias,
		setFilterDate,
		// MODAL PROXIMA
		openModalProxima,
		// MODAL PAGOS
		onCloseVerPagos,
		openModalPagos,
		sucursal,
		setMessage,
		setSeverity,
		setOpenAlert,
		onGuardarModalPagos,
		// MODAL IMPRIMIR
		openModalImprimirCita,
		datosImpresion,
		onCloseImprimirConsulta,
		// MODAL APARATOLOGIA
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
						cita={aparatologia}
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
						loadAparatologias={loadAparatologias}
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
						cita={aparatologia}
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
						loadAparatologias={loadAparatologias}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setSeverity={setSeverity}
						colorBase={colorBase}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalPagos ?
					<ModalPagos
						open={openModalPagos}
						onClose={onCloseVerPagos}
						servicio={aparatologia}
						empleado={empleado}
						sucursal={sucursal}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setOpenAlert={setOpenAlert}
						colorBase={colorBase}
						tipoServicioId={aparatologia.servicio._id}
						onGuardarModalPagos={onGuardarModalPagos} />
					: ''
			}
			{
				openModalImprimirCita ?
					<ModalImprimirTratamiento
						open={openModalImprimirCita}
						onClose={onCloseImprimirConsulta}
						colorBase={colorBase}
						sucursal={sucursal}
						datos={datosImpresion} />
					: ''
			}
			{
				openModalTraspaso ?
					<ModalTraspasoServicio
						open={openModalTraspaso}
						onClose={onCloseTraspasos}
						servicio={aparatologia}
						empleado={empleado}
						sucursal={sucursal._id}
						setMessage={setMessage}
						setOpenAlert={setOpenAlert}
						colorBase={colorBase}
						loadServicios={loadAparatologias} />
					: ''
			}
			<Paper>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={8} className={classes.grid_center}>
						<h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'SELECCIONA UN PACIENTE'}</h1>
					</Grid>
					<Grid item xs={12} sm={true} className={classes.grid_center}>
						<h1>{toFormatterCurrency(values.precio)}</h1>
					</Grid>
					{
						sucursal === sucursalOccidentalId || sucursal === sucursalFederalismoId ?
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
							disabled={!isValid || isSubmitting || !paciente.nombres
								|| values.tratamientos.length === 0 || !values.fecha_hora || !selectedAreas}
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
								error={Boolean(errors.dermatologo)}
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
										error={Boolean(errors.tipo_cita)}
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
								error={Boolean(errors.promovendedor)}
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
								error={Boolean(errors.cosmetologa)}
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

					{
						values.forma_pago === formaPagoTarjetaId && esHoy ?
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
							error={Boolean(errors.observaciones)}
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
									invalidDateMessage='Selecciona una fecha' />
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
								error={Boolean(errors.hora)}
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
							error={Boolean(errors.tiempo)}
							label="TIEMPO"
							value={values.tiempo}
							onChange={onChangeTiempo}
							variant="outlined" />
					</Grid>
					{/*<Grid item xs={12} sm={2}>
						<h2>{`TIEMPO: ${values.tiempo} MINUTOS`}</h2>
					</Grid>*/}
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
							label="FILTRADO APARATOLOGÍA"
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
				data={aparatologias}
				actions={actions}
				options={options}
				components={components} />

		</Fragment>
	);
}
