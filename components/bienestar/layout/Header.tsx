import { useWindowDimensions } from "react-native";
import { Path, Svg } from "react-native-svg";

import { Colors } from "@/constants/bienestar/colors";
import { Layout } from "@/types/bienestar/components";

export interface HeaderProps {
  layout: Layout;
}

export function Header({ layout }: HeaderProps) {
  const { width } = useWindowDimensions();
  const h = layout.height;

  return (
    <Svg width={width} height={h} style={{ position: "absolute" }}>
      {/* Capa Roja (Acento) - Curva más suave y proporcionada */}
      <Path
        d={`M 0 ${h * 0.9} Q ${width / 2} ${h * 1.15} ${width} ${h * 0.8} L ${width} 0 L 0 0 Z`}
        fill={Colors.secondary}
      />
      {/* Capa Azul (Principal) - Curva más arriba para dejar ver el rojo */}
      <Path
        d={`M 0 ${h * 0.8} Q ${width / 3} ${h * 1.05} ${width} ${h * 0.7} L ${width} 0 L 0 0 Z`}
        fill={Colors.primary}
      />
    </Svg>
  );
}
