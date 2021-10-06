//@flow

export function getStringDate(dateNumber: number) {
  const date = new Date(dateNumber);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('es-ES', options);
}
