const errorResponse = (message, field) => {
  const err = {
    error: {
      message: message
    }
  };

  if (typeof field !== "undefined" && field !== "" && field !== null) {
    err["error"]["field"] = field;
  }

  return err;
};

export default errorResponse;
