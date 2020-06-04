

import _pdf from '@/assets/img/fileImg/pdf.png';
import _xls from '@/assets/img/fileImg/excel.png';
import _txt from '@/assets/img/fileImg/text.png';
import _doc from '@/assets/img/fileImg/word.png';
import _zip from '@/assets/img/fileImg/zip.png';
import _img from '@/assets/img/fileImg/img.png';
import _ppt from '@/assets/img/fileImg/ppt.png';
import _vedio from '@/assets/img/fileImg/vedio.png';
import _unknown from '@/assets/img/fileImg/unknown.png';

const fileIcon = {
  zip: _zip,
  doc: _doc,
  docx: _doc,
  xls: _xls,
  xlsx: _xls,
  pdf: _pdf,
  txt: _txt,
  ppt: _ppt,
  pptx: _ppt,
  jpg: _img,
  jpeg: _img,
  png: _img,
  gif: _img,
  mp4: _vedio,
  ogg: _vedio,
  'file-excel': _xls,
  'file-pdf': _pdf,
  'file-word': _doc,
  'file-text': _txt,
  'file-zip': _zip,
  'file-unknown': _pdf,
  'unknown': _unknown
};

export default new Proxy(fileIcon, {
  get (target, key, receiver) {
    // eslint-disable-next-line no-param-reassign
    key = target[key] ? key : 'unknown';
    return Reflect.get(target, key, receiver);
  },
  set (target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  }
});

