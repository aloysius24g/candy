import { useContext, useState, useEffect, useRef } from 'react';
import ToolTipWrap from './ToolTipWrap';
import { AppContext } from './AppState';
import ExportPopup from './ExportPopup';
import Popup from './Popup';
import SavePopup from './SavePopup';
import FuzzySelector from './FuzzySelector';
import { getAppList, getThemeList } from '../utils/dataFetch';
import { useMediaQuery } from 'react-responsive';
import { useQuery } from '@tanstack/react-query';
import { RiListSettingsLine } from 'react-icons/ri';
import { BsPalette2 } from 'react-icons/bs';
import { LuPalette } from 'react-icons/lu';
import { CiPalette } from 'react-icons/ci';
import { PiTerminalBold } from 'react-icons/pi';
import { TbFileExport } from 'react-icons/tb';
import { FaRegSave } from 'react-icons/fa';

import * as Popover from '@radix-ui/react-popover';

export default function TerminalBar({ className }) {
    const [appList, setAppList] = useState([]);
    //const [slideShow, setSlildeShow] = useState(false);
    const [isExportPopup, setIsExportPopup] = useState(false);
    const [isSavepopup, setIsSavepopup] = useState(false);
    const [randomCLI, setRandomCLI] = useState(false);
    const [randomTheme, setRandomTheme] = useState(false);

    const {
        appName,
        themeName,
        setAppName,
        setThemeName,
        wMMode,
        setWMMode,
        isThemePalateActive,
        setIsThemePalateActive,
    } = useContext(AppContext);

    const isWide = useMediaQuery({ minWidth: 1000 });
    const isWide1 = useMediaQuery({ minWidth: 800 });

    const {
        isFetching: themeListIsFetching,
        error: themeListError,
        data: themeListData,
    } = useQuery({
        queryKey: ['themeList'],
        queryFn: getThemeList,
    });

    const {
        isFetching: appListIsFetching,
        error: appListError,
        data: appListData,
    } = useQuery({
        queryKey: ['appList'],
        queryFn: getAppList,
    });

    useEffect(() => {
        if (!appListData || !themeListData) {
            return;
        }
        if (!appName) {
            setAppName(appListData[0]);
        }
        if (!themeName) {
            setThemeName(themeListData[0]);
        }
    }, [themeListData, appListData]);

    const importantButtons = (
        <>
            {appName && appListData ? (
                <>
                    <FuzzySelector
                        Icon={PiTerminalBold}
                        className="w-50"
                        optionsArr={appListData}
                        onChange={(value) => setAppName(value)}
                        value={appName}
                    />
                </>
            ) : (
                <div>loadeing...</div>
            )}
            {themeName && themeListData ? (
                <>
                    <FuzzySelector
                        Icon={LuPalette}
                        className="w-50"
                        optionsArr={themeListData}
                        onChange={(value) => setThemeName(value)}
                        value={themeName}
                    />
                </>
            ) : (
                <div>loadeing...</div>
            )}
        </>
    );

    const extraButtons = (
        <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-2">
                <ToolTipWrap content="Export Config">
                    <button
                        className="cursor-pointer text-2xl hover:text-red-400"
                        onClick={() => setIsExportPopup(true)}
                        type="button"
                    >
                        <TbFileExport />
                    </button>
                </ToolTipWrap>
                <ToolTipWrap content="Save Config">
                    <button
                        className="cursor-pointer text-2xl hover:text-red-400"
                        onClick={() => setIsSavepopup(true)}
                        type="button"
                    >
                        <FaRegSave />
                    </button>
                </ToolTipWrap>
            </div>
            <hr />
            <div className="flex gap-2">
                <input
                    type="checkBox"
                    checked={randomCLI}
                    onChange={(event) => setRandomCLI((pre) => !pre)}
                />
                <lable>Random CLI</lable>
            </div>
            <div className="flex gap-2">
                <input
                    type="checkBox"
                    checked={randomTheme}
                    onChange={(event) => setRandomTheme((pre) => !pre)}
                />
                <lable>Random Theme</lable>
            </div>
            <hr />
            <div className="flex gap-2">
                <input
                    type="checkBox"
                    checked={wMMode}
                    onChange={(event) => setWMMode((pre) => !pre)}
                />
                <lable>WM mode</lable>
            </div>
            {wMMode && (
                <>
                    <div className="flex w-full flex-col gap-2">
                        <lable htmlFor="wallpaper-file">
                            <button>Choose Wallpaper</button>
                        </lable>
                        <input id="wallpaper-file" type="file" className="" />
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div
            className={
                '$col-span-13 row-span-1 flex items-center justify-between gap-2 border-b-1 border-black p-2'
            }
            style={{ gridArea: 'sitebar' }}
        >
            {/*
			<div className='content-center'>
				<label>
					SlideShow
					<input
						type="checkbox"
						name="slideShow"
						className="mx-2 cursor-pointer"
						onChange={handleChange}
						checked={slideShow}
					></input>
				</label>
			</div>
			*/}
            <Popover.Root>
                <Popover.Trigger asChild>
                    <button className="text-lg" type="button">
                        Options
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content align="start" sideOffset="1">
                        <div className="flex flex-col gap-3 border border-black bg-white p-4">
                            {isWide ? (
                                extraButtons
                            ) : (
                                <>
                                    <div className="flex flex-col items-center gap-2">
                                        {importantButtons}
                                    </div>
                                    <hr />
                                    {extraButtons}
                                </>
                            )}
                        </div>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            <button
                className="text-lg"
                onClick={() => setIsThemePalateActive(!isThemePalateActive)}
                type="button"
            >
                <CiPalette className="inline text-xl" /> View Palate
            </button>
            {isWide && importantButtons}
            {isExportPopup && (
                <Popup closeCb={() => setIsExportPopup(false)}>
                    <ExportPopup />
                </Popup>
            )}
            {isSavepopup && (
                <Popup closeCb={() => setIsSavepopup(false)}>
                    <SavePopup />
                </Popup>
            )}
        </div>
    );
}
