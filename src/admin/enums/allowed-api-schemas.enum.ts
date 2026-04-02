import { CollectorApiSchema } from './collector-api-schema.enum';

export enum AllowedApiSchemas {
  // Individual schemas
  None = 'none',
  OpenApi = 'openApi',
  GraphQl = 'graphQl',
  Grpc = 'grpc',
  Soap = 'soap',

  // Combinations
  OpenApiAndGraphQl = 'openApiAndGraphQl',
  OpenApiAndGrpc = 'openApiAndGrpc',
  OpenApiAndSoap = 'openApiAndSoap',
  GraphQlAndGrpc = 'graphQlAndGrpc',
  GraphQlAndSoap = 'graphQlAndSoap',
  GrpcAndSoap = 'grpcAndSoap',
  All = 'all',
}

/**
 * Maps an AllowedApiSchemas combination string to an array of individual CollectorApiSchema strings.
 * This explicitly defines what each named combination represents.
 */

export function getIndividualCollectorApiSchemas(
  allowedSchema?: AllowedApiSchemas,
): CollectorApiSchema[] {
  if (!allowedSchema) {
    return [];
  }

  switch (allowedSchema) {
    case AllowedApiSchemas.All:
      return [
        CollectorApiSchema.None,
        CollectorApiSchema.OpenApi,
        CollectorApiSchema.GraphQl,
        CollectorApiSchema.Grpc,
        CollectorApiSchema.Soap,
      ];
    case AllowedApiSchemas.OpenApiAndGraphQl:
      return [CollectorApiSchema.None, CollectorApiSchema.OpenApi, CollectorApiSchema.GraphQl];
    case AllowedApiSchemas.OpenApiAndGrpc:
      return [CollectorApiSchema.None, CollectorApiSchema.OpenApi, CollectorApiSchema.Grpc];
    case AllowedApiSchemas.OpenApiAndSoap:
      return [CollectorApiSchema.None, CollectorApiSchema.OpenApi, CollectorApiSchema.Soap];
    case AllowedApiSchemas.GraphQlAndGrpc:
      return [CollectorApiSchema.None, CollectorApiSchema.GraphQl, CollectorApiSchema.Grpc];
    case AllowedApiSchemas.GraphQlAndSoap:
      return [CollectorApiSchema.None, CollectorApiSchema.GraphQl, CollectorApiSchema.Soap];
    case AllowedApiSchemas.GrpcAndSoap:
      return [CollectorApiSchema.None, CollectorApiSchema.Grpc, CollectorApiSchema.Soap];

    // Individual methods
    case AllowedApiSchemas.OpenApi:
      return [CollectorApiSchema.None, CollectorApiSchema.OpenApi];
    case AllowedApiSchemas.GraphQl:
      return [CollectorApiSchema.None, CollectorApiSchema.GraphQl];
    case AllowedApiSchemas.Grpc:
      return [CollectorApiSchema.None, CollectorApiSchema.Grpc];
    case AllowedApiSchemas.Soap:
      return [CollectorApiSchema.None, CollectorApiSchema.Soap];
    case AllowedApiSchemas.None:
      return [CollectorApiSchema.None];

    default:
      return [];
  }
}

export function apiSchemaIsOneOf(schema: CollectorApiSchema, schemas: CollectorApiSchema[]): boolean {
  return schemas.includes(schema);
}
