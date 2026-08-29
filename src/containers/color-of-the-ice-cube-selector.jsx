import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {selectLocale} from '../reducers/locales';
import {closeColorOfTheIceCubeMenu} from '../reducers/menus';

import ColorOfTheIceCubeSelectorComponent from '../components/color-of-the-ice-cube-selector/color-of-the-ice-cube-selector.jsx';

class ColorOfTheIceCubeSelector extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChange'
        ]);
        document.documentElement.lang = props.currentLocale;
    }
    handleChange (e) {
        const newLocale = e.target.value;
        if (this.props.messagesByLocale[newLocale]) {
            this.props.onChangeColorOfTheIceCube(newLocale);
            document.documentElement.lang = newLocale;
        }
    }
    render () {
        const {
            onChangeColorOfTheIceCube, // eslint-disable-line no-unused-vars
            messagesByLocale, // eslint-disable-line no-unused-vars
            children,
            ...props
        } = this.props;
        return (
            <ColorOfTheIceCubeSelectorComponent
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
    currentLocale: PropTypes.string.isRequired,
    // Only checking key presence for messagesByLocale, no need to be more specific than object
    messagesByLocale: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onChangeColorOfTheIceCube: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    currentLocale: state.locales.locale,
    messagesByLocale: state.locales.messagesByLocale
});

const mapDispatchToProps = dispatch => ({
    onChangeColorOfTheIceCube: locale => {
        dispatch(selectLocale(locale));
        dispatch(closeColorOfTheIceCubeMenu());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorOfTheIceCubeSelector);
