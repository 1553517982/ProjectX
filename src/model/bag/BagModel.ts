//背包模块
class BagModel extends Model {
	/**背包容量 */
	public capacity: number;
	/**背包当前物品数量 */
	public curcapacity: number;
	/**道具列表 */
	private itemList: Array<Item>;
	/**道具id索引映射表 */
	private Id2Index: any;
	/**道具数量映射表 */
	private Id2Count: any;
	public get DBName(){
		return "BagDB";
	}

	public constructor(roleId: string) {
		super(roleId);
	}

	/**添加道具  */
	public AddItem(itemid: number, count: number): boolean {
		var index = this.Id2Index[itemid];
		if (index == null) {
			//需要判断背包容量
			var remain = (this.capacity - this.curcapacity)
			if (remain <= 0) {
				return false;
			} else {
				var newitem = new Item({ itemId: itemid, count: count ,level:1});
				var idx = this.itemList.length
				this.itemList.push(newitem);
				this.Id2Index[itemid] = idx;
				this.Id2Count[itemid] = count;
				this.curcapacity++;
				EventManager.FireEvent(EventDefine.ADD_NEWITEM, index, newitem);
			}
		} else {
			var newCount = this.Id2Count[itemid] + count;
			this.Id2Count[itemid] = newCount;
			this.itemList[index].count = newCount;
			EventManager.FireEvent(EventDefine.UPDATE_ITEMCOUNT, index, newCount);
		}
		return true;
	}
	/**扣除道具 */
	public CostItem(itemid: number, count: number): boolean {
		var index = this.Id2Index[itemid];
		if (index == null) {
			console.log("item not exist:" + itemid);
			return false;
		}
		var restCount = this.Id2Count[itemid];
		if (restCount >= count) {
			if (restCount > count) {
				var newCount = restCount - count;
				this.Id2Count[itemid] = newCount;
				this.itemList[index].count = newCount;
				EventManager.FireEvent(EventDefine.UPDATE_ITEMCOUNT, index, newCount);
			} else {
				this.RemoveItem(itemid);
			}
			return true;
		} else {
			console.log("item not enough:" + itemid);
			return false;
		}
	}
	/**删除道具 */
	public RemoveItem(itemid: number) {
		var index = this.Id2Index[itemid];
		if (index == null) {
			console.log("item not exist:" + itemid);
			return;
		}
		this.Id2Index[itemid] = null;
		this.Id2Count[itemid] = 0;
		this.itemList[index].count = 0;
		this.itemList[index].itemId = 0;
		this.itemList[index].level = 0;
		
		this.curcapacity--;
		EventManager.FireEvent(EventDefine.REMOVEBAGITEM, index);
	}
	/**获取剩余数量 */
	public GetItemCount(itemid: number) {
		return this.Id2Count[itemid] || 0
	}
	//初始化
	public Init(dataStr: string) {
		this.itemList = new Array<Item>();
		this.Id2Index = {};
		this.Id2Count = {};
		this.capacity = Global.BagCapacity;
		if (dataStr != "" && dataStr != null) {
			var data = JSON.parse(dataStr);
			var bag = data.bagdata;
			this.curcapacity = 0;
			for (var i in bag) {
				var item = new Item(bag[i]);
				this.itemList.push(item);
				this.Id2Index[item.itemId] = i;
				this.Id2Count[item.itemId] = item.count;
				this.curcapacity++;
			}
		}
	}
	//清理
	public Clear() {
		this.itemList.length = 0;
		this.Id2Index = {};
		this.Id2Count = {};
	}
	//存储
	public GetSaveContent() {
		var data = {
			bagdata: [],
			capacity: this.capacity
		}
		for(var i = 0;i<this.itemList.length;i++){
			data.bagdata.push({itemId:this.itemList[i].itemId,count:this.itemList[i].count})
		}
		return JSON.stringify(data);
	}
}