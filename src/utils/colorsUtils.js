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
    h: hsv[0] ? hsv[0] : 0, // brooooo this is to set nan to hue 0.
    // This is to avoid nan hue when converting hueless colors like black, white, grey.
    // using nan hue in colorPicker leads bug. :((
    s: hsv[1],
    v: hsv[2],
  };
}

export { isBrightColor, convertHsvToHex, convertHexToHsv };
