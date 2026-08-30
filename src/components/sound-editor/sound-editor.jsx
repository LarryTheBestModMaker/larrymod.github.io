import PropTypes from 'prop-types';
import React from 'react';
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
import Dropdown from '../dropdown/dropdown.jsx';
import InputGroup from '../input-group/input-group.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import { hideLabel } from '../../lib/hide-label';

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
import bAndWTVIcon from './icon--tv.svg';
import micMalfunctionIcon from './icon--mic-malfunction.svg';
import electroShiftIcon from './icon--electro-shift.svg';
import distortedMicIcon from './icon--distorted-mic.svg';
import normalizeIcon from './icon--normalize.svg';
import transceiverIcon from './icon--transceiver.svg';
import bassBoostIcon from './icon--bass-boost.svg';
import musicIcon from './icon--music.svg';
import consoleHeadsetIcon from './icon--console-headset.svg';
import droneSpeakerIcon from './icon--drone-speaker.svg';
import tubeTVIcon from './icon--tv.svg';

import deleteIcon from '!../../lib/tw-recolor/build!./icon--delete.svg';
import copyIcon from '!../../lib/tw-recolor/build!./icon--copy.svg';
import pasteIcon from '!../../lib/tw-recolor/build!./icon--paste.svg';
import cutIcon from '!../../lib/tw-recolor/build!./icon--cut.svg';
import copyToNewIcon from '!../../lib/tw-recolor/build!./icon--copy-to-new.svg';
import trimIcon from '!../../lib/tw-recolor/build!./icon--trim-action.svg';

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
    speechToSong: {
        id: 'gui.soundEditor.speechToSong',
        description: 'Title of the dropdown to make a speech a song',
        defaultMessage: 'Speech to Song'
    },
    audioTranslator: {
        id: 'gui.soundEditor.audioTranslator',
        description: 'Title of the dropdown to translate words in a sound to a different language',
        defaultMessage: 'Audio Translator'
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
                        <Dropdown
                            className={styles.modUnselect}
                            enterExitTransitionDurationMs={20}
                            popoverContent={
                                <InputGroup
                                    className={styles.modContextMenu}
                                >
                                    <LabeledIconButton
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={musicIcon}
                                        title={'Hip Hop'}
                                        onClick={props.onHipHop}
                                    />
                                    <LabeledIconButton
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={musicIcon}
                                        title={'R&B'}
                                        onClick={props.onRAndB}
                                    />
                                    <LabeledIconButton
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={musicIcon}
                                        title={'Reggae'}
                                        onClick={props.onReggae}
                                    />
                                    <LabeledIconButton
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={musicIcon}
                                        title={'Jazz'}
                                        onClick={props.onJazz}
                                    />
                                    <LabeledIconButton
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={musicIcon}
                                        title={'Folk'}
                                        onClick={props.onFolk}
                                    />
                                </InputGroup>
                            }
                            tipSize={.01}
                        >
                            {props.intl.formatMessage(messages.speechToSong)}
                        </Dropdown>
                        <Dropdown
                            className={styles.modUnselect}
                            enterExitTransitionDurationMs={20}
                            popoverContent={
                                <InputGroup
                                    className={styles.modContextMenu}
                                >
                                    <LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Abkhaz'}
    onClick={props.onAbkhaz}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Acehnese'}
    onClick={props.onAcehnese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Acholi'}
    onClick={props.onAcholi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Afar'}
    onClick={props.onAfar}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Afrikaans'}
    onClick={props.onAfrikaans}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Albanian'}
    onClick={props.onAlbanian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Alur'}
    onClick={props.onAlur}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Amharic'}
    onClick={props.onAmharic}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Arabic'}
    onClick={props.onArabic}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Armenian'}
    onClick={props.onArmenian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Assamese'}
    onClick={props.onAssamese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Avar'}
    onClick={props.onAvar}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Awadhi'}
    onClick={props.onAwadhi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Aymara'}
    onClick={props.onAymara}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Azerbaijani'}
    onClick={props.onAzerbaijani}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Balinese'}
    onClick={props.onBalinese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Baluchi'}
    onClick={props.onBaluchi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Bambara'}
    onClick={props.onBambara}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Baoulé'}
    onClick={props.onBaoule}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Bashkir'}
    onClick={props.onBashkir}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Basque'}
    onClick={props.onBasque}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Batak Karo'}
    onClick={props.onBatakKaro}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Batak Simalungun'}
    onClick={props.onBatakSimalungun}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Batak Toba'}
    onClick={props.onBatakToba}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Belarusian'}
    onClick={props.onBelarusian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Bemba'}
    onClick={props.onBemba}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Bengali'}
    onClick={props.onBengali}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Betawi'}
    onClick={props.onBetawi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Bhojpuri'}
    onClick={props.onBhojpuri}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Bikol'}
    onClick={props.onBikol}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Bosnian'}
    onClick={props.onBosnian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Breton'}
    onClick={props.onBreton}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Bulgarian'}
    onClick={props.onBulgarian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Buryat'}
    onClick={props.onBuryat}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Cantonese'}
    onClick={props.onCantonese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Catalan'}
    onClick={props.onCatalan}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Cebuano'}
    onClick={props.onCebuano}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Chamorro'}
    onClick={props.onChamorro}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Chechen'}
    onClick={props.onChechen}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Chichewa'}
    onClick={props.onChichewa}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Chinese (Simplified)'}
    onClick={props.onChineseSimplified}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Chinese (Traditional)'}
    onClick={props.onChineseTraditional}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Chuukese'}
    onClick={props.onChuukese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Chuvash'}
    onClick={props.onChuvash}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Corsican'}
    onClick={props.onCorsican}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Crimean Tatar (Cyrillic)'}
    onClick={props.onCrimeanTatarCyrillic}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Crimean Tatar (Latin)'}
    onClick={props.onCrimeanTatarLatin}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Croatian'}
    onClick={props.onCroatian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Czech'}
    onClick={props.onCzech}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Danish'}
    onClick={props.onDanish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Dari'}
    onClick={props.onDari}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Dhivehi'}
    onClick={props.onDhivehi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Dinka'}
    onClick={props.onDinka}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Dogri'}
    onClick={props.onDogri}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Dombe'}
    onClick={props.onDombe}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Dutch'}
    onClick={props.onDutch}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Dyula'}
    onClick={props.onDyula}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Dzongkha'}
    onClick={props.onDzongkha}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'English'}
    onClick={props.onEnglish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Esperanto'}
    onClick={props.onEsperanto}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Estonian'}
    onClick={props.onEstonian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Ewe'}
    onClick={props.onEwe}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Faroese'}
    onClick={props.onFaroese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Fijian'}
    onClick={props.onFijian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Filipino'}
    onClick={props.onFilipino}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Finnish'}
    onClick={props.onFinnish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Fon'}
    onClick={props.onFon}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'French'}
    onClick={props.onFrench}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'French (Canada)'}
    onClick={props.onFrenchCanada}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Frisian'}
    onClick={props.onFrisian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Friulian'}
    onClick={props.onFriulian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Fulani'}
    onClick={props.onFulani}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Ga'}
    onClick={props.onGa}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Galician'}
    onClick={props.onGalician}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Georgian'}
    onClick={props.onGeorgian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'German'}
    onClick={props.onGerman}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Greek'}
    onClick={props.onGreek}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Guarani'}
    onClick={props.onGuarani}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Gujarati'}
    onClick={props.onGujarati}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Haitian Creole'}
    onClick={props.onHaitianCreole}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Hakha Chin'}
    onClick={props.onHakhaChin}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Hausa'}
    onClick={props.onHausa}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Hawaiian'}
    onClick={props.onHawaiian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Hebrew'}
    onClick={props.onHebrew}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Hiligaynon'}
    onClick={props.onHiligaynon}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Hindi'}
    onClick={props.onHindi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Hmong'}
    onClick={props.onHmong}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Hungarian'}
    onClick={props.onHungarian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Hunsrik'}
    onClick={props.onHunsrik}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Iban'}
    onClick={props.onIban}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Icelandic'}
    onClick={props.onIcelandic}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Igbo'}
    onClick={props.onIgbo}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Ilocano'}
    onClick={props.onIlocano}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Indonesian'}
    onClick={props.onIndonesian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Inuktut (Latin)'}
    onClick={props.onInuktutLatin}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Inuktut (Syllabics)'}
    onClick={props.onInuktutSyllabics}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Irish'}
    onClick={props.onIrish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Italian'}
    onClick={props.onItalian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Jamaican Patois'}
    onClick={props.onJamaicanPatois}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Japanese'}
    onClick={props.onJapanese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Javanese'}
    onClick={props.onJavanese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Jingpo'}
    onClick={props.onJingpo}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kalaallisut'}
    onClick={props.onKalaallisut}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kannada'}
    onClick={props.onKannada}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kanuri'}
    onClick={props.onKanuri}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kapampangan'}
    onClick={props.onKapampangan}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kazakh'}
    onClick={props.onKazakh}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Khasi'}
    onClick={props.onKhasi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Khmer'}
    onClick={props.onKhmer}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kiga'}
    onClick={props.onKiga}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kikongo'}
    onClick={props.onKikongo}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kinyarwanda'}
    onClick={props.onKinyarwanda}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kituba'}
    onClick={props.onKituba}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kokborok'}
    onClick={props.onKokborok}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Komi'}
    onClick={props.onKomi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Konkani'}
    onClick={props.onKonkani}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Korean'}
    onClick={props.onKorean}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Krio'}
    onClick={props.onKrio}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kurdish (Kurmanji)'}
    onClick={props.onKurdishKurmanji}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kurdish (Sorani)'}
    onClick={props.onKurdishSorani}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Kyrgyz'}
    onClick={props.onKyrgyz}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Lao'}
    onClick={props.onLao}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Latgalian'}
    onClick={props.onLatgalian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Latin'}
    onClick={props.onLatin}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Latvian'}
    onClick={props.onLatvian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Ligurian'}
    onClick={props.onLigurian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Limburgish'}
    onClick={props.onLimburgish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Lingala'}
    onClick={props.onLingala}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Lithuanian'}
    onClick={props.onLithuanian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Lombard'}
    onClick={props.onLombard}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Luganda'}
    onClick={props.onLuganda}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Luo'}
    onClick={props.onLuo}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Luxembourgish'}
    onClick={props.onLuxembourgish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Macedonian'}
    onClick={props.onMacedonian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Madurese'}
    onClick={props.onMadurese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Maithili'}
    onClick={props.onMaithili}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Makassar'}
    onClick={props.onMakassar}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Malagasy'}
    onClick={props.onMalagasy}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Malay'}
    onClick={props.onMalay}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Malay (Jawi)'}
    onClick={props.onMalayJawi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Malayalam'}
    onClick={props.onMalayalam}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Maltese'}
    onClick={props.onMaltese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Mam'}
    onClick={props.onMam}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Manx'}
    onClick={props.onManx}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Maori'}
    onClick={props.onMaori}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Marathi'}
    onClick={props.onMarathi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Marshallese'}
    onClick={props.onMarshallese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Marwadi'}
    onClick={props.onMarwadi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Mauritian Creole'}
    onClick={props.onMauritianCreole}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Meadow Mari'}
    onClick={props.onMeadowMari}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Meiteilon (Manipuri)'}
    onClick={props.onMeiteilonManipuri}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Minang'}
    onClick={props.onMinang}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Mizo'}
    onClick={props.onMizo}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Mongolian'}
    onClick={props.onMongolian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Myanmar (Burmese)'}
    onClick={props.onMyanmarBurmese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Nahuatl (Eastern Huasteca)'}
    onClick={props.onNahuatlEasternHuasteca}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Ndau'}
    onClick={props.onNdau}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Ndebele (South)'}
    onClick={props.onNdebeleSouth}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Nepalbhasa (Newari)'}
    onClick={props.onNepalbhasaNewari}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Nepali'}
    onClick={props.onNepali}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'NKo'}
    onClick={props.onNKo}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Norwegian'}
    onClick={props.onNorwegian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Nuer'}
    onClick={props.onNuer}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Occitan'}
    onClick={props.onOccitan}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Odia (Oriya)'}
    onClick={props.onOdiaOriya}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Oromo'}
    onClick={props.onOromo}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Ossetian'}
    onClick={props.onOssetian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Pangasinan'}
    onClick={props.onPangasinan}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Papiamento'}
    onClick={props.onPapiamento}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Pashto'}
    onClick={props.onPashto}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Persian'}
    onClick={props.onPersian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Polish'}
    onClick={props.onPolish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Portuguese (Brazil)'}
    onClick={props.onPortugueseBrazil}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Portuguese (Portugal)'}
    onClick={props.onPortuguesePortugal}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Punjabi (Gurmukhi)'}
    onClick={props.onPunjabiGurmukhi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Punjabi (Shahmukhi)'}
    onClick={props.onPunjabiShahmukhi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Quechua'}
    onClick={props.onQuechua}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Qʼeqchiʼ'}
    onClick={props.onQeqchi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Romani'}
    onClick={props.onRomani}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Romanian'}
    onClick={props.onRomanian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Rundi'}
    onClick={props.onRundi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Russian'}
    onClick={props.onRussian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Sami (North)'}
    onClick={props.onSamiNorth}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Samoan'}
    onClick={props.onSamoan}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Sango'}
    onClick={props.onSango}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Sanskrit'}
    onClick={props.onSanskrit}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Santali (Latin)'}
    onClick={props.onSantaliLatin}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Santali (Ol Chiki)'}
    onClick={props.onSantaliOlChiki}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Scots Gaelic'}
    onClick={props.onScotsGaelic}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Sepedi'}
    onClick={props.onSepedi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Serbian'}
    onClick={props.onSerbian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Sesotho'}
    onClick={props.onSesotho}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Seychellois Creole'}
    onClick={props.onSeychelloisCreole}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Shan'}
    onClick={props.onShan}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Shona'}
    onClick={props.onShona}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Sicilian'}
    onClick={props.onSicilian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Silesian'}
    onClick={props.onSilesian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Sindhi'}
    onClick={props.onSindhi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Sinhala'}
    onClick={props.onSinhala}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Slovak'}
    onClick={props.onSlovak}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Slovenian'}
    onClick={props.onSlovenian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Somali'}
    onClick={props.onSomali}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Spanish'}
    onClick={props.onSpanish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Sundanese'}
    onClick={props.onSundanese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Susu'}
    onClick={props.onSusu}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Swahili'}
    onClick={props.onSwahili}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Swati'}
    onClick={props.onSwati}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Swedish'}
    onClick={props.onSwedish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tahitian'}
    onClick={props.onTahitian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tajik'}
    onClick={props.onTajik}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tamazight'}
    onClick={props.onTamazight}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tamazight (Tifinagh)'}
    onClick={props.onTamazightTifinagh}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tamil'}
    onClick={props.onTamil}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tatar'}
    onClick={props.onTatar}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Telugu'}
    onClick={props.onTelugu}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tetum'}
    onClick={props.onTetum}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Thai'}
    onClick={props.onThai}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tibetan'}
    onClick={props.onTibetan}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tigrinya'}
    onClick={props.onTigrinya}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tiv'}
    onClick={props.onTiv}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tok Pisin'}
    onClick={props.onTokPisin}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tongan'}
    onClick={props.onTongan}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tshiluba'}
    onClick={props.onTshiluba}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tsonga'}
    onClick={props.onTsonga}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tswana'}
    onClick={props.onTswana}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tulu'}
    onClick={props.onTulu}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tumbuka'}
    onClick={props.onTumbuka}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Turkish'}
    onClick={props.onTurkish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Turkmen'}
    onClick={props.onTurkmen}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Tuvan'}
    onClick={props.onTuvan}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Twi'}
    onClick={props.onTwi}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Udmurt'}
    onClick={props.onUdmurt}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Ukrainian'}
    onClick={props.onUkrainian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Urdu'}
    onClick={props.onUrdu}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Uyghur'}
    onClick={props.onUyghur}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Uzbek'}
    onClick={props.onUzbek}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Venda'}
    onClick={props.onVenda}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Venetian'}
    onClick={props.onVenetian}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Vietnamese'}
    onClick={props.onVietnamese}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Waray'}
    onClick={props.onWaray}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Welsh'}
    onClick={props.onWelsh}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Wolof'}
    onClick={props.onWolof}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Xhosa'}
    onClick={props.onXhosa}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Yakut'}
    onClick={props.onYakut}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Yiddish'}
    onClick={props.onYiddish}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Yoruba'}
    onClick={props.onYoruba}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Yucatec Maya'}
    onClick={props.onYucatecMaya}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Zapotec'}
    onClick={props.onZapotec}
/>
<LabeledIconButton
    hideLabel={hideLabel(props.intl.locale)}
    imgSrc={translateIcon}
    title={'Zulu'}
    onClick={props.onZulu}
/>
</InputGroup>
                            }
                            tipSize={.01}
                        >
                            {props.intl.formatMessage(messages.audioTranslator)}
                        </Dropdown>
        </div>
        <div className={styles.row}>
            <div className={styles.waveformContainer}>
                <Waveform
                    data={props.chunkLevels}
                    height={160}
                    width={600}
                />
                <AudioSelector
                    playhead={props.playhead}
                    trimEnd={props.trimEnd}
                    trimStart={props.trimStart}
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
                        className={classNames(styles.roundButton, styles.stopButtonn)}
                        title={props.intl.formatMessage(messages.stop)}
                        onClick={props.onStop}
                    >
                        <img
                            draggable={false}
                            src={stopIcon}
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
                <IconButton
                    className={styles.effectButton}
                    img={bassBoostIcon}
                    title={"Bass Boost"}
                    onClick={props.onBassBoost}
                />
                <IconButton
                    className={styles.effectButton}
                    img={consoleHeadsetIcon}
                    title={"Console Headset"}
                    onClick={props.onConsoleHeadset}
                />
                <IconButton
                    className={styles.effectButton}
                    img={droneSpeakerIcon}
                    title={"Drone Speaker"}
                    onClick={props.onDroneSpeaker}
                />
                <IconButton
                    className={styles.effectButton}
                    img={tubeTVIcon}
                    title={"Tube TV"}
                    onClick={props.onTubeTV}
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
    isStereo: PropTypes.bool.isRequired,
    duration: PropTypes.number.isRequired,
    dataFormat: PropTypes.number.isRequired,
    size: PropTypes.bool.isRequired,
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
    onBassBoost: PropTypes.func.isRequired,
    onHipHop: PropTypes.func.isRequired,
    onRAndB: PropTypes.func.isRequired,
    onReggae: PropTypes.func.isRequired,
    onJazz: PropTypes.func.isRequired,
    onFolk: PropTypes.func.isRequired,
    onConsoleHeadset: PropTypes.func.isRequired,
    onDroneSpeaker: PropTypes.func.isRequired,
    onTubeTV: PropTypes.func.isRequired,
    onAbkhaz: PropTypes.func.isRequired,
onAcehnese: PropTypes.func.isRequired,
onAcholi: PropTypes.func.isRequired,
onAfar: PropTypes.func.isRequired,
onAfrikaans: PropTypes.func.isRequired,
onAlbanian: PropTypes.func.isRequired,
onAlur: PropTypes.func.isRequired,
onAmharic: PropTypes.func.isRequired,
onArabic: PropTypes.func.isRequired,
onArmenian: PropTypes.func.isRequired,
onAssamese: PropTypes.func.isRequired,
onAvar: PropTypes.func.isRequired,
onAwadhi: PropTypes.func.isRequired,
onAymara: PropTypes.func.isRequired,
onAzerbaijani: PropTypes.func.isRequired,
onBalinese: PropTypes.func.isRequired,
onBaluchi: PropTypes.func.isRequired,
onBambara: PropTypes.func.isRequired,
onBaoule: PropTypes.func.isRequired,
onBashkir: PropTypes.func.isRequired,
onBasque: PropTypes.func.isRequired,
onBatakKaro: PropTypes.func.isRequired,
onBatakSimalungun: PropTypes.func.isRequired,
onBatakToba: PropTypes.func.isRequired,
onBelarusian: PropTypes.func.isRequired,
onBemba: PropTypes.func.isRequired,
onBengali: PropTypes.func.isRequired,
onBetawi: PropTypes.func.isRequired,
onBhojpuri: PropTypes.func.isRequired,
onBikol: PropTypes.func.isRequired,
onBosnian: PropTypes.func.isRequired,
onBreton: PropTypes.func.isRequired,
onBulgarian: PropTypes.func.isRequired,
onBuryat: PropTypes.func.isRequired,
onCantonese: PropTypes.func.isRequired,
onCatalan: PropTypes.func.isRequired,
onCebuano: PropTypes.func.isRequired,
onChamorro: PropTypes.func.isRequired,
onChechen: PropTypes.func.isRequired,
onChichewa: PropTypes.func.isRequired,
onChineseSimplified: PropTypes.func.isRequired,
onChineseTraditional: PropTypes.func.isRequired,
onChuukese: PropTypes.func.isRequired,
onChuvash: PropTypes.func.isRequired,
onCorsican: PropTypes.func.isRequired,
onCrimeanTatarCyrillic: PropTypes.func.isRequired,
onCrimeanTatarLatin: PropTypes.func.isRequired,
onCroatian: PropTypes.func.isRequired,
onCzech: PropTypes.func.isRequired,
onDanish: PropTypes.func.isRequired,
onDari: PropTypes.func.isRequired,
onDhivehi: PropTypes.func.isRequired,
onDinka: PropTypes.func.isRequired,
onDogri: PropTypes.func.isRequired,
onDombe: PropTypes.func.isRequired,
onDutch: PropTypes.func.isRequired,
onDyula: PropTypes.func.isRequired,
onDzongkha: PropTypes.func.isRequired,
onEnglish: PropTypes.func.isRequired,
onEsperanto: PropTypes.func.isRequired,
onEstonian: PropTypes.func.isRequired,
onEwe: PropTypes.func.isRequired,
onFaroese: PropTypes.func.isRequired,
onFijian: PropTypes.func.isRequired,
onFilipino: PropTypes.func.isRequired,
onFinnish: PropTypes.func.isRequired,
onFon: PropTypes.func.isRequired,
onFrench: PropTypes.func.isRequired,
onFrenchCanada: PropTypes.func.isRequired,
onFrisian: PropTypes.func.isRequired,
onFriulian: PropTypes.func.isRequired,
onFulani: PropTypes.func.isRequired,
onGa: PropTypes.func.isRequired,
onGalician: PropTypes.func.isRequired,
onGeorgian: PropTypes.func.isRequired,
onGerman: PropTypes.func.isRequired,
onGreek: PropTypes.func.isRequired,
onGuarani: PropTypes.func.isRequired,
onGujarati: PropTypes.func.isRequired,
onHaitianCreole: PropTypes.func.isRequired,
onHakhaChin: PropTypes.func.isRequired,
onHausa: PropTypes.func.isRequired,
onHawaiian: PropTypes.func.isRequired,
onHebrew: PropTypes.func.isRequired,
onHiligaynon: PropTypes.func.isRequired,
onHindi: PropTypes.func.isRequired,
onHmong: PropTypes.func.isRequired,
onHungarian: PropTypes.func.isRequired,
onHunsrik: PropTypes.func.isRequired,
onIban: PropTypes.func.isRequired,
onIcelandic: PropTypes.func.isRequired,
onIgbo: PropTypes.func.isRequired,
onIlocano: PropTypes.func.isRequired,
onIndonesian: PropTypes.func.isRequired,
onInuktutLatin: PropTypes.func.isRequired,
onInuktutSyllabics: PropTypes.func.isRequired,
onIrish: PropTypes.func.isRequired,
onItalian: PropTypes.func.isRequired,
onJamaicanPatois: PropTypes.func.isRequired,
onJapanese: PropTypes.func.isRequired,
onJavanese: PropTypes.func.isRequired,
onJingpo: PropTypes.func.isRequired,
onKalaallisut: PropTypes.func.isRequired,
onKannada: PropTypes.func.isRequired,
onKanuri: PropTypes.func.isRequired,
onKapampangan: PropTypes.func.isRequired,
onKazakh: PropTypes.func.isRequired,
onKhasi: PropTypes.func.isRequired,
onKhmer: PropTypes.func.isRequired,
onKiga: PropTypes.func.isRequired,
onKikongo: PropTypes.func.isRequired,
onKinyarwanda: PropTypes.func.isRequired,
onKituba: PropTypes.func.isRequired,
onKokborok: PropTypes.func.isRequired,
onKomi: PropTypes.func.isRequired,
onKonkani: PropTypes.func.isRequired,
onKorean: PropTypes.func.isRequired,
onKrio: PropTypes.func.isRequired,
onKurdishKurmanji: PropTypes.func.isRequired,
onKurdishSorani: PropTypes.func.isRequired,
onKyrgyz: PropTypes.func.isRequired,
onLao: PropTypes.func.isRequired,
onLatgalian: PropTypes.func.isRequired,
onLatin: PropTypes.func.isRequired,
onLatvian: PropTypes.func.isRequired,
onLigurian: PropTypes.func.isRequired,
onLimburgish: PropTypes.func.isRequired,
onLingala: PropTypes.func.isRequired,
onLithuanian: PropTypes.func.isRequired,
onLombard: PropTypes.func.isRequired,
onLuganda: PropTypes.func.isRequired,
onLuo: PropTypes.func.isRequired,
onLuxembourgish: PropTypes.func.isRequired,
onMacedonian: PropTypes.func.isRequired,
onMadurese: PropTypes.func.isRequired,
onMaithili: PropTypes.func.isRequired,
onMakassar: PropTypes.func.isRequired,
onMalagasy: PropTypes.func.isRequired,
onMalay: PropTypes.func.isRequired,
onMalayJawi: PropTypes.func.isRequired,
onMalayalam: PropTypes.func.isRequired,
onMaltese: PropTypes.func.isRequired,
onMam: PropTypes.func.isRequired,
onManx: PropTypes.func.isRequired,
onMaori: PropTypes.func.isRequired,
onMarathi: PropTypes.func.isRequired,
onMarshallese: PropTypes.func.isRequired,
onMarwadi: PropTypes.func.isRequired,
onMauritianCreole: PropTypes.func.isRequired,
onMeadowMari: PropTypes.func.isRequired,
onMeiteilonManipuri: PropTypes.func.isRequired,
onMinang: PropTypes.func.isRequired,
onMizo: PropTypes.func.isRequired,
onMongolian: PropTypes.func.isRequired,
onMyanmarBurmese: PropTypes.func.isRequired,
onNahuatlEasternHuasteca: PropTypes.func.isRequired,
onNdau: PropTypes.func.isRequired,
onNdebeleSouth: PropTypes.func.isRequired,
onNepalbhasaNewari: PropTypes.func.isRequired,
onNepali: PropTypes.func.isRequired,
onNKo: PropTypes.func.isRequired,
onNorwegian: PropTypes.func.isRequired,
onNuer: PropTypes.func.isRequired,
onOccitan: PropTypes.func.isRequired,
onOdiaOriya: PropTypes.func.isRequired,
onOromo: PropTypes.func.isRequired,
onOssetian: PropTypes.func.isRequired,
onPangasinan: PropTypes.func.isRequired,
onPapiamento: PropTypes.func.isRequired,
onPashto: PropTypes.func.isRequired,
onPersian: PropTypes.func.isRequired,
onPolish: PropTypes.func.isRequired,
onPortugueseBrazil: PropTypes.func.isRequired,
onPortuguesePortugal: PropTypes.func.isRequired,
onPunjabiGurmukhi: PropTypes.func.isRequired,
onPunjabiShahmukhi: PropTypes.func.isRequired,
onQuechua: PropTypes.func.isRequired,
onQeqchi: PropTypes.func.isRequired,
onRomani: PropTypes.func.isRequired,
onRomanian: PropTypes.func.isRequired,
onRundi: PropTypes.func.isRequired,
onRussian: PropTypes.func.isRequired,
onSamiNorth: PropTypes.func.isRequired,
onSamoan: PropTypes.func.isRequired,
onSango: PropTypes.func.isRequired,
onSanskrit: PropTypes.func.isRequired,
onSantaliLatin: PropTypes.func.isRequired,
onSantaliOlChiki: PropTypes.func.isRequired,
onScotsGaelic: PropTypes.func.isRequired,
onSepedi: PropTypes.func.isRequired,
onSerbian: PropTypes.func.isRequired,
onSesotho: PropTypes.func.isRequired,
onSeychelloisCreole: PropTypes.func.isRequired,
onShan: PropTypes.func.isRequired,
onShona: PropTypes.func.isRequired,
onSicilian: PropTypes.func.isRequired,
onSilesian: PropTypes.func.isRequired,
onSindhi: PropTypes.func.isRequired,
onSinhala: PropTypes.func.isRequired,
onSlovak: PropTypes.func.isRequired,
onSlovenian: PropTypes.func.isRequired,
onSomali: PropTypes.func.isRequired,
onSpanish: PropTypes.func.isRequired,
onSundanese: PropTypes.func.isRequired,
onSusu: PropTypes.func.isRequired,
onSwahili: PropTypes.func.isRequired,
onSwati: PropTypes.func.isRequired,
onSwedish: PropTypes.func.isRequired,
onTahitian: PropTypes.func.isRequired,
onTajik: PropTypes.func.isRequired,
onTamazight: PropTypes.func.isRequired,
onTamazightTifinagh: PropTypes.func.isRequired,
onTamil: PropTypes.func.isRequired,
onTatar: PropTypes.func.isRequired,
onTelugu: PropTypes.func.isRequired,
onTetum: PropTypes.func.isRequired,
onThai: PropTypes.func.isRequired,
onTibetan: PropTypes.func.isRequired,
onTigrinya: PropTypes.func.isRequired,
onTiv: PropTypes.func.isRequired,
onTokPisin: PropTypes.func.isRequired,
onTongan: PropTypes.func.isRequired,
onTshiluba: PropTypes.func.isRequired,
onTsonga: PropTypes.func.isRequired,
onTswana: PropTypes.func.isRequired,
onTulu: PropTypes.func.isRequired,
onTumbuka: PropTypes.func.isRequired,
onTurkish: PropTypes.func.isRequired,
onTurkmen: PropTypes.func.isRequired,
onTuvan: PropTypes.func.isRequired,
onTwi: PropTypes.func.isRequired,
onUdmurt: PropTypes.func.isRequired,
onUkrainian: PropTypes.func.isRequired,
onUrdu: PropTypes.func.isRequired,
onUyghur: PropTypes.func.isRequired,
onUzbek: PropTypes.func.isRequired,
onVenda: PropTypes.func.isRequired,
onVenetian: PropTypes.func.isRequired,
onVietnamese: PropTypes.func.isRequired,
onWaray: PropTypes.func.isRequired,
onWelsh: PropTypes.func.isRequired,
onWolof: PropTypes.func.isRequired,
onXhosa: PropTypes.func.isRequired,
onYakut: PropTypes.func.isRequired,
onYiddish: PropTypes.func.isRequired,
onYoruba: PropTypes.func.isRequired,
onYucatecMaya: PropTypes.func.isRequired,
onZapotec: PropTypes.func.isRequired,
onZulu: PropTypes.func.isRequired,
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
    playhead: PropTypes.number,
    setRef: PropTypes.func,
    tooLoud: PropTypes.bool.isRequired,
    trimEnd: PropTypes.number,
    trimStart: PropTypes.number
};

export default injectIntl(SoundEditor);
