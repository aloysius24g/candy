import { useContext, useState, useEffect, useRef, useReducer } from 'react';
import { AppContext } from './AppState';
import ExportPopup from './ExportPopup';
import Popup from './Popup';
import SavePopup from './SavePopup';
import AboutPopup from './AboutPopup';
import FuzzySelector from './FuzzySelector';
import { getAppList, getThemeList } from '../utils/dataFetch';
import { useMediaQuery } from 'react-responsive';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { LuPalette } from 'react-icons/lu';
import { CiPalette } from 'react-icons/ci';
import { PiTerminalBold } from 'react-icons/pi';
import OptionsPopOver from './OptionsPopOver';
import ToolTipWrap from './ToolTipWrap';

const optionsInitState = {
  isExportPopup: false,
  isSavePopup: false,
  isInfoPopup: false,
  slideApps: false,
};
const optionsReducer = (state, action) => {
  switch (action) {
    case 'toggleExport':
      return {
        ...state,
        isExportPopup: !state.isExportPopup,
      };
    case 'toggleSave':
      return {
        ...state,
        isSavePopup: !state.isSavePopup,
      };
    case 'toggleInfo':
      return {
        ...state,
        isInfoPopup: !state.isInfoPopup,
      };
    case 'toggleSlideApps':
      return {
        ...state,
        slideApps: !state.slideApps,
      };
  }
};

export default function TerminalBar({ className }) {
  const {
    appName,
    themeName,
    setAppName,
    setThemeName,
    isThemePalateActive,
    setIsThemePalateActive,
  } = useContext(AppContext);

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const [optionsState, optionsDispatcher] = useReducer(optionsReducer, optionsInitState);

  const nextAppRef = useRef(null);

  const isWide = useMediaQuery({ minWidth: 1000 });

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
    if (!optionsState.slideApps) {
      return;
    }
    const intervalId = setInterval(() => nextAppRef.current(), 2000);

    return () => clearInterval(intervalId);
  }, [optionsState.slideApps]);

  let appFS;
  let themeFS;
  if (appListIsFetching) {
    appFS = <div>loading...</div>;
  }
  if (themeListIsFetching) {
    themeFS = <div>loading...</div>;
  }
  if (appListData && appName && !appListError) {
    appFS = (
      <FuzzySelector
        Icon={PiTerminalBold}
        className="w-50"
        optionsArr={appListData}
        onChange={setAppName}
        value={appName}
        toolTip="CLI app, choose one to view the app in the terminal."
      />
    );
  }
  if (themeListData && themeName && !themeListError) {
    themeFS = (
      <FuzzySelector
        Icon={LuPalette}
        className="w-50"
        optionsArr={themeListData}
        onChange={setThemeName}
        value={themeName}
        toolTip="Default themes, choose one to apply to the terminal"
      />
    );
  }
  if (!appListIsFetching && appListError) {
    appFS = <div>Error</div>;
  }
  if (!themeListIsFetching && themeListError) {
    themeFS = <div>Error</div>;
  }

  return (
    <div
      className={`col-span-13 row-span-1 flex h-12 items-center justify-between gap-1 border-b-1 border-gray-600 bg-neutral-900 p-2 sm:gap-2`}
      style={{ gridArea: 'sitebar' }}
    >
      <span
        className={`flex content-center items-center px-2 text-center font-mono font-bold tracking-widest text-nowrap text-indigo-200 uppercase select-none ${isWide ? 'text-lg' : 'text-sm'} `}
      >
        termcandy
      </span>
      <OptionsPopOver
        open={isOptionsOpen}
        onOpenChange={setIsOptionsOpen}
        state={optionsState}
        onAction={optionsDispatcher}
      />
      <BarButton
        onClick={() => setIsThemePalateActive(!isThemePalateActive)}
        Icon={CiPalette}
        label="View palate"
        toolTip="show the 16 colors of terminal. Drag and drop colors, or choose one slot and pick form color picker"
      />
      {isWide && appFS}
      {isWide && themeFS}
      <AnimatePresence>
        {optionsState.isExportPopup && (
          <Popup key="export" closeCb={() => optionsDispatcher('toggleExport')}>
            <ExportPopup />
          </Popup>
        )}
        {optionsState.isSavePopup && (
          <Popup key="save" closeCb={() => optionsDispatcher('toggleSave')}>
            <SavePopup />
          </Popup>
        )}
        {optionsState.isInfoPopup && (
          <Popup key="info" closeCb={() => optionsDispatcher('toggleInfo')}>
            <AboutPopup />
          </Popup>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BarButton({ label, Icon, onClick, toolTip }) {
  return (
    <ToolTipWrap content={toolTip}>
      <button
        className="flex cursor-pointer items-center gap-2 border-1 border-gray-600 px-2 text-sm whitespace-nowrap md:text-base"
        onClick={onClick}
        type="button"
      >
        <Icon className="inline text-xl" />
        <span className="text-indigo-200">{label}</span>
      </button>
    </ToolTipWrap>
  );
}
