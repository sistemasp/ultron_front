import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Multiselect } from 'multiselect-react-dropdown';
import { ButtonCustom } from '../../basic/ButtonCustom';
import myStyles from '../../../css';
import { ComboCustom } from '../../basic/ComboCustom';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflow: 'scroll',
    height: '70%',
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#FFFFFF',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
}));

const FormItemEstudio = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    handleSubmit,
    onClickCancel,
    open,
    analisismedicos,
    onChangeAnalisisMedicos,
    onClickAgregarEstudios,
    values,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.label}>
                <h1 className={classes.label}>{`ESTUDIOS`}</h1>
              </Grid>

              <Grid item xs={12} >
                <Multiselect
									options={analisismedicos} // Options to display in the dropdown
									displayValue="nombre" // Property name to display in the dropdown options
									onSelect={(e) => onChangeAnalisisMedicos(e)} // Function will trigger on select event
									onRemove={(e) => onChangeAnalisisMedicos(e)} // Function will trigger on remove event
									placeholder="ESTUDIOS"
									selectedValues={values.analisismedicos} // Preselected value to persist in dropdown
								/>
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClickCancel}
                  text='CERRAR' />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickAgregarEstudios(e, values)}
                  text='AGREGAR' />
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default FormItemEstudio;