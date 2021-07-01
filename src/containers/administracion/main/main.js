import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
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
import AndroidIcon from '@material-ui/icons/Android';
import { Button, Grid } from '@material-ui/core';
import ModalPassword from '../../../components/modales/modal_password';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuReports from '../menu_reportes';
import Description from '@material-ui/icons/Description';
import MenuRazonSocial from '../menu_razon_social';
import myStyles from '../../../css';
import MenuSuperAdmin from '../../menu_super_admin';

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

	const rolRecepcionistaId = process.env.REACT_APP_RECEPCIONISTA_ROL_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;

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
		history,
	} = props;

	const classes = myStyles();
	const theme = useTheme();
	const [openDrawer, setOpenDrawer] = useState(false);

	const handleDrawerOpen = () => {
		setOpenDrawer(true);
	};

	const handleDrawerClose = () => {
		setOpenDrawer(false);
	};

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
					<Button
						color="default"
						variant="contained"
						onClick={onClickCambioPassword}>CAMBIAR CONTRASEÑA</Button>
					<Button
						color="secondary"
						variant="contained"
						onClick={onClickLogout}>CERRAR SESION</Button>
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
					<ListItem button key={'RAZÓN SOCIAL'} onClick={(e) => onChangeTab(e, 0, handleDrawerClose)}>
						<ListItemIcon> <Description /> </ListItemIcon>
						<ListItemText primary={'RAZÓN SOCIAL'} />
					</ListItem>
					<ListItem button key={'REPORTES'} onClick={(e) => onChangeTab(e, 1, handleDrawerClose)}>
						<ListItemIcon> <AssignmentIcon /> </ListItemIcon>
						<ListItemText primary={'REPORTES'} />
					</ListItem>
					{
						empleado.super_admin
							? <ListItem button key={'SUPER ADMINISTRADOR'} onClick={(e) => onChangeTab(e, 2, handleDrawerClose)}>
								<ListItemIcon> <AndroidIcon /> </ListItemIcon>
								<ListItemText primary={'SUPER ADMINISTRADOR'} />
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
						<MenuRazonSocial
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<MenuReports
							paciente={pacienteAgendado}
							setPacienteAgendado={setPacienteAgendado}
							empleado={empleado}
							sucursal={sucursal._id} />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<MenuSuperAdmin
							empleado={empleado}
							sucursal={sucursal}
							history={history} />
					</TabPanel>
				</Fragment>
			</main>
		</div>
	);
}