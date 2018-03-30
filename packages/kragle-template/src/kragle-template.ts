import TemplateBindings from './template-bindings';
import TemplateBindingsFactory from './template-bindings-factory';
import TemplateBindingsParser from './template-bindings-parser';

/**
 * The only public export of the package. This class turns a standard HTML
 * Template element into a factory for creating template clones (instances)
 * with a set of named bindings to dynamically update the DOM.
 */
export default class KragleTemplate {

  private _bf: TemplateBindingsFactory; // Bindings Factory
  private _t: HTMLTemplateElement; // Template

  constructor(template: HTMLTemplateElement) {

    this._bf = null;
    this._t = template;

  }

  /**
   * Creates a template clone and associated bindings object. If this is the
   * first instance created, it will also perform the initial parse of the
   * template.
   */
  create(data?: object): [Node, TemplateBindings] {

    let t = this;
    if (!t._bf) {

      t._bf = TemplateBindingsParser.p(t._t);

    }

    let instance = t._t.content.cloneNode(true);
    let bindings = t._bf.apply(instance);

    if (data) {

      bindings.setData(data);

    }

    return [instance, bindings];

  }

}
