import React from 'react';
import PropTypes from 'prop-types';

import {MenuItem, Submenu} from '../menu/menu.jsx';

import dropdownCaret from './dropdown-caret.svg';

import styles from './mod-option-menu.css';

const ModOptionMenu = props => (
    <MenuItem>
        <div className={styles.modOption}>
            <img
                className={styles.modIcon}
                src={props.icon}
                draggable={false}
            />

            <span className={styles.modName}>
                {props.name}
            </span>

            <img
                className={styles.modCaret}
                src={dropdownCaret}
                draggable={false}
            />
        </div>

        <Submenu
            className={styles.actionSubmenu}
            place="right"
        >
            <MenuItem
                onClick={() => {
                    window.open(props.url, '_blank', 'noopener,noreferrer');
                }}
            >
                Open in new tab
            </MenuItem>

            <MenuItem
                onClick={() => {
                    window.open(
                        props.url,
                        '_blank',
                        'width=1280,height=800,resizable=yes,scrollbars=yes'
                    );
                }}
            >
                Open in new window
            </MenuItem>
        </Submenu>
    </MenuItem>
);

ModOptionMenu.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
};

export default ModOptionMenu;