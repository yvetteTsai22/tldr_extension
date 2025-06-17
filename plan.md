# TLDR Reader - Chrome Extension

## Project Overview
Build a Chrome extension that enhances web reading experience with AI-powered features, including text analysis, summarization, fact-checking, and contextual assistance.

## Core Features

### 1. Focus - Text Enhancement
- **Word/Concept Clarification**: Hover or select complex words to get instant definitions and explanations
- **Context Analysis**: Understand industry jargon, technical terms, and domain-specific language
- **Reading Level Adaptation**: Simplify complex sentences and paragraphs
- **Visual Highlighting**: Mark important concepts and key phrases

### 2. Summarize - Content Distillation
- **Article Summarization**: Generate concise key takeaways from any webpage
- **Multiple Summary Lengths**: Bullet points, paragraph, or detailed summaries
- **Section-wise Breakdown**: Summarize specific sections of long articles
- **Key Quote Extraction**: Highlight most important quotes and statements

### 3. Cross-check - Fact Verification
- **Claim Verification**: Identify and fact-check key claims in articles
- **Source Validation**: Check credibility of sources and authors
- **Bias Detection**: Identify potential bias in content
- **Alternative Perspectives**: Show different viewpoints on controversial topics

### 4. Explore - Content Discovery
- **Related Articles**: Find similar content from reliable sources
- **Topic Deep-dive**: Discover comprehensive resources on subjects
- **Expert Opinions**: Find authoritative voices on topics
- **Historical Context**: Show background information and timeline

### 5. Ask Anything - Contextual Q&A
- **Page-specific Questions**: Ask questions about current article content
- **General Knowledge**: Get instant answers from search engines
- **Follow-up Queries**: Continue conversations about topics
- **Source Citations**: All answers include proper source attribution

## Technical Architecture

### Frontend Components
```
├── Content Scripts
│   ├── side-panel.js          # Expandable side panel logic
│   ├── text-highlighter.js    # Progressive highlighting system
│   ├── hover-tooltip.js       # Cross-check hover functionality
│   └── page-analyzer.js       # Article content extraction
├── Side Panel Interface
│   ├── side-panel.html        # Main side panel UI
│   ├── chat-interface.js      # Ask Anything chat component
│   ├── summarizer.js          # Article summarization display
│   ├── suggestions.js         # Related content suggestions
│   └── notion-integration.js  # Save to Notion functionality
└── Background Scripts
    ├── service-worker.js      # Main background logic
    ├── api-manager.js         # API calls management
    └── web-search.js          # Search API integration
```

### Backend Integration
- **AI APIs**: OpenAI/Anthropic/Vertexai(Gemini) for text processing and Q&A
- **Search APIs**: Google Search API or Bing or Tavily for fact-checking
- **NLP Services**: For text analysis and entity extraction
- **Database**: Chrome Storage API for caching and user data

## User Interface Design

### 1. Extension as an Expandable Side Panel
- **Summarize**: Key takeaways of the article in bullet points with references
- **Ask Anything**: Chat interface to ask questions based on current page or general internet knowledge
- **Suggestions**: Web search results showing related web pages and resources
- **Save to Notion** (Stretch): Small button to save insights directly to Notion workspace

### 2. Reading Enhancements
- **Progressive Highlighting**: Inline underscoring of information that stands out on the page
- **Cross-check**: Hover over highlighted concepts to see definitions and cross-check results from internet sources

## Implementation Phases - 2 Hour Sprint

### Phase 1: Setup & Foundation
- [ ] Chrome extension boilerplate with Manifest V3
- [ ] Basic folder structure creation
- [ ] Content script injection setup
- [ ] Side panel HTML structure and basic CSS
- [ ] Test extension loading and side panel toggle

### Phase 2: Side Panel Core
- [ ] Expandable side panel functionality (slide in/out)
- [ ] Article content extraction from webpage
- [ ] Basic side panel sections (Summarize, Ask, Suggestions)
- [ ] Simple styling for side panel interface
- [ ] Test side panel interaction

### Phase 3: AI Features Integration
- [ ] Article summarization with bullet points
- [ ] Chat interface for "Ask Anything" feature
- [ ] Web search API for suggestions
- [ ] Progressive highlighting system for key concepts
- [ ] Basic hover tooltips for cross-checking

### Phase 4: Interactive Features
- [ ] Connect chat interface to AI API
- [ ] Display search suggestions in side panel
- [ ] Implement hover-based cross-checking
- [ ] Add loading states for all AI features
- [ ] Test all features working together

### Phase 5: Final Polish
- [ ] Quick UI/UX improvements
- [ ] Ensure side panel responsiveness
- [ ] Basic error handling for failed API calls
- [ ] Test on multiple websites

## Technical Specifications

### Manifest V3 Configuration
```json
{
  "manifest_version": 3,
  "name": "Wise Reader",
  "version": "1.0.0",
  "permissions": [
    "activeTab",
    "storage",
    "scripting",
    "sidePanel"
  ],
  "host_permissions": [
    "https://*/*",
    "http://*/*"
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/main.js"],
      "css": ["content/styles.css"]
    }
  ],
  "background": {
    "service_worker": "background/service-worker.js"
  },
  "side_panel": {
    "default_path": "sidepanel/panel.html"
  },
  "action": {
    "default_title": "Open Wise Reader"
  }
}
```

### API Integration Strategy
1. **Primary AI Service**: OpenAI GPT-4 for text processing
2. **Backup Service**: Anthropic Claude for redundancy
3. **Search Integration**: Google Custom Search API
4. **Fact-checking**: Integration with fact-checking APIs
5. **Rate Limiting**: Implement request queuing and caching

## MVP Focus - 2 Hour Build

### MVP Checklist (2-Hour Build)

- [ ] Chrome extension loads and injects a content script
- [ ] Expandable side panel with toggle button
- [ ] Extract main article content from the current page
- [ ] Summarize article as bullet points (using OpenAI API)
- [ ] Simple chat interface for "Ask Anything" (using OpenAI API)
- [ ] Highlight a few key concepts/phrases in the article
- [ ] Show tooltip with a definition when hovering over a highlighted word (use a simple dictionary API or static mapping)
- [ ] Display related suggestions (basic Google Custom Search API integration, if time allows)
- [ ] Minimal, functional CSS for side panel and highlights

### Quick Implementation Notes
- Use Chrome's side panel API for smooth integration
- Simple article extraction using DOM parsing
- Direct API calls to OpenAI for chat and summarization
- Google Custom Search API for suggestions
- Basic CSS for functional side panel (style later)
- Focus on core functionality over complex UI

## Success Metrics

### User Engagement
- Daily active users
- Feature usage frequency
- Time spent reading with extension
- User retention rates

### Feature Performance
- Summary accuracy ratings
- Fact-check success rate
- Query response time
- User satisfaction scores

## Monetization Strategy (Future)
- **Freemium Model**: Basic features free, advanced features premium
- **Usage Limits**: API call limits for free tier
- **Premium Features**: Advanced AI models, unlimited queries
- **Enterprise Version**: Team features and analytics

## Development Tools & Setup

### Required Tools
- **IDE**: Cursor (as specified)
- **Version Control**: Git with GitHub integration
- **Testing**: Jest for unit tests, Playwright for E2E
- **Build Tool**: Webpack or Vite for bundling
- **Linting**: ESLint and Prettier for code quality

### Development Environment
```bash
# Project structure
tldr-extension/
├── src/
│   ├── content/
│   │   ├── main.js            # Content script entry
│   │   ├── highlighter.js     # Progressive highlighting
│   │   └── styles.css         # Page styling
│   ├── sidepanel/
│   │   ├── panel.html         # Side panel interface
│   │   ├── panel.js           # Side panel logic
│   │   ├── chat.js            # Chat functionality
│   │   └── panel.css          # Side panel styling
│   ├── background/
│   │   └── service-worker.js  # Background script
│   └── shared/
│       └── api.js             # Shared API functions
├── manifest.json
├── tests/
├── docs/
└── package.json
```

## Next Steps
1. **Environment Setup**: Initialize project with Cursor
2. **API Research**: Evaluate AI service options and pricing
3. **Prototype Development**: Build minimal viable product
4. **User Testing**: Get feedback from beta users
5. **Iterative Improvement**: Refine based on user feedback

---

*This plan serves as a living document that should be updated as development progresses and requirements evolve.*