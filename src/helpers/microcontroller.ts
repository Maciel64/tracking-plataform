export function generateRandomMicroName() {
  return `Micro_${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`.substring(0, 10);
}
