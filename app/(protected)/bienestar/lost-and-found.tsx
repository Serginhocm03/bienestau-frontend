import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";

type ItemCategory = "Todos" | "Carnets / IDs" | "Personales" | "Tecnología";

interface LostItem {
  id: string;
  title: string;
  category: ItemCategory;
  location: string;
  date: string;
  status: "Resguardado" | "Buscando Propietario";
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const SAMPLE_ITEMS: LostItem[] = [
  {
    id: "1",
    title: "Carnet Estudiantil Institucional",
    category: "Carnets / IDs",
    location: "Cafetería Central - Campus Centro",
    date: "Ayer, 04:30 PM",
    status: "Resguardado",
    icon: "card-account-details-outline",
  },
  {
    id: "2",
    title: "Juego de Llaves con Llavero Capuchino",
    category: "Personales",
    location: "Hall del Edificio San Francisco",
    date: "Hoy, 10:15 AM",
    status: "Buscando Propietario",
    icon: "key-outline",
  },
  {
    id: "3",
    title: "Chaqueta Institucional Azul L",
    category: "Personales",
    location: "Cancha Multideportiva",
    date: "Hace 2 días",
    status: "Resguardado",
    icon: "tshirt-crew-outline",
  },
  {
    id: "4",
    title: "Audífonos Bluetooth Negros",
    category: "Tecnología",
    location: "Biblioteca Central",
    date: "Hoy, 08:00 AM",
    status: "Resguardado",
    icon: "headphones",
  },
];

export default function LostAndFound() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: ItemCategory[] = ["Todos", "Carnets / IDs", "Personales", "Tecnología"];

  const filteredItems = SAMPLE_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleClaim = (item: LostItem) => {
    Alert.alert(
      `Reclamar: ${item.title}`,
      `Este objeto se encuentra resguardado en la oficina de Bienestar Institucional (Hall del Edificio San Francisco).\n\nPreséntate con tu documento de identidad para verificar tu propiedad.`,
      [{ text: "Entendido", style: "default" }]
    );
  };

  const handleReport = () => {
    Alert.alert(
      "Reportar Objeto Perdió / Encontrado",
      "Para reportar o entregar un objeto hallado en el campus, acércate a la oficina de Bienestar Institucional o envía un correo a vicebien@unicesmag.edu.co con la descripción y foto.",
      [{ text: "Cerrar", style: "cancel" }]
    );
  };

  return (
    <ScrollViewLayout
      header={{ title: "OBJETOS PERDIDOS" }}
      layout={{ height: 100, minHeight: 100 }}
      stickyImage={false}
    >
      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(40, insets.bottom + 20) },
        ]}
      >
        {/* BANNER INFORMATIVO */}
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={24}
            color={Colors.primary}
          />
          <View style={styles.infoBannerTextContainer}>
            <Text type="defaultBold" color="primary" style={{ fontSize: 14 }}>
              Punto de Recepción y Reclamación
            </Text>
            <Text color="gray" style={{ fontSize: 12, lineHeight: 17 }}>
              Hall del Edificio San Francisco (Campus Centro). Muestra tu
              documento para reclamar objetos perdidos.
            </Text>
          </View>
        </View>

        {/* BUSCADOR */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color="#64748B" />
          <TextInput
            placeholder="Buscar por nombre u objeto..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          ) : null}
        </View>

        {/* FILTROS POR CATEGORÍA */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* LISTADO DE OBJETOS */}
        <View style={styles.listSection}>
          <Text type="defaultBold" color="primary" style={styles.listTitle}>
            OBJETOS REGISTRADOS EN EL CAMPUS ({filteredItems.length})
          </Text>

          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleClaim(item)}
                style={styles.itemCard}
              >
                <View style={styles.itemIconCircle}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.itemContent}>
                  <Text type="defaultBold" color="primary" style={styles.itemTitle}>
                    {item.title}
                  </Text>

                  <View style={styles.itemRow}>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={13}
                      color="#64748B"
                    />
                    <Text style={styles.itemDetailText}>{item.location}</Text>
                  </View>

                  <View style={styles.itemRow}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={13}
                      color="#64748B"
                    />
                    <Text style={styles.itemDetailText}>{item.date}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === "Resguardado"
                      ? styles.statusBadgeGreen
                      : styles.statusBadgeOrange,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      item.status === "Resguardado"
                        ? styles.statusTextGreen
                        : styles.statusTextOrange,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons
                name="archive-search-outline"
                size={48}
                color="#CBD5E1"
              />
              <Text color="gray" style={{ marginTop: 10, textAlign: "center" }}>
                No se encontraron objetos registrados en esta categoría.
              </Text>
            </View>
          )}
        </View>

        {/* BOTÓN REPORTAR */}
        <Pressable onPress={handleReport} style={styles.reportBtn}>
          <MaterialCommunityIcons name="plus-circle-outline" size={20} color="white" />
          <Text style={styles.reportBtnText}>REPORTAR O ENTREGAR UN OBJETO</Text>
        </Pressable>
      </View>
    </ScrollViewLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 12,
    marginBottom: 16,
  },
  infoBannerTextContainer: {
    flex: 1,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 8,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  listSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  itemDetailText: {
    fontSize: 11,
    color: "#64748B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeGreen: {
    backgroundColor: "#F0FDF4",
  },
  statusBadgeOrange: {
    backgroundColor: "#FFF7ED",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  statusTextGreen: {
    color: "#16A34A",
  },
  statusTextOrange: {
    color: "#EA580C",
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  reportBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
