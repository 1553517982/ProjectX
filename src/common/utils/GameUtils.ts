/**伪随机数生成工具 -帧同步使用*/
class RandomUtils {
	private static randomSeed:number=5; 

	public static InitSeed(seed:number){
		this.randomSeed = seed;
	}

	public static random() { 
		this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280.0; 
		return this.randomSeed / (233280.0); 
	};
}
