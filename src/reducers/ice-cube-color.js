const SET_ICE_CUBE_COLOR = 'scratch-gui/iceCubeColor/SET_ICE_CUBE_COLOR';
const STORAGE_KEY = 'pm:iceCubeColor';
const DEFAULT_COLOR = '#8ed8ff';

const getInitialColor = () => {
    if (typeof window === 'undefined') return DEFAULT_COLOR;
    try {
        const storedColor = window.localStorage.getItem(STORAGE_KEY);
        return storedColor || DEFAULT_COLOR;
    } catch (e) {
        return DEFAULT_COLOR;
    }
};

const initialState = {
    color: getInitialColor()
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_ICE_CUBE_COLOR:
        return Object.assign({}, state, {color: action.color});
    default:
        return state;
    }
};

const setIceCubeColor = color => ({
    type: SET_ICE_CUBE_COLOR,
    color: color
});

const iceCubeColor = state => state.scratchGui.iceCubeColor.color;

export {
    reducer as default,
    initialState as iceCubeColorInitialState,
    setIceCubeColor,
    iceCubeColor
};
