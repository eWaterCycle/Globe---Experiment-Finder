/* SystemJS module definition */
declare var module: NodeModule;
declare var Cesium;

declare module "*.json" {
  const value: any;
  export default value;
}

interface NodeModule {
  id: string;
}
