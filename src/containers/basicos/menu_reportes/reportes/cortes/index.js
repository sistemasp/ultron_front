import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, getPagoDermatologoByServicio, dateToString } from "../../../../../utils/utils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { findCortesByRangeDateAndSucursal } from "../../../../../services/corte";
import { ReportesCortesContainer } from "./cortes";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReporteCortes = (props) => {

	const classes = useStyles();

	const {
		empleado,
		sucursal,
		colorBase,
		history,
	} = props;

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
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'TURNO', field: 'turno_show' },
		{ title: 'RECEPCIONISTA', field: 'recepcionista.nombre' },
		{ title: 'TOTAL ENTRADAS', field: 'total_entradas' },
		{ title: 'TOTAL SALIDAS', field: 'total_salidas' },
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

	const handleOpenImprimir = (event, rowData) => {

		history.push('/imprimir/corte',
			{
				empleado: empleado,
				sucursal: rowData.sucursal,
				colorBase: colorBase,
				corte: rowData,
				dataEntradas: rowData.entradas,
				dataPagosAnticipados: rowData.pagos_anticipados,
				dataSalidas: rowData.salidas,
			});
	}

	const actions = [
		{
			icon: VisibilityIcon,
			tooltip: 'DETALLES',
			onClick: handleOpenImprimir
		}
	];

	const procesarDatos = async () => {
		const datosCompletos = [...pagosDermatologos];


		setDatos(datosCompletos);
	}

	const processResponse = (data) => {
		data.forEach(item => {
			item.fecha_show = dateToString(item.create_date);
			item.turno_show = item.turno === 'm' ? 'MATUTINO' : 'VESPERTINO';
			let totalEntradas = 0;
			let totalSalidas = 0;
			item.entradas.forEach(entrada => {
				totalEntradas += Number(entrada.cantidad);
			});
			item.salidas.forEach(salida => {
				totalSalidas += Number(salida.cantidad);
			});
			item.total_entradas = toFormatterCurrency(totalEntradas);
			item.total_salidas = toFormatterCurrency(totalSalidas);
		});
		return data;
	}

	const loadPagosDermatologos = async (startDate, endDate) => {
		const response = await findCortesByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
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
					<ReportesCortesContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES CORTES (${startDate.fecha} - ${endDate.fecha})`}
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

export default ReporteCortes;