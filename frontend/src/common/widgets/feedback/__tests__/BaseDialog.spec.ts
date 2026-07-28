import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BaseDialog from '../BaseDialog.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('BaseDialog initial focus', () => {
  it('can focus the dialog without scrolling to a later action', async () => {
    const wrapper = mount(BaseDialog, {
      attachTo: document.body,
      props: {
        show: true,
        title: 'Compliance',
        initialFocus: 'dialog'
      },
      slots: {
        default: '<a href="#document">Open document</a>'
      }
    })

    await nextTick()
    await nextTick()

    const dialog = document.body.querySelector<HTMLElement>('.modal-content')
    expect(dialog).not.toBeNull()
    expect(document.activeElement).toBe(dialog)

    wrapper.unmount()
  })
})
