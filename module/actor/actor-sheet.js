import { CallofCthulhu } from '../config.js'
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class CallofCthulhuActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
    classes: ["CallofCthulhu",  "sheet", "actor"],
      template: "systems/callofcthulhu/templates/actor/actor-sheet.html",
      width: 700,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const  data = super.getData();
    
    data.dtypes = ["String", "Number", "Boolean"];
    
    return  data;
  }

/** @override */
activateListeners(html) {
  super.activateListeners(html);

  // Everything below here is only needed if the sheet is editable
  if (!this.options.editable) return;

  // Update Inventory Item
  html.find('.item-edit').click(ev => {
    const li = $(ev.currentTarget).parents(".item");
    const item = this.actor.getOwnedItem(li.data("itemId"));
    item.sheet.render(true);
  });

  // Delete Inventory Item
  html.find('.item-delete').click(ev => {
    const li = $(ev.currentTarget).parents(".item");
    this.actor.deleteOwnedItem(li.data("itemId"));
    li.slideUp(200, () => this.render(false));
  });

  // Add or Remove Attribute
  html.find(".attributes").on("click", ".attribute-control", this._onClickAttributeControl.bind(this));
}

/* -------------------------------------------- */

/** @override */
setPosition(options={}) {
  const position = super.setPosition(options);
  const sheetBody = this.element.find(".sheet-body");
  const bodyHeight = position.height - 192;
  sheetBody.css("height", bodyHeight);
  return position;
}

/**
   * Listen for click events on an attribute control to modify the composition of attributes in the sheet
   * @param {MouseEvent} event    The originating left click event
   * @private
   */
  async _onClickAttributeControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    const attrs = this.object.data.data.attributes;
    const form = this.form;

    // Add new attribute
    if ( action === "create" ) {
      const nk = Object.keys(attrs).length + 1;
      let newKey = document.createElement("div");
      newKey.innerHTML = `<input type="text" name="data.attributes.attr${nk}.key"/>`;
      newKey = newKey.children[0];
      form.appendChild(newKey);
      await this._onSubmit(event);
    }

    // Remove existing attribute
    else if ( action === "delete" ) {
      const li = a.closest(".attribute");
      li.parentElement.removeChild(li);
      await this._onSubmit(event);
    }
  }
    /* -------------------------------------------- */
}
 

 

