var environments = {};

// Dev environment
environments.dev = {
  'httpPORT': 8050,
  'envName': 'development'
};

environments.production = {
  'httpPORT': 8090,
  'envName': 'production'
};

var currEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';
console.log(process.env.NODE_ENV)
// Export the environment
var environmentToExport = typeof (environments[currEnvironment]) == 'object' ? environments[currEnvironment] : environments.dev;

// Export environments module
export default environmentToExport;