export const STATUS_MAP = {
  created: {
    color: '#1976D2',
    icon: 'mdi-file-plus',
    text: 'Vytvorená',
  },
  agreement_confirm_requested: {
    color: '#757575',
    icon: 'mdi-send',
    text: 'Žiadosť o potvrdenie dohody',
  },
  agreement_confirmed_by_company: {
    color: '#2E7D32',
    icon: 'mdi-domain',
    text: 'Dohoda potvrdená firmou',
  },
  agreement_confirmed_by_supervisor: {
    color: '#2E7D32',
    icon: 'mdi-school',
    text: 'Dohoda potvrdená garantom',
  },
  agreement_rejected_by_company: {
    color: '#C62828',
    icon: 'mdi-close-circle',
    text: 'Dohoda zamietnutá firmou',
  },
  agreement_rejected_by_supervisor: {
    color: '#C62828',
    icon: 'mdi-close-circle',
    text: 'Dohoda zamietnutá garantom',
  },
  report_confirm_requested: {
    color: '#616161',
    icon: 'mdi-file-send',
    text: 'Žiadosť o potvrdenie správy',
  },
  report_confirmed_by_company: {
    color: '#2E7D32',
    icon: 'mdi-domain',
    text: 'Správa potvrdená firmou',
  },
  report_confirmed_by_supervisor: {
    color: '#2E7D32',
    icon: 'mdi-school',
    text: 'Správa potvrdená garantоm',
  },
  report_rejected_by_company: {
    color: '#C62828',
    icon: 'mdi-close-circle',
    text: 'Správa zamietnutá firmou',
  },
  report_rejected_by_supervisor: {
    color: '#C62828',
    icon: 'mdi-close-circle',
    text: 'Správa zamietnutá garantоm',
  },
  canceled: {
    color: '#000000',
    icon: 'mdi-cancel',
    text: 'Zrušená',
  },
}

export function getStatusColor(status) {
  return STATUS_MAP[status]?.color || '#1976D2'
}

export function getStatusIcon(status) {
  return STATUS_MAP[status]?.icon || 'mdi-file'
}

export function getStatusText(status) {
  return STATUS_MAP[status]?.text || 'Neznámy'
}

export const statusOptions = Object.keys(STATUS_MAP).map(key => ({
  value: key,
  label: STATUS_MAP[key].text
}))
