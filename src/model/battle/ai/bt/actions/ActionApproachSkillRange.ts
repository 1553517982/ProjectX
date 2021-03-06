class ActionApproachSkillRange  extends BehaviorActionNode {
	private skillid: number;
	private constructor(p, log?: string) {
		super(p, log);
		this.skillid = Number(p[0]);
	}

	public execute(owner: GameObject) {
		super.execute(owner);
		var fighter = owner as Entity;
		fighter.approachToSkillRange(this.skillid);
		return true;
	}
}