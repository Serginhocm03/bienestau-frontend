import { Modal, Pressable, ScrollView, StyleSheet, View, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";

import { Text } from "@/components/bienestar/primitives/Text";
import { Section } from "@/components/bienestar/sections/Section";
import { Colors } from "@/constants/bienestar/colors";
import { BlurView } from "expo-blur";
import {
  AccordionSection as IAccordionSection,
  Section as ISection,
} from "@/types/bienestar/section-components";

export interface AccordionSectionProps extends IAccordionSection {}

export function AccordionSection({
  title,
  collapsibles,
}: AccordionSectionProps) {
  return (
    <View style={styles.mainContainer}>
      {title && (
        <View style={styles.headerRow}>
          <View style={styles.indicatorLine} />
          <Text color="primary" style={styles.sectionTitle}>
            {title.toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.listContainer}>
        {collapsibles.map((item, index) => (
          <Collapsible key={index} {...item} />
        ))}
      </View>
    </View>
  );
}

export interface CollapsibleProps extends ISection {}

export function Collapsible(props: CollapsibleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { title, description } = props;

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed
        ]}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconCircle}>
            <Image
              source={require("@/assets/images/biñetas.png")}
              style={{ width: 20, height: 20, tintColor: 'white' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textBody}>
            <Text style={styles.cardTitle} type="defaultBold" color="primary">
              {title}
            </Text>
            {description && (
              <Text style={styles.cardDescription} numberOfLines={1}>
                {description}
              </Text>
            )}
          </View>

          <View style={styles.arrowContainer}>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.primary} />
          </View>
        </View>
      </Pressable>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalHeader}>
                <View style={styles.modalBadge}>
                    <Text style={styles.badgeText}>PROGRAMA INSTITUCIONAL</Text>
                </View>
                <Text type="subtitle" color="primary" style={styles.modalTitle}>{title}</Text>
              </View>

              <View style={styles.sectionContent}>
                {/* Pasamos todas las props incluyendo descripción e imagen */}
                <Section
                    {...props}
                    title="" // Ocultamos el título dentro del componente para no duplicar con el del Modal
                    paddingVertical={0}
                    paddingHorizontal={0}
                />
              </View>
            </ScrollView>

            <Pressable onPress={() => setIsVisible(false)} style={styles.closeBtn}>
              <BlurView intensity={80} style={styles.blurClose}>
                <Image
                  source={require("@/assets/images/cerrar.png")}
                  style={{ width: 24, height: 24, tintColor: Colors.primary }}
                  resizeMode="contain"
                />
              </BlurView>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  indicatorLine: {
    width: 4,
    height: 24,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    backgroundColor: '#F8FAFC',
    borderColor: Colors.primary,
    opacity: 0.9,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textBody: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  arrowContainer: {
    paddingLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16, // Menos espacio lateral para que el cuadro sea más ancho
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 36,
    height: "85%", // Aumentado para que sea más alto
    width: "100%", // Ocupa todo el ancho permitido por el padding del overlay
    position: 'relative',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 25,
  },
  modalScroll: {
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 32, // Más aire arriba
    paddingBottom: 20,
  },
  modalIndicator: {
    display: 'none',
  },
  modalBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 28, // Título más grande e impactante
    paddingHorizontal: 24,
    textAlign: 'center',
    fontWeight: '900',
    lineHeight: 34,
  },
  sectionContent: {
    paddingHorizontal: 28, // Un poco más de margen para que la letra grande respire
  },
  closeBtn: {
    position: "absolute",
    top: 24,
    right: 24,
    zIndex: 100,
  },
  blurClose: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(241, 245, 249, 0.9)",
  }
});
