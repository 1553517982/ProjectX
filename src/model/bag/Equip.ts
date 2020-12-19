class Equip extends Item {
	//装备部位 1-武器  2-护甲  3-护膝  4-鞋子
	public pos: number;
	public constructor(data: any) {
		super(data);
		this.pos = data.pos;
	}

}