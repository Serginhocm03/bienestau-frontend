import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";

export interface Product {
  id: string;
  title: string;
  category: "Indumentaria" | "Eventos" | "Accesorios" | "Papelería";
  price: number;
  originalPrice: number;
  discount: string;
  rating: string;
  salesCount: number;
  badge?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const INSTITUTIONAL_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Buzo Hoodie Capuchino Unicesmag",
    category: "Indumentaria",
    price: 61750,
    originalPrice: 95000,
    discount: "-35%",
    rating: "4.9",
    salesCount: 240,
    badge: "🔥 MÁS VENDIDO",
    icon: "tshirt-crew-outline",
  },
  {
    id: "2",
    title: "Termo Metálico Ecológico 750ml",
    category: "Accesorios",
    price: 28500,
    originalPrice: 38000,
    discount: "-25%",
    rating: "4.8",
    salesCount: 115,
    badge: "⚡ RELÁMPAGO",
    icon: "bottle-soda-outline",
  },
  {
    id: "3",
    title: "Boleta Conferencia Liderazgo 2026",
    category: "Eventos",
    price: 15000,
    originalPrice: 30000,
    discount: "-50%",
    rating: "4.9",
    salesCount: 310,
    badge: "🎟️ EVENTO",
    icon: "ticket-confirmation-outline",
  },
  {
    id: "4",
    title: "Gorra Institucional Bordada Premium",
    category: "Indumentaria",
    price: 21000,
    originalPrice: 35000,
    discount: "-40%",
    rating: "5.0",
    salesCount: 89,
    badge: "🌟 RECOMENDADO",
    icon: "hat-fedora",
  },
  {
    id: "5",
    title: "Cuaderno Pasta Dura Capuchino",
    category: "Papelería",
    price: 14400,
    originalPrice: 18000,
    discount: "-20%",
    rating: "4.7",
    salesCount: 74,
    icon: "notebook-outline",
  },
  {
    id: "6",
    title: "Mochila Ergonómica Unicesmag Pro",
    category: "Accesorios",
    price: 84000,
    originalPrice: 120000,
    discount: "-30%",
    rating: "4.9",
    salesCount: 152,
    badge: "🎒 EDICIÓN LIMITADA",
    icon: "bag-personal-outline",
  },
];

type CategoryFilter = "Todo" | "Indumentaria" | "Eventos" | "Accesorios" | "Papelería";

export default function CartCatalog() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("Todo");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [productId: string]: number }>({
    "1": 1,
    "2": 1,
  });
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);

  const categories: CategoryFilter[] = [
    "Todo",
    "Indumentaria",
    "Eventos",
    "Accesorios",
    "Papelería",
  ];

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      const updated = { ...prev };
      if (next > 0) {
        updated[productId] = next;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const totalCartPrice = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const prod = INSTITUTIONAL_PRODUCTS.find((p) => p.id === pId);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  const filteredProducts = INSTITUTIONAL_PRODUCTS.filter((prod) => {
    const matchesCategory =
      selectedCategory === "Todo" || prod.category === selectedCategory;
    const matchesSearch = prod.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCheckout = () => {
    Alert.alert(
      "🛒 Catálogo Institucional BienestAU",
      `¡Simulación de compra completada!\n\nArtículos: ${totalCartItems}\nTotal: $${totalCartPrice.toLocaleString("es-CO")}\n\nPróximamente podrás realizar tus compras institucionales y reclamarlas directamente en el campus.`,
      [{ text: "Entendido", style: "default" }]
    );
  };

  return (
    <ScrollViewLayout
      header={{ title: "TIENDA BIENESTAU" }}
      layout={{ height: 100, minHeight: 100 }}
      stickyImage={false}
    >
      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(80, insets.bottom + 70) },
        ]}
      >
        {/* 1. HERO BANNER CON COLORES INSTITUCIONALES (AZUL Y ROJO CESMAG) */}
        <LinearGradient
          colors={[Colors.primary, Colors.primary_dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroHeaderRow}>
            <View style={styles.flashBadge}>
              <MaterialCommunityIcons name="lightning-bolt" size={16} color={Colors.secondary} />
              <Text style={styles.flashBadgeText}>OFERTAS BIENESTAU</Text>
            </View>
            <Text style={styles.timerText}>⏱️ 04:32:15</Text>
          </View>

          <Text style={styles.heroTitle}>🔥 CATÁLOGO INSTITUCIONAL</Text>
          <Text style={styles.heroSubtitle}>
            Indumentaria oficial, accesorios y tiquetes a eventos con descuentos exclusivos
          </Text>

          <View style={styles.perksRow}>
            <View style={styles.perkChip}>
              <Text style={styles.perkText}>🚚 Retiro Gratis Campus</Text>
            </View>
            <View style={styles.perkChip}>
              <Text style={styles.perkText}>💯 100% Oficial Unicesmag</Text>
            </View>
            <View style={styles.perkChip}>
              <Text style={styles.perkText}>🛡️ Garantía Institucional</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 2. BUSCADOR INSTITUCIONAL */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={22} color={Colors.primary} />
          <TextInput
            placeholder="Buscar buzos, termos, gorras, tiquetes..."
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

        {/* 3. FILTROS CHIPS CON COLORES INSTITUCIONALES */}
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

        {/* 4. Malla 2-Columnas de Productos Institucionales */}
        <View style={styles.productGrid}>
          {filteredProducts.map((prod) => {
            const inCartQty = cart[prod.id] || 0;

            return (
              <View key={prod.id} style={styles.productCard}>
                {/* Imagen & Badge */}
                <View style={styles.productImageContainer}>
                  <View style={styles.productIconCircle}>
                    <MaterialCommunityIcons
                      name={prod.icon}
                      size={44}
                      color={Colors.primary}
                    />
                  </View>

                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{prod.discount}</Text>
                  </View>

                  {prod.badge && (
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>{prod.badge}</Text>
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.productContent}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {prod.title}
                  </Text>

                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>⭐ {prod.rating}</Text>
                    <Text style={styles.salesText}>({prod.salesCount} vtas)</Text>
                  </View>

                  {/* Precios */}
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>
                      ${prod.price.toLocaleString("es-CO")}
                    </Text>
                    <Text style={styles.originalPriceText}>
                      ${prod.originalPrice.toLocaleString("es-CO")}
                    </Text>
                  </View>

                  <View style={styles.freeShippingRow}>
                    <Text style={styles.freeShippingText}>🚚 Retiro Gratis Campus</Text>
                  </View>

                  {/* Botón Agregar */}
                  <Pressable
                    onPress={() => addToCart(prod.id)}
                    style={styles.addCartBtn}
                  >
                    <MaterialCommunityIcons
                      name="cart-plus"
                      size={18}
                      color="white"
                    />
                    <Text style={styles.addCartBtnText}>
                      {inCartQty > 0 ? `AGREGAR (${inCartQty})` : "AGREGAR"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 5. BARRA FLOTANTE INFERIOR CON COLORES INSTITUCIONALES */}
      {totalCartItems > 0 && (
        <View style={[styles.floatingCartBar, { bottom: Math.max(10, insets.bottom + 5) }]}>
          <View style={styles.floatingCartLeft}>
            <View style={styles.floatingCartIconBox}>
              <MaterialCommunityIcons name="cart" size={24} color={Colors.primary} />
              <View style={styles.floatingBadge}>
                <Text style={styles.floatingBadgeText}>{totalCartItems}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.floatingTotalLabel}>Total a Pagar:</Text>
              <Text style={styles.floatingTotalPrice}>
                ${totalCartPrice.toLocaleString("es-CO")}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setIsCartModalVisible(true)}
            style={styles.floatingCheckoutBtn}
          >
            <Text style={styles.floatingCheckoutBtnText}>
              VER CARRITO ({totalCartItems})
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
          </Pressable>
        </View>
      )}

      {/* MODAL DE RESUMEN DEL CARRITO */}
      <Modal
        visible={isCartModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCartModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <MaterialCommunityIcons name="cart" size={22} color={Colors.primary} />
                <Text type="defaultBold" style={{ fontSize: 18, color: Colors.primary }}>
                  Tu Carrito BienestAU ({totalCartItems})
                </Text>
              </View>
              <Pressable onPress={() => setIsCartModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={true}>
              {Object.entries(cart).map(([pId, qty]) => {
                const prod = INSTITUTIONAL_PRODUCTS.find((p) => p.id === pId);
                if (!prod) return null;

                return (
                  <View key={pId} style={styles.modalItemRow}>
                    <View style={styles.modalItemIconCircle}>
                      <MaterialCommunityIcons
                        name={prod.icon}
                        size={22}
                        color={Colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "800", fontSize: 13, color: Colors.primary }}>
                        {prod.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: Colors.secondary, fontWeight: "800" }}>
                        ${(prod.price * qty).toLocaleString("es-CO")}
                      </Text>
                    </View>

                    <View style={styles.qtyControlsModal}>
                      <Pressable
                        onPress={() => updateQuantity(pId, -1)}
                        style={styles.modalQtyBtn}
                      >
                        <MaterialCommunityIcons name="minus" size={14} color="#64748B" />
                      </Pressable>
                      <Text style={{ fontWeight: "800", fontSize: 13 }}>{qty}</Text>
                      <Pressable
                        onPress={() => updateQuantity(pId, 1)}
                        style={styles.modalQtyBtn}
                      >
                        <MaterialCommunityIcons name="plus" size={14} color="#64748B" />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.modalSummaryFooter}>
              <View style={styles.modalTotalRow}>
                <Text style={{ fontSize: 14, color: "#64748B" }}>Total Estimado:</Text>
                <Text style={{ fontSize: 20, fontWeight: "900", color: Colors.secondary }}>
                  ${totalCartPrice.toLocaleString("es-CO")}
                </Text>
              </View>

              <Pressable onPress={handleCheckout} style={styles.modalCheckoutBtn}>
                <Text style={styles.modalCheckoutBtnText}>
                  FINALIZAR COMPRA
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollViewLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
  },
  heroBanner: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  heroHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  flashBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  flashBadgeText: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: "900",
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  perksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  perkChip: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  perkText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: 14,
    gap: 8,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 6,
    marginBottom: 14,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  productCard: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 14,
  },
  productImageContainer: {
    height: 130,
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  productIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  tagBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  productContent: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#F1F5F9",
    gap: 4,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primary,
    lineHeight: 17,
    height: 34,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#D97706",
  },
  salesText: {
    fontSize: 10,
    color: "#94A3B8",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 2,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "900",
    color: Colors.secondary,
  },
  originalPriceText: {
    fontSize: 11,
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  freeShippingRow: {
    marginTop: 2,
  },
  freeShippingText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16A34A",
  },
  addCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    marginTop: 6,
  },
  addCartBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  floatingCartBar: {
    position: "absolute",
    left: 14,
    right: 14,
    backgroundColor: Colors.primary_dark,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  floatingCartLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  floatingCartIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  floatingBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.secondary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  floatingTotalLabel: {
    color: "#94A3B8",
    fontSize: 11,
  },
  floatingTotalPrice: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  floatingCheckoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  floatingCheckoutBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  modalItemIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyControlsModal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    padding: 4,
    borderRadius: 8,
  },
  modalQtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalSummaryFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 12,
  },
  modalTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalCheckoutBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  modalCheckoutBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
