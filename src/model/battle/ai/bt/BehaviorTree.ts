/**
 * 行为树框架
 */
class BehaviorTree {
    private _ownerHandle: number;
    /** 当前ai的配置文件 */
    private _config: any;
    /** 行为根节点 */
    private _root: BehaviorBaseNode = undefined;

    public constructor(config: any) {
        this._config = config;
        this._root = this._parse(config);
    }

    public destructor() {
        this._config = null
        if (this._root)
            this._root = null
    }

    /**
     * 思考的帧函数， 开始遍历行为树
     */
    public think(owner: GameObject) {
        if (this._root != undefined) {
            this._root.execute(owner);
        }
    }

    /**
     * 根据行为树配置构造行为树节点，应该只在初始化的时候，执行一次
     * @param 行为树json配置
     */
    private _parse(config: any): BehaviorBaseNode {
        if (config == null)
            return null;

        // 先创建自己    
        let t = config.t;               // 构造的节点类型
        let p = config.p;               // 构造的参数
        let children = config.c;
        let log = config.log;           // 日志字段，如果有，则打印日志
        let node = BehaviorTreeFactory.createNode(t, p, log) as BehaviorBaseNode;

        // 最后递归创建儿子
        if (children != null) {
            let parent = node as BehaviorCompositeNode
            for (let child of children) {
                let childNode = this._parse(child);
                if (childNode != null) {
                    parent.addChild(childNode);
                }
            }
        }
        return node;
    }
}

/**
 * 行为树工厂类
 */
class BehaviorTreeFactory {
    /**
     * 工厂构造，根据类型构造行为树节点
     * @param type 行为树节点类型，字符串
     * @param param 附带参数
     * @param log 日志参数
     */
    static createNode(type: string, param: any, log?: string): BehaviorBaseNode {
        switch (type) {
            case "Sel":
                return new BehaviorSelectorNode(param, log);
            case "Seq":
                return new BehaviorSequenceNode(param, log);
            default:
                let nodeClass = egret.getDefinitionByName(type);
                if (nodeClass != undefined) {
                    let node = new nodeClass(param, log) as BehaviorBaseNode;
                    return node;
                } else {
                    throw Error("not support this behavior tree type!" + type);
                }
        }
    }
}
