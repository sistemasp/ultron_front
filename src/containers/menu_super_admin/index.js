import React, { useState, Fragment, useEffect } from "react";
import { MenuSuperAdminContainer } from "./menu_super_admin";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { showAllCatalogos } from "../../services/catalogos";
import myStyles from "../../css";
import { showAllLaboratorios } from "../../services/laboratorios";
import { showAllProductoComercials } from "../../services/productos_comerciales";
import { showAllOcupacions } from "../../services/ocupacion";
import { showAllEspecialidades } from "../../services/especialidades";
import { addZero } from "../../utils/utils";
import { getAllServices } from "../../services/servicios";
import { getAllTreatments } from "../../services/tratamientos";
import { findEmployeesByRolIdAvailable } from "../../services/empleados";

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuSuperAdmin = (props) => {

    const classes = myStyles();

    const laboratoriosCatalogoId = process.env.REACT_APP_LABORATORIOS_CATALOGO_ID;
    const productoComercialCatalogoId = process.env.REACT_APP_PRODUCTO_COMERCIAL_CATALOGO_ID;
    const ocupacionCatalogoId = process.env.REACT_APP_OCUPACION_CATALOGO_ID;
    const especialidadCatalogoId = process.env.REACT_APP_ESPECIALIDAD_CATALOGO_ID;
    const dermatologosCatalogoId = process.env.REACT_APP_DERMATOLOGOS_CATALOGO_ID;
    const serviciosCatalogoId = process.env.REACT_APP_SERVICIOS_CATALOGO_ID;
    const tratamientosCatalogoId = process.env.REACT_APP_TRATAMIENTOS_CATALOGO_ID;

    const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;

    const [catalogos, setCatalogos] = useState([]);
    const [data, setData] = useState([]);
    const [catalogo, setCatalogo] = useState({});
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [isLoading, setIsLoading] = useState(true);

    const {
        sucursal,
        empleado,
        history,
    } = props;

    const loadLaboratorios = async () => {
        const response = await showAllLaboratorios();
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setData(response.data);
        }
    }

    const loadProductosComerciales = async () => {
        const response = await showAllProductoComercials();
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setData(response.data);
        }
    }

    const loadOcupaciones = async () => {
        const response = await showAllOcupacions();
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setData(response.data);
        }
    }

    const loadEspecialidades = async () => {
        const response = await showAllEspecialidades();
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setData(response.data);
        }
    }

    const loadDermatologos = async () => {
        const response = await findEmployeesByRolIdAvailable(dermatologoRolId, empleado.access_token);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            response.data.forEach(item => {
                const fecha_ingreso = new Date(item.fecha_ingreso);
                const fecha_ingreso_show = `${addZero(fecha_ingreso.getDate())}/${addZero(Number(fecha_ingreso.getMonth() + 1))}/${fecha_ingreso.getFullYear()}`;
                const fecha_baja = new Date(item.fecha_baja);
                const fecha_baja_show = `${addZero(fecha_baja.getDate())}/${addZero(Number(fecha_baja.getMonth() + 1))}/${fecha_baja.getFullYear()}`;
                item.fecha_ingreso = fecha_ingreso_show;
                item.fecha_baja = item.fecha_baja ? fecha_baja_show : 'VIGENTE';
            });
            setData(response.data);
        }
    }

    const loadServicios = async () => {
        const response = await getAllServices();
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setData(response.data);
        }
    }

    const loadTratamientos = async () => {
        const response = await getAllTreatments();
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setData(response.data);
        }
    }

    const searchData = async (catalogo) => {
        setIsLoading(true);
        switch (catalogo._id) {
            case laboratoriosCatalogoId:
                await loadLaboratorios();
                break;
            case productoComercialCatalogoId:
                await loadProductosComerciales();
                break;
            case ocupacionCatalogoId:
                await loadOcupaciones();
                break;
            case especialidadCatalogoId:
                await loadEspecialidades();
                break;
            case dermatologosCatalogoId:
                await loadDermatologos();
                break;
            case serviciosCatalogoId:
                await loadServicios();
                break;
            case tratamientosCatalogoId:
                await loadTratamientos();
                break;
        }
        setIsLoading(false);
    }

    const handleClickCatalogo = (e, catalogoItem) => {
        searchData(catalogoItem);
        setCatalogo(catalogoItem);
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const loadCatalogos = async () => {
        const response = await showAllCatalogos();
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            setCatalogos(response.data);
        }
    }

    const loadAll = async () => {
        setIsLoading(true);
        await loadCatalogos();
        setIsLoading(false);
    }

    useEffect(() => {
        loadAll();
    }, []);

    return (
        <Fragment>
            {
                !isLoading ?
                    <MenuSuperAdminContainer
                        empleado={empleado}
                        sucursal={sucursal}
                        onClickCatalogo={handleClickCatalogo}
                        catalogos={catalogos}
                        catalogo={catalogo}
                        data={data}
                        setMessage={setMessage}
                        setSeverity={setSeverity}
                        setOpenAlert={setOpenAlert} />
                    : <Backdrop className={classes.backdrop} open={isLoading} >
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

export default MenuSuperAdmin;