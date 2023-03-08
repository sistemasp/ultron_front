import React from "react";
import TextField from "@material-ui/core/TextField";
import {
	makeStyles,
	Paper,
	Grid,
} from "@material-ui/core";

import { Fragment } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import myStyles from "../../../css";
import { ButtonCustom } from "../../../components/basic/ButtonCustom";
import ModalPacienteDomicilio from "../../../components/modales/modal_paciente_domicilio";
import TableComponent from "../../../components/table/TableComponent";
import ModalItemReceta from "../../../components/modales/item_receta";
import ModalImprimirReceta from "../../../components/modales/imprimir/receta";

export const InicioContainer = (props) => {

	const {
		dermatologo,
		consultorio,
		onClickCompletarDatos,
		onClickItemReceta,
		onClickImprimirReceta,
		onChangeProximaConsulta,
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
		tituloNormal,
		tituloAntibioticos,
		tituloControlados,
		tituloEstudios,
		columns,
		productos,
		actions,
		options,
		components,
		colorBase,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<Fragment>
			{
				openModalPacienteDomicilio ?
					<ModalPacienteDomicilio
						dermatologo={dermatologo}
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
							<Grid container>
								<Grid item xs={10}>
									<h1>{consultorio.paciente ? `PACIENTE: ${consultorio.paciente.nombres} ${consultorio.paciente.apellidos}` : `SIN PACIENTE`}</h1>
								</Grid>
								<Grid item xs={true} sm={true}>
									<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<Grid
										container
										justify="center"
										alignItems="center" >
										<KeyboardDatePicker
										disableToolbar
										disablePast
										autoOk
										variant="inline"
										format="dd/MM/yyyy"
										margin="normal"
										id="date-picker-inline"
										label="FECHA PRÓXIMA CONSULTA"
										value={receta.fecha_proxima_consulta}
										onChange={onChangeProximaConsulta}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
										invalidDateMessage='SELECCIONA UNA FECHA' />
									</Grid>
									</MuiPickersUtilsProvider>
								</Grid>
							</Grid>
							{
								consultorio.paciente && !consultorio.paciente.codigo_postal
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
					consultorio.paciente && consultorio.paciente.codigo_postal
						?
						<Grid item xs={12}>
							<Paper>
								<Grid container>
									<Grid item xs={5}>
										<ButtonCustom
											className={classes.button}
											color="primary"
											variant="contained"
											onClick={() => onClickItemReceta()}
											text={'AGREGAR PRODUCTO'} />
									</Grid>
									<Grid item xs={2}>

									</Grid>
									<Grid item xs={5}>
										<ButtonCustom
											className={classes.button}
											color="primary"
											variant="contained"
											onClick={() => onClickItemReceta()}
											text={'AGREGAR ESTUDIO'} />
									</Grid>
								</Grid>
								
								<Grid item xs={12}>
									<TableComponent
										titulo={tituloNormal}
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
										disabled={!receta.fecha_proxima_consulta}
										text={'IMPRIMIR RECETA'} />
								</Grid>

								<Grid item xs={12}>
									<br></br>
								</Grid>

								<Grid item xs={12}>
									<TableComponent
										titulo={tituloAntibioticos}
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
										disabled={!receta.fecha_proxima_consulta}
										text={'IMPRIMIR ANTIBIÓTICOS'} />
								</Grid>

								<Grid item xs={12}>
									<br></br>
								</Grid>

								<Grid item xs={12}>
									<TableComponent
										titulo={tituloControlados}
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
										disabled={!receta.fecha_proxima_consulta}
										text={'IMPRIMIR CONTROLADOS'} />
								</Grid>

								<Grid item xs={12}>
									<br></br>
								</Grid>

								<Grid item xs={12}>
									<TableComponent
										titulo={tituloEstudios}
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
										disabled={!receta.fecha_proxima_consulta}
										text={'IMPRIMIR ESTUDIOS'} />
								</Grid>
							</Paper>
						</Grid>
						: ''
				}
			</Grid>
		</Fragment>
	);
};
