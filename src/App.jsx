import { useContext } from 'react';
import TerminalView from './components/TerminalView';
import PalateContainer from './components/PalateContainer';
import TerminalBar from './components/TerminalBar';
import { AppContext } from './components/AppState';
import ColorPicker from './components/ColorPicker';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer, Slide } from 'react-toastify';
import { useIsWide } from './utils/responsive';

function App() {
	const isWide = useIsWide();

	let gridLayout;

	if (isWide) {
		gridLayout = {
			gridTemplateAreas: `
				"sitebar           sitebar     "
				"colorcontainer terminalview"
				"colorpicker    terminalview"
			`,
			gridTemplateColumns: '1fr 6fr',
			gridTemplateRows: '10fr, 5fr, 3fr',
		};
	} else {
		gridLayout = {
			gridTemplateAreas: `
				"sitebar           sitebar       "
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
				className="grid h-screen gap-2 overflow-hidden bg-black text-cyan-300"
				style={{
					gridTemplateAreas: gridLayout.gridTemplateAreas,
					gridTemplateColumns: gridLayout.gridTemplateColumns,
					gridTemplateRows: gridLayout.gridTemplateRows,
				}}
			>
				<PalateContainer compact={!isWide} />
				<ColorPicker compact={!isWide} />
				<TerminalBar />
				<TerminalView />
				<ToastContainer
					theme="dark"
					position="bottom-right"
					toastClassName="w-30 bg-neutral-900 border-1 border-gray-600"
					transition={Slide}
					limit={2}
				/>
			</div>
		</>
	);
}

export default App;
