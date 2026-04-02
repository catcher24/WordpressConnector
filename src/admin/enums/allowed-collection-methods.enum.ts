import { CollectorCollectionMethod } from './collector-collection-method.enum';

export enum AllowedCollectionMethods {
  Live = 'live',
  OnRequest = 'onRequest',
  OnSchedule = 'onSchedule',

  All = 'all',
  OnLiveAndOnRequest = 'onLiveAndOnRequest',
  OnRequestAndOnSchedule = 'onRequestAndOnSchedule',
  OnLiveAndOnSchedule = 'onLiveAndOnSchedule',
}

export function getIndividualCollectionMethods(
  allowedMethod: AllowedCollectionMethods
): CollectorCollectionMethod[] {
  switch (allowedMethod) {
    case AllowedCollectionMethods.All:
      return [
        CollectorCollectionMethod.Live,
        CollectorCollectionMethod.OnRequest,
        CollectorCollectionMethod.OnSchedule,
      ];
    case AllowedCollectionMethods.OnLiveAndOnRequest:
      return [CollectorCollectionMethod.Live, CollectorCollectionMethod.OnRequest];
    case AllowedCollectionMethods.OnRequestAndOnSchedule:
      return [CollectorCollectionMethod.OnRequest, CollectorCollectionMethod.OnSchedule];
    case AllowedCollectionMethods.OnLiveAndOnSchedule:
      return [CollectorCollectionMethod.Live, CollectorCollectionMethod.OnSchedule];
    // Handle individual methods
    case AllowedCollectionMethods.Live:
      return [CollectorCollectionMethod.Live];
    case AllowedCollectionMethods.OnRequest:
      return [CollectorCollectionMethod.OnRequest];
    case AllowedCollectionMethods.OnSchedule:
      return [CollectorCollectionMethod.OnSchedule];
    default:
      return [];
  }
}
