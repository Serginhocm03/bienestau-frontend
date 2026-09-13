import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { getApi } from "@/lib/bienestar/api";
import {
  ErrorResponse,
  EventsResponse,
  HomeResponse,
  NewsResponse,
  RemindersResponse,
} from "@/types/bienestar/dto";
import { Home } from "@/types/bienestar/pages";
import { EventCollection, New, Reminder } from "@/types/bienestar/collections";

export const useHome = () => {
  const home = useQuery<HomeResponse, AxiosError, Home>({
    queryKey: ["home"],
    queryFn: getApi<HomeResponse>(),
    select: (data) => data.data,
  });

  const reminder = useQuery<
    RemindersResponse,
    AxiosError<ErrorResponse>,
    Reminder
  >({
    queryKey: ["reminders"],
    queryFn: getApi<RemindersResponse>({
      params: {
        sort: "createdAt:desc",
      },
    }),
    select: (data) => data.data[0],
  });

  const events = useQuery<
    EventsResponse,
    AxiosError<ErrorResponse>,
    EventCollection[]
  >({
    queryKey: ["events"],
    queryFn: getApi<EventsResponse>({
      params: {
        sort: "createdAt:desc",
      },
    }),
    select: (data) => data.data,
  });

  const news = useQuery<NewsResponse, AxiosError<ErrorResponse>, New[]>({
    queryKey: ["news"],
    queryFn: getApi<NewsResponse>({
      params: {
        sort: "createdAt:desc",
      },
    }),
    select: (data) => data.data,
  });

  const refetch = () => {
    home.refetch();
    reminder.refetch();
    events.refetch();
    news.refetch();
  };

  return {
    home: home.data,
    reminder: reminder.data,
    events: events.data,
    news: news.data,
    isPending:
      home.isPending ||
      reminder.isPending ||
      events.isPending ||
      news.isPending,
    error: home.error || reminder.error || events.error || news.error,
    refetch,
  };
};
