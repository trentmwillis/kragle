import TemplateBindingsFactory from './template-bindings-factory';

/**
 * Responsible for parsing an HTMLTemplateElement and turning it into a
 * TemplateBindingsFactory instance that can then produce TemplateBindings for
 * individual instances of the template.
 */
export default class TemplateBindingsParser {

  static BR = /{{([a-zA-z0-9]*)}}/; // Binding Regex

  static p(template: HTMLTemplateElement) {

    let bindings = new TemplateBindingsFactory();

    this.pNs(bindings, template.content.childNodes, []);

    return bindings;

  }

  // Parses a set of nodes to see if they have any template bindings
  // Parse Nodes
  static pNs(bindings: TemplateBindingsFactory, nodes: NodeList, path: number[]) {

    // We do a depth-first traversal of the nodes with prefix visiting for
    // actually parsing bindings
    for (let i = 0; i < nodes.length; i++) {

      path.push(i);
      this.pN(bindings, nodes[i], path);
      path.pop();

    }

  }

  // Parses a single node to see if it has any template bindings
  // Parse Node
  static pN(bindings: TemplateBindingsFactory, node: Node, path: number[]) {

    let t = this;
    if (node.nodeType === Node.TEXT_NODE) {

      return t.pTB(bindings, node as Text, path);

    }

    if (node.nodeType === Node.ELEMENT_NODE) {

      if (node.hasAttributes()) {

        t.pAs(bindings, node.attributes, path);

      }

      if (node.hasChildNodes()) {

        t.pNs(bindings, node.childNodes, path);

      }

    }

  }

  // Parses the attributes of a node to see if they have any template bindings
  // Parse Attributes
  static pAs(bindings: TemplateBindingsFactory, attributes: NamedNodeMap, path: number[]) {

    // tslint:disable-next-line prefer-for-of
    for (let i = 0; i < attributes.length; i++) {

      this.pA(bindings, attributes[i], path);

    }

  }

  // Parses a single attribute node for template bindings
  // Parse Attribute
  static pA(bindings: TemplateBindingsFactory, attribute: Attr, path: number[]) {

    let regex = new RegExp(this.BR.source, 'g');
    let names: string[] = [];
    let match: RegExpMatchArray = regex.exec(attribute.value);
    while (match) {

      names.push(match[1]);
      match = regex.exec(attribute.value);

    }

    if (names.length) {

      bindings.addAB(names, attribute.name, path);

    }

  }

  // Parses a single text node for template bindings
  // Parse Text Bindings
  static pTB(bindings: TemplateBindingsFactory, node: Text, path: number[]) {

    let regex = new RegExp(this.BR.source, 'g');
    let match = regex.exec(node.textContent);
    if (match) {
      if (match.index) {
        node.splitText(match.index);
        return;
      }

      if (node.length > match[0].length) {
        node.splitText(match[0].length);
      }

      let name = match[1];
      bindings.addTB(name, path);
    }

  }

}
