// Generate dynamic CSV file URLs based on current site location
const csvDataMap = {
  'bakery-demo-prompt': '/retail-demo-data/bakery_sales.csv',
  'finance-demo-prompt': '/finance-demo-data/loan_applications.csv',
  'healthcare-demo-prompt': '/healthcare-demo-data/patients.csv',
  'manufacturing-demo-prompt': '/manufacturing-demo-data/production_quality.csv',
  'education-demo-prompt': '/education-demo-data/student_performance.csv',
  'technology-demo-prompt': '/technology-demo-data/project_work_items.csv'
};

// Map table IDs to CSV file info
const tableDataMap = {
  'bakery-table': { file: '/retail-demo-data/bakery_sales.csv', columns: ['ProductID', 'ProductName', 'Category', 'QuantitiesSold', 'TotalSales'] },
  'finance-table': { file: '/finance-demo-data/loan_applications.csv', columns: ['ApplicationID', 'ApplicantFirstName', 'ApplicantLastName', 'LoanAmount', 'CreditScore', 'RiskScore', 'RecommendedAction'] },
  'healthcare-table': { file: '/healthcare-demo-data/patients.csv', columns: ['PatientID', 'FirstName', 'LastName', 'Diagnosis', 'Status', 'InsuranceStatus', 'FollowUpDate'] },
  'manufacturing-table': { file: '/manufacturing-demo-data/production_quality.csv', columns: ['ProductionID', 'ProductName', 'DefectRate', 'QualityScore', 'Status'] },
  'education-table': { file: '/education-demo-data/student_performance.csv', columns: ['StudentID', 'FirstName', 'LastName', 'MajorProgram', 'GPA', 'AtRiskFlag', 'AcademicStanding'] },
  'technology-table': { file: '/technology-demo-data/project_work_items.csv', columns: ['WorkItemID', 'WorkItemTitle', 'WorkItemType', 'Status', 'Priority', 'BlockerStatus'] }
};

// Store full URLs for each CSV
const csvFullUrls = {};

function getFullCsvUrl(relativePath) {
  // If running on a local file:// protocol, return relative path
  if (window.location.protocol === 'file:') {
    return relativePath;
  }
  // If running on http/https, construct full URL
  const pathname = window.location.pathname;
  const lastSlashIndex = pathname.lastIndexOf('/');
  const directory = pathname.substring(0, lastSlashIndex + 1);
  const baseUrl = window.location.origin + directory;
  const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  return baseUrl + cleanPath;
}

// Parse CSV text into array of objects
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }
  return data;
}

// Load CSV and populate table
async function loadCsvTable(tableId, csvConfig) {
  try {
    const fullUrl = getFullCsvUrl(csvConfig.file);
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    const tbody = document.querySelector(`#${tableId} tbody`);
    
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Add first 5 rows
    const rowsToShow = rows.slice(0, 5);
    rowsToShow.forEach((row, index) => {
      const tr = document.createElement('tr');
      if (index < rowsToShow.length - 1) {
        tr.style.borderBottom = '1px solid var(--cp-border)';
      }
      
      csvConfig.columns.forEach(col => {
        const td = document.createElement('td');
        td.style.padding = '8px 10px';
        td.textContent = row[col] || '';
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.warn(`Could not load CSV for ${tableId}:`, error);
  }
}

// Load all tables on page load
async function loadAllTables() {
  for (const [tableId, csvConfig] of Object.entries(tableDataMap)) {
    await loadCsvTable(tableId, csvConfig);
  }
}

function generateAllCsvUrls() {
  Object.entries(csvDataMap).forEach(([promptId, relativePath]) => {
    csvFullUrls[promptId] = getFullCsvUrl(relativePath);
  });
}

function replacePromptCsvReferences() {
  Object.entries(csvDataMap).forEach(([promptId, relativePath]) => {
    const promptElement = document.getElementById(promptId);
    if (promptElement) {
      const fullUrl = csvFullUrls[promptId];
      let text = promptElement.textContent;
      
      // Only replace if the text contains the relative path and not already the full URL
      if (text.includes(relativePath) && !text.includes(fullUrl)) {
        text = text.replace(relativePath, fullUrl);
        promptElement.textContent = text;
      }
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  generateAllCsvUrls();
  replacePromptCsvReferences();
  loadAllTables();
});

// Also run immediately in case DOM is already loaded
generateAllCsvUrls();
replacePromptCsvReferences();
loadAllTables();

// Handle industry dropdown
const industryDropdown = document.getElementById('industry-dropdown');
const industryContents = document.querySelectorAll('.industry-content');

if (industryDropdown) {
  industryDropdown.addEventListener('change', (e) => {
    const selectedIndustry = e.target.value;
    industryContents.forEach(content => {
      if (content.dataset.industry === selectedIndustry) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  });
}

// Handle copy buttons with dynamic CSV URLs
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const promptId = button.dataset.copy;
    const prompt = document.getElementById(promptId).textContent;
    try {
      await navigator.clipboard.writeText(prompt);
      button.textContent = "Copied";
      window.setTimeout(() => { button.textContent = "Copy"; }, 1800);
    } catch {
      button.textContent = "Select text";
    }
  });
});
