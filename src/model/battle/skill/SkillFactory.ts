class SkillFactory {
	public static CreateSkill(skillid: number): Skill {
		var cfg = SkillConfigList[skillid];
		if (!cfg) {
			console.log("skill not exist: ", skillid);
			return null;
		}
		switch (cfg.type) {
			case 0:
				return new NormalAttack();
			default:
				return new NormalAttack();

		}
	}
}