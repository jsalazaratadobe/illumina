Let me examine the existing project structure to inform the migration plan.# Illumina Sequencing Platforms Page Migration Plan

## Overview

Migrate the Illumina sequencing platforms page (`https://www.illumina.com/systems/sequencing-platforms.html`) to AEM Edge Delivery Services format within this project.

## Source Page

- **URL**: https://www.illumina.com/systems/sequencing-platforms.html
- **Type**: Product listing/catalog page (sequencing platform product line overview)

## Existing Project Context

- **Available blocks**: hero, cards, columns, tabs, teaser, product-grid, table, faq, embed, form, fragment, search, related-articles, modal, social-share, journey-map, header, footer
- **Content directory**: Already has `content/index.plain.html`
- **Import tooling**: No existing importer infrastructure — needs to be created
- **Design system**: Has theme support (dark/light), responsive breakpoints at 600/900/1200px

## Migration Approach

Using the `excat:excat-site-migration` skill for single-page migration, which orchestrates:
1. Page scraping and content extraction
2. Page structure analysis (sections, blocks, variants)
3. Block mapping to existing blocks or creation of new variants
4. Import infrastructure generation (parsers, transformers)
5. Content import execution and verification

## Key Considerations

- The source page likely contains product cards/grids, hero section, CTAs, and comparison content
- Existing `product-grid` and `cards` blocks may serve well for product listings
- New block variants may be needed for Illumina-specific layouts
- Images will need to be downloaded and referenced locally
- Navigation/header/footer will use existing project blocks

## Checklist

- [ ] Scrape the source page (HTML, images, metadata)
- [ ] Analyze page structure — identify sections, content sequences, and block candidates
- [ ] Map content to existing blocks (hero, cards, product-grid, columns, tabs, etc.)
- [ ] Identify any new block variants needed
- [ ] Create import infrastructure (parsers and transformers)
- [ ] Generate structured HTML content for the page
- [ ] Import content into `/workspace/content/`
- [ ] Preview and verify rendering in local dev server
- [ ] Fix any styling or structural issues
- [ ] Validate against original page appearance

## Execution

This plan requires **Execute mode** to proceed with implementation. The migration will be orchestrated using the page import skill which handles scraping, analysis, block mapping, and content generation in a coordinated workflow.
