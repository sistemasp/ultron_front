import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, dateToString, culcularEdad, downloadExcel } from "../../../../../utils/utils";
import { findAparatologiaById } from "../../../../../services/aparatolgia";
import { findFacialById } from "../../../../../services/faciales";
import { findConsultById } from "../../../../../services/consultas";
import { findCuracionById } from "../../../../../services/curaciones";
import { findBiopsiaById } from "../../../../../services/biopsias";
import { findEsteticaById } from "../../../../../services/esteticas";
import { findDermapenById } from "../../../../../services/dermapens";
import myStyles from "../../../../../css";
import PrintIcon from '@material-ui/icons/Print';
import { ReportesRecetasContainer } from "./reportes_recetas";
import { findRecetaByRangeDateAndSucursal } from "../../../../../services/recetas";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesRecetas = (props) => {

	const {
		empleado,
		sucursal,
		colorBase,
	} = props;

	const token = empleado.access_token;

	const classes = myStyles(colorBase)();

	const [isLoading, setIsLoading] = useState(true);
	const [recetas, setRecetas] = useState([]);
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
		{ title: 'FECHA', field: 'fecha' },
		{ title: 'DERMATOLOGO', field: 'nombre_dermatologo' },
		{ title: 'PACIENTE', field: 'nombre_paciente' },
		{ title: 'EDAD', field: 'edad_paciente' },
		{ title: 'TELÉFONO', field: 'telefono_paciente' },		
		{ title: 'CP', field: 'cp_paciente' },
		{ title: 'PROXIMA CONSULTA', field: 'fecha_proxima_consulta' },
		{ title: 'LABORATORIO', field: 'nombre_laboratorio' },
		{ title: 'PRODUCTO', field: 'nombre_producto' },
		{ title: 'INDICACIÓN', field: 'indicacion' },
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

	const loadRecetas = async (startDate, endDate) => {
		const response = await findRecetaByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), (endDate.getMonth() + 1), endDate.getFullYear(), sucursal, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const resData = [];
			response.data.forEach((receta) => {
				
				receta.productos.forEach((pro) => {
					let registro = {
						fecha: dateToString(receta.create_date),
						nombre_dermatologo: receta.dermatologo.nombre,
						nombre_paciente: `${receta.paciente.nombres} ${receta.paciente.apellidos}`,
						edad_paciente: culcularEdad(receta.paciente.fecha_nacimiento),
						telefono_paciente: receta.paciente.telefono,
						fecha_proxima_consulta: receta.fecha_proxima_consulta,
						cp_paciente: receta.paciente.codigo_postal,
						nombre_laboratorio: pro.nombre_laboratorio,
						nombre_producto: pro.nombre_producto,
						indicacion: pro.recomendacion
					}
					resData.push(registro)
				})
			});

			setRecetas(resData);
		}
	}

	const loadAll = async () => {
		setIsLoading(true);
		await loadRecetas(startDate.fecha_show, endDate.fecha_show);
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
		await loadRecetas(startDate.fecha_show, endDate.fecha_show);
	}

	const handleClickExcel = async () => {
		downloadExcel(`REPORTES RECETAS(${startDate.fecha} - ${endDate.fecha})`, "HOJA UNO", recetas)
	}

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesRecetasContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES RECETAS(${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						recetas={recetas}
						actions={actions}
						colorBase={colorBase}
						onClickReportes={handleReportes}
						onClickExcel={handleClickExcel}
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

export default ReportesRecetas;