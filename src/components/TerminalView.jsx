import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import XtermWebfont from 'xterm-webfont';
import { useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import { AppContext } from './AppState';
import { useQuery } from '@tanstack/react-query';
import { getAppAnsiContent, getThemeColors } from '../utils/dataFetch';

export default function TerminalView({ className, fontSize, rows, cols }) {
    let drows = 35;
    let dcols = 130;
    let dfontSize = 14;
    let term = useRef(null);
    let termDivRef = useRef(null);

    const {
        themeName,
        termPalate,
        setTermPalate,
        appName,
        setIsThemePalateActive,
    } = useContext(AppContext);

    const [content, setContent] = useState('');

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

		if(contentError) {
			setContent('something somewhere went wrong :) network issue');
		}
    }, [contentData, contentError]);

    useEffect(() => {
        term.current = new Terminal({
            fontSize: fontSize ? fontSize : dfontSize,
            fontFamily: 'RedditMono',
            convertEol: true,
            fontWeight: '400',
            letterSpacing: 0.5,
            fontWeightBold: '800',
            theme: termPalate,
        });
        term.current.loadAddon(new XtermWebfont());
        term.current.resize(cols ? cols : dcols, rows ? rows : drows);
        term.current.open(termDivRef.current);
        term.current.write(content);

        termDivRef.current.scrollIntoView();

        return () => {
            term.current.dispose();
        };
    }, [content, termPalate]);

    return (
        <>
            <div
                className={`${className ? className : ''} relative -z-40`}
                style={{ gridArea: 'terminal' }}
                ref={termDivRef}
                id="terminal"
                onDragEnter={() => {
                    setIsThemePalateActive(true);
                }}
            ></div>
        </>
    );
}
