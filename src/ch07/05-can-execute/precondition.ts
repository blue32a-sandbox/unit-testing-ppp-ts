export function requires(precondition: boolean, message: string = ''): void {
  if (precondition === false) {
    throw new Error(message);
  }
}
