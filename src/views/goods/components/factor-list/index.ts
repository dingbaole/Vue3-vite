import { h, render, ref } from 'vue'
import type { Component, Ref } from 'vue'
export class CreateModal {
  component: Component
  ref: Ref
  constructor(component: Component) {
    this.component = component
    this.ref = ref()
    this.init()
  }
  init() {
    const dom = document.createElement('div')
    document
      .querySelector('body')
      .insertBefore(dom, document.querySelector('body').firstChild)

    render(h(this.component, { attrs: { ref: () => this.ref } }), dom)
  }
  show() {
    // console.log(this.component.$el)
    return this.ref
  }
}
