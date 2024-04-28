// const asyncHandler = (fn) => async (error, req, res, next) => {
//   try {
//     await fn(error, req, res, next);
//   } catch (err) {
//     res.error(err.code || 500).json({
//       success: true,
//       message: err.message,
//     });
//   }
// };
const asyncHandler = (requestHandler) => {
  (error, req, res, next) => {
    Promise.resolve(requestHandler(error, req, res, next)).catch((err) =>
      next(err)
    );
  };
};

export { asyncHandler };
