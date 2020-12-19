class Entity extends GameObject {
	public type: number;
	public level: number;
	private AI: BehaviorTree;


	public hp: number;
	public maxhp: number;
	public atk: number;
	public def: number;
	public speed: number;
	/**技能列表 */
	private skillList: any

	/**延时行为 */
	private delayFuncs: any;

	public constructor(type, level) {
		super()
		this.type = type;
		this.level = level;
		this.skillList = {}
		this.delayFuncs = {}
		var prop = PropertyMaker.GenerateProperty(type, level, 1);
		this.setProperty(prop);
	}

	public setProperty(propData: any) {
		this.hp = propData.h;
		this.maxhp = propData.h;
		this.def = propData.d;
		this.atk = propData.a;
		this.speed = propData.s;
	}

	private body: ModelEffect;

	public setModel(modelName: string) {
		if (this.body == null) {
			this.body = new ModelEffect(modelName);
		}
		this.body.anchorOffsetX = 16;
		this.body.anchorOffsetY = 16;
		this.body.setModel(modelName);
	}

	public get x(): number {
		if(this.body == null) return 0;
		return this.body.x;
	}
	public set x(v: number) {
		this.body.x = v;
	}

	public get y(): number {
		if(this.body == null) return 0;
		return this.body.y;
	}
	public set y(v: number) {
		this.body.y = v;
	}

	public get rotation(): number {
		return this.body.rotation;
	}
	public set rotation(v: number) {
		this.body.rotation = v;
	}


	public setAI(aiName: string) {
		this.AI = AIManager.GetAI(aiName);
	}

	public OnTick(dt) {
		super.OnTick(dt);
		if (this.AI) {
			this.AI.think(this);
		}
		for (var k in this.delayFuncs) {
			if(this.delayFuncs[k].excute()){
				this.delayFuncs[k] = null;
				delete this.delayFuncs[k];
			}
		}
	}
	///////////////////////////////////////////////////////////////
	/**施法 */
	public spell(skillId) {
		var skill = this.skillList[skillId] as Skill;
		if (skill.CanSpell()) {
			skill.OnSpell();
			//延时攻击 做预警
			if(skill.config.pre>0){
				var tx = this.x;
				var ty = this.y;
				if(skill.config.type == 1){
					var target = Global.EntityModel.getEntity(this.targetId);
					if(target != null){
						tx = target.x;
						ty = target.y
					} 
				}
				this.showSkillWarn(skill.config.rangeType,tx,ty, skill.config.range);
				if (this.delayFuncs["satk" + skillId]) {
					this.delayFuncs["satk" + skillId].reset(skill.config.pre);
				} else {
					this.delayFuncs["satk" + skillId] = new DelayFuncs(skill.config.pre, () => {
						this.attack(skillId);
						SkillWarn.RemoveWarn(this.uuid);
					});
				}
			}
		}
	}
	/**触发伤害 */
	public attack(skillId) {
		if(this.body==null) return;
		var skill = this.skillList[skillId] as Skill;
		var targets = skill.pickTargets(this);
		if(targets.length>0){
			this.faceToPos( targets[0].x, targets[0].y);
			for (var k in targets) {
				this.attackTarget(targets[k], skill);
			}
		}
	}

	/**攻击目标 */
	public attackTarget(target: Entity, skill: Skill) {
		var damage = Formula.CalcuLateDamage(this, target, skill);
		target.changeHp(damage);
	}

	public changeHp(delta: number) {
		this.hp -= delta;
		if (this.hp <= 0) {
			this.hp = 0;
			this.die();
		}
	}

	public die() {
		Global.EntityModel.RemoveEntity(this.uuid);
		if (this.type == 0) {
			console.log("主角死亡 游戏结束");
			Global.Battle.GameOver();
		}
	}

	public Destroy() {
		this.AI = null;
		this.body.Destroy();
		this.body = null;
		SkillWarn.RemoveWarn(this.uuid);
	}

	public learnSkill(skillId) {
		this.skillList[skillId] = SkillFactory.CreateSkill(skillId);
	}

	public showSkillWarn(rangeType:number,tx: number, ty: number, range: number) {
		SkillWarn.CreateWarn(this.uuid,rangeType, range, tx, ty, this.rotation);
	}


	/////////////////////////////////////////AI相关/////////////////////////////////////////
	public IsDie(): boolean {
		return this.hp <= 0;
	}

	public canSpell(skillId: number): boolean {
		var skill = this.skillList[skillId] as Skill;
		return skill && skill.CanSpell();
	}

	private _targetId: number = -1;
	public get targetId(): number {
		return this._targetId;
	}
	public set targetId(v: number) {
		this._targetId = v;
	}

	public withoutTarget(): boolean {
		var target = Global.EntityModel.getEntity(this.targetId);
		return target == null || target.IsDie();
	}

	public searchTarget() {
		this.targetId = Global.EntityModel.getNearestEnemy(this.x, this.y, this.type);
	}

	public targetInSkillRange(skillId: number): boolean {
		var target = Global.EntityModel.getEntity(this.targetId);
		var value = (this.x - target.x) * (this.x - target.x) + (this.y - target.y) * (this.y - target.y);
		var range = SkillConfigList[skillId].range;
		return value <= range * range;
	}

	public approachToSkillRange(skillId: number) {
		var target = Global.EntityModel.getEntity(this.targetId);
		if(Math.abs(this.x - target.x)>this.speed){
			var symbolx = (this.x - target.x) == 0 ? 0 : (this.x - target.x) > 0 ? -1 : 1;
			this.x = this.x + this.speed * symbolx;
		}else{
			this.x =  target.x;
		}
		this.faceToPos( target.x, target.y);
		if(Math.abs(this.y - target.y)>this.speed){
			var symboly = (this.y - target.y) == 0 ? 0 : (this.y - target.y) > 0 ? -1 : 1;
			this.y = this.y + this.speed * symboly;
		}else{
			this.y =  target.y;
		}
	}

	public faceToPos(x:number, y:number){
		// if (x == this.x) {
		// 	this.rotation = y > this.y ? 0 : 180;
		// } else {
		// 	this.rotation =90-(Math.atan((this.y - y )/( x - this.x))) * 180 / Math.PI;
		// }
	}
}