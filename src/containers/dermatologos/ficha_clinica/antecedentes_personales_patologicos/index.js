import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AntecedentesPersonalesPatologicosContainer } from "./antecedentes_personales_patologicos";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from "react-router-dom";
import { createAntecedentesPersonalesPatologicos } from "../../../../services/u-sgcm-ficha-clinica/antecedentes_personales_patologicos";
import { createAppGenerales, updateAppGenerales } from "../../../../services/u-sgcm-ficha-clinica/app_general";

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

const AntecedentesPersonalesPatologicos = (props) => {

	const classes = useStyles()

	const navigate = useNavigate()

	const {
		consultorio,
		colorBase,
		historiaClinica,
		setHistoriaClinica,
		commitHistoriaClinica,
		findConsultorio,
	} = props

	const [openAlert, setOpenAlert] = useState(false)
	const [message, setMessage] = useState('')
	const [severity, setSeverity] = useState('success')
	const [isLoading, setIsLoading] = useState(true)
	const [antecedentesPersonalesPatologicos, setAntecedentesPersonalesPatologicos] = useState({})

	const [app_generales, setAppGenerales] = useState({})
	const [app_patologias_infectocontagiosas, setAppPatologiasInfectocontagiosas] = useState({})
	const [app_patologias_cronico_degenerativas, setAppPatologiasCronoDejenerativas] = useState({})
	const [app_patologias_exantematicas, setAppPatologiasExantematicas] = useState({})

	const handleChangeCheckGenerales = async (event) => {
		setIsLoading(true)
		if (!historiaClinica.antecedentes_personales_patologicos) {
			const requestAppGeneral = {[event.target.name]: event.target.checked}
			const responseAppGeneral = await createAppGenerales(requestAppGeneral)
			if (`${responseAppGeneral.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				const requestAntecedentesPersonalesPatologicos = {app_generales: responseAppGeneral.data}
				const responseAntecedentesPersonalesPatologicos = await createAntecedentesPersonalesPatologicos(requestAntecedentesPersonalesPatologicos)
				if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					historiaClinica.antecedentes_personales_patologicos = responseAntecedentesPersonalesPatologicos.data._id
					await commitHistoriaClinica()
				}
			}
		} else {
			if (historiaClinica.antecedentes_personales_patologicos.app_generales) {
				const requestAppGeneral = {
					...historiaClinica.antecedentes_personales_patologicos.app_generales,
					[event.target.name]: event.target.checked
				}
				const responseAppGeneral = await updateAppGenerales(requestAppGeneral._id, requestAppGeneral)
				if (`${responseAppGeneral.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
					findConsultorio()
				}

			}

		}

		setIsLoading(false)
	}

	const handleCloseAlert = () => {
		setOpenAlert(false)
	};

	const loadAll = async () => {
		setIsLoading(true)

		if (historiaClinica.antecedentes_personales_patologicos) {
			setAntecedentesPersonalesPatologicos(historiaClinica.antecedentes_personales_patologicos)
			setAppGenerales(historiaClinica.antecedentes_personales_patologicos.app_generales)
			setAppPatologiasCronoDejenerativas(historiaClinica.antecedentes_personales_patologicos.app_patologias_cronico_degenerativas)
			setAppPatologiasExantematicas(historiaClinica.antecedentes_personales_patologicos.app_patologias_exantematicas)
			setAppPatologiasInfectocontagiosas(historiaClinica.antecedentes_personales_patologicos.app_patologias_infectocontagiosas)
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
					<AntecedentesPersonalesPatologicosContainer
						consultorio={consultorio}
						colorBase={colorBase}
						app_generales={app_generales}
						app_patologias_infectocontagiosas={app_patologias_infectocontagiosas}
						app_patologias_cronico_degenerativas={app_patologias_cronico_degenerativas}
						app_patologias_exantematicas={app_patologias_exantematicas}
						onChangeCheckGenerales={handleChangeCheckGenerales} /> :
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

export default AntecedentesPersonalesPatologicos;