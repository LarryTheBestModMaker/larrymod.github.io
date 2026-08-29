import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {closeColorOfTheIceCubeMenu} from '../reducers/menus';
import {iceCubeColor, setIceCubeColor} from '../reducers/ice-cube-color';

import ColorOfTheIceCubeSelectorComponent from '../components/color-of-the-ice-cube-selector/color-of-the-ice-cube-selector.jsx';

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

class ColorOfTheIceCubeSelector extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChange'
        ]);
    }

    componentDidMount () {
        applyIceCubeColor(this.props.currentColor);
    }

    componentDidUpdate (prevProps) {
        if (prevProps.currentColor !== this.props.currentColor) {
            applyIceCubeColor(this.props.currentColor);
        }
    }

    handleChange (e) {
        this.props.onChangeColorOfTheIceCube(e.target.value);
    }

    render () {
        const {
            currentColor,
            onChangeColorOfTheIceCube, // eslint-disable-line no-unused-vars
            children,
            ...props
        } = this.props;
        return (
            <ColorOfTheIceCubeSelectorComponent
                currentColor={currentColor}
                onChange={this.handleChange}
                {...props}
            >
                {children}
            </ColorOfTheIceCubeSelectorComponent>
        );
    }
}

ColorOfTheIceCubeSelector.propTypes = {
    children: PropTypes.node,
    currentColor: PropTypes.string.isRequired,
    onChangeColorOfTheIceCube: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    currentColor: iceCubeColor(state)
});

const mapDispatchToProps = dispatch => ({
    onChangeColorOfTheIceCube: color => {
        dispatch(setIceCubeColor(color));
        applyIceCubeColor(color);
        dispatch(closeColorOfTheIceCubeMenu());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorOfTheIceCubeSelector);
