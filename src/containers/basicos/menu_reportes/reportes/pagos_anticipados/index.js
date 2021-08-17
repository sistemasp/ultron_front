import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, dateToString } from "../../../../../utils/utils";
import { ReportesPagosAnticipadosContainer } from "./pagos_anticipados";
import { findFacturasByRangeDateAndSucursal } from "../../../../../services/facturas";
import myStyles from "../../../../../css";
import PrintIcon from '@material-ui/icons/Print';
import { findPagoAnticipadoByRangeDateAndSucursal } from "../../../../../services/pagos_anticipados";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesPagosAnticipados = (props) => {

	const {
		empleado,
		sucursal,
		colorBase,
	} = props;

	const token = empleado.access_token;

	const classes = myStyles(colorBase)();

	const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID
	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID
	const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID
	const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID
	const servicioBiopsiaId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID
	const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID
	const servicioDermapenId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID

	const [isLoading, setIsLoading] = useState(true);
	const [sesionesAnticipadas, setSesionesAnticipadas] = useState([]);
	const [datosImpresion, setDatosImpresion] = useState();
	const [openModalImprimirDatosFacturacion, setOpenModalImprimirDatosFacturacion] = useState(false);

	const date = new Date();
	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [startDate, setStartDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const [endDate, setEndDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const columns = [
		{ title: 'FECHA PAGO', field: 'fecha_pago_show' },
		{ title: 'PACIENTE', field: 'paciente.nombre_completo' },
		{ title: 'TELÉFONO', field: 'paciente.telefono' },
		{ title: 'FOLIO', field: 'consecutivo' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo.nombre' },
		{ title: 'SERVICIO', field: 'servicio.nombre' },
		{ title: 'PRODUCTO', field: 'show_tratamientos' },
		{ title: 'NUMERO SESIÓN', field: 'numero_sesion' },
		{ title: 'STATUS', field: 'status' },
		{ title: 'FECHA REALIZACIÓN', field: 'fecha_realizacion' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },
	];

	const options = {
		headerStyle: {
			backgroundColor: colorBase,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: true,
		exportDelimiter: ';'
	}

	const handleCloseImprimirDatosFacturacion = (event, rowData) => {
		setOpenModalImprimirDatosFacturacion(false);
	}

	const handlePrint = async (event, rowData) => {
		setDatosImpresion(rowData);
		setOpenModalImprimirDatosFacturacion(true);
	}

	const actions = [
		/*{
			icon: PrintIcon,
			tooltip: 'IMPRIMIR',
			onClick: handlePrint
		},*/
	];

	const loadPagosAnticipados = async (startDate, endDate) => {
		const response = await findPagoAnticipadoByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), (endDate.getMonth() + 1), endDate.getFullYear(), sucursal, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const resData = response.data;
			const sesionesAnticipadasData = [];
			resData.forEach((pagoAnticipado) => {
				pagoAnticipado.sesiones_anticipadas.forEach((sesionAnticipada) => {
					sesionAnticipada.fecha_pago_show = dateToString(sesionAnticipada.fecha_pago);
					sesionAnticipada.paciente.nombre_completo = `${sesionAnticipada.paciente.nombres} ${sesionAnticipada.paciente.apellidos}`;
					sesionAnticipada.status = sesionAnticipada.fecha_asistencia ? 'REALIZADO' : 'PENDIENTE';
					sesionAnticipada.fecha_realizacion = sesionAnticipada.fecha_asistencia ? dateToString(sesionAnticipada.fecha_asistencia) : '-';
					sesionAnticipada.consecutivo = sesionAnticipada.consecutivo ? sesionAnticipada.consecutivo : '-';
					sesionAnticipada.show_tratamientos = sesionAnticipada.tratamientos.map(tratamiento => {
						const show_areas = tratamiento.areasSeleccionadas.map(area => {
							return `${area.nombre}`;
						});
						return `►${tratamiento.nombre}(${show_areas}) `;
					});
					sesionesAnticipadasData.push(sesionAnticipada);

				});

				pagoAnticipado.fecha_pago_show = dateToString(pagoAnticipado.fecha_pago);
			});
			setSesionesAnticipadas(sesionesAnticipadasData);
		}
	}

	const loadAll = async () => {
		setIsLoading(true);
		await loadPagosAnticipados(startDate.fecha_show, endDate.fecha_show);
		setIsLoading(false);
	}

	useEffect(() => {
		loadAll();
	}, [sucursal]);

	const handleChangeStartDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setStartDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		setIsLoading(false);
	};

	const handleChangeEndDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setEndDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});

		setIsLoading(false);
	};

	const handleReportes = async () => {
		await loadPagosAnticipados(startDate.fecha_show, endDate.fecha_show);
	}

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesPagosAnticipadosContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES PAGOS ANTICIPADOS(${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						facturas={sesionesAnticipadas}
						actions={actions}
						colorBase={colorBase}
						onClickReportes={handleReportes}
						datosImpresion={datosImpresion}
						openModalImprimirDatosFacturacion={openModalImprimirDatosFacturacion}
						handleCloseImprimirDatosFacturacion={handleCloseImprimirDatosFacturacion}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportesPagosAnticipados;