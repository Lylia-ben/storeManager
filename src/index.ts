import { app, BrowserWindow } from 'electron';
import connectDB from './database/database';
import { userIpcHandlers } from './ipc/users/userhandlers';
import { productIpcHandlers } from './ipc/product/producthandlers';
import { customerIpcHandlers } from './ipc/customer/customerHandlers';
import { orderIpcHandlers } from './ipc/orders/ordersHandlers';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async (): Promise<void> => {
  try {
    await connectDB();
    console.log('Successfully connected to the database');

    const mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.webContents.openDevTools();
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
};

app.whenReady().then(() => {
  // Register IPC handlers after the app is ready
  userIpcHandlers();
  productIpcHandlers();
  customerIpcHandlers();
  orderIpcHandlers();

  // Create the main application window
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
