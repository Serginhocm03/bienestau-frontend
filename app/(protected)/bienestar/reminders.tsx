import { ActivityIndicator, View } from "react-native";

import { FlatListLayout } from "@/components/bienestar/layout/FlatListLayout";
import { Text } from "@/components/bienestar/primitives/Text";
import { Reminder } from "@/components/bienestar/Reminder";
import { Colors } from "@/constants/bienestar/colors";
import { useReminder } from "@/hooks/bienestar/useReminder";

export default function Reminders() {
  const { reminder, reminders, isPending, refetch, error } = useReminder();

  return (
    <FlatListLayout
      header={isPending || !reminder ? { title: "" } : reminder.header}
      layout={{ height: 150, minHeight: 150 }}
      onRefresh={refetch}
      contentContainerStyle={{
        gap: 8,
        paddingHorizontal: 32,
        paddingBottom: 16,
      }}
      ListHeaderComponent={() => (
        <View style={{ marginBottom: 16 }}>
          {!reminder && !isPending && (
             <Text style={{ marginBottom: 8, color: 'red' }}>No se pudo cargar la cabecera</Text>
          )}
          <Text color="primary" type="subtitle">
            Lista
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      data={reminders ?? []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Reminder {...item} />}
      ListEmptyComponent={() =>
        isPending ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Text>No hay recordatorios</Text>
        )
      }
    />
  );
}
