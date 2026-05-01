'use strict';

const app  = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\nCodeGuard AI Engine running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Audit:  POST http://localhost:${PORT}/api/v1/audit\n`);
});
