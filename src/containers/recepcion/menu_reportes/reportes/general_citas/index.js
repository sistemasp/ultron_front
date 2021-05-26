import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesGeneralCitasContainer } from "./general_citas";
import { findConsultsByRangeDateAndSucursal } from "../../../../../services/consultas";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, getPagoDermatologoByServicio } from "../../../../../utils/utils";
import { findFacialByRangeDateAndSucursal, findFacialByRangeDateAndSucursalAndService } from "../../../../../services/faciales";
import { findAparatologiaByRangeDateAndSucursal, findAparatologiaByRangeDateAndSucursalAndService } from "../../../../../services/aparatolgia";
import { findEsteticasByRangeDateAndSucursal } from "../../../../../services/esteticas";
import { findCirugiasByRangeDateAndSucursal } from "../../../../../services/cirugias";
import { findDermapenByRangeDateAndSucursal } from "../../../../../services/dermapens";
import { findDatesByRangeDateAndSucursal, showAllBanco, showAllMetodoPago, showAllTipoTarjeta } from "../../../../../services";
import { findRazonSocialById } from "../../../../../services/razones_sociales";
import { ControlCamera } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReporteGeneralCitas = (props) => {

	const classes = useStyles();

	const {
		empleado,
		sucursal,
	} = props;

	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
	const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
	const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
	const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
	const servicioDermapenId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
	const formaPagoTarjetaId = process.env.REACT_APP_FORMA_PAGO_TARJETA;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const iva = process.env.REACT_APP_IVA;

	const [isLoading, setIsLoading] = useState(true);
	const [consultas, setConsultas] = useState([]);
	const [faciales, setFaciales] = useState([]);
	const [cirugias, setCirugias] = useState([]);
	const [dermapens, setDermapens] = useState([]);
	const [aparatologias, setAparatologias] = useState([]);
	const [esteticas, setEsteticas] = useState([]);
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
		//{ title: 'FOLIO', field: 'folio' },
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'TELÉFONO', field: 'paciente.telefono' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		//{ title: 'HORA ATENDIDO', field: 'hora_atencion' },
		//{ title: 'HORA SALIDA', field: 'hora_salida' },
		{ title: 'SERVICIO', field: 'servicio.nombre' },
		{ title: 'PRODUCTO (ÁREAS)', field: 'show_tratamientos' },
		{ title: 'QUIÉN AGENDA', field: 'quien_agenda.nombre' },
		{ title: 'FRECUENCIA', field: 'frecuencia.nombre' },
		{ title: 'TIPO', field: 'tipo_cita.nombre' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo_nombre' },
		{ title: 'PROMOVENDEDOR (A)', field: 'promovendedor_nombre' },
		{ title: 'STATUS', field: 'status.nombre' },
		{ title: 'PRECIO', field: 'precio_moneda' },
		{ title: 'TIEMPO', field: 'tiempo' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },
	];

	const options = {
		/*rowStyle: rowData => {
			return { 
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? '#10CC88' : ''
			};
		},*/
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

	const procesarDatos = async () => {
		const datosCompletos = [...consultas, ...faciales, ...dermapens, ...cirugias, ...esteticas, ...aparatologias];

		datosCompletos.sort((a, b) => {
			if (a.fecha_hora > b.fecha_hora) return 1;
			if (a.fecha_hora < b.fecha_hora) return -1;
			return 0;
		});
		setDatos(datosCompletos);
		setIsLoading(false);
	}

	const processResponse = (data) => {
		data.forEach(item => {
			// item.folio = generateFolio(item);
			console.log("KAOZ", item);
			const date = new Date(item.fecha_hora);
            const dia = addZero(date.getDate());
            const mes = addZero(date.getMonth() + 1);
            const anio = date.getFullYear();
            const hora = Number(date.getHours());
            const minutos = date.getMinutes();
            item.fecha_show = `${dia}/${mes}/${anio}`;
            item.hora = `${addZero(hora)}:${addZero(minutos)}`;
			item.precio_moneda = toFormatterCurrency(item.precio);
			item.total_moneda = toFormatterCurrency(item.total);
			item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
			item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
			item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
			item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			item.show_tratamientos = item.tratamientos ? item.tratamientos.map(tratamiento => {
				const show_areas = tratamiento.areasSeleccionadas.map(area => {
					return `${area.nombre}`;
				});
				return `►${tratamiento.nombre}(${show_areas}) `;
			}) : 'NO APLICA';
		});
		return data;
	}

	const loadConsultas = async (startDate, endDate) => {
		const response = await findConsultsByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setConsultas(processResponse(response.data));
			procesarDatos();
		}
	}

	const loadFaciales = async (startDate, endDate) => {
		const response = await findFacialByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setFaciales(processResponse(response.data));
			await loadConsultas(startDate, endDate);
		}
	}

	const loadAparatologias = async (startDate, endDate) => {
		const response = await findAparatologiaByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setAparatologias(processResponse(response.data));
			await loadFaciales(startDate, endDate);
		}
	}

	const loadEsteticas = async (startDate, endDate) => {
		const response = await findEsteticasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setEsteticas(processResponse(response.data));
			await loadAparatologias(startDate, endDate);
		}
	}

	const loadCirugias = async (startDate, endDate) => {
		const response = await findCirugiasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setCirugias(processResponse(response.data));
			await loadEsteticas(startDate, endDate);
		}
	}

	const loadDermapens = async (startDate, endDate) => {
		const response = await findDermapenByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {				
			setDermapens(processResponse(response.data));
			await loadCirugias(startDate, endDate);
		}
	}

	
	const loadCitas = async (startDate, endDate) => {
		const response = await findDatesByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {				
			setDermapens(processResponse(response.data));
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
		await loadDermapens(startDate, endDate);
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
					<ReportesGeneralCitasContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES CITAS GENERAL(${startDate.fecha} - ${endDate.fecha})`}
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

export default ReporteGeneralCitas;