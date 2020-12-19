class RoleInfoModel extends Model {
	/**等级 */
	public level: number;
	/**名字 */
	public name: string;
	/**职业 */
	public profession: string;
	/**经验 */
	public exp: number;

	public get DBName() {
		return "RoleInfoDB";
	}

	public constructor(roleId: string) {
		super(roleId);
	}

	public Init(dataStr: string) {
		if (dataStr != "" && dataStr != null) {
			var data = JSON.parse(dataStr);
			this.name = data.name || ""
			this.level = data.level || 1;
			this.exp = data.exp || 0;
			this.profession = data.profession;
		}
	}
	//清理
	public Clear() {
		
	}
	//存储
	public GetSaveContent() {
		var data = {
			name: this.name,
			level: this.level,
			profession: this.profession
		}
		return JSON.stringify(data);
	}
}