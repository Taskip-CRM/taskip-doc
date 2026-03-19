import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'Taskip-CRM',
      name: 'taskip-doc',
    },
  },

  ui: {
    brand: {
      name: 'Taskip Docs',
    },
  },

  singletons: {
    // ── Homepage ─────────────────────────────────────────────
    homepage: singleton({
      label: 'Homepage',
      path: 'src/data/homepage',
      format: 'json',
      schema: {
        title: fields.text({ label: 'Page Title' }),
        description: fields.text({ label: 'Meta Description', multiline: true }),
        heroTagline: fields.text({ label: 'Hero Tagline' }),
        heroPrimaryButton: fields.object(
          {
            text: fields.text({ label: 'Button Text' }),
            link: fields.text({ label: 'Button Link' }),
          },
          { label: 'Hero Primary Button' }
        ),
        featuresSectionTitle: fields.text({ label: 'Features Section Title' }),
        featureCards: fields.array(
          fields.object({
            title: fields.text({ label: 'Card Title' }),
            icon: fields.text({
              label: 'Icon',
              description: 'Starlight icon name (e.g. pencil, open-book, group, puzzle)',
            }),
            description: fields.text({ label: 'Card Description', multiline: true }),
          }),
          { label: 'Feature Cards', itemLabel: (props) => props.fields.title.value }
        ),
      },
    }),
  },

  collections: {
    // ── Getting Started ──────────────────────────────────────
    gettingStarted: collection({
      label: 'Getting Started',
      slugField: 'title',
      path: 'src/content/docs/getting-started/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Meta Description',
          description: 'Short description for SEO and search results.',
          multiline: false,
        }),
        sidebar: fields.object(
          {
            order: fields.number({ label: 'Sidebar Order', defaultValue: 0 }),
            badge: fields.text({ label: 'Badge (e.g. New)', validation: { isRequired: false } }),
          },
          { label: 'Sidebar Options' }
        ),
        content: fields.markdoc({
          label: 'Content',
          components: {},
        }),
      },
    }),

    // ── Features / Guides ─────────────────────────────────────
    guides: collection({
      label: 'Features & Guides',
      slugField: 'title',
      path: 'src/content/docs/guides/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Meta Description',
          multiline: false,
        }),
        sidebar: fields.object(
          {
            order: fields.number({ label: 'Sidebar Order', defaultValue: 0 }),
            badge: fields.text({ label: 'Badge (e.g. Beta)', validation: { isRequired: false } }),
          },
          { label: 'Sidebar Options' }
        ),
        hero: fields.object(
          {
            youtubeId: fields.text({
              label: 'YouTube Video ID',
              description: 'Optional. Paste the YouTube video ID (e.g. dQw4w9WgXcQ) to show a video on this page.',
              validation: { isRequired: false },
            }),
          },
          { label: 'Hero / Video' }
        ),
        content: fields.markdoc({
          label: 'Content',
          components: {},
        }),
      },
    }),
  },
});
