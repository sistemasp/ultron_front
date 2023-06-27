import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from "react-router-dom";
import { AlergiasContainer } from "./alergias";
import { createAlergias, updateAlergias } from "../../../../services/u-sgcm-ficha-clinica/alergias";


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

const Alergias = (props) => {

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
	const [alergias, setAlergias] = useState({})

	const handleCloseAlert = () => {
		setOpenAlert(false)
	}

	const handleChangeCheck = async (event) => {
		setIsLoading(true)
		if (!historiaClinica.alergias) {
			const requestAlergias = { [event.target.name]: event.target.checked }
			const responseAlergias = await createAlergias(requestAlergias)
			if (`${responseAlergias.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				historiaClinica.alergias = responseAlergias.data._id
				await commitHistoriaClinica()
			}
		} else {
			const requestAlergias = {
				...historiaClinica.alergias,
				[event.target.name]: event.target.checked 
			}
			const responseAlergias = await updateAlergias(requestAlergias._id, requestAlergias)
			if (`${responseAlergias.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				findConsultorio()
			}
		}
		setIsLoading(false)
	}

	const handleChange = (event) => {
		setAlergias({
			...alergias,
			[event.target.name]: event.target.value.toUpperCase()
		})
	}

	const handleClickGuardar = async() => {
		let responseAlergias = {}
		console.log("KAOZ", alergias);
		if (!alergias._id) {
			responseAlergias = await createAlergias(alergias)
			if (`${responseAlergias.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				historiaClinica.alergias = responseAlergias.data._id
				await commitHistoriaClinica()
			}
		} else {
			responseAlergias = await updateAlergias(alergias._id, alergias)
			if (`${responseAlergias.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				findConsultorio()
			}
		}
	}

	const loadAll = async () => {
		setIsLoading(true)
		setAlergias(historiaClinica.alergias ? historiaClinica.alergias : {}) 
		setIsLoading(false)
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<AlergiasContainer
						consultorio={consultorio}
						colorBase={colorBase}
						alergias={alergias} 
						onChangeCheck={handleChangeCheck}
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

export default Alergias;