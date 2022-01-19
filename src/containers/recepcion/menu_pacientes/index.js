import React, { useState, Fragment } from "react";
import { MenuContainer } from "./menu";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from "react-router-dom";

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuPatient = (props) => {

    const navigate = useNavigate();

    const [pacienteAgendado, setPacienteAgendado] = useState({});
    const [consultaAgendada, setConsultaAgendada] = useState({});
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const {
        sucursal,
        empleado,
        colorBase,
        turno,
    } = props;

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const handleAgendarFaciales = (event, rowData) => {
        setPacienteAgendado(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_FACIALES));
    }

    const handleAgendarAparatologia = (event, rowData) => {
        setPacienteAgendado(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_APARATOLOGIA));
    }

    const handleAgendarDermapen = (event, rowData) => {
        setConsultaAgendada(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_DERMAPEN));
    }

    const handleClickAgendarConsulta = (event, rowData) => {
        setPacienteAgendado(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_CONSULTA));
    }

    const handleClickAgendarCuracion = (event, rowData) => {
        setConsultaAgendada(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_CURACION));
    }

    const handleClickAgendarEstetica = (event, rowData) => {
        setConsultaAgendada(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_ESTETICA));
    }

    const handleLogout = () => {
        navigate('/', {
            state: {
                empleado: {},
                sucursal: {},
            }
        });
    }

    const handleClickCambioPassword = () => {
        setOpen(true);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Fragment>
            <MenuContainer
                pacienteAgendado={pacienteAgendado}
                setPacienteAgendado={setPacienteAgendado}
                setConsultaAgendada={setConsultaAgendada}
                consultaAgendada={consultaAgendada}
                onChangeTab={handleChangeTab}
                onClickAgendarFaciales={handleAgendarFaciales}
                onClickAgendarConsulta={handleClickAgendarConsulta}
                onClickAgendarCuracion={handleClickAgendarCuracion}
                onClickAgendarEstetica={handleClickAgendarEstetica}
                onClickAgendarAparatologia={handleAgendarAparatologia}
                onClickAgendarDermapen={handleAgendarDermapen}
                empleado={empleado}
                sucursal={sucursal}
                colorBase={colorBase}
                open={open}
                onClickLogout={handleLogout}
                onClickCambioPassword={handleClickCambioPassword}
                onOpen={handleOpen}
                onClose={handleClose}
                value={value}
                setMessage={setMessage}
                setSeverity={setSeverity}
                setOpenAlert={setOpenAlert}
                turno={turno} />
            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default MenuPatient;