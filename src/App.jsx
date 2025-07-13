import { useContext } from 'react';

import TerminalView from './components/TerminalView';
import PalateContainer from './components/PalateContainer';
import TerminalPalate from './components/TerminalPalate';
import TerminalBar from './components/TerminalBar';
import { AppContext } from './components/AppState';
import ColorPicker from './components/ColorPicker';
import Popup from './components/Popup';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { useIsWide } from './utils/responsive';

function App() {
    const { isThemePalateActive, setIsThemePalateActive } =
        useContext(AppContext);
    const isWide = useIsWide();

    let gridLayout;

    if (isWide) {
        gridLayout = {
            gridTemplateAreas: `
				"logo           sitebar     "
				"colorcontainer terminalview"
				"colorpicker    terminalview"
			`,
            gridTemplateColumns: '1fr 6fr',
            gridTemplateRows: '10fr, 5fr, 3fr',
        };
    } else {
        gridLayout = {
            gridTemplateAreas: `
				"logo           sitebar       "
				"terminalview   terminalview  "
				"colorpicker    colorcontainer"
			`,
            gridTemplateColumns: '2fr 8fr',
            gridTemplateRows: '1fr, 7fr, 1fr',
        };
    }

    return (
        <>
            <ReactQueryDevtools />
            <div
                className="grid h-screen overflow-hidden"
                style={{
                    gridTemplateAreas: gridLayout.gridTemplateAreas,
                    gridTemplateColumns: gridLayout.gridTemplateColumns,
                    gridTemplateRows: gridLayout.gridTemplateRows,
                }}
            >
                <span className="text-center px-2 content-center font-mono text-lg font-bold text-nowrap uppercase border-black border-b-1 border-r-1">
                    terminal ugly
                </span>
                <PalateContainer className="grid grid-flow-col grid-cols-1 gap-1 overflow-y-auto p-1 md:grid-flow-row md:grid-cols-2 md:gap-2" />
                <ColorPicker />
                <TerminalBar />
                {/* hacky work, to avoid scrolling terminal when terminalPalate popup is active */}
                <div
                    style={{ gridArea: 'terminalview' }}
                    className={`${isThemePalateActive ? 'overflow-hidden' : 'overflow-auto'} relative z-0 m-2`}
                >
                    <TerminalView />
                    {isThemePalateActive && (
                        <Popup closeCb={() => setIsThemePalateActive(false)}>
                            <TerminalPalate
                                className={
                                    'w-[80vw] bg-cyan-50 p-3 md:w-[60vw]'
                                }
                            />
                        </Popup>
                    )}
                </div>
				<ToastContainer position='bottom-right'/>
            </div>
        </>
    );
}

export default App;
