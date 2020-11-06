import { html, PolymerElement } from '@polymer/polymer/polymer-element'

class MaView extends PolymerElement {
  static get is() {
    return 'ma-view'
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          white-space: normal;
        }
      </style>
      <slot></slot>
    `
  }

  static get properties() {
    return {
      test: String,
    }
  }
}

window.customElements.define(MaView.is, MaView)
