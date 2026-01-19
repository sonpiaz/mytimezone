#!/bin/bash

# Script to convert SVG icons to PNG for PWA
# Requires: Inkscape or ImageMagick

echo "Converting SVG icons to PNG..."

# Check if Inkscape is available
if command -v inkscape &> /dev/null; then
    echo "Using Inkscape..."
    
    # Convert favicon
    inkscape public/favicon.svg -w 32 -h 32 -o public/favicon-32.png
    inkscape public/favicon.svg -w 16 -h 16 -o public/favicon-16.png
    
    # Convert PWA icons
    inkscape public/icons/icon-192.svg -w 192 -h 192 -o public/icons/icon-192.png
    inkscape public/icons/icon-512.svg -w 512 -h 512 -o public/icons/icon-512.png
    inkscape public/icons/icon-maskable.svg -w 512 -h 512 -o public/icons/icon-maskable-512.png
    
    # Convert Apple Touch Icon
    inkscape public/apple-touch-icon.svg -w 180 -h 180 -o public/apple-touch-icon.png
    
    # Convert OG Image
    inkscape public/og-image.svg -w 1200 -h 630 -o public/og-image.png
    
    echo "✅ All icons converted successfully!"
    
# Check if ImageMagick is available
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick..."
    
    convert public/favicon.svg -resize 32x32 public/favicon-32.png
    convert public/favicon.svg -resize 16x16 public/favicon-16.png
    convert public/icons/icon-192.svg -resize 192x192 public/icons/icon-192.png
    convert public/icons/icon-512.svg -resize 512x512 public/icons/icon-512.png
    convert public/icons/icon-maskable.svg -resize 512x512 public/icons/icon-maskable-512.png
    convert public/apple-touch-icon.svg -resize 180x180 public/apple-touch-icon.png
    convert public/og-image.svg -resize 1200x630 public/og-image.png
    
    echo "✅ All icons converted successfully!"
    
else
    echo "❌ Error: Neither Inkscape nor ImageMagick found."
    echo "Please install one of them:"
    echo "  - macOS: brew install inkscape"
    echo "  - macOS: brew install imagemagick"
    echo ""
    echo "Or use online converter: https://svgtopng.com/"
    exit 1
fi
