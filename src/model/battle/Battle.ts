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

	public GameOver(){
		let vertexSrc =
            "attribute vec2 aVertexPosition;\n" +
            "attribute vec2 aTextureCoord;\n" +
            "attribute vec2 aColor;\n" +

            "uniform vec2 projectionVector;\n" +
            "varying vec2 vPos;\n" +
            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +

            "const vec2 center = vec2(-1.0, 1.0);\n" +

            "void main(void) {\n" +
            "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n" +
            "   vTextureCoord = aTextureCoord;\n" +
            "   vPos = vec2(gl_Position.xy);\n" +
            "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
            "}";

        let fragmentSrc4 = [
            "precision lowp float;",
            "varying vec2 vTextureCoord;",
            "varying vec2 vPos;",
            "varying vec4 vColor;",
            "uniform sampler2D uSampler;",
            "void main(void) {",
			    "gl_FragColor = vec4(0,0,0,0);//texture2D(uSampler, vTextureCoord);",
			"}"
        ].join("\n");
		var filter = new egret.CustomFilter(vertexSrc,fragmentSrc4);
		GameLayer.Instance.sceneLayer.filters = [filter]
	}
}