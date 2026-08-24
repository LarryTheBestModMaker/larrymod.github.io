import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import ControlsComponent from '../components/controls/controls.jsx';
import {
    getNextPlaybackSpeed,
    getPlaybackSpeed,
    resetPlaybackSpeed,
    setPlaybackSpeed
} from '../lib/project-playback-speed';

class Controls extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            fastForwardSpeed: getPlaybackSpeed()
        };
        bindAll(this, [
            'handleGreenFlagClick',
            'handlePauseButtonClick',
            'handleFastForwardButtonClick',
            'handleStopAllClick',
            'resetPlaybackSpeed'
        ]);
    }


    resetPlaybackSpeed () {
        const speed = resetPlaybackSpeed(this.props.vm);
        this.setState({fastForwardSpeed: speed});
    }

    handleGreenFlagClick (e) {
        e.preventDefault();
        this.resetPlaybackSpeed();
        if (e.shiftKey || e.altKey || e.type === 'contextmenu') {
            if (e.shiftKey) {
                this.props.vm.setTurboMode(!this.props.turbo);
            }
            if (e.altKey || e.type === 'contextmenu') {
                this.props.vm.setFramerate(this.props.framerate === 30 ? 60 : 30);
            }
            return;
        }

        if (!this.props.isStarted) {
            this.props.vm.start();
        }
        this.props.vm.greenFlag();
    }
    handlePauseButtonClick (e) {
        e.preventDefault();
        
        // Pause ends fast-forward and restores normal script/audio speed while
        // preserving the project's current state and position.
        if (this.state.fastForwardSpeed > 1) {
            this.resetPlaybackSpeed();
            this.props.vm.pause();
            return;
        }
        
        if (!this.props.paused) {
            this.props.vm.pause();
        } else {
            this.props.vm.play();
        }
    }

    handleFastForwardButtonClick (e) {
        e.preventDefault();
        const speed = getNextPlaybackSpeed(this.state.fastForwardSpeed);
        const appliedSpeed = setPlaybackSpeed(this.props.vm, speed);
        this.setState({fastForwardSpeed: appliedSpeed});
    }

    handleStopAllClick (e) {
        e.preventDefault();
        this.resetPlaybackSpeed();
        this.props.vm.stopAll();
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            isStarted, // eslint-disable-line no-unused-vars
            projectRunning, // eslint-disable-line no-unused-vars
            paused,
            turbo,
            ...props
        } = this.props;

        return (
            <ControlsComponent
                {...props}
                active={projectRunning && isStarted}
                paused={paused}
                turbo={turbo}
                fastForwardSpeed={this.state.fastForwardSpeed}
                onGreenFlagClick={this.handleGreenFlagClick}
                onPauseButtonClick={this.handlePauseButtonClick}
                onFastForwardButtonClick={this.handleFastForwardButtonClick}
                onStopAllClick={this.handleStopAllClick}
            />
        );
    }
}

Controls.propTypes = {
    isStarted: PropTypes.bool.isRequired,
    projectRunning: PropTypes.bool.isRequired,
    turbo: PropTypes.bool.isRequired,
    framerate: PropTypes.number.isRequired,
    interpolation: PropTypes.bool.isRequired,
    isSmall: PropTypes.bool,
    paused: PropTypes.bool,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    isStarted: state.scratchGui.vmStatus.started,
    projectRunning: state.scratchGui.vmStatus.running,
    framerate: state.scratchGui.tw.framerate,
    interpolation: state.scratchGui.tw.interpolation,
    turbo: state.scratchGui.vmStatus.turbo,
    paused: state.scratchGui.vmStatus.paused
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
