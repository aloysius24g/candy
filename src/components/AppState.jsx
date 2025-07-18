import { createContext, useState } from 'react';

const AppContext = createContext();

function AppContextProvider({ children }) {
    const [themeName, setThemeName] = useState(null);
    const [appName, setAppName] = useState(null);
    const [wMMode, setWMMode] = useState(false);
    const [termPalate, setTermPalate] = useState({
        foreground: null,
        black: null,
        red: null,
        green: null,
        yellow: null,
        blue: null,
        magenta: null,
        cyan: null,
        white: null,
        background: null,
        brightBlack: null,
        brightRed: null,
        brightGreen: null,
        brightYellow: null,
        brightBlue: null,
        brightMagenta: null,
        brightCyan: null,
        brightWhite: null,
    });
    const [isThemePalateActive, setIsThemePalateActive] = useState(false);
    const [colorPickerFor, setColorPickerFor] = useState('foreground');

    return (
        <AppContext.Provider
            value={{
                themeName,
                setThemeName,
                termPalate,
                setTermPalate,
                appName,
                setAppName,
                wMMode,
                setWMMode,
                isThemePalateActive,
                setIsThemePalateActive,
                colorPickerFor,
                setColorPickerFor,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export { AppContext, AppContextProvider };
