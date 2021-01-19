import { LightningElement, api } from "lwc";
import { classnames } from './utils';

export default class Node extends LightningElement {
  
  @api
  node;

  /**
    Children on the same level!
   */
  @api
  children = [];

  @api
  index = 0;

  @api
  isRoot = false;

  featurePointsExpanded = false;

  get hasChildren() {
    return this.node.children && this.node.children.length > 0;
  }

  get featurePointToggleLabel() {
    return this.featurePointsExpanded ? 'Hide all' : 'View all';
  }

  get isFirst() {
    return this.index === 0;
  }

  get isLast() {
    return this.index === this.children.length - 1;
  }

  get isNotLastAndNotRoot() {
    return !this.isLast && !this.isRoot;
  }

  get classes() {

    return classnames({
      'node': true,
      'is-first': this.isFirst,
      'is-last': this.isLast,
      'has-no-children': !this.hasChildren,
      'is-root': this.isRoot,
    });
  }

  get featurePointsListClasses() {
    return classnames({
      'row slds-p-horizontal_medium slds-p-top_medium': true,
      'is-expanded': this.featurePointsExpanded,
    });
  }

  handleFeaturePointToggle(event) {
    this.featurePointsExpanded = !this.featurePointsExpanded;
  }

  handleAddNodeAsParent(event) {
    this.dispatchCreateEvent({
      parent: this.node.Parent__c,
      child: this.node.Id
    });
  }

  handleAddNodeAsChild(event) {
    this.dispatchCreateEvent({
      parent: this.node.Id
    });
  }

  handleAddNodeAsSibling(event) {
    this.dispatchCreateEvent({
      parent: this.node.Parent__c
    });
  }

  dispatchCreateEvent(payload) {
    this.dispatchEvent(
      new CustomEvent(
        'addnode',
        {
          detail: payload,
          bubbles: true,
          composed: true
        }
      )
    )
  }






}
