import styles from './DevCartoon.module.css'

export default function DevCartoon() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <svg viewBox="0 0 200 220" width="200" height="220" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="deskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e"/>
            <stop offset="100%" stopColor="#0d0d1a"/>
          </linearGradient>
          <linearGradient id="monitorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1e3a"/>
            <stop offset="100%" stopColor="#12122a"/>
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5c5a3"/>
            <stop offset="100%" stopColor="#e8a882"/>
          </linearGradient>
          <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B68EE"/>
            <stop offset="100%" stopColor="#534AB7"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* desk */}
        <rect x="10" y="168" width="180" height="12" rx="4" fill="url(#deskGrad)" stroke="rgba(123,104,238,0.3)" strokeWidth="0.5"/>
        <rect x="30" y="180" width="8" height="30" rx="2" fill="#0d0d1a"/>
        <rect x="162" y="180" width="8" height="30" rx="2" fill="#0d0d1a"/>

        {/* monitor stand */}
        <rect x="93" y="148" width="14" height="22" rx="2" fill="#1a1a2e"/>
        <rect x="78" y="165" width="44" height="6" rx="3" fill="#1a1a2e"/>

        {/* monitor */}
        <rect x="42" y="78" width="116" height="74" rx="8" fill="url(#monitorGrad)" stroke="rgba(123,104,238,0.4)" strokeWidth="1"/>
        <rect x="47" y="83" width="106" height="62" rx="5" fill="#060612"/>

        {/* screen glow bg */}
        <rect x="47" y="83" width="106" height="62" rx="5" fill="url(#screenGlow)" opacity="0.4"/>

        {/* code lines on screen — animated */}
        <g className={styles.codeLine} style={{'--d':'0s'} as React.CSSProperties}>
          <rect x="54" y="90" width="30" height="3" rx="1.5" fill="#7B68EE" opacity="0.9"/>
          <rect x="88" y="90" width="20" height="3" rx="1.5" fill="#FF6B9D" opacity="0.8"/>
          <rect x="112" y="90" width="15" height="3" rx="1.5" fill="#39D98A" opacity="0.7"/>
        </g>
        <g className={styles.codeLine} style={{'--d':'0.15s'} as React.CSSProperties}>
          <rect x="58" y="96" width="18" height="3" rx="1.5" fill="#00D9FF" opacity="0.8"/>
          <rect x="80" y="96" width="35" height="3" rx="1.5" fill="#7B68EE" opacity="0.6"/>
        </g>
        <g className={styles.codeLine} style={{'--d':'0.3s'} as React.CSSProperties}>
          <rect x="54" y="102" width="25" height="3" rx="1.5" fill="#39D98A" opacity="0.9"/>
          <rect x="83" y="102" width="12" height="3" rx="1.5" fill="#FF6B9D" opacity="0.7"/>
          <rect x="99" y="102" width="28" height="3" rx="1.5" fill="#00D9FF" opacity="0.6"/>
        </g>
        <g className={styles.codeLine} style={{'--d':'0.45s'} as React.CSSProperties}>
          <rect x="58" y="108" width="40" height="3" rx="1.5" fill="#7B68EE" opacity="0.7"/>
          <rect x="102" y="108" width="18" height="3" rx="1.5" fill="#39D98A" opacity="0.8"/>
        </g>
        <g className={styles.codeLine} style={{'--d':'0.6s'} as React.CSSProperties}>
          <rect x="54" y="114" width="15" height="3" rx="1.5" fill="#FF6B9D" opacity="0.6"/>
          <rect x="73" y="114" width="30" height="3" rx="1.5" fill="#00D9FF" opacity="0.9"/>
          <rect x="107" y="114" width="20" height="3" rx="1.5" fill="#7B68EE" opacity="0.5"/>
        </g>
        <g className={styles.codeLine} style={{'--d':'0.75s'} as React.CSSProperties}>
          <rect x="58" y="120" width="22" height="3" rx="1.5" fill="#39D98A" opacity="0.7"/>
          <rect x="84" y="120" width="45" height="3" rx="1.5" fill="#FF6B9D" opacity="0.6"/>
        </g>
        <g className={styles.codeLine} style={{'--d':'0.9s'} as React.CSSProperties}>
          <rect x="54" y="126" width="35" height="3" rx="1.5" fill="#00D9FF" opacity="0.8"/>
          <rect x="93" y="126" width="18" height="3" rx="1.5" fill="#7B68EE" opacity="0.7"/>
        </g>

        {/* blinking cursor on screen */}
        <rect x="54" y="133" width="2" height="8" rx="1" fill="#00D9FF" className={styles.blinkCursor} filter="url(#glow)"/>

        {/* keyboard */}
        <rect x="55" y="171" width="90" height="16" rx="4" fill="#111128" stroke="rgba(123,104,238,0.25)" strokeWidth="0.5"/>
        <g fill="rgba(123,104,238,0.4)">
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <rect key={i} x={60 + i*9} y="175" width="6" height="4" rx="1"/>
          ))}
          {[0,1,2,3,4,5,6,7].map(i => (
            <rect key={i} x={64 + i*9} y="181" width="6" height="4" rx="1"/>
          ))}
        </g>

        {/* chair back */}
        <rect x="72" y="190" width="56" height="28" rx="8" fill="#111128" stroke="rgba(123,104,238,0.2)" strokeWidth="0.5"/>

        {/* body / shirt */}
        <ellipse cx="100" cy="200" rx="26" ry="18" fill="url(#shirtGrad)"/>

        {/* arms - typing animation */}
        <g className={styles.armLeft}>
          <path d="M76 195 Q60 200 62 210" stroke="url(#shirtGrad)" strokeWidth="10" strokeLinecap="round" fill="none"/>
          <ellipse cx="62" cy="213" rx="7" ry="5" fill="url(#skinGrad)"/>
        </g>
        <g className={styles.armRight}>
          <path d="M124 195 Q140 200 138 210" stroke="url(#shirtGrad)" strokeWidth="10" strokeLinecap="round" fill="none"/>
          <ellipse cx="138" cy="213" rx="7" ry="5" fill="url(#skinGrad)"/>
        </g>

        {/* neck */}
        <rect x="94" y="172" width="12" height="14" rx="4" fill="url(#skinGrad)"/>

        {/* head */}
        <ellipse cx="100" cy="158" rx="22" ry="20" fill="url(#skinGrad)"/>

        {/* hair */}
        <path d="M78 152 Q80 132 100 130 Q120 132 122 152 Q115 140 100 139 Q85 140 78 152Z" fill="#1a0a00"/>
        <path d="M78 152 Q75 148 77 144 Q79 138 84 136" stroke="#1a0a00" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M122 152 Q125 148 123 144 Q121 138 116 136" stroke="#1a0a00" strokeWidth="4" strokeLinecap="round" fill="none"/>

        {/* eyes */}
        <ellipse cx="93" cy="157" rx="4" ry="4.5" fill="#fff"/>
        <ellipse cx="107" cy="157" rx="4" ry="4.5" fill="#fff"/>
        <ellipse cx="93" cy="158" rx="2.5" ry="3" fill="#1a0a00" className={styles.eyeBlink}/>
        <ellipse cx="107" cy="158" rx="2.5" ry="3" fill="#1a0a00" className={styles.eyeBlink}/>
        <ellipse cx="93.8" cy="157" rx="1" ry="1" fill="#fff"/>
        <ellipse cx="107.8" cy="157" rx="1" ry="1" fill="#fff"/>

        {/* glasses */}
        <rect x="87" y="153" width="11" height="9" rx="3" fill="none" stroke="#00D9FF" strokeWidth="1" opacity="0.7"/>
        <rect x="101" y="153" width="11" height="9" rx="3" fill="none" stroke="#00D9FF" strokeWidth="1" opacity="0.7"/>
        <line x1="98" y1="157" x2="101" y2="157" stroke="#00D9FF" strokeWidth="1" opacity="0.7"/>
        <line x1="87" y1="157" x2="84" y2="156" stroke="#00D9FF" strokeWidth="1" opacity="0.7"/>
        <line x1="112" y1="157" x2="115" y2="156" stroke="#00D9FF" strokeWidth="1" opacity="0.7"/>

        {/* smile */}
        <path d="M94 167 Q100 172 106 167" stroke="#c47a5a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

        {/* headphones */}
        <path d="M78 154 Q78 132 100 132 Q122 132 122 154" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <rect x="75" y="152" width="7" height="10" rx="3" fill="#534AB7"/>
        <rect x="118" y="152" width="7" height="10" rx="3" fill="#534AB7"/>

        {/* floating code snippets */}
        <g className={styles.floatTag1} filter="url(#glow)">
          <rect x="130" y="88" width="52" height="18" rx="5" fill="rgba(57,217,138,0.1)" stroke="rgba(57,217,138,0.4)" strokeWidth="0.5"/>
          <text x="156" y="100" textAnchor="middle" fontSize="8" fill="#39D98A" fontFamily="monospace">flutter run</text>
        </g>
        <g className={styles.floatTag2} filter="url(#glow)">
          <rect x="14" y="95" width="44" height="18" rx="5" fill="rgba(0,217,255,0.1)" stroke="rgba(0,217,255,0.4)" strokeWidth="0.5"/>
          <text x="36" y="107" textAnchor="middle" fontSize="8" fill="#00D9FF" fontFamily="monospace">npm dev</text>
        </g>
        <g className={styles.floatTag3} filter="url(#glow)">
          <rect x="138" y="118" width="46" height="18" rx="5" fill="rgba(123,104,238,0.1)" stroke="rgba(123,104,238,0.4)" strokeWidth="0.5"/>
          <text x="161" y="130" textAnchor="middle" fontSize="8" fill="#7B68EE" fontFamily="monospace">git push</text>
        </g>
      </svg>
    </div>
  )
}
