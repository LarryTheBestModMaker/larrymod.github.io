import PropTypes from 'prop-types';
import React from 'react';

import Button from '../button/button.jsx';
import fastForwardIcon from './icon--fast-forward.svg';

import styles from './fast-forward-button.css';

const FastForwardButton = ({onClick, speed, title}) => (
    <Button
        className={styles.fastForwardButton}
        onClick={onClick}
        title={title}
        aria-label={title}
    >
        <img
            className={styles.fastForwardButtonIcon}
            draggable={false}
            src={fastForwardIcon}
            alt=""
        />
        {speed > 1 ? <span className={styles.speed}>{speed}x</span> : null}
    </Button>
);

FastForwardButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    speed: PropTypes.number,
    title: PropTypes.string.isRequired
};

FastForwardButton.defaultProps = {
    speed: 1
};

export default FastForwardButton;