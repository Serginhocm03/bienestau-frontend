import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { getApi } from "@/lib/bienestar/api";
import {
  ErrorResponse,
  ReminderPageResponse,
  RemindersResponse,
} from "@/types/bienestar/dto";
import { ReminderPage } from "@/types/bienestar/pages";
import { Reminder } from "@/types/bienestar/collections";
import { useAuth } from "@/context/auth/AuthContext";

export const useReminder = () => {
  const { user } = useAuth();

  const reminder = useQuery<ReminderPageResponse, AxiosError, ReminderPage>({
    queryKey: ["reminder-page"],
    queryFn: getApi<ReminderPageResponse>(),
    select: (data) => data.data,
  });

  const reminders = useQuery<RemindersResponse, AxiosError<ErrorResponse>, Reminder[]>({
    queryKey: ["reminders", user?.type],
    queryFn: getApi<RemindersResponse>({
      params: {
        sort: "createdAt:desc",
      },
    }),
    select: (data) => {
  const allReminders = data.data;
  
  console.log('🔍 FILTRO REMINDERS - Total:', allReminders.length);
  console.log('🔍 Usuario actual:', user);
  console.log('🔍 Tipo de usuario:', user?.type);
  
  if (!user) {
    console.log('⚠️ No hay usuario, mostrando todos');
    return allReminders;
  }

  const filtered = allReminders.filter((reminder) => {
    console.log(`  📝 Recordatorio "${reminder.title}" - to: ${reminder.to}`);
    
    if (reminder.to === "all") {
      console.log('    ✅ Mostrar (to=all)');
      return true;
    }
    if (reminder.to === "students" && user.type === "student") {
      console.log('    ✅ Mostrar (to=students y user=student)');
      return true;
    }
    if (reminder.to === "managers" && user.type === "manager") {
      console.log('    ✅ Mostrar (to=managers y user=manager)');
      return true;
    }
    
    console.log('    ❌ Ocultar');
    return false;
  });

  console.log('🎯 Recordatorios filtrados:', filtered.length);
  return filtered;
},
    enabled: !!user,
  });

  const refetch = () => {
    reminder.refetch();
    reminders.refetch();
  };

  return {
    reminder: reminder.data,
    reminders: reminders.data,
    isPending: reminder.isPending || reminders.isPending,
    error: reminder.error || reminders.error,
    refetch,
  };
};