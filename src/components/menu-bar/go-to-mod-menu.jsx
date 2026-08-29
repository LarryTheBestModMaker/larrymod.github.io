import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {MenuItem, Submenu} from '../menu/menu.jsx';

import {
    goToModMenuOpen,
    openGoToModMenu
} from '../../reducers/menus.js';

import styles from './settings-menu.css';
import dropdownCaret from './dropdown-caret.svg';

import gaiaModIcon from './icon--gaia-mod.svg';
import omniBlocksIcon from './icon--omniblocks.svg';
import ampModIcon from './icon--amp-mod.svg';
import libreKittenIcon from './icon--librekitten.svg';
import dashIcon from './icon--dash.svg';
import cocreaWorldIcon from './icon--cocrea-world.svg';
import turboWarpIcon from './icon--turbowarp.svg';
import bilupIcon from './icon--bilup.svg';
import scratchBoxIcon from './icon--scratchbox.svg';
import oTwoEngineIcon from './icon--02-engine.svg';
import dinosaurModIcon from './icon--dinosaur-mod.svg';
import mistWarpIcon from './icon--mistwarp.svg';
import astraEditorIcon from './icon--astra-editor.svg';
import adacraftIcon from './icon--adacraft.svg';
import nitroBoltIcon from './icon--nitro-bolt.svg';
import scratchIcon from './icon--scratch.svg';
import arkIDEIcon from './icon--ark-ide.svg';
import electraModIcon from './icon--electramod.svg';
import penguinModIcon from './icon--penguinmod.svg';
import snailIDEIcon from './icon--snail-ide.svg';

const mods = [
    {name: 'GaiaMod', url: 'https://gaiamod-main.github.io/', icon: gaiaModIcon, id: 'gaia-mod'},
    {name: 'OmniBlocks', url: 'https://omniblocks.github.io/', icon: omniBlocksIcon, id: 'omniblocks'},
    {name: 'AmpMod', url: 'https://ampmod.codeberg.page/', icon: ampModIcon, id: 'amp-mod'},
    {name: 'LibreKitten', url: 'https://librekitten.org/', icon: libreKittenIcon, id: 'librekitten'},
    {name: 'Dash', url: 'https://dashblocks.org/', icon: dashIcon, id: 'dash'},
    {name: 'Cocrea World', url: 'https://www.cocrea.world/', icon: cocreaWorldIcon, id: 'cocrea-world'},
    {name: 'TurboWarp', url: 'https://turbowarp.org/', icon: turboWarpIcon, id: 'turbowarp'},
    {name: 'Bilup', url: 'https://editor.bilup.org/', icon: bilupIcon, id: 'bilup'},
    {name: 'ScratchBox', url: 'https://editor.scratchbox.dev/', icon: scratchBoxIcon, id: 'scratchbox'},
    {name: '02 Engine', url: 'https://editor.02engine.org/index.html', icon: oTwoEngineIcon, id: '02-engine'},
    {name: 'DinosaurMod', url: 'https://dinosaurmod.github.io/', icon: dinosaurModIcon, id: 'dinosaur-mod'},
    {name: 'MistWarp', url: 'https://warp.mistium.com/', icon: mistWarpIcon, id: 'mistwarp'},
    {name: 'AstraEditor', url: 'https://editors.astras.top/', icon: astraEditorIcon, id: 'astra-editor'},
    {name: 'Adacraft', url: 'https://www.adacraft.org/studio/', icon: adacraftIcon, id: 'adacraft'},
    {name: 'Nitro-Bolt', url: 'https://nitrobolt.org/', icon: nitroBoltIcon, id: 'nitro-bolt'},
    {name: 'Scratch', url: 'https://scratch.mit.edu/', icon: scratchIcon, id: 'scratch'},
    {name: 'Ark IDE', url: 'https://studio.arkide.site/', icon: arkIDEIcon, id: 'ark-ide'},
    {name: 'ElectraMod', url: 'https://electramod.vercel.app/', icon: electraModIcon, id: 'electramod'},
    {name: 'PenguinMod', url: 'https://studio.penguinmod.com/', icon: penguinModIcon, id: 'penguinmod'},
    {name: 'Snail IDE', url: 'http://snail-ide.js.org/', icon: snailIDEIcon, id: 'snail-ide'}
];

class GoToModMenu extends React.PureComponent {
    openInNewTab (mod) {
        window.open(mod.url, '_blank', 'noopener,noreferrer');
        this.props.onRequestCloseSettings();
    }

    openInNewWindow (mod) {
        window.open(
            mod.url,
            `larrymod-${mod.id}`,
            'popup=yes,width=1280,height=800,resizable=yes,scrollbars=yes'
        );
        this.props.onRequestCloseSettings();
    }

    render () {
        return (
            <MenuItem
                expanded={this.props.menuOpen}
            >
                <div
                    className={styles.option}
                    onClick={this.props.onRequestOpen}
                >
                    <span className={styles.submenuLabel}>
                        Go to Mod
                    </span>
                    <img
                        className={styles.expandCaret}
                        src={dropdownCaret}
                        draggable={false}
                    />
                </div>
                <Submenu
                    place={this.props.isRtl ? 'left' : 'right'}
                >
                    {mods.map(mod => (
                        <MenuItem
                            key={mod.id}
                        >
                            <div className={styles.option}>
                                <img
                                    className={styles.icon}
                                    src={mod.icon}
                                    draggable={false}
                                />
                                <span className={styles.submenuLabel}>
                                    {mod.name}
                                </span>
                                <img
                                    className={styles.expandCaret}
                                    src={dropdownCaret}
                                    draggable={false}
                                />
                            </div>
                            <Submenu
                                place={this.props.isRtl ? 'left' : 'right'}
                            >
                                <MenuItem
                                    onClick={() => this.openInNewTab(mod)}
                                >
                                    Open in new tab
                                </MenuItem>
                                <MenuItem
                                    onClick={() => this.openInNewWindow(mod)}
                                >
                                    Open in new window
                                </MenuItem>
                            </Submenu>
                        </MenuItem>
                    ))}
                </Submenu>
            </MenuItem>
        );
    }
}

GoToModMenu.propTypes = {
    isRtl: PropTypes.bool,
    menuOpen: PropTypes.bool,
    onRequestCloseSettings: PropTypes.func.isRequired,
    onRequestOpen: PropTypes.func
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl,
    menuOpen: goToModMenuOpen(state)
});

const mapDispatchToProps = dispatch => ({
    onRequestOpen: () => dispatch(openGoToModMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GoToModMenu);
