/**设计一套基础属性成长机制  规避配置表 */
class PropertyMaker {

	private static readonly hero: any = {
		/**攻击 */
		a: 10,
		/**防御 */
		d: 6,
		/**血量 */
		h: 30,
		/**移速 */
		s: 1
	}

	private static readonly monster: any = {
		/**攻击 */
		a: 10,
		/**防御 */
		d: 3,
		/**血量 */
		h: 20,
		/**移速 */
		s: 1
	}

	private static readonly boss: any = {
		/**攻击 */
		a: 12,
		/**防御 */
		d: 6,
		/**血量 */
		h: 100,
		/**移速 */
		s: 1.5
	}

	/** 类型  等级 难度系数*/
	public static GenerateProperty(type: number, level: number, rate: number) {
		var pro = {}
		var temp = { a: 1, d: 1, h: 1, s: 2 }
		var final = (1 + level * rate);
		switch (type) {
			case 0:
				temp = this.hero;
				break;
			case 1:
				temp = this.monster;
				break;
			case 2:
				temp = this.boss;
				break;
		}
		return { a: temp.a * final, d: temp.d * final, h: temp.h * final, s: temp.s }
	}
}