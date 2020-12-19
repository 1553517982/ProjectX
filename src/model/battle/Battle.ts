class Battle extends Component {
	//定时器
	private battleTimer: egret.Timer;
	//战斗持续时间
	public BattleTime: number;
	//战斗AI
	private AI: BehaviorTree;


	private deltaTime: number = 20;

	/**开始战斗 */
	public Start(battleId: number) {
		var roleId = App.Player.accountId;
		Global.EntityModel = new EntityModel(roleId);

		this.battleTimer = new egret.Timer(20);
		this.battleTimer.addEventListener(egret.TimerEvent.TIMER, this.onBattleUpdate, this);
		this.battleTimer.start();
		this.AI = AIManager.GetAI("battle");
		this.BattleTime = 0;

		Global.EntityModel.CreateMainPlayer(150, 150);

		Global.EntityModel.CreateMonster(0, 260, 210);

		Global.EntityModel.CreateMonster(1, 200, 350);
	}
	/**战斗帧循环 */
	private onBattleUpdate(e: egret.TimerEvent) {
		var dt = this.deltaTime;
		//先计算伤害
		BuffManager.Tick(dt);
		//子弹tick
		BulletManager.Tick(dt);
		//实体tick
		Global.EntityModel.Tick(dt);
		//特效tick
		MapEffectManager.Tick(dt);
		//触发刷怪 和 场景事件
		this.AI.think(this);
		this.BattleTime += dt;
	}

	/**战斗结束 */
	public Clear() {
		this.battleTimer.stop();
		Global.EntityModel.Clear();
		MapEffectManager.Clear()
		this.AI = null;
	}
}