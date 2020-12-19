class Card extends GameObject {
	public level: number;

	public cardId: number;

	public constructor(cardId: number, level: number) {
		super();
		this.level = level;
		this.cardId = cardId;
	}
}