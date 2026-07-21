import { Colors } from '../theme';
import type { RiskLevel } from '../types';

export function getRiskColor(level: RiskLevel) {
  switch (level) {
    case 'critical': return Colors.error;
    case 'high':     return Colors.tertiary;
    case 'medium':   return Colors.secondary;
    default:         return Colors.primary;
  }
}

export function getRiskBgColor(level: RiskLevel) {
  switch (level) {
    case 'critical': return 'rgba(186,26,26,0.10)';
    case 'high':     return 'rgba(164,58,58,0.10)';
    case 'medium':   return 'rgba(0,88,190,0.10)';
    default:         return 'rgba(0,108,73,0.10)';
  }
}

export function getRiskLabel(level: RiskLevel) {
  switch (level) {
    case 'critical': return 'Critical';
    case 'high':     return 'High Risk';
    case 'medium':   return 'Medium';
    default:         return 'Safe';
  }
}
