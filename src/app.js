import { LightningElement } from "lwc";

import { data } from './data';

export default class App extends LightningElement {

  tree = data;

  async handleAddNode(event) {
    event.stopPropagation();

    console.log(event.detail);

    try {
      const result = await this.template.querySelector('c-modal-add-account').openModal();

    }

    catch(e) {}
  }
  
}
