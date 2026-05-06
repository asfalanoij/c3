import type { PatchSlaData, EstateVisibilityData, KeyLifecycleData } from '../types';

export const PATCH_SLA_DATA: PatchSlaData[] = [
    { category: 'CDE Servers', total: 500, patched: 480, pending: 15, overdue: 5 },
    { category: 'Cloud VMs', total: 1200, patched: 1150, pending: 30, overdue: 20 },
    { category: 'Corporate Laptops', total: 2500, patched: 2300, pending: 150, overdue: 50 },
    { category: 'Network Devices', total: 300, patched: 290, pending: 5, overdue: 5 },
];

export const ESTATE_VISIBILITY_DATA: EstateVisibilityData[] = [
    { category: 'Endpoints', value: 3000, color: '#3B82F6' }, // blue
    { category: 'Cloud Resources', value: 1500, color: '#10B981' }, // green
    { category: 'Network Devices', value: 350, color: '#F97316' }, // orange
    { category: 'Unmanaged', value: 750, color: '#EF4444' }, // red
];

export const KEY_LIFECYCLE_DATA: KeyLifecycleData[] = [
    { category: 'HSM Master Keys', total: 4, rotatedOnSchedule: 4, expiresSoon: 0, outOfPolicy: 0 },
    { category: 'TLS Certificates', total: 850, rotatedOnSchedule: 800, expiresSoon: 45, outOfPolicy: 5 },
    { category: 'Database Keys', total: 250, rotatedOnSchedule: 240, expiresSoon: 0, outOfPolicy: 10 },
    { category: 'API Keys', total: 1200, rotatedOnSchedule: 1100, expiresSoon: 0, outOfPolicy: 100 },
];
