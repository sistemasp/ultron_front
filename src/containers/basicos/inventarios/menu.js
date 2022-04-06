import React from "react";
import PropTypes from 'prop-types';
import {
  Paper,
  Grid,
  AppBar,
  Tabs,
  Tab,
  makeStyles,
} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Fragment } from "react";
import myStyles from "../../../css";
import Productos from "./menus/productos";
import Existencias from "./menus/existencias";
import Facturas from "./menus/facturas";
import Entradas from "./menus/entradas";
import Salidas from "./menus/salidas";
import Traspasos from "./menus/traspasos";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const MenuContainer = (props) => {

  const {
    value,
    empleado,
    onChangeTab,
    colorBase,
    sucursal,
  } = props;

  const useStyles = makeStyles(theme => ({
		root: {
			flexGrow: 1,
			backgroundColor: theme.palette.background.paper,
		}
	}));

  const classes = myStyles(colorBase)();
  const classess = useStyles();

  return (
    <div className={classess.root}>
      <AppBar
				className={classes.bar}
				position="sticky" />
        <Tabs
          value={value}
          onChange={onChangeTab}
          aria-label="simple tabs"
          variant="scrollable"
          scrollButtons="on" >
          <Tab label="PRODUCTOS" {...a11yProps(0)} />
          <Tab label="EXISTENCIAS" {...a11yProps(1)} />
          <Tab label="FACTURAS" {...a11yProps(2)} />
          <Tab label="TRASPASOS" {...a11yProps(3)} />
          {/* <Tab label="ENTRADAS" {...a11yProps(4)} />
          <Tab label="SALIDAS" {...a11yProps(5)} /> */}
        </Tabs>
        <TabPanel value={value} index={0}>
          <Productos
            empleado={empleado}
            sucursal={sucursal}
            colorBase={colorBase} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Existencias
            empleado={empleado}
            colorBase={colorBase} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Facturas
            empleado={empleado}
            colorBase={colorBase} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Traspasos
            empleado={empleado}
            colorBase={colorBase} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Entradas
            empleado={empleado}
            colorBase={colorBase} />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Salidas
            empleado={empleado}
            colorBase={colorBase} />
        </TabPanel>
    </div>
  );
};
