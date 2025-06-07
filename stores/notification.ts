import { defineStore } from 'pinia';
import { NotificationColor } from '~/types/notification';

interface NotificationState {
  visible: boolean;
  timeout: number;
  text: string;
  color: NotificationColor;
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    visible: false,
    timeout: 10000,
    text: '',
    color: NotificationColor.Default,
  }),

  actions: {
    show(text: string, color: NotificationColor = NotificationColor.Default) {
      this.text = text;
      this.color = color;
      this.visible = true;

      setTimeout(() => {
        this.visible = false;
        this.text = '';
        this.color = NotificationColor.Default;
      }, this.timeout);
    },

    success(message: string) {
      this.show(message, NotificationColor.Success);
    },

    info(message: string) {
      this.show(message, NotificationColor.Info);
    },

    warning(message: string) {
      this.show(message, NotificationColor.Warning);
    },

    error(message = 'Something went wrong…') {
      this.show(message, NotificationColor.Error);
    },
  },
});
