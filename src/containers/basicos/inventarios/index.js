import React, { Fragment, useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { MenuContainer } from "./menu";

const InventariosForm = (props) => {

  const {
    sucursal,
    empleado,
    colorBase,
  } = props;

  const classes = props;

  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const token = empleado.access_token;

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const loadAll = async () => {
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <MenuContainer
            value={value}
            empleado={empleado}
            onChangeTab={handleChangeTab}
            colorBase={colorBase}
            sucursal={sucursal} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>
  );
}

export default InventariosForm;
