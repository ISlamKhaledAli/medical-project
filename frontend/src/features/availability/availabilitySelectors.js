export const selectAvailabilityDates = (state) =>
  state.availability.dates;

export const selectSelectedDate = (state) =>
  state.availability.selectedDate;

export const selectSelectedSlot = (state) =>
  state.availability.selectedSlot;

export const selectAvailabilityLoading = (state) =>
  state.availability.loading;