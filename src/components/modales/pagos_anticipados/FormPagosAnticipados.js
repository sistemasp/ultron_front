import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Modal, Grid } from '@material-ui/core';
import { ButtonCustom } from '../../basic/ButtonCustom';
import TabSesionesAnticipadas from './sesiones_anticipadas';
import myStyles from '../../../css';
import TableComponent from '../../table/TableComponent';

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

export const PagosAnticipadosContainer = props => {

	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = React.useState(getModalStyle);

	const {
		onChangeTab,
		value,
		paciente,
		open,
		sucursal,
		onClickCancel,
		pagosAnticipados,
		empleado,
		colorBase,
		token,
		titulo,
		columns,
		options,
		detailPanel,
		actions,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<div>
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={open} >
				<div style={modalStyle} className={classes.paper_95}>
					<h1> PAGOS ANTICIPADOS: {`${paciente.nombres} ${paciente.apellidos}`} </h1>
					{/* <AppBar className={classes.bar} position="static">
						<Tabs
							value={value}
							onChange={onChangeTab}
							aria-label="simple tabs"
							variant="scrollable"
							scrollButtons="on" >
							<Tab label="PAGOS ANTICIPADOS" {...a11yProps(0)} />
						</Tabs>
					</AppBar>
					<TabPanel value={value} index={0}>
						<TabSesionesAnticipadas
							paciente={paciente}
							sucursal={sucursal}
							token={token}
							sesionesAnticipadas={pagosAnticipados.sesionesAnticipadas}
							colorBase={colorBase}
							empleado={empleado} />
					</TabPanel>
					 */}
					<Grid item xs={12} sm={12}>
						<ButtonCustom
							className={classes.button}
							color="primary"
							variant="contained"
							onClick={null}
							text='AGREGAR PAGOS ANTICIPADOS' />
					</Grid>
					<TableComponent
						titulo={titulo}
						columns={columns}
						data={pagosAnticipados}
						options={options}
						detailPanel={detailPanel}
						actions={actions} />
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
