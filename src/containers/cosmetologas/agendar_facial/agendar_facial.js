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

export const AgendarFacialContainer = (props) => {

	const classes = myStyles();

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
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		citas,
		actions,
		options,
		components,
		// MODAL PROPERTIES
		openModal,
		cita,
		onClickActualizarCita,
		onClickCancel,
		onChangeAsistio,
		loadFaciales,
		setFilterDate,
		setSeverity,
		sucursal,
		setMessage,
		setOpenAlert,
	} = props;

	return (
		<Fragment>
			{
				openModal ?
					<ModalCita
						open={openModal}
						cita={cita}
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