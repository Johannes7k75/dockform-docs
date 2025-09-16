import { defineConfig } from 'vitepress'
import cliSidebar from '../docs/cli/sidebar.mts'

export default defineConfig({
  title: 'Dockform',
  titleTemplate: 'Dockform - :title',
  description: 'IaC for Docker Compose',
  head: [['link', { rel: 'icon', href: '/img/favicon_adaptive.svg', type: 'image/svg+xml' }]],
  themeConfig: {
    logo: {
      light: '/img/logo_light.svg',
      dark: '/img/logo_dark.svg',
      alt: 'Dockform'
    },
    search: { provider: 'local' },
    nav: [
      { text: 'Documentation', link: '/docs/introduction/what_is_dockform' },
      { text: 'CLI Reference', link: '/docs/cli/dockform' },
      { text: 'v0.2.1', link: 'https://github.com/gcstr/dockform/releases/' }
    ],

    // OBJECT form:
    sidebar: {
      '/docs/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Dockform?', link: '/docs/introduction/what_is_dockform' },
            { text: 'Getting Started',   link: '/docs/introduction/getting_started' }
          ]
        },
        {
          text: 'The Manifest File',
          items: [
            { text: 'Overview',         link: '/docs/manifest/overview' },
            { text: 'Interpolation',    link: '/docs/manifest/interpolation' },
            { text: 'Secrets Workflow', link: '/docs/manifest/secrets' },
            { text: 'Managed Volumes',  link: '/docs/manifest/volumes' },
            { text: 'Networks',         link: '/docs/manifest/networks' },
            { text: 'Filesets',         link: '/docs/manifest/filesets' },
            { text: 'Applications',     link: '/docs/manifest/applications' },
            { text: 'Good Practices',   link: '/docs/manifest/good_practices' }
          ]
        },
        ...cliSidebar
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/gcstr/dockform' }]
  }
})
