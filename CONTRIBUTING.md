# Contributing to Sportification

Thank you for your interest in contributing to Sportification! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or derogatory comments
- Trolling or insulting/derogatory comments
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- React Native development environment set up
- iOS: Xcode (for iOS development)
- Android: Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SlenderShield/sportification_fe.git
   cd sportification_fe/Sportification
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

### Project Structure

```
Sportification/
├── src/
│   ├── core/              # Core application logic
│   ├── features/          # Feature modules
│   ├── shared/            # Shared components and utilities
│   ├── navigation/        # Navigation configuration
│   ├── store/             # Redux store
│   ├── theme/             # Theming system
│   └── assets/            # Static assets
├── __tests__/             # Test files
├── .eslintrc.js           # ESLint configuration
├── .prettierrc.js         # Prettier configuration
└── tsconfig.json          # TypeScript configuration
```

## Development Workflow

### 1. Create a Branch

Create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation changes
- `test/` - Test additions or changes

### 2. Make Changes

- Follow the [Coding Standards](./CODING_STANDARDS.md)
- Write tests for new functionality
- Update documentation as needed
- Keep commits small and focused

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Run tests
npm test

# Test on devices
npm run ios
npm run android
```

### 4. Commit Your Changes

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**

```bash
git commit -m "feat(auth): add biometric authentication support"
git commit -m "fix(matches): resolve duplicate match creation issue"
git commit -m "docs(readme): update installation instructions"
```

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to the repository on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill out the PR template
5. Request review from maintainers

## Coding Standards

Please read our comprehensive [Coding Standards](./CODING_STANDARDS.md) document. Key points:

### TypeScript

- Always use explicit types
- Avoid `any` type
- Use interfaces for object shapes
- Use proper null safety with optional chaining

### React Native

- Use functional components with hooks
- Define prop interfaces
- Use `React.memo` for performance when appropriate
- Follow atomic design principles

### File Naming

- Components: PascalCase (`Button.tsx`)
- Hooks: camelCase with 'use' prefix (`useAuth.ts`)
- Utilities: camelCase (`dateUtils.ts`)
- Types: PascalCase with `.types.ts` suffix

### Code Organization

1. External dependencies
2. Internal dependencies (absolute imports)
3. Relative imports
4. Types
5. Styles

### Error Handling

- Use try-catch for async operations
- Provide user-friendly error messages
- Log errors with the logger service
- Don't use `console.log` in production code

## Submitting Changes

### Pull Request Process

1. **Update Documentation**: Ensure all documentation is up to date
2. **Add Tests**: All new features must have tests
3. **Pass CI Checks**: Ensure all automated checks pass
4. **Code Review**: Address feedback from reviewers
5. **Squash Commits**: Keep PR history clean (optional, based on maintainer preference)

### Pull Request Template

Your PR should include:

- **Description**: Clear description of what changes were made
- **Motivation**: Why this change was needed
- **Testing**: How the changes were tested
- **Screenshots**: For UI changes
- **Breaking Changes**: List any breaking changes
- **Related Issues**: Link to related issues

### Code Review Guidelines

**For Authors:**
- Respond to feedback promptly
- Be open to suggestions
- Explain your approach if questioned
- Update code based on feedback

**For Reviewers:**
- Be constructive and respectful
- Focus on code quality and standards
- Suggest alternatives when criticizing
- Approve when standards are met

## Testing Guidelines

### Unit Tests

Test individual functions and components:

```typescript
describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    expect(calculateTotal(100, 0.1)).toBe(110);
  });
  
  it('should handle zero tax rate', () => {
    expect(calculateTotal(100, 0)).toBe(100);
  });
});
```

### Component Tests

Test component behavior:

```typescript
describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click" onPress={onPress} />);
    
    fireEvent.press(getByText('Click'));
    
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Tests

Test custom hooks:

```typescript
describe('useDebounce', () => {
  it('should debounce value updates', () => {
    jest.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );
    
    expect(result.current).toBe('initial');
    
    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');
    
    jest.advanceTimersByTime(500);
    expect(result.current).toBe('updated');
  });
});
```

### Test Coverage

- Aim for 80%+ code coverage
- Focus on critical business logic
- Test edge cases and error scenarios
- Don't test implementation details

## Documentation

### Code Comments

- Use JSDoc for public APIs
- Explain complex algorithms
- Don't state the obvious
- Keep comments up to date

### Component Documentation

Document component props:

```typescript
/**
 * A customizable button component
 * 
 * @param title - Button text to display
 * @param onPress - Callback fired when button is pressed
 * @param disabled - Whether the button is disabled
 * 
 * @example
 * ```tsx
 * <Button
 *   title="Submit"
 *   onPress={handleSubmit}
 *   disabled={isLoading}
 * />
 * ```
 */
```

### README Updates

Update relevant README files when:
- Adding new features
- Changing API interfaces
- Updating dependencies
- Modifying build process

## Getting Help

### Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Refactoring Plan](./REFACTORING_PLAN.md)

### Communication

- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions
- **Discussions**: For general questions and ideas

### Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Ask in GitHub Discussions
4. Contact maintainers

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors page

Thank you for contributing to Sportification! Your efforts help make this project better for everyone.

---

**Document Version**: 1.0  
**Last Updated**: October 2024  
**Maintained By**: Development Team
