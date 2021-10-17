import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesPagosDermatologosContainer } from "./pagos_dermatologos";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, getPagoDermatologoByServicio, dateToString } from "../../../../../utils/utils";
import { findPagoDermatologosByRangeDateAndSucursal } from "../../../../../services/pago_dermatologos";
import PrintIcon from '@material-ui/icons/Print';

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportePagosDermatologos = (props) => {

	const classes = useStyles();

	const {
		empleado,
		sucursal,
		colorBase,
	} = props;

	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
	const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
	const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const servicioCuracionId = process.env.REACT_APP_CURACION_SERVICIO_ID;
	const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
	const servicioDermapenId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
	const formaPagoTarjetaId = process.env.REACT_APP_FORMA_PAGO_TARJETA;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const iva = process.env.REACT_APP_IVA;

	const [isLoading, setIsLoading] = useState(true);
	const [pagosDermatologos, setPagosDermatologos] = useState([]);
	const [openModalImprimirPago, setOpenModalImprimirPago] = useState(false);
	const [datosImpresion, setDatosImpresion] = useState();

	const [datos, setDatos] = useState([]);

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

	const columnsGeneral = [
		{ title: 'SUCURSAL', field: 'sucursal.nombre' },
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'TURNO', field: 'turno_show' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo.nombre' },
		{ title: 'PAGO TOTAL', field: 'total_moneda' },
		{ title: 'RETENCIÓN', field: 'retencion_moneda' },
		{ title: 'EFECTIVO', field: 'efectivo_moneda' },
	];

	const options = {
		/*rowStyle: rowData => {
			return { 
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? '#10CC88' : ''
			};
		},*/
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

	const handleClose = () => {
		setOpenModalImprimirPago(false);
	};

	const handlePrint = async (event, rowData) => {
		setDatosImpresion(rowData);
		setOpenModalImprimirPago(true);
	}

	const actions = [
		{
			icon: PrintIcon,
			tooltip: 'IMPRIMIR',
			onClick: handlePrint
		}
	];

	const procesarDatos = async () => {
		const datosCompletos = [...pagosDermatologos];


		setDatos(datosCompletos);
	}

	const processResponse = (data) => {
		data.forEach(item => {
			item.fecha_show = dateToString(item.fecha_pago);
			item.turno_show = item.turno === 'm' ? 'MATUTINO' : 'VESPERTINO';
			item.total_moneda = toFormatterCurrency(item.total);
			item.retencion_moneda = toFormatterCurrency(item.retencion);
			item.efectivo_moneda = toFormatterCurrency(item.total - item.retencion);
		});
		return data;
	}

	const loadPagosDermatologos = async (startDate, endDate) => {
		const response = await findPagoDermatologosByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPagosDermatologos(processResponse(response.data));
			procesarDatos();
		}
	}

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

	const loadInfo = async (startDate, endDate) => {
		setIsLoading(true);
		await loadPagosDermatologos(startDate, endDate);
		setIsLoading(false);
	}

	const handleReportes = async () => {
		await loadInfo(startDate.fecha_show, endDate.fecha_show);
	}

	useEffect(() => {
		loadInfo(startDate.fecha_show, endDate.fecha_show);
	}, [startDate, endDate]);

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesPagosDermatologosContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES PAGOS DERMATOLÓGOS (${startDate.fecha} - ${endDate.fecha})`}
						columns={columnsGeneral}
						options={options}
						datos={datos}
						actions={actions}
						empleado={empleado}
						openModalImprimirPago={openModalImprimirPago}
						datosImpresion={datosImpresion}
						onClickReportes={handleReportes}
						handleClose={handleClose}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportePagosDermatologos;