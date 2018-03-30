import BoundNode, {
  BoundAttributeNode,
  BoundEventHandlerNode,
  BoundPropertyNode
} from './bound-node';
import TemplateBindings from './template-bindings';

interface Binding {
  p: number[]; // Path
}

interface TextBinding extends Binding {
  n: string; // Name
}

interface AttributeBinding extends Binding {
  n: string[]; // Name
  an: string; // Attribute Name
  en: string; // Event Name
  ip: boolean; // Is Property
}

/**
 * Stores info about bindings for a parsed template. It can then apply the
 * binding info to a cloned instance of the template quickly and return a
 * TemplateBindings instance to interact with the data directly.
 */
export default class TemplateBindingsFactory {

  private _tb: TextBinding[]; // Text Bindings
  private _ab: AttributeBinding[]; // Attribute Bindings

  constructor() {

    this._tb = [];
    this._ab = [];

  }

  // Add Text Binding
  addTB(name: string, path: number[]) {

    this._tb.push({ n: name, p: path.slice() });

  }

  // Add Attribute Binding
  addAB(names: string[], attrName: string, path: number[]) {

    let eventName = (attrName.startsWith('on-') ? attrName.substr(3) : '').replace(/-([a-z])/g, g => g[1].toUpperCase());
    let isProperty = attrName.endsWith('$');

    this._ab.push({
      n: names,
      an: attrName,
      en: eventName,
      ip: isProperty,
      p: path.slice()
    });

  }

  apply(node: Node) {

    let t = this;
    let bindingsMap = new Map<string, BoundNode[]>();
    for (let { n, p } of t._tb) {

      let nodeToBind = t.nFromP(node, p);

      nodeToBind.textContent = '';

      if (!bindingsMap.has(n)) {

        bindingsMap.set(n, []);

      }

      bindingsMap.get(n).push({
        n: nodeToBind
      });

    }

    for (let { n, an, p, en, ip } of t._ab) {

      let nodeToBind = t.nFromP(node, p);
      let attrNode = (nodeToBind as Element).getAttributeNode(an);

      if (en) {

        const ownerElement = attrNode.ownerElement;
        let binding: BoundEventHandlerNode = {
          n: ownerElement,
          en,
          eh: null
        };

        ownerElement.removeAttribute(attrNode.name);
        if (!bindingsMap.has(n[0])) {

          bindingsMap.set(n[0], []);

        }

        bindingsMap.get(n[0]).push(binding);

      } else if (ip) {

        const ownerElement = attrNode.ownerElement;
        const propName = attrNode.name.slice(0, -1).replace(/-([a-z])/g, g => g[1].toUpperCase());
        let binding: BoundPropertyNode = {
          n: ownerElement,
          pn: propName
        };

        ownerElement.props = ownerElement.props || {};
        ownerElement.props[propName] = null;
        ownerElement.removeAttribute(attrNode.name);
        if (!bindingsMap.has(n[0])) {

          bindingsMap.set(n[0], []);

        }

        bindingsMap.get(n[0]).push(binding);

      } else {

          let binding: BoundAttributeNode = {
            n: attrNode,
            ov: attrNode.value,
            v: new Map<string, string>()
          };

          for (let name of n) {

            if (!bindingsMap.has(name)) {

              bindingsMap.set(name, []);

            }

            binding.v.set(name, '');
            bindingsMap.get(name).push(binding);

          }

          let attrValue = binding.ov;
          for (let [name, value] of binding.v) {
            attrValue = attrValue.replace(`{{${name}}}`, value);
          }

          attrNode.value = attrValue;

      }

    }
    return new TemplateBindings(bindingsMap);

  }

  // Find Node From Path
  nFromP(node: Node, path: number[]) {

    let result = node;
    for (let pathSegment of path) {

      result = result.childNodes[pathSegment];

    }
    return result;

  }

}
