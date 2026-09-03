import { FC, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  useWindowDimensions,
  StyleSheet,
  View,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import AnimatedCarousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import ImageView from "react-native-image-viewing";

import { Text } from "@/components/bienestar/primitives/Text";
import { ImageAutoScale } from "@/components/bienestar/primitives/ImageAutoScale";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Colors } from "@/constants/bienestar/colors";
import { Carousel as ICarousel } from "@/types/bienestar/section-components";
import { Media } from "@/types/bienestar/primitives";

export type CarouselSectionProps =
  | ICarousel
  | {
      title?: string;
      data: { title: string; description?: string; image: Media }[];
      enableZoom?: boolean;
    };

export function CarouselSection(props: CarouselSectionProps) {
  const { width } = useWindowDimensions();

  // 🔍 Eventos
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 📰 Noticias
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const enableZoom = "enableZoom" in props ? props.enableZoom : false;

  const images =
    "data" in props
      ? props.data.map((item) => ({
          uri: buildMediaUrl(item.image.url),
        }))
      : props.images.map((item) => ({
          uri: buildMediaUrl(item.url),
        }));

  const handleImagePress = (index: number, item: any) => {
    if (enableZoom) {
      setCurrentImageIndex(index);
      setIsVisible(true);
      return;
    }

    setSelectedItem(item);
    setIsDetailVisible(true);
  };

  return (
    <View style={{ paddingVertical: 16 }}>
      {props.title && (
        <Text color="primary" type="subtitle" style={{ marginHorizontal: 16 }}>
          {props.title}
        </Text>
      )}

      {"data" in props ? (
        <Carousel
          data={props.data}
          Item={({ item, onLayout, index }) => (
            <Pressable onPress={() => handleImagePress(index, item)}>
              <View onLayout={onLayout} style={styles.container}>
                <ImageAutoScale
                  source={{ uri: buildMediaUrl(item.image.url) }}
                  resizeMode="contain"
                  width={width}
                  style={{ borderRadius: 8 }}
                />
              </View>
            </Pressable>
          )}
        />
      ) : (
        <Carousel
          data={props.images}
          Item={({ item, onLayout, index }) => (
            <Pressable onPress={() => handleImagePress(index, item)}>
              <View onLayout={onLayout} style={styles.container}>
                <ImageAutoScale
                  source={{ uri: buildMediaUrl(item.url) }}
                  resizeMode="contain"
                  width={width}
                  style={{ borderRadius: 8 }}
                />
              </View>
            </Pressable>
          )}
        />
      )}

      {/* 🔍 EVENTOS (ZOOM) */}
      {enableZoom && (
        <ImageView
          images={images}
          imageIndex={currentImageIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
          swipeToCloseEnabled
          doubleTapToZoomEnabled
          backgroundColor="rgb(51, 53, 54)"
        />
      )}

      {/* 📰 NOTICIAS (MODAL PRO) */}
      {!enableZoom && selectedItem && (
        <Modal
          visible={isDetailVisible}
          animationType="slide"
          onRequestClose={() => setIsDetailVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: "#dbdbdb57" }}>
            
            {/* Imagen */}
            <ImageAutoScale
              source={{
                uri:
                  "image" in selectedItem
                    ? buildMediaUrl(selectedItem.image.url)
                    : buildMediaUrl(selectedItem.url),
              }}
              width={width}
              style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
            />

            {/* Contenido */}
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60}}>
              <Text color="primary" type="subtitle">
                {selectedItem.title}
              </Text>

              {selectedItem.description && (
                <Text style={{ marginTop: 12, color: "#000000" }}>
                  {selectedItem.description}
                </Text>
              )}
            </ScrollView>

            {/* Botón cerrar */}
            <Pressable
              onPress={() => setIsDetailVisible(false)}
              style={{
                position: "absolute",
                top: 50,
                right: 20,
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#ffffff" }}>✕</Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.alternative,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export interface CarouselProps<T> {
  data: T[];
  Item: FC<ItemProps<T>>;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  width?: number;
  height?: number;
}

interface ItemProps<T> {
  item: T;
  index: number;
  onLayout: (event: LayoutChangeEvent) => void;
}

export function Carousel<T>({
  autoPlay = true,
  autoPlayInterval = 3000,
  width,
  height = 200,
  Item,
  ...props
}: CarouselProps<T>) {
  const { width: windowWidth } = useWindowDimensions();
  const carouselWidth = width || windowWidth;
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heightContainer, setHeightContainer] = useState(height);

  const setMaxHeight = (height: number) => {
    setHeightContainer((prev) => (height > prev ? height : prev));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AnimatedCarousel
        {...props}
        ref={ref}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        width={carouselWidth}
        height={heightContainer}
        mode="parallax"
        onProgressChange={(offsetProgress, absoluteProgress) => {
          progress.value = absoluteProgress;
          setCurrentIndex(Math.round(absoluteProgress));
        }}
        onConfigurePanGesture={(panGesture) =>
          panGesture
            .activeOffsetY([-999999, 999999])
            .activeOffsetX([-20, 20])
        }
        renderItem={({ item, index }) => (
          <Item
            key={index}
            item={item}
            index={index}
            onLayout={(event) => {
              setMaxHeight(event.nativeEvent.layout.height);
            }}
          />
        )}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: heightContainer,
        }}
      />

      <Pagination.Basic
        progress={progress}
        data={props.data as {}[]}
        dotStyle={{
          borderRadius: 100,
          backgroundColor: Colors.accent,
        }}
        activeDotStyle={{
          borderRadius: 100,
          backgroundColor: Colors.primary,
        }}
        containerStyle={{ gap: 5, marginBottom: 10 }}
        onPress={(i: number) => {
          ref.current?.scrollTo({
            count: i - currentIndex,
            animated: true,
          });
        }}
      />
    </GestureHandlerRootView>
  );
}