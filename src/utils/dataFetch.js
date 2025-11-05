import axios from 'axios';

async function getThemeColors(themeName) {
  //throw new Error('fdkjfkj');
  const res = await axios.get(`./termthemes/${themeName}.json`);
  return res.data;
}

async function getAppAnsiContent(appName) {
  const res = await axios.get(`./termapps/${appName}.txt`);
  return res.data;
}

async function getAppList() {
  const res = await axios.get(`./termapps/list.json`);
  return res.data;
}

async function getThemeList() {
  const res = await axios.get(`./termthemes/list.json`);
  return res.data;
}

export { getThemeColors, getAppAnsiContent, getAppList, getThemeList };
