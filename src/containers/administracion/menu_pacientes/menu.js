import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Pacientes from '../pacientes/index';
import AgendarConsulta from '../agendar_consulta';
import Consultas from '../calendario/consultas';
import AgendarFacial from '../agendar_facial';
import GeneralCitas from '../general_citas';
import AgendarAparatologia from '../agendar_aparatologia';
import Faciales from '../calendario/faciales';
import Laser from '../calendario/laser';
import Aparatologia from '../calendario/aparatologia';
import ModalDermapen from '../../../components/modales/modal_dermapen';
import AgendarDermapen from '../agendar_dermapen';
import AgendarCuracion from '../agendar_curacion';
import AgendarEstetica from '../agendar_estetica';
import Calendario from '../calendario';
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

export const MenuContainer = props => {

	const {
		pacienteAgendado,
		consultaAgendada,
		setPacienteAgendado,
		onChangeTab,
		value,
		onClickAgendarFaciales,
		onClickAgendarConsulta,
		//onClickAgendarLaser,
		onClickAgendarAparatologia,
		onClickAgendarDermapen,
		onClickAgendarCuracion,
		onClickAgendarEstetica,
		empleado,
		sucursal,
		colorBase,
	} = props;

	const useStyles = makeStyles(theme => ({
		root: {
			flexGrow: 1,
			backgroundColor: theme.palette.background.paper,
		}		
	}));

	const classes = myStyles(colorBase)();
	const classess = useStyles();

	return (
		<div className={classess.root}>
			<AppBar
				className={classes.bar}
				position="sticky" >
				<Tabs
					value={value}
					onChange={onChangeTab}
					aria-label="simple tabs"
					variant="scrollable"
					scrollButtons="on" >
					<Tab className={classes.tabs} label="PACIENTES" {...a11yProps(0)} />
					<Tab className={classes.tabs} label="CONSULTA" {...a11yProps(1)} />
					<Tab className={classes.tabs} label="FACIALES" {...a11yProps(2)} />
					<Tab className={classes.tabs} label="APARATOLOGÍA" {...a11yProps(3)} />
					<Tab className={classes.tabs} label="DERMAPEN" {...a11yProps(4)} />
					<Tab className={classes.tabs} label="CURACIÓN" {...a11yProps(5)} />
					<Tab className={classes.tabs} label="ESTÉTICA" {...a11yProps(6)} />
					<Tab className={classes.tabs} label="GENERAL" {...a11yProps(7)} />
					<Tab className={classes.tabs} label="CALENDARIO" {...a11yProps(8)} />
					{
						/*
						
						<Tab className={classes.tabs} label="VER FACIALES" {...a11yProps(8)} />
						<Tab className={classes.tabs} label="VER APARATOLOGÍA" {...a11yProps(9)} />
						<Tab className={classes.tabs} label="VER DERMAPEN" {...a11yProps(10)} />
						*/
					}
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<Pacientes
					empleado={empleado}
					sucursal={sucursal}
					onClickAgendarFaciales={onClickAgendarFaciales}
					onClickAgendarConsulta={onClickAgendarConsulta}
					onClickAgendarAparatologia={onClickAgendarAparatologia}
					colorBase={colorBase}
					onChangeTab={onChangeTab} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<AgendarConsulta
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					sucursal={sucursal}
					onClickAgendarCuracion={onClickAgendarCuracion}
					onClickAgendarEstetica={onClickAgendarEstetica}
					onClickAgendarDermapen={onClickAgendarDermapen}
					onClickAgendarFaciales={onClickAgendarFaciales}
					onClickAgendarAparatologia={onClickAgendarAparatologia}
					colorBase={colorBase} />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<AgendarFacial
					info={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={3}>
				<AgendarAparatologia
					info={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={4}>
				<AgendarDermapen
					consultaAgendada={consultaAgendada}
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={5}>
				<AgendarCuracion
					consultaAgendada={consultaAgendada}
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={6}>
				<AgendarEstetica
					consultaAgendada={consultaAgendada}
					paciente={pacienteAgendado}
					setPacienteAgendado={setPacienteAgendado}
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={7}>
				<GeneralCitas
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={8}>
				<Calendario
					empleado={empleado}
					colorBase={colorBase}
					sucursal={sucursal._id} />
			</TabPanel>
			<TabPanel value={value} index={9}>
				<Aparatologia
					sucursal={sucursal._id}
					colorBase={colorBase} />
			</TabPanel>
			<TabPanel value={value} index={10}>
				<Faciales
					sucursal={sucursal._id}
					colorBase={colorBase} />
			</TabPanel>
		</div>
	);
}
