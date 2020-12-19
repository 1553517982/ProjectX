class NormalAttack extends Skill {
	public constructor() {
		super(0);
	}

	public OnSpell() {
		//动作 todo
		super.OnSpell();
	}

	public OnAfter() {
		//解除硬直
	}

	public pickTargets(castle: Entity): Entity[] {
		var ret = []
		var target = Global.EntityModel.getEntity(castle.targetId);
		if (target) {
			ret.push(target);
		}
		return ret;
	}
}