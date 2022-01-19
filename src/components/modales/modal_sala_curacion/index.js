import React from 'react';
import * as Yup from "yup";
import ModalFormSalaCuracion from './ModalFormSalaCuracion';
import { Formik } from 'formik';

const validationSchema = Yup.object({
  nombre: Yup.string("Ingresa los nombres")
        .required("Los nombres del pacientes son requeridos")
});

const ModalSalaCuracion = (props) => {
  const {
    open,
    onClose,
    salaCuracion,
    handleClickGuardar,
  } = props;

  const values = {
    _id: salaCuracion._id,
    nombre: salaCuracion.nombre
  }

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema} >
      {
        props => <ModalFormSalaCuracion
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClickCancel={onClose}
        salaCuracion={salaCuracion}
        onClickGuardar={handleClickGuardar}
        {...props} />
      }
    </Formik>
  );
}

export default ModalSalaCuracion;