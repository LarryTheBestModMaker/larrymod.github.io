import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';

import {MenuItem, Submenu} from '../menu/menu.jsx';

import {
    goToModMenuOpen,
    openGoToModMenu
} from '../../reducers/menus.js';

import ModOptionMenu from './mod-option-menu.jsx';
import styles from './go-to-mod-menu.css';

import goToModIcon from '../go-to-mod/go-to-mod-icon.svg';
import dropdownCaret from './dropdown-caret.svg';

import mods from '../../lib/mod-links.js';

const GoToModMenu = props => (
    <MenuItem
        expanded={props.menuOpen}
    >
        <div
            className={styles.menuOption}
            onClick={props.onRequestOpen}
        >
            <img
                className={styles.icon}
                src={goToModIcon}
                draggable={false}
            />
            <span className={styles.submenuLabel}>
                <FormattedMessage
                    defaultMessage="Go to Mod"
                    description="The go to mod sub-menu"
                    id="gui.menuBar.goToMod"
                />
            </span>
            <img
                className={styles.expandCaret}
                src={dropdownCaret}
                draggable={false}
            />
        </div>

        <Submenu
            className={styles.modSubmenu}
            place={props.isRtl ? 'left' : 'right'}
        >
    {mods.map(mod => (
        <ModOptionMenu
            key={mod.id || mod.name}
            name={mod.name}
            url={mod.url}
            icon={mod.icon}
        />
    ))}
        </Submenu>
    </MenuItem>
);

GoToModMenu.propTypes = {
    isRtl: PropTypes.bool,
    menuOpen: PropTypes.bool,
    onRequestOpen: PropTypes.func
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl,
    menuOpen: goToModMenuOpen(state)
});

const mapDispatchToProps = dispatch => ({
    onRequestOpen: () => dispatch(openGoToModMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GoToModMenu);
