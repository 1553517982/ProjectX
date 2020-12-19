abstract class Skill extends GameObject {
	public skillId: number;
	/**技能cd */
	public readonly cd: number;
	/**config */
	public readonly config: SkillConfig;

	public cooldown: number;

	public constructor(skillId: number) {
		super()
		this.skillId = skillId;
		this.config = SkillConfigList[skillId];
		this.cooldown = 0;
	}

	public CanSpell() {
		if (Global.Battle.BattleTime >= this.cooldown) {
			return true;
		}
		return false;
	}

	public OnSpell() {
		//显示预警
		this.cooldown = Global.Battle.BattleTime + this.config.cd;
	}

	public pickTargets(castle: Entity): Entity[] {
		return [];
	}

	public OnAfter() {

	}
}