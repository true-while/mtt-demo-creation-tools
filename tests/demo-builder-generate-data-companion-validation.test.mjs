import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].replace(/^\uFEFF/, '').split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

async function validateGenerateDataCompanions(skillRoot) {
  const companiesPath = path.join(skillRoot, 'companies.csv');
  const namesPath = path.join(skillRoot, 'names.csv');

  let companiesText;
  let namesText;
  try {
    companiesText = await readFile(companiesPath, 'utf8');
  } catch {
    throw new Error('companies.csv missing');
  }
  try {
    namesText = await readFile(namesPath, 'utf8');
  } catch {
    throw new Error('names.csv missing');
  }

  if (companiesText.length === 0) throw new Error('companies.csv empty');
  if (namesText.length === 0) throw new Error('names.csv empty');

  const companies = parseCsv(companiesText);
  const names = parseCsv(namesText);
  if (companies.length === 0) throw new Error('companies.csv has no usable approved records');
  if (names.length === 0) throw new Error('names.csv has no usable approved records');

  const companyHeaders = Object.keys(companies[0]);
  if (!companyHeaders.includes('CompanyName') || !companyHeaders.includes('EmailDomain')) {
    throw new Error('companies.csv malformed');
  }
  if (!companies.some((record) => record.CompanyName && record.EmailDomain)) {
    throw new Error('companies.csv has no usable approved records');
  }

  const nameHeaders = Object.keys(names[0]);
  const hasFullName = nameHeaders.includes('FullName');
  const hasSplitName = nameHeaders.includes('FirstName') && nameHeaders.includes('LastName');
  if (!hasFullName && !hasSplitName) throw new Error('names.csv malformed');
  if (!names.some((record) => record.FullName || (record.FirstName && record.LastName))) {
    throw new Error('names.csv has no usable approved records');
  }

  return {
    companiesChecked: companies.length,
    namesChecked: names.length,
    company: companies[0].CompanyName,
    domain: companies[0].EmailDomain,
    person: hasFullName ? names[0].FullName : `${names[0].FirstName} ${names[0].LastName}`,
  };
}

async function withCase(files, callback) {
  const root = await mkdtemp(path.join(tmpdir(), 'demo-builder-generate-data-companion-validation-'));
  try {
    await Promise.all(
      Object.entries(files).map(([name, content]) => writeFile(path.join(root, name), content, 'utf8')),
    );
    return await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function rejectsWith(files, expectedMessage) {
  await withCase(files, async (root) => {
    await assert.rejects(
      () => validateGenerateDataCompanions(root),
      (error) => error.message.includes(expectedMessage),
    );
  });
}

test('demo-builder-generate-data companion validation returns approved handoff values for complete files', async () => {
  await withCase(
    {
      'companies.csv': 'CompanyName,SourceDomainText,EmailDomain\nContoso,contoso.com,contoso.com',
      'names.csv': 'FirstName,LastName,FullName\nAvery,Howard,Avery Howard',
    },
    async (root) => {
      const result = await validateGenerateDataCompanions(root);
      assert.equal(result.companiesChecked, 1);
      assert.equal(result.namesChecked, 1);
      assert.equal(result.company, 'Contoso');
      assert.equal(result.domain, 'contoso.com');
      assert.equal(result.person, 'Avery Howard');
    },
  );
});

test('demo-builder-generate-data companion validation detects missing files', async () => {
  await rejectsWith(
    { 'companies.csv': 'CompanyName,SourceDomainText,EmailDomain\nContoso,contoso.com,contoso.com' },
    'names.csv missing',
  );
  await rejectsWith(
    { 'names.csv': 'FirstName,LastName,FullName\nAvery,Howard,Avery Howard' },
    'companies.csv missing',
  );
});

test('demo-builder-generate-data companion validation detects empty files', async () => {
  await rejectsWith(
    {
      'companies.csv': '',
      'names.csv': 'FirstName,LastName,FullName\nAvery,Howard,Avery Howard',
    },
    'companies.csv empty',
  );
  await rejectsWith(
    {
      'companies.csv': 'CompanyName,SourceDomainText,EmailDomain\nContoso,contoso.com,contoso.com',
      'names.csv': '',
    },
    'names.csv empty',
  );
});

test('demo-builder-generate-data companion validation detects malformed files', async () => {
  await rejectsWith(
    {
      'companies.csv': 'Name,Domain\nContoso,contoso.com',
      'names.csv': 'FirstName,LastName,FullName\nAvery,Howard,Avery Howard',
    },
    'companies.csv malformed',
  );
  await rejectsWith(
    {
      'companies.csv': 'CompanyName,SourceDomainText,EmailDomain\nContoso,contoso.com,contoso.com',
      'names.csv': 'DisplayName\nAvery Howard',
    },
    'names.csv malformed',
  );
});
