import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesGastosContainer } from "./reportes_gastos";
import { findConsultsByRangeDateAndSucursal } from "../../../../../services/consultas";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, getPagoDermatologoByServicio } from "../../../../../utils/utils";
import { findFacialByRangeDateAndSucursal, findFacialByRangeDateAndSucursalAndService } from "../../../../../services/faciales";
import { findAparatologiaByRangeDateAndSucursal, findAparatologiaByRangeDateAndSucursalAndService } from "../../../../../services/aparatolgia";
import { findEsteticasByRangeDateAndSucursal } from "../../../../../services/esteticas";
import { findCirugiasByRangeDateAndSucursal } from "../../../../../services/cirugias";
import { findDermapenByRangeDateAndSucursal } from "../../../../../services/dermapens";
import { showAllBanco, showAllMetodoPago, showAllTipoTarjeta } from "../../../../../services";
import { findRazonSocialById } from "../../../../../services/razones_sociales";
import { findSalidasByRangeDateAndSucursal } from "../../../../../services/salidas";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesGastos = (props) => {

	const classes = useStyles();

	const {
		sucursal,
	} = props;

	const tipoSalidaPagoDermatologo = process.env.REACT_APP_TIPO_EGRESO_PAGO_DERMATOLOGO_ID;
	const tipoSalidaRetiroParcial = process.env.REACT_APP_TIPO_EGRESO_RETIRO_PARCIAL_ID;

	const [isLoading, setIsLoading] = useState(true);
	const [salidas, setSalidas] = useState([]);
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

	const columns = [
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'TURNO', field: 'turno' },
		{ title: 'SUCURSAL', field: 'sucursal.nombre' },
		{ title: 'TIPO EGRESO', field: 'tipo_salida.nombre' },
		{ title: 'CONCEPTO', field: 'concepto' },
		{ title: 'DESCRIPCIÓN', field: 'descripcion' },
		{ title: 'RECEPCIONISTA', field: 'recepcionista.nombre' },
		{ title: 'CANTIDAD', field: 'cantidad_moneda' },
	];

	const options = {
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: true,
		exportDelimiter: ';'
	}

	const procesarDatos = () => {
		const datos = [];
		salidas.forEach((item, index) => {
			const fecha = new Date(item.hora_aplicacion);
			item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
			item.cantidad_moneda = toFormatterCurrency(item.cantidad);
			if (item.tipo_salida._id !== tipoSalidaPagoDermatologo && item.tipo_salida._id !== tipoSalidaRetiroParcial) {
				datos.push(item);
			}
		});
		datos.sort((a, b) => {
			if (a.consecutivo > b.consecutivo) return 1;
			if (a.consecutivo < b.consecutivo) return -1;
			return 0;
		});
		setDatos(datos);
		setIsLoading(false);
	}

	const loadSalidas = async (startDate, endDate) => {
		const response = await findSalidasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setSalidas(response.data);
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
		await loadSalidas(startDate, endDate);
	}

	const handleReportes = async () => {
		await loadInfo(startDate.fecha_show, endDate.fecha_show);
	}

	const actions = [
	];

	useEffect(() => {
		loadInfo(startDate.fecha_show, endDate.fecha_show);
	}, [startDate, endDate]);

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesGastosContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES GASTOS(${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						datos={datos}
						actions={actions}
						onClickReportes={handleReportes}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportesGastos;