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
import ModalEstetica from '../../../components/modales/modal_estetica';
import ModalImprimirCuracion from '../../../components/modales/imprimir/curacion';
import myStyles from '../../../css';
import ModalTraspasoServicio from '../../../components/modales/traspaso_servicio';
import ModalProximaEstetica from '../../../components/modales/modal_proxima_estetica';
import ModalImprimirEstetica from '../../../components/modales/imprimir/estetica';
import { 
	sucursalManuelAcunaId,
	sucursalRubenDarioId,
	rolRecepcionistaId
  } from '../../../utils/constants';

export const AgendarEsteticaContainer = (props) => {

	const {
		values,
		errors,
		servicios,
		tratamientos,
		areas,
		horarios,
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
		onChangeToxinasRellenos,
		onChangeDermatologos,
		onChangeTipoCita,
		onChangeTotal,
		onChangePromovendedor,
		onChangeCosmetologa,
		onChangeItemUnidades,
		onChangeMedio,
		medios,
		materiales,
		onChangeMateriales,
		onChangeItemPrecio,
		productos,
		frecuencias,
		onChangeProductos,
		onChangeFrecuencia,
		frecuenciaPrimeraVezId,
		frecuenciaReconsultaId,
		onChangePaymentMethod,
		formasPago,
		colorBase,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		esteticas,
		actions,
		options,
		components,
		// MODAL PROPERTIES
		openModal,
		estetica,
		onClickActualizarCita,
		onClickCancel,
		onChangeAsistio,
		loadEsteticas,
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
		// MODAL TRASPASOS
		openModalTraspaso,
		onCloseTraspasos,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<Fragment>
			{
				openModal ?
					<ModalEstetica
						open={openModal}
						estetica={estetica}
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
						loadEsteticas={loadEsteticas}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						colorBase={colorBase}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalProxima ?
					<ModalProximaEstetica
						open={openModalProxima}
						estetica={estetica}
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
						colorBase={colorBase}
						tratamientos={tratamientos}
						horarios={horarios}
						empleado={empleado}
						loadEsteticas={loadEsteticas}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalPagos ?
					<ModalPagos
						open={openModalPagos}
						onClose={onCloseVerPagos}
						servicio={estetica}
						empleado={empleado}
						sucursal={sucursal}
						colorBase={colorBase}
						setMessage={setMessage}
						setOpenAlert={setOpenAlert}
						onGuardarModalPagos={onGuardarModalPagos}
						tipoServicioId={estetica.servicio._id} />
					: ''
			}
			{
				openModalImprimirCita ?
					<ModalImprimirEstetica
						open={openModalImprimirCita}
						onClose={onCloseImprimirConsulta}
						servicio="TOXINAS Y RELLENOS"
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
						servicio={estetica}
						empleado={empleado}
						sucursal={sucursal._id}
						setMessage={setMessage}
						colorBase={colorBase}
						setOpenAlert={setOpenAlert}
						loadServicios={loadEsteticas} />
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
							disabled={!isValid || isSubmitting || !paciente.nombres || !values.dermatologo}
							onClick={() => onClickAgendar(values)}
							text='GUARDAR' />
					</Grid>
				</Grid>
				<Grid container>
					<Grid container spacing={2} xs={12} sm={12}>
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
						<Grid item xs={12} sm={2}>
							<Multiselect
								options={productos} // Options to display in the dropdown
								displayValue="nombre" // Property name to display in the dropdown options
								onSelect={(e) => onChangeProductos(e)} // Function will trigger on select event
								onRemove={(e) => onChangeProductos(e)} // Function will trigger on remove event
								placeholder={`PRODUCTO`}
								selectedValues={values.producto} // Preselected value to persist in dropdown
							/>
						</Grid>
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
								<InputLabel id="simple-select-outlined-promovendedor">PROMOVENDEDOR (A)</InputLabel>
								<Select
									labelId="simple-select-outlined-promovendedor"
									id="simple-select-outlined-promovendedor"
									value={values.promovendedor}
									error={Boolean(errors.promovendedor)}
									onChange={onChangePromovendedor}
									label="PROMOVENDEDOR (A)" >
									{promovendedores.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
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
						</Fragment>
						<Grid item xs={12} sm={2}>
							<TextField
								className={classes.textField}
								name="total"
								label="TOTAL ESTÉTICA"
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
					{/*
					<Grid container spacing={2} xs={12} sm={6}>
						<Grid item xs={3} className={classes.grid_center}>
							<h3 className={classes.labelItemLeft}>{`NOMBRE`}</h3>
						</Grid>
						<Grid item xs={3} className={classes.grid_center}>
							<h3 className={classes.labelItemCenter}> {`CANTIDAD UNIDADES`} </h3>
						</Grid>
						<Grid className={classes.labelItemLeft, classes.grid_center} item xs={3} >
							<h3 className={classes.labelItemCenter}>{`PRECIO POR UNIDAD`}</h3>
						</Grid>
						<Grid item xs={3} className={classes.grid_center}>
							<h3 className={classes.labelItemRight}> {`TOTAL`} </h3>
						</Grid>
						{
							values.toxinas_rellenos ?
								values.toxinas_rellenos.map((item, index) =>
									<Fragment>
										<Grid item xs={3} className={classes.grid_center}>
											<h3 className={classes.labelItemLeft}>{item.nombre}</h3>
										</Grid>
										<Grid item xs={12} sm={3} className={classes.grid_center}>
											<TextField
												className={classes.labelItemCenter}
												name={item.unidades}
												label={`UNIDADES`}
												value={item.unidades}
												type='Number'
												onChange={(e) => onChangeItemUnidades(e, index)}
												onInput={(e) => {
													e.target.value = e.target.value < 0 ? 0 : e.target.value;
													e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 3)
												}}
												variant="outlined" />
										</Grid>
										<Grid item xs={3} className={classes.grid_center}>
											<h3 className={classes.labelItemCenter}>{toFormatterCurrency(item.precio)}</h3>
										</Grid>
										<Grid item xs={3} className={classes.grid_center}>
											<h3 className={classes.labelItemRight}>{toFormatterCurrency(item.unidades * item.precio)}</h3>
										</Grid>
									</Fragment>) : ''
						}
					</Grid>
*/}
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
							label="FILTRADO ESTÉTICA"
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
				data={esteticas}
				actions={actions}
				options={options}
				components={components} />

		</Fragment>
	);
}
