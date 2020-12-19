class GameLayer {
	/**最底层场景 */
	public sceneLayer: egret.DisplayObjectContainer;
	/**场景特效层 */
	public sceneEffectLayer: egret.DisplayObjectContainer;
	/**对象层场景 */
	public gameObjLayer: egret.DisplayObjectContainer;
	/**特效层场景 */
	public effectLayer: egret.DisplayObjectContainer;

	/**主界面层级 */
	public mainLayer: egret.DisplayObjectContainer;
	/**UI层级 */
	public uiLayer: egret.DisplayObjectContainer;
	/**提示框 */
	public tipsLayer: egret.DisplayObjectContainer;

	private static _instance: GameLayer;
	public static get Instance() {
		if (!this._instance) {
			this._instance = new GameLayer();
		}
		return this._instance;
	}

	public constructor() {
		this.sceneLayer = new egret.DisplayObjectContainer();

		this.sceneEffectLayer = new egret.DisplayObjectContainer();

		this.gameObjLayer = new egret.DisplayObjectContainer();

		this.effectLayer = new egret.DisplayObjectContainer();

		this.mainLayer = new egret.DisplayObjectContainer();

		this.uiLayer = new egret.DisplayObjectContainer();

		this.tipsLayer = new egret.DisplayObjectContainer();
	}

	public initStage(stage: egret.Stage) {

		stage.addChild(this.sceneLayer);
		stage.addChild(this.sceneEffectLayer);
		stage.addChild(this.gameObjLayer);
		stage.addChild(this.effectLayer);
		stage.addChild(this.mainLayer);
		stage.addChild(this.uiLayer);
		stage.addChild(this.tipsLayer);

		this.uiLayer.touchEnabled = true;
		this.uiLayer.touchChildren = true;
		this.sceneLayer.touchEnabled = true;
		this.sceneLayer.touchChildren = true;
		MapManager.RegistSceneLayer(this.sceneLayer);
	}

	public MoveLayerX(x: number) {
		this.sceneLayer.x = x;
		this.gameObjLayer.x = x;
		this.sceneEffectLayer.x = x;
		this.effectLayer.x = x;
	}

	public MoveLayerY(y: number) {
		this.sceneLayer.y = y;
		this.gameObjLayer.y = y;
		this.sceneEffectLayer.y = y;
		this.effectLayer.y = y;
	}
}