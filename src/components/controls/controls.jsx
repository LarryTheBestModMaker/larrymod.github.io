import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import GreenFlag from '../green-flag/green-flag.jsx';
import PauseButton from '../pause-button/pause-button.jsx';
import FastForwardButton from '../fast-forward-button/fast-forward-button.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';
import FramerateIndicator from '../tw-framerate-indicator/framerate-indicator.jsx';

import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
    },
    pauseTitle: {
        id: 'gui.controls.pause',
        defaultMessage: 'Pause',
        description: 'Pause button title'
    },
    fastForwardTitle: {
        id: 'gui.controls.fastForward',
        defaultMessage: 'Fast forward',
        description: 'Fast-forward button title'
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title'
    }
});

const Controls = function (props) {
    const {
        active,
        paused,
        className,
        intl,
        onGreenFlagClick,
        onPauseButtonClick,
        onFastForwardButtonClick,
        onStopAllClick,
        fastForwardSpeed,
        turbo,
        framerate,
        interpolation,
        isSmall,
        ...componentProps
    } = props;

    const modeLabel = fastForwardSpeed > 1 ? `FF – ${fastForwardSpeed}x` : null;
    
    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            <GreenFlag
                active={active}
                title={intl.formatMessage(messages.goTitle)}
                onClick={onGreenFlagClick}
            />
            <PauseButton
                paused={paused}
                title={intl.formatMessage(messages.pauseTitle)}
                onClick={onPauseButtonClick}
            />
            <FastForwardButton
                speed={fastForwardSpeed}
                title={intl.formatMessage(messages.fastForwardTitle)}
                onClick={onFastForwardButtonClick}
            />
            <StopAll
                active={active}
                title={intl.formatMessage(messages.stopTitle)}
                onClick={onStopAllClick}
            />
            {modeLabel ? (
                <span
                    className={styles.speedStatus}
                    role="status"
                    aria-live="polite"
                >
                    {modeLabel}
                </span>
            ) : null}
            {turbo ? <TurboMode isSmall={isSmall} /> : null}
            {!isSmall ? (
                <FramerateIndicator
                    framerate={framerate}
                    interpolation={interpolation}
                />
            ) : null}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    paused: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onGreenFlagClick: PropTypes.func.isRequired,
    onPauseButtonClick: PropTypes.func.isRequired,
    onFastForwardButtonClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    fastForwardSpeed: PropTypes.number,
    framerate: PropTypes.number,
    interpolation: PropTypes.bool,
    isSmall: PropTypes.bool,
    turbo: PropTypes.bool
};

Controls.defaultProps = {
    active: false,
    turbo: false,
    isSmall: false,
    fastForwardSpeed: 1
};

export default injectIntl(Controls);
