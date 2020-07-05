import { html, PolymerElement } from '@polymer/polymer/polymer-element'
import 'hammerjs'
import './view'
import './button'

class DemoApp extends PolymerElement {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          text-align: center;
        }
      </style>
      <h2>Hello [[title]]!</h2>
      <my-view style="width: 200px; margin: 0 auto;">
        <my-button bindtap="[[handleClick]]">click me</my-button>
      </my-view>
    `
    // <my-button on-click="handleClick">click me</my-button>
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: 'demo-app',
        reflectToAttribute: true,
      },
    }
  }

  handleClick() {
    console.log('target click handler')
    this.title = Math.random().toFixed(3) + ''
  }

  ready() {
    super.ready()
  }
}

window.customElements.define('demo-app', DemoApp)
