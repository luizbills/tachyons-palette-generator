#!/usr/bin/env node
const command = process.argv[2];
const fs = require('fs');
const os = require('os');
const path = require('path');

const br = os.EOL;

if (command === '-P' || command === '--palette') {

	var paletteFilePath = process.argv[3];

	if (fs.existsSync(paletteFilePath)) {

		paletteFilePath = paletteFilePath[0] === '.' ? paletteFilePath : './' + paletteFilePath;
		const json = require(paletteFilePath);
		const colorList = [];
		let output = '';

		for(let color in json) {
			const name = color;
			const code = json[name];
			colorList.push([color, json[color]]);
		}

		output += `/* color */${br}`;

		// color
		colorList.forEach( (item) => output += `.${item[0]} { color: ${item[1]} }${br}` );

		// color (hover/focus)
		colorList.forEach( (item) => output += `.hover-${item[0]}:hover,${br}.hover-${item[0]}:focus { color: ${item[1]} }${br}` );

		output += `${br}/* background-color */${br}`;

		// background-color
		colorList.forEach( (item) => output += `.bg-${item[0]} { background-color: ${item[1]} }${br}` );

		// background-color (hover/focus)
		colorList.forEach( (item) => output += `.hover-bg-${item[0]}:hover,${br}.hover-bg-${item[0]}:focus { background-color: ${item[1]} }${br}` );

		output += `${br}/* border-color */${br}`;

		// border-color
		colorList.forEach( (item) => output += `.b--${item[0]} { border-color: ${item[1]} }${br}` );

		// write palette css file
		writeCSSFile(paletteFilePath, output, (filepath) => console.log("palette saved in " + filepath) );
	} else {
		throw new Error('Missing palette json file');
	}

} else {
	throw new Error('Missing argument --palette or -P');
}

function writeCSSFile (paletteFilePath, content, callback) {
	const paletteOutputPath = paletteFilePath.slice(0, -4) + 'css';
	fs.writeFile(paletteOutputPath, content, function(err) {
		if(err) {
			return console.log(err);
		}
		callback(paletteOutputPath);
	}); 
}