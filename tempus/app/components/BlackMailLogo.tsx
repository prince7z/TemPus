export const BlackMailLogo = ({ size = 32 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main shield shape */}
    <path d="M20 15 L80 15 L85 25 L85 70 C85 80 75 90 50 90 C25 90 15 80 15 70 L15 25 Z" />
    
    {/* Cat ears */}
    <path d="M30 15 L35 5 L45 15 Z" />
    <path d="M55 15 L65 5 L70 15 Z" />
    
    {/* Cat eyes */}
    <ellipse cx="35" cy="35" rx="4" ry="6" fill="white" />
    <ellipse cx="65" cy="35" rx="4" ry="6" fill="white" />
    
    {/* Cat nose/mouth area - stylized "E" shapes */}
    <g fill="white" fontSize="12" fontWeight="bold" fontFamily="monospace">
      {/* Left "E" */}
      <path d="M25 50 L35 50 M25 50 L25 60 M25 55 L32 55 M25 60 L35 60" stroke="white" strokeWidth="2" fill="none" />
      
      {/* Right "E" (mirrored) */}
      <path d="M75 50 L65 50 M75 50 L75 60 M75 55 L68 55 M75 60 L65 60" stroke="white" strokeWidth="2" fill="none" />
    </g>
    
    {/* Bottom point of shield */}
    <path d="M40 80 L50 90 L60 80" fill="currentColor" />
  </svg>
);

export const BlackMailLogoDark = ({ size = 32 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main shield shape */}
    <path d="M20 15 L80 15 L85 25 L85 70 C85 80 75 90 50 90 C25 90 15 80 15 70 L15 25 Z" stroke="white" strokeWidth="2" fill="none" />
    
    {/* Cat ears */}
    <path d="M30 15 L35 5 L45 15 Z" stroke="white" strokeWidth="2" fill="none" />
    <path d="M55 15 L65 5 L70 15 Z" stroke="white" strokeWidth="2" fill="none" />
    
    {/* Cat eyes */}
    <ellipse cx="35" cy="35" rx="4" ry="6" fill="white" />
    <ellipse cx="65" cy="35" rx="4" ry="6" fill="white" />
    
    {/* Cat nose/mouth area - stylized "E" shapes */}
    <g fill="white">
      {/* Left "E" */}
      <path d="M25 50 L35 50 M25 50 L25 60 M25 55 L32 55 M25 60 L35 60" stroke="white" strokeWidth="2" fill="none" />
      
      {/* Right "E" (mirrored) */}
      <path d="M75 50 L65 50 M75 50 L75 60 M75 55 L68 55 M75 60 L65 60" stroke="white" strokeWidth="2" fill="none" />
    </g>
    
    {/* Bottom point of shield */}
    <path d="M40 80 L50 90 L60 80" stroke="white" strokeWidth="2" fill="none" />
  </svg>
);