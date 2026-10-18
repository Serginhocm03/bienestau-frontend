import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { buildUrl } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (!Device.isDevice) {
    console.log('⚠️ No es un dispositivo físico');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Alertas BienestAU',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#004A8B',
      showBadge: true,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('⚠️ Permisos denegados');
    return null;
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    
    if (!projectId) {
      console.error('❌ No se encontró projectId en la configuración');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    
    token = tokenData.data;
    console.log('🔔 Token obtenido:', token);
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    return null;
  }

  return token;
}

export async function registerTokenWithBackend(token: string): Promise<void> {
  try {
    const url = buildUrl('notification-tokens', false);

    console.log('🔄 Registrando/Actualizando token en el servidor...');

    // Ahora el backend maneja toda la lógica de "Upsert" (crear o actualizar)
    // Simplemente enviamos el token y la plataforma.
    await axios.post(url, {
      data: {
        token,
        platform: Platform.OS,
        active: true
      },
    });

    console.log('✅ Dispositivo registrado correctamente como ACTIVO');
  } catch (error) {
    console.error('❌ Error enviando token al backend:', error);
  }
}

/**
 * Programa un recordatorio local para un evento 12 horas antes de su inicio.
 */
export async function scheduleEventReminder12HoursBefore(event: {
  id: number | string;
  documentId?: string;
  title: string;
  fecha_evento?: string;
  date?: string;
}): Promise<boolean> {
  try {
    const rawDate = event.fecha_evento || event.date;
    if (!rawDate) {
      console.log('⚠️ Evento sin fecha para programar recordatorio:', event.title);
      return false;
    }

    // Convertir fecha de evento a objeto Date
    let eventDate: Date;
    if (rawDate.includes('T')) {
      eventDate = new Date(rawDate);
    } else {
      eventDate = new Date(`${rawDate}T08:00:00`);
    }

    if (isNaN(eventDate.getTime())) {
      console.log('⚠️ Fecha de evento inválida:', rawDate);
      return false;
    }

    // Calcular 12 horas antes (12 * 60 * 60 * 1000 milisegundos)
    const triggerDate = new Date(eventDate.getTime() - 12 * 60 * 60 * 1000);
    const now = new Date();

    if (triggerDate <= now) {
      console.log('ℹ️ La fecha del recordatorio (12h antes) ya transcurrió para:', event.title);
      return false;
    }

    // Cancelar cualquier notificación previa con el mismo identificador de evento
    const notificationId = `event-reminder-${event.documentId || event.id}`;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (_) {}

    // Programar la notificación local en la agenda del dispositivo
    await Notifications.scheduleNotificationAsync({
      identifier: notificationId,
      content: {
        title: `⏰ Recordatorio de Actividad`,
        body: `El evento "${event.title}" comenzará en 12 horas. ¡No te lo pierdas!`,
        data: {
          contentType: 'event',
          contentId: event.documentId || event.id.toString(),
        },
        sound: true,
      },
      trigger: triggerDate,
    });

    console.log(`✅ Recordatorio programado para "${event.title}" el ${triggerDate.toLocaleString()}`);
    return true;
  } catch (error) {
    console.error('❌ Error programando recordatorio de 12 horas:', error);
    return false;
  }
}

/**
 * Recorre una lista de eventos y programa automáticamente recordatorios 12h antes para todos los eventos futuros.
 */
export async function scheduleAllUpcomingEventReminders(events: any[]): Promise<void> {
  if (!events || !Array.isArray(events)) return;

  for (const event of events) {
    if (event.fecha_evento || event.date) {
      await scheduleEventReminder12HoursBefore(event);
    }
  }
}
