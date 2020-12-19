class ViewAdapter extends eui.Component{
	/**加载完回调 */
	private completeCb:Function;
	/**皮肤名称 */
	 constructor(skinName:string ,completeCallback:Function) {
        super();
        this.skinName = skinName;
        this.completeCb = completeCallback;
    }
    protected createChildren() {
        super.createChildren();
        if(this.completeCb)
			this.completeCb(this);
    }
}