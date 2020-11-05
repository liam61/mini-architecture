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
      <h2>Hello {{ title}}!</h2>
      <ma-view
        class$="h-{{ cls}}"
        test="a{{cls}}"
        titlea$=" b{{cls }}"
        style="width: 200px; margin: 0 auto;"
      >
        {{title}}
        <ma-button bindtap="[[handleClick]]">click me</ma-button>
      </ma-view>
    `
    // <ma-button on-click="handleClick">click me</ma-button>
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: 'demo-app',
      },
    }
  }

  handleClick() {
    console.log('target click handler')
    this.title = Math.random().toFixed(3)
  }

  ready() {
    super.ready()
    this.cls = 'test'
  }
}

window.customElements.define('demo-app', DemoApp)
