const charachters = ['1','2','3','4','6','7','8','9','0','a','b','d','e','f'];

export function spaceId() {
  let id = "";

  for (let i = 0; i < 24; i++)
    id += charachters[Math.floor(Math.random() * 15)];

  return id;
}