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
import TableComponent from "../../../components/table/TableComponent";
import ModalItemReceta from "../../../components/modales/item_receta";
import ModalImprimirReceta from "../../../components/modales/imprimir/receta";

export const InicioContainer = (props) => {

	const classes = myStyles();

	const {
		consultorio,
		onClickCompletarDatos,
		onClickItemReceta,
		onClickImprimirReceta,
		// MODAL PACIENTE DOMICILIO
		openModalPacienteDomicilio,
		onClosePacienteDomicilio,
		setMessage,
		setSeverity,
		setOpenAlert,
		findConsultorio,
		// MODAL ITEM RECETA
		openModalItemReceta,
		onCloseItemRecetar,
		onAgregarProducto,
		producto,
		// MODAL IMPRIMIR RECETA
		openModalImprimirReceta,
		onCloseImprimirRecetar,
		datos,
		receta,
		sucursal,
		// TABLE DATA
		titulo,
		columns,
		productos,
		actions,
		options,
		components,
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
			{
				openModalItemReceta ?
					<ModalItemReceta
						open={openModalItemReceta}
						onClose={onCloseItemRecetar}
						onAgregarProducto={onAgregarProducto}
						producto={producto}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setOpenAlert={setOpenAlert} />
					: ''
			}
			{
				openModalImprimirReceta ?
					<ModalImprimirReceta
						open={openModalImprimirReceta}
						onClose={onCloseImprimirRecetar}
						sucursal={sucursal}
						consultorio={consultorio}
						receta={receta} />
					: ''
			}
			<Grid container spacing={1} className={classes.container_main}>
				<Grid item xs={12}>
					<Paper>
						<h1>{consultorio.nombre}</h1>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper>
						<Fragment>
							<Grid item xs={12}>
								<h1>{consultorio.paciente ? `PACIENTE: ${consultorio.paciente.nombres} ${consultorio.paciente.apellidos}` : `SIN PACIENTE`}</h1>
							</Grid>
							{
								consultorio.paciente && !consultorio.paciente.domicilio
									?
									<Grid item xs={12}>
										<ButtonCustom
											className={classes.button}
											color="primary"
											variant="contained"
											onClick={() => onClickCompletarDatos()}
											text={'COMPLETAR DATOS'} />
									</Grid>
									: ''
							}
						</Fragment>
					</Paper>
				</Grid>
				{
					consultorio.paciente && consultorio.paciente.domicilio
						?
						<Grid item xs={12}>
							<Paper>
								<Grid item xs={12} sm={4}>
									<ButtonCustom
										className={classes.button}
										color="primary"
										variant="contained"
										onClick={() => onClickItemReceta()}
										text={'AGREGAR PRODUCTO'} />
								</Grid>
								<Grid item xs={12}>
									<TableComponent
										titulo={titulo}
										columns={columns}
										data={productos}
										actions={actions}
										options={options}
										components={components} />
								</Grid>
								<Grid item xs={12}>
									<ButtonCustom
										className={classes.button}
										color="primary"
										variant="contained"
										onClick={() => onClickImprimirReceta()}
										text={'IMPRIMIR'} />
								</Grid>
							</Paper>
						</Grid>
						: ''
				}
			</Grid>
		</Fragment>
	);
};
