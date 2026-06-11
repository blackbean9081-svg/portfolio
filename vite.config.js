import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — GitHub Pages·정적 호스팅에서 상대경로로 에셋을 찾도록 (빌드 후 어디에 올려도 동작)
export default defineConfig({
  base: './',
  plugins: [react()],
});
