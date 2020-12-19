class DataBase {
	public constructor() {
	}
	/**存储 */
	public static Save(key:string,content:any){
		localStorage.setItem(key,content);
	}
	/**读取 */
	public static Load(key:string):string {
		return localStorage.getItem(key);
	}
}