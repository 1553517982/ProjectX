/**实体管理 */
class EntityModel extends Model {
	/**怪物列表 */
	private monsters: any = {};
	/**主角 */
	private mainPlayer: Entity;
	/**所有实体 */
	private entities: any = {}
	/**roleId */
	private roleId: string;

	public get DBName(): string {
		return "EntityMgrDB";
	}
	public constructor(roleId: string) {
		super(roleId)
		this.roleId = roleId;
		this.entities = {}
	}
	/**加载数据 */
	public Init(dataStr: string) {

	}
	/**数据清理 */
	public Clear() {
		for (var k in this.entities) {
			var entity = this.entities[k] as Entity;
			entity.Destroy();
		}
		this.entities = {};
		this.monsters = {}
		this.mainPlayer = null
	}
	/**构造数据存储 */
	public GetSaveContent(): string {
		var data = {
			hero: { hp: this.mainPlayer.hp },
			monsters: []
		}
		for (var k in this.monsters) {
			var entity = this.monsters[k] as Entity;
			data.monsters.push({ type: entity.type, level: entity.level });
		}
		return JSON.stringify(data);
	}

	/**创建主角 */
	public CreateMainPlayer(x: number, y: number): Entity {
		this.mainPlayer = new Entity(0, 1);
		this.mainPlayer.setAI("hero");
		this.mainPlayer.setModel("role1");
		var skills = [0,1,2,3]
		for (var k in skills) {
			this.mainPlayer.learnSkill(skills[k]);
		}
		this.entities[this.mainPlayer.uuid] = this.mainPlayer;
		this.mainPlayer.x = x;
		this.mainPlayer.y = y;
		return this.mainPlayer
	}

	/**创建怪物 */
	public CreateMonster(monsterId: number, x: number, y: number): Entity {
		var monsterCfg = MonsterCfg[monsterId];
		var monster = new Entity(monsterCfg.type, monsterCfg.level);
		monster.setModel(monsterCfg.model);

		for (var k in monsterCfg.skills) {
			monster.learnSkill(monsterCfg.skills[k]);
		}
		monster.setAI("monster");
		monster.x = x;
		monster.y = y;
		this.monsters[monster.uuid] = monster;
		this.entities[monster.uuid] = monster;
		return monster;
	}

	public Tick(dt) {
		if (this.mainPlayer) {
			this.mainPlayer.OnTick(dt);
		}
		var monsters = this.monsters;
		for (var k in monsters) {
			monsters[k].OnTick(dt);
		}
	}

	public Exist(uuid: number): boolean {
		return uuid >= 0 && this.entities[uuid] != null
	}

	public getNearestEnemy(x, y, type): number {
		var ret = -1;
		var mindis = 999999;
		var dis = 999999
		var ent: Entity = null;
		for (var k in this.entities) {
			ent = this.entities[k] as Entity;
			dis = (x - ent.x) * (x - ent.x) + (y - ent.y) * (y - ent.y);
			if ((type == 0 && ent.type != 0 || type != 0 && ent.type == 0) && dis < mindis) {
				mindis = dis;
				ret = ent.uuid;
			}
		}
		return ret;
	}

	public getEntity(uuid: number): Entity {
		return this.entities[uuid];
	}

	public RemoveEntity(uuid: number) {
		var entity = this.entities[uuid];
		if (entity) {
			entity.Destroy();
		}
		if(this.mainPlayer.uuid == uuid){
			this.mainPlayer = null;
		}
		delete this.entities[uuid];
	}
}