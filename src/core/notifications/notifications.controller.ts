import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('notifications')
/**
 * The notifications controller.
 */
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Establishes a connection to the notifications service and returns an observable
   * that emits MessageEvent objects.
   *
   * @returns {Observable<MessageEvent>} An observable that emits MessageEvent objects.
   */
  @Sse()
  @Public()
  connect(): Observable<MessageEvent> {
    return this.notificationsService.connect();
  }
}
