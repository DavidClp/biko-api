export const generateId = (qnt: number) => {
    let id = "";
    for (let i = 0; i < qnt; i++) id += `${getRandomInt()}`;
    return id;
  };

  
const getRandomInt = () => {
  const min = 0;
  const max = 9;
  return Math.floor(Math.random() * (max - min)) + min;
};