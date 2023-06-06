import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AntecedentesPersonalesPatologicosContainer } from "./antecedentes_personales_patologicos";
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

const AntecedentesPersonalesPatologicos = (props) => {

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
					<AntecedentesPersonalesPatologicosContainer
						consultorio={consultorio}
						colorBase={colorBase} /> :
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