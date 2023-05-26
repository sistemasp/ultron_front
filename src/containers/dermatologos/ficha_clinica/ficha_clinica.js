import React from "react";
import TextField from "@material-ui/core/TextField";
import {
	makeStyles,
	Paper,
	Grid,
} from "@material-ui/core";

import { Fragment } from "react";
import myStyles from "../../../css";

export const FichaClinicaContainer = (props) => {

	const {
		consultorio,
		colorBase,
		alergias
	} = props;

	console.log("KAOZ", alergias)
	const classes = myStyles(colorBase)();

	return (
		<Fragment>
			<Grid container spacing={1} className={classes.container_main}>
				<Grid item xs={3}>
					<Paper>
						<h1>{consultorio.nombre}</h1>
					</Paper>
				</Grid>
				<Grid item xs={9}>
					<Paper>
						<h1>{consultorio.paciente ? `PACIENTE: ${consultorio.paciente.nombres} ${consultorio.paciente.apellidos}` : `SIN PACIENTE`}</h1>
					</Paper>
				</Grid>

				<Grid item xs={6}>
					<Paper>
						<Fragment>
							<Grid container>
								<Grid item xs={12}>
									<h2>DATOS BASICOS DEL PACIENTE</h2>
								</Grid>
							</Grid>
						</Fragment>
					</Paper>
				</Grid>

				<Grid item xs={6}>
					<Paper>
						<Fragment>
							<Grid container>
								<Grid item xs={12}>
									<h2>SIGNOS VITALES</h2>
								</Grid>
							</Grid>
						</Fragment>
					</Paper>
				</Grid>

				<Grid item xs={6}>
					<Paper>
						<Fragment>
							<Grid container>
								<Grid item xs={12}>
									<h2>ANTECEDENTES PERSONALES PATOLÓGICOS</h2>
								</Grid>
							</Grid>
						</Fragment>
					</Paper>
				</Grid>

				<Grid item xs={6}>
					<Paper>
						<Fragment>
							<Grid container>
								<Grid item xs={12}>
									<h2>ANTECEDENTES PERSONALES NO PATOLÓGICOS</h2>
								</Grid>
							</Grid>
						</Fragment>
					</Paper>
				</Grid>

				<Grid item xs={6}>
					<Paper>
						<Fragment>
							<Grid container>
								<Grid item xs={12}>
									<h2>ANTECEDENTES HEREDOFAMILIARES</h2>
								</Grid>
							</Grid>
						</Fragment>
					</Paper>
				</Grid>
				
				<Grid item xs={6}>
					<Paper>
						<Fragment>
							<Grid container>
								<Grid item xs={12}>
									<h2>ALERGIAS</h2>
								</Grid>
							</Grid>
						</Fragment>
					</Paper>
				</Grid>

				<Grid item xs={12}>
					<Paper>
						<Fragment>
							<Grid container>
								<Grid item xs={12}>
									<h2>NOTAS</h2>
								</Grid>
							</Grid>
						</Fragment>
					</Paper>
				</Grid>

			</Grid>
		</Fragment>
	);
};
