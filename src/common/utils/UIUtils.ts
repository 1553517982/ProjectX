class UIUtils {
	//添加点击事件
	public	static	AddClick(control:any,callback:Function,thisObj:any) {
		control.addEventListener(egret.TouchEvent.TOUCH_TAP,callback,thisObj);
	}
}