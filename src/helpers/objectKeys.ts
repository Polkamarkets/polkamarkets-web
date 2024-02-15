export default function keys<K extends string>(params: Record<K, unknown>) {
  return Object.keys(params) as Array<K>;
}
