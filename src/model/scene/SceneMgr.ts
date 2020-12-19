class SceneModel extends Model {
	/** 默认场景 主城0*/
	public CurrentSceneId: number = 0;

	public get DBName() {
		return "SceneModelDB"
	}

	public Init(dataStr) {
		if (this.Validate(dataStr)) {
			var conf = JSON.parse(dataStr);
			this.CurrentSceneId = conf.CurrentSceneId;
		}
	}

	public Clear() { }

	public GetSaveContent() {
		return "{ \"CurrentSceneId\":" + this.CurrentSceneId + "}";
	}

	public EnterLastScene() {
		this.EnterScene(this.CurrentSceneId)
	}

	public EnterScene(sceneId: number) {
		var oldScene = this.CurrentSceneId;
		if (sceneId != undefined) {
			this.CurrentSceneId = sceneId;
		}
		MapManager.createMap(36, 36, sceneId);
		EventManager.FireEvent(EventDefine.CHENGE_SCENE, oldScene, sceneId);
	}
}