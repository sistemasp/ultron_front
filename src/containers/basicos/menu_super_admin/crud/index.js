import { Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Select, TablePagination } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import myStyles from "../../../../css";
import { CrudContainer } from "./crud";
import EditIcon from '@material-ui/icons/Edit';

const Crud = (props) => {
    const serviciosCatalogoId = process.env.REACT_APP_SERVICIOS_CATALOGO_ID;

    const {
        catalogo,
        data,
        loadCatalogos,
        empleado,
        setMessage,
        setSeverity,
        setOpenAlert,
        colorBase,
    } = props;
    
    const classes = myStyles(colorBase)();

    const [openModal, setOpenModal] = useState(false);
    const [openModalServicios, setOpenModalServicios] = useState(false);
    const [item, setItem] = useState({});

    const handleClicKNuevo = () => {
        switch (catalogo._id) {
            case serviciosCatalogoId:
                setOpenModalServicios(true)
                break;
            default:
                setOpenModal(true);
        }
    }

    const handleCloseModal = () => {
        setItem({});
        setOpenModal(false);
        setOpenModalServicios(false);
    };

    const handleClicKEditar = (event, rowData) => {
        setItem(rowData);
        switch (catalogo._id) {
            case serviciosCatalogoId:
                setOpenModalServicios(true)
                break;
            default:
                setOpenModal(true);
        }
    }

    const { columns } = catalogo;

    const actions = [
        {
            icon: EditIcon,
            tooltip: 'EDITAR',
            onclick: handleClicKEditar,
        },
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
        paging: true,
    }

    const onChangeActions = (e, rowData) => {
        const action = e.target.value;
        switch (action) {
            case 'EDITAR':
                handleClicKEditar(e, rowData);
                break;

        }
    }

    const components = {
        Pagination: props => {
            return <TablePagination
                {...props}
                rowsPerPageOptions={[5, 10, 20, 30, data.length]}
            />
        },
        Actions: props => {
            return props.actions.length > 0
                ? <Fragment>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-hora"></InputLabel>
                        <Select
                            labelId="simple-select-outlined-actions"
                            id="simple-select-outlined-actions"
                            onChange={(e) => onChangeActions(e, props.data)}
                            label="ACCIONES">
                            {
                                props.actions.map((item, index) => {
                                    return <MenuItem
                                        key={index}
                                        value={item.tooltip}
                                    >{item.tooltip}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </Fragment>
                : ''
        }
    };

    return (
        <Fragment>
            <CrudContainer
                catalogo={catalogo}
                data={data}
                item={item}
                loadCatalogos={loadCatalogos}
                empleado={empleado}
                onClicKNuevo={handleClicKNuevo}
                onCloseModal={handleCloseModal}
                columns={columns}
                actions={actions}
                options={options}
                components={components}
                openModal={openModal}
                openModalServicios={openModalServicios}
                setMessage={setMessage}
                setSeverity={setSeverity}
                setOpenAlert={setOpenAlert}
                colorBase={colorBase}
            />
        </Fragment>
    );
}

export default Crud;