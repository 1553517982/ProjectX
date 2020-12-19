class GameLogic extends Model {
	/**最后在线时间 */
	private lastOnLineTime: number;
	/**定时器 */
	private logicTimer: egret.Timer;

	public get DBName() {
		return "GameLogicDB";
	}

	private StartTimer() {
		if (this.logicTimer == null) {
			this.logicTimer = new egret.Timer(1000);
			this.logicTimer.addEventListener(egret.TimerEvent.TIMER, this.logicUpdate, this);
		}
		this.logicTimer.start();
	}
	/**逻辑循环 */
	private logicUpdate() {
		//更新离线时间
		this.lastOnLineTime = Time.now();
		this.Save()
	}

	//全局逻辑  固定时间间隔增加经验
	public Start() {
		//结算离线奖励
		this.CacOfflineReward();
		//启动逻辑定时器
		this.StartTimer()
		//根据通关关卡 定时增加经验、金币
	}

	/**计算离线奖励 */
	private CacOfflineReward() {

	}

	public Clear() {

	}

	public GetSaveContent() {
		var content = "{\"offlineTime\":" + this.lastOnLineTime + "}"
		return content;
	}

	public Init(dataStr) {
		if (this.Validate(dataStr)) {
			var content = JSON.parse(dataStr);
			var preOfflineTime = content.offlineTime;
			var now = Time.now();
		}
	}
}