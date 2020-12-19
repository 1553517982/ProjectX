abstract class BaseUI extends GameObject {
	/**UI容器 */
	private view:ViewAdapter;
	/**UI名称 */
	private viewName:string;
	/**打开界面回调 */
	private _callback_:Function;

	public constructor(viewId:ViewId,callback?:Function) {
		super();
		var viewCfg = ViewDef[viewId];
		this.viewName = viewCfg.viewName;
		this._callback_ = callback;
		this.view = new ViewAdapter(viewCfg.skin,this.onCreate.bind(this));
	}
	/**界面创建成功 */
	public onCreate(view:ViewAdapter){
		this.onInit(view);
		this.Show();
		if(this._callback_){
			this._callback_(this);
		}
	}

	/**子类不要重载此方法 */
	public Show(){
		//自动绑定事件
		this.onShow();
	}
	/**子类不要重载此方法 */
	public Hide(){
		//自动解绑事件
		this.UnBindAllEvents();
		this.onHide();
	}

	/**可见性 */
	public get visible():boolean{
		return this.view&&this.view.visible;
	}
	/**可见性 */
	public set visible(bvisible){
		if(this.view)
			this.view.visible=bvisible;
	}

	/** 初始化*/
	protected abstract onInit(view:ViewAdapter);
	/** 界面打开*/
	protected abstract onShow()
	/** 界面隐藏*/
	protected abstract onHide()

	public	get	root(){
		return this.view;
	}
}