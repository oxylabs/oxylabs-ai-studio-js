export class OxylabsAIStudioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OxylabsAIStudioError';
  }
}

export class ConfigurationError extends OxylabsAIStudioError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class MissingApiKeyError extends ConfigurationError {
  constructor() {
    super('OXYLABS_AI_STUDIO_API_KEY is required but was not found in environment variables or configuration');
  }
}

export class MissingApiUrlError extends ConfigurationError {
  constructor() {
    super('OXYLABS_AI_STUDIO_API_URL is required but was not found in environment variables or configuration');
  }
} 