import { ActivityIndicator, Pressable, View, StyleSheet, Image } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Link } from "expo-router";

import { Text } from "@/components/bienestar/primitives/Text";
import { DynamicSections } from "@/components/bienestar/sections/DynamicSections";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";
import { ContactSection } from "@/components/bienestar/sections/ContactSection";
import { Colors } from "@/constants/bienestar/colors";
import { useWelfare } from "@/hooks/bienestar/useWelfare";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { ActionLineCard } from "@/components/bienestar/sections/ActionLineCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Welfare() {
  const { welfare, actionLines, isPending, refetch, error } = useWelfare();

  console.log('🖥️ Welfare Screen State:', {
    isPending,
    hasWelfare: !!welfare,
    actionLinesCount: actionLines?.length ?? 0,
    error: error?.message
  });

  return (
    <ScrollViewLayout
      header={isPending || !welfare ? { title: "" } : welfare.header}
      layout={{ height: 110, minHeight: 110 }}
      stickyImage={true}
      onRefresh={refetch}
    >
      {isPending ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View style={styles.container}>
          {/* 1. SECCIÓN VICERRECTORÍA (GRANDE ARRIBA) */}
          <View style={styles.vicerrectoraSection}>
            <View style={styles.headerRow}>
              <View style={styles.line} />
              <Text color="primary" style={styles.sectionTitle}>
                VICERRECTORÍA
              </Text>
            </View>

            <View style={styles.vicerrectoraCard}>
              <View style={styles.vicerrectoraHeader}>
                <View style={styles.vicerrectoraAvatar}>
                  <ExpoImage
                    source={require("@/assets/images/Perfil.png")}
                    style={{ width: 80, height: 80 }}
                    tintColor={Colors.primary}
                    contentFit="contain"
                  />
                </View>
                <View style={styles.vicerrectoraInfo}>
                  <Text type="defaultBold" color="primary" style={styles.vicerrectoraName}>
                    María del Pilar Agreda Guerrero
                  </Text>
                  <Text color="gray" style={styles.vicerrectoraRole}>
                    Vicerrectora para la Evangelización de las Culturas
                  </Text>
                </View>
              </View>

              <View style={styles.vicerrectoraDivider} />

              <View style={styles.vicerrectoraBody}>
                <Text color="primary" style={styles.vicerrectoraQuestion}>
                  ¿Por qué una Vicerrectoría para la Evangelización de las Culturas?
                </Text>
                <Text style={styles.vicerrectoraDescription}>
                  Todas las personas tenemos la capacidad de transformar el mundo a través de la fraternidad y el amor inspirados por los principios Franciscanos y Capuchinos.
                </Text>
              </View>
            </View>
          </View>

          {/* 2. LÍNEAS DE ACCIÓN (CUADRÍCULA 2x2 ABAJO) */}
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <View style={styles.line} />
              <Text color="primary" style={styles.sectionTitle}>
                LÍNEAS DE ACCIÓN
              </Text>
            </View>

            <View style={styles.grid}>
              {actionLines && actionLines.length > 0 ? (
                actionLines.map((item, index) => (
                    <View key={item.documentId || item.id} style={styles.gridItem}>
                    <Link
                        href={{
                        pathname: "/(protected)/bienestar/welfare/action-line",
                        params: {
                            actionLineJson: JSON.stringify(item, null, 2),
                        },
                        }}
                        asChild
                    >
                        <ActionLineCard item={item} />
                    </Link>
                    </View>
                ))
              ) : (
                // Placeholder para cuando no hay datos
                [1,2,3,4].map((i) => (
                    <View key={i} style={[styles.gridItem, { opacity: 0.1 }]}>
                        <View style={[styles.gridItemContent, { height: 100, backgroundColor: '#CCC', borderRadius: 20 }]} />
                    </View>
                ))
              )}
            </View>
          </View>

          {/* 3. SECCIÓN DINÁMICA */}
          {welfare && <DynamicSections content={welfare.content} />}

          {/* 4. PERFIL DEL DIRECTOR / CONTACTO */}
          {welfare?.director && (
            <View style={styles.profileSection}>
               <View style={styles.headerRow}>
                <View style={styles.line} />
                <Text color="primary" style={styles.sectionTitle}>
                  CONTACTO Y UBICACIÓN
                </Text>
              </View>
              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.avatarContainer}>
                    <ExpoImage
                      source={require("@/assets/images/Perfil.png")}
                      style={{ width: 80, height: 80 }}
                      tintColor={Colors.primary}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text type="defaultBold" color="primary" style={styles.directorName}>
                      {welfare.director.name}
                    </Text>
                    <Text color="gray" style={styles.directorRole}>
                      {welfare.director.role}
                    </Text>
                    <View style={[styles.badge, { backgroundColor: Colors.primary }]}>
                      <Text style={styles.badgeText}>DIRECTOR(A)</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <ContactSection
                  style={styles.contactInfo}
                  {...welfare.contact}
                />
              </View>
            </View>
          )}

          {/* 5. CONTACTO ESPECÍFICO VICERRECTORÍA */}
          <View style={styles.vicerrectoriaContactSection}>
             <View style={styles.headerRow}>
                <View style={styles.line} />
                <Text color="primary" style={styles.sectionTitle}>
                  ¿DESEAS CONTACTARNOS?
                </Text>
              </View>

              <View style={styles.contactCard}>
                <View style={styles.contactItem}>
                    <View style={styles.contactIconCircle}>
                        <Image
                          source={require("@/assets/images/Maps.png")}
                          style={{ width: 20, height: 20, tintColor: Colors.primary }}
                          resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.contactText}>Campus Centro, Hall del Edificio San Francisco</Text>
                </View>

                <View style={styles.contactItem}>
                    <View style={styles.contactIconCircle}>
                        <Image
                          source={require("@/assets/images/Telefono.png")}
                          style={{ width: 20, height: 20, tintColor: Colors.primary }}
                          resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.contactText}>(602) 7244434 Ext. 1231 - 1318</Text>
                </View>

                <View style={styles.contactItem}>
                    <View style={styles.contactIconCircle}>
                        <Image
                          source={require("@/assets/images/biñetas.png")}
                          style={{ width: 20, height: 20, tintColor: Colors.primary }}
                          resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.contactText, { color: Colors.secondary, fontWeight: '700' }]}>
                        vicebien@unicesmag.edu.co
                    </Text>
                </View>
              </View>
          </View>
        </View>
      )}
    </ScrollViewLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  container: {
    paddingBottom: 40,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  section: {
    marginTop: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  line: {
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: 8,
  },
  gridItemContent: {
    width: '100%',
  },
  vicerrectoraSection: {
    marginTop: 24,
  },
  vicerrectoraCard: {
    backgroundColor: "transparent",
    marginHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  vicerrectoraHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  vicerrectoraAvatar: {
    marginRight: 16,
  },
  vicerrectoraInfo: {
    flex: 1,
    gap: 4,
  },
  vicerrectoraName: {
    fontSize: 18,
    lineHeight: 22,
  },
  vicerrectoraRole: {
    fontSize: 13,
    marginBottom: 6,
  },
  vicerrectoraDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
    opacity: 0.6,
  },
  vicerrectoraBody: {
    paddingTop: 4,
  },
  vicerrectoraQuestion: {
    fontSize: 22, // Mucho más grande y llamativo
    fontWeight: '900',
    marginBottom: 14,
    lineHeight: 28,
    color: Colors.primary,
  },
  vicerrectoraDescription: {
    fontSize: 18, // Aumentado para máxima legibilidad
    lineHeight: 30,
    color: '#334155', // Gris un poco más oscuro y profesional
    textAlign: 'justify',
  },
  profileSection: {
    paddingHorizontal: 16,
    marginTop: 32,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  directorName: {
    fontSize: 18,
    marginBottom: 4,
  },
  directorRole: {
    fontSize: 14,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 8,
  },
  contactInfo: {
    marginTop: 8,
  },
  vicerrectoriaContactSection: {
    marginTop: 32,
    paddingBottom: 60, // Espacio extra al final para el botón central
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  }
});
