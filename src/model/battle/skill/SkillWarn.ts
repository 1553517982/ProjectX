class SkillWarn {
	private static warnList: any = {}

	public static CreateWarn(uuid:number, type: number, range: number, x: number, y: number, rotation: number) {
		if(this.warnList[uuid]!=null){
			this.RemoveWarn(uuid);
		}
		var shape = new egret.Shape();
		shape.x = x;
		shape.y = y;
		shape.rotation = rotation;
		GameLayer.Instance.sceneEffectLayer.addChild(shape);
		shape.graphics.beginFill(0xff0000,0.5);
		switch(type){
			case 0:
				shape.graphics.drawCircle(0,0,range);
				break;
			case 1:
				shape.graphics.drawRect(-range*0.5,0,range,range);
				break;
			case 2:
				shape.graphics.drawArc(0,0,range,-Math.PI/6,Math.PI/6);
				break;
			case 3:
				shape.graphics.drawCircle(0,0,range);
				break;
		}
		shape.graphics.endFill();
		this.warnList[uuid] = shape;
	}

	public static RemoveWarn(uuid:number){
		var shape = this.warnList[uuid];
		if(shape !=null){
			GameLayer.Instance.sceneEffectLayer.removeChild(shape);
			shape = null;
			delete this.warnList[uuid];
		}
		
	}

}