

enum Direction {
	Left = 0,
	Up = 1,
	Right = 2,
	Down = 3
}

class Vector2 {
	constructor(public x: number, public y: number) { }
}

function toHex(c: number): string {
	let hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): number {
	//return Number("0x" + toHex(r) + toHex(g) + toHex(b));
	return r * 256 * 256 + g * 256 + b;
}

let generateId = 1;
function generatClusterId():number {
	return generateId++;
}

enum CellFlavor {
	Regular,
	Corridor,
	Seed
}

// Models the relationship between two neighboring cells.
class CellRel {
	linked: boolean;
	constructor(public from: Cell, public to: Cell) { }
}

class Cell {
	// left, top, right, bottom
	neighbors: CellRel[];
	// flag to be used for clustering
	visited: boolean;
	// cluster id
	cluster: number;

	constructor(public x: number, public y: number, public flavor: CellFlavor) {
		this.neighbors = [null, null, null, null];
	}
}

class Zone {
    /**
     * Creates a new zone.
     * 
     * @param range The width of the zone.
     * @param density Chance to add a cell in this zone.
     */
	constructor(public range: number, public density: number) { }
}

class Dungeon {

	cells: Cell[];
	zones: Zone[];

	constructor(public width: number, public height: number) {
		this.cells = new Array(width * height);
		this.zones = [];
	}
}

// Cluster of cells
class Cluster {

	// Both ID and color
	id: number;
	// Cells that are part of this cluster 
	cells: Cell[];
	// Center cell of this cluster 
	center: Cell;

	constructor() {
		this.id = generatClusterId();
		this.cells = [];
	}

	findCenter(optimum: Vector2) {
		let best = -1;
		this.cells.forEach(cell => {
			const x = (cell.x - optimum.x) * (cell.x - optimum.x);
			const y = (cell.y - optimum.y) * (cell.y - optimum.y);
			const dist = Math.sqrt(x + y);
			if (best == -1 || dist < best) {
				this.center = cell;
				best = dist;
			}
		});
	}
}

class Generator {
	private randomSeed:number=5;
	private random() { 
		this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280.0; 
		return this.randomSeed / (233280.0); 
	};

	// left, top, right, bottom margins
	margins: number[];
	// List of cell clusters
	clusters: any//Map<string,Cluster>;

	constructor(public seed: number) {
		this.randomSeed = seed;
		this.margins = [0, 0, 0, 0];
		this.clusters = {};
	}

    /**
     * Adds cells to the provided map.
     * 
     * @param map The map.
     */
	addCells(dungeon: Dungeon) {
		let zone_idx = -1;
		let zone_max = 0;
		for (let x = this.margins[0]; x < (dungeon.width - this.margins[2]); x++) {
			if (x >= zone_max) { // shift to next zone
				zone_idx++;
				zone_max += dungeon.zones[zone_idx].range;
			}

			for (let y = this.margins[1]; y < (dungeon.height - this.margins[3]); y++) {
				let idx = y * dungeon.width + x;
				if (dungeon.cells[idx] != null) {
					continue;
				}
				if (dungeon.zones[zone_idx].density > this.random()) {
					dungeon.cells[idx] = new Cell(x, y, CellFlavor.Regular);
				}
			}
		}
	}

    /**
     * Populates neighbor relationship between cells.
     * 
     * @param map The map.
     */
	identifyNeighbors(dungeon: Dungeon) {
		for (let y = 0; y < dungeon.height - 1; y++) {
			for (let x = 0; x < dungeon.width - 1; x++) {
				// populate neighbors to the right and down
				const idx = y * dungeon.width + x;
				const cell = dungeon.cells[idx];
				if (cell == null) {
					continue;
				}
				// right
				const right_cell = dungeon.cells[idx + 1];
				if (right_cell != null) {
					cell.neighbors[Direction.Right] = new CellRel(cell, right_cell);
					right_cell.neighbors[Direction.Left] = new CellRel(right_cell, cell);
				}
				// down
				const down_cell = dungeon.cells[idx + dungeon.width];
				if (down_cell != null) {
					cell.neighbors[Direction.Down] = new CellRel(cell, down_cell);
					down_cell.neighbors[Direction.Up] = new CellRel(down_cell, cell);
				}
			}
		}
	}

	clusterWalk(dungeon: Dungeon, cell: Cell, cluster: Cluster) {
		if (cell.visited)
			return; // we're done
		if (cluster == null) {
			cluster = new Cluster();
			this.clusters[cluster.id] = cluster;
		}
		cell.visited = true;
		cell.cluster = cluster.id;
		cluster.cells.push(cell);
		// Walk each linked neighbor
		for (let i = 0; i < 4; i++) {
			let rel = cell.neighbors[i];
			if (rel != null && rel.linked) {
				this.clusterWalk(dungeon, rel.to, cluster);
			}
		}
	}

	// Performs initial clustering
	generateClusters(dungeon: Dungeon) {
		this.clusters = {};//new Map<string,Cluster>();
		dungeon.cells.forEach(cell => { cell.visited = false; });
		// cluster
		dungeon.cells.forEach(cell => {
			if (cell.visited)
				return;
			// Create new cluster & walk
			this.clusterWalk(dungeon, cell, null);
		});
		// for each cluster, determine point closest to center of dungeon
		for (var k in this.clusters) {
			var cluster = this.clusters[k];
			cluster.findCenter(new Vector2(dungeon.width / 2, dungeon.height / 2))
		}

	}

	linkClusters(dungeon: Dungeon) {
		if ((this.clusters == null) || (this.clusters.size < 2))
			return; // nothing to do

		// Order clusters by number of cells
		var clusterList = []
		for (var k in this.clusters) {
			clusterList.push(this.clusters[k]);
		}
		clusterList.sort((a, b) => { return a.cells.length - b.cells.length; });

		for (var i = 0; i < clusterList.length - 1; i++) {
			const i_cell = clusterList[i].center;

			// find closest unlinked cluster
			let minDist = -1;
			let nearest_cluster = null;
			for (var j = i + 1; j < clusterList.length; j++) {
				const j_cell = clusterList[j].center;
				const dist = Math.sqrt((i_cell.x - j_cell.x) * (i_cell.x - j_cell.x) + (i_cell.y - j_cell.y) * (i_cell.y - j_cell.y));
				if (minDist == -1 || dist < minDist) {
					minDist = dist;
					nearest_cluster = clusterList[j];
				}
			}

			// connect this cluster to nearest cluster 
			this.connectCluster(dungeon, clusterList[i], nearest_cluster);
			break;
		}
	}

	connectCluster(dungeon: Dungeon, from: Cluster, to: Cluster) {
		let done: boolean = false;
		let cell: Cell = from.center;

		// console.log("=== Connect ", from.id, "@", from.center.x, ",", from.center.y, " to ", to.id, "@", to.center.x, ",", to.center.y, "===");
		while (!done) {
			let dx = to.center.x - cell.x;
			let dy = to.center.y - cell.y;
			let nx: number, ny: number;
			let dir: Direction = null, inverseDir: Direction = null;
			if (Math.abs(dx) > Math.abs(dy)) // move in x direction
			{
				var symbol = dx > 0 ? 1 : dx < 0 ? -1 : 0;
				nx = cell.x + symbol;
				ny = cell.y;
				dir = symbol == 1 ? Direction.Right : Direction.Left;
				inverseDir = symbol == 1 ? Direction.Left : Direction.Right;
			}
			else // move in y direction
			{
				var symbol = dy > 0 ? 1 : dy < 0 ? -1 : 0;
				nx = cell.x;
				ny = cell.y + symbol;
				dir = symbol == 1 ? Direction.Down : Direction.Up;
				inverseDir = symbol == 1 ? Direction.Up : Direction.Down;
			}

			// 3 cases based on next cell type
			let next = dungeon.cells[ny * dungeon.width + nx];
			if (next == null) // next cell is empty
			{
				// Create link cell
				next = new Cell(nx, ny, CellFlavor.Corridor);
				next.cluster = from.id; // make next a member of current cluster
				from.cells.push(next);
				next.neighbors[inverseDir] = new CellRel(next, cell);
				next.neighbors[inverseDir].linked = true;
				cell.neighbors[dir] = new CellRel(cell, next);
				cell.neighbors[dir].linked = true;
				dungeon.cells[ny * dungeon.width + nx] = next;
				cell = next;
			}
			else if (next.cluster != from.id) // next cell is another cluster - connect the two
			{
				next.neighbors[inverseDir] = new CellRel(next, cell);
				next.neighbors[inverseDir].linked = true;
				cell.neighbors[dir] = new CellRel(cell, next);
				cell.neighbors[dir].linked = true;

				// larger cluster will take over smaller
				let actualCluster = this.clusters[next.cluster];
				if (actualCluster.cells.length > from.cells.length) {
					from.cells.forEach(cell => {
						cell.cluster = actualCluster.id;
						actualCluster.cells.push(cell);
					});
					delete this.clusters[from.id];
					actualCluster.findCenter(new Vector2(dungeon.width / 2, dungeon.height / 2));
				} else {
					actualCluster.cells.forEach(cell => {
						cell.cluster = from.id;
						from.cells.push(cell);
					});
					delete this.clusters[actualCluster.id];
					from.findCenter(new Vector2(dungeon.width / 2, dungeon.height / 2));
				}
				done = true; // and we're done
			}
			// next cell is part of our cluster - continue moving
			else if (next.cluster == from.id) {
				// if current room is a link, connect it to next room
				if (next.flavor == CellFlavor.Corridor) {
					next.neighbors[inverseDir] = new CellRel(next, cell);
					next.neighbors[inverseDir].linked = true;
					cell.neighbors[dir] = new CellRel(cell, next);
					cell.neighbors[dir].linked = true;
				}
				if (cell == next) {
					from.findCenter(new Vector2(dungeon.width / 2, dungeon.height / 2));
					done = true;
				}
				cell = next;
			}
		}
	}

	private readonly scale = 64;

	private ctx: egret.Graphics;

	public createMap(width: number, height: number,seedCells:number[][] ,seed?: number) {
		var dungeon = new Dungeon(width, height);
		// Add zones
		const zones = [0.3];
		for (let i = 0; i < zones.length; i++) {
			dungeon.zones.push(new Zone(40, zones[i]));
		}
		// Add seed cells
		seedCells.forEach(element => {
			let c = new Cell(element[0], element[1], CellFlavor.Seed);
			dungeon.cells[c.y * dungeon.width + c.x] = c;
		});

		// Initialize generator
		var gen = new Generator(seed);
		gen.margins = [0, 0, 0, 0];

		// Map generation
		gen.addCells(dungeon);
		gen.identifyNeighbors(dungeon);
		gen.generateClusters(dungeon);
		gen.linkClusters(dungeon);

		this.render(dungeon);
	}

	public render(dungeon: Dungeon) {
		let offset = 0;
		const scalar = dungeon.width / (2 * dungeon.zones.length);
		var shape = new egret.Shape();
		GameLayer.Instance.sceneLayer.addChild(shape);
		this.ctx = shape.graphics;
		this.ctx.beginFill(0x000000);
		for (let i = 0; i < dungeon.zones.length; i++) {
			//this.ctx.fillStyle = rgbToHex(offset * scalar, offset * scalar, offset * scalar);
			this.ctx.drawRect(offset * this.scale, 0, dungeon.zones[i].range * this.scale, dungeon.height * this.scale);
			offset += dungeon.zones[i].range;
		}
		this.ctx.endFill();

		for (let i = 0; i < dungeon.cells.length; i++) {
			const cell = dungeon.cells[i];
			if (cell == null) {
				continue;
			}
			// FILL
			switch (cell.flavor) {
				case CellFlavor.Regular:
					//this.ctx.fillStyle = "#dddddd";
					this.ctx.beginFill(0xdddddd);
					this.renderCell(cell);
					this.ctx.endFill();
					break;
				case CellFlavor.Seed:
					//this.ctx.fillStyle = "#ffa214";
					this.ctx.beginFill(0xffa214);
					this.renderCell(cell);
					this.ctx.endFill();
					break;
				case CellFlavor.Corridor:
					this.renderCorridor(cell);
					break;
			}
		}
	}

	private renderCell(cell: Cell) {
		this.ctx.lineStyle(10, 0xefefef);
		this.ctx.drawRect(cell.x * this.scale, cell.y * this.scale, this.scale, this.scale);

		// WALLS
		this.ctx.lineStyle(1, 0x999999);
		let upRel = cell.neighbors[Direction.Up];
		if (upRel == null || !upRel.linked) {
			//this.ctx.beginPath();
			this.ctx.moveTo(cell.x * this.scale, cell.y * this.scale);
			this.ctx.lineTo((cell.x + 1) * this.scale, cell.y * this.scale);
			////this.ctx.stroke();
		}
		let rightRel = cell.neighbors[Direction.Right];
		if (rightRel == null || !rightRel.linked) {
			//this.ctx.beginPath();
			this.ctx.moveTo((cell.x + 1) * this.scale, cell.y * this.scale);
			this.ctx.lineTo((cell.x + 1) * this.scale, (cell.y + 1) * this.scale);
			//this.ctx.stroke();
		}
		let downRel = cell.neighbors[Direction.Down];
		if (downRel == null || !downRel.linked) {
			//this.ctx.beginPath();
			this.ctx.moveTo(cell.x * this.scale, (cell.y + 1) * this.scale);
			this.ctx.lineTo((cell.x + 1) * this.scale, (cell.y + 1) * this.scale);
			//this.ctx.stroke();
		}
		let leftRel = cell.neighbors[Direction.Left];
		if (leftRel == null || !leftRel.linked) {
			//this.ctx.beginPath();
			this.ctx.moveTo(cell.x * this.scale, cell.y * this.scale);
			this.ctx.lineTo(cell.x * this.scale, (cell.y + 1) * this.scale);
			//this.ctx.stroke();
		}
	}

	private renderCorridor(cell: Cell) {
		// if (cell.cluster != null) {
		// 	//this.ctx.strokeStyle = cell.cluster;

		// }
		this.ctx.lineStyle(10, 0xff0000);
		//this.ctx.lineWidth = 10;

		let upRel = cell.neighbors[Direction.Up];
		if (upRel != null && upRel.linked) {
			//this.ctx.beginPath();
			this.ctx.moveTo((cell.x + 0.5) * this.scale, cell.y * this.scale);
			this.ctx.lineTo((cell.x + 0.5) * this.scale, (cell.y + 0.5) * this.scale);
			//this.ctx.stroke();
		}
		let rightRel = cell.neighbors[Direction.Right];
		if (rightRel != null && rightRel.linked) {
			//this.ctx.beginPath();
			this.ctx.moveTo((cell.x + 0.5) * this.scale, (cell.y + 0.5) * this.scale);
			this.ctx.lineTo((cell.x + 1) * this.scale, (cell.y + 0.5) * this.scale);
			//this.ctx.stroke();
		}
		let downRel = cell.neighbors[Direction.Down];
		if (downRel != null && downRel.linked) {
			//this.ctx.beginPath();
			this.ctx.moveTo((cell.x + 0.5) * this.scale, (cell.y + 0.5) * this.scale);
			this.ctx.lineTo((cell.x + 0.5) * this.scale, (cell.y + 1) * this.scale);
			//this.ctx.stroke();
		}
		let leftRel = cell.neighbors[Direction.Left];
		if (leftRel != null && leftRel.linked) {
			//this.ctx.beginPath();
			this.ctx.moveTo(cell.x * this.scale, (cell.y + 0.5) * this.scale);
			this.ctx.lineTo((cell.x + 0.5) * this.scale, (cell.y + 0.5) * this.scale);
			//this.ctx.stroke();
		}
	}
}