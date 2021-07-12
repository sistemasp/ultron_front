import React, { useEffect, useState, Fragment } from "react";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import { CalendarioContainer } from "./calendario";
import { showAllAparatologiasBySucursalPendiente } from "../../../services/aparatolgia";
import { showAllConsultsBySucursalPendiente } from "../../../services/consultas";
import { showAllFacialBySucursalPendiente } from "../../../services/faciales";

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Calendario = (props) => {

    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [values, setValues] = useState({
        aparatologias: false,
        consultas: false,
        faciales: false,
    })

    const {
        empleado,
        sucursal,
        colorBase,
    } = props;

    const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
    const confirmadoStatusId = process.env.REACT_APP_CONFIRMADO_STATUS_ID;

    const parseToEvents = (citas) => {
        return citas.map(cita => {
            const startDate = new Date(cita.fecha_hora);
            const endDate = new Date(cita.fecha_hora);
            const minutos = Number(endDate.getMinutes()) + Number(cita.tiempo ? cita.tiempo : 15);
            endDate.setMinutes(minutos);
            const tratamientos = cita.tratamientos ? cita.tratamientos.map(tratamiento => {
                return `${tratamiento.nombre}, `;
            }) : `${cita.dermatologo.nombre}`;
            return {
                id: cita._id,
                title: tratamientos,
                start: startDate,
                end: endDate,
                servicio: cita.servicio
            }
        });
    }

    const createEvents = (citas) => {
        setEvents(parseToEvents(citas));
    }


    const loadAparatologias = async () => {
        const response = await showAllAparatologiasBySucursalPendiente(sucursal, pendienteStatusId, confirmadoStatusId, empleado.access_token);

        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            createEvents(response.data);
        }
    }

    const loadConsultas = async () => {
        const response = await showAllConsultsBySucursalPendiente(sucursal, pendienteStatusId, confirmadoStatusId, empleado.access_token);

        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setEvents(parseToEvents(response.data));
        }
    }

    const loadFaciales = async () => {
        const response = await showAllFacialBySucursalPendiente(sucursal, pendienteStatusId, confirmadoStatusId, empleado.access_token);

        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setEvents(parseToEvents(response.data));
        }
    }

    const handleChangeAparatologias = async (event, val) => {
        setIsLoading(true);
        setValues({
            aparatologias: val,
            consultas: false,
            faciales: false
        });
        if (val) {
            await loadAparatologias();
        } else {
            createEvents([]);
        }
        setIsLoading(false);
    }

    const handleChangeConsultas = async (event, val) => {
        setIsLoading(true);
        setValues({
            aparatologias: false,
            consultas: val,
            faciales: false
        });
        if (val) {
            await loadConsultas();
        } else {
            createEvents([]);
        }
        setIsLoading(false);
    }

    const handleChangeFaciales = async (event, val) => {
        setIsLoading(true);
        setValues({
            aparatologias: false,
            consultas: false,
            faciales: val
        });
        if (val) {
            await loadFaciales();
        } else {
            createEvents([]);
        }
        setIsLoading(false);
    }

    return (
        <Fragment>
            {
                isLoading
                    ? <Backdrop className={classes.backdrop} open={isLoading} >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    : <CalendarioContainer
                        values={values}
                        events={events}
                        onChangeAparatologias={handleChangeAparatologias}
                        onChangeConsultas={handleChangeConsultas}
                        onChangeFaciales={handleChangeFaciales} />
            }
        </Fragment>
    );
}

export default Calendario;