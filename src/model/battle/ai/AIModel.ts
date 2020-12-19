class AIManager {
	private static behaviorList: any = {}

	public static GetAI(name: string): BehaviorTree {
		if (this.behaviorList[name] == null) {
			var config = RES.getRes(name+"_json");
			this.behaviorList[name] = new BehaviorTree(config);
		}
		return this.behaviorList[name];
	}
}