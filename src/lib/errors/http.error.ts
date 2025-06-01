export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Recurso não encontrado", details?: unknown) {
    super(404, message, details);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message: string = "Entidade não processável", details?: unknown) {
    super(422, message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Não autorizado", details?: unknown) {
    super(401, message, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = "Acesso negado", details?: unknown) {
    super(403, message, details);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "Requisição inválida", details?: unknown) {
    super(400, message, details);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = "Recurso já existe", details?: unknown) {
    super(409, message, details);
  }
}
