// Data
import { readJSONAndProcessData } from '../../../utils/files/files.js';
import saveReadedData from '../../data/save-readed-data/index.js';


export default function addUploadListener() {
  const fileUpload = document.querySelector(`.file-upload`);
  const fileUploadSubmit = document.querySelector(`.file-upload-submit`);

  fileUploadSubmit.disabled = false;

  fileUpload.addEventListener(`change`, (e) => {
    readJSONAndProcessData(e, saveReadedData);
    fileUploadSubmit.disabled = false;
  });
};