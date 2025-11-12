import { createContext, useState } from 'react';

const AppContext = createContext();

function AppContextProvider({ children }) {
  const [themeName, setThemeName] = useState(null);
  const [appName, setAppName] = useState(null);
  const [wMMode, setWMMode] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [gaps, setGaps] = useState([5]);
  const [blur, setBlur] = useState([2]);
  const [opacity, setOpacity] = useState([0.9]);
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
        filePath,
        setFilePath,
        isThemePalateActive,
        setIsThemePalateActive,
        colorPickerFor,
        setColorPickerFor,
        gaps,
        setGaps,
        blur,
        setBlur,
        opacity,
        setOpacity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppContextProvider };
