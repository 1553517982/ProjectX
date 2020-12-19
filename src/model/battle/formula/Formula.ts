class Formula {
    public static CalcuLateDamage(caster: Entity, target: Entity, skill: Skill): number {
        var damage = caster.atk - target.def;
        var final = skill.config.rate * damage * 0.01;
        if (final < 0) {
            final = 1;
        }
        return final;
    }
}