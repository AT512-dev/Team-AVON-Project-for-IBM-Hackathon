// run-scan.js
const { BobOrchestrator } = require('./engine/services/bobOrchestrator');
const { ReportExporter } = require('./engine/services/utils/exporters');
const fs = require('fs');

async function start() {
    // 1. Point it to some files in your project to scan
    // Point it to your new test file
   const filesToScan = [
        {
            name: 'user.js',
            content: fs.readFileSync('routes/user.js', 'utf8'),
            path: 'routes/user.js',
            fileName: 'user.js'
        },
        {
            name: 'database.js',
            content: fs.readFileSync('db/database.js', 'utf8'),
            path: 'db/database.js',
            fileName: 'database.js'
        }
    ];

    console.log("🚀 Starting AVON Cross-File Audit...");

    // 2. Initialize (Note: This requires your IBM API Key in .env)
    const orchestrator = new BobOrchestrator(); 
    const results = await orchestrator.runCompleteAnalysis(filesToScan);

    // 3. Export a pretty report
    const htmlReport = ReportExporter.toHTML(results);
    fs.writeFileSync('security-report.html', htmlReport);

    console.log("✅ Scan Complete! Open security-report.html to see results.");
}

start();