import React, { useState, Fragment, useEffect } from "react";
import { PagosAnticipadosContainer } from "./FormPagosAnticipados";
import { getAllServices } from "../../../services/servicios";
import { deletePagoAnticipado, showAllPagoAnticipadosByPaciente } from "../../../services/pagos_anticipados";
import { dateToString, toFormatterCurrency } from "../../../utils/utils";
import TableComponent from "../../table/TableComponent";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { rolAdministracionId, rolDiosSupremoId, rolDirectorId, rolEncargadoCosmetologasId, rolEncargadoSucursalId, rolMasterId, rolSistemasId, rolSupervisorId } from "../../../utils/constants";
import { deleteEntrada } from "../../../services/entradas";
import { deletePago } from "../../../services/pagos";
import { deleteSesionAnticipada } from "../../../services/sesiones_anticipadas";

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
    const [isLoading, setIsLoading] = useState(true);

    const token = empleado.access_token;

    const columns = [
        { title: 'FECHA PAGO', field: 'fecha_pago_show' },
        { title: 'SUCURSAL', field: 'sucursal.nombre' },
        { title: 'SESIONES', field: 'sesiones_totales' },
        { title: 'SESIONES TOMADAS', field: 'sesiones_tomadas' },
        { title: 'PRECIO', field: 'precio_moneda' },
        { title: 'TOTAL', field: 'total_moneda' },
        { title: 'OBSERVACIONES', field: 'observaciones' },
    ];

    const options = {
        rowStyle: rowData => {
            return {
                color: rowData.fecha_asistencia ? '#FF0000' : '#000000',
            };
        },
        headerStyle: {
            backgroundColor: colorBase,
            color: '#FFF',
            fontWeight: 'bolder',
            fontSize: '18px'
        },
        exportAllData: true,
        exportButton: true,
        exportDelimiter: ';'
    };

    const columnsDetails = [
        { title: 'FECHA ASISTENCIA', field: 'fecha_asistencia_show' },
        { title: 'NÚMERO DE SESIÓN', field: 'numero_sesion' },
        { title: 'SERVICIO', field: 'servicio.nombre' },
        { title: 'PRODUCTO (ÁREAS)', field: 'producto' },
        { title: 'PRECIO', field: 'precio_moneda' },
        { title: 'DESCUENTO PORCENTAJE', field: 'descuento_porcentaje' },
        { title: 'DESCUENTO CANTIDAD', field: 'descuento_moneda' },
        { title: 'TOTAL', field: 'total_moneda' },
    ];

    const optionsDetails = {
        rowStyle: rowData => {
            return {
                color: rowData.fecha_asistencia ? '#FF0000' : '#000000',
            };
        },
        headerStyle: {
            backgroundColor: colorBase,
            color: '#FFF',
            fontWeight: 'bolder',
            fontSize: '18px'
        },
        exportAllData: true,
        exportButton: true,
        exportDelimiter: ';',
        search: false,
        showTitle: false,
        toolbar: false,
        paging: false,
        draggable: false,
    };

    const detailPanel = [
        {
            tooltip: 'SESIONES ANTICIPADAS',
            render: rowData => {
                return (
                    <Fragment>
                        <TableComponent
                            title='SESIONES ANTICIPADAS'
                            columns={columnsDetails}
                            data={rowData.sesiones_anticipadas}
                            options={optionsDetails} />
                    </Fragment>
                )
            },
        }
    ];

    const loadPagosAnticipados = async () => {
        const response = await showAllPagoAnticipadosByPaciente(paciente._id, token);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            const pagosAnticipadosResponse = response.data;
            pagosAnticipadosResponse.map((item) => {
                item.hasDelete = hasDelete(item.sesiones_anticipadas);
                item.fecha_pago_show = dateToString(item.fecha_pago);
                item.precio_moneda = toFormatterCurrency(item.precio);
                item.total_moneda = toFormatterCurrency(item.total);
                item.sesiones_totales = item.sesiones_anticipadas.length;
                let sesionesTomadas = 0;
                item.sesiones_anticipadas.map((sesion_anticipada) => {
                    sesionesTomadas += sesion_anticipada.fecha_asistencia ? 1 : 0;
                    sesion_anticipada.fecha_pago_show = dateToString(sesion_anticipada.fecha_pago);
                    sesion_anticipada.fecha_asistencia_show = sesion_anticipada.fecha_asistencia ? dateToString(sesion_anticipada.fecha_asistencia) : 'PENDIENTE';
                    sesion_anticipada.precio_moneda = toFormatterCurrency(sesion_anticipada.precio);
                    sesion_anticipada.descuento_porcentaje = `${sesion_anticipada.porcentaje_descuento_clinica} %`;
                    sesion_anticipada.descuento_moneda = toFormatterCurrency(sesion_anticipada.descuento_clinica);
                    sesion_anticipada.total_moneda = toFormatterCurrency(sesion_anticipada.total);
                    sesion_anticipada.producto = sesion_anticipada.tratamientos.map(tratamiento => {
                        const show_areas = tratamiento.areasSeleccionadas.map(area => {
                            return `${area.nombre}`;
                        });
                        return `►${tratamiento.nombre}(${show_areas}) `;
                    });
                });
                item.sesiones_tomadas = sesionesTomadas;
            });
            setPagosAnticipados(response.data);
        }
    }

    const loadAll = async () => {
        await loadPagosAnticipados();
    }

    const handleEliminarSalida = async (event, rowData) => {
        setIsLoading(true);
        rowData.sesiones_anticipadas.forEach(sesion_anticipada => {
            sesion_anticipada.pagos.forEach(pago => {
                deleteEntrada(pago.entrada, token);
                deletePago(pago._id, token);
            });
            deleteSesionAnticipada(sesion_anticipada._id, token);
        });
        rowData.pagos.forEach(pago => {
            deleteEntrada(pago.entrada, token);
            deletePago(pago._id, token);
        });
        deletePagoAnticipado(rowData._id, token);
        loadAll();
        setIsLoading(false);
    }

    const actions = [
        rowData => {
            return {
                icon: rowData.hasDelete ? DeleteForeverIcon : HelpOutlineIcon,
                tooltip: rowData.hasDelete ? 'ELIMINAR PAGO ANTICIPADO' : 'NO SE PUEDE ELIMINAR',
                onClick: rowData.hasDelete ? handleEliminarSalida : null
            }
        },
    ];

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const hasDelete = (sesionesAnticipadas) => {
        let del = true;
        if (empleado.rol._id === rolDirectorId || empleado.rol._id === rolEncargadoSucursalId ||
            empleado.rol._id === rolEncargadoCosmetologasId || empleado.rol._id === rolAdministracionId ||
            empleado.rol._id === rolDiosSupremoId || empleado.rol._id === rolMasterId ||
            empleado.rol._id === rolSistemasId || empleado.rol._id === rolSupervisorId) {
            del = true;
        } else {
            del = false;
        }
        sesionesAnticipadas.forEach(sesion => {
            if (sesion.fecha_asistencia) {
                del = false;
            }
        });
        return del;
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
                titulo={'PAGOS ANTICIPADOS'}
                columns={columns}
                options={options}
                pagosAnticipados={pagosAnticipados}
                actions={actions}
                detailPanel={detailPanel} />
        </Fragment>
    );
}

export default PagosAnticipados;