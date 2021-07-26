import React, { useState, Fragment, useEffect } from "react";
import { PagosAnticipadosContainer } from "./FormPagosAnticipados";
import { getAllServices } from "../../../services/servicios";
import { showAllPagoAnticipadosByPaciente } from "../../../services/pagos_anticipados";

const PagosAnticipados = (props) => {

    const [value, setValue] = useState(0);
    const [pagosAnticipados, setPagosAnticipados] = useState([]);
    const {
        sucursal,
        empleado,
        paciente,
        open,
        onClose,
        colorBase,
    } = props;

    const token = empleado.access_token;

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const loadPagosAnticipados = async () => {
        const response = await showAllPagoAnticipadosByPaciente(paciente._id, token);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setPagosAnticipados(response.data);
        }
    }

    const loadAll = async () => {
        await loadPagosAnticipados();
    }
    useEffect(() => {
        loadAll();
    }, []);

    return (
        <Fragment>
            <PagosAnticipadosContainer
                onChangeTab={handleChangeTab}
                empleado={empleado}
                sucursal={sucursal}
                open={open}
                value={value}
                paciente={paciente}
                token={token}
                onClickCancel={onClose}
                colorBase={colorBase}
                pagosAnticipados={pagosAnticipados} />
        </Fragment>
    );
}

export default PagosAnticipados;