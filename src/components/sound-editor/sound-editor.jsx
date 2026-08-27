import PropTypes from 'prop-types';
import React, {useState} from 'react';
import classNames from 'classnames';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import Waveform from '../waveform/waveform.jsx';
import Label from '../forms/label.jsx';
import Input from '../forms/input.jsx';
import TWRenderRecoloredImage from '../../lib/tw-recolor/render.jsx';

import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import AudioSelector from '../../containers/audio-selector.jsx';
import IconButton from '../icon-button/icon-button.jsx';
import {SOUND_BYTE_LIMIT} from '../../lib/audio/audio-util.js';

import styles from './sound-editor.css';

import playIcon from './icon--play.svg';
import pauseIcon from './icon--pause.svg';
import stopIcon from './icon--stop.svg';
import redoIcon from '!../../lib/tw-recolor/build!./icon--redo.svg';
import undoIcon from '!../../lib/tw-recolor/build!./icon--undo.svg';
import modifyIcon from './icon--modify.svg';
import formatIcon from './icon--format.svg';
import fasterIcon from './icon--faster.svg';
import slowerIcon from './icon--slower.svg';
import louderIcon from './icon--louder.svg';
import softerIcon from './icon--softer.svg';
import robotIcon from './icon--robot.svg';
import echoIcon from './icon--echo.svg';
import highpassIcon from './icon--highpass.svg';
import lowpassIcon from './icon--lowpass.svg';
import megaphoneIcon from './icon--megaphone.svg';
import trembleIcon from './icon--tremble.svg';
import reverseIcon from './icon--reverse.svg';
import fadeOutIcon from './icon--fade-out.svg';
import fadeInIcon from './icon--fade-in.svg';
import muteIcon from './icon--mute.svg';
import flipIcon from './icon--flip.svg';
import reverbIcon from './icon--reverb.svg';
import bitcrushIcon from './icon--bit-crush.png';
import higherPitchIcon from './icon--higher-pitch.svg';
import lowerPitchIcon from './icon--lower-pitch.svg';
import telephoneIcon from './icon--telephone.svg';
import alienIcon from './icon--alien.svg';
import distortionIcon from './icon--distortion.svg';
import vocoderIcon from './icon--vocoder.svg';
import lowBatteryIcon from './icon--low-battery.svg';
import noiseReductionIcon from './icon--noise-reduction.svg';
import flashbackIcon from './icon--flashback.svg';
import loudBreathsIcon from './icon--loud-breaths.svg';
import metalPipesIcon from './icon--metal-pipes.svg';
import djWarpIcon from './icon--dj-warp.svg';
import backpackRadioIcon from './icon--backpack-radio.svg';
import bAndWTVIcon from './icon--b-and-w-tv.svg';
import micMalfunctionIcon from './icon--mic-malfunction.svg';
import electroShiftIcon from './icon--electro-shift.svg';
import distortedMicIcon from './icon--distorted-mic.svg';
import normalizeIcon from './icon--normalize.svg';
import transceiverIcon from './icon--transceiver.svg';

import deleteIcon from '!../../lib/tw-recolor/build!./icon--delete.svg';
import copyIcon from '!../../lib/tw-recolor/build!./icon--copy.svg';
import pasteIcon from '!../../lib/tw-recolor/build!./icon--paste.svg';
import cutIcon from '!../../lib/tw-recolor/build!./icon--cut.svg';
import copyToNewIcon from '!../../lib/tw-recolor/build!./icon--copy-to-new.svg';
import trimIcon from '!../../lib/tw-recolor/build!./icon--trim-action.svg';
import Box from '../box/box.jsx';
import Meter from '../meter/meter.jsx';

const BufferedInput = BufferedInputHOC(Input);

const urlParams = new URLSearchParams(location.search);

const IsLiveTests = urlParams.has('livetests')

const messages = defineMessages({
    sound: {
        id: 'gui.soundEditor.sound',
        description: 'Label for the name of the sound',
        defaultMessage: 'Sound'
    },
    play: {
        id: 'gui.soundEditor.play',
        description: 'Title of the button to start playing the sound',
        defaultMessage: 'Play'
    },
    pause: {
        id: 'gui.soundEditor.pause',
        description: 'Title of the button to pause the sound',
        defaultMessage: 'Pause'
    },
    resume: {
        id: 'gui.soundEditor.resume',
        description: 'Title of the button to resume the sound',
        defaultMessage: 'Resume'
    },
    stop: {
        id: 'gui.soundEditor.stop',
        description: 'Title of the button to stop the sound',
        defaultMessage: 'Stop'
    },
    copy: {
        id: 'gui.soundEditor.copy',
        description: 'Title of the button to copy the sound',
        defaultMessage: 'Copy'
    },
    paste: {
        id: 'gui.soundEditor.paste',
        description: 'Title of the button to paste the sound',
        defaultMessage: 'Paste'
    },
    cut: {
        id: 'gui.soundEditor.cut',
        description: 'Title of the button to cut the sound',
        defaultMessage: 'Cut'
    },
    copyToNew: {
        id: 'gui.soundEditor.copyToNew',
        description: 'Title of the button to copy the selection into a new sound',
        defaultMessage: 'Copy to New'
    },
    cutToNew: {
        id: 'gui.soundEditor.cutToNew',
        description: 'Title of the button to cut the selection into a new sound',
        defaultMessage: 'Cut to New'
    },
    delete: {
        id: 'gui.soundEditor.delete',
        description: 'Title of the button to delete the sound',
        defaultMessage: 'Delete'
    },
    trim: {
        id: 'gui.soundEditor.trim',
        description: 'Title of the button to trim the sound',
        defaultMessage: 'Trim'
    },
    save: {
        id: 'gui.soundEditor.save',
        description: 'Title of the button to save trimmed sound',
        defaultMessage: 'Save'
    },
    undo: {
        id: 'gui.soundEditor.undo',
        description: 'Title of the button to undo',
        defaultMessage: 'Undo'
    },
    redo: {
        id: 'gui.soundEditor.redo',
        description: 'Title of the button to redo',
        defaultMessage: 'Redo'
    },
    faster: {
        id: 'gui.soundEditor.faster',
        description: 'Title of the button to apply the faster effect',
        defaultMessage: 'Faster'
    },
    slower: {
        id: 'gui.soundEditor.slower',
        description: 'Title of the button to apply the slower effect',
        defaultMessage: 'Slower'
    },
    echo: {
        id: 'gui.soundEditor.echo',
        description: 'Title of the button to apply the echo effect',
        defaultMessage: 'Echo'
    },
    robot: {
        id: 'gui.soundEditor.robot',
        description: 'Title of the button to apply the robot effect',
        defaultMessage: 'Robot'
    },
    louder: {
        id: 'gui.soundEditor.louder',
        description: 'Title of the button to apply the louder effect',
        defaultMessage: 'Louder'
    },
    softer: {
        id: 'gui.soundEditor.softer',
        description: 'Title of the button to apply thr.softer effect',
        defaultMessage: 'Softer'
    },
    reverse: {
        id: 'gui.soundEditor.reverse',
        description: 'Title of the button to apply the reverse effect',
        defaultMessage: 'Reverse'
    },
    fadeOut: {
        id: 'gui.soundEditor.fadeOut',
        description: 'Title of the button to apply the fade out effect',
        defaultMessage: 'Fade out'
    },
    fadeIn: {
        id: 'gui.soundEditor.fadeIn',
        description: 'Title of the button to apply the fade in effect',
        defaultMessage: 'Fade in'
    },
    mute: {
        id: 'gui.soundEditor.mute',
        description: 'Title of the button to apply the mute effect',
        defaultMessage: 'Mute'
    },
    flip: {
        id: 'gui.soundEditor.flip',
        description: 'Title of the button to apply the flip effect',
        defaultMessage: 'Flip L&R'
    }
});

const formatTime = timeSeconds => {
    const minutes = (Math.floor(timeSeconds / 60))
        .toString()
        .padStart(2, '0');
    const seconds = (timeSeconds % 60)
        .toFixed(2)
        .padStart(5, '0');
    return `${minutes}:${seconds}`;
};

const formatDuration = (playheadPercent, trimStartPercent, trimEndPercent, durationSeconds) => {
    // If no selection, the trim is the entire sound.
    trimStartPercent = trimStartPercent === null ? 0 : trimStartPercent;
    trimEndPercent = trimEndPercent === null ? 1 : trimEndPercent;

    // If the playhead doesn't exist, assume it's at the start of the selection.
    playheadPercent = playheadPercent === null ? trimStartPercent : playheadPercent;

    // If selection has zero length, treat it as the entire sound being selected.
    // This happens when the user first clicks to start making a selection.
    const trimSize = (trimEndPercent - trimStartPercent) || 1;
    const trimDuration = trimSize * durationSeconds;

    const progressInTrim = (playheadPercent - trimStartPercent) / trimSize;
    const currentTime = progressInTrim * trimDuration;

    return `${formatTime(currentTime)} / ${formatTime(trimDuration)} (in seconds: ${trimDuration.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]})`;
};

const formatSoundSize = bytes => {
    if (bytes > 1000 * 1000) {
        return `${(bytes / 1000 / 1000).toFixed(2)}MB`;
    }
    return `${(bytes / 1000).toFixed(2)}KB`;
};

const SoundEditor = props => (
    <div
        className={styles.editorContainer}
        ref={props.setRef}
        onMouseDown={props.onContainerClick}
    >
        <div className={styles.row}>
            <div className={styles.inputGroup}>
                <Label text={props.intl.formatMessage(messages.sound)}>
                    <BufferedInput
                        tabIndex="1"
                        type="text"
                        value={props.name}
                        onSubmit={props.onChangeName}
                        className={styles.nameInput}
                    />
                </Label>
                <div className={styles.buttonGroup}>
                    <button
                        className={styles.button}
                        disabled={!props.canUndo}
                        title={props.intl.formatMessage(messages.undo)}
                        onClick={props.onUndo}
                    >
                        <TWRenderRecoloredImage
                            className={styles.undoIcon}
                            draggable={false}
                            src={undoIcon}
                        />
                    </button>
                    <button
                        className={styles.button}
                        disabled={!props.canRedo}
                        title={props.intl.formatMessage(messages.redo)}
                        onClick={props.onRedo}
                    >
                        <TWRenderRecoloredImage
                            className={styles.redoIcon}
                            draggable={false}
                            src={redoIcon}
                        />
                    </button>
                </div>
            </div>
            <div className={styles.inputGroup}>
                <IconButton
                    className={styles.toolButton}
                    img={copyIcon}
                    title={props.intl.formatMessage(messages.copy)}
                    onClick={props.onCopy}
                />
                <IconButton
                    className={styles.toolButton}
                    disabled={props.canPaste === false}
                    img={pasteIcon}
                    title={props.intl.formatMessage(messages.paste)}
                    onClick={props.onPaste}
                />
                <IconButton
                    className={styles.toolButton}
                    disabled={props.trimStart === null}
                    img={cutIcon}
                    title={props.intl.formatMessage(messages.cut)}
                    onClick={props.onCut}
                />
                <IconButton
                    className={classNames(styles.toolButton, styles.flipInRtl)}
                    img={copyToNewIcon}
                    title={props.intl.formatMessage(messages.copyToNew)}
                    onClick={props.onCopyToNew}
                />
                <IconButton
                    className={classNames(styles.toolButton, styles.flipInRtl)}
                    disabled={props.trimStart === null}
                    img={copyToNewIcon}
                    title={props.intl.formatMessage(messages.cutToNew)}
                    onClick={props.onCutToNew}
                />
            </div>
            <IconButton
                className={styles.toolButton}
                disabled={props.trimStart === null}
                img={deleteIcon}
                title={props.intl.formatMessage(messages.delete)}
                onClick={props.onDelete}
            />
            <IconButton
                className={styles.toolButton}
                disabled={props.trimStart === null}
                img={trimIcon}
                title={props.intl.formatMessage(messages.trim)}
                onClick={props.onDeleteInverse}
            />
        </div>
        <div
                className={styles.row}
                style={{
                    alignItems: 'stretch'
                }}
            >
                <Box className={styles.meterContainer}>
                    <Meter
                        height={172}
                        level={props.playing * Math.max(
                            props.chunkLevels[0][Math.floor(props.playhead * props.chunkLevels[0].length)],
                            props.chunkLevels[props.chunkLevels.length - 1][
                                Math.floor(props.playhead * props.chunkLevels[props.chunkLevels.length - 1].length)
                            ]
                        )}
                        width={20}
                    />
                </Box>
                <div className={classNames(styles.audioContainer)}>
                    <div
                        className={styles.timeSteps}
                        ref={props.setTimeStepRef}
                        onMouseDown={props.onTimeStepMouseDown}
                    >
                        {Array.from({length: props.timeStepCount}).map((_, i) => (
                            <div
                                key={i}
                                className={styles.timeStep}
                                style={{
                                    translate: `${props.timeStepWidth * i}px 0`
                                }}
                            >
                                {(i % 2 === 0 || props.timeStepWidth > 65) && (
                                    <span>{formatTime(props.timeStepTime * i)}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={styles.waveformContainer}>
                        <div className={styles.waveformInsideContainer}>
                            {props.chunkLevels.map((data, i) => (
                                <div
                                    className={styles.waveform}
                                    key={i}
                                >
                                    <Waveform
                                        data={data}
                                        height={(140 / props.chunkLevels.length) + (props.chunkLevels.length * 20)}
                                        width={600}
                                        preferences={props.preferences}
                                    />
                                    {props.chunkLevels.length > 1 && (
                                        <>
                                            <div className={styles.waveformLabel}>
                                                {[
                                                    <FormattedMessage
                                                        defaultMessage="Left Channel"
                                                        description="Label for left waveform"
                                                        id="nb.leftChannel"
                                                        key="0"
                                                    />,
                                                    <FormattedMessage
                                                        defaultMessage="Right Channel"
                                                        description="Label for right waveform"
                                                        id="nb.rightChannel"
                                                        key="1"
                                                    />
                                                ][i]}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            <div
                                className={styles.waveformShadow}
                                style={{
                                    // This logic makes my brain hurt but if it's not broken don't fix it
                                    // eslint-disable-next-line max-len
                                    background: `linear-gradient(90deg, ${Math.min(props.playhead, props.trimEnd ?? props.playhead) > 0 ? `var(--page-background) 0%, var(--page-background) ${Math.min(props.playhead, props.trimEnd ?? props.playhead) * 100}%, transparent ${Math.min(props.playhead, props.trimEnd ?? props.playhead) * 100}%` : 'transparent'}${props.trimStart || props.trimEnd ? `, transparent ${Math.max(props.playhead, props.trimStart, props.trimEnd) * 100}%, var(--page-background) ${Math.max(props.playhead, props.trimStart, props.trimEnd) * 100}%` : ''})`
                                }}
                            />
                        </div>
                        <AudioSelector
                            playhead={props.playhead}
                            onUpdatePlayhead={props.onUpdatePlayhead}
                            trimEnd={props.trimEnd}
                            trimStart={props.trimStart}
                            trimChannel={props.trimChannel}
                            onSetTrimChannel={props.onSetTrimChannel}
                            channelCount={props.chunkLevels.length}
                            onPlay={props.onPlay}
                            onSetTrim={props.onSetTrim}
                            onStop={props.onStop}
                        />
                    </div>
                </div>
        <div className={classNames(styles.row, styles.rowReverse)}>
            <div
                className={classNames(styles.roundButtonOuter, styles.inputGroup)}
                style={{
                    display: 'flex',
                    gap: '8px'
                }}
            >
                {props.playhead ? (
                    <button
                            className={classNames(styles.roundButton, styles.playButton)}
                            title={props.intl.formatMessage(messages.pause)}
                            onClick={props.onPause}
                        >
                            <img
                                draggable={false}
                                src={pauseIcon}
                            />
                        </button>
                ) : (
                        <button
                            className={classNames(styles.roundButton, styles.playButton)}
                            title={props.intl.formatMessage(messages.play)}
                            onClick={props.onPlay}
                        >
                            <img
                                draggable={false}
                                src={playIcon}
                            />
                        </button>
                    )}
                    <button
                        className={classNames(styles.roundButton, styles.stopButton)}
                        title={props.intl.formatMessage(messages.stop)}
                        onClick={props.onStop}
                    >
                        <img
                            draggable={false}
                            src={stopIcon}
                        />
                    </button>
            </div>
            <div className={styles.effects}>
                <IconButton
                    className={styles.effectButton}
                    img={modifyIcon}
                    title={"Modify"}
                    onClick={props.onModifySound}
                />
                <IconButton
                    className={styles.effectButton}
                    img={flipIcon}
                    title={<FormattedMessage {...messages.flip} />}
                    onClick={props.onFlip}
                />
                <IconButton
                    className={styles.effectButton}
                    img={fasterIcon}
                    title={<FormattedMessage {...messages.faster} />}
                    onClick={props.onFaster}
                />
                <IconButton
                    className={styles.effectButton}
                    img={slowerIcon}
                    title={<FormattedMessage {...messages.slower} />}
                    onClick={props.onSlower}
                />
                <IconButton
                    disabled={props.tooLoud}
                    className={classNames(styles.effectButton, styles.flipInRtl)}
                    img={louderIcon}
                    title={<FormattedMessage {...messages.louder} />}
                    onClick={props.onLouder}
                />
                <IconButton
                    className={classNames(styles.effectButton, styles.flipInRtl)}
                    img={softerIcon}
                    title={<FormattedMessage {...messages.softer} />}
                    onClick={props.onSofter}
                />
                <IconButton
                    className={classNames(styles.effectButton, styles.flipInRtl)}
                    img={muteIcon}
                    title={<FormattedMessage {...messages.mute} />}
                    onClick={props.onMute}
                />
                <IconButton
                    className={styles.effectButton}
                    img={fadeInIcon}
                    title={<FormattedMessage {...messages.fadeIn} />}
                    onClick={props.onFadeIn}
                />
                <IconButton
                    className={styles.effectButton}
                    img={fadeOutIcon}
                    title={<FormattedMessage {...messages.fadeOut} />}
                    onClick={props.onFadeOut}
                />
                <IconButton
                    className={styles.effectButton}
                    img={reverseIcon}
                    title={<FormattedMessage {...messages.reverse} />}
                    onClick={props.onReverse}
                />
                <IconButton
                    className={styles.effectButton}
                    img={robotIcon}
                    title={<FormattedMessage {...messages.robot} />}
                    onClick={props.onRobot}
                />
                <IconButton
                    className={styles.effectButton}
                    img={telephoneIcon}
                    title={"Telephone"}
                    onClick={props.onTelephone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={alienIcon}
                    title={"Alien"}
                    onClick={props.onAlien}
                />
                <IconButton
                    className={styles.effectButton}
                    img={echoIcon}
                    title={<FormattedMessage {...messages.echo} />}
                    onClick={props.onEcho}
                />
                <IconButton
                    className={styles.effectButton}
                    img={reverbIcon}
                    title={"Reverb"}
                    onClick={props.onReverb}
                />
                <IconButton
                    className={styles.effectButton}
                    img={distortionIcon}
                    title={"Distortion"}
                    onClick={props.onDistortion}
                />
                <IconButton
                    className={styles.effectButton}
                    img={lowpassIcon}
                    title={"Low Pass"}
                    onClick={props.onLowPass}
                />
                <IconButton
                    className={styles.effectButton}
                    img={highpassIcon}
                    title={"High Pass"}
                    onClick={props.onHighPass}
                />
                <IconButton
                    className={styles.effectButton}
                    img={formatIcon}
                    title={"Format"}
                    onClick={props.onFormatSound}
                />
                <IconButton
                    className={styles.effectButton}
                    img={megaphoneIcon}
                    title={"Megaphone"}
                    onClick={props.onMegaphone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={trembleIcon}
                    title={"Tremble"}
                    onClick={props.onTremble}
                />
                <IconButton
                    className={styles.effectButton}
                    img={vocoderIcon}
                    title={"Vocode"}
                    onClick={props.onVocoder}
                />
                <IconButton
                    className={styles.effectButton}
                    img={lowBatteryIcon}
                    title={"Low Battery"}
                    onClick={props.onLowBattery}
                />
                <IconButton
                    className={styles.effectButton}
                    img={noiseReductionIcon}
                    title={"Noise Reduction"}
                    onClick={props.onNoiseReduction}
                />
                <IconButton
                    className={styles.effectButton}
                    img={flashbackIcon}
                    title={"Flashback"}
                    onClick={props.onFlashback}
                />
                <IconButton
                    className={styles.effectButton}
                    img={loudBreathsIcon}
                    title={"Loud Breaths"}
                    onClick={props.onLoudBreaths}
                />
                <IconButton
                    className={styles.effectButton}
                    img={metalPipesIcon}
                    title={"Metal Pipes"}
                    onClick={props.onMetalPipes}
                />
                <IconButton
                    className={styles.effectButton}
                    img={djWarpIcon}
                    title={"DJ Warp"}
                    onClick={props.onDJWarp}
                />
                <IconButton
                    className={styles.effectButton}
                    img={backpackRadioIcon}
                    title={"Backpack Radio"}
                    onClick={props.onBackpackRadio}
                />
                <IconButton
                    className={styles.effectButton}
                    img={bAndWTVIcon}
                    title={"B&W TV"}
                    onClick={props.onBAndWTV}
                />
                <IconButton
                    className={styles.effectButton}
                    img={micMalfunctionIcon}
                    title={"Mic Malfunction"}
                    onClick={props.onMicMalfunction}
                />
                <IconButton
                    className={styles.effectButton}
                    img={electroShiftIcon}
                    title={"Electro Shift"}
                    onClick={props.onElectroShift}
                />
                <IconButton
                    className={styles.effectButton}
                    img={distortedMicIcon}
                    title={"Distorted Mic"}
                    onClick={props.onDistortedMic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={normalizeIcon}
                    title={"Normalize"}
                    onClick={props.onNormalize}
                />
                <IconButton
                    className={styles.effectButton}
                    img={transceiverIcon}
                    title={"Transceiver"}
                    onClick={props.onTransceiver}
                />
            </div>
        </div>
        <div className={styles.infoRow}>
            <div className={styles.duration}>
                {formatDuration(props.playhead, props.trimStart, props.trimEnd, props.duration)}
            </div>
            <div className={styles.advancedInfo}>
                {props.sampleRate}
                {'Hz '}
                {`${String(props.dataFormat).toUpperCase()} `}
                {props.isStereo ? (
                    <FormattedMessage
                        defaultMessage="Stereo"
                        description="Refers to a 'Stereo Sound' (2 channels)"
                        id="tw.stereo"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Mono"
                        description="Refers to a 'Mono Sound' (1 channel)"
                        id="tw.mono"
                    />
                )}
                {` (${formatSoundSize(props.size)})`}
            </div>
        </div>
        {/* TODO: don't know whether this should be > or >=. Using >= for now to be safe */}
        {props.size >= SOUND_BYTE_LIMIT && (
            <div className={classNames(styles.alert, styles.tooLarge)}>
                <FormattedMessage
                    defaultMessage="This sound may be too large to upload to Penguinmod or Scratch."
                    description="Message that appears when a sound exceeds the PM/SCR sound size limit."
                    id="tw.tooLarge"
                />
            </div>
        )}
        {props.size > SOUND_BYTE_LIMIT &&
                        <div className={classNames(styles.alert, styles.stereo)}>
                            <FormattedMessage
                                defaultMessage="Editing this sound will irreversibly lower its quality."
                                description="Message that appears when editing a large sound."
                                id="nb.sizeAlert"
                            />
                        </div>
                    }
        {(props.dataFormat === "mp3" || props.dataFormat === "ogg" || props.dataFormat === "flac") && (
             <div className={classNames(styles.alert, styles.stereo)}>
                 <FormattedMessage
                     defaultMessage="Editing this sound will irreversibly convert it to a much larger, WAV format sound."
                     description="Message that appears when editing an mp3, ogg or flac sound."
                     id="pm.formatAlert"
                 />
             </div>
        )}
        {(props.dataFormat === "ogg") && (
             <div className={classNames(styles.alert, styles.tooLarge)}>
                 <FormattedMessage
                     defaultMessage="Users on iOS and MacOS will need to update their browser or device to hear any OGG sounds."
                     description="Message that appears when editing an ogg sound."
                     id="pm.oggSafariAlert"
                 />
             </div>
        )}
        {props.isStereo && (
            <div className={classNames(styles.alert, styles.stereo)}>
                <FormattedMessage
                    defaultMessage="Editing this stereo sound will irreversibly convert it to mono."
                    description="Message that appears when editing a stereo sound."
                    id="tw.stereoAlert"
                />
            </div>
        )}
    </div>
);

SoundEditor.propTypes = {
    isStereo} PropTypes.bool.isRequired,
    duration: PropTypes.number.isRequired,
    dataFormat: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    sampleRate: PropTypes.number.isRequired,
    canPaste: PropTypes.bool.isRequired,
    canRedo: PropTypes.bool.isRequired,
    canUndo: PropTypes.bool.isRequired,
    chunkLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
    intl: intlShape,
    name: PropTypes.string.isRequired,
    onChangeName: PropTypes.func.isRequired,
    onContainerClick: PropTypes.func.isRequired,
    onCopy: PropTypes.func.isRequired,
    onCopyToNew: PropTypes.func.isRequired,
    onCut: PropTypes.func.isRequired,
    onCutToNew: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onDeleteInverse: PropTypes.func,
    onEcho: PropTypes.func.isRequired,
    onLowPass: PropTypes.func.isRequired,
    onHighPass: PropTypes.func.isRequired,
    onFadeIn: PropTypes.func.isRequired,
    onFadeOut: PropTypes.func.isRequired,
    onFlip: PropTypes.func.isRequired,
    onReverb: PropTypes.func.isRequired,
    onTelephone: PropTypes.func.isRequired,
    onAlien: PropTypes.func.isRequired,
    onDistortion: PropTypes.func.isRequired,
    onVocoder: PropTypes.func.isRequired,
    onLowBattery: PropTypes.func.isRequired,
    onNoiseReduction: PropTypes.func.isRequired,
    onFlashback: PropTypes.func.isRequired,
    onLoudBreaths: PropTypes.func.isRequired,
    onMetalPipes: PropTypes.func.isRequired,
    onDJWarp: PropTypes.func.isRequired,
    onBackpackRadio: PropTypes.func.isRequired,
    onBAndWTV: PropTypes.func.isRequired,
    onMicMalfunction: PropTypes.func.isRequired,
    onElectroShift: PropTypes.func.isRequired,
    onDistortedMic: PropTypes.func.isRequired,
    onNormalize: PropTypes.func.isRequired,
    onTransceiver: PropTypes.func.isRequired,
    onBitCrush: PropTypes.func.isRequired,
    onHigherPitch: PropTypes.func.isRequired,
    onLowerPitch: PropTypes.func.isRequired,
    onMegaphone: PropTypes.func.isRequired,
    onTremble: PropTypes.func.isRequired,
    onFaster: PropTypes.func.isRequired,
    onModifySound: PropTypes.func.isRequired,
    onFormatSound: PropTypes.func.isRequired,
    onLouder: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    onPaste: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onReverse: PropTypes.func.isRequired,
    onRobot: PropTypes.func.isRequired,
    onSetTrim: PropTypes.func,
    onSlower: PropTypes.func.isRequired,
    onSofter: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onUpdatePlayhead: PropTypes.func.isRequired,
    onTimeStepMouseDown: PropTypes.func,
    playhead: PropTypes.number,
    playing: PropTypes.bool.isRequired,
    setRef: PropTypes.func,
    setTimeStepRef: PropTypes.func.isRequired,
    timeStepCount: PropTypes.number,
    timeStepWidth: PropTypes.number,
    timeStepTime: PropTypes.number,
    tooLoud: PropTypes.bool.isRequired,
    trimEnd: PropTypes.number,
    trimStart: PropTypes.number,
    onSetTrimChannel: PropTypes.func,
    trimChannel: PropTypes.arrayOf(PropTypes.bool),
    preferences: PropTypes.object
};

export default injectIntl(SoundEditor);
