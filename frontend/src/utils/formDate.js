export function formDate(date) {
  let formDate = new Date(date).toLocaleDateString();
  return formDate;
}
