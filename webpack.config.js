const path = require('path');

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'joyzl-eno.js',
		library: {
			name: 'eno',
			type: 'umd'
		},
		clean: true
	}
};