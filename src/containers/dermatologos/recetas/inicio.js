import React from "react";
import TextField from "@material-ui/core/TextField";
import {
	makeStyles,
	Paper,
	Grid,
} from "@material-ui/core";

import { Fragment } from "react";
import myStyles from "../../../css";
import TableComponent from "../../../components/table/TableComponent";

export const RecetasPacienteContainer = (props) => {

	const {
		consultorio,
		// TABLE DATA
		tituloNormal,
		columns,
		recetas,
		actions,
		options,
		components,
		colorBase,
		detailPanel,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<Fragment>
			<Grid container spacing={1} className={classes.container_main}>
				<Grid item xs={12}>
					<Paper>
						<h1>{consultorio.nombre}</h1>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper>
						<Fragment>
							<Grid container>
								<Grid item xs={12}>
									<h1>{consultorio.paciente ? `PACIENTE: ${consultorio.paciente.nombres} ${consultorio.paciente.apellidos}` : `SIN PACIENTE`}</h1>
								</Grid>
							</Grid>
						</Fragment>
					</Paper>
				</Grid>
				{
					consultorio.paciente && consultorio.paciente.ocupacion
						?
						<Grid item xs={12}>
							<Paper>
								<Grid item xs={12}>
									<TableComponent
										titulo={tituloNormal}
										columns={columns}
										data={recetas}
										actions={actions}
										options={options}
										components={components}
										detailPanel={detailPanel} />
								</Grid>
							</Paper>
						</Grid>
						: ''
				}
			</Grid>
		</Fragment>
	);
};
