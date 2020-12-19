/**装备生成 */
class EquipMaker {

	/**武器基础属性 */
	private static readonly weapon: any = {
		/**攻击 */
		a: 3
	}
	/**护甲基础属性 */
	private static readonly armor: any = {
		/**防御 */
		d: 3,
		/**血量 */
		h: 10
	}
	/**护膝基础属性 */
	private static readonly kneelet: any = {
		/**血量 */
		h: 10
	}
	/**鞋子基础属性 */
	private static readonly shoes: any = {
		/**移速 */
		s: 10
	}

	/**装备部位 1-武器  2-护甲  3-护膝  4-鞋子 */
	/** 装备部位  等级 品质 极品系数*/
	public static GenerateEquip(type: number, level: number, quality: number, rate: number) {
		var pro = {}
		var temp = { a: 0, d: 0, h: 0, s: 0 }
		var final = (1 + level * rate + quality * 0.1);
		switch (type) {
			case 1:
				temp = this.weapon;
				break;
			case 2:
				temp = this.armor;
				break;
			case 3:
				temp = this.kneelet;
			case 4:
				temp = this.shoes;
				break;
		}
		return { a: temp.a * final, d: temp.d * final, h: temp.h * final, s: temp.s * final };
	}

	/**根据id 序列化装备对象  默认规则   部位_等级_品质_极品系数*/
	public static DeSerializeEquip(equipId: string) {
		var parts = equipId.split('_');
		if (parts.length != 4) {
			return null;
		}
		return this.GenerateEquip(Number(parts[0]), Number(parts[1]), Number(parts[2]), Number(parts[3]))
	}

}