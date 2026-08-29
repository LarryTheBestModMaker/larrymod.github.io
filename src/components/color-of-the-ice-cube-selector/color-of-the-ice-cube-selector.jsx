import PropTypes from 'prop-types';
import React from 'react';

import locales from '@turbowarp/scratch-l10n';
import styles from './color-of-the-ice-cube-selector.css';

// supported languages to exclude from the menu, but allow as a URL option
const ignore = [];

const ColorOfTheIceCubeSelector = ({currentLocale, label, onChange}) => (
    <select
        aria-label={label}
        className={styles.colorOfTheIceCubeSelect}
        value={currentLocale}
        onChange={onChange}
    >
        {
            Object.keys(locales)
                .filter(l => !ignore.includes(l))
                .map(locale => (
                    <option
                        key={locale}
                        value={locale}
                    >
                        {locales[locale].name}
                    </option>
                ))
        }
    </select>
);

ColorOfTheIceCubeSelector.propTypes = {
    currentLocale: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func
};

export default ColorOfTheIceCubeSelector;
