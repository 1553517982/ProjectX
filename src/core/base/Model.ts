abstract class Model {
	//所有者id
	private uid: string;

	public get name() {
		return this.constructor.toString().match(/\w+/g)[1];
	}

	abstract get DBName(): string;
	constructor(roleId: string) {
		this.uid = roleId;
		this.Load();
	}

	//初始化
	abstract Init(data: string);
	//清理
	abstract Clear();
	//组装存储数据
	abstract GetSaveContent();
	//存储
	public Save() {
		var key = this.uid + this.DBName;
		var content = this.GetSaveContent() || "";
		DataBase.Save(key, content);
	}
	//加载
	public Load(): any {
		var key = this.uid + this.DBName;
		var data = DataBase.Load(key);
		this.Init(data);
	}

	public Validate(str: string): boolean {
		return str != undefined && str != null && str != ""
	}
	//模块战斗力
	public GetPower(): number { return 0; };
}