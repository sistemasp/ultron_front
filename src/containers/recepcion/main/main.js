import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import MenuPatient from '../menu_pacientes/index';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import People from '@material-ui/icons/People';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AirlineSeatReclineNormalIcon from '@material-ui/icons/AirlineSeatReclineNormal';
import AndroidIcon from '@material-ui/icons/Android';
import { Button, Grid, makeStyles } from '@material-ui/core';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import ModalPassword from '../../../components/modales/modal_password';
import Dermatologos from '../menu_dermatologos';
import Consultorios from '../consultorios';
import Corte from '../menu_corte';
import ListaEspera from '../lista_espera';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuReports from '../../basicos/menu_reportes';
import Description from '@material-ui/icons/Description';
import MenuRazonSocial from '../menu_razon_social';
import {
	createCorte,
	showCorteTodayBySucursalAndTurno
} from '../../../services/corte';
import myStyles from '../../../css';
import MenuSuperAdmin from '../../basicos/menu_super_admin';
import DashboardForm from '../../basicos/dashboard';
import InventariosForm from '../../basicos/inventarios';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import PieChartIcon from '@material-ui/icons/PieChart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import {
	rolRecepcionistaId,
	rolJulioId,
} from '../../../utils/constants';

const TabPanel = (props) => {
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
			{value === index && <Box>{children}</Box>}
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

export const MainContainer = props => {

	const {
		pacienteAgendado,
		setPacienteAgendado,
		onChangeTab,
		value,
		empleado,
		sucursal,
		onClickLogout,
		onClickCambioPassword,
		openModalPassword,
		onClose,
		setMessage,
		setSeverity,
		setOpenAlert,
		turno,
	} = props;

	const colorBase = sucursal.color;

	const classes = myStyles(colorBase)();
	const theme = useTheme();
	const [openDrawer, setOpenDrawer] = useState(false);

	const handleDrawerOpen = () => {
		setOpenDrawer(true);
	};

	const handleDrawerClose = () => {
		setOpenDrawer(false);
	};

	const generateCorteMatutino = async () => {
		const create_date = new Date();
		const newCorte = {
			recepcionista: empleado._id,
			create_date: create_date,
			hora_apertura: create_date,
			turno: 'm',
			sucursal: sucursal,
		}
		const response = await createCorte(newCorte);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setMessage("CORTE MATUTINO ABIERTO.");
			setOpenAlert(true);
		}
	}

	const findCorte = async () => {
		const response = await showCorteTodayBySucursalAndTurno(sucursal._id, 'm');
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const corte = response.data;
			if (!corte) {
				generateCorteMatutino();
			}
		}
	}

	useEffect(() => {
		findCorte();
	}, []);

	const getInventarios = () => {
		const permiso = empleado.rol.permisos.find(item => {
			return item === "INVENTARIOS";
		});
		return permiso;
	}

	return (
		<div className={classes.root}>
			{
				openModalPassword ?
					<ModalPassword
						open={openModalPassword}
						onClose={onClose}
						empleado={empleado}
						onClickLogout={onClickLogout}
						onClickCambioPassword={onClickCambioPassword}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setOpenAlert={setOpenAlert} /> : ''
			}
			<CssBaseline />
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: openDrawer,
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: openDrawer,
						})}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						{`SUCURSAL: ${sucursal.nombre} - ${empleado.numero_empleado} : ${empleado.nombre ? empleado.nombre : ''} ( ${empleado.rol ? empleado.rol.nombre : ''} )`}
					</Typography>
					<ButtonCustom
						color="default"
						variant="contained"
						onClick={onClickCambioPassword}
						text="CAMBIAR CONTRASEÑA" />
					<ButtonCustom
						color="secondary"
						variant="contained"
						onClick={onClickLogout}
						text="CERRAR SESIÓN" />
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={openDrawer}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>

					<ListItem button key={'PACIENTES'} onClick={(e) => onChangeTab(e, 0, handleDrawerClose)}>
						<ListItemIcon> <AccessibilityNewIcon /> </ListItemIcon>
						<ListItemText primary={'PACIENTES'} />
					</ListItem>

					<Fragment>
						<ListItem button key={'DERMATOLÓGOS'} onClick={(e) => onChangeTab(e, 1, handleDrawerClose)}>
							<ListItemIcon> <People /> </ListItemIcon>
							<ListItemText primary={'DERMATOLÓGOS'} />
						</ListItem>
						<ListItem button key={'CONSULTORIOS / CABINAS'} onClick={(e) => onChangeTab(e, 2, handleDrawerClose)}>
							<ListItemIcon> <AirlineSeatReclineNormalIcon /> </ListItemIcon>
							<ListItemText primary={'CONSULTORIOS / CABINAS'} />
						</ListItem>
						<ListItem button key={'CORTE'} onClick={(e) => onChangeTab(e, 3, handleDrawerClose)}>
							<ListItemIcon> <AttachMoneyIcon /> </ListItemIcon>
							<ListItemText primary={'CORTE'} />
						</ListItem>
						<ListItem button key={'LISTA DE ESPERA'} onClick={(e) => onChangeTab(e, 4, handleDrawerClose)}>
							<ListItemIcon> <ListAltIcon /> </ListItemIcon>
							<ListItemText primary={'LISTA DE ESPERA'} />
						</ListItem>
						<ListItem button key={'RAZÓN SOCIAL'} onClick={(e) => onChangeTab(e, 5, handleDrawerClose)}>
							<ListItemIcon> <Description /> </ListItemIcon>
							<ListItemText primary={'RAZÓN SOCIAL'} />
						</ListItem>
					</Fragment>

					{
						empleado.rol._id !== rolRecepcionistaId ?
							<ListItem button key={'REPORTES'} onClick={(e) => onChangeTab(e, 6, handleDrawerClose)}>
								<ListItemIcon> <AssignmentIcon /> </ListItemIcon>
								<ListItemText primary={'REPORTES'} />
							</ListItem>
							: ''
					}
					{
						empleado.super_admin
							? <ListItem button key={'SUPER ADMINISTRADOR'} onClick={(e) => onChangeTab(e, 7, handleDrawerClose)}>
								<ListItemIcon> <AndroidIcon /> </ListItemIcon>
								<ListItemText primary={'SUPER ADMINISTRADOR'} />
							</ListItem>
							: ''
					}

					{
						empleado.rol._id === rolJulioId ?
							<ListItem button key={'DASHBOARD'} onClick={(e) => onChangeTab(e, 8, handleDrawerClose)}>
								<ListItemIcon> <PieChartIcon /> </ListItemIcon>
								<ListItemText primary={'DASHBOARD'} />
							</ListItem>
							: ''
					}

					{
						empleado.rol._id === rolJulioId || getInventarios() ?
							<ListItem button key={'INVENTARIOS'} onClick={(e) => onChangeTab(e, 9, handleDrawerClose)}>
								<ListItemIcon> <AddShoppingCartIcon /> </ListItemIcon>
								<ListItemText primary={'INVENTARIOS'} />
							</ListItem>
							: ''
					}

					{
						empleado.rol._id === rolJulioId || getInventarios() ?
							<ListItem button key={'ESTÉTICA'} onClick={(e) => onChangeTab(e, 10, handleDrawerClose)}>
								<ListItemIcon> <FaceRetouchingNaturalIcon /> </ListItemIcon>
								<ListItemText primary={'ESTÉTICA'} />
							</ListItem>
							: ''
					}
				</List>
			</Drawer>
			<main
				className={clsx(classes.content, {
					[classes.contentShift]: openDrawer,
				})}
			>
				<div className={classes.drawerHeader} />
				<Fragment className={classes.fragment}>
					<TabPanel value={value} index={0}>
						<MenuPatient
							turno={turno}
							empleado={empleado}
							sucursal={sucursal}
							colorBase={colorBase} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<Dermatologos
							empleado={empleado}
							colorBase={colorBase}
							sucursal={sucursal} />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Consultorios
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							colorBase={colorBase}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={3}>
						<Corte
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							colorBase={colorBase}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={4}>
						<ListaEspera
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							colorBase={colorBase}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={5}>
						<MenuRazonSocial
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							colorBase={colorBase}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={6}>
						<MenuReports
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							colorBase={colorBase}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={7}>
						<MenuSuperAdmin
							empleado={empleado}
							sucursal={sucursal}
							colorBase={colorBase} />
					</TabPanel>
					<TabPanel value={value} index={8}>
						<DashboardForm
							empleado={empleado}
							sucursal={sucursal}
							colorBase={colorBase} />
					</TabPanel>
					<TabPanel value={value} index={9}>
						<InventariosForm
							empleado={empleado}
							sucursal={sucursal}
							colorBase={colorBase} />
					</TabPanel>
				</Fragment>
			</main>
		</div>
	);
}