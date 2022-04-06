import React, { useState, useEffect, Fragment } from "react";
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import myStyles from "../../../../../css";
import { ProductosContainer } from "./productos";
import { showAllProductos } from "../../../../../services/centinela/productos";
import EditIcon from '@material-ui/icons/Edit';
import { productoMaximoSucursal, productoMinimoSucursal } from "../../../../../utils/utils";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Productos = (props) => {

	const [productos, setProductos] = useState([]);
	const [producto, setProducto] = useState({});
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

	const classes = myStyles(colorBase)();

	const columns = [
		{ title: 'CÓDIGO', field: 'codigo' },
		{ title: 'DESCRIPCION', field: 'descripcion' },
		{ title: 'MAXIMO', field: 'maximo_sucursal' },
		{ title: 'MINIMO', field: 'minimo_sucursal' },
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
		setProducto(rowData);
		setOpen(true);
	}

	const handleOnClickShowKardex = (event, rowData) => {
		console.log("KAOZ", event, rowData);
	}

	const actions = [
		{
			icon: EditIcon,
			tooltip: 'EDITAR',
			onClick: handleOnClickEditar
		},
		{
			icon: EditIcon,
			tooltip: 'KARDEX',
			onClick: handleOnClickShowKardex
		},
	];

	const onChangeActions = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'EDITAR':
				handleOnClickEditar(e, rowData);
				break;
			case 'KARDEX':
				handleOnClickShowKardex(e, rowData);
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

	const loadProductos = async () => {
		const response = await showAllProductos();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const resProductos = response.data;
			response.data.forEach(resProducto => {
				resProducto.maximo_sucursal = productoMaximoSucursal(resProducto, sucursal._id);
				resProducto.minimo_sucursal = productoMinimoSucursal(resProducto, sucursal._id);
			});
			setProductos(resProductos);
		}
	};

	const loadAll = async () => {
		setIsLoading(true);
		await loadProductos();
		setIsLoading(false);
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<ProductosContainer
						empleado={empleado}
						columns={columns}
						titulo='PRODUCTOS'
						productos={productos}
						producto={producto}
						options={options}
						open={open}
						actions={actions}
						components={components}
						handleOpen={handleOpen}
						handleClose={handleClose}
						loadProductos={loadProductos}
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

export default Productos;