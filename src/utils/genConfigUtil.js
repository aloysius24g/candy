function alacritty(termPalate) {
	let config = `colors:
  # Default colors
  primary:
    background: '${termPalate.background}'
    foreground: '${termPalate.foreground}'

  # Normal colors
  normal:
    black:   '${termPalate.black}'
    red:     '${termPalate.red}'
    green:   '${termPalate.green}'
    yellow:  '${termPalate.yellow}'
    blue:    '${termPalate.blue}'
    magenta: '${termPalate.magenta}'
    cyan:    '${termPalate.cyan}'
    white:   '${termPalate.white}'

  # Bright colors
  bright:
    black:   '${termPalate.brightBlack}'
    red:     '${termPalate.brightRed}'
    green:   '${termPalate.brightGreen}'
    yellow:  '${termPalate.brightYellow}'
    blue:    '${termPalate.brightBlue}'
    magenta: '${termPalate.brightMagenta}'
    cyan:    '${termPalate.brightCyan}'
    white:   '${termPalate.brightWhite}'`;
	return config;
}

function jsonSchema(termPalate) {
	let config = `{
  "name": "",
  "author": "",
  "color": [
    "${termPalate.black}",
    "${termPalate.red}",
    "${termPalate.green}",
    "${termPalate.yellow}",
    "${termPalate.blue}",
    "${termPalate.magenta}",
    "${termPalate.cyan}",
    "${termPalate.white}",
    "${termPalate.brightBlack}",
    "${termPalate.brightRed}",
    "${termPalate.brightGreen}",
    "${termPalate.brightYellow}",
    "${termPalate.brightBlue}",
    "${termPalate.brightMagenta}",
    "${termPalate.brightCyan}",
    "${termPalate.brightWhite}"
  ],
  "foreground": "${termPalate.foreground}",
  "background": "${termPalate.background}"
}`;
	return config;
}

function rxvt(termPalate) {
	let config = `! special
*.foreground:   ${termPalate.foreground}
*.background:   ${termPalate.background}
*.cursorColor:  ${termPalate.cursorColor}

! black
*.color0:       ${termPalate.black}
*.color8:       ${termPalate.brightBlack}

! red
*.color1:       ${termPalate.red}
*.color9:       ${termPalate.brightRed}

! green
*.color2:       ${termPalate.green}
*.color10:      ${termPalate.brightGreen}

! yellow
*.color3:       ${termPalate.yellow}
*.color11:      ${termPalate.brightYellow}

! blue
*.color4:       ${termPalate.blue}
*.color12:      ${termPalate.brightBlue}

! magenta
*.color5:       ${termPalate.magenta}
*.color13:      ${termPalate.brightMagenta}

! cyan
*.color6:       ${termPalate.cyan}
*.color14:      ${termPalate.brightCyan}

! white
*.color7:       ${termPalate.white}
*.color15:      ${termPalate.brightWhite}`;
	return config;
}

function genConfig(term, termPalate) {
	switch (term) {
		case 'rxvt':
			return rxvt(termPalate);
		case 'alacritty':
			return alacritty(termPalate);
		case 'json':
			return jsonSchema(termPalate);
		default:
			return "config can't be generated for this terminal. please help to fix this, gimme config templates";
	}
}

export default genConfig;
