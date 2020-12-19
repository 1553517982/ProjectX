class MapEffect extends GameObject {
	/**序列帧名称 */
	private frameName: string;
	/**当前帧 */
	private currentFrame: number;
	/**显示帧 */
	private texture: eui.Image;
	/**累计时间 */
	private frametime: number;
	/**动画速度 */
	private speed: number;
	/**总帧数 */
	private frameCount: number;

	//动画名称  播放速度
	public constructor(name: string, frameCount: number, speed?: number) {
		super()
		this.frameName = name + "_";
		this.currentFrame = 0;
		this.frametime = 0;
		this.frameCount = frameCount;
		this.speed = speed || 50;
		this.texture = new eui.Image();
		this.texture.source = this.getFrameSource();
		GameLayer.Instance.effectLayer.addChild(this.texture);
	}

	private getFrameSource(): string {
		return "mapeffect_json." + this.frameName + this.currentFrame + "_png";
	}

	public OnTick(dt: number) {
		this.frametime += dt;
		if (this.frametime >= this.speed) {
			var preFrame = this.currentFrame;
			this.currentFrame++;
			if (this.currentFrame == this.frameCount) {
				this.currentFrame = 0;
			}
			if (this.currentFrame != preFrame) {
				this.texture.source = this.getFrameSource();
			}
			this.frametime = 0;
		}
		super.OnTick(dt);
	}

	public Destroy() {
		GameLayer.Instance.effectLayer.removeChild(this.texture);
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
}