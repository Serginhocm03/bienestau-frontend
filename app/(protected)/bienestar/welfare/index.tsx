import { ActivityIndicator, Image, Pressable, View, StyleSheet } from "react-native";
//import { Image } from "react-native-svg";
import { Link } from "expo-router";

import { Text } from "@/components/bienestar/primitives/Text";
import { DynamicSections } from "@/components/bienestar/sections/DynamicSections";
import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";
import { ContactSection } from "@/components/bienestar/sections/ContactSection";
import { Colors } from "@/constants/bienestar/colors";
import { useWelfare } from "@/hooks/bienestar/useWelfare";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { ActionLineCard } from "@/components/bienestar/sections/ActionLineCard";
import { Ionicons } from "@expo/vector-icons";

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
          {welfare ? (
            <DynamicSections content={welfare.content} />
          ) : (
            <View style={styles.errorContainer}>
              <Text>La información general de bienestar no está disponible (revisa Strapi).</Text>
            </View>
          )}

          {/* Líneas de Acción en Cuadrícula Simétrica */}
          <View style={styles.section}>
            <Text color="primary" type="subtitle" style={styles.sectionTitle}>
              Líneas de Acción
            </Text>
            <View style={styles.grid}>
              {(actionLines ?? []).map((item, index) => {
                const isLast = index === actionLines!.length - 1;
                const isOdd = actionLines!.length % 2 !== 0;

                return (
                  <View
                    key={index}
                    style={[
                      styles.gridItem,
                      isLast && isOdd ? { width: "100%", alignItems: "center" } : {}
                    ]}
                  >
                    <Link
                      href={{
                        pathname: "/(protected)/bienestar/welfare/action-line",
                        params: {
                          actionLineJson: JSON.stringify(item, null, 2),
                        },
                      }}
                      asChild
                    >
                      <ActionLineCard
                        item={item}
                        style={isLast && isOdd ? { width: '48%', marginBottom: 30 } : {}}
                      />
                    </Link>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Sección de Perfil del Director Premium */}
          {welfare?.director && (
            <View style={styles.profileSection}>
               <Text color="primary" type="subtitle" style={styles.sectionTitle}>
                Contacto y Ubicación
              </Text>
              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={90} color={Colors.primary} />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text type="defaultBold" color="primary" style={styles.directorName}>
                      {welfare.director.name}
                    </Text>
                    <Text color="gray" style={styles.directorRole}>
                      {welfare.director.role}
                    </Text>
                    <View style={styles.badge}>
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
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 20,
    fontSize: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
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
  }
});
