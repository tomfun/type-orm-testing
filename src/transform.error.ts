import { ValidationPipe } from '@nestjs/common'
import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface'

const pipeToBorrowMethods = new ValidationPipe() as ValidationPipe & {
  flattenValidationErrors(validationErrors: ValidationError[]): string[]
}

export class TransformResourceDeserializationError extends Error {
  constructor(
    public readonly errors: ValidationError[],
    message = `Invalid data: ${pipeToBorrowMethods
      .flattenValidationErrors(errors)
      .join(', ')}`,
  ) {
    super(message)
  }
}
