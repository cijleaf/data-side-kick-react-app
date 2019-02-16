export default function repeatIf(handler, condition, time) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await handler();

        if (condition(result)) {
          resolve(await repeatIf(handler, condition, time));
        } else {
          resolve(result);
        }
      } catch (error) {
        console.error(error);

        reject(error);
      }
    }, time);
  });
}
