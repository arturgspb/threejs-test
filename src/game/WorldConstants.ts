class WorldConstants {
  // ширина полетного места
  boxMaxWidth = 250;
  // Если true, то глаза сильнее напрягаются
  moveCameraZ = false;
  // общее кол-во столбов
  //  TODO посчитать от стандартной скорости и предельному времени партии
  boxCount = 250;
  // отступ вперед от предыдущего столбика
  boxXCoordsOffset = 350;

  looseOnBoxContact = true;

  heroY = 50;

  cameraTop = 70;
  cameraBehind = -1150;
  cameraRotation = -1.6;
}


export default WorldConstants;
