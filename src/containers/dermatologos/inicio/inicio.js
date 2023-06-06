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
import ModalItemEstudio from "../../../components/modales/item_estudio";
import ModalImprimirReceta from "../../../components/modales/imprimir/receta";

export const InicioContainer = (props) => {

	const {
		dermatologo,
		consultorio,
		onClickCompletarDatos,
		onClickItemReceta,
		onClickItemEstudio,
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
		// MODAL ITEM ESTUDIO
		openModalItemEstudio,
		onCloseItemEstudio,
		onClickAgregarEstudios,
		// MODAL IMPRIMIR RECETA
		openModalImprimirReceta,
		onCloseImprimirRecetar,
		onClickImprimirRecetaAntibioticos,
		onClickImprimirRecetaControlados,
		onClickImprimirEstudios,
		datos,
		receta,
		sucursal,
		// TABLE DATA
		tituloNormal,
		tituloAntibioticos,
		tituloControlados,
		tituloEstudios,
		columns,
		columnsEstudio,
		productosNormales,
		productosAntibioticos,
		productosControlados,
		analisismedicos,
		actions,
		actionsEstudios,
		actions_controlados,
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
				openModalItemEstudio ?
					<ModalItemEstudio
						open={openModalItemEstudio}
						onClose={onCloseItemEstudio}
						onClickAgregarEstudios={onClickAgregarEstudios}
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
						<Fragment>
							<Grid container>
								<Grid item xs={true}>
									<h1>{consultorio.nombre}</h1>
								</Grid>
								<Grid item xs={true}>
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
								consultorio.paciente && !consultorio.paciente.ocupacion
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
					consultorio.paciente && consultorio.paciente.ocupacion
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
											onClick={() => onClickItemEstudio()}
											text={'AGREGAR ESTUDIO'} />
									</Grid>
								</Grid>
								{
									productosNormales && productosNormales.length > 0 ?
									<Fragment>
										<Grid item xs={12}>
											<TableComponent
												titulo={tituloNormal}
												columns={columns}
												data={productosNormales}
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
									</Fragment>
									: ''										
								}

								{
									productosAntibioticos && productosAntibioticos.length > 0 ?
									<Fragment>
										<Grid item xs={12}>
											<TableComponent
												titulo={tituloAntibioticos}
												columns={columns}
												data={productosAntibioticos}
												actions={actions}
												options={options}
												components={components} />
										</Grid>

										<Grid item xs={12}>
											<ButtonCustom
												className={classes.button}
												color="primary"
												variant="contained"
												onClick={() => onClickImprimirRecetaAntibioticos()}
												disabled={!receta.fecha_proxima_consulta}
												text={'IMPRIMIR ANTIBIÓTICOS'} />
										</Grid>

										<Grid item xs={12}>
											<br></br>
										</Grid>
									</Fragment>
									:''
								}
								
								{
									productosControlados && productosControlados.length > 0 ?
									<Fragment>
										<Grid item xs={12}>
											<TableComponent
												titulo={tituloControlados}
												columns={columns}
												data={productosControlados}
												actions={actions_controlados}
												options={options}
												components={components} />
										</Grid>

										<Grid item xs={12}>
											<ButtonCustom
												className={classes.button}
												color="primary"
												variant="contained"
												onClick={() => onClickImprimirRecetaControlados()}
												disabled={!receta.fecha_proxima_consulta}
												text={'IMPRIMIR CONTROLADOS'} />
										</Grid>

										<Grid item xs={12}>
											<br></br>
										</Grid>
									</Fragment>
									: ''
								}

								{
									analisismedicos && analisismedicos.length > 0 ?
									<Fragment>
										<Grid item xs={12}>
											<TableComponent
												titulo={tituloEstudios}
												columns={columnsEstudio}
												data={analisismedicos}
												actions={actionsEstudios}
												options={options}
												components={components} />
										</Grid>

										<Grid item xs={12}>
											<ButtonCustom
												className={classes.button}
												color="primary"
												variant="contained"
												onClick={() => onClickImprimirEstudios()}
												disabled={!receta.fecha_proxima_consulta}
												text={'IMPRIMIR ESTUDIOS'} />
										</Grid>
									</Fragment>
									: ''
								}

							</Paper>
						</Grid>
						: ''
				}
			</Grid>
		</Fragment>
	);
};
