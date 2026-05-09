const SOURCES = ['AWS', 'GitHub', 'GCP', 'Azure', 'Slack', 'Okta', 'Datadog', 'GitLab', 'Salesforce', 'ServiceNow', 'Terraform Cloud', 'Kubernetes'];

const OWNERS = [
  'Alice Chen', 'Bob Martinez', 'Carol Singh', 'David Kim', 'Eve Nakamura',
  'Frank Okafor', 'Grace Liu', 'Hassan Ali', 'Irene Patel', 'James Wilson',
  'Karen Zhang', 'Liam Murphy', 'Maria Garcia', 'Noah Brown', 'Priya Sharma'
];

const CRED_NAMES_BY_TYPE = {
  'API Key': ['access-key-prod', 'access-key-staging', 'api-key-primary', 'api-key-readonly', 'access-key-backup'],
  'Token': ['oauth-token-v2', 'deploy-token-main', 'bot-token-primary', 'scim-token', 'pat-ci-pipeline', 'jwt-auth-token'],
  'Key': ['ssh-deploy-key', 'ssh-key-prod', 'signing-key-release', 'deploy-key-main'],
  'Certificate': ['tls-cert-prod', 'client-cert-mtls', 'code-signing-cert', 'ca-cert-internal'],
  'Secret': ['client-secret-v1', 'webhook-secret-main', 'db-connection-string', 'env-secret-prod'],
};

const CRED_SUBTYPES = {
  'API Key': ['Standard API Key', 'Access Key Pair', 'Scoped API Key'],
  'Token': ['OAuth Token', 'PAT', 'Bot Token', 'Deploy Token', 'SCIM Token', 'JWT Token'],
  'Key': ['SSH Key', 'Deploy Key', 'Signing Key'],
  'Certificate': ['X.509/TLS Certificate', 'Client Certificate', 'Code Signing Certificate'],
  'Secret': ['Client Secret', 'Webhook Secret', 'Connection String'],
};

const CRED_STATUSES = ['Active', 'Active', 'Active', 'Dormant', 'Expired', 'Revoked'];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomDate(daysAgoMin, daysAgoMax) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * (daysAgoMax - daysAgoMin) + daysAgoMin));
  return d.toISOString().split('T')[0];
}
function futureDate(daysMin, daysMax) {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * (daysMax - daysMin) + daysMin));
  return d.toISOString().split('T')[0];
}
function daysFromNow(dateStr) {
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return Math.round(diff);
}

function generateCredentials(sources, count) {
  const creds = [];
  const credTypes = Object.keys(CRED_NAMES_BY_TYPE);
  for (let i = 0; i < count; i++) {
    const type = randomFrom(credTypes);
    const status = randomFrom(CRED_STATUSES);
    const hasExpiry = Math.random() > 0.3;
    const expiry = status === 'Expired' ? randomDate(1, 30) : hasExpiry ? futureDate(1, 180) : null;
    const source = randomFrom(sources);
    creds.push({
      id: `ZL-CRD-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
      name: randomFrom(CRED_NAMES_BY_TYPE[type]),
      type,
      subtype: randomFrom(CRED_SUBTYPES[type]),
      status,
      source,
      expiry,
      lastUsed: status === 'Dormant' ? randomDate(31, 180) : status === 'Active' ? randomDate(0, 14) : null,
      lastRotation: Math.random() > 0.5 ? randomDate(10, 200) : null,
      nextRotation: Math.random() > 0.6 ? futureDate(1, 90) : null,
      storageLocation: Math.random() > 0.5 ? randomFrom(['HashiCorp Vault', 'AWS Secrets Manager', 'Azure Key Vault', 'GCP Secret Manager', 'Environment Variable', 'Code Repository']) : null,
      vaulted: Math.random() > 0.4,
    });
  }
  return creds;
}

const NHI_CONFIGS = [
  // Service Accounts (~45% = 22)
  { name: 'deploy-bot-prod', subType: 'Service Account', subTypeFull: 'Cloud Service Account', sources: ['AWS', 'GitHub', 'GCP'] },
  { name: 'ci-runner-main', subType: 'Service Account', subTypeFull: 'Cloud IAM User', sources: ['AWS', 'GitHub'] },
  { name: 'terraform-automation', subType: 'Service Account', subTypeFull: 'Platform Service Account', sources: ['Terraform Cloud', 'AWS', 'GCP'] },
  { name: 'db-migration-svc', subType: 'Service Account', subTypeFull: 'Database Service Account', sources: ['AWS'] },
  { name: 'monitoring-collector', subType: 'Service Account', subTypeFull: 'Platform Service Account', sources: ['Datadog', 'AWS'] },
  { name: 'backup-scheduler-prod', subType: 'Service Account', subTypeFull: 'Cloud Service Account', sources: ['GCP'] },
  { name: 'log-aggregator-svc', subType: 'Service Account', subTypeFull: 'Cloud Service Account', sources: ['AWS', 'Datadog'] },
  { name: 'secrets-rotator', subType: 'Service Account', subTypeFull: 'Cloud Service Account', sources: ['AWS'] },
  { name: 'payment-processor-sa', subType: 'Service Account', subTypeFull: 'Application Service Account', sources: ['AWS', 'Salesforce'] },
  { name: 'ldap-sync-service', subType: 'Service Account', subTypeFull: 'Directory Service Account', sources: ['Okta', 'Azure'] },
  { name: 'artifact-publisher', subType: 'Service Account', subTypeFull: 'Cloud IAM User', sources: ['AWS', 'GitHub'] },
  { name: 'cloudwatch-exporter', subType: 'Service Account', subTypeFull: 'Cloud Service Account', sources: ['AWS', 'Datadog'] },
  { name: 'redis-cache-manager', subType: 'Service Account', subTypeFull: 'Database Service Account', sources: ['AWS'] },
  { name: 'email-notification-svc', subType: 'Service Account', subTypeFull: 'Application Service Account', sources: ['AWS', 'Salesforce'] },
  { name: 'dns-updater-prod', subType: 'Service Account', subTypeFull: 'Cloud Service Account', sources: ['AWS', 'GCP'] },
  { name: 'compliance-scanner', subType: 'Service Account', subTypeFull: 'Cloud IAM User', sources: ['AWS', 'Azure', 'GCP'] },
  { name: 'sso-bridge-service', subType: 'Service Account', subTypeFull: 'Directory Service Account', sources: ['Okta'] },
  { name: 'data-pipeline-etl', subType: 'Service Account', subTypeFull: 'Cloud Service Account', sources: ['GCP'] },
  { name: 'image-resizer-lambda', subType: 'Service Account', subTypeFull: 'Cloud Service Account', sources: ['AWS'] },
  { name: 'audit-log-collector', subType: 'Service Account', subTypeFull: 'Platform Service Account', sources: ['AWS', 'Okta', 'GitHub'] },
  { name: 'cost-analyzer-sa', subType: 'Service Account', subTypeFull: 'Cloud Service Account', sources: ['AWS', 'GCP'] },
  { name: 'vulnerability-scanner', subType: 'Service Account', subTypeFull: 'Cloud IAM User', sources: ['AWS', 'GitHub'] },

  // Application Identity (~25% = 13)
  { name: 'Salesforce Integration Hub', subType: 'Application Identity', subTypeFull: 'OAuth App', sources: ['Salesforce', 'Okta'] },
  { name: 'GitHub Actions OAuth', subType: 'Application Identity', subTypeFull: 'OAuth App', sources: ['GitHub'] },
  { name: 'Slack Workflow Bot App', subType: 'Application Identity', subTypeFull: 'Enterprise App', sources: ['Slack'] },
  { name: 'Azure AD App Registration', subType: 'Application Identity', subTypeFull: 'App Registration', sources: ['Azure'] },
  { name: 'Okta SAML Connector', subType: 'Application Identity', subTypeFull: 'SAML App', sources: ['Okta'] },
  { name: 'ServiceNow Integration', subType: 'Application Identity', subTypeFull: 'OAuth App', sources: ['ServiceNow', 'Okta'] },
  { name: 'Datadog API Integration', subType: 'Application Identity', subTypeFull: 'OAuth App', sources: ['Datadog'] },
  { name: 'Jira Cloud Connector', subType: 'Application Identity', subTypeFull: 'OAuth App', sources: ['Okta'] },
  { name: 'Google Workspace App', subType: 'Application Identity', subTypeFull: 'OAuth App', sources: ['GCP', 'Okta'] },
  { name: 'PagerDuty Webhook App', subType: 'Application Identity', subTypeFull: 'Enterprise App', sources: ['AWS'] },
  { name: 'Confluence API Client', subType: 'Application Identity', subTypeFull: 'OAuth App', sources: ['Okta'] },
  { name: 'Zoom SSO Connector', subType: 'Application Identity', subTypeFull: 'SAML App', sources: ['Okta', 'Azure'] },
  { name: 'DocuSign eSignature App', subType: 'Application Identity', subTypeFull: 'OAuth App', sources: ['Salesforce'] },

  // Machine/Workload (~25% = 12)
  { name: 'eks-node-group-prod', subType: 'Machine / Workload', subTypeFull: 'Container Identity', sources: ['AWS', 'Kubernetes'] },
  { name: 'gke-autopilot-cluster', subType: 'Machine / Workload', subTypeFull: 'Container Identity', sources: ['GCP', 'Kubernetes'] },
  { name: 'lambda-execution-role', subType: 'Machine / Workload', subTypeFull: 'IAM Role', sources: ['AWS'] },
  { name: 'ecs-task-role-api', subType: 'Machine / Workload', subTypeFull: 'IAM Role', sources: ['AWS'] },
  { name: 'azure-managed-identity', subType: 'Machine / Workload', subTypeFull: 'Managed Identity', sources: ['Azure'] },
  { name: 'gcp-workload-identity', subType: 'Machine / Workload', subTypeFull: 'Managed Identity', sources: ['GCP'] },
  { name: 'github-actions-runner', subType: 'Machine / Workload', subTypeFull: 'CI/CD Identity', sources: ['GitHub'] },
  { name: 'gitlab-ci-runner-pool', subType: 'Machine / Workload', subTypeFull: 'CI/CD Identity', sources: ['GitLab'] },
  { name: 'ec2-instance-profile', subType: 'Machine / Workload', subTypeFull: 'Compute Instance Identity', sources: ['AWS'] },
  { name: 'cloud-run-service-prod', subType: 'Machine / Workload', subTypeFull: 'Container Identity', sources: ['GCP'] },
  { name: 'aks-cluster-identity', subType: 'Machine / Workload', subTypeFull: 'Container Identity', sources: ['Azure', 'Kubernetes'] },
  { name: 'jenkins-build-agent', subType: 'Machine / Workload', subTypeFull: 'CI/CD Identity', sources: ['AWS', 'GitHub'] },

  // AI Agent / Bot (~5% = 3)
  { name: 'slack-hr-assistant', subType: 'AI Agent / Bot', subTypeFull: 'Chat Bot', sources: ['Slack'] },
  { name: 'github-copilot-workspace', subType: 'AI Agent / Bot', subTypeFull: 'AI Agent', sources: ['GitHub'] },
  { name: 'teams-standup-bot', subType: 'AI Agent / Bot', subTypeFull: 'Chat Bot', sources: ['Azure'] },
];

// Status distribution: ~65% Active, ~25% Dormant, ~5% Suspended, ~5% Decommissioned
const STATUS_POOL = [
  ...Array(33).fill('Active'),
  ...Array(13).fill('Dormant'),
  ...Array(2).fill('Suspended'),
  ...Array(2).fill('Decommissioned'),
];

// ~8% orphaned = ~4 of 50
const ORPHAN_INDICES = [0, 16, 35, 44]; // deploy-bot-prod, sso-bridge-service, eks-node-group-prod, teams-standup-bot

export const nhis = NHI_CONFIGS.map((cfg, i) => {
  const status = STATUS_POOL[i % STATUS_POOL.length];
  const isOrphaned = ORPHAN_INDICES.includes(i);
  const owner = isOrphaned ? null : randomFrom(OWNERS);
  const credCount = Math.floor(Math.random() * 5) + 1;
  const credentials = generateCredentials(cfg.sources, credCount);
  const nearestExpiry = credentials
    .filter(c => c.expiry)
    .sort((a, b) => new Date(a.expiry) - new Date(b.expiry))[0]?.expiry || null;

  return {
    id: `ZL-NHI-${String(i + 1).padStart(4, '0')}`,
    name: cfg.name,
    subType: cfg.subType,
    subTypeFull: cfg.subTypeFull,
    status,
    owner,
    allOwners: isOrphaned ? [] : [owner, ...(Math.random() > 0.6 ? [randomFrom(OWNERS.filter(o => o !== owner))] : [])],
    sources: cfg.sources,
    lastActive: status === 'Dormant' ? randomDate(31, 200) : status === 'Active' ? randomDate(0, 7) : status === 'Decommissioned' ? randomDate(60, 300) : randomDate(10, 60),
    discoveredOn: randomDate(90, 400),
    creationDate: randomDate(180, 800),
    lastUpdated: randomDate(0, 30),
    credentialsCount: credCount,
    nearestExpiry,
    credentials,
    isOrphaned,
    createdBy: Math.random() > 0.3 ? randomFrom(OWNERS) : cfg.name.includes('bot') ? 'automation-system' : null,
    accessedBy: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => randomFrom(OWNERS)),
    accounts: cfg.sources.map(src => ({
      source: src,
      nativeId: `${src.toLowerCase().replace(/\s/g, '-')}:${cfg.name}`,
      status: status === 'Active' ? 'Active' : status,
      linkedSince: randomDate(60, 300),
      credentials: generateCredentials([src], Math.floor(Math.random() * 3) + 1),
    })),
  };
});

// Override deploy-bot-prod (index 0) with the specific detail page scenario
nhis[0] = {
  ...nhis[0],
  name: 'deploy-bot-prod',
  subType: 'Service Account',
  subTypeFull: 'Cloud Service Account',
  status: 'Active',
  owner: null,
  allOwners: [],
  isOrphaned: true,
  sources: ['AWS', 'GitHub', 'GCP'],
  lastActive: randomDate(0, 2),
  discoveredOn: '2024-08-15',
  creationDate: '2023-03-22',
  lastUpdated: randomDate(0, 3),
  createdBy: 'James Wilson',
  accessedBy: ['ci-runner-main', 'terraform-automation', 'Alice Chen'],
  passwordNeverExpires: true,
  accounts: [
    {
      source: 'AWS',
      nativeId: 'arn:aws:iam::482917364:user/deploy-bot-prod',
      status: 'Active',
      linkedSince: '2024-08-15',
      credentials: [
        { id: 'ZL-CRD-0001', name: 'AKIA...7X3F', type: 'API Key', subtype: 'Access Key Pair', status: 'Expired', source: 'AWS', expiry: '2025-12-01', lastUsed: '2025-11-28', lastRotation: '2025-06-01', nextRotation: null, storageLocation: 'Environment Variable', vaulted: false },
        { id: 'ZL-CRD-0002', name: 'AKIA...9M2K', type: 'API Key', subtype: 'Access Key Pair', status: 'Active', source: 'AWS', expiry: null, lastUsed: randomDate(0, 1), lastRotation: '2024-09-15', nextRotation: null, storageLocation: null, vaulted: false },
      ],
    },
    {
      source: 'GitHub',
      nativeId: 'github.com/org/deploy-bot-prod',
      status: 'Active',
      linkedSince: '2024-10-02',
      credentials: [
        { id: 'ZL-CRD-0003', name: 'ghp_T4x...expired', type: 'Token', subtype: 'PAT', status: 'Expired', source: 'GitHub', expiry: '2026-01-15', lastUsed: '2026-01-10', lastRotation: '2025-07-15', nextRotation: null, storageLocation: 'GitHub Actions Secret', vaulted: true },
        { id: 'ZL-CRD-0004', name: 'SHA256:d4F...deploy', type: 'Key', subtype: 'SSH Key', status: 'Dormant', source: 'GitHub', expiry: null, lastUsed: '2025-11-08', lastRotation: null, nextRotation: null, storageLocation: null, vaulted: false },
      ],
    },
    {
      source: 'GCP',
      nativeId: 'deploy-bot-prod@project-x.iam.gserviceaccount.com',
      status: 'Active',
      linkedSince: '2024-11-20',
      credentials: [
        { id: 'ZL-CRD-0005', name: 'sa-key-prod-001', type: 'API Key', subtype: 'Standard API Key', status: 'Active', source: 'GCP', expiry: futureDate(45, 90), lastUsed: randomDate(0, 3), lastRotation: randomDate(30, 60), nextRotation: futureDate(20, 45), storageLocation: 'GCP Secret Manager', vaulted: true },
        { id: 'ZL-CRD-0006', name: 'sa-key-prod-002', type: 'API Key', subtype: 'Standard API Key', status: 'Active', source: 'GCP', expiry: futureDate(60, 120), lastUsed: randomDate(0, 5), lastRotation: randomDate(15, 45), nextRotation: futureDate(30, 60), storageLocation: 'GCP Secret Manager', vaulted: true },
        { id: 'ZL-CRD-0007', name: 'oauth-client-secret', type: 'Secret', subtype: 'Client Secret', status: 'Active', source: 'GCP', expiry: futureDate(90, 180), lastUsed: randomDate(0, 7), lastRotation: randomDate(60, 90), nextRotation: futureDate(60, 90), storageLocation: 'HashiCorp Vault', vaulted: true },
      ],
    },
  ],
  credentialsCount: 7,
  nearestExpiry: '2025-12-01',
};

// Mark a few NHIs as shadow (not found in any regular managed system)
const SHADOW_INDICES = [7, 18, 38, 47];
SHADOW_INDICES.forEach(i => { if (nhis[i]) nhis[i].isShadow = true; });

// Compute demo risk score for each NHI
function computeRiskScore(n) {
  let score = 0;
  if (n.status === 'Active') score += 10;
  if (n.isOrphaned) score += 30;
  if (n.sources.length > 2) score += 15;
  if (n.credentialsCount > 3) score += 15;
  if (n.credentials.some(c => c.status === 'Expired')) score += 20;
  if (n.credentials.some(c => !c.expiry)) score += 15;
  if (n.credentials.some(c => c.status === 'Dormant')) score += 10;
  if (n.passwordNeverExpires) score += 20;
  return Math.min(score, 100);
}
nhis.forEach(n => { n.riskScore = computeRiskScore(n); });

export function getStats(data) {
  const active = data.filter(n => n.status === 'Active').length;
  const dormant = data.filter(n => n.status === 'Dormant').length;
  const orphaned = data.filter(n => n.isOrphaned).length;
  const allCreds = data.flatMap(n => n.credentials || []);
  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 30);
  const expiringSoon = allCreds.filter(c => c.expiry && new Date(c.expiry) > now && new Date(c.expiry) <= soon).length;
  return { total: data.length, active, dormant, orphaned, expiringSoon };
}

export const DETAIL_NHI_ID = 'ZL-NHI-0001';

export const ACTIVITY_LOGS = [
  { timestamp: '2026-05-08 09:14:22', action: 'Authenticated via API Key', source: 'AWS', detail: 'AKIA...9M2K used to access S3 bucket prod-artifacts' },
  { timestamp: '2026-05-07 18:30:05', action: 'Pushed to repository', source: 'GitHub', detail: 'Commit SHA abc1234 pushed to main branch of deploy-pipeline' },
  { timestamp: '2026-05-07 14:22:11', action: 'Credential expired', source: 'GitHub', detail: 'PAT ghp_T4x...expired reached expiry date' },
  { timestamp: '2026-05-06 08:45:33', action: 'Accessed GCP resource', source: 'GCP', detail: 'Service account key used for Cloud Build trigger' },
  { timestamp: '2026-05-04 11:12:00', action: 'IAM policy evaluated', source: 'AWS', detail: 'AssumeRole for ECS deployment task in prod cluster' },
  { timestamp: '2026-04-28 16:05:44', action: 'Status change detected', source: 'AWS', detail: 'Access key AKIA...7X3F detected as expired by IAM sync' },
];
