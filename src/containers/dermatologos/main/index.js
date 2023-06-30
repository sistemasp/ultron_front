import React, { useState, Fragment, useEffect } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { MainDermatologosContainer } from "./main";
import { useLocation, useNavigate } from "react-router-dom";

const Alert = (props) => {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuMainDermatologos = (props) => {

	const location = useLocation();
	const navigate = useNavigate();

	const [pacienteAgendado, setPacienteAgendado] = useState({});
	const [value, setValue] = useState(0);
	const [openModalPassword, setOpenModalPassword] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		dermatologo,
		sucursal,
	} = location.state;

	const handleChangeTab = (event, newValue, close) => {
		setValue(newValue);
		close();
	};

	const handleAgendar = (event, rowData) => {
		setPacienteAgendado(rowData);
		setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_CONSULTA));
	}

	const handleLogout = () => {
		navigate('/', {
            state: {
                dermatologo: {},
                sucursal: {},
            }
        });
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	return (
		<Fragment>
			<Fragment>
				<MainDermatologosContainer
					dermatologo={dermatologo}
					sucursal={sucursal}
					value={value}
					onChangeTab={handleChangeTab}
					onClickLogout={handleLogout}
					setMessage={setMessage}
					setSeverity={setSeverity}
					setOpenAlert={setOpenAlert}/>
			</Fragment>
		
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default MenuMainDermatologos;