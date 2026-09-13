import { ActivityIndicator, View, Pressable, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { FlatListLayout } from "@/components/bienestar/layout/FlatListLayout";
import { Text } from "@/components/bienestar/primitives/Text";
import { Reminder } from "@/components/bienestar/Reminder";
import { Colors } from "@/constants/bienestar/colors";
import { useReminder } from "@/hooks/bienestar/useReminder";
import { useHome } from "@/hooks/bienestar/useHome";
import { DetailModal } from "@/components/bienestar/sections/DetailModal";
import { useAuth } from "@/context/auth/AuthContext";
import { buildUrl } from "@/lib/bienestar/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Reminders() {
  const router = useRouter();
  const { user, auth } = useAuth();
  const { reminder: headerReminder, reminders, isPending, refetch } = useReminder();
  const { news, events } = useHome();
  const queryClient = useQueryClient();

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const isManager = user?.type?.toLowerCase() === "manager";

  const handleReminderPress = (item: any) => {
    if (!item.contentId || !item.contentType) return;

    const sourceArray = item.contentType === 'news' ? news : events;
    const relatedItem = sourceArray?.find((i: any) => (i.documentId || i.id.toString()) === item.contentId);

    if (relatedItem) {
      setSelectedItem(relatedItem);
      setIsDetailVisible(true);
    }
  };

  const handleDeleteReminder = (id: number | string) => {
    Alert.alert(
      "Eliminar Aviso",
      "¿Deseas quitar este aviso de la lista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(buildUrl(`reminders/${id}`, false), {
                headers: { Authorization: `Bearer ${auth.token}` }
              });
              queryClient.invalidateQueries({ queryKey: ["reminders"] });
              refetch();
            } catch (error) {
              console.error("Error deleting reminder:", error);
            }
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Limpiar Avisos",
      "¿Estás seguro de que deseas eliminar TODOS los avisos de la lista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpiar Todo",
          style: "destructive",
          onPress: async () => {
            try {
              // En Strapi no hay un "delete all" directo por API estándar sin plugins,
              // así que borramos los que están visibles o informamos.
              for (const r of (reminders ?? [])) {
                await axios.delete(buildUrl(`reminders/${r.documentId || r.id}`, false), {
                  headers: { Authorization: `Bearer ${auth.token}` }
                });
              }
              queryClient.invalidateQueries({ queryKey: ["reminders"] });
              refetch();
              Alert.alert("Éxito", "Lista de avisos limpiada.");
            } catch (error) {
              console.error("Error clearing reminders:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatListLayout
        header={isPending || !headerReminder ? { title: "" } : headerReminder.header}
        layout={{ height: 150, minHeight: 150 }}
        onRefresh={refetch}
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
        ListHeaderComponent={() => (
          <View style={styles.headerRow}>
            <View>
              <Text color="primary" type="subtitle" style={styles.headerTitle}>
                Avisos Recientes
              </Text>
              <Text style={styles.headerSubtitle}>Mantente al día con Bienestar</Text>
            </View>
            {isManager && reminders && reminders.length > 0 && (
              <Pressable onPress={handleClearAll} style={styles.clearAllButton}>
                <MaterialCommunityIcons name="delete-sweep" size={20} color="white" />
                <Text style={styles.clearAllText}>LIMPIAR TODO</Text>
              </Pressable>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        data={reminders ?? []}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        renderItem={({ item }) => (
          <View style={styles.reminderCard}>
            <Pressable onPress={() => handleReminderPress(item)} style={{ flex: 1 }}>
              <Reminder {...item} />
            </Pressable>
            {isManager && (
              <Pressable
                onPress={() => handleDeleteReminder(item.documentId || item.id)}
                style={styles.deleteIcon}
              >
                <MaterialCommunityIcons name="close-circle" size={22} color="#CBD5E1" />
              </Pressable>
            )}
          </View>
        )}
        ListEmptyComponent={() =>
          isPending ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Text style={styles.emptyText}>No hay avisos por ahora</Text>
          )
        }
      />

      <DetailModal
        visible={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
        item={selectedItem}
        isManager={isManager}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: -2,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  clearAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  deleteIcon: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#94A3B8',
    fontSize: 16,
  }
});
