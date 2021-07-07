import React from 'react';
import { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import myStyles from '../../../css';
import TableComponent from '../../../components/table/TableComponent';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalItemCatalogo from '../../../components/modales/item_catalogo';
import ItemServicio from '../../../components/modales/item_catalogo/servicios';

export const CrudContainer = props => {
	const {
		catalogo,
		data,
		item,
		// MODALES
		onCloseModal,
		openModalServicios,
		// MODAL NUEVO ITEM
		onClicKNuevo,
		openModal,
		setMessage,
		setSeverity,
		setOpenAlert,
		// TABLE PROPERTIES
		columns,
		actions,
		options,
		components,
		colorBase,
	} = props;

	const classes = myStyles(colorBase)();

	return (
		<Fragment >
			{
				openModal ?
					<ModalItemCatalogo
						open={openModal}
						onClose={onCloseModal}
						item={item}
						catalogo={catalogo}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setOpenAlert={setOpenAlert}
					/>
					: ''
			}
			{
				openModalServicios ?
					<ItemServicio
						open={openModalServicios}
						onClose={onCloseModal}
						item={item}
						catalogo={catalogo}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setOpenAlert={setOpenAlert}
					/>
					: ''
			}
			<Grid container spacing={3} className={classes.container_main}>
				<Grid item xs={12} sm={4}>
					<ButtonCustom
						className={classes.button}
						color="primary"
						variant="contained"
						onClick={() => onClicKNuevo()}
						disabled={!catalogo._id}
						text='NUEVO' />
				</Grid>
				<Grid item xs={12}>
					<TableComponent
						titulo={catalogo._id ? catalogo.nombre : 'SELECCIONA UN CATÁLOGO'}
						columns={columns}
						data={data}
						actions={actions}
						options={options}
						components={components} />
				</Grid>
			</Grid>
		</Fragment>
	);
}
