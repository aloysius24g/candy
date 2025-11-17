import { useContext, useRef, useId } from 'react';
import { AppContext } from './AppState';
import * as Popover from '@radix-ui/react-popover';
import * as RadixSlider from '@radix-ui/react-slider';
import * as CheckBox from '@radix-ui/react-checkbox';
import FuzzySelector from './FuzzySelector';
import { MdInfo } from 'react-icons/md';
import { TbFileExport } from 'react-icons/tb';
import { FaRegSave } from 'react-icons/fa';
import { LuWallpaper } from 'react-icons/lu';
import { LuPalette } from 'react-icons/lu';
import { PiTerminalBold } from 'react-icons/pi';
import { CgOptions } from 'react-icons/cg';
import { useMediaQuery } from 'react-responsive';
import { useQuery } from '@tanstack/react-query';
import { getAppList, getThemeList } from '../utils/dataFetch';

import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { BarButton } from './TerminalBar';

export default function OptionsPopOver({ open, onOpenChange, state, onAction: dispatch }) {
  const {
    appName,
    themeName,
    setAppName,
    setThemeName,
    wMMode,
    setWMMode,
    setFilePath,
    setIsThemePalateActive,
    gaps,
    setGaps,
    blur,
    setBlur,
    opacity,
    setOpacity,
  } = useContext(AppContext);

  const fileBrowserRef = useRef(null);

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
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger onFocus={(event) => event.preventDefault()}>
        <BarButton label="Options" onClick={() => setIsThemePalateActive(false)} Icon={CgOptions} />
      </Popover.Trigger>
      <Popover.Portal>
        <AnimatePresence>
          <Popover.Content
            key="options"
            align="start"
            sideOffset="0"
            onFocusCapture={(e) => {
              e.stopPropagation();
            }}
          >
            <motion.div
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
              className="text-md z-auto flex min-w-44 flex-col gap-3 border border-gray-600 bg-neutral-900 p-4 text-sm text-indigo-200"
            >
              <div className="flex flex-col gap-2">
                {!isWide && (
                  <>
                    <div className="flex flex-col items-center gap-2">
                      {appFS}
                      {themeFS}
                    </div>
                    <hr className="text-gray-600" />
                  </>
                )}
                <PopButton
                  label="Export config"
                  Icon={TbFileExport}
                  onClick={() => dispatch('toggleExport')}
                />
                <PopButton
                  label="Save config"
                  Icon={FaRegSave}
                  onClick={() => dispatch('toggleSave')}
                />
                <PopOptions
                  label="Loop app"
                  value={state.slideApps}
                  onValueChange={() => dispatch('toggleSlideApps')}
                />
                <hr className="text-gray-600" />
                <PopOptions
                  label="Wm look"
                  value={wMMode}
                  onValueChange={(val) => setWMMode(val)}
                />
                {wMMode && (
                  <>
                    <PopButton
                      Icon={LuWallpaper}
                      label="Choose wallpaper"
                      onClick={() => fileBrowserRef.current.click()}
                    />
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
                    <div id="slider-group" className="my-3 flex flex-col justify-between gap-2">
                      <PopSlider
                        label="Gap"
                        step={1}
                        min={1}
                        max={30}
                        value={gaps}
                        onChange={(val) => setGaps(val)}
                      />
                      <PopSlider
                        label="Opq"
                        step={0.05}
                        max={1}
                        value={opacity}
                        onChange={(val) => setOpacity(val)}
                      />
                      <PopSlider
                        label="Blur"
                        step={1}
                        min={1}
                        max={30}
                        value={blur}
                        onChange={(val) => setBlur(val)}
                      />
                    </div>
                  </>
                )}
                <hr className="text-gray-600" />
                <PopButton label="About" Icon={MdInfo} onClick={() => dispatch('toggleInfo')} />
              </div>
            </motion.div>
          </Popover.Content>
        </AnimatePresence>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PopButton({ Icon, label, onClick }) {
  return (
    <button
      className="flex cursor-pointer items-center gap-2 hover:text-white focus:text-white focus:outline-none"
      onClick={onClick}
      type="button"
    >
      <Icon className="text-xl" />
      {label}
    </button>
  );
}
function PopOptions({ value, onValueChange, label }) {
  const id = useId();
  return (
    <div className="group flex cursor-pointer items-center gap-2">
      <CheckBox.Root
        id={id}
        className="peer flex h-4 w-4 cursor-pointer overflow-hidden rounded-full bg-indigo-200 group-hover:outline-1 group-hover:outline-white focus:outline-1 focus:outline-white"
        checked={value}
        onCheckedChange={onValueChange}
      >
        <CheckBox.Indicator className="h-full w-full bg-cyan-600" />
      </CheckBox.Root>
      <label className="cursor-pointer group-hover:text-white peer-focus:text-white" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
function PopSlider({ label, value, onChange, defaultValue, min, max, step }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-2">
      <label htmlFor={id}>{label}</label>
      <RadixSlider.Root
        id={id}
        className="relative flex h-5 w-[200px] cursor-pointer touch-none items-center select-none"
        defaultValue={defaultValue}
        value={value}
        max={max}
        min={min}
        step={step}
        onValueChange={onChange}
      >
        <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-gray-600">
          <RadixSlider.Range className="absolute h-full rounded-full bg-indigo-300" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block size-4 cursor-grab rounded-[10px] bg-gray-300 hover:bg-white focus:bg-cyan-300 focus:outline-none" />
      </RadixSlider.Root>
    </div>
  );
}
