# Component-Based Architecture (React-like Pattern)

This project now uses a **component-based architecture** similar to React functional components, using Nunjucks macros.

## How It Works

### 1. **Component Files** (in `src/_includes/components/`)

Each section type has its own component file that exports a `render` macro (like a React functional component):

- `hero-section.html` - Hero section component
- `text-section.html` - Text section component  
- `image-text-section.html` - Image/text section component
- `collections-section.html` - Collections/events section component

### 2. **Component Structure**

Each component follows this pattern:

```nunjucks
{# Component Name - Like a React Functional Component #}
{% macro render(props) %}
  <section class="...">
    {# Component markup using props #}
    {{ props.title }}
    {{ props.content }}
  </section>
{% endmacro %}
```

### 3. **Using Components** (Like React)

In your page templates (`index.html`, `page-with-sections.html`), you:

**Step 1: Import the components** (like `import` in React)
```nunjucks
{% import "components/hero-section.html" as HeroSection %}
{% import "components/text-section.html" as TextSection %}
{% import "components/image-text-section.html" as ImageTextSection %}
{% import "components/collections-section.html" as CollectionsSection %}
```

**Step 2: Call them with data** (like calling components with props)
```nunjucks
{% for section in homePage.data.sections %}
    {% if section.type == "hero_section" %}
        {{ HeroSection.render(section) }}
    {% elif section.type == "text_section" %}
        {{ TextSection.render(section) }}
    {% elif section.type == "image_text_section" %}
        {{ ImageTextSection.render(section) }}
    {% elif section.type == "collections_section" %}
        {{ CollectionsSection.render(section, collections) }}
    {% endif %}
{% endfor %}
```

## React Comparison

| React | Nunjucks (This Project) |
|-------|------------------------|
| `import Hero from './Hero'` | `{% import "components/hero-section.html" as HeroSection %}` |
| `function Hero(props) { ... }` | `{% macro render(props) %} ... {% endmacro %}` |
| `<Hero title="..." />` | `{{ HeroSection.render(section) }}` |
| `props.title` | `section.title` or `props.title` |

## Benefits

1. **Reusability** - Components can be used anywhere in the project
2. **Maintainability** - Update component logic in one place
3. **Clean Code** - Page templates are much simpler and easier to read
4. **Separation of Concerns** - Each section's logic lives in its own file
5. **Type Safety** - Props are clearly defined in the macro signature

## Example: Creating a New Component

1. Create `/src/_includes/components/my-section.html`:
```nunjucks
{# My Section Component #}
{% macro render(section) %}
  <section class="my-section">
    <h2>{{ section.title }}</h2>
    <p>{{ section.content }}</p>
  </section>
{% endmacro %}
```

2. Import and use in your page:
```nunjucks
{% import "components/my-section.html" as MySection %}

{{ MySection.render(myData) }}
```

## Passing Multiple Props

For components that need multiple data sources (like `collections`):

```nunjucks
{# Component definition #}
{% macro render(section, collections, otherData) %}
  {# Use all props #}
{% endmacro %}

{# Usage #}
{{ CollectionsSection.render(section, collections, otherData) }}
```

## Current Components

### HeroSection.render(section)
**Props:**
- `section.title` - Hero title
- `section.subtitle` - Hero subtitle
- `section.backgroundImage` - Background image URL
- `section.backgroundImageColor` - Background color class
- `section.titleColor` - Title color class
- `section.subtitleColor` - Subtitle color class
- `section.button[]` - Array of button objects

### TextSection.render(section)
**Props:**
- `section.header` - Section header
- `section.body` - Section body content (HTML)
- `section.styleOptions` - "Widget-image" or "Widget-color"
- `section.widgetBackgroundImage` - Background image (if Widget-image)
- `section.widgetColorScheme` - Color scheme (if Widget-color)

### ImageTextSection.render(section)
**Props:**
- `section.header` - Section header
- `section.text` - Text content (HTML)
- `section.image` - Image URL
- `section.imageAlt` - Image alt text
- `section.imagePosition` - "left" or "right"
- `section.styleOptions` - Additional style classes
- `section.button[]` - Array of button objects

### CollectionsSection.render(section, collections)
**Props:**
- `section.header` - Section header
- `section.sectionType` - Collection type (e.g., "events")
- `collections` - Eleventy collections object
