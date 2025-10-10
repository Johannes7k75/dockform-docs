<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vitepress'
import mediumZoom, { MediumZoom } from 'medium-zoom'

const { Layout } = DefaultTheme
const router = useRouter()

let zoomInstance: MediumZoom | null = null
let observer: MutationObserver | null = null

const createOrUpdateZoom = () => {
  // detach previous instance if exists
  if (zoomInstance) {
    try {
      zoomInstance.detach()
    } catch (e) {
      // ignore detach errors
    }
    zoomInstance = null
  }

  // create a new instance and attach to all elements matching the selector
  zoomInstance = mediumZoom('[data-zoomable]', {
    // slightly more transparent backdrop per request
    background: 'rgba(0,0,0,0.6)',
    margin: 48,
    scrollOffset: 80,
    container: document.body,
  })
}

const attachToMutations = (root: Element | Document) => {
  // observe added nodes and attach zoom when new images appear
  if (observer) observer.disconnect()
  observer = new MutationObserver((mutations) => {
    let added = false
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        for (const n of Array.from(m.addedNodes)) {
          if (n instanceof Element && n.querySelector && (n.matches && n.matches('[data-zoomable]') || n.querySelector('[data-zoomable]'))) {
            added = true
            break
          }
        }
      }
      if (added) break
    }
    if (added) {
      // re-create or re-attach so new nodes are included
      createOrUpdateZoom()
    }
  })

  try {
    observer.observe(root, { childList: true, subtree: true })
  } catch (e) {
    // if observing fails, silently ignore
  }
}

onMounted(() => {
  // initial attach
  createOrUpdateZoom()

  // attach a mutation observer to the document content area, prefer .vp-doc if present
  const contentRoot = document.querySelector('.vp-doc') || document.body
  attachToMutations(contentRoot)

  // try to re-apply after client navigation; VitePress router may expose onAfterRouteChange
  if (router && typeof (router as any).onAfterRouteChange === 'function') {
    ;(router as any).onAfterRouteChange(() => {
      // small timeout to allow DOM updates
      setTimeout(createOrUpdateZoom, 50)
    })
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (zoomInstance) {
    try {
      zoomInstance.detach()
    } catch (e) {
      // ignore
    }
    zoomInstance = null
  }
})
</script>

<template>
  <Layout />
</template>

<style>
.medium-zoom-overlay {
  backdrop-filter: blur(5rem);
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
  z-index: 999;
}
</style>
