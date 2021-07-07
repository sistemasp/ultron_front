import React, { Fragment } from 'react';
import TableComponent from '../../../components/table/TableComponent';
import { makeStyles, Grid } from '@material-ui/core';
import ModalConsultorio from '../../../components/modales/modal_consultorio';
import ModalConsultorioAgregarDermatologo from '../../../components/modales/modal_consultorio_agregar_dermatologo';
import ModalCabina from '../../../components/modales/modal_cabina';
import ModalSalaCirugia from '../../../components/modales/modal_sala_cirugia';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import myStyles from '../../../css';

export const ConsultorioContainer = (props) => {

  const {
    tituloConsultorio,
    tituloCabina,
    columnsConsultorio,
    columnsCabina,
    consultorios,
    consultorio,
    cabinas,
    cabina,
    tituloSalaCirugia,
    columnsSalaCirugia,
    salaCirugias,
    salaCirugia,
    actionsSalaCirugia,
    actionsConsultorio,
    actionsCabina,
    options,
    openModalConsultorio,
    openModalCabina,
    openModalSalaCirugia,
    handleOpenConsultorio,
    handleOpenCabina,
    handleOpenSalaCirugia,
    handleClose,
    handleClickGuardarConsultorio,
    handleClickGuardarCabina,
    handleClickGuardarSalaCirugia,
    openModalAsignar,
    setOpenAlert,
    setMessage,
    loadConsultorios,
    empleado,
    colorBase,
  } = props;

  console.log("KAOZ", empleado);
  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      {
        openModalConsultorio ?
          <ModalConsultorio
            open={openModalConsultorio}
            empleado={empleado}
            onClose={handleClose}
            consultorio={consultorio}
            handleClickGuardar={handleClickGuardarConsultorio}
            setOpenAlert={setOpenAlert}
            colorBase={colorBase}
            setMessage={setMessage} /> : ''
      }
      {
        openModalCabina ?
          <ModalCabina
            open={openModalCabina}
            onClose={handleClose}
            cabina={cabina}
            empleado={empleado}
            handleClickGuardar={handleClickGuardarCabina}
            setOpenAlert={setOpenAlert}
            colorBase={colorBase}
            setMessage={setMessage} /> : ''
      }
      {
        openModalSalaCirugia ?
          <ModalSalaCirugia
            open={openModalSalaCirugia}
            empleado={empleado}
            onClose={handleClose}
            salaCirugia={salaCirugia}
            handleClickGuardar={handleClickGuardarSalaCirugia}
            setOpenAlert={setOpenAlert}
            colorBase={colorBase}
            setMessage={setMessage} /> : ''
      }
      {
        openModalAsignar ?
          <ModalConsultorioAgregarDermatologo
            open={openModalAsignar}
            onClose={handleClose}
            empleado={empleado}
            consultorio={consultorio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            colorBase={colorBase}
            loadConsultorios={loadConsultorios} /> : ''
      }

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          {
            empleado.super_admin ?
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={handleOpenConsultorio}
                text='NUEVO CONSULTORIO' />
              : ''
          }


          <TableComponent
            titulo={tituloConsultorio}
            columns={columnsConsultorio}
            data={consultorios}
            actions={actionsConsultorio}
            options={options} />
        </Grid>

        <Grid item xs={12} sm={4}>

          {
            empleado.super_admin ?
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={handleOpenCabina}
                text='NUEVA CABINA' />
              : ''
          }

          <TableComponent
            titulo={tituloCabina}
            columns={columnsCabina}
            data={cabinas}
            actions={actionsCabina}
            options={options} />
        </Grid>
        <Grid item xs={12} sm={4}>
          {
            empleado.super_admin ?
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={handleOpenSalaCirugia}
                text='NUEVA SALA DE CIRUGÍA' />
              : ''
          }


          <TableComponent
            titulo={tituloSalaCirugia}
            columns={columnsSalaCirugia}
            data={salaCirugias}
            actions={actionsSalaCirugia}
            options={options} />
        </Grid>
      </Grid>

    </Fragment >
  );
}
