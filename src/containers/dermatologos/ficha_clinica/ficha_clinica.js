import React from "react";
import PropTypes from 'prop-types';
import {
	makeStyles,
	Paper,
	Grid,
	AppBar, 
	Box, 
	Tab, 
	Tabs, 
	Typography
} from "@material-ui/core";

import { Fragment } from "react";
import myStyles from "../../../css";
import AntecedentesPersonalesPatologicos from "./antecedentes_personales_patologicos";
import AntecedentesPersonalesNoPatologicos from "./antecedentes_personales_no_patologicos";
import AntecedentesHeredofamiliares from "./antecedentes_heredofamiliares";
import SignosVitales from "./signos_vitales";
import Alergias from "./alergias";
import ExpedienteElectronico from "./expediente_electronico";

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

export const FichaClinicaContainer = (props) => {

	const {
		consultorio,
		colorBase,
		onChangeTab,
		value,
		historiaClinica,
		setHistoriaClinica,
		commitHistoriaClinica,
		findConsultorio,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<Fragment>
			<Grid container spacing={1} className={classes.container_main}>
				<Grid item xs={3}>
					<Paper>
						<h1>{consultorio.nombre}</h1>
					</Paper>
				</Grid>
				<Grid item xs={9}>
					<Paper>
						<h1>{consultorio.paciente ? `PACIENTE: ${consultorio.paciente.nombres} ${consultorio.paciente.apellidos}` : `SIN PACIENTE`}</h1>
					</Paper>
				</Grid>

				{
					consultorio.paciente 
					?
					<Grid item xs={12}>
						<Paper>
							<AppBar
								className={classes.bar}
								position="sticky" >
								<Tabs
									value={value}
									onChange={onChangeTab}
									aria-label="simple tabs"
									variant="fullWidth"
									scrollButtons="on" >
										<Tab 	className={classes.tabs} label="ANTECEDENTES PERSONALES PATOLÓGICOS" wrapped {...a11yProps(0)} />
										<Tab className={classes.tabs} label="ANTECEDENTES PERSONALES NO PATOLÓGICOS" wrapped {...a11yProps(1)} />
										<Tab className={classes.tabs} label="ANTECEDENTES HEREDOFAMILIARES" wrapped {...a11yProps(2)} />
										<Tab className={classes.tabs} label="SIGNOS VITALES" wrapped {...a11yProps(3)} />
										<Tab className={classes.tabs} label="ALERGIAS" wrapped {...a11yProps(4)} />
										{/* <Tab className={classes.tabs} label="EXPEDIENTE ELECTRONICO" wrapped {...a11yProps(5)} /> */}
								</Tabs>
							</AppBar>
							<TabPanel value={value} index={0}>
								<AntecedentesPersonalesPatologicos
									consultorio={consultorio}
									colorBase={colorBase}
									historiaClinica={historiaClinica}
									commitHistoriaClinica={commitHistoriaClinica}
									findConsultorio={findConsultorio} />
							</TabPanel>
							<TabPanel value={value} index={1}>
								<AntecedentesPersonalesNoPatologicos
									consultorio={consultorio}
									colorBase={colorBase}
									historiaClinica={historiaClinica}
									commitHistoriaClinica={commitHistoriaClinica}
									findConsultorio={findConsultorio} />
							</TabPanel>
							<TabPanel value={value} index={2}>
								<AntecedentesHeredofamiliares
									consultorio={consultorio}
									colorBase={colorBase}
									historiaClinica={historiaClinica}
									commitHistoriaClinica={commitHistoriaClinica}
									findConsultorio={findConsultorio} />
							</TabPanel>
							<TabPanel value={value} index={3}>
								<SignosVitales
									consultorio={consultorio}
									colorBase={colorBase}
									historiaClinica={historiaClinica}
									commitHistoriaClinica={commitHistoriaClinica}
									findConsultorio={findConsultorio} />
							</TabPanel>
							<TabPanel value={value} index={4}>
								<Alergias
									consultorio={consultorio}
									colorBase={colorBase}
									historiaClinica={historiaClinica}
									commitHistoriaClinica={commitHistoriaClinica}
									findConsultorio={findConsultorio}/>
							</TabPanel>
							<TabPanel value={value} index={5}>
								<ExpedienteElectronico
									consultorio={consultorio}
									colorBase={colorBase}
									historiaClinica={historiaClinica}
									commitHistoriaClinica={commitHistoriaClinica}
									findConsultorio={findConsultorio} />
							</TabPanel>
						</Paper>
					</Grid>
					: ''
				}

			</Grid>
		</Fragment>
	);
};
