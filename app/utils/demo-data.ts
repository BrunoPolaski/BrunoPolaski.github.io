export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

export const revenue = [
  { name: 'Subscriptions', values: [4200, 4650, 5100, 4980, 5620, 6100, 6480, 6900, 7420] },
  { name: 'Services', values: [2100, 2300, 2050, 2600, 2750, 2900, 2800, 3150, 3300] },
  { name: 'Marketplace', values: [600, 720, 910, 1080, 1240, 1500, 1720, 1980, 2240] },
]

export const invoices = [
  { id: 'INV-1042', client: 'Northwind', owner: 'James Lewis', amount: 4200, status: 'Paid' },
  { id: 'INV-1043', client: 'Acme Studio', owner: 'Ana Souza', amount: 1850, status: 'Pending' },
  { id: 'INV-1044', client: 'Globex', owner: 'Priya Nair', amount: 12900, status: 'Overdue' },
  { id: 'INV-1045', client: 'Initech', owner: 'James Lewis', amount: 760, status: 'Paid' },
  { id: 'INV-1046', client: 'Umbrella', owner: 'Kenji Ito', amount: 3300, status: 'Pending' },
  { id: 'INV-1047', client: 'Hooli', owner: 'Ana Souza', amount: 8120, status: 'Paid' },
  { id: 'INV-1048', client: 'Stark Labs', owner: 'Priya Nair', amount: 2475, status: 'Paid' },
  { id: 'INV-1049', client: 'Wayne Co', owner: 'Kenji Ito', amount: 5600, status: 'Overdue' },
]

export const statusTone = { Paid: 'good', Pending: 'warning', Overdue: 'critical' } as const
export const statusIcon = { Paid: 'lucide:circle-check', Pending: 'lucide:clock', Overdue: 'lucide:circle-alert' } as const
