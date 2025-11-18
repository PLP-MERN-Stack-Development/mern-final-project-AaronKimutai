export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return "An unexpected error occurred.";
  }
};

export const logError = (context, error) => {
  console.error(`[${context}] Error:`, getErrorMessage(error));
};
