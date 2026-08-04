# Font Inspector

A lightweight Chrome extension that lets you inspect fonts on any webpage. Simply click the extension icon and hover over text to view detailed typography information.

> **Status:** 🚧 Under development. Not yet available on the Chrome Web Store.

## Features

- 🔍 Inspect fonts on any webpage
- 📝 View font family
- 📏 View font size
- ⚖️ View font weight
- 📐 View line height
- 🎨 View text color
- ✨ Clean and modern overlay
- ⚡ Lightweight and fast

## Preview

> Add screenshots or GIFs here.

## Installation (Development)

### Prerequisites

- Node.js 18+
- npm

### Clone the repository

```bash
git clone https://github.com/Nucletic/Font-Inspector.git
cd Font-Inspector
```

### Install dependencies

```bash
npm install
```

### Start development

```bash
npm run dev
```

### Build the extension

```bash
npm run build
```

### Load into Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the generated `dist` folder

## Usage

1. Open any website.
2. Click the **Font Inspector** extension icon.
3. Hover over any text.
4. View the font details in the overlay.

## Tech Stack

- React
- TypeScript
- Vite
- CRXJS
- Chrome Extensions Manifest V3

## Roadmap

- [ ] Chrome Web Store release
- [ ] Copy font information
- [ ] Export typography details
- [ ] Google Fonts detection
- [ ] Keyboard shortcuts
- [ ] Improved accessibility

## Contributing

Contributions, issues, and feature requests are welcome.

## License

MIT
