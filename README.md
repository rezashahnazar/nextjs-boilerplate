# Next.js RTL Boilerplate

A modern, feature-rich boilerplate for building RTL (Right-to-Left) web applications using Next.js 15, TypeScript, and Tailwind CSS. This project includes a sophisticated UI design inspired by professional design principles, with full RTL support for Persian/Farsi interfaces.

![Next.js RTL Boilerplate](./public/opengraph-image.png)

## Features

- 🚀 **Next.js 15** with App Router and Server Components
- 🎨 **Tailwind CSS** with sophisticated theming and CSS variables
- 📱 **Responsive Design** - Mobile-first approach with fluid layouts
- 🌐 **RTL Support** - Full Right-to-Left layout with Persian typography
- 🎯 **TypeScript** - Type-safe development with strict mode
- 🔍 **SEO Optimized** - Built-in OpenGraph support and metadata API
- 🎭 **shadcn/ui** - Beautiful, accessible components with RTL support
- ♿️ **Accessibility** - WCAG 2.1 compliance and keyboard navigation
- 🌙 **Theme Support** - Elegant light/dark mode with system preference
- 🧩 **Modular Architecture** - Well-organized, maintainable codebase
- 🔒 **Type Safety** - Strict TypeScript configuration
- 📦 **pnpm** - Fast, disk space efficient package manager
- 🔧 **Developer Experience** - ESLint, Prettier, and Git hooks
- 🎯 **Zero Configuration** - Works out of the box
- 🌐 **Internationalization Ready** - Built for Persian/Farsi with i18n support
- 🎨 **Modern Design System** - Professional UI/UX with consistent styling

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended package manager)
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/rezashahnazar/nextjs-boilerplate.git
cd nextjs-boilerplate
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

### Adding shadcn Components

To add new shadcn components:

```bash
pnpx shadcn@latest add <component-name>
```

Common components:

- `button` - Basic button component
- `dialog` - Modal dialogs
- `form` - Form components
- `input` - Text input fields
- `select` - Dropdown select
- `toast` - Notifications

## Project Structure

```
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── api/        # API routes
│   │   └── (routes)/   # Application routes
│   ├── components/      # React components
│   │   ├── ai-ui/      # AI-related components
│   │   ├── brand/      # Branding components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # UI components
│   ├── config/         # Configuration files
│   │   ├── metadata.ts # SEO metadata
│   │   └── site.ts     # Site configuration
│   ├── lib/            # Utility functions
│   │   ├── utils.ts    # Helper functions
│   │   └── fonts.ts    # Font configuration
│   ├── styles/         # Global styles
│   └── services/       # Service layer
├── public/             # Static files
│   ├── fonts/         # Self-hosted fonts
│   └── images/        # Static images
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json      # TypeScript configuration
├── next.config.js     # Next.js configuration
└── package.json       # Project dependencies
```

## Design Philosophy

- Clean, professional UI inspired by modern design principles
- Consistent use of Tailwind classes for styling
- Avoidance of custom CSS classes and global styles
- Component-based architecture with shadcn/ui
- Accessibility-first approach
- Theme-able design using CSS variables and Tailwind

### Design System

#### Colors

- Use semantic color tokens (`foreground`, `background`, etc.)
- Avoid hard-coded colors
- Support both light and dark themes

#### Typography

- Persian-first typography with proper font loading
- Responsive font sizes using Tailwind's size scale
- Proper RTL text alignment and spacing

#### Spacing

- Consistent spacing using Tailwind's spacing scale
- Responsive padding and margins
- Proper RTL layout spacing

## Best Practices

### Development

- Use `min-h-dvh` for full-height layouts
- Implement responsive designs for both mobile and desktop
- Follow accessibility guidelines
- Use Tailwind's utility classes for styling
- Maintain clean, readable component structure
- Use TypeScript for type safety

### Performance

- Optimize images and assets
- Use Next.js Image component
- Implement proper loading states
- Minimize bundle size
- Use proper caching strategies

### Accessibility

- Semantic HTML structure
- ARIA labels where necessary
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript strict mode
- Write meaningful commit messages
- Add proper documentation
- Ensure all tests pass

## Support

If you have any questions or need help, please:

1. Check the documentation
2. Open an issue
3. Contact the maintainers

## Contact

- **Author**: Reza Shahnazar
- **GitHub**: [@rezashahnazar](https://github.com/rezashahnazar)
- **Email**: reza.shahnazar@gmail.com
- **Website**: [shahnazar.com](https://shahnazar.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)
