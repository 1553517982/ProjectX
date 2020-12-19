class TweenObj {
	private thisObj: any;
	private propData: any;
	private speed: any;
	private symbols: any;

	constructor(thisObj: any, propData: any, speed: number) {
		this.thisObj = thisObj;
		this.propData = propData;
		this.symbols = {}
		for (var key in this.propData) {
			this.symbols[key] = this.thisObj[key] > this.propData[key] ? 1 : -1;
		}
		this.speed = speed;
	}

	public Tick(dt: number): boolean {
		var bFinish = true;
		for (var key in this.propData) {
			var current = this.thisObj[key];
			var nextValue = current + this.speed * dt * this.symbols[key];
			bFinish = bFinish && this.symbols[key] > 0 ? nextValue > this.propData[key] : nextValue < this.propData[key];
			this.thisObj[key] = bFinish ? this.propData[key] : nextValue;
		}
		return bFinish;
	}

	public UpdateTargetValue(data:any){
		this.propData = data;
	}
}

class TweenUtils {
	public static ticker: egret.Timer;

	private static tasks: TweenObj[] = [];

	public static TweenTo(thisObj: any, propdata: any, speed: number): TweenObj {
		this.ResumeTicker();
		var tw = new TweenObj(thisObj, propdata, speed);
		this.tasks.push(tw);
		return tw;
	}

	private static ResumeTicker() {
		if (this.ticker == null) {
			this.ticker = new egret.Timer(20);
			this.ticker.addEventListener(egret.TimerEvent.TIMER, this.OnTick, this);
		}
		this.ticker.start();
	}

	private static OnTick(dt: egret.TimerEvent) {
		var finishedTask = []
		for (var i = 0; i < this.tasks.length; i++) {
			if (this.tasks[i].Tick(20)) {
				finishedTask.push(i);
			}
		}
		for (var k = finishedTask.length - 1; k > 0; k--) {
			this.tasks.slice(finishedTask[k], finishedTask[k]);
		}
	}
}