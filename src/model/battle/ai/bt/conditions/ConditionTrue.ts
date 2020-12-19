/**
 * 永真
 */
class ConditionTrue extends BehaviorConditionNode {
	public execute(owner: GameObject) {
		super.execute(owner);
		return true;
	}
}