import React, { Fragment } from 'react';
import TableComponent from '../../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalRazonSocial from '../../../components/modales/modal_razon_social';
import myStyles from '../../../css';

export const RazonSocialContainer = (props) => {

  const {
    titulo,
    columns,
    razonSociales,
    razonSocial,
    actions,
    options,
    open,
    openHistoric,
    handleOpen,
    handleClose,
    loadRazonSocial,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      {
        open ? 
        <ModalRazonSocial
          open={open}
          onClose={handleClose}
          razonSocial={razonSocial}
          colorBase={colorBase}
          loadRazonSocial={loadRazonSocial} /> : ''
      }

      <ButtonCustom 
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={handleOpen}
        text='Nuevo razon social' />
        
      <TableComponent
        titulo={titulo}
        columns={columns}
        data={razonSociales}
        actions={actions}
        options={options} />
    </Fragment>
  );
}
