# Assets Guide

This app requires some image assets. You can create placeholder images or use your own police department branding.

## Required Assets

Place these files in the `assets/` folder:

### 1. `assets/icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: App icon
- **Design**: Use your police department logo or badge

### 2. `assets/splash.png`
- **Size**: 1242x2436 pixels (iPhone X size) or 1284x2778 pixels
- **Format**: PNG
- **Purpose**: Splash screen image
- **Design**: Display app logo, name, and loading indicator

### 3. `assets/adaptive-icon.png` (Android)
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Purpose**: Android adaptive icon foreground
- **Design**: App icon that works on various Android launcher shapes

### 4. `assets/favicon.png` (Web)
- **Size**: 48x48 pixels or 96x96 pixels
- **Format**: PNG
- **Purpose**: Web favicon
- **Design**: Simplified app icon

## Quick Solution

If you want to test the app immediately without creating custom assets, you can:

1. Create simple placeholder images using any image editor
2. Use online icon generators
3. Temporarily remove the asset references from `app.json` (though this may cause warnings)

## Creating Placeholder Assets

You can use any image editor or online tool to create these. For a quick start:

1. Use a solid color background (#1a1a2e to match the app theme)
2. Add text or a simple icon
3. Export as PNG

The app will function without these assets, but you may see warnings in development mode.
