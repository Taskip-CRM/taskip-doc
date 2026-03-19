import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://docs.taskip.net',
  integrations: [
    starlight({
      title: 'Taskip',
      description: 'Official documentation for Taskip — the modern task and project management platform.',
      customCss: ['./src/styles/custom.css'],
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Key Concepts', slug: 'getting-started/key-concepts' },
          ],
        },
        {
          label: 'Features & Guides',
          items: [
            { label: 'Task Management', slug: 'guides/task-management' },
            { label: 'Projects & Boards', slug: 'guides/projects-and-boards' },
            { label: 'Team Collaboration', slug: 'guides/team-collaboration' },
            { label: 'Integrations', slug: 'guides/integrations' },
          ],
        },
      ],
      head: [
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#00B289' },
        },
      ],
    }),
    react(),
    keystatic(),
  ],
  output: 'server',
  adapter: vercel(),
  vite: {
    ssr: {
      // Bundle Keystatic + its deps (yjs, y-indexeddb) into the SSR output
      // instead of treating them as externals — fixes "Could not resolve yjs"
      noExternal: ['@keystatic/core', '@keystatic/astro', '@toeverything/y-indexeddb'],
    },
    optimizeDeps: {
      include: ['yjs'],
    },
  },
});
