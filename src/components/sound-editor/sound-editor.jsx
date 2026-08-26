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

import styles from './sound-editor.css';

import playIcon from './icon--play.svg';
import pauseIcon from './icon--pause.svg';
import stopIcon from './icon--stop.svg';
import redoIcon from '!../../lib/tw-recolor/build!./icon--redo.svg';
import undoIcon from '!../../lib/tw-recolor/build!./icon--undo.svg';
import fasterIcon from './icon--faster.svg';
import slowerIcon from './icon--slower.svg';
import louderIcon from './icon--louder.svg';
import softerIcon from './icon--softer.svg';
import robotIcon from './icon--robot.svg';
import reverseIcon from './icon--reverse.svg';
import fadeOutIcon from './icon--fade-out.svg';
import fadeInIcon from './icon--fade-in.svg';
import muteIcon from './icon--mute.svg';
import SonicDestructorIcon from './icon--sonic-destructor.svg';
import BrokenMicIcon from './icon--broken-mic.svg';
import DemonizedIcon from './icon--demonized.svg';
import LostSoulIcon from './icon--lost-soul.svg';
import DivineEchoIcon from './icon--divine-echo.svg';
import SplitEchoesIcon from './icon--split-echoes.svg';
import EtherealIcon from './icon--ethereal.svg';
import BandpassReverbIcon from './icon--bandpass-reverb.svg';
import RadiantEchoIcon from './icon--radiant-echo.svg';
import FlashbackIcon from './icon--flashback.svg';
import EchoIcon from './icon--echo.svg';
import InfiniteEchoesIcon from './icon--infinite-echoes.svg';
import MemoriesIcon from './icon--memories.svg';
import EtherealIiIcon from './icon--ethereal-ii.svg';
import EchoPlusIcon from './icon--echo-plus.svg';
import SoulJourneyIcon from './icon--soul-journey.svg';
import CrispMicIcon from './icon--crisp-mic.svg';
import SoundWidenerIcon from './icon--sound-widener.svg';
import PsychedelicIcon from './icon--psychedelic.svg';
import OppositeDuoIcon from './icon--opposite-duo.svg';
import WideSpookyEchoIcon from './icon--wide-spooky-echo.svg';
import LiveBounceIcon from './icon--live-bounce.svg';
import 9dSoundscapeIcon from './icon--9d-soundscape.svg';
import SuperEchoIcon from './icon--super-echo.svg';
import WispyIcon from './icon--wispy.svg';
import DoubleTroubleIcon from './icon--double-trouble.svg';
import AnalogEchoIcon from './icon--analog-echo.svg';
import StadiumAnnouncerIcon from './icon--stadium-announcer.svg';
import EckoIcon from './icon--ecko.svg';
import LoudBreathsIcon from './icon--loud-breaths.svg';
import HarmonyIcon from './icon--harmony.svg';
import PanoramicIcon from './icon--panoramic.svg';
import TalkToTheHandIcon from './icon--talk-to-the-hand.svg';
import ConsoleHeadsetIcon from './icon--console-headset.svg';
import ConcertIcon from './icon--concert.svg';
import ReverbIcon from './icon--reverb.svg';
import InTheWindIcon from './icon--in-the-wind.svg';
import RobotoIcon from './icon--roboto.svg';
import ToyMicrophoneIcon from './icon--toy-microphone.svg';
import CubicleEchoIcon from './icon--cubicle-echo.svg';
import PipaIcon from './icon--pipa.svg';
import ChorusIcon from './icon--chorus.svg';
import InWombIcon from './icon--in-womb.svg';
import TheVoiceIcon from './icon--the-voice.svg';
import PhoneConvoIcon from './icon--phone-convo.svg';
import PracticeRoomIcon from './icon--practice-room.svg';
import MeditationIcon from './icon--meditation.svg';
import DivinaIcon from './icon--divina.svg';
import BoomingIcon from './icon--booming.svg';
import EmptyStudioIcon from './icon--empty-studio.svg';
import SurroundBlastIcon from './icon--surround-blast.svg';
import RetroVibeIcon from './icon--retro-vibe.svg';
import GuitarDelayIcon from './icon--guitar-delay.svg';
import EchoeyIcon from './icon--echoey.svg';
import MagneticIcon from './icon--magnetic.svg';
import VintagePhoneIcon from './icon--vintage-phone.svg';
import MutedBeatIcon from './icon--muted-beat.svg';
import ConcertHallIcon from './icon--concert-hall.svg';
import DripVocalsIcon from './icon--drip-vocals.svg';
import DriftIcon from './icon--drift.svg';
import DrownedOutIcon from './icon--drowned-out.svg';
import HuskyBackupIcon from './icon--husky-backup.svg';
import PayphoneIcon from './icon--payphone.svg';
import DeafnessIcon from './icon--deafness.svg';
import InTheRainIcon from './icon--in-the-rain.svg';
import StreetAnthemIcon from './icon--street-anthem.svg';
import OfficeIcon from './icon--office.svg';
import BackpackRadioIcon from './icon--backpack-radio.svg';
import HellIcon from './icon--hell.svg';
import EchoIiIcon from './icon--echo-ii.svg';
import DoomsdayPaIcon from './icon--doomsday-pa.svg';
import ParkingLotIcon from './icon--parking-lot.svg';
import OuterDimensionIcon from './icon--outer-dimension.svg';
import DistortionIcon from './icon--distortion.svg';
import CaveIcon from './icon--cave.svg';
import RapAttitudeIcon from './icon--rap-attitude.svg';
import ClapsIcon from './icon--claps.svg';
import PaAnnouncerIcon from './icon--pa-announcer.svg';
import MusicHallIcon from './icon--music-hall.svg';
import TubeTvIcon from './icon--tube-tv.svg';
import LoudspeakerIcon from './icon--loudspeaker.svg';
import 8BitIcon from './icon--8-bit.svg';
import GrumpyOrcIcon from './icon--grumpy-orc.svg';
import PhantomEchoIcon from './icon--phantom-echo.svg';
import MusicEnhancerIcon from './icon--music-enhancer.svg';
import HeartbeatsIcon from './icon--heartbeats.svg';
import CassetteTapeIcon from './icon--cassette-tape.svg';
import BadHarmonyIcon from './icon--bad-harmony.svg';
import BigHouseIcon from './icon--big-house.svg';
import NightClubIcon from './icon--night-club.svg';
import ElectronicBeatsIcon from './icon--electronic-beats.svg';
import AlienRadioIcon from './icon--alien-radio.svg';
import LiveBroadcastIcon from './icon--live-broadcast.svg';
import PsyelectroIcon from './icon--psyelectro.svg';
import AirLightIcon from './icon--air-light.svg';
import VinylIcon from './icon--vinyl.svg';
import WaveIcon from './icon--wave.svg';
import OutOfSignalIcon from './icon--out-of-signal.svg';
import AutotuneIcon from './icon--autotune.svg';
import BirthdayPartyIcon from './icon--birthday-party.svg';
import DroneSpeakerIcon from './icon--drone-speaker.svg';
import GravellyAlienIcon from './icon--gravelly-alien.svg';
import DjWarpIcon from './icon--dj-warp.svg';
import BahhIcon from './icon--bahh.svg';
import EvilSpiritIcon from './icon--evil-spirit.svg';
import BadMicIcon from './icon--bad-mic.svg';
import ValleyIcon from './icon--valley.svg';
import IceCaveIcon from './icon--ice-cave.svg';
import Broadway1Icon from './icon--broadway-1.svg';
import GhostStoryIcon from './icon--ghost-story.svg';
import OldPhoneIcon from './icon--old-phone.svg';
import EnergeticIcon from './icon--energetic.svg';
import LosingSanityIcon from './icon--losing-sanity.svg';
import Broadway2Icon from './icon--broadway-2.svg';
import BWTvIcon from './icon--bandw-tv.svg';
import SuperBassIcon from './icon--super-bass.svg';
import SpaceIntercomIcon from './icon--space-intercom.svg';
import ElectronicIcon from './icon--electronic.svg';
import 3dSurroundSoundIcon from './icon--3d-surround-sound.svg';
import ClassroomIcon from './icon--classroom.svg';
import CommutingIcon from './icon--commuting.svg';
import SuperReverbIcon from './icon--super-reverb.svg';
import TrembleIcon from './icon--tremble.svg';
import BleepCensorIcon from './icon--bleep-censor.svg';
import IntercomIcon from './icon--intercom.svg';
import TelephoneIcon from './icon--telephone.svg';
import LiveHouseIcon from './icon--live-house.svg';
import RoomIcon from './icon--room.svg';
import GuardMaskIcon from './icon--guard-mask.svg';
import SoundSharpenerIcon from './icon--sound-sharpener.svg';
import InterferenceIcon from './icon--interference.svg';
import VintageFilmIcon from './icon--vintage-film.svg';
import HamstersIcon from './icon--hamsters.svg';
import DesertIcon from './icon--desert.svg';
import AlienDistorterIcon from './icon--alien-distorter.svg';
import SkippingIcon from './icon--skipping.svg';
import ViaSpeakerIcon from './icon--via-speaker.svg';
import AircraftBroadcastIcon from './icon--aircraft-broadcast.svg';
import BotildaIcon from './icon--botilda.svg';
import MeowSpeakerIcon from './icon--meow-speaker.svg';
import GlitchyIcon from './icon--glitchy.svg';
import VocodaIcon from './icon--vocoda.svg';
import SchoolPaIcon from './icon--school-pa.svg';
import ToyMicIcon from './icon--toy-mic.svg';
import FullStackIcon from './icon--full-stack.svg';
import FluteConverterIcon from './icon--flute-converter.svg';
import MicMalfunctionIcon from './icon--mic-malfunction.svg';
import ElectroIcon from './icon--electro.svg';
import CheapPhoneIcon from './icon--cheap-phone.svg';
import MufflerIcon from './icon--muffler.svg';
import IndoorVoiceIcon from './icon--indoor-voice.svg';
import DistortedMicIcon from './icon--distorted-mic.svg';
import CatTranslatorIcon from './icon--cat-translator.svg';
import MetallicHellIcon from './icon--metallic-hell.svg';
import BoxedInIcon from './icon--boxed-in.svg';
import ElectroShiftIcon from './icon--electro-shift.svg';
import BathroomIcon from './icon--bathroom.svg';
import VinnieIcon from './icon--vinnie.svg';
import MilitaryRadioIcon from './icon--military-radio.svg';
import LiveStageIcon from './icon--live-stage.svg';
import BawkTalkIcon from './icon--bawk-talk.svg';
import UnderwaterIcon from './icon--underwater.svg';
import ChurchIcon from './icon--church.svg';
import TweetingIcon from './icon--tweeting.svg';
import MetalPipesIcon from './icon--metal-pipes.svg';
import TickingClockIcon from './icon--ticking-clock.svg';
import ClassicFmRadioIcon from './icon--classic-fm-radio.svg';
import PhoneCallIcon from './icon--phone-call.svg';
import TimeMachineIcon from './icon--time-machine.svg';
import AlienDistortionIcon from './icon--alien-distortion.svg';
import SynthIcon from './icon--synth.svg';
import SpaceAnnouncerIcon from './icon--space-announcer.svg';
import OldVhsTapeIcon from './icon--old-vhs-tape.svg';
import ArchibaldIcon from './icon--archibald.svg';
import FanIcon from './icon--fan.svg';
import AccordroidIcon from './icon--accordroid.svg';
import BadSignalIcon from './icon--bad-signal.svg';
import RiderHelmetIcon from './icon--rider-helmet.svg';
import TeenagerIcon from './icon--teenager.svg';
import OldTelephoneIcon from './icon--old-telephone.svg';
import DistortedElectronIcon from './icon--distorted-electron.svg';
import OnThePhoneIcon from './icon--on-the-phone.svg';
import PhantomFaceIcon from './icon--phantom-face.svg';
import EmergencyIcon from './icon--emergency.svg';
import KiddoIcon from './icon--kiddo.svg';
import OldHollywoodIcon from './icon--old-hollywood.svg';

import deleteIcon from '!../../lib/tw-recolor/build!./icon--delete.svg';
import copyIcon from '!../../lib/tw-recolor/build!./icon--copy.svg';
import pasteIcon from '!../../lib/tw-recolor/build!./icon--paste.svg';
import cutIcon from '!../../lib/tw-recolor/build!./icon--cut.svg';
import copyToNewIcon from '!../../lib/tw-recolor/build!./icon--copy-to-new.svg';

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
                    img={SonicDestructorIcon}
                    title={"Sonic Destructor"}
                    onClick={props.onSonicDestructor}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BrokenMicIcon}
                    title={"Broken Mic"}
                    onClick={props.onBrokenMic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DemonizedIcon}
                    title={"Demonized"}
                    onClick={props.onDemonized}
                />
                <IconButton
                    className={styles.effectButton}
                    img={LostSoulIcon}
                    title={"Lost Soul"}
                    onClick={props.onLostSoul}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DivineEchoIcon}
                    title={"Divine Echo"}
                    onClick={props.onDivineEcho}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SplitEchoesIcon}
                    title={"Split Echoes"}
                    onClick={props.onSplitEchoes}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EtherealIcon}
                    title={"Ethereal"}
                    onClick={props.onEthereal}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BandpassReverbIcon}
                    title={"Bandpass Reverb"}
                    onClick={props.onBandpassReverb}
                />
                <IconButton
                    className={styles.effectButton}
                    img={RadiantEchoIcon}
                    title={"Radiant Echo"}
                    onClick={props.onRadiantEcho}
                />
                <IconButton
                    className={styles.effectButton}
                    img={FlashbackIcon}
                    title={"Flashback"}
                    onClick={props.onFlashback}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EchoIcon}
                    title={"Echo"}
                    onClick={props.onEcho}
                />
                <IconButton
                    className={styles.effectButton}
                    img={InfiniteEchoesIcon}
                    title={"Infinite Echoes"}
                    onClick={props.onInfiniteEchoes}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MemoriesIcon}
                    title={"Memories"}
                    onClick={props.onMemories}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EtherealIiIcon}
                    title={"Ethereal II"}
                    onClick={props.onEtherealIi}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EchoPlusIcon}
                    title={"Echo Plus"}
                    onClick={props.onEchoPlus}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SoulJourneyIcon}
                    title={"Soul Journey"}
                    onClick={props.onSoulJourney}
                />
                <IconButton
                    className={styles.effectButton}
                    img={CrispMicIcon}
                    title={"Crisp Mic"}
                    onClick={props.onCrispMic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SoundWidenerIcon}
                    title={"Sound Widener"}
                    onClick={props.onSoundWidener}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PsychedelicIcon}
                    title={"Psychedelic"}
                    onClick={props.onPsychedelic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={OppositeDuoIcon}
                    title={"Opposite Duo"}
                    onClick={props.onOppositeDuo}
                />
                <IconButton
                    className={styles.effectButton}
                    img={WideSpookyEchoIcon}
                    title={"Wide Spooky Echo"}
                    onClick={props.onWideSpookyEcho}
                />
                <IconButton
                    className={styles.effectButton}
                    img={LiveBounceIcon}
                    title={"Live Bounce"}
                    onClick={props.onLiveBounce}
                />
                <IconButton
                    className={styles.effectButton}
                    img={9dSoundscapeIcon}
                    title={"9D Soundscape"}
                    onClick={props.on9dSoundscape}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SuperEchoIcon}
                    title={"Super Echo"}
                    onClick={props.onSuperEcho}
                />
                <IconButton
                    className={styles.effectButton}
                    img={WispyIcon}
                    title={"Wispy"}
                    onClick={props.onWispy}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DoubleTroubleIcon}
                    title={"Double Trouble"}
                    onClick={props.onDoubleTrouble}
                />
                <IconButton
                    className={styles.effectButton}
                    img={AnalogEchoIcon}
                    title={"Analog Echo"}
                    onClick={props.onAnalogEcho}
                />
                <IconButton
                    className={styles.effectButton}
                    img={StadiumAnnouncerIcon}
                    title={"Stadium Announcer"}
                    onClick={props.onStadiumAnnouncer}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EckoIcon}
                    title={"Ecko"}
                    onClick={props.onEcko}
                />
                <IconButton
                    className={styles.effectButton}
                    img={LoudBreathsIcon}
                    title={"Loud Breaths"}
                    onClick={props.onLoudBreaths}
                />
                <IconButton
                    className={styles.effectButton}
                    img={HarmonyIcon}
                    title={"Harmony"}
                    onClick={props.onHarmony}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PanoramicIcon}
                    title={"Panoramic"}
                    onClick={props.onPanoramic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={TalkToTheHandIcon}
                    title={"Talk to the Hand"}
                    onClick={props.onTalkToTheHand}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ConsoleHeadsetIcon}
                    title={"Console Headset"}
                    onClick={props.onConsoleHeadset}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ConcertIcon}
                    title={"Concert"}
                    onClick={props.onConcert}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ReverbIcon}
                    title={"Reverb"}
                    onClick={props.onReverb}
                />
                <IconButton
                    className={styles.effectButton}
                    img={InTheWindIcon}
                    title={"In The Wind"}
                    onClick={props.onInTheWind}
                />
                <IconButton
                    className={styles.effectButton}
                    img={RobotoIcon}
                    title={"Roboto"}
                    onClick={props.onRoboto}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ToyMicrophoneIcon}
                    title={"Toy Microphone"}
                    onClick={props.onToyMicrophone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={CubicleEchoIcon}
                    title={"Cubicle Echo"}
                    onClick={props.onCubicleEcho}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PipaIcon}
                    title={"Pipa"}
                    onClick={props.onPipa}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ChorusIcon}
                    title={"Chorus"}
                    onClick={props.onChorus}
                />
                <IconButton
                    className={styles.effectButton}
                    img={InWombIcon}
                    title={"In Womb"}
                    onClick={props.onInWomb}
                />
                <IconButton
                    className={styles.effectButton}
                    img={TheVoiceIcon}
                    title={"The Voice"}
                    onClick={props.onTheVoice}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PhoneConvoIcon}
                    title={"Phone Convo"}
                    onClick={props.onPhoneConvo}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PracticeRoomIcon}
                    title={"Practice Room"}
                    onClick={props.onPracticeRoom}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MeditationIcon}
                    title={"Meditation"}
                    onClick={props.onMeditation}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DivinaIcon}
                    title={"Divina"}
                    onClick={props.onDivina}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BoomingIcon}
                    title={"Booming"}
                    onClick={props.onBooming}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EmptyStudioIcon}
                    title={"Empty Studio"}
                    onClick={props.onEmptyStudio}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SurroundBlastIcon}
                    title={"Surround Blast"}
                    onClick={props.onSurroundBlast}
                />
                <IconButton
                    className={styles.effectButton}
                    img={RetroVibeIcon}
                    title={"Retro Vibe"}
                    onClick={props.onRetroVibe}
                />
                <IconButton
                    className={styles.effectButton}
                    img={GuitarDelayIcon}
                    title={"Guitar Delay"}
                    onClick={props.onGuitarDelay}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EchoeyIcon}
                    title={"Echoey"}
                    onClick={props.onEchoey}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MagneticIcon}
                    title={"Magnetic"}
                    onClick={props.onMagnetic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={VintagePhoneIcon}
                    title={"Vintage Phone"}
                    onClick={props.onVintagePhone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MutedBeatIcon}
                    title={"Muted Beat"}
                    onClick={props.onMutedBeat}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ConcertHallIcon}
                    title={"Concert Hall"}
                    onClick={props.onConcertHall}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DripVocalsIcon}
                    title={"Drip Vocals"}
                    onClick={props.onDripVocals}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DriftIcon}
                    title={"Drift"}
                    onClick={props.onDrift}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DrownedOutIcon}
                    title={"Drowned Out"}
                    onClick={props.onDrownedOut}
                />
                <IconButton
                    className={styles.effectButton}
                    img={HuskyBackupIcon}
                    title={"Husky Backup"}
                    onClick={props.onHuskyBackup}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PayphoneIcon}
                    title={"Payphone"}
                    onClick={props.onPayphone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DeafnessIcon}
                    title={"Deafness"}
                    onClick={props.onDeafness}
                />
                <IconButton
                    className={styles.effectButton}
                    img={InTheRainIcon}
                    title={"In The Rain"}
                    onClick={props.onInTheRain}
                />
                <IconButton
                    className={styles.effectButton}
                    img={StreetAnthemIcon}
                    title={"Street Anthem"}
                    onClick={props.onStreetAnthem}
                />
                <IconButton
                    className={styles.effectButton}
                    img={OfficeIcon}
                    title={"Office"}
                    onClick={props.onOffice}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BackpackRadioIcon}
                    title={"Backpack Radio"}
                    onClick={props.onBackpackRadio}
                />
                <IconButton
                    className={styles.effectButton}
                    img={HellIcon}
                    title={"Hell"}
                    onClick={props.onHell}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EchoIiIcon}
                    title={"Echo II"}
                    onClick={props.onEchoIi}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DoomsdayPaIcon}
                    title={"Doomsday PA"}
                    onClick={props.onDoomsdayPa}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ParkingLotIcon}
                    title={"Parking Lot"}
                    onClick={props.onParkingLot}
                />
                <IconButton
                    className={styles.effectButton}
                    img={OuterDimensionIcon}
                    title={"Outer Dimension"}
                    onClick={props.onOuterDimension}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DistortionIcon}
                    title={"Distortion"}
                    onClick={props.onDistortion}
                />
                <IconButton
                    className={styles.effectButton}
                    img={CaveIcon}
                    title={"Cave"}
                    onClick={props.onCave}
                />
                <IconButton
                    className={styles.effectButton}
                    img={RapAttitudeIcon}
                    title={"Rap Attitude"}
                    onClick={props.onRapAttitude}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ClapsIcon}
                    title={"Claps"}
                    onClick={props.onClaps}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PaAnnouncerIcon}
                    title={"PA Announcer"}
                    onClick={props.onPaAnnouncer}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MusicHallIcon}
                    title={"Music Hall"}
                    onClick={props.onMusicHall}
                />
                <IconButton
                    className={styles.effectButton}
                    img={TubeTvIcon}
                    title={"Tube TV"}
                    onClick={props.onTubeTv}
                />
                <IconButton
                    className={styles.effectButton}
                    img={LoudspeakerIcon}
                    title={"Loudspeaker"}
                    onClick={props.onLoudspeaker}
                />
                <IconButton
                    className={styles.effectButton}
                    img={8BitIcon}
                    title={"8-bit"}
                    onClick={props.on8Bit}
                />
                <IconButton
                    className={styles.effectButton}
                    img={GrumpyOrcIcon}
                    title={"Grumpy Orc"}
                    onClick={props.onGrumpyOrc}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PhantomEchoIcon}
                    title={"Phantom Echo"}
                    onClick={props.onPhantomEcho}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MusicEnhancerIcon}
                    title={"Music Enhancer"}
                    onClick={props.onMusicEnhancer}
                />
                <IconButton
                    className={styles.effectButton}
                    img={HeartbeatsIcon}
                    title={"Heartbeats"}
                    onClick={props.onHeartbeats}
                />
                <IconButton
                    className={styles.effectButton}
                    img={CassetteTapeIcon}
                    title={"Cassette Tape"}
                    onClick={props.onCassetteTape}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BadHarmonyIcon}
                    title={"Bad Harmony"}
                    onClick={props.onBadHarmony}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BigHouseIcon}
                    title={"Big House"}
                    onClick={props.onBigHouse}
                />
                <IconButton
                    className={styles.effectButton}
                    img={NightClubIcon}
                    title={"Night Club"}
                    onClick={props.onNightClub}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ElectronicBeatsIcon}
                    title={"Electronic Beats"}
                    onClick={props.onElectronicBeats}
                />
                <IconButton
                    className={styles.effectButton}
                    img={AlienRadioIcon}
                    title={"Alien Radio"}
                    onClick={props.onAlienRadio}
                />
                <IconButton
                    className={styles.effectButton}
                    img={LiveBroadcastIcon}
                    title={"Live broadcast"}
                    onClick={props.onLiveBroadcast}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PsyelectroIcon}
                    title={"PsyElectro"}
                    onClick={props.onPsyelectro}
                />
                <IconButton
                    className={styles.effectButton}
                    img={AirLightIcon}
                    title={"Air Light"}
                    onClick={props.onAirLight}
                />
                <IconButton
                    className={styles.effectButton}
                    img={VinylIcon}
                    title={"Vinyl"}
                    onClick={props.onVinyl}
                />
                <IconButton
                    className={styles.effectButton}
                    img={WaveIcon}
                    title={"Wave"}
                    onClick={props.onWave}
                />
                <IconButton
                    className={styles.effectButton}
                    img={OutOfSignalIcon}
                    title={"Out of Signal"}
                    onClick={props.onOutOfSignal}
                />
                <IconButton
                    className={styles.effectButton}
                    img={AutotuneIcon}
                    title={"Autotune"}
                    onClick={props.onAutotune}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BirthdayPartyIcon}
                    title={"Birthday Party"}
                    onClick={props.onBirthdayParty}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DroneSpeakerIcon}
                    title={"Drone Speaker"}
                    onClick={props.onDroneSpeaker}
                />
                <IconButton
                    className={styles.effectButton}
                    img={GravellyAlienIcon}
                    title={"Gravelly Alien"}
                    onClick={props.onGravellyAlien}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DjWarpIcon}
                    title={"DJ Warp"}
                    onClick={props.onDjWarp}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BahhIcon}
                    title={"Bahh"}
                    onClick={props.onBahh}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EvilSpiritIcon}
                    title={"Evil Spirit"}
                    onClick={props.onEvilSpirit}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BadMicIcon}
                    title={"Bad Mic"}
                    onClick={props.onBadMic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ValleyIcon}
                    title={"Valley"}
                    onClick={props.onValley}
                />
                <IconButton
                    className={styles.effectButton}
                    img={IceCaveIcon}
                    title={"Ice Cave"}
                    onClick={props.onIceCave}
                />
                <IconButton
                    className={styles.effectButton}
                    img={Broadway1Icon}
                    title={"Broadway 1"}
                    onClick={props.onBroadway1}
                />
                <IconButton
                    className={styles.effectButton}
                    img={GhostStoryIcon}
                    title={"Ghost Story"}
                    onClick={props.onGhostStory}
                />
                <IconButton
                    className={styles.effectButton}
                    img={OldPhoneIcon}
                    title={"Old Phone"}
                    onClick={props.onOldPhone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EnergeticIcon}
                    title={"Energetic"}
                    onClick={props.onEnergetic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={LosingSanityIcon}
                    title={"Losing Sanity"}
                    onClick={props.onLosingSanity}
                />
                <IconButton
                    className={styles.effectButton}
                    img={Broadway2Icon}
                    title={"Broadway 2"}
                    onClick={props.onBroadway2}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BWTvIcon}
                    title={"B&W TV"}
                    onClick={props.onBWTv}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SuperBassIcon}
                    title={"Super Bass"}
                    onClick={props.onSuperBass}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SpaceIntercomIcon}
                    title={"Space Intercom"}
                    onClick={props.onSpaceIntercom}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ElectronicIcon}
                    title={"Electronic"}
                    onClick={props.onElectronic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={3dSurroundSoundIcon}
                    title={"3D Surround Sound"}
                    onClick={props.on3dSurroundSound}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ClassroomIcon}
                    title={"Classroom"}
                    onClick={props.onClassroom}
                />
                <IconButton
                    className={styles.effectButton}
                    img={CommutingIcon}
                    title={"Commuting"}
                    onClick={props.onCommuting}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SuperReverbIcon}
                    title={"Super Reverb"}
                    onClick={props.onSuperReverb}
                />
                <IconButton
                    className={styles.effectButton}
                    img={TrembleIcon}
                    title={"Tremble"}
                    onClick={props.onTremble}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BleepCensorIcon}
                    title={"Bleep Censor"}
                    onClick={props.onBleepCensor}
                />
                <IconButton
                    className={styles.effectButton}
                    img={IntercomIcon}
                    title={"Intercom"}
                    onClick={props.onIntercom}
                />
                <IconButton
                    className={styles.effectButton}
                    img={TelephoneIcon}
                    title={"Telephone"}
                    onClick={props.onTelephone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={LiveHouseIcon}
                    title={"Live House"}
                    onClick={props.onLiveHouse}
                />
                <IconButton
                    className={styles.effectButton}
                    img={RoomIcon}
                    title={"Room"}
                    onClick={props.onRoom}
                />
                <IconButton
                    className={styles.effectButton}
                    img={GuardMaskIcon}
                    title={"Guard Mask"}
                    onClick={props.onGuardMask}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SoundSharpenerIcon}
                    title={"Sound Sharpener"}
                    onClick={props.onSoundSharpener}
                />
                <IconButton
                    className={styles.effectButton}
                    img={InterferenceIcon}
                    title={"Interference"}
                    onClick={props.onInterference}
                />
                <IconButton
                    className={styles.effectButton}
                    img={VintageFilmIcon}
                    title={"Vintage Film"}
                    onClick={props.onVintageFilm}
                />
                <IconButton
                    className={styles.effectButton}
                    img={HamstersIcon}
                    title={"Hamsters"}
                    onClick={props.onHamsters}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DesertIcon}
                    title={"Desert"}
                    onClick={props.onDesert}
                />
                <IconButton
                    className={styles.effectButton}
                    img={AlienDistorterIcon}
                    title={"Alien Distorter"}
                    onClick={props.onAlienDistorter}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SkippingIcon}
                    title={"Skipping"}
                    onClick={props.onSkipping}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ViaSpeakerIcon}
                    title={"Via Speaker"}
                    onClick={props.onViaSpeaker}
                />
                <IconButton
                    className={styles.effectButton}
                    img={AircraftBroadcastIcon}
                    title={"Aircraft broadcast"}
                    onClick={props.onAircraftBroadcast}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BotildaIcon}
                    title={"Botilda"}
                    onClick={props.onBotilda}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MeowSpeakerIcon}
                    title={"Meow Speaker"}
                    onClick={props.onMeowSpeaker}
                />
                <IconButton
                    className={styles.effectButton}
                    img={GlitchyIcon}
                    title={"Glitchy"}
                    onClick={props.onGlitchy}
                />
                <IconButton
                    className={styles.effectButton}
                    img={VocodaIcon}
                    title={"Vocoda"}
                    onClick={props.onVocoda}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SchoolPaIcon}
                    title={"School PA"}
                    onClick={props.onSchoolPa}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ToyMicIcon}
                    title={"Toy Mic"}
                    onClick={props.onToyMic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={FullStackIcon}
                    title={"Full Stack"}
                    onClick={props.onFullStack}
                />
                <IconButton
                    className={styles.effectButton}
                    img={FluteConverterIcon}
                    title={"Flute Converter"}
                    onClick={props.onFluteConverter}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MicMalfunctionIcon}
                    title={"Mic Malfunction"}
                    onClick={props.onMicMalfunction}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ElectroIcon}
                    title={"Electro"}
                    onClick={props.onElectro}
                />
                <IconButton
                    className={styles.effectButton}
                    img={CheapPhoneIcon}
                    title={"Cheap Phone"}
                    onClick={props.onCheapPhone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MufflerIcon}
                    title={"Muffler"}
                    onClick={props.onMuffler}
                />
                <IconButton
                    className={styles.effectButton}
                    img={IndoorVoiceIcon}
                    title={"Indoor Voice"}
                    onClick={props.onIndoorVoice}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DistortedMicIcon}
                    title={"Distorted Mic"}
                    onClick={props.onDistortedMic}
                />
                <IconButton
                    className={styles.effectButton}
                    img={CatTranslatorIcon}
                    title={"Cat Translator"}
                    onClick={props.onCatTranslator}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MetallicHellIcon}
                    title={"Metallic Hell"}
                    onClick={props.onMetallicHell}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BoxedInIcon}
                    title={"Boxed in"}
                    onClick={props.onBoxedIn}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ElectroShiftIcon}
                    title={"Electro Shift"}
                    onClick={props.onElectroShift}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BathroomIcon}
                    title={"Bathroom"}
                    onClick={props.onBathroom}
                />
                <IconButton
                    className={styles.effectButton}
                    img={VinnieIcon}
                    title={"Vinnie"}
                    onClick={props.onVinnie}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MilitaryRadioIcon}
                    title={"Military Radio"}
                    onClick={props.onMilitaryRadio}
                />
                <IconButton
                    className={styles.effectButton}
                    img={LiveStageIcon}
                    title={"Live Stage"}
                    onClick={props.onLiveStage}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BawkTalkIcon}
                    title={"Bawk Talk"}
                    onClick={props.onBawkTalk}
                />
                <IconButton
                    className={styles.effectButton}
                    img={UnderwaterIcon}
                    title={"Underwater"}
                    onClick={props.onUnderwater}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ChurchIcon}
                    title={"Church"}
                    onClick={props.onChurch}
                />
                <IconButton
                    className={styles.effectButton}
                    img={TweetingIcon}
                    title={"Tweeting"}
                    onClick={props.onTweeting}
                />
                <IconButton
                    className={styles.effectButton}
                    img={MetalPipesIcon}
                    title={"Metal Pipes"}
                    onClick={props.onMetalPipes}
                />
                <IconButton
                    className={styles.effectButton}
                    img={TickingClockIcon}
                    title={"Ticking Clock"}
                    onClick={props.onTickingClock}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ClassicFmRadioIcon}
                    title={"Classic FM Radio"}
                    onClick={props.onClassicFmRadio}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PhoneCallIcon}
                    title={"Phone Call"}
                    onClick={props.onPhoneCall}
                />
                <IconButton
                    className={styles.effectButton}
                    img={TimeMachineIcon}
                    title={"Time Machine"}
                    onClick={props.onTimeMachine}
                />
                <IconButton
                    className={styles.effectButton}
                    img={AlienDistortionIcon}
                    title={"Alien Distortion"}
                    onClick={props.onAlienDistortion}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SynthIcon}
                    title={"Synth"}
                    onClick={props.onSynth}
                />
                <IconButton
                    className={styles.effectButton}
                    img={SpaceAnnouncerIcon}
                    title={"Space Announcer"}
                    onClick={props.onSpaceAnnouncer}
                />
                <IconButton
                    className={styles.effectButton}
                    img={OldVhsTapeIcon}
                    title={"OLD VHS Tape"}
                    onClick={props.onOldVhsTape}
                />
                <IconButton
                    className={styles.effectButton}
                    img={ArchibaldIcon}
                    title={"Archibald"}
                    onClick={props.onArchibald}
                />
                <IconButton
                    className={styles.effectButton}
                    img={FanIcon}
                    title={"Fan"}
                    onClick={props.onFan}
                />
                <IconButton
                    className={styles.effectButton}
                    img={AccordroidIcon}
                    title={"Accordroid"}
                    onClick={props.onAccordroid}
                />
                <IconButton
                    className={styles.effectButton}
                    img={BadSignalIcon}
                    title={"Bad Signal"}
                    onClick={props.onBadSignal}
                />
                <IconButton
                    className={styles.effectButton}
                    img={RiderHelmetIcon}
                    title={"Rider Helmet"}
                    onClick={props.onRiderHelmet}
                />
                <IconButton
                    className={styles.effectButton}
                    img={TeenagerIcon}
                    title={"Teenager"}
                    onClick={props.onTeenager}
                />
                <IconButton
                    className={styles.effectButton}
                    img={OldTelephoneIcon}
                    title={"Old Telephone"}
                    onClick={props.onOldTelephone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={DistortedElectronIcon}
                    title={"Distorted Electron"}
                    onClick={props.onDistortedElectron}
                />
                <IconButton
                    className={styles.effectButton}
                    img={OnThePhoneIcon}
                    title={"On The Phone"}
                    onClick={props.onOnThePhone}
                />
                <IconButton
                    className={styles.effectButton}
                    img={PhantomFaceIcon}
                    title={"Phantom Face"}
                    onClick={props.onPhantomFace}
                />
                <IconButton
                    className={styles.effectButton}
                    img={EmergencyIcon}
                    title={"Emergency"}
                    onClick={props.onEmergency}
                />
                <IconButton
                    className={styles.effectButton}
                    img={KiddoIcon}
                    title={"Kiddo"}
                    onClick={props.onKiddo}
                />
                <IconButton
                    className={styles.effectButton}
                    img={OldHollywoodIcon}
                    title={"Old Hollywood"}
                    onClick={props.onOldHollywood}
                />
            </div>
        </div>
        <div className={styles.infoRow}>
            <div className={styles.duration}>
                {formatDuration(props.playhead, props.trimStart, props.trimEnd, props.duration)}
            </div>
            <div className={styles.advancedInfo}>
                {props.sampleRate}
                {"Hz "}
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
    onFadeIn: PropTypes.func.isRequired,
    onFadeOut: PropTypes.func.isRequired,
    onFaster: PropTypes.func.isRequired,
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
    onSonicDestructor: PropTypes.func.isRequired,
    onBrokenMic: PropTypes.func.isRequired,
    onDemonized: PropTypes.func.isRequired,
    onLostSoul: PropTypes.func.isRequired,
    onDivineEcho: PropTypes.func.isRequired,
    onSplitEchoes: PropTypes.func.isRequired,
    onEthereal: PropTypes.func.isRequired,
    onBandpassReverb: PropTypes.func.isRequired,
    onRadiantEcho: PropTypes.func.isRequired,
    onFlashback: PropTypes.func.isRequired,
    onEcho: PropTypes.func.isRequired,
    onInfiniteEchoes: PropTypes.func.isRequired,
    onMemories: PropTypes.func.isRequired,
    onEtherealIi: PropTypes.func.isRequired,
    onEchoPlus: PropTypes.func.isRequired,
    onSoulJourney: PropTypes.func.isRequired,
    onCrispMic: PropTypes.func.isRequired,
    onSoundWidener: PropTypes.func.isRequired,
    onPsychedelic: PropTypes.func.isRequired,
    onOppositeDuo: PropTypes.func.isRequired,
    onWideSpookyEcho: PropTypes.func.isRequired,
    onLiveBounce: PropTypes.func.isRequired,
    on9dSoundscape: PropTypes.func.isRequired,
    onSuperEcho: PropTypes.func.isRequired,
    onWispy: PropTypes.func.isRequired,
    onDoubleTrouble: PropTypes.func.isRequired,
    onAnalogEcho: PropTypes.func.isRequired,
    onStadiumAnnouncer: PropTypes.func.isRequired,
    onEcko: PropTypes.func.isRequired,
    onLoudBreaths: PropTypes.func.isRequired,
    onHarmony: PropTypes.func.isRequired,
    onPanoramic: PropTypes.func.isRequired,
    onTalkToTheHand: PropTypes.func.isRequired,
    onConsoleHeadset: PropTypes.func.isRequired,
    onConcert: PropTypes.func.isRequired,
    onReverb: PropTypes.func.isRequired,
    onInTheWind: PropTypes.func.isRequired,
    onRoboto: PropTypes.func.isRequired,
    onToyMicrophone: PropTypes.func.isRequired,
    onCubicleEcho: PropTypes.func.isRequired,
    onPipa: PropTypes.func.isRequired,
    onChorus: PropTypes.func.isRequired,
    onInWomb: PropTypes.func.isRequired,
    onTheVoice: PropTypes.func.isRequired,
    onPhoneConvo: PropTypes.func.isRequired,
    onPracticeRoom: PropTypes.func.isRequired,
    onMeditation: PropTypes.func.isRequired,
    onDivina: PropTypes.func.isRequired,
    onBooming: PropTypes.func.isRequired,
    onEmptyStudio: PropTypes.func.isRequired,
    onSurroundBlast: PropTypes.func.isRequired,
    onRetroVibe: PropTypes.func.isRequired,
    onGuitarDelay: PropTypes.func.isRequired,
    onEchoey: PropTypes.func.isRequired,
    onMagnetic: PropTypes.func.isRequired,
    onVintagePhone: PropTypes.func.isRequired,
    onMutedBeat: PropTypes.func.isRequired,
    onConcertHall: PropTypes.func.isRequired,
    onDripVocals: PropTypes.func.isRequired,
    onDrift: PropTypes.func.isRequired,
    onDrownedOut: PropTypes.func.isRequired,
    onHuskyBackup: PropTypes.func.isRequired,
    onPayphone: PropTypes.func.isRequired,
    onDeafness: PropTypes.func.isRequired,
    onInTheRain: PropTypes.func.isRequired,
    onStreetAnthem: PropTypes.func.isRequired,
    onOffice: PropTypes.func.isRequired,
    onBackpackRadio: PropTypes.func.isRequired,
    onHell: PropTypes.func.isRequired,
    onEchoIi: PropTypes.func.isRequired,
    onDoomsdayPa: PropTypes.func.isRequired,
    onParkingLot: PropTypes.func.isRequired,
    onOuterDimension: PropTypes.func.isRequired,
    onDistortion: PropTypes.func.isRequired,
    onCave: PropTypes.func.isRequired,
    onRapAttitude: PropTypes.func.isRequired,
    onClaps: PropTypes.func.isRequired,
    onPaAnnouncer: PropTypes.func.isRequired,
    onMusicHall: PropTypes.func.isRequired,
    onTubeTv: PropTypes.func.isRequired,
    onLoudspeaker: PropTypes.func.isRequired,
    on8Bit: PropTypes.func.isRequired,
    onGrumpyOrc: PropTypes.func.isRequired,
    onPhantomEcho: PropTypes.func.isRequired,
    onMusicEnhancer: PropTypes.func.isRequired,
    onHeartbeats: PropTypes.func.isRequired,
    onCassetteTape: PropTypes.func.isRequired,
    onBadHarmony: PropTypes.func.isRequired,
    onBigHouse: PropTypes.func.isRequired,
    onNightClub: PropTypes.func.isRequired,
    onElectronicBeats: PropTypes.func.isRequired,
    onAlienRadio: PropTypes.func.isRequired,
    onLiveBroadcast: PropTypes.func.isRequired,
    onPsyelectro: PropTypes.func.isRequired,
    onAirLight: PropTypes.func.isRequired,
    onVinyl: PropTypes.func.isRequired,
    onWave: PropTypes.func.isRequired,
    onOutOfSignal: PropTypes.func.isRequired,
    onAutotune: PropTypes.func.isRequired,
    onBirthdayParty: PropTypes.func.isRequired,
    onDroneSpeaker: PropTypes.func.isRequired,
    onGravellyAlien: PropTypes.func.isRequired,
    onDjWarp: PropTypes.func.isRequired,
    onBahh: PropTypes.func.isRequired,
    onEvilSpirit: PropTypes.func.isRequired,
    onBadMic: PropTypes.func.isRequired,
    onValley: PropTypes.func.isRequired,
    onIceCave: PropTypes.func.isRequired,
    onBroadway1: PropTypes.func.isRequired,
    onGhostStory: PropTypes.func.isRequired,
    onOldPhone: PropTypes.func.isRequired,
    onEnergetic: PropTypes.func.isRequired,
    onLosingSanity: PropTypes.func.isRequired,
    onBroadway2: PropTypes.func.isRequired,
    onBWTv: PropTypes.func.isRequired,
    onSuperBass: PropTypes.func.isRequired,
    onSpaceIntercom: PropTypes.func.isRequired,
    onElectronic: PropTypes.func.isRequired,
    on3dSurroundSound: PropTypes.func.isRequired,
    onClassroom: PropTypes.func.isRequired,
    onCommuting: PropTypes.func.isRequired,
    onSuperReverb: PropTypes.func.isRequired,
    onTremble: PropTypes.func.isRequired,
    onBleepCensor: PropTypes.func.isRequired,
    onIntercom: PropTypes.func.isRequired,
    onTelephone: PropTypes.func.isRequired,
    onLiveHouse: PropTypes.func.isRequired,
    onRoom: PropTypes.func.isRequired,
    onGuardMask: PropTypes.func.isRequired,
    onSoundSharpener: PropTypes.func.isRequired,
    onInterference: PropTypes.func.isRequired,
    onVintageFilm: PropTypes.func.isRequired,
    onHamsters: PropTypes.func.isRequired,
    onDesert: PropTypes.func.isRequired,
    onAlienDistorter: PropTypes.func.isRequired,
    onSkipping: PropTypes.func.isRequired,
    onViaSpeaker: PropTypes.func.isRequired,
    onAircraftBroadcast: PropTypes.func.isRequired,
    onBotilda: PropTypes.func.isRequired,
    onMeowSpeaker: PropTypes.func.isRequired,
    onGlitchy: PropTypes.func.isRequired,
    onVocoda: PropTypes.func.isRequired,
    onSchoolPa: PropTypes.func.isRequired,
    onToyMic: PropTypes.func.isRequired,
    onFullStack: PropTypes.func.isRequired,
    onFluteConverter: PropTypes.func.isRequired,
    onMicMalfunction: PropTypes.func.isRequired,
    onElectro: PropTypes.func.isRequired,
    onCheapPhone: PropTypes.func.isRequired,
    onMuffler: PropTypes.func.isRequired,
    onIndoorVoice: PropTypes.func.isRequired,
    onDistortedMic: PropTypes.func.isRequired,
    onCatTranslator: PropTypes.func.isRequired,
    onMetallicHell: PropTypes.func.isRequired,
    onBoxedIn: PropTypes.func.isRequired,
    onElectroShift: PropTypes.func.isRequired,
    onBathroom: PropTypes.func.isRequired,
    onVinnie: PropTypes.func.isRequired,
    onMilitaryRadio: PropTypes.func.isRequired,
    onLiveStage: PropTypes.func.isRequired,
    onBawkTalk: PropTypes.func.isRequired,
    onUnderwater: PropTypes.func.isRequired,
    onChurch: PropTypes.func.isRequired,
    onTweeting: PropTypes.func.isRequired,
    onMetalPipes: PropTypes.func.isRequired,
    onTickingClock: PropTypes.func.isRequired,
    onClassicFmRadio: PropTypes.func.isRequired,
    onPhoneCall: PropTypes.func.isRequired,
    onTimeMachine: PropTypes.func.isRequired,
    onAlienDistortion: PropTypes.func.isRequired,
    onSynth: PropTypes.func.isRequired,
    onSpaceAnnouncer: PropTypes.func.isRequired,
    onOldVhsTape: PropTypes.func.isRequired,
    onArchibald: PropTypes.func.isRequired,
    onFan: PropTypes.func.isRequired,
    onAccordroid: PropTypes.func.isRequired,
    onBadSignal: PropTypes.func.isRequired,
    onRiderHelmet: PropTypes.func.isRequired,
    onTeenager: PropTypes.func.isRequired,
    onOldTelephone: PropTypes.func.isRequired,
    onDistortedElectron: PropTypes.func.isRequired,
    onOnThePhone: PropTypes.func.isRequired,
    onPhantomFace: PropTypes.func.isRequired,
    onEmergency: PropTypes.func.isRequired,
    onKiddo: PropTypes.func.isRequired,
    onOldHollywood: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    playhead: PropTypes.number,
    setRef: PropTypes.func,
    tooLoud: PropTypes.bool.isRequired,
    trimEnd: PropTypes.number,
    trimStart: PropTypes.number
};

export default injectIntl(SoundEditor);
