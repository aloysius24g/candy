import TerminalPalate from './TerminalPalate';
import Popup from './Popup';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import XtermWebfont from 'xterm-webfont';
import { FitAddon } from '@xterm/addon-fit';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useRef } from 'react';
import { AppContext } from './AppState';
import { useQuery } from '@tanstack/react-query';
import { getAppAnsiContent, getThemeColors } from '../utils/dataFetch';
import { applyAlpha } from '../utils/colorsUtils';
import { useDndContext } from '@dnd-kit/core';

export default function TerminalView() {
  let rRows = 35;
  let rCols = 130;
  let fontSize = 14;
  let letterSpacing = 0.5;

  const {
    themeName,
    termPalate,
    setTermPalate,
    appName,
    wMMode,
    filePath,
    isThemePalateActive,
    setIsThemePalateActive,
    gaps,
    opacity,
    blur,
  } = useContext(AppContext);

  const [content, setContent] = useState('');
  const [resizeCount, setResizeCount] = useState(0);
  const term = useRef(null);
  const termDivRef = useRef(null);

  const { active: isDragOver } = useDndContext();

  const {
    isSuccess: isThemeSuccess,
    error: themeError,
    data: themeData,
  } = useQuery({
    queryKey: [themeName],
    queryFn: () => getThemeColors(themeName),
  });

  const {
    isSuccess: isContentSuccess,
    error: contentError,
    data: contentData,
  } = useQuery({
    queryKey: [appName],
    queryFn: () => getAppAnsiContent(appName),
  });

  useEffect(() => {
    if (isThemeSuccess) {
      setTermPalate({ ...themeData.default });
    }
    if (themeError) {
      setContent('something somewhere went wrong');
    }
  }, [themeData, themeError, themeName]);

  useEffect(() => {
    if (isContentSuccess) {
      setContent(contentData);
    }

    if (contentError) {
      setContent('something somewhere went wrong');
    }
  }, [contentData, contentError]);

  useLayoutEffect(() => {
    // :( i cant understand the disign of this freaking library.
    // I am doing somtinng that works just for my use case.
    // See index.css
    const termOpt = {
      disableMouse: true,
      fontSize: fontSize,
      fontFamily: 'RedditMono',
      convertEol: true,
      fontWeight: '400',
      letterSpacing: letterSpacing,
      fontWeightBold: '800',
      theme: termPalate,
    };

    term.current = new Terminal(termOpt);

    term.current.loadAddon(new XtermWebfont());
    const fitAddon = new FitAddon();
    term.current.loadAddon(fitAddon);

    term.current.open(termDivRef.current);
    fitAddon.fit();
    const fitDimension = fitAddon.proposeDimensions();
    // check the propose dimension given by the fit addon
    // if the dimensions are too small, ie smaller than the dimensions of actual terminal from where the content is captured,
    // the content may appear wierder, so to avoid the terminal is resized to atleast have the dimension, not less than the original
    // the dimension used while recording for all apps is {cols: 130, rows: 35}
    if (fitDimension.cols < rCols || fitDimension.rows < rRows) {
      term.current.resize(
        fitDimension.cols < rCols ? rCols : fitDimension.cols,
        fitDimension.rows < rRows ? rRows : fitDimension.rows,
      );
    }

    term.current.write(content);
    termDivRef.current.scrollIntoView();
    termDivRef.current.querySelector('textarea').remove();

    return () => {
      term.current.dispose();
    };
  }, [content, termPalate, resizeCount, gaps, wMMode]);

  useEffect(() => {
    // This xterm combined with fit addon is throwing some errors, that i can't fixed,
    // that too inside a setTimeout handler. Dosen't crash but still polutes the dev console.
    // So the error can't be caught. So to fix this. suppress it. :(((
    window.onerror = function supressNastyError(msg) {
      return true;
    };
    const triggerResizeRender = () => setResizeCount((c) => c + 1);
    window.addEventListener('resize', triggerResizeRender);
    const handleEscape = () => setIsThemePalateActive(false);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('resize', triggerResizeRender);
      window.removeEventListener('keydown', handleEscape);
      window.onerror = null;
    };
  }, []);

  useEffect(() => {
    if (isDragOver) {
      setIsThemePalateActive(true);
    }
  }, [isDragOver]);

  // install to apply right styles of terminal; hackcy
  useLayoutEffect(() => {
    const myTerminalDiv = document.querySelector('#terminal');
    const xtermTerminalScreen = document.querySelector('.xterm-screen');
    const xtermTerminalDiv = document.querySelector('.terminal');
    const xtermTerminalViewport = document.querySelector('.xterm-viewport');

    // bg color when no transparency
    xtermTerminalScreen.style.backgroundColor = termPalate?.background;

    if (wMMode && filePath) {
      myTerminalDiv.style.backgroundImage = `url(${filePath})`;
    }

    if (wMMode) {
      // gaps
      xtermTerminalDiv.style.top = `${gaps}%`;
      xtermTerminalDiv.style.bottom = `${gaps}%`;
      xtermTerminalDiv.style.left = `${gaps}%`;
      xtermTerminalDiv.style.right = `${gaps}%`;
      // Just hide this. :(
      xtermTerminalViewport.style.display = 'none';
      // border
      xtermTerminalDiv.style.border = '1px solid white';
      // opacity
      if (termPalate?.background) {
        xtermTerminalScreen.style.backgroundColor = applyAlpha(termPalate.background, opacity[0]);
      }
      // blur
      xtermTerminalDiv.style.backdropFilter = `blur(${blur[0]}px)`;
    } else {
      // gaps
      xtermTerminalDiv.style.top = '0px';
      xtermTerminalDiv.style.bottom = '0px';
      xtermTerminalDiv.style.left = '0px';
      xtermTerminalDiv.style.right = '0px';
      // border
      xtermTerminalDiv.style.border = '0px solid white';
      // opacity
      xtermTerminalScreen.style.backgroundColor = termPalate.background;
    }
  }, [wMMode, gaps, opacity, blur, content, termPalate, resizeCount, filePath]);

  return (
    <div
      onClick={() => setIsThemePalateActive(false)}
      ref={termDivRef}
      id="terminal"
      className={`relative m-2 border-1 border-gray-600 bg-cover`}
      style={{
        gridArea: 'terminalview',
      }}
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        style={{
          opacity: isThemePalateActive ? 1 : 0,
          zIndex: isThemePalateActive ? 40 : -10,
        }}
        className="absolute top-1/2 left-1/2 flex w-[93vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-md border-1 border-gray-600 bg-neutral-900 p-4 sm:w-4/5 md:w-2/3"
      >
        <button
          className="self-end border-1 border-gray-600 p-2 text-red-400"
          onClick={() => setIsThemePalateActive(false)}
        >
          close
        </button>
        <TerminalPalate />
        <span className="text-wrap text-gray-400">
          Drag and drop colors here and cutomise it fine in the color picker.
        </span>
      </div>
    </div>
  );
}
