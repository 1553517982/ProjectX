class ActionSearchTarget extends BehaviorActionNode {

	public execute(owner: GameObject) {
		super.execute(owner);
		var fighter = owner as Entity;
		fighter.searchTarget();
		return true;
	}
}