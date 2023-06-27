import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AntecedentesHeredofamiliaresContainer } from "./antecedentes_heredofamiliares";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from "react-router-dom";
import { createAntecedentesHeredofamiliares, updateAntecedentesHeredofamiliares } from "../../../../services/u-sgcm-ficha-clinica/antecedentes_heredofamiliares";

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

const AntecedentesHeredofamiliares = (props) => {

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
	const [antecedentesHeredofamiliares, setAntecedentesHeredofamiliares] = useState({})

	const handleCloseAlert = () => {
		setOpenAlert(false)
	};

	const handleChangeCheck = async (event) => {
		setIsLoading(true)
		if (!historiaClinica.antecedentes_heredofamiliares) {
			const requestAntecedentesHeredofamiliares = { [event.target.name]: event.target.checked }
			const responseAntecedentesHeredofamiliares = await createAntecedentesHeredofamiliares(requestAntecedentesHeredofamiliares)
			if (`${responseAntecedentesHeredofamiliares.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				historiaClinica.antecedentes_heredofamiliares = responseAntecedentesHeredofamiliares.data._id
				await commitHistoriaClinica()
			}
		} else {
			const requestAntecedentesHeredofamiliares = {
				...historiaClinica.antecedentes_heredofamiliares,
				[event.target.name]: event.target.checked 
			}
			const responseAntecedentesHeredofamiliares = await updateAntecedentesHeredofamiliares(requestAntecedentesHeredofamiliares._id, requestAntecedentesHeredofamiliares)
			if (`${responseAntecedentesHeredofamiliares.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				findConsultorio()
			}
		}
		setIsLoading(false)
	}

	const loadAll = async () => {
		setIsLoading(true)
		setAntecedentesHeredofamiliares(historiaClinica.antecedentes_heredofamiliares ? historiaClinica.antecedentes_heredofamiliares : {} )
		setIsLoading(false)
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<AntecedentesHeredofamiliaresContainer
						consultorio={consultorio}
						colorBase={colorBase}
						antecedentesHeredofamiliares={antecedentesHeredofamiliares}
						onChangeCheck={handleChangeCheck} /> :
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

export default AntecedentesHeredofamiliares;