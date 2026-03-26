#!/bin/bash
echo "🚀 BgEraser Setup Script"
echo "========================"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Copy AI model assets to public
echo "🤖 Copying AI model files to public/..."
mkdir -p public/imgly-assets public/onnxruntime-web

cp node_modules/@imgly/background-removal-data/dist/* public/imgly-assets/ 2>/dev/null && echo "✅ Model assets copied" || echo "⚠️  @imgly/background-removal-data not found, run: npm install @imgly/background-removal-data"

cp node_modules/onnxruntime-web/dist/*.wasm public/onnxruntime-web/ 2>/dev/null
cp node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs public/onnxruntime-web/ 2>/dev/null
cp node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.mjs public/onnxruntime-web/ 2>/dev/null
echo "✅ WASM runtime files copied"

echo ""
echo "✅ Setup complete! Run: npm run dev"
echo "🌐 Then open: http://localhost:3000"
