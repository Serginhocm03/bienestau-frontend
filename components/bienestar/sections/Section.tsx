import { Image, useWindowDimensions, View } from "react-native";

import { buildMediaUrl } from "@/lib/bienestar/api";
import { Text } from "@/components/bienestar/primitives/Text";
import { ImageAutoScale } from "@/components/bienestar/primitives/ImageAutoScale";
import { Section as ISection } from "@/types/bienestar/section-components";

export interface SectionProps extends ISection {
  paddingVertical?: number;
  paddingHorizontal?: number;
  paddingImage?: number;
}

export function Section({
  paddingHorizontal = 16,
  paddingVertical = 16,
  paddingImage = 32,
  ...sectionProps
}: SectionProps) {
  const { width } = useWindowDimensions();
  const props = {
    paddingHorizontal,
    paddingVertical,
    paddingImage,
    width,
    ...sectionProps,
  };

  switch (sectionProps.design) {
    case "top":
      return <Top {...props} />;
    case "right":
      return <Right {...props} />;
    case "bottom":
      return <Bottom {...props} />;
    case "left":
      return <Left {...props} />;
    default:
      return <Top {...props} />;
  }
}

function Top(sectionProps: SectionProps & { width: number }) {
  return (
    <View
      style={{
        paddingVertical: sectionProps.paddingVertical,
        paddingHorizontal: sectionProps.paddingHorizontal,
        gap: 16,
      }}
    >
      {sectionProps.title && (
        <Text color="primary" type="subtitle" style={{ fontSize: 22 }}>
          {sectionProps.title}
        </Text>
      )}

      {sectionProps.description && (
        <Text style={{ fontSize: 18, lineHeight: 28, textAlign: 'justify' }}>
            {sectionProps.description}
        </Text>
      )}

      {sectionProps.image && (
        <ImageAutoScale
          width={sectionProps.width - sectionProps.paddingImage!}
          style={[
            {
              transform: [{ rotateY: "180deg" }],
            },
          ]}
          resizeMode="contain"
          source={{
            uri: buildMediaUrl(sectionProps.image.url),
          }}
        />
      )}
    </View>
  );
}

function Right(sectionProps: SectionProps & { width: number }) {
  return (
    <View
      style={{
        paddingVertical: sectionProps.paddingVertical,
        paddingRight: sectionProps.paddingHorizontal,
        gap: 16,
      }}
    >
      {sectionProps.title && (
        <Text
          color="primary"
          style={{ marginHorizontal: sectionProps.paddingHorizontal }}
          type="subtitle"
        >
          {sectionProps.title}
        </Text>
      )}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
        }}
      >
        {sectionProps.image ? (
          <ImageAutoScale
            width={140}
            style={[
              {
                transform: [{ rotateY: "180deg" }],
              },
            ]}
            resizeMode="contain"
            source={{
              uri: buildMediaUrl(sectionProps.image.url),
            }}
          />
        ) : (
          <View style={{ width: 140 }} />
        )}

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Text>{sectionProps.description}</Text>
        </View>
      </View>
    </View>
  );
}

function Bottom(sectionProps: SectionProps & { width: number }) {
  return (
    <View
      style={{
        paddingVertical: sectionProps.paddingVertical,
        paddingHorizontal: sectionProps.paddingHorizontal,
        gap: 16,
      }}
    >
      {sectionProps.title && (
        <Text color="primary" type="subtitle">
          {sectionProps.title}
        </Text>
      )}

      {sectionProps.image && (
        <ImageAutoScale
          width={sectionProps.width - sectionProps.paddingImage!}
          style={[
            {
              transform: [{ rotateY: "180deg" }],
            },
          ]}
          resizeMode="contain"
          source={{
            uri: buildMediaUrl(sectionProps.image.url),
          }}
        />
      )}
      {sectionProps.description && <Text>{sectionProps.description}</Text>}
    </View>
  );
}

function Left(sectionProps: SectionProps & { width: number }) {
  return (
    <View
      style={{
        paddingVertical: sectionProps.paddingVertical,
        paddingHorizontal: sectionProps.paddingHorizontal,
        gap: 12,
      }}
    >
      {sectionProps.title && (
        <Text color="primary" type="subtitle" style={{ marginBottom: 8, fontSize: 22 }}>
          {sectionProps.title}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text color="black" style={{ fontSize: 18, lineHeight: 28, textAlign: 'justify' }}>
            {sectionProps.description}
          </Text>
        </View>
        {sectionProps.image && (
          <View style={{
            width: 140, // Un poco más ancha para estilo Wikipedia
            padding: 4,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#CCCCCC',
            backgroundColor: '#F8F9FA',
            alignItems: 'center'
          }}>
            <Image
              style={{ width: '100%', height: 120, borderRadius: 2 }}
              resizeMode="cover"
              source={{
                uri: buildMediaUrl(sectionProps.image.url),
              }}
            />
            {sectionProps.image.caption && (
              <Text style={{ fontSize: 10, marginTop: 4, color: '#666', textAlign: 'left', width: '100%' }}>
                {sectionProps.image.caption}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
