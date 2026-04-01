import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import markdoc from '@astrojs/markdoc';

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
        Hero: './src/components/Hero.astro',
      },
      sidebar: [
        { label: 'Introduction', autogenerate: { directory: 'introduction' } },
        { label: 'Getting Started', autogenerate: { directory: 'getting-started' } },
        { label: 'Settings', autogenerate: { directory: 'settings' } },
        { label: 'Client Portal', autogenerate: { directory: 'client-portal' } },
        { label: 'Service Catalog', autogenerate: { directory: 'service-catalog' } },
        { label: 'Leads', autogenerate: { directory: 'leads' } },
        { label: 'Sales Pipelines', autogenerate: { directory: 'sales-pipelines' } },
        { label: 'Quotations', autogenerate: { directory: 'quotations' } },
        { label: 'Invoices', autogenerate: { directory: 'invoices' } },
        { label: 'Team Management', autogenerate: { directory: 'team-management' } },
        { label: 'Project Management', autogenerate: { directory: 'project-management' } },
        { label: 'Documents', autogenerate: { directory: 'documents' } },
        { label: 'Forms', autogenerate: { directory: 'forms' } },
        { label: 'Emails', autogenerate: { directory: 'emails' } },
        { label: 'Discussion', autogenerate: { directory: 'discussion' } },
        { label: 'Support Tickets', autogenerate: { directory: 'support-tickets' } },
        { label: 'Meeting Scheduler', autogenerate: { directory: 'meeting-scheduler' } },
        { label: 'Workflow Automation', autogenerate: { directory: 'workflow-automation' } },
        { label: 'Payment Gateway', autogenerate: { directory: 'payment-gateway' } },
        { label: 'Integrations', autogenerate: { directory: 'integrations' } },
        { label: 'Webhooks', autogenerate: { directory: 'webhooks' } },
        { label: 'Public APIs', autogenerate: { directory: 'public-apis' } },
      ],
      head: [
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#00B289' },
        },
        {
          tag: 'link',
          attrs: { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        },
      ],
    }),
    react(),
    markdoc(),
    keystatic(),
  ],
  output: 'server',
  adapter: vercel(),
  security: {
    allowedDomains: [{ hostname: 'docs.taskip.net', protocol: 'https' }],
  },
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
