
/**
 * 行为树节点基类
 */
class BehaviorBaseNode {

    /** 参数集 */
    protected param: any;
    /** 日志字段 */
    protected log: string;

    public constructor(p: any, log?: string) {
        this.param = p;
        this.log = log;
    }

    public execute(owner: GameObject): boolean {
        return false;
    }
}

/**
 * 行为树复合节点类,不能成为叶子节点
 */
class BehaviorCompositeNode extends BehaviorBaseNode {

    protected _children: Array<BehaviorBaseNode> = []; 			// 儿子节点

    public constructor(p: any, log?: string) {
        super(p, log);
    }

    public destructor() {
        this.removeAllChildren();
    }

    public addChild(child: BehaviorBaseNode) {
        this._children.push(child);
    }

    public removeChild(child: BehaviorBaseNode) {

    }

    public removeAllChildren() {
        this._children = [];
    }
}

/**
 * 行为树条件判断节点类
 */
class BehaviorConditionNode extends BehaviorBaseNode {

    public constructor(p: any, log?: string) {
        super(p, log);
    }

    public execute(owner: GameObject) {
        if(this.log){
            console.log(this.log, this.param);
        }
        return false
    }

    /**
     * 对照条件判断中的运算符
     * @param operator 运算符
     * @param lv 左式
     * @param rv 右式
     */
    protected compare(operator, lv, rv) {
        switch (operator) {
            case "==":
                return lv == rv;
            case "!=":
                return lv != rv;
            case ">":
                return lv > rv;
            case ">=":
                return lv >= rv;
            case "<":
                return lv < rv;
            case "<=":
                return lv <= rv;
            default:
                return false;
        }
    }
}

/**
 * 行为树执行节点类
 */
class BehaviorActionNode extends BehaviorBaseNode {

    public constructor(p: any, log?: string) {
        super(p, log);
    }

    public execute(owner: GameObject) {
        if(this.log){
            console.log(this.log, this.param);
        }
        return false
    }

}

/**
 * 行为树selector节点类
 * till true node
 * 遇到一个child 返回true，则停止迭代
 * 本node向自己的父节点也返回true
 * 如果所有child返回false，本node向父节点返回false
 */
class BehaviorSelectorNode extends BehaviorCompositeNode {

    public constructor(p: any, log?: string) {
        super(p, log);
    }

    public execute(owner: GameObject) {
        for (let child of this._children) {
            if (child.execute(owner))
                return true;
        }
        return false;
    }
}

/**
 * 行为树sequence节点类
 * till false node
 * 遇到一个child 返回false，则停止迭代
 * 本node向自己的父节点也返回false
 * 如果所有child返回true，本node向父节点返回true
 */
class BehaviorSequenceNode extends BehaviorCompositeNode {

    public constructor(p: any, log?: string) {
        super(p, log);
    }

    public execute(owner: GameObject) {
        for (let child of this._children) {
            if (!child.execute(owner))
                return false;
        }
        return true;
    }
}