function log(message: string) {
  const date: Date = new Date();

  const year: number = date.getUTCFullYear();
  const month: number = date.getUTCMonth() + 1;
  const day: number = date.getUTCDate();
  const hours: number = date.getUTCHours();
  const minutes: number = date.getUTCMinutes();
  const seconds: number = date.getUTCSeconds();

  const paddedMonth: string = month.toString().padStart(2, '0');
  const paddedDay: string = day.toString().padStart(2, '0');
  const paddedHours: string = hours.toString().padStart(2, '0');
  const paddedMinutes: string = minutes.toString().padStart(2, '0');
  const paddedSeconds: string = seconds.toString().padStart(2, '0');

  console.log(`[${year}-${paddedMonth}-${paddedDay}_${paddedHours}:${paddedMinutes}:${paddedSeconds}]: ${message}`);
}

export { log };
