import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { SignosVitalesContainer } from "./signos_vitales";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from "react-router-dom";
import { createSignosVitales, updateSignosVitales } from "../../../../services/u-sgcm-ficha-clinica/signos_vitales";
import { addZero, dateToString } from "../../../../utils/utils";

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
		historiaClinica,
		commitHistoriaClinica,
		findConsultorio,
	} = props

	const [openAlert, setOpenAlert] = useState(false)
	const [message, setMessage] = useState('')
	const [severity, setSeverity] = useState('success')
	const [isLoading, setIsLoading] = useState(true)
    const [signosVitales, setSignosVitales] = useState({})

	const titulo = "HISTORIAL SIGNOS VITALES"
    const columns = [
		{ title: 'FECHA', field: 'fecha' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'TENSION ARTERIAL', field: 'tension_arterial' },
		{ title: 'FRECUENCIA RESPIRATORIA', field: 'frecuencia_respiratoria' },
		{ title: 'FRECUENCIA CARDIACA', field: 'frecuencia_cardiaca' },
		{ title: 'TEMPERATURA', field: 'temperatura' },
		{ title: 'PESO', field: 'peso' },
		{ title: 'ALTURA', field: 'altura' },
		{ title: 'IMC', field: 'imc' }
	]

	const dataComplete = !signosVitales.tension_arterial || !signosVitales.frecuencia_respiratoria || !signosVitales.frecuencia_cardiaca || !signosVitales.temperatura
		|| !signosVitales.peso || !signosVitales.altura || !signosVitales.imc

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
	}

	const handleChange = (event) => {
		setSignosVitales({
			...signosVitales,
			[event.target.name]: event.target.value.toUpperCase()
		})
	}

	const handleChangeAltura = (event) => {
		const peso = (signosVitales.peso ? signosVitales.peso : 0)
		const altura = event.target.value
		const imc = (peso / (altura * altura)) * 10000
		setSignosVitales({
			...signosVitales,
			altura: altura,
			imc: imc.toString().slice(0, 5)
		})
	}

	const handleChangePeso = (event) => {
		const peso = event.target.value
		const altura = (signosVitales.altura ? signosVitales.altura : 0)
		const imc = (peso / (altura * altura)) * 10000
		setSignosVitales({
			...signosVitales,
			peso: peso,
			imc: imc.toString().slice(0, 5)
		})
	}

	const hadleClickGuardar = async() => {
		setIsLoading(true)
		signosVitales.create_date = new Date()
		const responseSignosVitales = await createSignosVitales(signosVitales)
		if (`${responseSignosVitales.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			const signosVitalesArray = [
				...historiaClinica.signos_vitales,
				responseSignosVitales.data._id
			]
			historiaClinica.signos_vitales = signosVitalesArray
			await commitHistoriaClinica()
		}
		setIsLoading(false)
	}

	const loadAll = async () => {
		setIsLoading(true)
		if (historiaClinica.signos_vitales) {
			historiaClinica.signos_vitales.forEach(signoVital => {
				const fecha = new Date(signoVital.create_date);
				signoVital.fecha = dateToString(fecha)
				signoVital.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`
				signoVital.temperatura = `${signoVital.temperatura} C°`
				signoVital.peso = `${signoVital.peso} KG`
				signoVital.altura = `${signoVital.altura} CM`
			})
			historiaClinica.signos_vitales.sort((a, b) => {
				if (a.create_date > b.create_date) return -1;
				if (a.create_date < b.create_date) return 1;
				return 0;
			});
			setSignosVitales(historiaClinica.signos_vitales)
		}
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
						options={options}
						onClickGuardar={hadleClickGuardar} 
						onChange={handleChange}
						onChangeAltura={handleChangeAltura}
						onChangePeso={handleChangePeso}
						dataComplete={dataComplete} /> :
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