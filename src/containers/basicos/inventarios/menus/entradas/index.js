import React, { useState, useEffect, Fragment } from "react";
import { Backdrop, CircularProgress } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import myStyles from "../../../../../css";
import { EntradasContainer } from "./entradas";
import { showAllEntradas } from "../../../../../services/centinela/entradas";
import { dateToString, toFormatterCurrency } from "../../../../../utils/utils";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Entradas = (props) => {

	const classes = myStyles();

	const [entradas, setEntradas] = useState([]);
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [openAlert, setOpenAlert] = useState(false);

	const {
		empleado,
		colorBase,
		sucursal,
	} = props;

	const columns = [
		{ title: 'CÓDIGO', field: 'producto.codigo' },
		{ title: 'DESCRIPCION', field: 'producto.descripcion' },
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'UNIDAD', field: 'unidad.descripcion' },
		{ title: 'CANTIDAD', field: 'cantidad' },
		{ title: 'IMPORTE', field: 'importe_moneda' },
		{ title: 'DESCUENTO', field: 'descuento_moneda' },
		{ title: 'SUBTOTAL', field: 'subtotal_moneda' },
		{ title: 'TOTAL', field: 'total_moneda' },
	];

	const options = {
		headerStyle: {
			backgroundColor: colorBase,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px',
			textAlign: 'center',
		},
		cellStyle: {
			fontWeight: 'bolder',
			fontSize: '16px',
			padding: '5px',
			textAlign: 'center',
		},
		exportAllData: true,
		exportButton: empleado.super_admin,
		exportDelimiter: ';',
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const loadEntradas = async () => {
		const response = await showAllEntradas();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const resEntradas = response.data;
			resEntradas.forEach(item => {
				item.fecha_show = dateToString(item.fecha);
				item.importe_moneda = toFormatterCurrency(item.importe);
				item.descuento_moneda = toFormatterCurrency(item.descuento);
				item.subtotal_moneda = toFormatterCurrency(item.subtotal);
				item.total_moneda = toFormatterCurrency(item.total);
			});
			setEntradas(response.data);
		}
	};

	const loadAll = async () => {
		setIsLoading(true);
		await loadEntradas();
		setIsLoading(false);
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<EntradasContainer
						empleado={empleado}
						columns={columns}
						titulo='PRODUCTOS'
						productos={entradas}
						options={options}
						open={open}
						sucursal={sucursal}
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

export default Entradas;