import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Paper } from '@material-ui/core';
import TableComponent from '../../../components/table/TableComponent';
import ModalCita from '../../../components/modales/cosmetologa/cita';
import myStyles from '../../../css';

export const AgendarAparatologiaContainer = (props) => {

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
		sucursal,
		setMessage,
		setSeverity,
		setOpenAlert,
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
