

abstract class GameObject {
	/**id生产器 */
	public static generatorCurIndex: number = 1;
	public static GeneratId(): number {
		return GameObject.generatorCurIndex++;
	}
	/**游戏内对象唯一id */
	private _generateObjId: number;
	public get uuid(): number {
		return this._generateObjId;
	}
	public constructor() {
		this._generateObjId = GameObject.GeneratId();
		this.eventList = {};
	}

	private eventList: any;
	/**封装事件绑定 */
	public BindEvent(eventId: string, callback: Function) {
		this.eventList[eventId] = true;
		EventManager.BindEvent(eventId, callback, this);
	}
	/**封装事件解绑 */
	public UnBindEvent(eventId: string) {
		EventManager.UnBindEvent(eventId, this);
		delete this.eventList[eventId];
	}

	/**解绑所有监听 */
	public UnBindAllEvents() {
		for (var k in this.eventList) {
			EventManager.UnBindEvent(k, this);
		}
		this.eventList = {}
	}

	public OnTick(dt: number) { };

	public Destroy(){}
}