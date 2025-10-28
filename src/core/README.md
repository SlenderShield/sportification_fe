# Core Module

This directory contains core application logic and infrastructure that is shared across all features.

## Structure

- **config/** - Application configuration (API endpoints, environment settings)
- **constants/** - Global constants and enums
- **types/** - Global TypeScript type definitions and interfaces
- **errors/** - Error handling utilities and custom error classes

## Purpose

The core module provides the foundational elements that the entire application depends on:
- Configuration management
- Global type definitions
- Error handling infrastructure
- Application-wide constants

## Guidelines

- Keep this module dependency-free (no feature imports)
- Only include truly global utilities and types
- Maintain clear separation between core and feature-specific code
