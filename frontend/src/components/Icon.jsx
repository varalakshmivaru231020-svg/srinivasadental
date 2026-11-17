import {
  Activity, AlignCenterHorizontal, Anchor, Armchair, Award, Baby, BadgeCheck, Camera, ClipboardList, Crown,
  Droplets, Gem, HeartHandshake, HeartPulse, Layers, Microscope, MonitorSmartphone, RefreshCw, Scan, ScanFace,
  ScanLine, Scissors, ShieldCheck, ShieldPlus, Smile, SmilePlus, Sparkles, SprayCan, Stethoscope, Sun, Syringe,
  Users, Zap,
} from 'lucide-react';
import {
  Tooth, ToothAligner, ToothBraces, ToothCrown, ToothImplant, ToothRoot, ToothShield, ToothSparkle,
} from './DentalIcons';

const map = {
  // Dental icons
  Tooth, ToothImplant, ToothRoot, ToothBraces, ToothAligner, ToothCrown, ToothSparkle, ToothShield,
  // General icons
  Activity, AlignCenterHorizontal, Anchor, Armchair, Award, Baby, BadgeCheck, Camera, ClipboardList, Crown,
  Droplets, Gem, HeartHandshake, HeartPulse, Layers, Microscope, MonitorSmartphone, RefreshCw, Scan, ScanFace,
  ScanLine, Scissors, ShieldCheck, ShieldPlus, Smile, SmilePlus, Sparkles, SprayCan, Stethoscope, Sun, Syringe,
  Users, Zap,
};

export const iconNames = Object.keys(map);

export default function Icon({ name, size = 24, ...rest }) {
  const Cmp = map[name] || Tooth;
  return <Cmp size={size} strokeWidth={1.8} aria-hidden="true" {...rest} />;
}
