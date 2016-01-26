/* eslint key-spacing:0 */
export default (/* config */) => ({
  compilerFailOnWarning : false,
  compilerHashType      : 'chunkhash',
  compilerSourceMaps    : false,
  compilerDevTool       : null,
  compilerStats         : {
    chunks : true,
    chunkModules : true,
    colors : true,
  },
});
