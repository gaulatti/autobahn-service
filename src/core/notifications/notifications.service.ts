import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject, filter, map } from 'rxjs';
import { Logger } from 'src/logger/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { CommonNotifications } from './common.notifications';
import { INotificationsService } from './notifications.service.interface';
/**
 * Represents a client that receives notifications.
 *
 * @typedef {Object} NotificationClient
 * @property {string} id - The unique identifier for the notification client.
 * @property {(message: any) => boolean} [filter] - An optional function to filter messages.
 * If provided, it should return `true` if the message should be processed, or `false` otherwise.
 */
export type NotificationClient = {
  id: string;
  filter?: (message: any) => boolean;
};

/**
 * Represents a notification message.
 *
 * @typedef {Object} NotificationMessage
 * @property {string} [clientId] - The optional client identifier.
 * @property {MessageEvent} message - The message event associated with the notification.
 */
export type NotificationMessage = {
  clientId?: string;
  message: MessageEvent;
};

/**
 * Service responsible for managing notifications and client connections.
 */
@Injectable()
export class NotificationsService
  extends CommonNotifications
  implements INotificationsService
{
  /**
   * Logger instance for logging messages.
   */
  @Logger(NotificationsService.name)
  private readonly logger!: JSONLogger;

  /**
   * The clients that are connected to the notification service.
   */
  private clients: Record<string, NotificationClient> = {};

  /**
   * Generates a unique client ID.
   *
   * @returns {string} A randomly generated string of 9 characters.
   */
  private generateClientId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * The global subject that emits message events.
   */
  private globalSubject = new Subject<NotificationMessage>();

  connect(): Observable<MessageEvent> {
    const clientId = this.generateClientId();
    const observable = this.globalSubject.pipe(
      filter((event) => !event.clientId || event.clientId === clientId),
      map((event) => event.message),
    );

    this.clients[clientId] = { id: clientId };

    this.logger.log(`Client connected: ${clientId}`);
    return observable;
  }

  sendMessageToClient(clientId: string, message: string) {
    if (this.clients[clientId]) {
      this.globalSubject.next({ clientId, message: { data: message } });
    } else {
      this.logger.error(`Client ${clientId} not found`);
    }
  }

  disconnect(clientId: string) {
    if (this.clients[clientId]) {
      delete this.clients[clientId];
      this.logger.log('Client Disconnected', clientId);
    } else {
      this.logger.log('Client Not Found for Disconnection', clientId);
    }
  }

  broadcast(message: object) {
    this.globalSubject.next({ message: { data: JSON.stringify(message) } });
  }
}
