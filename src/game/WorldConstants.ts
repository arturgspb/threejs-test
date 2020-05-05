class WorldConstants {
  // ширина полетного места
  boxMaxWidth = 250;
  // Если true, то глаза сильнее напрягаются
  moveCameraZ = false;
  // общее кол-во столбов
  //  TODO посчитать от стандартной скорости и предельному времени партии
  boxCount = 300;
  // отступ вперед от предыдущего столбика
  boxXCoordsOffset = 250;

  looseOnBoxContact = false;

  heroY = 50;
}


export default WorldConstants;
