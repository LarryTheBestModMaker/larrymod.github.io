/* @todo This file should be pulled out into a shared library with scratch-gui,
consolidating this component with icon-button.jsx in gui.
See #13 */

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import Button from '../button/button.jsx';

import styles from './labeled-icon-button.css';

const LabeledIconButton = ({
    className,
    hideLabel,
    imgAlt,
    imgSrc,
    imgStyles,
    onClick,
    small,
    title,
    ...props
}) => (
    <Button
        className={classNames(className, 
            small ? styles.modEditFieldSmall : styles.modEditField
        )}
        onClick={onClick}
        {...props}
    >
        <img
            alt={imgAlt || title}
            className={small ? styles.editFieldIconSmall : styles.editFieldIcon}
            draggable={false}
            src={imgSrc}
            title={title}
            style={imgStyles}
        />
        {!hideLabel && <span className={small ? styles.editFieldTitleSmall : styles.editFieldTitle}>{title}</span>}
    </Button>
);

LabeledIconButton.propTypes = {
    className: PropTypes.string,
    hideLabel: PropTypes.bool,
    highlighted: PropTypes.bool,
    small: PropTypes.bool,
    imgAlt: PropTypes.string,
    imgStyles: PropTypes.object,
    imgSrc: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

export default LabeledIconButton;