import { ipcMain } from 'electron';
import User from "../../database/models/Users/User";
import bcrypt from 'bcrypt';

// Register IPC handlers for user-related operations
export const userIpcHandlers = (): void => {
  // Handle user creation
  ipcMain.handle("user:create", async (_event, user) => {
    try {
      if (!user || !user.name || !user.password) {
        throw new Error("Invalid user data");
      }

      // Hash the password before saving to the database
      const hashedPassword = await bcrypt.hash(user.password, 12); // Use stronger hashing
      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      });

      // Return user data excluding sensitive information
      const { password: _password, ...userWithoutPassword } = newUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw new Error("Failed to create user");
    }
  });

  // Handle user authentication
  ipcMain.handle("user:auth", async (_event, credentials) => {
    try {
      const { name, password } = credentials;
  
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
  
      const { password: _password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword; // Return user data (excluding the password)
    } catch (error) {
      console.error("Authentication error:", error.message);
      throw new Error("Authentication failed");
    }
  });
  
};
