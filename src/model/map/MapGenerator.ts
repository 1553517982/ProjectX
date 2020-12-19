/**地图组件类型 */
enum eDungeonObjType {
	//房间
	Room,
	//过道
	Connector,
}

/**地图组件基类 */
class DungeonObj {
	/**位置 */
	public x: number;
	public y: number;
	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

/**地图房间 */
class Room extends DungeonObj {
	/**房间宽度 */
	public width: number;
	/**房间高度 */
	public height: number;

	public constructor(x: number, y: number, width: number, height: number) {
		super(x, y)
		this.width = width;
		this.height = height;

	}
}

/**地图格子类型 */
enum DungeonGridType {
	/** 墙*/
	Wall,
	/** 门*/
	Door,
	/** 地板*/
	Floor,
	/** 水域*/
	Water,
	/** 岩浆*/
	Fire,
}

/**最终导出的地图格子数据 */
class MapGrid {
	/**位置 */
	public x: number;
	public y: number;
	/**类型  墙  地面  门 */
	public type: DungeonGridType;
	/** 
	 *  8 1 2
	 *  7 0 3
	 *  6 5 4
	 */
	public pos: number;
	public constructor(x: number, y: number, type: DungeonGridType) {
		this.x = x;
		this.y = y;
		this.type = type;
	}
}

class MapDataGenerator {
	private static randomSeed: number = 5;
	//防止伪随机数污染  地图生成的随机函数 写成私有
	private static random() {
		this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280.0;
		return this.randomSeed / (233280.0);
	};

	public static Grids: MapGrid[];
	private static GridSize: number = 64;
	private static RoomGaps: number = 3;
	private static RoomSize: number = 30;
	private static MapWidth: number;
	private static MapHeight: number;
	/**地图宽度,高度,随机数种子,填充类型 */
	public static CreateMap(width: number, height: number, cellSize: number, seed?: number, fillType?: DungeonGridType) {
		seed = seed || 1;
		this.MapWidth = width;
		this.MapHeight = height;
		this.GridSize = cellSize;
		this.randomSeed = seed || this.randomSeed;
		fillType = fillType || DungeonGridType.Water;
		//先填充整张地图
		this.Grids = [];
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				var idx = i * width + j;
				var grid = new MapGrid(j, i, fillType);
				this.Grids.push(grid);
			}
		}
		//生成若干房间 房间固定尺寸 RoomSize*RoomSize 周围是墙 按照(RoomSize+RoomGaps)*(RoomSize+RoomGaps)划分地图 在每一个区间内生成RoomSize*RoomSize的房间
		var rooms = [];
		var stepSize = (this.RoomSize + this.RoomGaps);
		var hcount = Math.floor(width / stepSize);
		var vcount = Math.floor(height / stepSize);
		var gapRndSize = (this.RoomGaps + 1);
		var roomSize = this.RoomSize;
		for (var i = 0; i < vcount; i++) {
			for (var j = 0; j < hcount; j++) {
				var randomGapx = Math.floor(this.random() * gapRndSize);
				var randomGapy = Math.floor(this.random() * gapRndSize);
				var posx = j * stepSize + randomGapx;
				var posy = i * stepSize + randomGapy;
				var room = new Room(posx, posy, roomSize, roomSize);
				rooms.push(room);
			}
		}
		//处理对应的房间格子
		for (var k in rooms) {
			this.generatRoomGrids(rooms[k]);
		}
		this.Render();
	}

	/**处理地图格子 */
	private static generatRoomGrids(room: Room) {
		if (room == null) return;
		for (var y = room.y; y < room.y + room.height; y++) {
			for (var x = room.x; x < room.x + room.width; x++) {
				var idx = y * this.MapWidth + x;
				var grid = this.Grids[idx];
				if (y == room.y) {
					if (x == room.x) {
						this.UpdateGrid(grid, 8, DungeonGridType.Wall);
					} else if (x == room.x + room.width) {
						this.UpdateGrid(grid, 2, DungeonGridType.Wall);
					} else {
						this.UpdateGrid(grid, 1, DungeonGridType.Wall);
					}
				} else if (y == room.y + room.height - 1) {
					if (x == room.x) {
						this.UpdateGrid(grid, 6, DungeonGridType.Wall);
					} else if (x == room.x + room.width - 1) {
						this.UpdateGrid(grid, 4, DungeonGridType.Wall);
					} else {
						this.UpdateGrid(grid, 5, DungeonGridType.Wall);
					}
				} else {
					if (x == room.x) {
						this.UpdateGrid(grid, 7, DungeonGridType.Wall);
					} else if (x == room.x + room.width - 1) {
						this.UpdateGrid(grid, 3, DungeonGridType.Wall);
					} else {
						this.UpdateGrid(grid, 0, DungeonGridType.Floor);
					}
				}
			}
		}
	}

	private static UpdateGrid(grid: MapGrid, pos: number, type: DungeonGridType) {
		grid.pos = pos;
		grid.type = type;
	}

	private static Render() {
		this.RenderMap(this.GridSize, GameLayer.Instance.sceneLayer);
	}

	private static RenderMap(cellSize: number, parent: egret.DisplayObjectContainer) {
		for (let i = 0; i < this.Grids.length; i++) {
			var grid = this.Grids[i];
			var gridRes = "tileset_json.floor_png";
			switch (grid.type) {
				case DungeonGridType.Floor:
					gridRes = "tileset_json.floor_png";
					break;
				case DungeonGridType.Wall:
					gridRes = "tileset_json.wall_png";
					break;
				case DungeonGridType.Water:
					gridRes = "tileset_json.water_png";
					break;
			}
			var gridSprite = new eui.Image(gridRes);
			gridSprite.x = grid.x * cellSize;
			gridSprite.y = grid.y * cellSize;
			gridSprite.width = cellSize;
			gridSprite.height = cellSize;
			parent.addChild(gridSprite);
		}
	}
}