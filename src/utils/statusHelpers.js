export const STATUS_MAP = {
  created: {
    color: '#1976D2',
    icon: 'mdi-file-plus',
    text: 'Status.created'
  },
  agreement_confirm_requested: {
    color: '#757575',
    icon: 'mdi-send',
    text: 'Status.agreement_confirm_requested',
  },
  agreement_confirmed_by_company: {
    color: '#2E7D32',
    icon: 'mdi-domain',
    text: 'Status.agreement_confirmed_by_company',
  },
  agreement_confirmed_by_supervisor: {
    color: '#2E7D32',
    icon: 'mdi-school',
    text: 'Status.agreement_confirmed_by_supervisor',
  },
  agreement_rejected_by_company: {
    color: '#C62828',
    icon: 'mdi-close-circle',
    text: 'Status.agreement_rejected_by_company',
  },
  agreement_rejected_by_supervisor: {
    color: '#C62828',
    icon: 'mdi-close-circle',
    text: 'Status.agreement_rejected_by_supervisor',
  },
  report_confirm_requested: {
    color: '#616161',
    icon: 'mdi-file-send',
    text: 'Status.report_confirm_requested',
  },
  report_confirmed_by_company: {
    color: '#2E7D32',
    icon: 'mdi-domain',
    text: 'Status.report_confirmed_by_company',
  },
  report_confirmed_by_supervisor: {
    color: '#2E7D32',
    icon: 'mdi-school',
    text: 'Status.report_confirmed_by_supervisor',
  },
  report_rejected_by_company: {
    color: '#C62828',
    icon: 'mdi-close-circle',
    text: 'Status.report_rejected_by_company',
  },
  report_rejected_by_supervisor: {
    color: '#C62828',
    icon: 'mdi-close-circle',
    text: 'Status.report_rejected_by_supervisor',
  },
  defense: {
    color: '#1976D2',
    icon: 'mdi-shield-check',
    text: 'Status.defense',
  },
  defense_rejected: {
    color: '#C62828',
    icon: 'mdi-shield-alert',
    text: 'Status.defense_rejected',
  },
  defended: {
    color: '#2E7D32',
    icon: 'mdi-shield-check-outline',
    text: 'Status.defended',
  },
  canceled: {
    color: '#000000',
    icon: 'mdi-cancel',
    text: 'Status.canceled',
  },
}
export const REPORT_STATUS_MAP = {
  pending: { color: '#757575', text: 'ReportStatus.pending' },
  running: { color: '#1976D2', text: 'ReportStatus.running' },
  success: { color: '#2E7D32', text: 'ReportStatus.success' },
  failed: { color: '#C62828', text: 'ReportStatus.failed' },
}

export function getReportStatusColor(status) {
  return REPORT_STATUS_MAP[status]?.color || '#1976D2'
}

export const reportStatusOptions = Object.keys(REPORT_STATUS_MAP).map(key => ({
  value: key,
  label: REPORT_STATUS_MAP[key].text
}))

export function getStatusColor(status) {
  return STATUS_MAP[status]?.color || '#1976D2'
}

export function getStatusIcon(status) {
  return STATUS_MAP[status]?.icon || 'mdi-file'
}

export function getStatusText(status) {
  return STATUS_MAP[status]?.text || 'Status.unknown'
}

export const statusOptions = Object.keys(STATUS_MAP).map(key => ({
  value: key,
  label: STATUS_MAP[key].text
}))
