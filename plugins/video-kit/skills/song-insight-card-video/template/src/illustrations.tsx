import React from 'react';

export const BatteryIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 280 220"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="65" y="42" width="110" height="138" rx="12" fill="#FFFFFF" stroke="#111111" strokeWidth="4.5" strokeLinejoin="round"/>
      <rect x="98" y="24" width="44" height="18" rx="5" fill="#9273C8" stroke="#111111" strokeWidth="4.5" strokeLinejoin="round"/>
      <rect x="77" y="118" width="86" height="50" rx="6" fill="#9273C8" stroke="#111111" strokeWidth="3.5"/>
      <line x1="79" y1="68" x2="161" y2="68" stroke="#111111" strokeWidth="3.5" strokeDasharray="6 6" strokeLinecap="round"/>
      <path d="M124 54L104 90H123L116 122L140 84H120L124 54Z" fill="#FFFFFF" stroke="#111111" strokeWidth="3.8" strokeLinejoin="round"/>
      <circle cx="192" cy="132" r="36" fill="#FFFFFF" stroke="#111111" strokeWidth="4.5"/>
      <circle cx="192" cy="132" r="26" fill="#9273C8" stroke="#111111" strokeWidth="3"/>
      <path d="M192 117V145M192 145L181 134M192 145L203 134" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="36" y1="196" x2="218" y2="196" stroke="#111111" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="232" y1="196" x2="244" y2="196" stroke="#111111" strokeWidth="4.5" strokeLinecap="round"/>
    </svg>
  );
};

// 封面插图注册表：content.ts 里写 illustration: 'battery'；新插图在这里加一项
export const illustrations: Record<string, React.FC> = {
  battery: BatteryIllustration,
};
