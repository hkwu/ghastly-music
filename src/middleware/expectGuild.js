export default function expectGuild() {
  return async (next, context) => {
    const {
      message: {
        guild,
      },
    } = context;

    return guild && next(context);
  };
}
