class CardModel extends Model {
	//卡牌列表
	private cardList: any;

	public get DBName() {
		return "CardModelDB"
	}

	public constructor(roleId: string) {
		super(roleId)
	}

	public Init(dataStr) {
		this.cardList = {}
		if (this.Validate(dataStr)) {
			var content = JSON.parse(dataStr);
			for (var k in content) {
				var card = new Card(content[k].cardId, content[k].level);
				this.cardList[card.uuid] = card;
			}
		}
	}

	public GetSaveContent() {
		var temp = {}
		for (var k in this.cardList) {
			temp[k] = { cardId: this.cardList[k].cardId, level: this.cardList[k].level };
		}
		return JSON.stringify(temp);
	}

	public Clear() { }
}