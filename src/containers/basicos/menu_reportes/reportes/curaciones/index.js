import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesCuracionesContainer } from "./reportes_curaciones";
import { findCuracionesByRangeDateAndSucursal } from "../../../../../services/curaciones";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../../../../utils/utils";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesCuraciones = (props) => {

	const classes = useStyles();

	const {
		empleado,
		sucursal,
		colorBase,
	} = props;

	const token = empleado.access_token;

	const [isLoading, setIsLoading] = useState(true);
	const [citas, setCitas] = useState([]);

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
		{ title: 'FECHA', field: 'fecha' },
		{ title: 'FOLIO', field: 'consecutivo' },
		{ title: 'TURNO', field: 'turno' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'PACIENTE', field: 'paciente.nombre_completo' },
		{ title: 'TELÉFONO', field: 'paciente.telefono' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo.nombre' },
		{ title: 'PRECIO', field: 'precio_moneda' },
		{ title: 'NOMBRE CURACIÓN', field: 'curacion_nombre.nombre' },
		{ title: 'TIPO CURACIÓN', field: 'curacion_tipo.nombre' },
		{ title: 'AREA', field: 'curacion_area.nombre' },
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
			backgroundColor: colorBase,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: true,
		exportDelimiter: ';'
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

	const handleReportes = async () => {
		await loadCitas(startDate.fecha_show, endDate.fecha_show);
	}

	const loadCitas = async (startDate, endDate) => {
		const response = await findCuracionesByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), (endDate.getMonth() + 1), endDate.getFullYear(), sucursal, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.fecha = dateToString(item.fecha_hora);
				item.folio = generateFolio(item);
				const fecha = new Date(item.fecha_hora);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.paciente.nombre_completo = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
			});
			setCitas(response.data);
		}
	}

	useEffect(() => {
		setIsLoading(true);
		loadCitas(startDate.fecha_show, endDate.fecha_show);
		setIsLoading(false);
	}, [startDate, endDate]);

	const actions = [
	];

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesCuracionesContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES CURACION(${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						citas={citas}
						actions={actions}
						colorBase={colorBase}
						loadCitas={loadCitas}
						onClickReportes={handleReportes}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportesCuraciones;