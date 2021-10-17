import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TabConsultas from './consultas';
import { Modal, Grid } from '@material-ui/core';
import { ButtonCustom } from '../../basic/ButtonCustom';
import TabAparatologia from './aparatologia';
import TabFaciales from './faciales';
import TabBiopsias from './biopsias';
import TabCuraciones from './curaciones';
import TabEstetica from './estetica';
import TabDermapen from './dermapen';
import myStyles from '../../../css';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

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

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	}
}));

export const MenuHistoricoContainer = props => {

	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = React.useState(getModalStyle);

	const {
		onChangeTab,
		value,
		paciente,
		open,
		sucursal,
		onClickCancel,
		servicios,
		empleado,
		colorBase,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<div>
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={open} >
				<div style={modalStyle} className={classes.paper_95}>
					<h1> HISTORIAL: {`${paciente.nombres} ${paciente.apellidos}`} </h1>
					<AppBar className={classes.bar} position="static">
						<Tabs
							value={value}
							onChange={onChangeTab}
							aria-label="simple tabs"
							variant="scrollable"
							scrollButtons="on" >
							{
								servicios.map((item, index) => {
									return <Tab label={item.nombre} {...a11yProps(index)} />
								})
							}
						</Tabs>
					</AppBar>
					<TabPanel value={value} index={0}>
						<TabAparatologia
							paciente={paciente}
							sucursal={sucursal}
							servicio={servicios[0]}
							colorBase={colorBase}
							empleado={empleado} />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<TabBiopsias
							paciente={paciente}
							sucursal={sucursal}
							servicio={servicios[1]}
							colorBase={colorBase}
							empleado={empleado} />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<TabConsultas
							paciente={paciente}
							sucursal={sucursal}
							servicio={servicios[2]}
							colorBase={colorBase}
							empleado={empleado} />
					</TabPanel>
					<TabPanel value={value} index={3}>
						<TabCuraciones
							paciente={paciente}
							sucursal={sucursal}
							servicio={servicios[3]}
							colorBase={colorBase}
							empleado={empleado} />
					</TabPanel>
					<TabPanel value={value} index={4}>
						<TabDermapen
							paciente={paciente}
							sucursal={sucursal}
							servicio={servicios[4]}
							colorBase={colorBase}
							empleado={empleado} />
					</TabPanel>
					<TabPanel value={value} index={5}>
						<TabEstetica
							paciente={paciente}
							sucursal={sucursal}
							servicio={servicios[5]}
							colorBase={colorBase}
							empleado={empleado} />
					</TabPanel>
					<TabPanel value={value} index={6}>
						<TabFaciales
							paciente={paciente}
							sucursal={sucursal}
							servicio={servicios[6]}
							colorBase={colorBase}
							empleado={empleado} />
					</TabPanel>
					<Grid item xs={12} sm={12}>
						<ButtonCustom
							className={classes.buttonCancel}
							color="secondary"
							variant="contained"
							onClick={onClickCancel}
							text='SALIR' />
					</Grid>
				</div>
			</Modal>
		</div>
	);
}
