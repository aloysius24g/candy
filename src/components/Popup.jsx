import React, { useEffect } from 'react';

export default function Popup({ children, closeCb }) {
    const escPressHandler = (event) => {
        if (event.key === 'Escape') {
            closeCb();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', escPressHandler);
        return () => {
            window.removeEventListener('keydown', escPressHandler);
        };
    }, []);

    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
            onClick={() => closeCb()}
        >
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { closeCb: closeCb }),
            )}
        </div>
    );
}
