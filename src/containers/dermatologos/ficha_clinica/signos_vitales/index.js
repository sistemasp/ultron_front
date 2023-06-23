import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { SignosVitalesContainer } from "./signos_vitales";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from "react-router-dom";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	pagago: {
		color: '#11A532',
	},
	no_pagago: {
		color: '#DC3132',
	},
}));

const SignosVitales = (props) => {

	const classes = useStyles()

	const navigate = useNavigate()

	const {
		consultorio,
		colorBase,
	} = props

	const [openAlert, setOpenAlert] = useState(false)
	const [message, setMessage] = useState('')
	const [severity, setSeverity] = useState('success')
	const [isLoading, setIsLoading] = useState(true)
    const [signosVitales, setSignosVitales] = useState({})

	const titulo = "HISTORIAL SIGNOS VITALES"
    const columns = [
		{ title: 'FECHA', field: 'consecutivo' },
		{ title: 'HORA', field: 'turno' },
		{ title: 'TENSION ARTERIAL', field: 'hora' },
		{ title: 'FRECUENCIA RESPIRATORIA', field: 'paciente_nombre' },
		{ title: 'FRECUENCIA CARDIACA', field: 'telefono' },
		{ title: 'TEMPERATURA', field: 'show_tratamientos' },
		{ title: 'PESO', field: 'observaciones' },
		{ title: 'ALTURA', field: 'nombre' },
		{ title: 'IMC', field: 'nombre' }
	]
	
    const options = {
		headerStyle: {
			backgroundColor: colorBase,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		cellStyle: {
			fontWeight: 'bolder',
			fontSize: '16px',
			padding: '5px',
			textAlign: 'center',
		},
		paging: false,
	}

	const handleCloseAlert = () => {
		setOpenAlert(false)
	};

	const loadAll = async () => {
		setIsLoading(true)

		setIsLoading(false)
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<SignosVitalesContainer
						consultorio={consultorio}
						colorBase={colorBase}
						titulo={titulo}
						columns={columns}
						signosVitales={signosVitales}
						options={options} /> :
					<Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default SignosVitales;