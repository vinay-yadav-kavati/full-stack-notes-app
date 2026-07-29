// import path from 'path';
// import express from 'express';
// import app from './app.js';

// const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// async function startServer() {
//   if (process.env.NODE_ENV !== 'production') {
//     try {
//       const { createServer: createViteServer } = await import('vite');
//       const vite = await createViteServer({
//         server: { middlewareMode: true },
//         appType: 'spa',
//         root: path.resolve(process.cwd(), 'frontend'),
//       });
//       app.use(vite.middlewares);
//     } catch (err) {
//       console.warn('Vite middleware could not be loaded:', err);
//     }
//   } else {
//     const distPath = path.resolve(process.cwd(), 'frontend/dist');
//     app.use(express.static(distPath));
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(distPath, 'index.html'));
//     });
//   }

//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on http://0.0.0.0:${PORT}`);
//   });
// }

// startServer();

import app from "./app.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
