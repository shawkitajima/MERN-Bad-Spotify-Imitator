export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

export function todaysDate() {
  let currentTime = new Date()
  let month = currentTime.getMonth() + 1
  let day = currentTime.getDate()
  let year = currentTime.getFullYear()
  return `${year}-${month}-${day}`
}