class EventManager {
	/**注册回调监听 */
	private static callbacks: any = {}
	/**事件绑定 */
	public static BindEvent(eventId: string, callback: Function, self: GameObject) {
		if (!this.callbacks[eventId]) {
			this.callbacks[eventId] = {}
		}
		var eventobjid = eventId + self.uuid;
		this.callbacks[eventId][eventobjid] = { func: callback, obj: self };
	}
	/**事件派发 */
	public static FireEvent(eventId: string, ...params: any[]) {
		if (!this.callbacks[eventId]) return;
		var callbackFuncs = this.callbacks[eventId];
		for (var id in callbackFuncs) {
			callbackFuncs[id].func.call(callbackFuncs[id].obj, params)
		}
	}
	/**事件解绑 */
	public static UnBindEvent(eventId, self: GameObject) {
		if (!this.callbacks[eventId]) return;
		var eventobjid = eventId + self.uuid;
		delete this.callbacks[eventId][eventobjid]
	}
}