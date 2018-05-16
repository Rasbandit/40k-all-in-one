export default function round(value) {
  if (value % 1 >= 0.5) {
    return Math.ceil(value);
  }
  return Math.floor(value);
}
