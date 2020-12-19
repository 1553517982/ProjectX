class ConditionWithoutTarget extends BehaviorConditionNode {
	public execute(owner: GameObject) {
		super.execute(owner);
		var fighter = owner as Entity;
		return fighter.withoutTarget();
	}
}