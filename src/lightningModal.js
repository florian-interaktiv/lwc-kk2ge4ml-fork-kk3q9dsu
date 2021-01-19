import { LightningElement, track, api } from 'lwc';
import { classnames, keyGenerator } from './utils';
import {
  CANCEL_ACTION,
  CONFIRM_ACTION,
  CLOSE_ACTION
} from './modalActions';

// import LightningModalButtonCancel from '@salesforce/label/c.LightningModalButtonCancel';
// import LightningModalButtonSave from '@salesforce/label/c.LightningModalButtonSave';
// import LightningModalButtonConfirm from '@salesforce/label/c.LightningModalButtonConfirm';

const ACTIONS = {
  CANCEL_ACTION,
  CONFIRM_ACTION,
  CLOSE_ACTION
};


/**
 * Default message if no message provided.
 */
const DEFAULT_MESSAGE = 'Are you sure?';

/**
 * Default headline if no headline provided.
 */
const DEFAULT_HEADLINE = 'Default Headline';

/**
 * Component to display a modal window.
 * 
 * Can display different types of modals:
 * - Custom modal with own body, header and footer.
 * - prompt modal with message and confirm, reject buttons
 * 
 * Modals can be configured in their theme.
 *
 * @export
 * @class LightningModal
 * @extends {LightningElement}
 */
export default class LightningModal extends LightningElement {

  /**
   * Modal opened state.
   *
   * @memberof LightningModal
   */
  @track
  isOpen = false;

  /**
   * Current options for displaying.
   *
   * @memberof LightningModal
   */
  @track
  options = {};

  /**
   * Container for resolving
   * and rejection function.
   *
   * @memberof LightningModal
   */
  promiseHandler = {};

  /**
   * Indicator if modal has another component as body
   *
   * @memberof LightningModal
   */
  hasBody = false;

  /**
   * Open function that returns promise.
   * Promise gets resolved when user clicks
   * on single action.
   *
   * @param {*} options
   * @returns
   * @memberof LightningModal
   */
  @api
  open(options) {
    // prepare config argument for configure modal
    this.prepareOptions(options);

    // open modal
    this.isOpen = true;

    // return the promise
    return new Promise((resolve, reject) => {
      this.promiseHandler = {
        resolve,
        reject
      };
    });
  }

  /**
   * Closes current modal.
   *
   * @memberof LightningModal
   */
  @api
  close() {
    this.isOpen = false;
  }

  /**
   * Returns modal container classes.
   *
   * @readonly
   * @memberof PromptModal
   */
  get modalClasses() {
    return classnames({
      'slds-modal': true,
      'slds-modal_prompt': false,
      'slds-fade-in-open': this.isOpen,
      [`slds-modal_${this.options.size || 'small'}`]: true
    });
  }

  /**
   * Returns backdrop classes.
   *
   * @readonly
   * @memberof LightningModal
   */
  get backdropClasses() {
    return classnames({
      'slds-backdrop': true,
      'slds-backdrop_open': this.isOpen
    });
  }

  /**
   * Returns modal header classes.
   *
   * @readonly
   * @memberof LightningModal
   */
  get modalHeaderClasses() {
    return classnames({
      'slds-modal__header': true,
      [`slds-theme_${this.options.theme || 'alt-inverse'}`]: true
    });
  }

  /**
   * Returns modal body classes.
   *
   * @readonly
   * @memberof PromptModal
   */
  get modalBodyClasses() {
    return classnames({
      'slds-modal__content': true,
      'no-footer': !this.options.hasFooter,
      'slds-p-around_medium': !(this.options && this.options.hasBody),
      'full-height': (this.options && this.options.fullHeight)
    })
  }

  /**
   * Returns modal footer classes.
   *
   * @readonly
   * @memberof LightningModal
   */
  get modalFooterClasses() {
    return classnames({
      'slds-modal__footer': true,
      'slds-theme_default': true
    });
  }

  /**
   * Invokes closing the modal
   * and resolves or rejects modal promise. 
   *
   * @memberof LightningModal
   */
  @api
  closeModalHandler(promiseResult, promiseValue = {}) {

    if (this.options.promiseOnClose || promiseResult) {
      this.promiseHandler[typeof promiseResult === 'string' ? promiseResult : this.options.promiseOnClose](promiseValue);
    }

    this.close();
  }

  /**
   * Prepares options from modal config.
   * Maps actions array and builds elements
   * from default actions or String actions.
   * 
   *
   * @param {*} { actions, ...config}
   * @memberof LightningModal
   */
  prepareOptions({ actions, ...config}) {

    // new config element
    const newOptions = {
      hasBody: false,
      hasFooter: true,
      promiseOnClose: 'reject',
      size: 'small',
      theme: 'alt-inverse',
      modalKey: 'default',
      fullHeight: false,
      ...config
    };

    // when no actions provided, just use default actions
    if (!actions || !Array.isArray(actions)) {
      newOptions.actions = [
        {
          ...CONFIRM_ACTION,
          ...keyGenerator()
        },
        {
          ...CANCEL_ACTION,
          ...keyGenerator()
        }
      ];
    }

    // build action array
    else {
      newOptions.actions = actions.map(action => {
        // when action is string like 'ACTION.CANCEL', search for default
        // action in action library.
        if (typeof action === 'string') {
          return {
            ...(ACTIONS[action] || ACTIONS.CLOSE_ACTION),
            // add key property for each action
            ...keyGenerator()
          }
        } 

        return {
          ...action,
          // add key property for each action
          ...keyGenerator()
        };
      });
    }

    this.options = newOptions;
  }

  /**
   * Returns modal title from config.
   *
   * @readonly
   * @memberof LightningModal
   */
  get title() {
    return this.options && this.options.title ? this.options.title : DEFAULT_HEADLINE;
  }

  /**
   * Returns message from config.
   *
   * @readonly
   * @memberof LightningModal
   */
  get message() {
    return this.options && this.options.message ? this.options.message : DEFAULT_MESSAGE;
  }

  /**
   * Click handler for actions.
   * Resolves actionEvent data param.
   *
   * @param {*} event
   * @memberof LightningModal
   */
  handleActionClick(event) {
    this.close();
    if (event.target.dataset.actionEvent === 'cancel') {
      this.promiseHandler.reject(event.target.dataset.actionEvent);
    }

    else {
      this.promiseHandler.resolve(event.target.dataset.actionEvent);
    }
  }

  /**
   * Handles content action event fired by inner component.
   * Resolves promise for caller component.
   *
   * @param {*} event
   * @memberof LightningModal
   */
  handleContentAction(event) {
    event.preventDefault();
    event.stopPropagation();

    const { detail: {
      data = {},
      promiseType = 'resolve'
    }} = event;

    this.close();
    this.promiseHandler[promiseType]({ data });
  }
}