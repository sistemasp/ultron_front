import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export const ComboCustomProductos = (props) => {

    const {
        label,
        options,
        onChange,
        value,
        className,
    } = props;

    const newValue = value;

    return (
        <Autocomplete
            className={className}
            disablePortal
            id="combo-box-autocomplete"
            options={options}
            value={newValue}
            onChange={onChange}
            getOptionLabel={(option) => {
                return `${option.codigo} - ${option.descripcion}`
            }}
            renderInput={(params) => {
                return <TextField {...params} label={label} />
            }}
        />
    );
}