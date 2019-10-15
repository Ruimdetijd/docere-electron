import { extendConfigData } from 'docere'

export default async function restoreState(configFilename: string = 'index.js'): Promise<AppState> {
	const storedState = localStorage.getItem('docere:electron:state')
	const state = (storedState == null) ? { configData: extendConfigData({}) } : JSON.parse(storedState)

	let path = Object.keys(require.cache).filter(k => k.search(/\/project\/index\.js$/) > -1)[0]
	if (path) delete require.cache[path]
	else path = `../../project/${configFilename}`
	// let cpath = Object.keys(require.cache).filter(k => k.search(/\/project\/(.*)\.js$/) > -1)
	let requiredConfigData
	try {
		// if (configFilename == null) configFilename = 'index.js'
		// console.log()
		// console.log('cpath', cpath, path)
		// if (cpath) delete require.cache[cpath]
		configFilename
		requiredConfigData = await import(path)
		// console.log(configFilename, requiredConfigData)
		// console.log(configFilename, 'RS', requiredConfigData.default.components.ner.__emotion_styles)
	}
	catch (err) {
		console.log(err)
	}

	if (requiredConfigData != null) state.configData = requiredConfigData.default

	return state
}
