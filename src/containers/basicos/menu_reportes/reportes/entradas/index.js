import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesEntradasContainer } from "./reportes_entradas";
import { findConsultsByRangeDateAndSucursal } from "../../../../../services/consultas";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, getPagoDermatologoByServicio } from "../../../../../utils/utils";
import { findCortesByRangeDateAndSucursal } from "../../../../../services/corte";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesEntradas = (props) => {

	const classes = useStyles();

	const {
		sucursal,
		colorBase,
	} = props;

	const formaPagoEfectivo = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
	const formaPagoTarjeta = process.env.REACT_APP_FORMA_PAGO_TARJETA;
	const formaPagoTransferencia = process.env.REACT_APP_FORMA_PAGO_TRANSFERENCIA;
	const formaPagoDeposito = process.env.REACT_APP_FORMA_PAGO_DEPOSITO;
	const tipoSalidaPagoDermatologo = process.env.REACT_APP_TIPO_SALIDA_PAGO_DERMATOLOGO_ID;
	const tipoSalidaRetiroParcial = process.env.REACT_APP_TIPO_SALIDA_RETIRO_PARCIAL_ID;

	const [isLoading, setIsLoading] = useState(true);
	const [cortes, setCortes] = useState([]);
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
		{ title: 'SUCURSAL', field: 'sucursal' },
		{ title: 'RECEPCIONISTA', field: 'recepcionista' },
		{ title: 'INGRESOS TOTALES', field: 'entradas_totales' },
		{ title: 'INGRESOS TOTALES REALES', field: 'entradas_totales_reales' },
		{ title: 'PAGOS ANTICIPADOS', field: 'pagos_anticipados' },
		{ title: 'PAGO CON TARJETA', field: 'tarjeta' },
		{ title: 'TRANSFERENCIA', field: 'transferencia' },
		{ title: 'EFECTIVO', field: 'efectivo' },
		{ title: 'DEPÓSITO', field: 'deposito' },
		{ title: 'PAGO DERMATÓLOGO EFECTIVO', field: 'pago_dermatologo_efectivo' },
		{ title: 'PAGO DERMATÓLOGO RETENCIÓN', field: 'pago_dermatologo_retencion' },
		{ title: 'GASTOS ', field: 'gastos' },
		{ title: 'RETIROS PARCIALES', field: 'retiros_parciales' },
		{ title: 'UTILIDAD O PÉRDIDA ', field: 'utilidad_o_perdida' },
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

	const procesarDatos = () => {
		const datos = [];
		cortes.forEach((item, index) => {
			const fecha = new Date(item.create_date);

			// PAGOS ANTICIPADOS
			let pagosAnticipados = 0;
			item.pagos_anticipados.forEach(pago_anticipado => {
				pagosAnticipados += Number(pago_anticipado.cantidad);
			});

			// PAGOS EFECTIVO
			let efectivo = 0;
			const entradasEfectivo = item.entradas.filter(entrada => {
				return entrada.forma_pago === formaPagoEfectivo;
			});
			entradasEfectivo.forEach(entradaEfectivo => {
				efectivo += Number(entradaEfectivo.cantidad);
			});

			// PAGOS TARJETA
			let tarjeta = 0;
			const entradasTarjeta = item.entradas.filter(entrada => {
				return entrada.forma_pago === formaPagoTarjeta;
			});
			entradasTarjeta.forEach(entradaTarjeta => {
				tarjeta += Number(entradaTarjeta.cantidad);
			});

			// PAGOS TRANSFERENCIA
			let transferencia = 0;
			const entradasTransferencia = item.entradas.filter(entrada => {
				return entrada.forma_pago === formaPagoTransferencia;
			});
			entradasTransferencia.forEach(entradaTransferencia => {
				transferencia += Number(entradaTransferencia.cantidad);
			});

			// PAGOS DEPÓSITO
			let deposito = 0;
			const entradasDeposito = item.entradas.filter(entrada => {
				return entrada.forma_pago === formaPagoDeposito;
			});
			entradasDeposito.forEach(entradaDeposito => {
				deposito += Number(entradaDeposito.cantidad);
			});

			const entradasTotales = pagosAnticipados + efectivo + tarjeta + transferencia + deposito;
			const entradasTotalesReales = entradasTotales - pagosAnticipados;

			// EGRESOS 
			let retirosParciales = 0;
			let pagoDermatologoEfectivo = 0;
			let pagoDermatologoRetencion = 0;
			let gastos = 0;
			item.salidas.forEach(salida => {
				switch (salida.tipo_salida) {
					case tipoSalidaRetiroParcial:
						retirosParciales += Number(salida.cantidad);
						break;
					case tipoSalidaPagoDermatologo:
						pagoDermatologoEfectivo += Number(salida.cantidad);
						pagoDermatologoRetencion += Number(salida.retencion ? salida.retencion : 0);
						break;
					default:
						gastos += Number(salida.cantidad);
				}
			});

			datos.push({
				fecha_show: `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`,
				turno: item.turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
				sucursal: item.sucursal.nombre,
				recepcionista: item.recepcionista.nombre,
				pagos_anticipados: toFormatterCurrency(pagosAnticipados),
				efectivo: toFormatterCurrency(efectivo),
				tarjeta: toFormatterCurrency(tarjeta),
				transferencia: toFormatterCurrency(transferencia),
				deposito: toFormatterCurrency(deposito),
				entradas_totales_reales: toFormatterCurrency(entradasTotalesReales),
				entradas_totales: toFormatterCurrency(entradasTotales),
				pago_dermatologo_efectivo: toFormatterCurrency(pagoDermatologoEfectivo),
				pago_dermatologo_retencion: toFormatterCurrency(pagoDermatologoRetencion),
				gastos: toFormatterCurrency(gastos),
				retiros_parciales: toFormatterCurrency(retirosParciales),
				utilidad_o_perdida: toFormatterCurrency(
					(retirosParciales + pagoDermatologoEfectivo + gastos) - efectivo
				),
			});
		});
		setDatos(datos);
		setIsLoading(false);
	}

	const loadSalidas = async (startDate, endDate) => {
		const response = await findCortesByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setCortes(response.data);
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
					<ReportesEntradasContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES INGRESOS(${startDate.fecha} - ${endDate.fecha})`}
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

export default ReportesEntradas;