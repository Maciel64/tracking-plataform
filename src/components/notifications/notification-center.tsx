"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  BellDot,
  Check,
  CheckCheck,
  CheckCircle,
  CircleDot,
  Info,
  Trash2,
  X,
} from "lucide-react";
import { use, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  confirmNotification,
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/domain/notifications/notification.actions";
import type {
  Notification,
  NotificationType,
} from "@/domain/notifications/notification.model";
import { cn } from "@/lib/utils";

interface NotificationCenterProps {
  notifications: Promise<Notification[]>;
  userId: string;
}

const typeConfig: Record<
  NotificationType,
  { icon: typeof Info; color: string; bgColor: string }
> = {
  INFO: { icon: Info, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  WARNING: {
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  ERROR: {
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  SUCCESS: {
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  CONFIRMATION: {
    icon: CircleDot,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
};

function NotificationItem({
  notification,
  onMarkAsRead,
  onConfirm,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onConfirm: (id: string, confirmed: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const handleMarkAsRead = async () => {
    setIsLoading(true);
    await onMarkAsRead(notification.id);
    setIsLoading(false);
  };

  const handleConfirm = async (confirmed: boolean) => {
    setIsLoading(true);
    await onConfirm(notification.id, confirmed);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete(notification.id);
    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        "group relative flex gap-3 p-3 border-b last:border-b-0 transition-colors",
        !notification.read && "bg-accent/50",
      )}
    >
      <div className={cn("shrink-0 p-2 rounded-full h-fit", config.bgColor)}>
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-tight">
            {notification.title}
          </p>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
        {notification.type === "CONFIRMATION" && (
          <div className="flex items-center justify-between pt-1">
            {notification.confirmed === null && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => handleConfirm(true)}
                  disabled={isLoading}
                >
                  <Check className="h-3 w-3 mr-1" /> Confirmar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleConfirm(false)}
                  disabled={isLoading}
                >
                  <X className="h-3 w-3 mr-1" /> Recusar
                </Button>
              </div>
            )}
            {notification.confirmed !== null && (
              <Badge
                variant={notification.confirmed ? "default" : "destructive"}
                className="text-xs"
              >
                {notification.confirmed ? "Confirmado" : "Recusado"}
              </Badge>
            )}
          </div>
        )}
      </div>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {!notification.read && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={handleMarkAsRead}
            disabled={isLoading}
            title="Marcar como lida"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          disabled={isLoading}
          title="Excluir"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function NotificationCenter({
  notifications,
  userId,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const notificationsData = use(notifications);

  const unreadCount = notificationsData.filter((n) => !n.read).length;
  const hasUnread = unreadCount > 0;

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    await markAllNotificationsAsRead(userId);
    setIsMarkingAll(false);
  };

  const handleConfirm = async (id: string, confirmed: boolean) => {
    await confirmNotification(id, confirmed);
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notificações${hasUnread ? `, ${unreadCount} não lidas` : ""}`}
        >
          {hasUnread ? (
            <>
              <BellDot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notificações</h3>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
            >
              <CheckCheck className="h-3 w-3 mr-1" /> Marcar todas como lidas
            </Button>
          )}
        </div>

        {notificationsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notificationsData.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onConfirm={handleConfirm}
                onDelete={handleDelete}
              />
            ))}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
