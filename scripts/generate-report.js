const fs = require('fs');
const path = require('path');
const { merge } = require('mochawesome-merge');
const marge = require('mochawesome-report-generator');

/**
 * Recursively find all files in a directory matching a filter
 */
function findJsonFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findJsonFiles(filePath, fileList);
    } else if (file.endsWith('.json') && file !== 'mochawesome.json') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function generateReport() {
  const reportsDir = path.resolve('reports');
  const mochaDir = path.join(reportsDir, 'mocha');
  const outputHtmlDir = path.join(reportsDir, 'html');

  console.log('----------------------------------------------------');
  console.log(' Mochawesome Consolidated Report Generator');
  console.log('----------------------------------------------------');

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // 1. Search for Mochawesome JSON result files
  const jsonFiles = findJsonFiles(mochaDir);

  console.log(`Searching for test results in: ${mochaDir}`);
  console.log(`Found ${jsonFiles.length} result file(s).`);

  if (jsonFiles.length === 0) {
    console.error('Error: No Mochawesome JSON test results found to generate report.');
    console.error('Ensure that at least one test suite (API or UI) ran and produced artifacts.');
    process.exit(1);
  }

  jsonFiles.forEach((file) => {
    console.log(` - ${path.relative(process.cwd(), file)}`);
  });

  // 2. Merge JSON files
  console.log('\nMerging test result files...');
  try {
    const mergedReport = await merge({
      files: [
        'reports/mocha/**/*.json',
        '!reports/mocha/**/mochawesome.json'
      ]
    });

    const mergedJsonPath = path.join(reportsDir, 'mochawesome.json');
    fs.writeFileSync(mergedJsonPath, JSON.stringify(mergedReport, null, 2), 'utf-8');
    console.log(`Consolidated JSON written to: ${path.relative(process.cwd(), mergedJsonPath)}`);

    // 3. Generate HTML report
    console.log('\nGenerating HTML report with charts...');
    const reportOptions = {
      reportDir: outputHtmlDir,
      reportFilename: 'index.html',
      reportTitle: 'SDET Automation Challenge - Test Execution Report',
      charts: true,
      inline: true,
      overwrite: true,
      autoOpen: false
    };

    const generatedReport = await marge.create(mergedReport, reportOptions);

    // 4. Print Execution Summary
    const stats = mergedReport.stats || {};
    console.log('\n====================================================');
    console.log(' Execution Summary');
    console.log('====================================================');
    console.log(` Total Suites  : ${stats.suites ?? 'N/A'}`);
    console.log(` Total Tests   : ${stats.tests ?? 'N/A'}`);
    console.log(` Passed        : ${stats.passes ?? 0}`);
    console.log(` Failed        : ${stats.failures ?? 0}`);
    console.log(` Pending/Skip  : ${stats.pending ?? 0}`);
    console.log(` Duration      : ${stats.duration ? (stats.duration / 1000).toFixed(2) + 's' : 'N/A'}`);
    console.log('====================================================');
    console.log(`HTML Report generated at: ${generatedReport}`);
    console.log('====================================================\n');
  } catch (error) {
    console.error('Failed to generate consolidated report:', error);
    process.exit(1);
  }
}

generateReport();
