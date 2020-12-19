/**地图生成 */
class MapManager {
	private static mapRoot: egret.DisplayObjectContainer;
	//地图当前坐标
	private static get mapPosX(): number {
		return this.mapRoot.x;
	};
	private static set mapPosX(value: number) {
		GameLayer.Instance.MoveLayerX(value);
	};
	private static get mapPosY(): number {
		return this.mapRoot.y;
	};
	private static set mapPosY(value: number) {
		GameLayer.Instance.MoveLayerY(value);
	};

	public static SceneWidth: number = 0;
	public static SceneHeight: number = 0;

	public static RegistSceneLayer(sceneLayer: egret.DisplayObjectContainer) {
		sceneLayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.TouchSceneBegin, this);
		sceneLayer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.TouchSceneMove, this);
		sceneLayer.addEventListener(egret.TouchEvent.TOUCH_END, this.TouchSceneEnd, this);
		this.mapRoot = sceneLayer;
		this.SceneWidth = sceneLayer.stage.stageWidth;
		this.SceneHeight = sceneLayer.stage.stageHeight;
		console.log(this.SceneWidth, this.SceneHeight)
	}

	private static bTouchMove: boolean = false;

	private static moveStartX: number;
	private static moveStartY: number;

	private static touchStartX: number;
	private static touchStartY: number;

	private static moveSpeed: number = 100;

	private static mapWidth: number;
	private static mapHeight: number;

	private static TouchSceneBegin(eve: egret.TouchEvent) {
		this.touchStartX = eve.stageX;
		this.touchStartY = eve.stageY;
		this.moveStartX = this.mapPosX;
		this.moveStartY = this.mapPosY;
	}


	private static moveTween: TweenObj;
	private static TouchSceneMove(eve: egret.TouchEvent) {
		this.bTouchMove = true;

		var deltaX = eve.stageX - this.touchStartX;

		var deltaY = eve.stageY - this.touchStartY;

		var needMoveX = this.moveStartX + deltaX;
		var needMoveY = this.moveStartY + deltaY;

		var targetX = needMoveX > 0 ? 0 : (needMoveX < -this.mapWidth + this.SceneWidth) ? -this.mapWidth + this.SceneWidth : needMoveX;
		var targetY = needMoveY > 0 ? 0 : (needMoveY < -this.mapHeight + this.SceneHeight) ? -this.mapHeight + this.SceneHeight : needMoveY;

		if (this.moveTween == null) {
			this.moveTween = TweenUtils.TweenTo(this, { mapPosX: targetX, mapPosY: targetY }, this.moveSpeed);
		} else {
			this.moveTween.UpdateTargetValue({ mapPosX: targetX, mapPosY: targetY });
		}
	}

	private static TouchSceneEnd(eve: egret.TouchEvent) {
		this.bTouchMove = false;
	}

	////////////////////////////////////////////////////////////////////////////////////////
	private static readonly scale = 32;

	private static ctx: egret.Graphics;

	public static createMap(width: number, height: number, seed?: number) {
		this.mapWidth = width * this.scale;
		this.mapHeight = height * this.scale;
		MapDataGenerator.CreateMap(width, height, this.scale, seed);
	}
}