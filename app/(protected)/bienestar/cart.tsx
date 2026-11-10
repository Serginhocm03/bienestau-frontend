import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/bienestar/primitives/Text";
import { Colors } from "@/constants/bienestar/colors";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";

interface CartItem {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const INITIAL_CART: CartItem[] = [
  {
    id: "1",
    title: "Chaqueta Institucional Unicesmag",
    category: "Indumentaria",
    price: 85000,
    quantity: 1,
    icon: "tshirt-crew-outline",
  },
  {
    id: "2",
    title: "Termo Ecológico Capuchino 750ml",
    category: "Accesorios",
    price: 28000,
    quantity: 1,
    icon: "bottle-soda-outline",
  },
  {
    id: "3",
    title: "Entrada Conferencia Liderazgo",
    category: "Eventos",
    price: 15000,
    quantity: 2,
    icon: "ticket-confirmation-outline",
  },
];

export default function Cart() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    Alert.alert(
      "🛒 Módulo en Desarrollo",
      `El carrito de compras de Bienestar Institucional estará disponible muy pronto para procesar pagos de servicios y artículos universitarios.\n\nTotal estimado: $${totalPrice.toLocaleString("es-CO")}`,
      [{ text: "Entendido", style: "default" }]
    );
  };

  return (
    <ScrollViewLayout
      header={{ title: "CARRITO DE COMPRAS" }}
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
            name="store-outline"
            size={24}
            color={Colors.primary}
          />
          <View style={styles.infoBannerTextContainer}>
            <Text type="defaultBold" color="primary" style={{ fontSize: 14 }}>
              Tienda y Servicios BienestAU
            </Text>
            <Text color="gray" style={{ fontSize: 12, lineHeight: 17 }}>
              Módulo de prueba visual. Adquiere indumentaria, tiquetes a eventos
              y artículos institucionales.
            </Text>
          </View>
        </View>

        {/* LISTA DE ÍTEMS EN EL CARRITO */}
        <View style={styles.section}>
          <Text type="defaultBold" color="primary" style={styles.sectionTitle}>
            ARTÍCULOS EN EL CARRITO ({items.length})
          </Text>

          {items.length > 0 ? (
            items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemIconCircle}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.itemContent}>
                  <Text
                    type="defaultBold"
                    color="primary"
                    style={styles.itemTitle}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemPrice}>
                    ${(item.price * item.quantity).toLocaleString("es-CO")}
                  </Text>
                </View>

                {/* CONTROLES DE CANTIDAD */}
                <View style={styles.quantityControls}>
                  <Pressable
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.qtyBtn}
                  >
                    <MaterialCommunityIcons name="minus" size={16} color="#64748B" />
                  </Pressable>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.qtyBtn}
                  >
                    <MaterialCommunityIcons name="plus" size={16} color="#64748B" />
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons
                name="cart-remove"
                size={48}
                color="#CBD5E1"
              />
              <Text color="gray" style={{ marginTop: 10, textAlign: "center" }}>
                Tu carrito está vacío por ahora.
              </Text>
            </View>
          )}
        </View>

        {/* RESUMEN Y BOTÓN DE PAGO */}
        {items.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text color="gray" style={{ fontSize: 14 }}>
                Subtotal
              </Text>
              <Text color="primary" style={{ fontSize: 14, fontWeight: "700" }}>
                ${totalPrice.toLocaleString("es-CO")}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text color="gray" style={{ fontSize: 14 }}>
                Envío / Retiro en Campus
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#16A34A" }}>
                GRATIS
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text
                type="defaultBold"
                color="primary"
                style={{ fontSize: 16 }}
              >
                TOTAL ESTIMADO
              </Text>
              <Text
                type="defaultBold"
                style={{ fontSize: 18, color: Colors.secondary }}
              >
                ${totalPrice.toLocaleString("es-CO")}
              </Text>
            </View>

            <Pressable onPress={handleCheckout} style={styles.checkoutBtn}>
              <MaterialCommunityIcons name="credit-card-outline" size={20} color="white" />
              <Text style={styles.checkoutBtnText}>FINALIZAR COMPRA (PRÓXIMAMENTE)</Text>
            </Pressable>
          </View>
        )}
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
  section: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
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
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.secondary,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 4,
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  qtyText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    minWidth: 16,
    textAlign: "center",
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  checkoutBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
