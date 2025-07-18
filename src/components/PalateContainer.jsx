import { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from './AppState';
import { isBrightColor } from '../utils/colorsUtils';
import Loader from './Loader';
import ErrorNotice from './ErrorNotice';
import { getThemeColors } from '../utils/dataFetch';
import { toast } from 'react-toastify';

export default function PalateContainer({ className }) {
    const { themeName } = useContext(AppContext);

    const { isFetching, refetch, error, data } = useQuery({
        queryKey: [themeName],
        queryFn: () => {
            if (themeName) {
                return getThemeColors(themeName);
            } else {
                return new Promise.resolve();
            }
        },
        staleTime: 60 * 60 * 100,
    });

    useEffect(() => {
        refetch();
    }, [themeName]);

    useEffect(() => {
        if (error) {
            toast('fuckeeeeee', { type: 'error' });
        }
    }, [error]);

    if (themeName === null) {
        return <div>choose a theme</div>;
    }

    if (isFetching) {
        return <Loader className={`${className ? className : ''}`} />;
    }

    if (error) {
        return (
            <ErrorNotice
                errorMsg={'Something went wrong'}
                className={`${className ? className : ''}`}
            />
        );
    }

    const handleDrag = (event, value) => {
        event.dataTransfer.setData('dragData', value);
        event.dataTransfer.effectAllowed = 'move';
    };
    let colorBadges = Object.entries(data.all).map(([key, value]) => {
        let isBright = isBrightColor(value);
        return (
            <div
                onDragStart={(event) => handleDrag(event, value)}
                key={key}
                className={`${isBright ? 'text-black' : 'text-white'} rounded-sm border border-black px-1 py-5 text-center text-xs select-none`}
                style={{ backgroundColor: value }}
                draggable
            >
                {value}
            </div>
        );
    });
    return (
        <div
            className={`${className ? className : ''}`}
            style={{ gridArea: 'colorcontainer' }}
        >
            {colorBadges}
        </div>
    );
}
