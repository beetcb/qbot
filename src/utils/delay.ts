export const delay = (second: number) => new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 * second))
