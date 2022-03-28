import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Paper } from '@material-ui/core';
import TableComponent from '../../../components/table/TableComponent';
import myStyles from '../../../css';
import ModalCita from '../../../components/modales/cosmetologa/cita';

export const AgendarFacialContainer = (props) => {

	const {
		servicios,
		tratamientos,
		horarios,
		onChangeServicio,
		onChangeTratamientos,
		onChangeFecha,
		onChangeHora,
		onChangeFilterDate,
		filterDate,
		empleado,
		onChangeTipoCita,
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
