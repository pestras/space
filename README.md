# Space

**Space** library for canvas drawings.

## Architecture:

### Space

A singleton wrapper to all components.

**Features:**
- Theming.
- Zooming.
- Panning.

### Layer

A wrapper to a group of components.

**Features:**
- Theming.
- Order of Components.
- Nesting.

### Group

A group of components that can be treated as a single component.

**Features:**
- Single transformation.

### Component

A drawing shape can be basic or complex or a group of shapes.

**Features:**
- Basic Shapes:
  - Point.
  - Circle.
  - Texts.
- Complext Shapes
  - Lines.
  - Ellipses.
  - Rectangles.
  - Paths.
  - Polygons.

## Behaviors:

### Transformation

Components can be translated, scaled and rotated.

## Static

Static components are components that cannot be transformed.

## Styling

Components by default inherit layer theme, which can be overwritten on a single component.

### Linking

Components can be linked together as parent child pattern, Where each child position will be relative to its parent.

**Atomic Linking:** Complex shapes can be linked partialy to parents for instance a line
can have two parents for each of his end points.

### Events

Components can listen to user events:
- Mouse Clicks.
- Drag & Drop.
- Mouseenter & Mouseleave.
- keyboard keypress.

## Extending:

### New Components

With group feature new components can be defined that are composed from simpler components.

### Styling

Multiple styles can be defined and reused on layer or component scope.

**Style Attributes**
- fills:
  - plain color.
  - gradiants. 
- stroke: 
  - color.
  - stroke width.
  - line cap.
  - line join.
  - stroke style
    - solid
    - dotted
    - dashed
- font
  - family
  - color
  - size
  - weight
  - style
- opacity