import React from "react";
import TextField from "@material-ui/core/TextField";
import {
	makeStyles,
	Paper,
	Grid,
} from "@material-ui/core";

import { Fragment } from "react";
import myStyles from "../../../css";
import { ButtonCustom } from "../../../components/basic/ButtonCustom";
import ModalPacienteDomicilio from "../../../components/modales/modal_paciente_domicilio";

export const InicioContainer = (props) => {

	const classes = myStyles();

	const {
		dermatologo,
		sucursal,
		consultorio,
		onClickCompletarDatos,
		onClickRecetar,
		// MODAL PACIENTE DOMICILIO
		openModalPacienteDomicilio,
		onClosePacienteDomicilio,
		setMessage,
		setSeverity,
		setOpenAlert,
		findConsultorio,
	} = props;

	return (
		<Fragment>
			{
				openModalPacienteDomicilio ?
					<ModalPacienteDomicilio
						open={openModalPacienteDomicilio}
						onClose={onClosePacienteDomicilio}
						sucursal={sucursal}
						paciente={consultorio.paciente}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setOpenAlert={setOpenAlert}
						findConsultorio={findConsultorio} />
					: ''
			}
			<Paper className={classes.paper_principal}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<h1>{consultorio.nombre}</h1>
					</Grid>
				</Grid>
			</Paper>

			<Paper className={classes.paper_principal}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<p>{consultorio.paciente ? `PACIENTE: ${consultorio.paciente.nombres} ${consultorio.paciente.apellidos}` : `SIN PACIENTE`}</p>
					</Grid>
					{
						consultorio.paciente
							?
							<Grid item xs={12}>
								<ButtonCustom
									className={classes.button}
									color="primary"
									variant="contained"
									onClick={consultorio.paciente.domicilio ? () => onClickRecetar() : () => onClickCompletarDatos()}
									text={consultorio.paciente.domicilio ? 'RECETAR' : 'COMPLETAR DATOS'} />
							</Grid>
							: ''
					}
				</Grid>
			</Paper>
		</Fragment>
	);
};
