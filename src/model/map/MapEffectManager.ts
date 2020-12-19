class MapEffectManager {
	/**特效数组 */
	public static mapEffects: any = {};

	public static CreateEffect(name: string, frameCount: number, speed?: number): MapEffect {
		var effect = new MapEffect(name, frameCount, speed);
		this.mapEffects[effect.uuid] = effect;
		return effect;
	}

	public static Tick(dt) {
		for (var k in this.mapEffects) {
			var effect = this.mapEffects[k] as MapEffect;
			effect.OnTick(dt);
		}
	}

	/**移除特效 */
	public static RemoveEffect(effectid: number) {
		if (this.mapEffects[effectid]) {
			this.mapEffects[effectid].Destroy();
		}
		delete this.mapEffects[effectid];
	}

	public static Clear() {
		for (var k in this.mapEffects) {
			var effect = this.mapEffects[k] as MapEffect;
			effect.Destroy();
		}
		this.mapEffects = {}
	}
}