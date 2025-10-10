import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp(_ctx) {
    // intentionally empty - keep for future enhancements
  }
} satisfies Theme
