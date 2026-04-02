import { CollectorAuthenticationMethod } from './collector-authentication-method.enum';

export enum AllowedAuthenticationMethods {
  // Individual authentication methods
  None = 'none',
  RecordedLogin = 'recordedLogin',
  FormBased = 'formBased',
  Http = 'http',
  Header = 'header',
  SessionCookie = 'sessionCookie',

  // Common named combinations (these are distinct string values, not bitwise combinations)
  All = 'all',
  WebBased = 'webBased',
  ApiBased = 'apiBased',
  AllExceptSessionCookie = 'allExceptSessionCookie',
  TraditionalWeb = 'traditionalWeb',
  Stateless = 'stateless',
  CookieAndHeader = 'cookieAndHeader',
  FormAndHttp = 'formAndHttp',
  AllExceptRecordedLogin = 'allExceptRecordedLogin',

  // You can add more specific combinations here as distinct string values if needed.
  // For example:
  // RecordedLoginAndFormBased = 'recordedLoginAndFormBased',
  // HttpAndSessionCookie = 'httpAndSessionCookie',
}

/**
 * Maps an AllowedAuthenticationMethods combination string to an array of individual CollectorAuthenticationMethod strings.
 * This explicitly defines what each named combination represents.
 */
export function getIndividualCollectorAuthenticationMethods(
  allowedMethod?: AllowedAuthenticationMethods,
): CollectorAuthenticationMethod[] {
  if (!allowedMethod)
    return [];
  switch (allowedMethod) {
    case AllowedAuthenticationMethods.All:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.RecordedLogin,
        CollectorAuthenticationMethod.FormBased,
        CollectorAuthenticationMethod.Http,
        CollectorAuthenticationMethod.Header,
        CollectorAuthenticationMethod.SessionCookie,
      ];
    case AllowedAuthenticationMethods.WebBased:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.RecordedLogin,
        CollectorAuthenticationMethod.FormBased,
        CollectorAuthenticationMethod.SessionCookie,
      ];
    case AllowedAuthenticationMethods.ApiBased:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.Http,
        CollectorAuthenticationMethod.Header,
      ];
    case AllowedAuthenticationMethods.AllExceptSessionCookie:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.RecordedLogin,
        CollectorAuthenticationMethod.FormBased,
        CollectorAuthenticationMethod.Http,
        CollectorAuthenticationMethod.Header,
      ];
    case AllowedAuthenticationMethods.TraditionalWeb:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.RecordedLogin,
        CollectorAuthenticationMethod.FormBased,
      ];
    case AllowedAuthenticationMethods.Stateless:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.Http,
        CollectorAuthenticationMethod.Header,
      ];
    case AllowedAuthenticationMethods.CookieAndHeader:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.SessionCookie,
        CollectorAuthenticationMethod.Header,
      ];
    case AllowedAuthenticationMethods.FormAndHttp:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.FormBased,
        CollectorAuthenticationMethod.Http,
      ];
    case AllowedAuthenticationMethods.AllExceptRecordedLogin:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.FormBased,
        CollectorAuthenticationMethod.Http,
        CollectorAuthenticationMethod.Header,
        CollectorAuthenticationMethod.SessionCookie,
      ];
    case AllowedAuthenticationMethods.None:
      return [
        CollectorAuthenticationMethod.None,
      ];
    // Handle individual methods
    case AllowedAuthenticationMethods.RecordedLogin:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.RecordedLogin
      ];
    case AllowedAuthenticationMethods.FormBased:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.FormBased
      ];
    case AllowedAuthenticationMethods.Http:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.Http
      ];
    case AllowedAuthenticationMethods.Header:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.Header
      ];
    case AllowedAuthenticationMethods.SessionCookie:
      return [
        CollectorAuthenticationMethod.None,
        CollectorAuthenticationMethod.SessionCookie
      ];
    default:
      // Fallback for any unhandled or new combinations
      return [];
  }
}

export function authenticationMethodIsOneOf(authenticationMethod: CollectorAuthenticationMethod, methods: CollectorAuthenticationMethod[]): boolean {
  return methods.includes(authenticationMethod);
}
