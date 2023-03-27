import nmock from 'nock'
import { VueQueryPlugin } from '@tanstack/vue-query'
import type { GlobalMountOptions } from '@vue/test-utils/dist/types'

export const nock = nmock('http://localhost:8080/api')
export const global: GlobalMountOptions = { plugins: [VueQueryPlugin] }
