import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AntecedentesPersonalesNoPatologicosContainer } from "./antecedentes_personales_no_patologicos";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from "react-router-dom";
import { createAntecedentesPersonalesNoPatologicos, updateAntecedentesPersonalesNoPatologicos } from "../../../../services/u-sgcm-ficha-clinica/antecedentes_personales_no_patologicos";

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

const AntecedentesPersonalesNoPatologicos = (props) => {

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
	const [antecedentesPersonalesNoPatologicos, setAntecedentesPersonalesNoPatologicos] = useState({})

	const handleCloseAlert = () => {
		setOpenAlert(false)
	};

	const handleChange = (event) => {
		setAntecedentesPersonalesNoPatologicos({
			...antecedentesPersonalesNoPatologicos,
			[event.target.name]: event.target.value.toUpperCase()
		})
	}

	const handleClickGuardar = async() => {
		let responseAntecedentesPersonalesPatologicos = {}
		if (!antecedentesPersonalesNoPatologicos._id) {
			responseAntecedentesPersonalesPatologicos = await createAntecedentesPersonalesNoPatologicos(antecedentesPersonalesNoPatologicos)
			if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				historiaClinica.antecedentes_personales_no_patologicos = responseAntecedentesPersonalesPatologicos.data._id
				await commitHistoriaClinica()
			}
		} else {
			responseAntecedentesPersonalesPatologicos = await updateAntecedentesPersonalesNoPatologicos(antecedentesPersonalesNoPatologicos._id, antecedentesPersonalesNoPatologicos)
			if (`${responseAntecedentesPersonalesPatologicos.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				findConsultorio()
			}
		}
	}

	const loadAll = async () => {
		setIsLoading(true)

		setAntecedentesPersonalesNoPatologicos(historiaClinica.antecedentes_personales_no_patologicos ? historiaClinica.antecedentes_personales_no_patologicos : {}) 

		setIsLoading(false)
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<AntecedentesPersonalesNoPatologicosContainer
						consultorio={consultorio}
						colorBase={colorBase}
						antecedentesPersonalesNoPatologicos={antecedentesPersonalesNoPatologicos}
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

export default AntecedentesPersonalesNoPatologicos;