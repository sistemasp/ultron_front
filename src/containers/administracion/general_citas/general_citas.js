import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Paper } from '@material-ui/core';
import TableComponent from '../../../components/table/TableComponent';

export const GeneralCitasContainer = (props) => {

	const {
		onChangeFilterDate,
		filterDate,
		consultas,
		faciales,
		aparatologias,
		dermapens,
		cirugias,
		esteticas,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		actions,
		options,
		components,
	} = props;

	const citas = [
		...consultas,
		...faciales,
		...aparatologias,
		...dermapens,
		...cirugias,
		...esteticas,
	];

	citas.sort((a, b) => {
		if (a.hora > b.hora) return 1;
		if (a.hora < b.hora) return -1;
		return 0;
	});

	return (
		<Fragment>
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
							label="FILTRADO GENERAL"
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
