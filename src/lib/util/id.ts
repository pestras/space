const charachters = ['1','2','3','4','6','7','8','9','0','a','b','d','e','f'];

export function spaceId() {
  return new Array(24).map(() => charachters[Math.floor(Math.random() * 15)]).join("");
}