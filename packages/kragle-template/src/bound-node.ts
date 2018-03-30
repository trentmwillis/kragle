export default interface BoundNode {
  n: Node; // Node
}

export interface BoundAttributeNode extends BoundNode {
  ov: string; // Original Value
  v: Map<string, string>; // Vaues
}

export interface BoundPropertyNode extends BoundNode {
  pn: string; // Property Name
}

export interface BoundEventHandlerNode extends BoundNode {
  en: string; // Event Name
  eh: (event: Event) => void; // Event Handler
}
