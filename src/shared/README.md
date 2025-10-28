# Shared Module

This directory contains components, hooks, utilities, and services that are shared across multiple features.

## Structure

### Components (Atomic Design)

- **atoms/** - Basic building blocks (Button, Input, Text, Icon, etc.)
- **molecules/** - Simple combinations of atoms (FormField, SearchBox, IconButton)
- **organisms/** - Complex components (Header, Card, Form, Modal)
- **templates/** - Page layout templates (ListTemplate, DetailTemplate, FormTemplate)

### Other Shared Resources

- **hooks/** - Reusable custom hooks (useResource, usePagination, useDebounce)
- **utils/** - Shared utility functions (date formatting, validation, string manipulation)
- **contexts/** - Shared React contexts (beyond theme)
- **services/** - Shared services (logging, analytics, caching)

## Guidelines

- Components in shared/ should be generic and reusable
- Avoid feature-specific logic in shared components
- Use composition over configuration
- Document component props with TypeScript interfaces
- Follow atomic design principles for component organization
