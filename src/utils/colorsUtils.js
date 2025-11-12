import chroma from 'chroma-js';

function isBrightColor(color) {
  let lumi = chroma(color).luminance();
  if (lumi > 0.1) {
    return true;
  } else {
    return false;
  }
}

function convertHsvToHex({ h, s, v }) {
  return chroma.hsv([h, s, v]).hex();
}

function convertHexToHsv(hex) {
  let hsv = chroma(hex).hsv();
  return {
    h: hsv[0],
    s: hsv[1],
    v: hsv[2],
  };
}

function applyAlpha(rgbColor, opacity) {
  return chroma(rgbColor).alpha(opacity).hex('rgba');
}

export { isBrightColor, convertHsvToHex, convertHexToHsv, applyAlpha };
