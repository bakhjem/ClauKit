---
name: mobile-development
description: React Native and Expo best practices for performant mobile apps. Covers list performance, animations (Reanimated), navigation, UI patterns, state management, rendering, monorepo, and configuration. Use when building, reviewing, or refactoring React Native/Expo code.
category: Mobile
status: active
license: MIT
---

# Mobile Development (React Native + Expo)

Comprehensive best practices for React Native and Expo applications from Vercel Engineering. **38+ rules across 8 categories** covering performance, animations, UI patterns, and platform-specific optimizations.

## When to Apply

Reference these guidelines when:
- Building React Native or Expo apps
- Optimizing list and scroll performance
- Implementing animations with Reanimated
- Working with images and media
- Configuring native modules or fonts
- Structuring monorepo projects with native dependencies
- Reviewing mobile code for performance issues

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | List Performance | CRITICAL | `list-performance-` |
| 2 | Animation | HIGH | `animation-` |
| 3 | Navigation | HIGH | `navigation-` |
| 4 | UI Patterns | HIGH | `ui-` |
| 5 | State Management | MEDIUM | `react-state-`, `state-` |
| 6 | Rendering | MEDIUM | `rendering-` |
| 7 | Monorepo | MEDIUM | `monorepo-` |
| 8 | Configuration | LOW | `fonts-`, `imports-`, `js-` |

## Quick Reference

### 1. List Performance (CRITICAL)

- `list-performance-virtualize` — Use FlashList for large lists
- `list-performance-item-memo` — Memoize list item components
- `list-performance-callbacks` — Stabilize callback references
- `list-performance-inline-objects` — Avoid inline style objects
- `list-performance-function-references` — Extract functions outside render
- `list-performance-images` — Optimize images in lists
- `list-performance-item-expensive` — Move expensive work outside items
- `list-performance-item-types` — Use item types for heterogeneous lists

### 2. Animation (HIGH)

- `animation-gpu-properties` — Animate only `transform` and `opacity`
- `animation-derived-value` — Use `useDerivedValue` for computed animations
- `animation-gesture-detector-press` — Use `Gesture.Tap` instead of `Pressable`

### 3. Navigation (HIGH)

- `navigation-native-navigators` — Use native stack and native tabs over JS navigators

### 4. UI Patterns (HIGH)

- `ui-expo-image` — Use `expo-image` for all images
- `ui-image-gallery` — Use Galeria for image lightboxes
- `ui-pressable` — Use `Pressable` over `TouchableOpacity`
- `ui-safe-area-scroll` — Handle safe areas in ScrollViews
- `ui-scrollview-content-inset` — Use `contentInset` for headers
- `ui-menus` — Use native context menus
- `ui-native-modals` — Use native modals when possible
- `ui-measure-views` — Use `onLayout`, not `measure()`
- `ui-styling` — Use `StyleSheet.create` or Nativewind

### 5. State Management (MEDIUM)

- `react-state-minimize` — Minimize state subscriptions
- `react-state-dispatcher` — Use dispatcher pattern for callbacks
- `react-state-fallback` — Show fallback on first render
- `react-compiler-destructure-functions` — Destructure for React Compiler
- `react-compiler-reanimated-shared-values` — Handle shared values with compiler
- `state-ground-truth` — Single source of truth for state
- `scroll-position-no-state` — Don't store scroll position in state

### 6. Rendering (MEDIUM)

- `rendering-text-in-text-component` — Wrap text in `<Text>` components
- `rendering-no-falsy-and` — Avoid falsy `&&` for conditional rendering

### 7. Monorepo (MEDIUM)

- `monorepo-native-deps-in-app` — Keep native dependencies in app package
- `monorepo-single-dependency-versions` — Use single versions across packages

### 8. Configuration (LOW)

- `fonts-config-plugin` — Use config plugins for custom fonts
- `imports-design-system-folder` — Organize design system imports
- `js-hoist-intl` — Hoist `Intl` object creation
- `design-system-compound-components` — Compound component patterns

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/list-performance-virtualize.md
rules/animation-gpu-properties.md
rules/ui-expo-image.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Supplementary References

The `references/` folder contains broader mobile context beyond React Native specifics:

- `mobile-frameworks.md` — React Native vs Expo comparison, when to use each
- `mobile-ios.md` — iOS architecture patterns, HIG, App Store requirements
- `mobile-android.md` — Android architecture patterns, Material Design 3
- `mobile-best-practices.md` — Cross-platform UX, security, accessibility, deployment
- `mobile-debugging.md` — Debugging tools, performance profiling, crash analysis
- `mobile-mindset.md` — Thinking patterns, decision frameworks, common pitfalls

## Related Skills

- `expo` — Expo-specific (build, deploy, upgrade)
- `react-native-best-practices` — Specialized RN performance skill
- `react-native-brownfield-migration` — Migration from native apps
- `upgrading-react-native` — Version upgrades
- `web-design-guidelines` — Web equivalent for cross-platform context

## References

- [Vercel Agent Skills — react-native-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-native-skills) — Source repository
- [React Native](https://reactnative.dev/) — Official docs
- [Expo](https://expo.dev/) — Managed workflow
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) — Animation library
- [FlashList](https://shopify.github.io/flash-list/) — High-performance list
