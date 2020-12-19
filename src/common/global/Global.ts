class Global {
    /**默认背包容量 50*/
    public static BagCapacity = 50;
    /**战斗 */
    public static Battle: Battle;
    /**实体管理 */
    public static EntityModel: EntityModel;

}


class DelayFuncs extends GameObject {
    private triggerTime: number;
    private bTriggered: boolean;
    private callback: Function;

    constructor(delay: number, callback: Function) {
        super();
        this.bTriggered = false;
        this.triggerTime = Global.Battle.BattleTime + delay;
        this.callback = callback;
    }

    public reset(delay: number) {
        this.triggerTime = Global.Battle.BattleTime + delay;
        this.bTriggered = false;
    }

    public excute():boolean {
        if (!this.bTriggered && Global.Battle.BattleTime >= this.triggerTime) {
            if (this.callback) {
                this.callback();
                return true;
            }
        }
        return false;
    }
}