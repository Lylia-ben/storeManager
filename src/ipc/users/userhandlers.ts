import { ipcMain } from 'electron';
import User from "../../database/models/Users/User";
import bcrypt from 'bcrypt'; 

// Register IPC handlers for user-related operations
export const userIpcHandlers = (): void => {
  // Handle user creation
  ipcMain.handle("user:create", async (_event, user) => {
    try {
      // Hash the password before saving to the database
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      });
      return newUser.toObject(); // Convert to plain object for IPC
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  });

  // Handle user authentication
  ipcMain.handle("user:auth", async (_event, credentials) => {
    const { name, password } = credentials;
    try {
      // Find the user by name
      const user = await User.findOne({ name });
      if (!user) {
        throw new Error("User not found");
      }

      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Return user data (excluding the password) on successful authentication
      const { password: _password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  });
};
