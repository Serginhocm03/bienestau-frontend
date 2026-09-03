import { Link } from "expo-router";

import { Colors } from "@/constants/bienestar/colors";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";
import { ActivityIndicator, Pressable, View, StyleSheet } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { setAuth, user } = useAuth();
  const { home, reminder, events, news, isPending, refetch } = useHome();
  
  const [activeTab, setActiveTab] = useState<TabType>("noticias");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  // Verificar si el usuario es docente/administrador
  const isManager = user?.type === "manager";

  const handlePress = (item: any) => {
    setSelectedItem(item);
    setIsDetailVisible(true);
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
  const feedNews = news && news.length > 1 ? news.slice(1) : [];

  return (
    <ScrollViewLayout
      layout={{ height: 0, minHeight: 0 }}
      header={{ title: "" }}
      onRefresh={refetch}
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
                {feedNews.map((item, index) => (
                  <NewsFeedItem
                    key={index}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    tag={index === 0 ? "ÚLTIMA HORA" : undefined}
                    onPress={() => handlePress(item)}
                    isLast={index === feedNews.length - 1}
                  />
                ))}
              </View>
            </>
          ) : (
            <View style={styles.section}>
              <SectionHeader title="EVENTOS" />
              {events && events.map((item, index) => (
                <EventCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  tag={index === 0 ? "HOY" : undefined}
                  onPress={() => handlePress(item)}
                />
              ))}
            </View>
          )}

          {/* DYNAMIC SECTIONS */}
          <DynamicSections content={home.content} />

          {/* REMINDER */}
          {filteredReminder && (
            <View style={{ padding: 20 }}>
              <SectionHeader title="RECORDATORIOS" />
              <Link asChild href="/(protected)/bienestar/reminders">
                <Pressable>
                  <Reminder {...filteredReminder} />
                </Pressable>
              </Link>
            </View>
          )}
        </View>
      )}

      <DetailModal
        visible={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
        item={selectedItem}
      />

      {/* Botón flotante para Docentes/Gestores */}
      {isManager && (
        <Pressable
          style={styles.fab}
          onPress={() => {
            // Aquí irá la navegación a la pantalla de creación
            alert("Función para subir Noticias/Eventos (Próximamente)");
          }}
        >
          <Ionicons name="add" size={32} color="white" />
        </Pressable>
      )}
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
  fab: {
    position: 'absolute',
    bottom: 100, // Por encima de la barra de pestañas
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});
