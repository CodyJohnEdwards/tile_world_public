export function getLevelFromXP(totalXp, base = 100, growth = 1.1) {
    let level = 1;
    let xpNeeded = base;
    let accumulatedXp = 0;

    while (totalXp >= accumulatedXp + xpNeeded) {
        accumulatedXp += xpNeeded;
        level += 1;
        xpNeeded = base * Math.pow(growth, level - 1);
    }

    return level;
}
