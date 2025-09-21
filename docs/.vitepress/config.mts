import cliSidebar from '../cli/sidebar.mts'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'

export default {
  title: 'Dockform',
  titleTemplate: 'Dockform - :title',
  description: 'IaC for Docker Compose',
  // cleanUrls: true,
  head: [['link', { rel: 'icon', href: '/img/favicon_adaptive.svg', type: 'image/svg+xml' }]],
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          'dockform.yaml': localIconLoader(import.meta.url, '../public/img/icon_adaptive.svg'),
          'dockform': localIconLoader(import.meta.url, '../public/img/icon_adaptive.svg'),
          'docker': 'vscode-icons:file-type-docker',
        },
      })
    ]
  },
  themeConfig: {
    logo: {
      light: '/img/logo_light.svg',
      dark: '/img/logo_dark.svg',
      alt: 'Dockform'
    },
    search: { provider: 'local' },
    nav: [
      { text: 'v0.3.2', link: 'https://github.com/gcstr/dockform/releases/' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Dockform?', link: '/introduction/what_is_dockform' },
            { text: 'Getting Started', link: '/introduction/getting_started' }
          ]
        },
        {
          text: 'The Manifest File',
          items: [
            { text: 'Overview',         link: '/manifest/overview' },
            { text: 'Interpolation',    link: '/manifest/interpolation' },
            { text: 'Secrets Workflow', link: '/manifest/secrets' },
            { text: 'Volumes',          link: '/manifest/volumes' },
            { text: 'Networks',         link: '/manifest/networks' },
            { text: 'Filesets',         link: '/manifest/filesets' },
            { text: 'Applications',     link: '/manifest/applications' },
          ]
        },
        {
          text: 'More',
          items: [
            { text: 'Best Practices',   link: '/more/best_practices' },
            { text: 'Debugging',        link: '/more/debugging' }
          ]
        },
        ...cliSidebar
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/gcstr/dockform' }]
  }
}


