# TLDR Reader - Chrome Extension

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-v1.0.0-blue.svg)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

> An AI-powered Chrome extension that enhances your web reading experience with intelligent summarization, fact-checking, and contextual assistance.

## 🚀 Features

### 📖 **Focus - Text Enhancement**
- **Word/Concept Clarification**: Hover over complex words for instant definitions
- **Context Analysis**: Understand industry jargon and technical terms
- **Reading Level Adaptation**: Simplify complex sentences
- **Visual Highlighting**: Mark important concepts and key phrases

### 📝 **Summarize - Content Distillation**
- **Article Summarization**: Generate concise key takeaways from any webpage
- **Multiple Summary Lengths**: Bullet points, paragraph, or detailed summaries
- **Section-wise Breakdown**: Summarize specific sections of long articles
- **Key Quote Extraction**: Highlight most important quotes and statements

### ✅ **Cross-check - Fact Verification**
- **Claim Verification**: Identify and fact-check key claims in articles
- **Source Validation**: Check credibility of sources and authors
- **Bias Detection**: Identify potential bias in content
- **Alternative Perspectives**: Show different viewpoints on controversial topics

### 🔍 **Explore - Content Discovery**
- **Related Articles**: Find similar content from reliable sources
- **Topic Deep-dive**: Discover comprehensive resources on subjects
- **Expert Opinions**: Find authoritative voices on topics
- **Historical Context**: Show background information and timeline

### 💬 **Ask Anything - Contextual Q&A**
- **Page-specific Questions**: Ask questions about current article content
- **General Knowledge**: Get instant answers from search engines
- **Follow-up Queries**: Continue conversations about topics
- **Source Citations**: All answers include proper source attribution

## 🛠️ Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (coming soon)
2. Click "Add to Chrome"
3. Confirm the installation
4. The extension icon will appear in your browser toolbar

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/tldr_extension.git
   cd tldr_extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## 🎯 Quick Start

1. **Navigate to any article** on the web
2. **Click the TLDR Reader icon** in your browser toolbar
3. **Use the side panel** to:
   - Get an instant summary of the article
   - Ask questions about the content
   - Explore related topics
   - Save insights to Notion (coming soon)

## 🏗️ Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Chrome browser

### Project Structure
```
tldr_extension/
├── src/
│   ├── content/           # Content scripts for page interaction
│   ├── sidepanel/         # Side panel interface
│   ├── background/        # Service worker
│   ├── options/           # Extension options page
│   └── shared/            # Shared utilities and API functions
├── dist/                  # Built extension files
├── tests/                 # Test files
├── docs/                  # Documentation
├── manifest.json          # Extension manifest
├── webpack.config.js      # Build configuration
└── package.json           # Dependencies and scripts
```

### Available Scripts
```bash
# Development build with watch mode
npm run dev

# Production build
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Environment Variables
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

## 🔧 Configuration

### API Keys Setup
1. **OpenAI API**: Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. **Google Custom Search**: Set up a Custom Search Engine at [Google Programmable Search Engine](https://programmablesearchengine.google.com/)

### Extension Options
- Access options by right-clicking the extension icon and selecting "Options"
- Configure API keys and preferences
- Set reading level preferences
- Customize highlighting colors

## 📱 Usage Guide

### Using the Side Panel
1. **Summarize Tab**: View article summaries in different formats
2. **Ask Tab**: Chat with AI about the current page or general topics
3. **Suggestions Tab**: Discover related articles and resources
4. **Save Tab**: Save insights to Notion (coming soon)

### Text Highlighting
- Important concepts are automatically highlighted
- Hover over highlighted text for definitions and cross-checks
- Click highlighted text for more detailed information

### Keyboard Shortcuts
- `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac): Toggle side panel
- `Ctrl+Shift+H` (Windows/Linux) or `Cmd+Shift+H` (Mac): Toggle highlighting

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --grep "summarization"
```

### Test Coverage
```bash
# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Building for Production
```bash
# Create production build
npm run build:prod

# The built extension will be in the `dist/` folder
```

### Publishing to Chrome Web Store
1. Build the extension for production
2. Create a ZIP file of the `dist/` folder
3. Upload to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
4. Fill in store listing details
5. Submit for review

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style
- Follow the existing code style
- Use ESLint and Prettier for formatting
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Google for the Custom Search API
- The Chrome Extensions team for the excellent documentation
- All contributors and beta testers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yvetteTsai22/tldr_extension/issues)
- **Email**: tsaimc2@gmail.com

## 🔮 Roadmap

### Version 1.1 (Coming Soon)
- [ ] Notion integration for saving insights
- [ ] Reading progress tracking
- [ ] Custom highlighting themes
- [ ] Export summaries to PDF

### Version 1.2 (Planned)
- [ ] Multi-language support
- [ ] Advanced fact-checking
- [ ] Social sharing features
- [ ] Reading analytics

### Version 2.0 (Future)
- [ ] Mobile app companion
- [ ] Team collaboration features
- [ ] Advanced AI models
- [ ] Enterprise features

---

**Made with ❤️ for better reading experiences**

*TLDR Reader - Because every article deserves to be understood.* 