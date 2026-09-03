import { ComponentType, isValidElement } from "react";
import {
  FlatList,
  FlatListProps,
  Image,
  RefreshControl,
  useWindowDimensions,
  View,
} from "react-native";

import { Colors } from "@/constants/bienestar/colors";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { AnimatedText } from "@/components/bienestar/primitives/Text";
import { Header } from "@/components/bienestar/layout/Header";
import { Header as IHeader, Layout } from "@/types/bienestar/components";

export interface FlatListLayoutProps<T> extends FlatListProps<T> {
  header: IHeader;
  layout: Layout;
  onRefresh?: () => void;
}

export function FlatListLayout<T>({
  header,
  layout,
  onRefresh,
  ...props
}: FlatListLayoutProps<T>) {
  const { width } = useWindowDimensions();
  let { ListHeaderComponent } = props;

  // the following code is correct as it is based on the official react-native repository
  // https://github.com/facebook/react-native/blob/f8f95b9612d9202b7cb57f586e553a8e2126ac26/packages/virtualized-lists/Lists/VirtualizedList.js#L912-L918
  if (ListHeaderComponent && !isValidElement(ListHeaderComponent)) {
    const ListHeader = ListHeaderComponent as ComponentType<any>;
    ListHeaderComponent = <ListHeader />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <FlatList
        {...props}
        ListHeaderComponent={() => (
          <View style={{ width: width }}>
            <View
              style={{ height: layout.height /* MAYEBE: layout.minHeight */ }}
            />
            {ListHeaderComponent}
          </View>
        )}
        refreshControl={
          <RefreshControl
            progressViewOffset={layout.height}
            refreshing={false}
            enabled={!!onRefresh}
            onRefresh={onRefresh}
          />
        }
      />

      <View
        style={[{ position: "absolute", width: "100%", height: layout.height }]}
      >
        <Header layout={layout} />
        <View
          style={{
            flex: 1,

            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AnimatedText
            type="title"
            color="background"
            style={[
              {
                paddingHorizontal: 16,
              },
            ]}
          >
            {header.title}
          </AnimatedText>
          {header.image && (
            <Image
              style={[
                {
                  height: "100%",
                  width: 150,
                },
              ]}
              resizeMode="contain"
              source={{
                uri: buildMediaUrl(header.image.url),
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
