const filter = [
  `д.`, `c.`, 
]
// Очищаем address от с. д. и прочего
export const cleanAddress = (address) => {
  let cleanedAddress = address ? address : ``;

  
  cleanedAddress += `_ `;
  
  return cleanedAddress;
}