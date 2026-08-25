import { defineMessages } from 'react-intl';
import sharedMessages from '../shared-messages';

let messages = defineMessages({
    /*variable: {
        defaultMessage: 'my variable',
        description: 'Name for the default variable',
        id: 'gui.defaultProject.variable'
    }*/
});

messages = { ...messages, ...sharedMessages };

// use the default message if a translation function is not passed
const defaultTranslator = msgObj => msgObj.defaultMessage;

/**
 * Generate a localized version of the default project
 * @param {function} translateFunction a function to use for translating the default names
 * @return {object} the project data json for the default project
 */
const projectData = translateFunction => {
    const translator = translateFunction || defaultTranslator;
    return ({
        targets: [
            {
                isStage: true,
                name: 'Stage',
                variables: {/*
                    '`jEk@4|i[#Fk?(8x)AV.-my variable': [
                        translator(messages.variable),
                        0
                    ]
                */},
                lists: {},
                broadcasts: {},
                blocks: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: 'cd21514d0531fdffb22204e0ec5ed84a',
                        name: translator(messages.backdrop, { index: 1 }),
                        md5ext: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 240,
                        rotationCenterY: 180
                    }
                ],
                sounds: [],
                assets: [],
                volume: 101
            },
            {
                isStage: false,
                name: translator(messages.sprite, { index: 1 }),
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {},
                comments: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: '592bae6f8bb9c8d88401b54ac431f7b6',
                        name: translator(messages.costume, { index: 1 }),
                        bitmapResolution: 1,
                        md5ext: '592bae6f8bb9c8d88401b54ac431f7b6.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 59,
                        rotationCenterY: 72
                    },
                    {
                        assetId: '61826d1f7ebade6b17e879198b460b23',
                        name: translator(messages.costume, { index: 2 }),
                        bitmapResolution: 1,
                        md5ext: '61826d1f7ebade6b17e879198b460b23.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 53,
                        rotationCenterY: 73
                    },
                    {
                        assetId: 'a2acb3d0f1d4f14132b43c31821f1c5d',
                        name: translator(messages.costume, { index: 3 }),
                        bitmapResolution: 1,
                        md5ext: 'a2acb3d0f1d4f14132b43c31821f1c5d.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 58,
                        rotationCenterY: 72
                    },
                    {
                        assetId: '03d8f0b2148d6c6697fa59a9507d4829',
                        name: translator(messages.costume, { index: 4 }),
                        bitmapResolution: 1,
                        md5ext: '03d8f0b2148d6c6697fa59a9507d4829.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 49,
                        rotationCenterY: 83
                    }
                ],
                sounds: [],
                assets: [],
                volume: 101,
                visible: true,
                x: 0,
                y: 0,
                size: 100,
                direction: 90,
                draggable: false,
                rotationStyle: 'all around'
            }
        ],
        meta: {
            semver: '3.0.0',
            vm: '0.1.0',
            agent: ''
        }
    });
};


export default projectData;
