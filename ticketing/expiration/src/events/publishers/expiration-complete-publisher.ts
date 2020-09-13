import {
  BasePublisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@ajmoro/common';

export class ExpirationCompletePublisher extends BasePublisher<
  ExpirationCompleteEvent
> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
