import { useContext, useEffect, useState } from 'react';
import { AppContext } from './AppState';
import store from 'store';

export default function SavePopup({ closeCb }) {
  const [saveName, setsaveName] = useState('');
  const [restoreName, setRestoreName] = useState('');
  const [savedThemesList, setSavedThemeList] = useState({});
  const { termPalate, setTermPalate } = useContext(AppContext);

  useEffect(() => {
    setSavedThemeList(store.get('savedThemes'));
  }, [saveName]);

  const handleSave = (event) => {
    event.preventDefault();
    let themeObject = store.get('savedThemes');
    if (!themeObject) {
      themeObject = {};
    }
    store.set('savedThemes', { ...themeObject, [saveName]: termPalate });
    setsaveName('');
  };
  const handleRestore = (event) => {
    event.preventDefault();
    let themeObject = store.get('savedThemes');
    let targetTheme = themeObject[restoreName];
    setTermPalate({ ...targetTheme });
    closeCb();
  };

  return (
    <div
      className="flex h-[30vh] w-[80vw] flex-col justify-center gap-2 bg-white px-4 md:w-[60vw]"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <form className="grid grid-cols-3 gap-2">
        <label className="content-center">Save as:</label>
        <input
          required={true}
          value={saveName}
          className="border"
          onChange={(event) => setsaveName(event.target.value)}
        ></input>
        <button
          type="submit"
          onClick={handleSave}
          className="rounded-sm bg-blue-300 px-2 py-1"
        >
          Save :)
        </button>
      </form>
      <form className="grid grid-cols-3 gap-2">
        <label className="content-center">Restore Therme:</label>
        <select
          className="border"
          value={restoreName}
          onChange={(event) => setRestoreName(event.target.value)}
        >
          {savedThemesList
            ? Object.entries(savedThemesList).map(([key, value]) => {
                return (
                  <option key={key} value={key}>
                    {' '}
                    {key}{' '}
                  </option>
                );
              })
            : ''}
        </select>
        <button
          type="submit"
          onClick={handleRestore}
          className="rounded-sm bg-blue-300 px-2 py-1"
        >
          Restore
        </button>
      </form>
    </div>
  );
}
