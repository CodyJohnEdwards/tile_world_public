export const STATUS_EFFECT_IMAGE_MAPPINGS = Object.freeze({
    Vitalized: formatURI("vitalized"),
    Charged: formatURI("charged"),
    Limber: formatURI("limber"),
    IronSkinned: formatURI("ironskinned"),
    Wired: formatURI("wired"),
    Swift: formatURI("swift"),
    Blessed: formatURI("blessed"),
    Aware: formatURI("aware"),
    Focused: formatURI("focused")
})

function formatURI(name){
    return `assets/img/status_effect_icons/${name}.png`
}