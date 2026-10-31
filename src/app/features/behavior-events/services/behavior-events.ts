import {
  Injectable,
} from '@angular/core';
import {
  HttpClient,
} from '@angular/common/http';
import {
  EMPTY,
  catchError,
} from 'rxjs';

import {
  environment,
} from '@environments/environment';
import {
  BehaviorEventData,
  RegisterBehaviorEventRequest,
  RegisterBehaviorEventResponse,
} from '@features/behavior-events/models/behavior-event.models';

@Injectable({
  providedIn: 'root',
})
export class BehaviorEventsService {
  private readonly apiUrl =
    `${environment.apiUrl}/eventos-comportamiento`;

  private readonly sessionStorageKey =
    'gamarra-behavior-session-id';

  constructor(
    private readonly http:
      HttpClient,
  ) {}

  register(
    eventData: BehaviorEventData,
  ): void {
    const request:
      RegisterBehaviorEventRequest = {
        ...eventData,
        sessionId:
          this.getSessionId(),
      };

    this.http
      .post<RegisterBehaviorEventResponse>(
        this.apiUrl,
        request,
      )
      .pipe(
        catchError(() => {
          /*
           * Un error analítico no debe bloquear
           * la navegación ni las funciones del MVP.
           */
          return EMPTY;
        }),
      )
      .subscribe();
  }

  getSessionId(): string {
    const currentSessionId =
      sessionStorage.getItem(
        this.sessionStorageKey,
      );

    if (currentSessionId) {
      return currentSessionId;
    }

    const newSessionId =
      this.generateSessionId();

    sessionStorage.setItem(
      this.sessionStorageKey,
      newSessionId,
    );

    return newSessionId;
  }

  private generateSessionId(): string {
    if (
      typeof crypto !==
        'undefined' &&
      typeof crypto.randomUUID ===
        'function'
    ) {
      return crypto.randomUUID();
    }

    return this.generateFallbackUuid();
  }

  private generateFallbackUuid():
    string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(
        /[xy]/g,
        (character) => {
          const randomValue =
            Math.floor(
              Math.random() * 16,
            );

          const uuidValue =
            character === 'x'
              ? randomValue
              : (
                  randomValue &
                  0x3
                ) |
                0x8;

          return uuidValue.toString(
            16,
          );
        },
      );
  }
}