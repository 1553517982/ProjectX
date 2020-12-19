class GameConfig {
	private static loadedConfig: any = {}
	//加载配置
	public static GetConfig(configName: string): any {
		if (this.loadedConfig[configName] != null) return this.loadedConfig[configName];
		var config = RES.getRes(configName);
		this.loadedConfig[configName] = config;
		return config;
	}
}