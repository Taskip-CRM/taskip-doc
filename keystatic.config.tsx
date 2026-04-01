import { config, fields, collection, singleton } from '@keystatic/core';

// Reusable doc collection factory
function docCollection(label: string, path: string) {
  return collection({
    label,
    slugField: 'title',
    path: `src/content/docs/${path}/*`,
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
      youtubeId: fields.text({
        label: 'YouTube Video ID',
        description:
          'Optional. Paste the YouTube video ID (e.g. dQw4w9WgXcQ) to show a video after the page title.',
        validation: { isRequired: false },
      }),
      content: fields.markdoc({
        label: 'Content',
        components: {},
      }),
    },
  });
}

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
    // ── Introduction ─────────────────────────────────────────
    introduction: docCollection('Introduction', 'introduction'),

    // ── Getting Started ──────────────────────────────────────
    gettingStarted: docCollection('Getting Started', 'getting-started'),

    // ── Settings ─────────────────────────────────────────────
    settings: docCollection('Settings', 'settings'),

    // ── Client Portal ─────────────────────────────────────────
    clientPortal: docCollection('Client Portal', 'client-portal'),

    // ── Service Catalog ───────────────────────────────────────
    serviceCatalog: docCollection('Service Catalog', 'service-catalog'),

    // ── Leads ────────────────────────────────────────────────
    leads: docCollection('Leads', 'leads'),

    // ── Sales Pipelines ───────────────────────────────────────
    salesPipelines: docCollection('Sales Pipelines', 'sales-pipelines'),

    // ── Quotations ────────────────────────────────────────────
    quotations: docCollection('Quotations', 'quotations'),

    // ── Invoices ─────────────────────────────────────────────
    invoices: docCollection('Invoices', 'invoices'),

    // ── Team Management ───────────────────────────────────────
    teamManagement: docCollection('Team Management', 'team-management'),

    // ── Project Management ────────────────────────────────────
    projectManagement: docCollection('Project Management', 'project-management'),

    // ── Documents ────────────────────────────────────────────
    documents: docCollection('Documents', 'documents'),

    // ── Forms ────────────────────────────────────────────────
    forms: docCollection('Forms', 'forms'),

    // ── Emails ───────────────────────────────────────────────
    emails: docCollection('Emails', 'emails'),

    // ── Discussion ───────────────────────────────────────────
    discussion: docCollection('Discussion', 'discussion'),

    // ── Support Tickets ───────────────────────────────────────
    supportTickets: docCollection('Support Tickets', 'support-tickets'),

    // ── Meeting Scheduler ─────────────────────────────────────
    meetingScheduler: docCollection('Meeting Scheduler', 'meeting-scheduler'),

    // ── Workflow Automation ───────────────────────────────────
    workflowAutomation: docCollection('Workflow Automation', 'workflow-automation'),

    // ── Payment Gateway ───────────────────────────────────────
    paymentGateway: docCollection('Payment Gateway', 'payment-gateway'),

    // ── Integrations ─────────────────────────────────────────
    integrations: docCollection('Integrations', 'integrations'),

    // ── Webhooks ─────────────────────────────────────────────
    webhooks: docCollection('Webhooks', 'webhooks'),

    // ── Public APIs ───────────────────────────────────────────
    publicApis: docCollection('Public APIs', 'public-apis'),
  },
});
