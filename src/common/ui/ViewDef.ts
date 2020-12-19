/**界面枚举 */
enum ViewId{
	/**登陆 */
	LOGIN=1,
	/**创角 */
	CreateNewRole,
	/**主界面 */
	MAIN,
	/** */

}

/**界面配置 */
const ViewDef = {
	[ViewId.LOGIN]:{viewName:"LoginView",skin:"resource/skins/LoginViewSkin.exml",autodestroy:false},
	[ViewId.CreateNewRole]:{viewName:"CreateNewRoleView",skin:"resource/skins/CreateNewRoleViewSkin.exml",autodestroy:true},
	[ViewId.MAIN]:{viewName:"MainView",skin:"resource/skins/MainViewSkin.exml",autodestroy:false}
}