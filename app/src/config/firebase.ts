import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  databaseURL: "https://esp32-max30102-78020-default-rtdb.firebaseio.com",
  // No necesitamos otras credenciales ya que solo accederemos a la base de datos en tiempo real
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
