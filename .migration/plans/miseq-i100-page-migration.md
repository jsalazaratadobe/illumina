# MiSeq i100 Page Migration Plan

## Objective

Migrate the page at `https://www.illumina.com/systems/sequencing-platforms/miseq-i100.html` to AEM Edge Delivery Services, producing structured HTML content that renders correctly using the existing block library.

## Source Page

- **URL**: https://www.illumina.com/systems/sequencing-platforms/miseq-i100.html
- **Target content path**: `content/systems/sequencing-platforms/miseq-i100.plain.html`

## Available Blocks in Project

| Block | Purpose |
|-------|---------|
| hero | Hero banner with heading, description, and image (light/dark variants) |
| columns | Multi-column layout with text and images |
| cards | Card grid (default, links, bento variants) |
| table | Data tables with header rows |
| tabs | Tabbed content sections |
| teaser | Promotional callout with text and CTA |
| faq | FAQ accordion |
| embed | Video/iframe embeds |
| form | Contact/input forms |
| product-grid | Product showcase grid |

## Migration Approach

Use the `page-import` skill to orchestrate the full migration workflow:

1. **Scrape** the source page — extract HTML, metadata, and download images
2. **Analyze structure** — identify sections, blocks, and content sequences
3. **Map to blocks** — determine which existing blocks best fit each content area
4. **Generate HTML** — produce structured EDS-compatible HTML with proper block tables
5. **Preview & verify** — render locally and compare against original page

## Expected Page Structure (preliminary)

Based on the Illumina product page pattern:

1. **Hero section** — Product name, tagline, hero image of MiSeq i100
2. **Product overview** — Key value propositions (likely columns or default content)
3. **Specifications** — Technical specs (likely table block)
4. **Applications/features** — Use cases and capabilities (cards or tabs)
5. **Resources/CTA** — Downloads, contact info (teaser or columns)
6. **Metadata** — Title, description, keywords

## Risks & Considerations

- The page may contain interactive elements (configurators, carousels) that need simplified representation
- Image assets need downloading and path remapping
- Navigation/footer are handled globally — only migrate page body content
- Some content may require new block variants if existing blocks don't fit

## Checklist

- [ ] Scrape the source page (HTML, images, metadata)
- [ ] Analyze page structure and identify sections
- [ ] Map content to existing blocks (hero, columns, table, cards, tabs, teaser)
- [ ] Determine if any new block variants are needed
- [ ] Generate structured HTML content file
- [ ] Place images in appropriate content directory
- [ ] Preview page locally at dev server
- [ ] Compare rendered output against original page
- [ ] Fix any rendering or styling issues
- [ ] Validate accessibility (headings, alt text, ARIA)
- [ ] Run lint checks on any new/modified code

## Execution

This plan requires **Execute mode** to proceed with implementation. The `page-import` skill will be invoked to handle the end-to-end migration workflow.
