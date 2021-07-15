import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ReportesConsultas from './reportes/reportes_consultas';
import ReportesTratamientos from './reportes/reportes_tratamientos';
import ReportesPagos from './reportes/reportes_pagos';
import ReportesFacturas from './reportes/reportes_facturas';
import ReportesCirugias from './reportes/reportes_cirugias';
import ReportesBiopsias from './reportes/reportes_biopsias';
import ReportesFaciales from './reportes/reportes_faciales';
import ReportesLaser from './reportes/reportes_laser';
import ReportesAparatologia from './reportes/reportes_aparatologia';
import ReportesDetallesGeneral from './reportes/detalles_general';
import ReportesGastos from './reportes/gastos';
import ReportesEntradas from './reportes/entradas';
import ReporteGeneralCitas from './reportes/general_citas';
import ReportePagosDermatologos from './reportes/pagos_dermatologos';
import myStyles from '../../../css';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

/*const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	bar: {
		backgroundColor: colorBase,
	}
}));*/

export const MenuContainer = props => {

	const {
		onChangeTab,
		value,
		sucursal,
		empleado,
		colorBase,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<div className={classes.subRoot}>
			<AppBar
				className={classes.bar}
				position="static"
			>
				<Tabs
					value={value}
					onChange={onChangeTab}
					aria-label="simple tabs"
					variant="scrollable"
					scrollButtons="on"
				>
					{/*
					<Tab label="DETALLES GENERAL" {...a11yProps(0)} />
					<Tab label="INGRESOS" {...a11yProps(1)} />
					<Tab label="GASTOS" {...a11yProps(2)} />
					 */}

					<Tab label="CITAS GENERAL" {...a11yProps(0)} />
					<Tab label="DETALLES GENERAL" {...a11yProps(1)} />
					<Tab label="PAGOS DERMATOLÓGOS" {...a11yProps(2)} />
					<Tab label="FACTURAS" {...a11yProps(3)} />
					{/*
					<Tab label="APARATOLOGÍA" {...a11yProps(3)} />
					<Tab label="PAGOS" {...a11yProps(4)} />
					<Tab label="CIRGIAS" {...a11yProps(6)} />
					<Tab label="BIOPSIAS" {...a11yProps(7)} />
					*/}
				</Tabs>
			</AppBar>
			{/*
			<TabPanel value={value} index={0}>
				<ReportesDetallesGeneral
					empleado={empleado}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ReportesEntradas
					empleado={empleado}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<ReportesGastos
					empleado={empleado}
					sucursal={sucursal} />
			</TabPanel>
			*/}

			<TabPanel value={value} index={0}>
				<ReporteGeneralCitas
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<ReportesDetallesGeneral
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<ReportePagosDermatologos
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<ReportesFacturas
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>

			{/*
			<TabPanel value={value} index={4}>
				<ReportesPagos
					empleado={empleado}
					sucursal={sucursal} />
			</TabPanel>
			
			<TabPanel value={value} index={6}>
				<ReportesCirugias
					empleado={empleado}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={7}>
				<ReportesBiopsias
					empleado={empleado}
					sucursal={sucursal} />
			</TabPanel>
			*/}
		</div>
	);
}
