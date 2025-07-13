import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from './AppState';
import BarButton from './BarButton';
import ExportPopup from './ExportPopup';
import Popup from './Popup';
import SavePopup from './SavePopup';
import FuzzySelector from './FuzzySelector';
import { getAppList, getThemeList } from '../utils/dataFetch';
import { useMediaQuery } from 'react-responsive';
import { useQuery } from '@tanstack/react-query';
import { RiListSettingsLine } from "react-icons/ri";
import { BsPalette2 } from "react-icons/bs";
import { LuPalette } from "react-icons/lu";
import { IoTerminal } from "react-icons/io5";
import { TbFileExport } from "react-icons/tb";
import { FaRegSave } from "react-icons/fa";

import * as Popover from '@radix-ui/react-popover';

export default function TerminalBar({ className }) {
    const [appList, setAppList] = useState([]);
    //const [slideShow, setSlildeShow] = useState(false);
    const [isExportPopup, setIsExportPopup] = useState(false);
    const [isSavepopup, setIsSavepopup] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {
		appName,
		themeName,
        setAppName,
        setThemeName,
        isThemePalateActive,
        setIsThemePalateActive,
    } = useContext(AppContext);

	const isWide = useMediaQuery({minWidth: 1000});
	const isWide1 = useMediaQuery({minWidth: 800});

	const{isFetching: themeListIsFetching, error: themeListError, data: themeListData} = useQuery({
		queryKey: ['themeList'],
		queryFn: getThemeList
	});

	const{isFetching: appListIsFetching, error: appListError, data: appListData} = useQuery({
		queryKey: ['appList'],
		queryFn: getAppList
	});

	useEffect(() => {
		if(! appListData || ! themeListData) {
			return;
		}
		if(! appName) {
			setAppName(appListData[0]);
		}
		if(! themeName) {
			setThemeName(themeListData[0]);
		}
	}, [themeListData, appListData]);

	const extraButtons = <>
					<div className="content-center flex h-6 items-center gap-2">
						{! appListIsFetching ? 
							<>
								<label> <LuPalette /></label>
								<FuzzySelector
									optionsArr={appListData}
									onChange={(event) => setAppName(event.value)}
									value={appListData[0]}
								/>
							</> :
							<div>
								loadeing...
							</div>
						}
					</div>
					<div className="content-center flex h-6 items-center gap-2">
						{! themeListIsFetching ?
							<>
								<label> <IoTerminal /></label>
								<FuzzySelector
									optionsArr={themeListData}
									onChange={(event) => setThemeName(event.value)}
									value={themeListData[0]}
								/>
							</> :
							<div>
								loadeing...
							</div>
						}
					</div>
					<div>
						<button
							onClick={() => setIsThemePalateActive(!isThemePalateActive)}
							type="button"
						>
							<LuPalette/>
						</button>
						<button
							onClick={() => setIsExportPopup(true)}
							type="button"
						>
							<TbFileExport/>
						</button>
						<button
							onClick={() => setIsSavepopup(true)}
							type="button"
						>
							<FaRegSave/>
						</button>
						</div>
				</>

    return (
        <div
            className={'$col-span-13 row-span-1 flex gap-2 justify-between p-2 items-center border-black border-b-1'}
            style={{ gridArea: 'sitebar' }}
        >
			<Popover.Root>
				<Popover.Trigger asChild>
					<div>
						<button style={{ padding: "10px", fontSize: "16px" }}>Open Popover</button>
					</div>
				</Popover.Trigger>
				<Popover.Content 
					side="bottom" 
					align="center" 
					className='z-5 rounded-sm'
					style={{
						background: "#fff", 
						padding: "20px", 
						boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
					}}
				>
					{/* Popover Content */}
				</Popover.Content>
			</Popover.Root>
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
			{ isWide1 ? 
				extraButtons
			: <BarButton
					onClick={() => setIsMenuOpen(true)}
				> 
					<RiListSettingsLine />
				</BarButton>
			}
			{isMenuOpen && <Popup closeCb={() => setIsMenuOpen(false)}> 
				<div 
					className='bg-white h-[300px] w-[400px]  flex flex-col justify-center'
				>
					{extraButtons}
				</div>
			</Popup>}
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
