class ModelEffect extends GameObject {
	/**序列帧名称 */
	private frameName: string;
	/**显示帧 */
	private texture: eui.Image;

	//动画名称  播放速度
	public constructor(name: string) {
		super()
		this.texture = new eui.Image();
		this.setModel(name);
		GameLayer.Instance.gameObjLayer.addChild(this.texture);
	}

	public setModel(name: string) {
		this.frameName = "roles_json."+name;
		this.texture.source = this.frameName;
	}

	public Destroy() {
		GameLayer.Instance.gameObjLayer.removeChild(this.texture);
		this.texture = null;
	}
	public get x() {
		return this.texture.x;
	}
	public set x(value) {
		this.texture.x = value;
	}
	public get y() {
		return this.texture.y;
	}
	public set y(value) {
		this.texture.y = value;
	}
	public get rotation() {
		return this.texture.rotation;
	}
	public set rotation(value) {
		this.texture.rotation = value;
	}
	public get anchorOffsetY(): number {
		return this.texture.anchorOffsetY;
	}
	public set anchorOffsetY(v: number) {
		this.texture.anchorOffsetY = v;
	}

	public get anchorOffsetX(): number {
		return this.texture.anchorOffsetX;
	}
	public set anchorOffsetX(v: number) {
		this.texture.anchorOffsetX = v;
	}

}