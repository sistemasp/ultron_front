import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ReportesConsultas from './reportes/consultas';
import ReportesTratamientos from './reportes/tratamientos';
import ReportesPagos from './reportes/pagos';
import ReportesFacturas from './reportes/facturas';
import ReportesCuraciones from './reportes/curaciones';
import ReportesBiopsias from './reportes/biopsias';
import ReportesFaciales from './reportes/faciales';
import ReportesLaser from './reportes/reportes_laser';
import ReportesAparatologia from './reportes/aparatologia';
import ReportesDetallesGeneral from './reportes/detalles_general';
import ReportesGastos from './reportes/gastos';
import ReportesEntradas from './reportes/entradas';
import ReporteGeneralCitas from './reportes/general_citas';
import ReportePagosDermatologos from './reportes/pagos_dermatologos';
import myStyles from '../../../css';
import ReportesPagosAnticipados from './reportes/pagos_anticipados';
import ReportePagosPatologos from './reportes/pagos_patologos';
import ReporteCortes from './reportes/cortes';
import ReporteSubsecuencias from './reportes/subsecuencias';
import ReportesRecetas from './reportes/recetas';

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
					scrollButtons="on" >
					<Tab label="CITAS GENERAL" {...a11yProps(0)} />
					<Tab label="DETALLES GENERAL" {...a11yProps(1)} />
					<Tab label="PAGOS DERMATOLÓGOS" {...a11yProps(2)} />
					<Tab label="FACTURAS" {...a11yProps(3)} />
					<Tab label="PAGOS ANTICIPADOS" {...a11yProps(4)} />
					<Tab label="PAGOS PATOLÓGOS" {...a11yProps(5)} />
					<Tab label="CORTES" {...a11yProps(6)} />
					<Tab label="SUBSECUENCIA" {...a11yProps(7)} />
					<Tab label="CURACIONES" {...a11yProps(8)} />
					<Tab label="RECETAS" {...a11yProps(9)} />
				</Tabs>
			</AppBar>

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
			<TabPanel value={value} index={4}>
				<ReportesPagosAnticipados
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={5}>
				<ReportePagosPatologos
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={6}>
				<ReporteCortes
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={7}>
				<ReporteSubsecuencias
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={8}>
				<ReportesCuraciones
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>
			<TabPanel value={value} index={9}>
				<ReportesRecetas
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal} />
			</TabPanel>
		</div>
	);
}
