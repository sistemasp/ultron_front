import React, { Fragment } from 'react';
import TableComponent from '../../../components/table/TableComponent';
import { Grid, makeStyles } from '@material-ui/core';
import ModalPaciente from '../../../components/modales/modal_paciente';
import MenuHistoricos from '../../../components/modales/modal_historico';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import { baseUrl } from '../../../services';
import myStyles from '../../../css';
import PagosAnticipados from '../../../components/modales/pagos_anticipados';

export const PacientesContainer = (props) => {

  const {
    empleado,
    titulo,
    columns,
    paciente,
    sucursal,
    actions,
    components,
    options,
    open,
    openHistoric,
    openPagosAnticipados,
    handleOpen,
    handleClose,
    onClickGuardar,
    onClickcConsulta,
    colorBase,
    setIsLoading,
  } = props;

  const classes = myStyles(colorBase)();

  const pacientes = query =>
  new Promise((resolve, reject) => {
      const url = `${baseUrl}/paciente/remote?per_page=${query.pageSize}&page=${query.page + 1}&search=${query.search}`
      fetch(url, {
        headers: {
          Authorization: `Bearer ${empleado.access_token}`
        }
      })
        .then(response => response.json())
        .then(result => {
          resolve({
            data: result.data,
            page: result.page - 1,
            totalCount: result.total,
          })
        })
    });

const pacientesSucrusal = () => {
  setIsLoading(true);
  const JsonFields = ["Nombre","Email","Genero","Fecha nacimiento"]

  let csvStr = JsonFields.join(",") + "\n";

  const url = `${baseUrl}/paciente/`
  fetch(url, {
    headers: {
      Authorization: `Bearer ${empleado.access_token}`
    }
  })
    .then(response => response.json())
    .then(result => {
      result.forEach(({nombres, apellidos, email, sexo, fecha_nacimiento}) => {
        const Name          = nombres +' '+ apellidos;
        const Email         = email ? email : 'NA';
        const Gender        = sexo ? sexo.nombre : 'NA';
        const Date          = fecha_nacimiento;
    
        csvStr += Name + ',' + Email + ',' + Gender + ','  + Date + "\n";
      })

      const exportName = 'Pacientes_' + new Date().toLocaleDateString('es-MX');
      var dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(csvStr);
      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", exportName + ".csv");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setIsLoading(false);
    })
}

  return (
    <Fragment>
      {
        open ?
          <ModalPaciente
            open={open}
            onClose={handleClose}
            paciente={paciente}
            sucursal={sucursal}
            onClickGuardar={onClickGuardar}
            onClickcConsulta={onClickcConsulta}
            colorBase={colorBase}
            empleadoId={empleado._id} /> : ''
      }
      {
        openHistoric ?
          <MenuHistoricos
            open={openHistoric}
            onClose={handleClose}
            paciente={paciente}
            colorBase={colorBase}
            empleado={empleado} /> : ''
      }
      {
        openPagosAnticipados ? 
        <PagosAnticipados
            open={openPagosAnticipados}
            onClose={handleClose}
            paciente={paciente}
            colorBase={colorBase}
            sucursal={sucursal}
            empleado={empleado} /> : ''
      }
      <Grid container>
        <Grid item xs={12} sm={4}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpen}
            text='NUEVO PACIENTE' />
        </Grid>

        <Grid style={{marginLeft: 10}} item xs={12} sm={4}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={pacientesSucrusal}
            text='Obtener Pacientes' />
        </Grid>

        <Grid item xs={12}>
          <TableComponent
            titulo={titulo}
            columns={columns}
            data={pacientes}
            actions={actions}
            options={options}
            components={components} />
        </Grid>

      </Grid>
    </Fragment>
  );
}
