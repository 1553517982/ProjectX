class UIManager {
	/**已经打开的界面列表 */
	private static opendViewList: any = {};
	/**已经创建的界面列表 */
	private static cachedViewList: any = {};

	public constructor() {
	}

	public static ShowUI(viewId: ViewId,callback?:Function) {
		if(this.opendViewList[viewId]){
			console.warn("view is opened already");
			return;
		}
		if (this.cachedViewList[viewId]){
			var view = this.cachedViewList[viewId];
			this.opendViewList[viewId] = view;
			view.Show();
			if(callback)
				callback(view);
		}else{
			var viewCfg = ViewDef[viewId];
			if (!viewCfg) {
				console.error("viewdef is undefined to  " + viewId);
				return;
			}
			var viewClass = egret.getDefinitionByName(viewCfg.viewName);
			if(viewClass!=null){
				var newview = new viewClass(viewId,callback);
				this.opendViewList[viewId] = newview;
				GameLayer.Instance.uiLayer.addChild(newview.root);
			}else{
				console.error("viewclass is undefined :" + viewCfg.viewName);
			}
		}
	}

	public static HideUI(viewId:ViewId){
		var view =this.opendViewList[viewId] as BaseUI;
		if(view){
			var viewCfg = ViewDef[viewId];
			if(viewCfg.autodestroy){
				view.Hide();
				GameLayer.Instance.uiLayer.removeChild(view.root);
				delete this.cachedViewList[viewId];
			}else{
				view.Hide();
				view.visible = false;
			}
			delete this.opendViewList[viewId];
		}
	}
}