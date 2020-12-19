class EventDefine {
	public static EventNone = "EVENTNONE";
	/////////////////////背包相关///////////////////////
	/**移除背包道具 
	 * @param index 下标
	 */
	public static REMOVEBAGITEM = "REMOVEBAGITEM";
	/**更新背包道具数量
	 * @param index 下标
	 * @param count 最新数量
	 */
	public static UPDATE_ITEMCOUNT = "UPDATE_ITEMCOUNT";
	/** 背包添加新道具
	 * @param index 下标
	 * @param item  道具对象
	*/
	public static ADD_NEWITEM = "ADD_NEWITEM";

	/////////////////////装备相关//////////////////////////
	/**穿装备 */
	public static PUTON_EQUIP = "PUTON_EQUIP";
	/**脱装备 */
	public static PUTOFF_EQUIP = "PUTOFF_EQUIP";
	/**替换装备 */
	public static REPLACE_EQUIP = "REPLACE_EQUIP";
	/////////////////////场景相关///////////////////////////
	/**切换场景 */
	public static CHENGE_SCENE = "CHANGE_SCENE";

}