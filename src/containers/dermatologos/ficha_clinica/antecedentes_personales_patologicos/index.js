import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AntecedentesPersonalesPatologicosContainer } from "./antecedentes_personales_patologicos";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from "react-router-dom";
import { createAntecedentesPersonalesPatologicos, updateAntecedentesPersonalesPatologicos } from "../../../../services/u-sgcm-ficha-clinica/antecedentes_personales_patologicos";
import { createAppGenerales, updateAppGenerales } from "../../../../services/u-sgcm-ficha-clinica/app_general";
import { createAppPatologiasInfectocontagiosas, updateAppPatologiasInfectocontagiosas } from "../../../../services/u-sgcm-ficha-clinica/app_patologias_infectocontagiosas";
import { createAppPatologiasCronicoDegenerativas, updateAppPatologiasCronicoDegenerativas } from "../../../../services/u-sgcm-ficha-clinica/app_patologias_cronico_degenerativas";
import { createAppPatologiasExantematicas, updateAppPatologiasExantematicas } from "../../../../services/u-sgcm-ficha-clinica/app_patologias_exantematicas";

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
			if (!historiaClinica.antecedentes_personales_patologicos.app_generales) {
				const requestAppGenerales = {[event.target.name]: event.target.checked}
				const responseAppGeneral = await createAppGenerales(requestAppGenerales)
				if (`${responseAppGeneral.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					const requestAntecedentesPersonalesPatologicos = {
						...historiaClinica.antecedentes_personales_patologicos,
						app_generales: responseAppGeneral.data
					}
					const responseAntecedentesPersonalesPatologicos = await updateAntecedentesPersonalesPatologicos(requestAntecedentesPersonalesPatologicos._id, requestAntecedentesPersonalesPatologicos)
					if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
						findConsultorio()
					}
				}
			} else {
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

	const handleChangeCheckPatologiasInfectocontagiosas = async (event) => {
		setIsLoading(true)
		if (!historiaClinica.antecedentes_personales_patologicos) {
			const requestAppPatologiasInfectocontagiosas = {[event.target.name]: event.target.checked}
			const responseAppPatologiasInfectocontagiosas = await createAppPatologiasInfectocontagiosas(requestAppPatologiasInfectocontagiosas)
			if (`${responseAppPatologiasInfectocontagiosas.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				const requestAntecedentesPersonalesPatologicos = {app_patologias_infectocontagiosas: responseAppPatologiasInfectocontagiosas.data}
				const responseAntecedentesPersonalesPatologicos = await createAntecedentesPersonalesPatologicos(requestAntecedentesPersonalesPatologicos)
				if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					historiaClinica.antecedentes_personales_patologicos = responseAntecedentesPersonalesPatologicos.data._id
					await commitHistoriaClinica()
				}
			}
		} else {
			if (!historiaClinica.antecedentes_personales_patologicos.app_patologias_infectocontagiosas) {
				const requestAppPatologiasInfectocontagiosas = {[event.target.name]: event.target.checked}
				const responseAppPatologiasInfectocontagiosas = await createAppPatologiasInfectocontagiosas(requestAppPatologiasInfectocontagiosas)
				if (`${responseAppPatologiasInfectocontagiosas.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					const requestAntecedentesPersonalesPatologicos = {
						...historiaClinica.antecedentes_personales_patologicos,
						app_patologias_infectocontagiosas: responseAppPatologiasInfectocontagiosas.data
					}
					const responseAntecedentesPersonalesPatologicos = await updateAntecedentesPersonalesPatologicos(requestAntecedentesPersonalesPatologicos._id, requestAntecedentesPersonalesPatologicos)
					if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
						findConsultorio()
					}
				}
			} else {
				const requestAppPatologiasInfectocontagiosas = {
					...historiaClinica.antecedentes_personales_patologicos.app_patologias_infectocontagiosas,
					[event.target.name]: event.target.checked
				}
				const responseAppPatologiasInfectocontagiosas = await updateAppPatologiasInfectocontagiosas(requestAppPatologiasInfectocontagiosas._id, requestAppPatologiasInfectocontagiosas)
				if (`${responseAppPatologiasInfectocontagiosas.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
					findConsultorio()
				}
			}
		}

		setIsLoading(false)
	}

	const handleChangeCheckPatologiasCronicoDegenerativas = async (event) => {
		setIsLoading(true)
		if (!historiaClinica.antecedentes_personales_patologicos) {
			const requestAppPatologiasCronicoDegenerativas = {[event.target.name]: event.target.checked}
			const responseAppPatologiasCronicoDegenerativas = await createAppPatologiasCronicoDegenerativas(requestAppPatologiasCronicoDegenerativas)
			if (`${responseAppPatologiasCronicoDegenerativas.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				const requestAntecedentesPersonalesPatologicos = {app_patologias_cronico_degenerativas: responseAppPatologiasCronicoDegenerativas.data}
				const responseAntecedentesPersonalesPatologicos = await createAntecedentesPersonalesPatologicos(requestAntecedentesPersonalesPatologicos)
				if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					historiaClinica.antecedentes_personales_patologicos = responseAntecedentesPersonalesPatologicos.data._id
					await commitHistoriaClinica()
				}
			}
		} else {
			if (!historiaClinica.antecedentes_personales_patologicos.app_patologias_cronico_degenerativas) {
				const requestAppPatologiasCronicoDegenerativas = {[event.target.name]: event.target.checked}
				const responseAppPatologiasCronicoDegenerativas = await createAppPatologiasCronicoDegenerativas(requestAppPatologiasCronicoDegenerativas)
				if (`${responseAppPatologiasCronicoDegenerativas.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					const requestAntecedentesPersonalesPatologicos = {
						...historiaClinica.antecedentes_personales_patologicos,
						app_patologias_cronico_degenerativas: responseAppPatologiasCronicoDegenerativas.data
					}
					const responseAntecedentesPersonalesPatologicos = await updateAntecedentesPersonalesPatologicos(requestAntecedentesPersonalesPatologicos._id, requestAntecedentesPersonalesPatologicos)
					if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
						findConsultorio()
					}
				}
			} else {
				const requestAppPatologiasCronicoDegenerativas = {
					...historiaClinica.antecedentes_personales_patologicos.app_patologias_cronico_degenerativas,
					[event.target.name]: event.target.checked
				}
				const responseAppPatologiasCronicoDegenerativas = await updateAppPatologiasCronicoDegenerativas(requestAppPatologiasCronicoDegenerativas._id, requestAppPatologiasCronicoDegenerativas)
				if (`${responseAppPatologiasCronicoDegenerativas.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
					findConsultorio()
				}
			}
		}

		setIsLoading(false)
	}

	const handleChangeCheckPatologiasExantematicas = async (event) => {
		setIsLoading(true)
		if (!historiaClinica.antecedentes_personales_patologicos) {
			const requestAppPatologiasExantematicas = {[event.target.name]: event.target.checked}
			const responseAppPatologiasExantematicas = await createAppPatologiasExantematicas(requestAppPatologiasExantematicas)
			if (`${responseAppPatologiasExantematicas.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				const requestAntecedentesPersonalesPatologicos = {app_patologias_exantematicas: responseAppPatologiasExantematicas.data}
				const responseAntecedentesPersonalesPatologicos = await createAntecedentesPersonalesPatologicos(requestAntecedentesPersonalesPatologicos)
				if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					historiaClinica.antecedentes_personales_patologicos = responseAntecedentesPersonalesPatologicos.data._id
					await commitHistoriaClinica()
				}
			}
		} else {
			if (!historiaClinica.antecedentes_personales_patologicos.app_patologias_exantematicas) {
				const requestAppPatologiasExantematicas = {[event.target.name]: event.target.checked}
				const responseAppPatologiasExantematicas = await createAppPatologiasExantematicas(requestAppPatologiasExantematicas)
				if (`${responseAppPatologiasExantematicas.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					const requestAntecedentesPersonalesPatologicos = {
						...historiaClinica.antecedentes_personales_patologicos,
						app_patologias_exantematicas: responseAppPatologiasExantematicas.data
					}
					const responseAntecedentesPersonalesPatologicos = await updateAntecedentesPersonalesPatologicos(requestAntecedentesPersonalesPatologicos._id, requestAntecedentesPersonalesPatologicos)
					if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
						findConsultorio()
					}
				}
			} else {
				const requestAppPatologiasExantematicas = {
					...historiaClinica.antecedentes_personales_patologicos.app_patologias_exantematicas,
					[event.target.name]: event.target.checked
				}
				const responseAppPatologiasExantematicas = await updateAppPatologiasExantematicas(requestAppPatologiasExantematicas._id, requestAppPatologiasExantematicas)
				if (`${responseAppPatologiasExantematicas.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
					findConsultorio()
				}
			}
		}

		setIsLoading(false)
	}

	const handleChange = (event) => {
		setAntecedentesPersonalesPatologicos({
			...antecedentesPersonalesPatologicos,
			[event.target.name]: event.target.value.toUpperCase()
		})
	}

	const handleClickGuardar = async() => {
		const responseAntecedentesPersonalesPatologicos = await updateAntecedentesPersonalesPatologicos(antecedentesPersonalesPatologicos._id, antecedentesPersonalesPatologicos)
		if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			findConsultorio()
		}
	}

	const handleCloseAlert = () => {
		setOpenAlert(false)
	};

	const loadAll = async () => {
		setIsLoading(true)

		if (historiaClinica.antecedentes_personales_patologicos) {
			setAntecedentesPersonalesPatologicos(historiaClinica.antecedentes_personales_patologicos)
			setAppGenerales(historiaClinica.antecedentes_personales_patologicos.app_generales ? historiaClinica.antecedentes_personales_patologicos.app_generales : {})
			setAppPatologiasCronoDejenerativas(historiaClinica.antecedentes_personales_patologicos.app_patologias_cronico_degenerativas ? historiaClinica.antecedentes_personales_patologicos.app_patologias_cronico_degenerativas : {})
			setAppPatologiasExantematicas(historiaClinica.antecedentes_personales_patologicos.app_patologias_exantematicas ? historiaClinica.antecedentes_personales_patologicos.app_patologias_exantematicas : {})
			setAppPatologiasInfectocontagiosas(historiaClinica.antecedentes_personales_patologicos.app_patologias_infectocontagiosas ? historiaClinica.antecedentes_personales_patologicos.app_patologias_infectocontagiosas : {})
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
						antecedentesPersonalesPatologicos={antecedentesPersonalesPatologicos}
						app_generales={app_generales}
						app_patologias_infectocontagiosas={app_patologias_infectocontagiosas}
						app_patologias_cronico_degenerativas={app_patologias_cronico_degenerativas}
						app_patologias_exantematicas={app_patologias_exantematicas}
						onChangeCheckGenerales={handleChangeCheckGenerales}
						onChangeCheckPatologiasInfectocontagiosas={handleChangeCheckPatologiasInfectocontagiosas}
						onChangeCheckPatologiasCronicoDegenerativas={handleChangeCheckPatologiasCronicoDegenerativas}
						onChangeCheckPatologiasExantematicas={handleChangeCheckPatologiasExantematicas}
						onChange={handleChange}
						onClickGuardar={handleClickGuardar} /> :
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