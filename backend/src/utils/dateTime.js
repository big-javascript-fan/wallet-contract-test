export const localDateString = (date) => {
  const isoDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  return isoDateTime;
};

export const checkDateInPeriod = (date, from, to) => {
  if (!date) {
    return false;
  }

  if (!to && !from) {
    return false;
  }

  if (from) {
    if (date < from) {
      return false;
    }
  }

  if (to) {
    if (date > to) {
      return false;
    }
  }

  return true;
};
