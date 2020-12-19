/** 道具基类*/
class Item extends GameObject {
	/**道具id */
	public itemId: number;
	/**道具数量 */
	public count: number;
	/**等级 */
	public level: number;

	public constructor(data: any) {
		super();
		this.itemId = data.itemId;
		this.count = data.count || 1;
		this.level = data.level || 0;
	}
}