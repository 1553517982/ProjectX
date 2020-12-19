class Player extends Component {
	/**user id */
	public accountId: string;

	private gamelogicModel: GameLogic;

	private sceneModel: SceneModel;

	private bagModel: BagModel;

	private cardModel: CardModel;

	public Battle: Battle;

	public constructor(accountId: string) {
		super()
		//构造角色数据
		this.accountId = accountId;
		//角色基础数据
		this.AddModel(new RoleInfoModel(this.accountId));
		//背包数据
		this.bagModel = this.AddModel(new BagModel(this.accountId)) as BagModel;
		//卡牌数据
		this.cardModel = this.AddModel(new CardModel(this.accountId)) as CardModel;
		//场景模块
		this.sceneModel = this.AddModel(new SceneModel(this.accountId)) as SceneModel;
		//全局逻辑模块
		this.gamelogicModel = this.AddModel(new GameLogic(this.accountId)) as GameLogic;

		this.AddEvents();
	}

	/**开始游戏 */
	public StartGame() {
		//全局逻辑启动
		this.gamelogicModel.Start();
		//进入场景
		this.sceneModel.EnterScene(1);
	}
	//绑定事件
	private AddEvents() {
		this.BindEvent(EventDefine.CHENGE_SCENE, (params: number[]) => {
			this.OnChangeScene(params[0], params[1]);
		});
	}

	/*********************************************** */
	private OnChangeScene(oldScene: number, newScene: number) {
		//回到主城
		if (newScene == 0) {

		}
		//进入战斗
		else {
			if (Global.Battle == null)
				Global.Battle = new Battle();
			else
				Global.Battle.Clear();
			Global.Battle.Start(newScene);
		}
	}
}