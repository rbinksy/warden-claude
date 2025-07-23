# Wargaming Roster Builder

A modern web application for building and managing wargaming army rosters using BattleScribe data. Built with React, TypeScript, and Tailwind CSS.

## Features

🔍 **Advanced Search & Filtering**
- Fuzzy text search across units, abilities, and rules
- Multi-faceted filtering by faction, category, and points
- Intelligent unit recommendations

🛡️ **Unit Browser**
- Detailed unit cards with stats and abilities
- Comprehensive unit details modal
- Category-based organization

⚔️ **Roster Builder**
- Drag-and-drop roster construction
- Real-time points calculation and validation
- Multiple export formats (JSON, text, BattleScribe XML)

📊 **Data Management**
- BattleScribe XML parsing
- Support for multiple game systems
- Local roster persistence

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Search**: Fuse.js for fuzzy search
- **Testing**: Vitest, React Testing Library
- **Build**: Vite
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wargaming-roster-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx   # Main navigation
│   ├── SearchBar.tsx    # Search and filtering
│   ├── UnitCard.tsx     # Unit display card
│   ├── UnitDetails.tsx  # Unit details modal
│   ├── UnitBrowser.tsx  # Unit browsing interface
│   └── RosterBuilder.tsx # Roster management
├── services/            # Business logic
│   ├── xmlParser.ts     # BattleScribe XML parsing
│   ├── searchService.ts # Search and filtering
│   └── dataService.ts   # Data management
├── stores/              # State management
│   ├── gameStore.ts     # Game data and search state
│   └── rosterStore.ts   # Roster management state
├── types/               # TypeScript definitions
│   ├── battlescribe.ts  # BattleScribe data types
│   └── roster.ts        # Roster-specific types
├── test/                # Test files
│   ├── components/      # Component tests
│   └── services/        # Service tests
└── App.tsx              # Main application component
```

## Data Format

The application uses BattleScribe's XML data format:

- **Game Systems** (.gst files): Core game rules and definitions
- **Catalogues** (.cat files): Faction-specific units and rules
- **Rosters** (.ros files): Player-created army lists

### Supported Game Systems

Currently includes mock data for:
- Warhammer 40,000 10th Edition
- Mock units for demonstration

To add real BattleScribe data:
1. Place .gst and .cat files in the public directory
2. Update the data service to load your files
3. The XML parser will automatically process the data

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow atomic design principles
- Include comprehensive tests

### State Management

The application uses Zustand for state management with two main stores:

- **gameStore**: Game system data, search state, and unit browsing
- **rosterStore**: Roster creation, editing, and persistence

## Testing

### Test Coverage

- Unit tests for services and utilities
- Component tests for UI interactions
- Integration tests for complex workflows

### Running Specific Tests

```bash
# Test a specific file
npm run test -- xmlParser.test.ts

# Test components only
npm run test -- components/

# Run with coverage
npm run test -- --coverage
```

## API Documentation

### Core Services

#### XML Parser Service
```typescript
// Parse game system file
const gameSystem = battleScribeParser.parseGameSystem(xmlContent);

// Parse catalogue file
const units = battleScribeParser.parseCatalogue(xmlContent, gameSystemId);
```

#### Search Service
```typescript
// Search units with filters
const results = searchService.searchUnits(query, {
  faction: 'Adeptus Astartes',
  category: 'Infantry',
  pointsMin: 50,
  pointsMax: 200
});
```

#### Roster Management
```typescript
// Create new roster
createNewRoster(name, gameSystemId, gameSystemName, pointsLimit);

// Add unit to roster
addUnitToRoster(unit, forceId);

// Export roster
const exported = exportRoster('json');
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm run test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow existing code style
- Update documentation as needed
- Ensure TypeScript compliance

## Deployment

### Static Site Deployment

The application builds to static files and can be deployed to:

- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use the built-in Actions workflow

### Environment Variables

No environment variables required for basic functionality.

## Performance

### Optimization Features

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination  
- **Search Debouncing**: 300ms input delay
- **Virtual Scrolling**: For large unit lists
- **Memoization**: Expensive computations cached

### Bundle Size

- Main bundle: ~200KB gzipped
- Vendor chunks: ~100KB gzipped
- Total initial load: ~300KB gzipped

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

**XML Parsing Errors**
- Ensure BattleScribe files are valid XML
- Check file encoding (should be UTF-8)
- Verify game system compatibility

**Search Not Working**
- Clear browser cache and reload
- Check console for JavaScript errors
- Verify game data loaded correctly

**Roster Export Issues**
- Check roster validation status
- Ensure all units have valid point costs
- Try different export formats

### Getting Help

1. Check the [technical design document](./TECHNICAL_DESIGN.md)
2. Review existing [GitHub issues](https://github.com/your-repo/issues)
3. Create a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and version info

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [BattleScribe](https://www.battlescribe.net/) for the data format specification
- [BSData](https://github.com/BSData) community for maintaining game data
- React and TypeScript communities for excellent tooling
- All contributors and testers

## Roadmap

### Version 1.1
- [ ] Real BattleScribe file loading
- [ ] Advanced roster validation
- [ ] Print-friendly layouts

### Version 1.2
- [ ] Multi-game system support
- [ ] Cloud roster synchronization
- [ ] Mobile responsiveness improvements

### Version 2.0
- [ ] Real-time collaboration
- [ ] Tournament management
- [ ] Advanced analytics

---

Built with ❤️ for the wargaming community