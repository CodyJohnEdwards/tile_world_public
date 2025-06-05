
const herbPrefixMap =  {
    Weak:   'Withered',
    Mild:   'Fresh',
    Strong: 'Lush',
    Potent: 'Vibrant',
};


export function decorateHerbPrefix(prefix) {
    return herbPrefixMap[prefix] || prefix;
}
