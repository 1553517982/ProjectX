class App {
	public static Player:Player
	public static async Run(){
		if(egret.RuntimeType.WXGAME == egret.Capabilities.runtimeType){
			let wxApi = wx as any;
			let button = wxApi.createUserInfoButton({
			type: 'text',
			text: '获取用户信息',
			style: {
				left: 10,
				top: 76,
				width: 200,
				height: 40,
				lineHeight: 40,
				backgroundColor: '#ff0000',
				color: '#ffffff',
				textAlign: 'center',
				fontSize: 16,
				borderRadius: 4
			}
			})
			button.onTap((res) => {
				this.Start();
			})
		}else{
			this.Start();
		}
	}

	public static async Start(){
		await platform.login();
        const userInfo = await platform.getUserInfo();
		this.Player = new Player(userInfo.nickName);
		this.Player.StartGame();
	}
}