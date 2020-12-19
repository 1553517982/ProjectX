class ConditionInSkillRange extends BehaviorConditionNode {
	private skillId: number;

	public constructor(p, log?: string) {
		super(p, log)
		this.skillId = Number(p[0])
	}

	public execute(owner: GameObject) {
		super.execute(owner);
		var fighter = owner as Entity;
		return fighter.targetInSkillRange(this.skillId);
	}
}