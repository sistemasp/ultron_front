import React, { useState, useEffect, Fragment } from "react";
import { Backdrop, CircularProgress} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import myStyles from "../../../../../css";
import { ExistenciasContainer } from "./existencias";
import { showAllProductos } from "../../../../../services/centinela/productos";
import { showAllRegistros } from "../../../../../services/centinela/registros";
import { dateToString, toFormatterCurrency } from "../../../../../utils/utils";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Existencias = (props) => {

	const classes = myStyles();

    const [registros, setRegistros] = useState([]);
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
		{ title: 'UNIDAD ENTRADA', field: 'unidad_entrada.descripcion' },
		{ title: 'UNIDAD SALIDA', field: 'unidad_salida.descripcion' },
		{ title: 'CONTENIDO', field: 'contenido' },
		{ title: 'STOCK', field: 'stock' },
		{ title: 'FACTURA', field: 'factura.factura' },
		{ title: 'COSTO UNITARIO', field: 'costo_unitario_moneda' },
		{ title: 'LOTE', field: 'lote' },
		{ title: 'CADUCIDAD', field: 'caducidad_show' },
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

    const loadRegistros = async() => {
        const response = await showAllRegistros();
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const resRegistros = response.data;
			resRegistros.forEach(item => {
				item.costo_unitario_moneda = toFormatterCurrency(item.costo_unitario);
				item.caducidad_show = dateToString(item.caducidad);
			});
            setRegistros(resRegistros);
        }
    };

    const loadAll = async () => {
        setIsLoading(true);
        await loadRegistros();
        setIsLoading(false);
    }
  
    useEffect(() => {
      loadAll();
    }, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<ExistenciasContainer
						empleado={empleado}
						columns={columns}
						titulo='EXISTENCIAS'
                        productos={registros}
						options={options}
						open={open}
						sucursal={sucursal}
						colorBase={colorBase}/> :
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

export default Existencias;