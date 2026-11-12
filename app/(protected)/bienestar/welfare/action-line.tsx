import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";
import { Text } from "@/components/bienestar/primitives/Text";
import { Section } from "@/components/bienestar/sections/Section";
import { Collapsible } from "@/components/bienestar/sections/AccordionSection";
import { ContactSection } from "@/components/bienestar/sections/ContactSection";
import { DynamicSections } from "@/components/bienestar/sections/DynamicSections";
import { ActionLine as IActionLine } from "@/types/bienestar/collections";
import { buildMediaUrl } from "@/lib/bienestar/api";
import { Colors } from "@/constants/bienestar/colors";

export default function ActionLine() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    actionLineJson: string;
  }>();

  let actionLine: IActionLine | null = null;
  try {
    actionLine = params.actionLineJson ? JSON.parse(params.actionLineJson) : null;
  } catch (e) {
    console.error("Error parsing actionLineJson", e);
  }

  if (!actionLine) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error al cargar la línea de acción</Text>
      </View>
    );
  }

  const programs = actionLine?.programs ?? [];

  return (
    <ScrollViewLayout
      header={{ title: actionLine?.header?.title ?? "Cargando..." }}
      layout={{ height: 110, minHeight: 110 }}
      stickyImage={true}
      onBack={() => router.back()}
    >
      <View style={{ paddingTop: 0 }}>
        <View style={{
          padding: 20,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9'
        }}>
          <Text color="primary" type="subtitle" style={{ marginBottom: 10, fontSize: 24, fontWeight: '800' }}>
            {actionLine?.header?.title}
          </Text>

          <Text color="black" style={{ fontSize: 15, lineHeight: 22, color: '#334155' }}>
            Bienvenido a esta sección. Aquí podrás conocer todos los servicios, objetivos y el impacto que tenemos en la comunidad universitaria para tu desarrollo integral.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        {actionLine?.content ? (
          <DynamicSections content={actionLine.content} />
        ) : (
          <View style={{ padding: 20 }}>
            <Text>No se pudo cargar el contenido de la línea de acción.</Text>
          </View>
        )}
      </View>

      {programs.length > 0 && (
        <View style={{ gap: 12, marginTop: 16, paddingBottom: 20 }}>
          <Text
            color="primary"
            type="subtitle"
            style={{ marginHorizontal: 16, marginBottom: 4 }}
          >
            Programas
          </Text>
          <View style={{ gap: 8 }}>
            {programs.map((item, index) => {
              if (index === 0) {
                return (
                  <View key={index} style={{
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    borderRadius: 12,
                    marginHorizontal: 16,
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden'
                  }}>
                    <Section
                      {...item.section}
                      design="left"
                      paddingVertical={12}
                    />
                  </View>
                );
              }
              return (
                <Collapsible
                  key={index}
                  {...item.section}
                  design="left"
                />
              );
            })}
          </View>
        </View>
      )}

      {/* INFORMACIÓN GENERAL Y FICHA INFORMATIVA EN LA PARTE INFERIOR */}
      <View style={{
        margin: 16,
        marginTop: 16,
        marginBottom: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
      }}>
        <Text color="primary" type="subtitle" style={{ fontSize: 18, marginBottom: 16, fontWeight: '800' }}>
          Información General
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
          <View style={{ flex: 1, gap: 12 }}>
            {(actionLine?.directors ?? []).map((director, index) => (
              <View key={index} style={{ marginBottom: 4 }}>
                <Text type="defaultBold" style={{ fontSize: 16, color: '#0F172A' }}>{director.name}</Text>
                <Text color="primary" style={{ fontSize: 13, marginTop: 2, fontWeight: '600' }}>
                  {director.role}
                </Text>
              </View>
            ))}

            {actionLine?.contact && (
              <ContactSection
                style={{ marginTop: 4, padding: 0, borderWidth: 0 }}
                {...actionLine.contact}
              />
            )}
          </View>

          {actionLine?.header?.image && (
            <View style={{
              width: 125,
              padding: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              backgroundColor: '#F8FAFC',
              alignItems: 'center',
            }}>
              <Image
                source={{ uri: buildMediaUrl(actionLine.header.image.url) }}
                style={{ width: '100%', height: 135, borderRadius: 8 }}
                contentFit="cover"
                transition={200}
              />
              <Text style={{ fontSize: 10, marginTop: 6, color: '#64748B', textAlign: 'center', fontWeight: 'bold' }}>
                Ficha informativa
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollViewLayout>
  );
}
