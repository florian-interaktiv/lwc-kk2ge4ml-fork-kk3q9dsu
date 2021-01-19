import { LightningElement, api } from "lwc";
import { classnames } from './utils';

import { SAVE_ACTION, CANCEL_ACTION } from './modalActions';

export default class ModalAddAccount extends LightningElement {

  modalInstance;

  @api
  async openModal() {

    this.modalInstance = this.template.querySelector('c-lightning-modal');

    this.modalPromise = this.modalInstance.open({
      hasBody: true,
      hasFooter: false,
      title: 'Add account',
      promiseOnClose: 'reject',
      theme: 'alt-inverse',
      size: 'medium'
    });

    return this.modalInstance;
  }

}