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

      if (!user) return allReminders;

      const filtered = allReminders.filter((reminder) => {
        if (reminder.to === "all") return true;
        if (reminder.to === "students" && user.type === "student") return true;
        if (reminder.to === "managers" && user.type === "manager") return true;
        return false;
      });

      // ORDENAR: Primero los que tienen fecha (más cercana a hoy primero), luego los que no tienen fecha.
      return filtered.sort((a, b) => {
        if (a.fecha_evento && b.fecha_evento) {
          return new Date(a.fecha_evento).getTime() - new Date(b.fecha_evento).getTime();
        }
        if (a.fecha_evento) return -1;
        if (b.fecha_evento) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
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