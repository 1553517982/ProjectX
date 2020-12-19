class SkillConfig {
	/**
	 * type 1-普通攻击 2-朝向技能  3-冲刺技能 4-环绕技能  5-瞬移 6-跳跃坠击
	 */
	public type: number;
	/**cd */
	public cd: number;
	/***范围类型  0-对点  1-矩形 2-扇形 3-圆形*/
	public rangeType:number;
	/**范围  环绕 半径*/
	public range: number;
	/**伤害系数 */
	public rate: number;
	/**前摇 */
	public pre: number;
	/**持续时间 */
	public continue: number;
	/**后摇 */
	public after: number;
	/**附加参数 */
	public param: any[];


}

const SkillConfigList = [
	//skill 1 普通攻击
	{ type: 1,rangeType:0, range: 32, cd: 1000, rate: 100, pre: 800, continue: 0, after: 0, param: [] },
	//skill 2 朝向技能
	{ type: 2,rangeType:1, range: 64, cd: 1000, rate: 100, pre: 1000, continue: 0, after: 0, param: [] },
	//skill 3 冲刺技能
	{ type: 3,rangeType:1, range: 160, cd: 1000, rate: 100, pre: 1000, continue: 1000, after: 0, param: [] },
	//skill 4 环绕技能
	{ type: 4, rangeType:3,range: 96, cd: 1000, rate: 100, pre: 100, continue: 5000, after: 0, param: [] },
	//skill 5 瞬移技能
	{ type: 5,rangeType:0, range: 96, cd: 1000, rate: 100, pre: 100, continue: 0, after: 0, param: [] },
	//skill 6 跳跃坠击技能
	{ type: 6,rangeType:0, range: 160, cd: 1000, rate: 100, pre: 100, continue: 0, after: 0, param: [] }

]