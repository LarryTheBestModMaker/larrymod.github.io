import React from 'react';
import PropTypes from 'prop-types';

import {MenuItem} from '../menu/menu.jsx';

import styles from './mod-option-menu.css';

const ModOptionMenu = props => (
    <MenuItem
        onClick={() => {
            window.open(props.url, '_blank');
        }}
    >
        <div className={styles.modOption}>
            <img
                className={styles.modIcon}
                src={props.icon}
                draggable={false}
                alt=""
            />

            <span className={styles.modName}>
                {props.name}
            </span>
        </div>
    </MenuItem>
);

ModOptionMenu.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
};

export default ModOptionMenu;