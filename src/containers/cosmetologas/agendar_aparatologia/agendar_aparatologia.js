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

export const AgendarAparatologiaContainer = (props) => {

	const {
		isSubmitting,
		values,
		errors,
		servicios,
		tratamientos,
		areas,
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
