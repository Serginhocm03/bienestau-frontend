import { Link, useRouter } from "expo-router";

import { Colors } from "@/constants/bienestar/colors";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";
import { ActivityIndicator, Pressable, View, StyleSheet, Alert, Image as RNImage } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { DynamicSections } from "@/components/bienestar/sections/DynamicSections";
import { Text } from "@/components/bienestar/primitives/Text";
import { Button } from "@/components/bienestar/from/Button";
import { Reminder } from "@/components/bienestar/Reminder";
import { useAuth } from "@/context/auth/AuthContext";
import { useHome } from "@/hooks/bienestar/useHome";
import { NewsHero } from "@/components/bienestar/sections/NewsHero";
import { NewsFeedItem } from "@/components/bienestar/sections/NewsFeedItem";
import { SectionHeader } from "@/components/bienestar/sections/SectionHeader";
import { EventCard } from "@/components/bienestar/sections/EventCard";
import { TopTabs, TabType } from "@/components/bienestar/sections/TopTabs";
import { DetailModal } from "@/components/bienestar/sections/DetailModal";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { buildUrl } from "@/lib/bienestar/api";

export default function Home() {
  const router = useRouter();
  const { auth, user } = useAuth();
  const { home, reminder, events, news, isPending, refetch } = useHome();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabType>("noticias");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  // Verificar si el usuario es docente/administrador
  const isManager = user?.type?.toLowerCase() === "manager";

  const handlePress = (item: any) => {
    if (!item) return;
    setSelectedItem(item);
    setIsDetailVisible(true);
  };

  const handleReminderPress = (item: any) => {
    if (!item || !item.contentId || !item.contentType) {
      router.push("/(protected)/bienestar/reminders");
      return;
    }

    const sourceArray = item.contentType === 'news' ? news : events;
    const relatedItem = sourceArray?.find((i: any) => (i.documentId || i.id.toString()) === item.contentId);

    if (relatedItem) {
      handlePress(relatedItem);
    } else {
      router.push("/(protected)/bienestar/reminders");
    }
  };

  const handleEdit = (item: any, type: 'news' | 'event') => {
    router.push({
      pathname: "/(protected)/bienestar/create",
      params: {
        id: item.documentId || item.id,
        type: type,
        initialTitle: item.title,
        initialDescription: item.description,
        initialDate: item.date,
        initialImageUrl: item.image?.url || null
      }
    });
  };

  const handleDelete = (item: any, type: 'news' | 'event') => {
    Alert.alert(
      "Confirmar Eliminación",
      `¿Estás seguro de que deseas eliminar esta ${type === 'news' ? 'noticia' : 'evento'}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const endpoint = type === 'news' ? 'news' : 'events';
              const id = item.documentId || item.id;
              await axios.delete(buildUrl(`${endpoint}/${id}`, false), {
                headers: { Authorization: `Bearer ${auth.token}` }
              });

              Alert.alert("Éxito", "Eliminado correctamente");
              queryClient.invalidateQueries({ queryKey: ["news"] });
              queryClient.invalidateQueries({ queryKey: ["events"] });
              queryClient.invalidateQueries({ queryKey: ["reminders"] });
              refetch();
            } catch (error) {
              console.error("Error deleting:", error);
              Alert.alert("Error", "No se pudo eliminar");
            }
          }
        }
      ]
    );
  };

  // Filtrar el recordatorio según el tipo de usuario
  const filteredReminder = React.useMemo(() => {
    if (!reminder || !user) return reminder;
    
    if (reminder.to === "all") return reminder;
    if (reminder.to === "students" && user.type === "student") return reminder;
    if (reminder.to === "managers" && user.type === "manager") return reminder;
    
    return undefined;
  }, [reminder, user]);

  const heroNews = news && news.length > 0 ? news[0] : null;

  return (
    <ScrollViewLayout
      layout={{ height: 0, minHeight: 0 }}
      header={{ title: "" }}
      onRefresh={refetch}
      floatingAction={
        isManager && (
          <Pressable
            style={styles.fab}
            onPress={() => {
              router.push("/(protected)/bienestar/create");
            }}
          >
            <RNImage
              source={require("@/assets/images/Crear.png")}
              style={{ width: 30, height: 30, tintColor: 'white' }}
              resizeMode="contain"
            />
          </Pressable>
        )
      }
    >
      <TopTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {isPending ? (
        <ActivityIndicator size="large" color={Colors.secondary} style={{ marginTop: 50 }} />
      ) : !home ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text color="primary">No se pudo cargar la información de inicio.</Text>
          <Button title="Reintentar" onPress={refetch} />
        </View>
      ) : (
        <View style={styles.container}>
          {filteredReminder && (
            <View style={styles.featuredReminder}>
              <View style={styles.featuredLabel}>
                <MaterialCommunityIcons name="sparkles" size={16} color="white" />
                <Text style={styles.featuredLabelText}>LO MÁS RECIENTE</Text>
              </View>
              <Pressable onPress={() => handleReminderPress(filteredReminder)}>
                <Reminder {...filteredReminder} />
              </Pressable>
            </View>
          )}

          {activeTab === "noticias" ? (
            <>
              {/* HERO STORY */}
              {heroNews && (
                <NewsHero
                  title={heroNews.title}
                  description={heroNews.description}
                  image={heroNews.image}
                  onPress={() => handlePress(heroNews)}
                />
              )}

              {/* NEWS FEED */}
              <View style={styles.section}>
                {news && news.length > 0 ? (
                  news.slice(heroNews ? 1 : 0).map((item) => (
                    <NewsFeedItem
                      key={item.documentId || item.id}
                      title={item.title}
                      description={item.description}
                      image={item.image}
                      onPress={() => handlePress(item)}
                      isLast={item.id === news[news.length - 1]?.id}
                    />
                  ))
                ) : (
                  <View style={{ padding: 40, alignItems: 'center' }}>
                    <Text color="gray">No hay noticias disponibles</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.section}>
              <SectionHeader title="EVENTOS" />
              {events && events.length > 0 ? (
                events.map((item) => (
                  <EventCard
                    key={item.documentId || item.id}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    onPress={() => handlePress(item)}
                    fecha_evento={item.fecha_evento}
                  />
                ))
              ) : (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Text color="gray">No hay eventos programados</Text>
                </View>
              )}
            </View>
          )}

          {/* DYNAMIC SECTIONS */}
          <DynamicSections content={home.content} />
        </View>
      )}

      <DetailModal
        visible={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
        item={selectedItem}
        isManager={isManager}
        onEdit={() => {
          setIsDetailVisible(false);
          handleEdit(selectedItem, activeTab === 'noticias' ? 'news' : 'event');
        }}
        onDelete={() => {
          setIsDetailVisible(false);
          handleDelete(selectedItem, activeTab === 'noticias' ? 'news' : 'event');
        }}
      />
    </ScrollViewLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  section: {
    backgroundColor: "#FFFFFF",
  },
  featuredReminder: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
    padding: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featuredLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    position: 'absolute',
    top: -12,
    left: 20,
    zIndex: 10,
    gap: 8,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  featuredLabelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    zIndex: 999,
    borderWidth: 4,
    borderColor: 'white',
  }
});
