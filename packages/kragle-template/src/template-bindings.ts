import BoundNode, {
  BoundAttributeNode,
  BoundEventHandlerNode,
  BoundPropertyNode
} from './bound-node';

function isBoundEventHandlerNode(node: BoundNode): node is BoundEventHandlerNode {
  return node.hasOwnProperty('eb');
}

function isBoundPropertyNode(node: BoundNode): node is BoundPropertyNode {
  return node.hasOwnProperty('pn');
}

/**
 * Provides a simple interface for directly inserting data into a template.
 */
export default class TemplateBindings {

  _m: Map<string, BoundNode[]>; // Mapping

  constructor(bindingsMap: Map<string, BoundNode[]>) {

    this._m = bindingsMap;

  }

  setData(data: object) {

    Object.keys(data).forEach(key => this.set(key, data[key]));

  }

  set(name: string, value: any) {

    let boundNodes = this._m.get(name);
    if (boundNodes) {

      for (let boundNode of boundNodes) {

        let { n } = boundNode;
        if (n.nodeType === Node.TEXT_NODE) {

          n.textContent = value.toString();

        } else if (isBoundEventHandlerNode(boundNode)) {

          let { eh, en } = boundNode;
          n.removeEventListener(en, eh);
          n.addEventListener(en, value);
          boundNode.eh = value;

        } else if (isBoundPropertyNode(boundNode)) {

          (n as Element).props[boundNode.pn] = value;

        } else {

          let { v, ov } = boundNode as BoundAttributeNode;
          v.set(name, value.toString());

          let attrValue = ov;
          for (let [key, val] of v) {
            attrValue = attrValue.replace(`{{${key}}}`, val);
          }

          (n as Attr).value = attrValue;

        }

      }

    }

  }

}
