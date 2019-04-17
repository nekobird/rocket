export interface Group {
  name: string,
  items: NodeListOf<HTMLElement>,
  activeItems?: HTMLElement[],
  isActive: boolean,
}