const bitValues = {
    none: 0,
    cart_error: 1,
    hook_error: 2,
    warning: 4,
    paused: 8,
    manual_mode: 16,
    maintenance: 32,
    busy: 64,
    ready: 128,
    parking: 256,
    loaded: 512,
    house_keeping: 1024,
    shutdown_ready: 2048
};

function getCartBitValuesFromDecimalStatus(cart_status) {
    const binaryString = (cart_status >>> 0).toString(2).padStart(12, '0');
    const result = {};
    // console.log(binaryString);
    let bitsResult = [];
    for (let i = 0; i < binaryString.length; i++) {
        const value = 2 ** (binaryString.length - 1 - i);
        if (binaryString[i] === '1') {
            const key2 = Object.keys(bitValues).find(key => bitValues[key] === value);
            if (key2) {
                bitsResult.push(key2);
                result[key2] = value;
            }
        }
    }
    return result;
}

// Export the function if you're using modules
export { getCartBitValuesFromDecimalStatus };
