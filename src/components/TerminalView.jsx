import TerminalPalate from './TerminalPalate';
import Popup from './Popup';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
//import XtermWebfont from 'xterm-webfont';
import { FitAddon } from '@xterm/addon-fit';
import { useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import { AppContext } from './AppState';
import { useQuery } from '@tanstack/react-query';
import { getAppAnsiContent, getThemeColors } from '../utils/dataFetch';

export default function TerminalView({ className }) {
  let rows = 35;
  let cols = 130;
  let fontSize = 14;
  let letterSpacing = 0.5;
  let term = useRef(null);
  let termDivRef = useRef(null);

  const {
    themeName,
    termPalate,
    setTermPalate,
    appName,
    wMMode,
    filePath,
    isThemePalateActive,
    setIsThemePalateActive,
  } = useContext(AppContext);

  const [content, setContent] = useState('');
  const [resizeCount, setResizeCount] = useState('');

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
  }, [themeData, themeError, themeName]);

  useEffect(() => {
    if (isContentSuccess) {
      setContent(contentData);
    }

    if (contentError) {
      setContent('something somewhere went wrong :) network issue');
    }
  }, [contentData, contentError]);

  useEffect(() => {
    // we need to find the no of col and rows to make the terminal fix exactly inside the termDiv
    // calculaion includes letterSpacing and fontSize
    const { width: divWidth, height: divHeight } =
      termDivRef.current.getBoundingClientRect();
    const dynRow = Math.floor(divHeight / fontSize);
    const dynCol = Math.floor(divWidth / (fontSize + letterSpacing - 5));

    term.current = new Terminal({
      fontSize: fontSize,
      fontFamily: 'RedditMono',
      convertEol: true,
      fontWeight: '400',
      letterSpacing: letterSpacing,
      fontWeightBold: '800',
      theme: termPalate,
    });

    //currently not working
    //term.current.loadAddon(new XtermWebfont());
    const fitAddon = new FitAddon();
    term.current.loadAddon(fitAddon);

    //term.current.resize(dynCol, di);
    term.current.open(termDivRef.current);
    fitAddon.fit();
    const fitDimension = fitAddon.proposeDimensions();
    // check the propose dimension given by the fit addon
    // if the dimensions are too small, ie smaller than the dimensions of actual terminal from where the content is captured,
    // the content may appear wierder, so to avoid the terminal is resized to atleast have the dimension, not less than the original
    // the dimension used while recording for all apps is {cols: 130, rows: 35}
    if (fitDimension.cols < 130 || fitDimension.rows < 35) {
      term.current.resize(
        fitDimension.cols < 130 ? 130 : fitDimension.cols,
        fitDimension.rows < 35 ? 35 : fitDimension.rows,
      );
    }
    term.current.write(content);

    termDivRef.current.scrollIntoView();

    return () => {
      term.current.dispose();
    };
  }, [content, termPalate, resizeCount]);

  useEffect(() => {
    const triggerResizeRender = () => setResizeCount((c) => c + 1);
    window.addEventListener('resize', triggerResizeRender);

    return () =>
      window.current?.removeEventListener('resize', triggerResizeRender);
  }, []);

  return (
    <div
      className={`${className ? className : ''} relative overflow-hidden bg-black`}
      style={{
        gridArea: 'terminalview',
        backgroundImage: `url(${filePath})`,
      }}
      onDragEnter={() => {
        setIsThemePalateActive(true);
      }}
    >
      <div className="overflow-scroll" ref={termDivRef} id="terminal"></div>
      {isThemePalateActive && (
        <Popup closeCb={() => setIsThemePalateActive(false)}>
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="bg-white p-4"
          >
            <TerminalPalate />
          </div>
        </Popup>
      )}
    </div>
  );
}

//function WMWrap({ children, wMMode }) {
//	console.log(wMMode);
//	if(wMMode) {
//		return <div
//			className='bg-red-500 px-3'
//			style={{ gridArea: 'terminalview'}}
//		>
//			{children}
//		</div>
//	}
//	return children
//}
