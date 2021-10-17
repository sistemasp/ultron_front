import React, { Fragment } from 'react';
import TableComponent from '../../../components/table/TableComponent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import ModalConsultorioAgregarPaciente from '../../../components/modales/modal_consultorio_agregar_paciente';
import ModalCabinaAgregarPaciente from '../../../components/modales/modal_cabina_agregar_paciente';
import ModalCuracionAgregarPaciente from '../../../components/modales/modal_curacion_agregar_paciente';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import myStyles from '../../../css';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#FFFFFF'
  },
  formControl: {
    width: '100%',
    margin: '5px',
  },
}));

export const ListaEsperaContainer = (props) => {

  const {
    empleado,
    tituloConsultorios,
    tituloCabinas,
    tituloEsperaConsultas,
    tituloEsperaTratamientos,
    columnsConsultorios,
    columnsCabinas,
    columnsEspera,
    columnsEsperaConsultas,
    consultorios,
    cabinas,
    listaEsperaConsultas,
    listaEsperaFaciales,
    listaEsperaDermapens,
    listaEsperaLasers,
    listaEsperaAparatologias,
    listaEsperaCuraciones,
    optionsEspera,
    optionsConsultorio,
    actionsEsperaConsultorio,
    actionsEsperaCabina,
    actionsConsultorio,
    actionsCabina,
    openModalConsultorioAsignar,
    openModalCabinaAsignar,
    openModalSalaCuracionAsignar,
    tipo_servicio,
    servicio,
    handleClose,
    setOpenAlert,
    setMessage,
    loadAll,
    sucursal,
    cambio,
    paciente,
    tituloSalaCuracion,
    columnsSalaCuraciones,
    salaCuraciones,
    actionsSalaCuracion,
    tituloEsperaSalaCuracion,
    listaEsperaEstetica,
    actionsEsperaSalaCuracion,
    componentsConsultorio,
    colorBase,
    onClickActualizar,
  } = props;

  const classes = myStyles(colorBase)();

  const listaEsperaConsultasAll = [...listaEsperaConsultas, ...listaEsperaEstetica, ...listaEsperaCuraciones]
  const listaEsperaTratamientos = [...listaEsperaFaciales, ...listaEsperaLasers, ...listaEsperaAparatologias, ...listaEsperaDermapens];

  listaEsperaConsultasAll.sort((a, b) => {
    if (a.create_date < b.create_date) return -1;
    if (a.create_date > b.create_date) return 1;
    return 0;
  });

  return (
    <Fragment>
      {
        openModalConsultorioAsignar ?
          <ModalConsultorioAgregarPaciente
            open={openModalConsultorioAsignar}
            onClose={handleClose}
            tipo_servicio={tipo_servicio}
            servicio={servicio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            loadAll={loadAll}
            sucursal={sucursal}
            empleado={empleado}
            colorBase={colorBase}
            cambio={cambio}
            paciente={paciente} /> : ''
      }

      {
        openModalCabinaAsignar ?
          <ModalCabinaAgregarPaciente
            open={openModalCabinaAsignar}
            onClose={handleClose}
            empleado={empleado}
            tipo_servicio={tipo_servicio}
            servicio={servicio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            loadAll={loadAll}
            sucursal={sucursal}
            cambio={cambio}
            colorBase={colorBase}
            paciente={paciente} />
          : ''
      }

      {
        openModalSalaCuracionAsignar ?
          <ModalCuracionAgregarPaciente
            open={openModalSalaCuracionAsignar}
            onClose={handleClose}
            empleado={empleado}
            tipo_servicio={tipo_servicio}
            servicio={servicio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            loadAll={loadAll}
            sucursal={sucursal}
            cambio={cambio}
            colorBase={colorBase}
            paciente={paciente} />
          : ''
      }

      <h1>LISTA DE ESPERA</h1>

      <Grid container spacing={3}>

        <Grid item xs={12} sm={12} className={classes.grid_center}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={() => onClickActualizar()}
            text='ACTUALIZAR' />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TableComponent
            titulo={tituloEsperaConsultas}
            columns={columnsEsperaConsultas}
            data={listaEsperaConsultasAll}
            actions={actionsEsperaConsultorio}
            options={optionsEspera} />
          <br />
          <TableComponent
            titulo={tituloEsperaTratamientos}
            columns={columnsEspera}
            data={listaEsperaTratamientos}
            actions={actionsEsperaCabina}
            options={optionsEspera} />
          <br />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TableComponent
            titulo={tituloConsultorios}
            columns={columnsConsultorios}
            data={consultorios}
            actions={actionsConsultorio}
            options={optionsConsultorio} />
          <br />
          <TableComponent
            titulo={tituloCabinas}
            columns={columnsCabinas}
            data={cabinas}
            actions={actionsCabina}
            options={optionsConsultorio} />
          <br />
          <TableComponent
            titulo={tituloSalaCuracion}
            columns={columnsSalaCuraciones}
            data={salaCuraciones}
            actions={actionsSalaCuracion}
            options={optionsConsultorio} />
        </Grid>
      </Grid>

    </Fragment>
  );
}
