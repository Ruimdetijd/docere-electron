module.exports = {
	entry: './src/renderer/index.tsx',
	output: {
			filename: 'bundle.js',
			chunkFilename: '[name].bundle.js',
			path: __dirname + '/build/renderer',
			publicPath: process.cwd() + '/build/renderer/',
	},
	mode: 'development',
	module: {
		rules: [
				// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
				}
		]
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
	},
	target: 'electron-renderer'
};
