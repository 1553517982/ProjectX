class Component extends GameObject{

	/**模块集合 */
	private Models: any;

	public constructor() {
		super()
		this.Models = {}
	}

	/**添加模块 */
	public AddModel(model: Model):Model {
		this.Models[model.name] = model;
		return model;
	}

	/**移除模块 */
	public RemoveModel(model:Model){
		model.Clear();
		delete this.Models[typeof(model)];
	}

	/**保存 */
	public Save(){
		for(var k in this.Models){
			this.Models[k].Save();
		}
	}
}