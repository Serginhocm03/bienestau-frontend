import { useEffect, useState } from "react";
import { Image, ImageProps } from "react-native";

export interface ImageAutoScaleProps extends ImageProps {
  width?: number;
  height?: number;
}

export function ImageAutoScale({
  source,
  width,
  height,
  style,
  ...props
}: ImageAutoScaleProps) {
  const [dim, setDim] = useState({ width: 0, height: 0 });

  const calculateDimensions = (newHeight: number, newWidth: number) => {
    if (width && height) {
      return setDim({ width: width, height: height });
    }

    if (!width && !height) {
      return setDim({ width: newWidth, height: newHeight });
    }

    if (!width) {
      return setDim({
        width: (height! * newWidth) / newHeight,
        height: height!,
      });
    }

    if (!height) {
      const height = Number(newHeight)
        ? (Math.floor(width!) * newHeight) / newWidth
        : width!;

      return setDim({
        width: width!,
        height: height,
      });
    }
  };

  useEffect(() => {
    if ((source as any).uri) {
      Image.getSize((source as any).uri, (width, height) => {
        calculateDimensions(height, width);
      });
    } else if (source) {
      const { width, height } = Image.resolveAssetSource(source);

      calculateDimensions(height, width);
    }
  }, [width, height, source]);

  return (
    <Image
      source={source}
      style={[style, { width: dim.width, height: dim.height }]}
      {...props}
    />
  );
}
