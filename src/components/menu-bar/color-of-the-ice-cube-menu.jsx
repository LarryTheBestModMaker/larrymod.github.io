import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import check from './check.svg';
import {MenuItem, Submenu} from '../menu/menu.jsx';
import colorOfTheIceCubeIcon from '../color-of-the-ice-cube-selector/color-of-the-ice-cube-icon.svg';
import {
    colorOfTheIceCubeMenuOpen,
    openColorOfTheIceCubeMenu,
    closeColorOfTheIceCubeMenu
} from '../../reducers/menus.js';
import {iceCubeColor, setIceCubeColor} from '../../reducers/ice-cube-color.js';
import iceCubeColors from '../../lib/ice-cube-colors.js';

import styles from './settings-menu.css';

import dropdownCaret from './dropdown-caret.svg';

const ICE_CUBE_COLOR_STORAGE_KEY = 'pm:iceCubeColor';

const applyIceCubeColor = color => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--ice-cube-color', color);
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(ICE_CUBE_COLOR_STORAGE_KEY, color);
        } catch (e) {
            // Ignore storage failures such as private browsing restrictions.
        }
        window.dispatchEvent(new CustomEvent('IceCubeColorChange', {
            detail: {color: color}
        }));
    }
};

class ColorOfTheIceCubeMenu extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setRef',
            'handleMouseOver',
            'handleChangeColor'
        ]);
    }

    componentDidMount () {
        applyIceCubeColor(this.props.currentColor);
    }

    componentDidUpdate (prevProps) {
        // If the submenu has been toggled open, try scrolling the selected option into view.
        if (!prevProps.menuOpen && this.props.menuOpen && this.selectedRef) {
            this.scrollSelectedIntoView();
        }
        if (prevProps.currentColor !== this.props.currentColor) {
            applyIceCubeColor(this.props.currentColor);
        }
    }

    setRef (component) {
        this.selectedRef = component;
    }

    handleMouseOver () {
        // If we are using hover rather than clicks for submenus, scroll the selected option into view
        if (!this.props.menuOpen && this.selectedRef) {
            this.scrollSelectedIntoView();
        }
    }

    handleChangeColor (color) {
        this.props.onChangeColorOfTheIceCube(color);
    }

    scrollSelectedIntoView () {
        // the native scrollIntoView() scrolls the entire page when used outside the editor,
        // so we do this manually instead.
        const menuItem = this.selectedRef.parentNode;
        const scrollContainer = menuItem.parentNode;

        const itemHeight = menuItem.offsetHeight;
        const selectedItemPosition = menuItem.offsetTop;
        const visibleHeight = scrollContainer.offsetHeight;

        scrollContainer.scrollTop = selectedItemPosition - (visibleHeight / 2) + (itemHeight / 2);
    }

    render () {
        return (
            <MenuItem
                expanded={this.props.menuOpen}
            >
                <div
                    className={styles.option}
                    onClick={this.props.onRequestOpen}
                    onMouseOver={this.handleMouseOver}
                >
                    <img
                        className={styles.icon}
                        src={colorOfTheIceCubeIcon}
                        draggable={false}
                    />
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="The Color of the Ice Cube"
                            description="The color of the ice cube sub-menu"
                            id="gui.menuBar.colorOfTheIceCube"
                        />
                    </span>
                    <img
                        className={styles.expandCaret}
                        src={dropdownCaret}
                        draggable={false}
                    />
                </div>
                <Submenu
                    className={styles.colorOfTheIceCubeSubmenu}
                    place={this.props.isRtl ? 'left' : 'right'}
                >
                    {
                        iceCubeColors.map(color => (
                            <MenuItem
                                key={color.value}
                                className={styles.colorOfTheIceCubeMenuItem}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={() => this.handleChangeColor(color.value)}
                            >
                                <span
                                    className={styles.iceCubeColorSwatch}
                                    style={{backgroundColor: color.value}}
                                />
                                <img
                                    className={classNames(styles.check, {
                                        [styles.selected]: this.props.currentColor === color.value
                                    })}
                                    src={check}
                                    draggable={false}
                                    {...(this.props.currentColor === color.value && {ref: this.setRef})}
                                />
                                {color.name}
                            </MenuItem>
                        ))
                    }
                </Submenu>
            </MenuItem>
        );
    }
}

ColorOfTheIceCubeMenu.propTypes = {
    currentColor: PropTypes.string,
    isRtl: PropTypes.bool,
    menuOpen: PropTypes.bool,
    onChangeColorOfTheIceCube: PropTypes.func.isRequired,
    onRequestCloseSettings: PropTypes.func.isRequired,
    onRequestOpen: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    currentColor: iceCubeColor(state),
    isRtl: state.locales.isRtl,
    menuOpen: colorOfTheIceCubeMenuOpen(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onChangeColorOfTheIceCube: color => {
        dispatch(setIceCubeColor(color));
        applyIceCubeColor(color);
        dispatch(closeColorOfTheIceCubeMenu());
        ownProps.onRequestCloseSettings();
    },
    onRequestOpen: () => dispatch(openColorOfTheIceCubeMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorOfTheIceCubeMenu);
