/**
 * The area covered, drawn from real data rather than sketched.
 *
 * The coastline is OpenStreetMap's own — 1,424 points across 41 ways, joined end to end
 * and simplified to 200 — projected equirectangular with a cos(latitude) correction, so
 * the shape is true and not stretched. Every town sits at its geocoded position.
 *
 * Only twelve towns carry a label. Twenty-one labels at this size is an unreadable map,
 * and the list beside it names them all anyway. Coastal labels go out over the sea
 * because on a map of a coastal strip the sea is the only empty space; a leader line is
 * drawn only where a label had to move to clear its neighbour.
 *
 * Map data © OpenStreetMap contributors, ODbL. The credit renders under the map.
 */
export function AreaMap() {
  return (
    <figure>
      <svg
        viewBox="0 -8 720 736"
        className="h-auto w-full rounded-xl ring-1 ring-slate-200"
        role="img"
        aria-labelledby="areamap-title areamap-desc"
      >
        <title id="areamap-title">
          The Tweed coast and hinterland, with the towns visited marked
        </title>
        <desc id="areamap-desc">
          The coast from Tugun in the north to Brunswick Heads in the south, with
          Murwillumbah, Uki and Burringbar inland. Every town in the list beside this map
          is marked on it. A dashed line shows 30 km from Burringbar.
        </desc>

        <rect x="-1" y="-9" width="722" height="738" fill="#eef6fb" />
        <path d="M318.9,-213.3 L322.6,-214.7 L323.5,-216.5 L322.0,-220.2 L321.1,-220.0 L321.5,-220.8 L320.5,-221.1 L319.8,-222.8 L320.8,-222.9 L320.5,-224.5 L321.6,-225.2 L322.0,-227.9 L319.3,-228.7 L318.6,-230.7 L318.9,-247.0 L320.5,-251.3 L319.3,-258.5 L320.0,-261.2 L319.5,-263.4 L318.6,-264.0 L315.9,-263.5 L316.5,-251.8 L315.5,-251.6 L314.9,-252.5 L314.9,-263.6 L316.0,-266.3 L318.8,-268.9 L331.5,-272.4 L326.9,-271.1 L326.0,-264.3 L326.2,-215.7 L328.8,-174.4 L333.5,-137.0 L339.0,-106.3 L347.7,-67.8 L349.4,-65.0 L352.1,-53.4 L355.6,-44.1 L358.8,-39.1 L363.4,-38.5 L366.9,-36.1 L367.5,-33.1 L369.2,-31.1 L377.7,-6.9 L381.2,0.6 L381.8,0.5 L381.3,0.8 L382.9,3.9 L387.2,10.4 L392.7,16.1 L397.5,18.6 L398.3,17.2 L401.1,16.3 L402.4,14.8 L402.8,15.6 L402.0,17.1 L406.1,24.8 L407.5,25.7 L407.4,26.8 L410.5,32.6 L411.8,33.4 L421.9,50.5 L426.8,56.9 L438.6,67.2 L453.7,75.7 L463.4,78.1 L469.4,75.2 L468.8,75.8 L469.6,76.2 L476.5,77.4 L479.8,75.0 L483.4,74.4 L486.3,71.3 L489.2,74.8 L489.0,77.9 L490.7,81.4 L494.8,80.9 L491.6,81.7 L492.1,83.8 L495.3,83.6 L493.5,84.0 L493.8,87.2 L498.5,102.2 L508.1,121.3 L512.9,127.4 L515.0,128.1 L514.9,130.1 L513.4,130.4 L512.9,131.4 L511.1,139.5 L508.9,160.3 L509.6,175.0 L512.0,189.8 L516.2,201.7 L522.0,209.6 L526.7,212.9 L534.2,215.6 L534.5,218.1 L524.9,256.7 L518.4,291.8 L516.2,307.9 L515.6,321.8 L516.6,329.6 L520.6,333.3 L520.1,334.5 L521.7,335.0 L523.6,334.0 L524.2,334.6 L523.8,335.6 L520.6,336.7 L519.1,350.2 L519.0,361.3 L522.0,371.6 L523.6,372.0 L525.2,370.7 L527.2,375.0 L526.6,376.6 L524.9,375.6 L523.9,376.5 L520.3,384.4 L512.4,412.7 L513.4,413.7 L512.3,413.9 L508.6,429.8 L506.0,447.8 L503.4,455.5 L499.6,472.6 L493.2,509.1 L491.0,526.9 L489.0,560.4 L488.6,594.4 L489.9,627.1 L492.1,636.4 L493.8,638.6 L497.3,640.1 L497.6,641.2 L496.3,641.7 L496.5,651.5 L499.4,674.1 L505.7,701.3 L511.7,720.7 L520.5,739.5 L542.0,773.1 L558.3,789.7 L569.4,795.6 L572.0,795.4 L581.4,797.9 L585.5,797.6 L589.5,795.5 L591.2,790.8 L590.4,790.2 L591.0,789.6 L597.4,789.8 L599.2,789.1 L601.2,786.8 L603.5,786.4 L604.4,784.6 L604.8,785.7 L603.7,788.2 L604.9,789.4 L602.8,794.7 L602.9,799.5 L601.6,800.4 L600.2,799.2 L598.5,801.3 L592.6,812.1 L588.6,821.3 L579.6,846.9 L576.0,859.4 L573.6,870.1 L571.9,886.9 L572.9,891.4 L574.8,894.1 L577.1,894.0 L579.3,895.0 L578.7,897.5 L579.7,898.2 L578.6,898.2 L576.9,901.7 L576.9,903.0 L577.7,903.2 L576.5,905.2 L577.2,906.7 L576.6,907.4 L577.5,909.7 L576.1,911.5 L575.6,914.1 L577.9,916.9 L579.0,921.2 L576.7,921.6 L574.6,925.6 L574.6,927.2 L572.1,928.5 L568.2,936.9 L560.7,955.9 L554.1,976.7 L547.4,1006.5 L546.5,1027.7 L547.7,1035.6 L549.2,1039.7 L0,712.1 L0,0 Z" fill="#f4f4f0" />
        <path d="M318.9,-213.3 L322.6,-214.7 L323.5,-216.5 L322.0,-220.2 L321.1,-220.0 L321.5,-220.8 L320.5,-221.1 L319.8,-222.8 L320.8,-222.9 L320.5,-224.5 L321.6,-225.2 L322.0,-227.9 L319.3,-228.7 L318.6,-230.7 L318.9,-247.0 L320.5,-251.3 L319.3,-258.5 L320.0,-261.2 L319.5,-263.4 L318.6,-264.0 L315.9,-263.5 L316.5,-251.8 L315.5,-251.6 L314.9,-252.5 L314.9,-263.6 L316.0,-266.3 L318.8,-268.9 L331.5,-272.4 L326.9,-271.1 L326.0,-264.3 L326.2,-215.7 L328.8,-174.4 L333.5,-137.0 L339.0,-106.3 L347.7,-67.8 L349.4,-65.0 L352.1,-53.4 L355.6,-44.1 L358.8,-39.1 L363.4,-38.5 L366.9,-36.1 L367.5,-33.1 L369.2,-31.1 L377.7,-6.9 L381.2,0.6 L381.8,0.5 L381.3,0.8 L382.9,3.9 L387.2,10.4 L392.7,16.1 L397.5,18.6 L398.3,17.2 L401.1,16.3 L402.4,14.8 L402.8,15.6 L402.0,17.1 L406.1,24.8 L407.5,25.7 L407.4,26.8 L410.5,32.6 L411.8,33.4 L421.9,50.5 L426.8,56.9 L438.6,67.2 L453.7,75.7 L463.4,78.1 L469.4,75.2 L468.8,75.8 L469.6,76.2 L476.5,77.4 L479.8,75.0 L483.4,74.4 L486.3,71.3 L489.2,74.8 L489.0,77.9 L490.7,81.4 L494.8,80.9 L491.6,81.7 L492.1,83.8 L495.3,83.6 L493.5,84.0 L493.8,87.2 L498.5,102.2 L508.1,121.3 L512.9,127.4 L515.0,128.1 L514.9,130.1 L513.4,130.4 L512.9,131.4 L511.1,139.5 L508.9,160.3 L509.6,175.0 L512.0,189.8 L516.2,201.7 L522.0,209.6 L526.7,212.9 L534.2,215.6 L534.5,218.1 L524.9,256.7 L518.4,291.8 L516.2,307.9 L515.6,321.8 L516.6,329.6 L520.6,333.3 L520.1,334.5 L521.7,335.0 L523.6,334.0 L524.2,334.6 L523.8,335.6 L520.6,336.7 L519.1,350.2 L519.0,361.3 L522.0,371.6 L523.6,372.0 L525.2,370.7 L527.2,375.0 L526.6,376.6 L524.9,375.6 L523.9,376.5 L520.3,384.4 L512.4,412.7 L513.4,413.7 L512.3,413.9 L508.6,429.8 L506.0,447.8 L503.4,455.5 L499.6,472.6 L493.2,509.1 L491.0,526.9 L489.0,560.4 L488.6,594.4 L489.9,627.1 L492.1,636.4 L493.8,638.6 L497.3,640.1 L497.6,641.2 L496.3,641.7 L496.5,651.5 L499.4,674.1 L505.7,701.3 L511.7,720.7 L520.5,739.5 L542.0,773.1 L558.3,789.7 L569.4,795.6 L572.0,795.4 L581.4,797.9 L585.5,797.6 L589.5,795.5 L591.2,790.8 L590.4,790.2 L591.0,789.6 L597.4,789.8 L599.2,789.1 L601.2,786.8 L603.5,786.4 L604.4,784.6 L604.8,785.7 L603.7,788.2 L604.9,789.4 L602.8,794.7 L602.9,799.5 L601.6,800.4 L600.2,799.2 L598.5,801.3 L592.6,812.1 L588.6,821.3 L579.6,846.9 L576.0,859.4 L573.6,870.1 L571.9,886.9 L572.9,891.4 L574.8,894.1 L577.1,894.0 L579.3,895.0 L578.7,897.5 L579.7,898.2 L578.6,898.2 L576.9,901.7 L576.9,903.0 L577.7,903.2 L576.5,905.2 L577.2,906.7 L576.6,907.4 L577.5,909.7 L576.1,911.5 L575.6,914.1 L577.9,916.9 L579.0,921.2 L576.7,921.6 L574.6,925.6 L574.6,927.2 L572.1,928.5 L568.2,936.9 L560.7,955.9 L554.1,976.7 L547.4,1006.5 L546.5,1027.7 L547.7,1035.6 L549.2,1039.7" fill="none" stroke="#94a3b8" strokeWidth={1.6} />

        {/* 30 km from Burringbar. It leaves the frame north and east, which is the point:
            everything drawn here is inside it. */}
        <circle
          cx={383.3}
          cy={482.3}
          r={408.3}
          fill="none"
          stroke="#b45309"
          strokeWidth={1.6}
          strokeDasharray="8 7"
          opacity={0.6}
        />

      <g>
        <circle cx={407.2} cy={51.2} r={4.4} fill="#1e3a5f" />
        <text x={398.2} y={57.5} textAnchor="end" fill="#334155" fontSize="18">Tugun</text>
      </g>
      <g>
        <circle cx={471.7} cy={80.7} r={4.4} fill="#1e3a5f" />
        <text x={480.7} y={87.0} textAnchor="start" fill="#334155" fontSize="18">Coolangatta</text>
      </g>
      <g>
        <path d="M469.3,96.5 L478.3,106.7" stroke="#cbd5e1" strokeWidth={1} fill="none" />
        <circle cx={469.3} cy={96.5} r={4.4} fill="#1e3a5f" />
        <text x={478.3} y={113.0} textAnchor="start" fill="#334155" fontSize="18">Tweed Heads</text>
      </g>
      <circle cx={466.6} cy={129.2} r={3.4} fill="#64748b" />
      <circle cx={424.3} cy={111.5} r={3.4} fill="#64748b" />
      <circle cx={509.1} cy={133.3} r={3.4} fill="#64748b" />
      <g>
        <circle cx={469.4} cy={162.2} r={4.4} fill="#1e3a5f" />
        <text x={478.4} y={168.5} textAnchor="start" fill="#334155" fontSize="18">Banora Point</text>
      </g>
      <circle cx={402.2} cy={144.5} r={3.4} fill="#64748b" />
      <circle cx={432.6} cy={197.8} r={3.4} fill="#64748b" />
      <circle cx={495.0} cy={179.5} r={3.4} fill="#64748b" />
      <circle cx={487.3} cy={240.0} r={3.4} fill="#64748b" />
      <g>
        <circle cx={521.5} cy={214.6} r={4.4} fill="#1e3a5f" />
        <text x={530.5} y={220.9} textAnchor="start" fill="#334155" fontSize="18">Kingscliff</text>
      </g>
      <circle cx={518.5} cy={263.5} r={3.4} fill="#64748b" />
      <g>
        <circle cx={513.6} cy={327.2} r={4.4} fill="#1e3a5f" />
        <text x={522.6} y={333.5} textAnchor="start" fill="#334155" fontSize="18">Cabarita Beach</text>
      </g>
      <circle cx={519.6} cy={377.1} r={3.4} fill="#64748b" />
      <g>
        <circle cx={501.1} cy={412.0} r={4.4} fill="#1e3a5f" />
        <text x={510.1} y={418.3} textAnchor="start" fill="#334155" fontSize="18">Pottsville</text>
      </g>
      <g>
        <circle cx={282.9} cy={320.8} r={4.4} fill="#1e3a5f" />
        <text x={273.9} y={327.1} textAnchor="end" fill="#334155" fontSize="18">Murwillumbah</text>
      </g>
      <g>
        <circle cx={194.1} cy={455.0} r={4.4} fill="#1e3a5f" />
        <text x={185.1} y={461.3} textAnchor="end" fill="#334155" fontSize="18">Uki</text>
      </g>
      <g>
        <circle cx={383.3} cy={482.3} r={6} fill="#b45309" />
        <text x={374.3} y={488.6} textAnchor="end" fill="#334155" fontSize="18" fontWeight="600">Burringbar</text>
      </g>
      <circle cx={473.3} cy={614.5} r={3.4} fill="#64748b" />
      <g>
        <circle cx={484.5} cy={642.2} r={4.4} fill="#1e3a5f" />
        <text x={493.5} y={648.5} textAnchor="start" fill="#334155" fontSize="18">Brunswick Heads</text>
      </g>
      <g>
        <circle cx={421.5} cy={656.5} r={4.4} fill="#1e3a5f" />
        <text x={412.5} y={662.8} textAnchor="end" fill="#334155" fontSize="18">Mullumbimby</text>
      </g>

        <g>
          <path d="M36,700 L172.1,700" stroke="#475569" strokeWidth={2.5} />
          <path d="M36,694 L36,706 M172.1,694 L172.1,706" stroke="#475569" strokeWidth={2} />
          <text x="36" y="688" fill="#475569" fontSize="16">10 km</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs leading-relaxed text-slate-500">
        The dashed line is 30 km from Burringbar; everything marked is inside it. Map data
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-slate-700"
        >
          OpenStreetMap
        </a>{" "}
        contributors.
      </figcaption>
    </figure>
  );
}
