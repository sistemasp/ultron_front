import React, { useState, Fragment, useEffect } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { MainEnfermeriaContainer } from "./main";
import { useLocation, useNavigate } from "react-router-dom";

const Alert = (props) => {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuMainEnfermeria = (props) => {

	const location = useLocation();
	const navigate = useNavigate();

	const [value, setValue] = useState(0);
	const [openModalPassword, setOpenModalPassword] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		enfermera,
		sucursal,
	} = location.state;

	const handleChangeTab = (event, newValue, close) => {
		setValue(newValue);
		close();
	};

	const handleLogout = () => {
		navigate('/', {
            state: {
                enfermera: {},
                sucursal: {},
            }
        });
	}

	const handleClickCambioPassword = () => {
		setOpenModalPassword(true);
	}

	const handleOpen = () => {
		setOpenModalPassword(true);
	}

	const handleClose = () => {
		setOpenModalPassword(false);
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	return (
		<Fragment>
			<Fragment>
				<MainEnfermeriaContainer
					enfermera={enfermera}
					sucursal={sucursal}
					value={value}
					onChangeTab={handleChangeTab}
					onClickLogout={handleLogout} />
			</Fragment>
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default MenuMainEnfermeria;