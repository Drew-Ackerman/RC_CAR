/**
 * Get a random integer between bounds
 * @param min The lower bound of the range
 * @param max The upper bound of the range
 * @returns The number between the bounds
 */
export function getRandomInt(min=0, max=100000000){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min) + min);
}