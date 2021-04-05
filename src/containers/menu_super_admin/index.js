import React, { useState, Fragment, useEffect } from "react";
import { MenuSuperAdminContainer } from "./menu_super_admin";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { showAllCatalogos } from "../../services/catalogos";
import myStyles from "../../css";
import { showAllLaboratorios } from "../../services/laboratorios";
import { showAllProductoComercials } from "../../services/productos_comerciales";

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuSuperAdmin = (props) => {

    const classes = myStyles();

    const laboratoriosCatalogoId = process.env.REACT_APP_LABORATORIOS_CATALOGO_ID;
    const productoComercialCatalogoId = process.env.REACT_APP_PRODUCTO_COMERCIAL_CATALOGO_ID;

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

    const searchData = async (catalogo) => {
        setIsLoading(true);
        switch (catalogo._id) {
            case laboratoriosCatalogoId:
                await loadLaboratorios();
                break;
            case productoComercialCatalogoId:
                await loadProductosComerciales();
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