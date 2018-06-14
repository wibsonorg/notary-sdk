const addCacheControl = (res, maxAge) => {
  const max_age =
    typeof maxAge === "undefined" || maxAge === null || maxAge === 0
      ? 30
      : maxAge;
  res.set("Cache-Control", `public, max-age=${max_age}, must-revalidate`);
};
