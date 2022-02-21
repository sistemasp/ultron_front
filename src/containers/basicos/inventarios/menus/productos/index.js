import React, { useState, useEffect, Fragment } from "react";
import { Backdrop, CircularProgress} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import myStyles from "../../../../../css";
import { ProductosContainer } from "./productos";
import { showAllProductos } from "../../../../../services/centinela/productos";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Productos = (props) => {

	const classes = myStyles();

    const [productos, setProductos] = useState([]);
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
		{ title: 'CÓDIGO', field: 'codigo' },
		{ title: 'DESCRIPCION', field: 'descripcion' },
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

    const loadProductos = async() => {
        const response = await showAllProductos();
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            console.log("KAOZ", response);
            setProductos(response.data);
        }
    };

    const loadAll = async () => {
        setIsLoading(true);
        console.log("KAOZ", "TODO");
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

export default Productos;