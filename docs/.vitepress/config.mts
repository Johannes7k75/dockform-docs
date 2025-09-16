import cliSidebar from '../cli/sidebar.mts'

export default {
  title: 'Dockform',
  titleTemplate: 'Dockform - :title',
  description: 'IaC for Docker Compose',
  // cleanUrls: true,
  head: [['link', { rel: 'icon', href: '/img/favicon_adaptive.svg', type: 'image/svg+xml' }]],
  themeConfig: {
    logo: {
      light: '/img/logo_light.svg',
      dark: '/img/logo_dark.svg',
      alt: 'Dockform'
    },
    search: { provider: 'local' },
    nav: [
      { text: 'v0.2.2', link: 'https://github.com/gcstr/dockform/releases/' }
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
            { text: 'Managed Volumes',  link: '/manifest/volumes' },
            { text: 'Networks',         link: '/manifest/networks' },
            { text: 'Filesets',         link: '/manifest/filesets' },
            { text: 'Applications',     link: '/manifest/applications' },
            { text: 'Good Practices',   link: '/manifest/good_practices' }
          ]
        },
        ...cliSidebar
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/gcstr/dockform' }]
  }
}


