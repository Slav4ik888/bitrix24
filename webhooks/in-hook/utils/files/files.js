// ******************************************** //
//              FILES METHODS                   //
// ******************************************** //

/**
 * Читает и возвращает данные текстового файла
 * @param {*} e 
 * @param {func} callback
 * @returns 
 */
function readFile(e, callback) {
  let selectedFile = e.target.files[0];

  const reader = new FileReader();
  reader.onload = function (e) {
    const fileContent = e.target.result;
    callback(fileContent);
  }

  reader.readAsText(selectedFile);
}

/**
 * Читает и сохраняет обработанные данные
 * @param {*} e 
 */
export function readJSONAndProcessData(e, saveDataFunc) {
  let clients = [];

  // Запускаем после прочтения файла с данными
  const callback = (json) => {
    const data = JSON.parse(json);
    clients = [...data];
    
    // Вывести на экран
    // this.displayListCompany(this, clients);

    // Открываем кнопки
    // this.selectors.createNewCompaniesBtn.classList.remove(`hide`);
    return saveDataFunc(clients); // Сохраняем прочитанное
  }

  readFile(e, callback);
}
