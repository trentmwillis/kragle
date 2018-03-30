import KragleTemplate from 'kragle-template';

class KragleElement extends HTMLElement {
  static get is(): string {

    throw new Error('Subclasses of KragleElement must define a static getter for `is` that returns a string value to be used as a name.');

  }

  static get useShadow() {

    return true;

  }

  static get boundTemplate(): KragleTemplate {

    if (!this._boundTemplate) {

      const rawTemplate = document.getElementById(`${this.is}-template`) as HTMLTemplateElement;
      this._boundTemplate = new KragleTemplate(rawTemplate);

    }

    return this._boundTemplate as KragleTemplate;

  }

  private static _boundTemplate: KragleTemplate;

  private _rendered: boolean;
  private _renderTarget: Node;
  private _template: Node;

  constructor() {

    super();

    const Class = (this.constructor as typeof KragleElement);
    const [template, props] = Class.boundTemplate.create();

    if (Class.useShadow) {

      this.attachShadow({ mode: 'open' });
      this._renderTarget = this.shadowRoot;

    } else {

      this._renderTarget = this;

    }

    this._rendered = false;
    this._template = template;

    this.props = new Proxy({}, {
      set(target, prop: string, value) {

        props.set(prop, value);
        return Reflect.set(target, prop, value);

      }
    });

  }

  connectedCallback() {

    if (this._rendered) {

      return;

    }

    this._renderTarget.appendChild(this._template);
    this._rendered = true;

  }
}

export default KragleElement;
