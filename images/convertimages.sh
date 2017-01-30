convert logo.sketch.svg.png -define icon:auto-resize=64,48,32,16 favicon.ico
convert logo.sketch.svg.png -resize 32x32   ./manifest/icon-32x32.png
convert logo.sketch.svg.png -resize 48x48   ./manifest/icon-48x48.png
convert logo.sketch.svg.png -resize 72x72   ./manifest/icon-72x72.png
convert logo.sketch.svg.png -resize 96x96   ./manifest/icon-96x96.png
convert logo.sketch.svg.png -resize 144x144 ./manifest/icon-144x144.png
convert logo.sketch.svg.png -resize 192x192 ./manifest/icon-192x192.png
convert logo.sketch.svg.png -resize 512x512 ./manifest/icon-512x512.png

