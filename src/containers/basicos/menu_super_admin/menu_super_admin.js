import React from 'react';
import { Fragment } from 'react';
import { Grid, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import myStyles from '../../../css';
import Crud from './crud';
import { ListItemButton } from '@mui/material';

export const MenuSuperAdminContainer = props => {
	const {
		onClickCatalogo,
		catalogos,
		catalogo,
		loadCatalogos,
		data,
		empleado,
		setMessage,
		setSeverity,
		setOpenAlert,
		sucursal,
		colorBase,
		selectedIndex,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<Fragment >
			<Grid container spacing={3} className={classes.container_main}>
				<Grid item xs={12} sm={3}>
					<Paper>
						<h1>CATÁLOGOS</h1>
						<List component='nav' aria-label='menu-catalogos'>
							{
								catalogos.map((catalogoItem, index) => {
									return (
										<Fragment>
											<ListItem disablePadding>
												<ListItemButton
													selected={selectedIndex === index}
													onClick={() => onClickCatalogo(catalogoItem, index)}>
													<ListItemText primary={`${catalogoItem.nombre}`} />
												</ListItemButton>
											</ListItem>
										</Fragment>
									)
								})
							}
						</List>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={9} className={classes.container_child}>
					<Paper>
						<Crud
							catalogo={catalogo}
							loadCatalogos={loadCatalogos}
							data={data}
							empleado={empleado}
							setMessage={setMessage}
							setSeverity={setSeverity}
							setOpenAlert={setOpenAlert}
							colorBase={colorBase}
						/>
					</Paper>
				</Grid>
			</Grid>
		</Fragment>
	);
}
