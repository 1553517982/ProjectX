class Buff extends GameObject {
	/**id */
	private buffId: number;
	/**buff持续时间 */
	private duration: number;
	/**buff创建时间 */
	private createtime: number;
	/**增益系数 正数加属性 附属减属性*/
	private symbol: number;
	/**属性类型 */
	private property: number;
	/**增益值 */
	private value: number;
	/**生效间隔 */
	private step: number

	public constructor(data: any) {
		super();
		for (var k in data) {
			this[k] = data[k];
		}
	}
}