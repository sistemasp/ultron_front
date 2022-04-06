import React from "react";
import {
  Paper,
  Grid,
} from "@material-ui/core";
import { Fragment } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import myStyles from "../../../css";
import TableComponent from "../../../components/table/TableComponent";
import ModalCuracion from "../../../components/modales/enfermeria/curacion";

export const MenuCuracionesContainer = (props) => {

  const {
    filterDate,
    onChangeFilterDate,
    // TABLE DATA
    titulo,
    columns,
    curaciones,
    actions,
    options,
    components,
    colorBase,
    // MODAL
    openModal,
    curacion,
    onClickCancel,
    enfermera,
  } = props;

  const classes = myStyles(colorBase)();

  return (
    <Fragment>
      {
        openModal ?
          <ModalCuracion
            open={openModal}
            curacion={curacion}
            enfermera={enfermera}
            onClose={onClickCancel} /> : ''
      }
      <Grid container spacing={1} className={classes.container_main}>
        <Grid item xs={12}>
          <Paper>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid
                container
                justify="center"
                alignItems="center" >
                <KeyboardDatePicker
                  disableToolbar
                  loadingIndicator
                  autoOk
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline-filter"
                  label="FILTRADO CURACIÓN"
                  value={filterDate}
                  onChange={onChangeFilterDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }} />
              </Grid>
            </MuiPickersUtilsProvider>

            <TableComponent
              titulo={titulo}
              columns={columns}
              data={curaciones}
              actions={actions}
              options={options}
              components={components} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
