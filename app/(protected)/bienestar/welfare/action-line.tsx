import { View, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScrollViewLayout } from "@/components/bienestar/layout/ScrollViewLayout";
import { Text } from "@/components/bienestar/primitives/Text";
import { Section } from "@/components/bienestar/sections/Section";
import { Collapsible } from "@/components/bienestar/sections/AccordionSection";
import { ContactSection } from "@/components/bienestar/sections/ContactSection";
import { DynamicSections } from "@/components/bienestar/sections/DynamicSections";
import { ActionLine as IActionLine } from "@/types/bienestar/collections";
import { buildMediaUrl } from "@/lib/bienestar/api";

export default function ActionLine() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    actionLineJson: string;
  }>();

  const actionLine: IActionLine = params.actionLineJson
    ? JSON.parse(params.actionLineJson)
    : ({} as IActionLine);

  const programs = actionLine?.programs ?? [];

  return (
    <ScrollViewLayout
      header={{ title: actionLine?.header?.title ?? "Cargando..." }}
      layout={{ height: 110, minHeight: 110 }}
      stickyImage={true}
      onBack={() => router.back()}
    >
      <View style={{ paddingTop: 0 }}>
        {/* Ficha técnica estilo Wikipedia perfeccionada */}
        <View style={{
          padding: 16,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9'
        }}>
          {/* Título integrado en el cuerpo blanco */}
          <Text color="primary" type="subtitle" style={{ marginBottom: 12, fontSize: 24 }}>
            {actionLine?.header?.title}
          </Text>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text color="black" style={{ fontSize: 16, lineHeight: 22, fontWeight: '400' }}>
                Bienvenido a esta sección. Aquí podrás conocer todos los servicios, objetivos y el impacto que tenemos en la comunidad universitaria para tu desarrollo integral.
              </Text>
            </View>

            {actionLine?.header?.image && (
              <View style={{
                width: 130,
                padding: 4,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#CCCCCC',
                backgroundColor: '#F8F9FA',
                alignSelf: 'flex-start'
              }}>
                <Image
                  source={{ uri: buildMediaUrl(actionLine.header.image.url) }}
                  style={{ width: '100%', height: 140, borderRadius: 2 }}
                  resizeMode="cover"
                />
                <Text style={{ fontSize: 9, marginTop: 4, color: '#666', textAlign: 'center', fontWeight: 'bold' }}>
                  Ficha informativa
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={{ marginTop: 50 }}>
        {actionLine?.content ? (
          <DynamicSections content={actionLine.content} />
        ) : (
          <View style={{ padding: 20 }}>
            <Text>No se pudo cargar el contenido de la línea de acción.</Text>
          </View>
        )}
      </View>

      {programs.length > 0 && (
        <View style={{ gap: 12, marginTop: 8, paddingBottom: 20 }}>
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

      <ContactSection
        style={{ margin: 16, marginTop: 8 }}
        BeforeComponent={() => (
          <View>
            {(actionLine.directors ?? []).map((director, index) => (
              <View key={index}>
                <Text>{director.name}</Text>
                <Text color="primary" style={{ fontSize: 12 }}>
                  {director.role}
                </Text>
              </View>
            ))}
          </View>
        )}
        {...actionLine.contact}
      />
    </ScrollViewLayout>
  );
}
