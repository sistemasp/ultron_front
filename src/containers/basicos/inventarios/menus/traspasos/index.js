import React, { useState, useEffect, Fragment } from "react";
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import myStyles from "../../../../../css";
import { TraspasosContainer } from "./traspasos";
import { showAllFacturas } from "../../../../../services/centinela/facturas";
import { dateToString } from "../../../../../utils/utils";
import EditIcon from '@material-ui/icons/Edit';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Traspasos = (props) => {

	const classes = myStyles();

	const [facturas, setFacturas] = useState([]);
	const [factura, setFactura] = useState({});
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
		{ title: 'FACTURA', field: 'factura' },
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'ALMACEN', field: 'almacen.descripcion' },
		{ title: 'PROVEEDOR', field: 'proveedor.nombre' },
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

	const handleOnClickEditar = (event, rowData) => {
		setFactura(rowData);
		setOpen(true);
	}

	const handleOnClickEliminar = (event, rowData) => {
	
	}

	const actions = [
		{
			icon: EditIcon,
			tooltip: 'EDITAR',
			onClick: handleOnClickEditar
		},
		{
			icon: EditIcon,
			tooltip: 'ELIMINAR',
			onClick: handleOnClickEliminar
		},
	];

	const onChangeActions = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'EDITAR':
				handleOnClickEditar(e, rowData);
				break;
			case 'ELIMINAR':
				handleOnClickEliminar(e, rowData);
				break;
		}
	}

	const components = {
		Actions: props => {
			return props.actions.length > 0
				? <Fragment>
					<FormControl variant="outlined" className={classes.formControl}>
						<Select
							labelId="simple-select-outlined-actions"
							id="simple-select-outlined-actions"
							onChange={(e) => onChangeActions(e, props.data)}
							label="ACCIONES">
							{
								props.actions.map((item, index) => {
									return <MenuItem
										key={index}
										value={item.tooltip}
									>{item.tooltip}</MenuItem>
								})
							}
						</Select>
					</FormControl>
				</Fragment>
				: ''
		}
	};

	const handleOpen = () => {
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const loadFacturas = async () => {
		const response = await showAllFacturas();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const resFacturas = response.data.forEach(item => {
				item.fecha_show = dateToString(item.fecha);
			});
			setFacturas(response.data);
		}
	};

	const loadAll = async () => {
		setIsLoading(true);
		await loadFacturas();
		setIsLoading(false);
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<TraspasosContainer
						empleado={empleado}
						columns={columns}
						titulo='FACTURAS'
						facturas={facturas}
						factura={factura}
						options={options}
						actions={actions}
						components={components}
						handleOpen={handleOpen}
						handleClose={handleClose}
						loadFacturas={loadFacturas}
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

export default Traspasos;