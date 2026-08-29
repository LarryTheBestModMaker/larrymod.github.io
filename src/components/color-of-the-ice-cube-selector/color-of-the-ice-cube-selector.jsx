import PropTypes from 'prop-types';
import React from 'react';

import iceCubeColors from '../../lib/ice-cube-colors.js';
import styles from './color-of-the-ice-cube-selector.css';

const ColorOfTheIceCubeSelector = ({currentColor, label, onChange}) => (
    <select
        aria-label={label}
        className={styles.colorOfTheIceCubeSelect}
        value={currentColor}
        onChange={onChange}
    >
        {
            iceCubeColors.map(color => (
                <option
                    key={color.value}
                    value={color.value}
                >
                    {color.name}
                </option>
            ))
        }
    </select>
);

ColorOfTheIceCubeSelector.propTypes = {
    currentColor: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func
};

export default ColorOfTheIceCubeSelector;
