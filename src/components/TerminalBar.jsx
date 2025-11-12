import { useContext, useState, useEffect, useRef, useId } from 'react';
import ToolTipWrap from './ToolTipWrap';
import { AppContext } from './AppState';
import ExportPopup from './ExportPopup';
import Popup from './Popup';
import SavePopup from './SavePopup';
import AboutPopup from './AboutPopup';
import FuzzySelector from './FuzzySelector';
import Slider from './Slider';
import { getAppList, getThemeList } from '../utils/dataFetch';
import { useMediaQuery } from 'react-responsive';
import { useQuery } from '@tanstack/react-query';
import { RiListSettingsLine } from 'react-icons/ri';
import { MdInfo } from 'react-icons/md';
import { BsPalette2 } from 'react-icons/bs';
import { LuPalette } from 'react-icons/lu';
import { CiPalette } from 'react-icons/ci';
import { PiTerminalBold } from 'react-icons/pi';
import { CgOptions } from 'react-icons/cg';
import { TbFileExport } from 'react-icons/tb';
import { FaRegSave } from 'react-icons/fa';
import { LuWallpaper } from 'react-icons/lu';

import * as Popover from '@radix-ui/react-popover';
import * as CheckBox from '@radix-ui/react-checkbox';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

export default function TerminalBar({ className }) {
  const [appList, setAppList] = useState([]);
  const [isExportPopup, setIsExportPopup] = useState(false);
  const [isSavePopup, setIsSavePopup] = useState(false);
  const [isInfoPopup, setIsInfoPopup] = useState(false);
  const [slideApps, setSlideApps] = useState(false);

  const nextAppRef = useRef(null);
  const fileBrowserRef = useRef(null);

  const popoverId = useId();

  const {
    appName,
    themeName,
    setAppName,
    setThemeName,
    wMMode,
    setWMMode,
    filePath,
    setFilePath,
    isThemePalateActive,
    setIsThemePalateActive,
    gaps,
    setGaps,
    blur,
    setBlur,
    opacity,
    setOpacity,
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

  const nextApp = () => {
    if (!appListData) {
      return;
    }
    let selIndex = appListData.indexOf(appName);
    if (selIndex >= appListData.length - 1) {
      selIndex = 0;
    } else {
      selIndex++;
    }
    setAppName(appListData[selIndex]);
  };
  nextAppRef.current = nextApp;

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

  // Install timer for app slideshow.
  useEffect(() => {
    if (!slideApps) {
      return;
    }
    const intervalId = setInterval(() => nextAppRef.current(), 2000);

    return () => clearInterval(intervalId);
  }, [slideApps]);

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
      <button
        className="flex cursor-pointer items-center gap-2 hover:text-white"
        onClick={() => setIsExportPopup(true)}
        type="button"
      >
        <TbFileExport className="text-xl" />
        Export config
      </button>
      <button
        className="flex cursor-pointer items-center gap-2 hover:text-white"
        onClick={() => setIsSavePopup(true)}
        type="button"
      >
        <FaRegSave className="text-xl" />
        Save config
      </button>
      <div className="flex items-center gap-2">
        <CheckBox.Root
          className="flex h-4 w-4 overflow-hidden rounded-full bg-indigo-200 focus:outline-1 focus:outline-white"
          checked={slideApps}
          onCheckedChange={(event) => setSlideApps((pre) => !pre)}
        >
          <CheckBox.Indicator className="h-full w-full bg-cyan-600" />
        </CheckBox.Root>
        <label>Loop app</label>
      </div>
      <hr className="text-gray-600" />
      <div className="flex items-center gap-2">
        <CheckBox.Root
          className="flex h-4 w-4 overflow-hidden rounded-full bg-indigo-200 focus:outline-1 focus:outline-white"
          checked={wMMode}
          onCheckedChange={(event) => setWMMode((pre) => !pre)}
        >
          <CheckBox.Indicator className="h-full w-full bg-cyan-600" />
        </CheckBox.Root>
        <label>Wm look</label>
      </div>
      {wMMode && (
        <>
          <div className="flex w-full flex-col gap-2">
            <label>
              <button
                className="flex cursor-pointer items-center gap-2 hover:text-white"
                onClick={() => {
                  fileBrowserRef.current.click();
                }}
              >
                <LuWallpaper className="inline text-xl" />
                Choose Wallpaper
              </button>
            </label>
            <input
              ref={fileBrowserRef}
              id="wallpaper-file"
              type="file"
              accept="images/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files[0];
                const url = URL.createObjectURL(file);
                setFilePath(url);
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <label>gap</label>
            <Slider step={1} min={1} max={30} value={gaps} onChange={(val) => setGaps(val)} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <label>opaq</label>
            <Slider value={opacity} step={0.05} max={1} onChange={(val) => setOpacity(val)} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <label>blur</label>
            <Slider max={20} step={1} value={blur} onChange={(val) => setBlur(val)} />
          </div>
        </>
      )}
      <hr className="text-gray-600" />
      <button
        className="group flex items-center gap-2 hover:text-white"
        onClick={(e) => {
          e.preventDefault();
          setIsInfoPopup(!isInfoPopup);
        }}
      >
        <MdInfo className="text-xl group-hover:animate-pulse" />
        About
      </button>
    </div>
  );

  return (
    <div
      className={`col-span-13 row-span-1 flex h-12 items-center justify-between gap-2 border-b-1 border-gray-600 bg-neutral-900 p-2`}
      style={{ gridArea: 'sitebar' }}
    >
      <span className="flex content-center items-center px-2 text-center font-mono text-lg font-bold tracking-widest text-nowrap text-indigo-200 uppercase">
        termcandy
      </span>
      <Popover.Root>
        <Popover.Trigger asChild onFocus={(event) => event.preventDefault()}>
          <button
            className="flex cursor-pointer items-center gap-2 border-1 border-gray-600 px-2"
            type="button"
          >
            <CgOptions className="inline text-xl" />
            <span className="text-indigo-200">Options</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <AnimatePresence>
            <Popover.Content
              align="start"
              sideOffset="0"
              onFocusCapture={(e) => {
                e.stopPropagation();
              }}
              asChild
            >
              <motion.div
                key={popoverId}
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{
                  type: 'tween',
                  duration: 0.2,
                  ease: 'easeInOut',
                }}
                className="z-60 flex min-w-44 flex-col gap-3 border border-gray-600 bg-neutral-900 p-4 text-indigo-200"
              >
                {isWide ? (
                  extraButtons
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-2">{importantButtons}</div>
                    {extraButtons}
                  </>
                )}
              </motion.div>
            </Popover.Content>
          </AnimatePresence>
        </Popover.Portal>
      </Popover.Root>
      <button
        className="flex cursor-pointer items-center gap-2 border-1 border-gray-600 px-2"
        type="button"
        onClick={() => setIsThemePalateActive(!isThemePalateActive)}
        type="button"
      >
        <CiPalette className="inline text-xl" />
        <span className="text-indigo-200">View Palate</span>
      </button>
      {isWide && importantButtons}
      {isExportPopup && (
        <Popup closeCb={() => setIsExportPopup(false)}>
          <ExportPopup />
        </Popup>
      )}
      {isSavePopup && (
        <Popup closeCb={() => setIsSavePopup(false)}>
          <SavePopup />
        </Popup>
      )}
      {isInfoPopup && (
        <Popup closeCb={() => setIsInfoPopup(false)}>
          <AboutPopup />
        </Popup>
      )}
    </div>
  );
}
