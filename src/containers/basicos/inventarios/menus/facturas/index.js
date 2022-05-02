import React, { useState, useEffect, Fragment } from "react";
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import myStyles from "../../../../../css";
import { FacturasContainer } from "./facturas";
import {
	showAllFacturas,
	createFactura,
} from "../../../../../services/centinela/facturas";
import { dateToString } from "../../../../../utils/utils";
import EditIcon from '@material-ui/icons/Edit';
import { responseCodeCreate, responseCodeOK } from "../../../../../utils/constants";
import { toFormatterCurrency } from '../../../../../utils/utils';
import { 
	centinelaAlmacenOcciId,
	centinelaProveedorOtroId
} from "../../../../../utils/centinela_constants";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Facturas = (props) => {

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

	const token = empleado.access_token;

	const columns = [
		{ title: 'FACTURA', field: 'factura' },
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'PROVEEDOR', field: 'proveedor.nombre' },
		{ title: 'CANTIDAD REGISTROS', field: 'cantidad_registros' },
		{ title: 'TOTAL', field: 'total_show' },
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

	const actions = [
		{
			icon: EditIcon,
			tooltip: 'EDITAR',
			onClick: handleOnClickEditar
		},
	];

	const onChangeActions = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'EDITAR':
				handleOnClickEditar(e, rowData);
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

	const handleOpen = async () => {
		setIsLoading(true);
		const factura = {
			proveedor: centinelaProveedorOtroId,
			almacen: centinelaAlmacenOcciId,
			factura: '',
			fecha: new Date(),
		}
		const response = await createFactura(factura);
		if (`${response.status}` === responseCodeCreate) {
			setFactura(response.data);
			setOpen(true);
			setIsLoading(false);
		}

	}

	const handleClose = () => {
		setOpen(false);
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	}

	const loadFacturas = async () => {
		const response = await showAllFacturas();
		if (`${response.status}` === responseCodeOK) {
			response.data.forEach(item => {
				item.fecha_show = dateToString(item.fecha);
				item.cantidad_registros = item.registros ? item.registros.length : 0;
				item.total_show = toFormatterCurrency(item.total);
			});
			setFacturas(response.data);
		}
	}

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
					<FacturasContainer
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

export default Facturas;