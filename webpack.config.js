const webpack = require('webpack');

module.exports = {
	entry:{
		app:'./src/index.jsx',
		vendor:['react','react-dom','whatwg-fetch'],
	},
	output:{
		path: __dirname +'/static',
		filename:'index.bundle.js',
	},
	devServer:{
	    port: 8000,
	    contentBase: 'static',
	    proxy: 
	    {
		      '/api/*': {
		        target: 'http://localhost:8080'
		      }
		}
  	},
	plugins:[new webpack.optimize.CommonsChunkPlugin({name:'vendor',filename:'vendor.bundle.js'})],
	module:{
		loaders:[
		{
			test:/\.jsx$/,
			loader:'babel-loader',
			query:{
				presets:['react','es2015'],
			}
		},
		]
	}
}