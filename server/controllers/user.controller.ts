import express, { Request, Response, Router } from 'express';
import {
  UserRequest,
  User,
  UserCredentials,
  UserByUsernameRequest,
  FakeSOSocket,
  UpdateBiographyRequest,
} from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  getUsersList,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

import admin from '../firebase';

const userController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  // Validate user body
  const isUserBodyValid = (req: UserRequest): boolean =>
    req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username !== '' &&
    req.body.password !== undefined &&
    req.body.password !== '';

  // Validate biography update body
  const isUpdateBiographyBodyValid = (req: UpdateBiographyRequest): boolean =>
    req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username.trim() !== '' &&
    req.body.biography !== undefined;

  // Create new user
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }

    const requestUser = req.body;

    const user: User = {
      ...requestUser,
      dateJoined: new Date(),
      biography: requestUser.biography ?? '',
      darkMode: requestUser.darkMode ?? false,
      highContrast: requestUser.highContrast ?? false,
    };

    try {
      const result = await saveUser(user);

      if ('error' in result) {
        throw new Error(result.error);
      }

      socket.emit('userUpdate', { user: result, type: 'created' });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(`Error when saving user: ${error}`);
    }
  };

  // User login
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!isUserBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      const loginCredentials: UserCredentials = {
        username: req.body.username,
        password: req.body.password,
      };

      const user = await loginUser(loginCredentials);

      if ('error' in user) {
        throw Error(user.error);
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send('Login failed');
    }
  };

  // Firebase login
  const firebaseLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body.token) {
        res.status(400).send('Firebase token is required');
        return;
      }

      const decodedToken = await admin.auth().verifyIdToken(req.body.token);
      const { email } = decodedToken;

      if (!email) {
        res.status(400).send('Email is required for Firebase login');
        return;
      }

      const loginCredentials: UserCredentials = { username: email, password: 'N/A' };

      let user = await loginUser(loginCredentials);

      if ('error' in user) {
        const newUser: User = {
          username: email,
          password: 'N/A',
          dateJoined: new Date(),
          biography: '',
          darkMode: false,
          highContrast: false,
        };
        const result = await saveUser(newUser);

        if ('error' in result) {
          throw new Error(result.error);
        }

        socket.emit('userUpdate', { user: result, type: 'created' });
        user = result;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send('Firebase login failed');
    }
  };

  // Get user by username
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const user = await getUserByUsername(username);

      if ('error' in user) {
        throw Error(user.error);
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send(`Error when getting user by username: ${error}`);
    }
  };

  // Get all users
  const getUsers = async (_: Request, res: Response): Promise<void> => {
    try {
      const users = await getUsersList();

      if ('error' in users) {
        throw Error(users.error);
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).send(`Error when getting users: ${error}`);
    }
  };

  // Delete user
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      const deletedUser = await deleteUserByUsername(username);

      if ('error' in deletedUser) {
        throw Error(deletedUser.error);
      }

      socket.emit('userUpdate', { user: deletedUser, type: 'deleted' });
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).send(`Error when deleting user by username: ${error}`);
    }
  };

  // Reset password
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!isUserBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      const updatedUser = await updateUser(req.body.username, { password: req.body.password });

      if ('error' in updatedUser) {
        throw Error(updatedUser.error);
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when updating user password: ${error}`);
    }
  };

  // Update biography
  const updateBiography = async (req: UpdateBiographyRequest, res: Response): Promise<void> => {
    try {
      if (!isUpdateBiographyBodyValid(req)) {
        res.status(400).send('Invalid user body');
        return;
      }

      const { username, biography } = req.body;

      const updatedUser = await updateUser(username, { biography });

      if ('error' in updatedUser) {
        throw new Error(updatedUser.error);
      }

      socket.emit('userUpdate', { user: updatedUser, type: 'updated' });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when updating user biography: ${error}`);
    }
  };

  const updatePreferences = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const { username, darkMode, highContrast } = req.body;

      console.log('🖥️ SERVER - Updating user preferences:', {
        username,
        darkMode,
        highContrast,
      });

      if (!username) {
        console.log('❌ SERVER - Username is required for preference update');
        res.status(400).send('Username is required');
        return;
      }

      const updatedUser = await updateUser(username, {
        darkMode,
        highContrast,
      });

      if ('error' in updatedUser) {
        console.error('❌ SERVER - Error updating user preferences:', updatedUser.error);
        throw new Error(updatedUser.error);
      }

      console.log('✅ SERVER - User preferences updated successfully:', {
        username: updatedUser.username,
        darkMode: updatedUser.darkMode,
        highContrast: updatedUser.highContrast,
      });

      socket.emit('userUpdate', { user: updatedUser, type: 'updated' });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('❌ SERVER - Error in updatePreferences:', error);
      res.status(500).send(`Error updating preferences: ${error}`);
    }
  };

  // Define routes for user-related operations
  router.post('/signup', createUser);
  router.post('/login', userLogin);
  router.post('/login/firebase', firebaseLogin);
  router.patch('/resetPassword', resetPassword);
  router.get('/getUser/:username', getUser);
  router.get('/getUsers', getUsers);
  router.delete('/deleteUser/:username', deleteUser);
  router.patch('/updateBiography', updateBiography);
  router.patch('/updatePreferences', updatePreferences);

  return router;
};

export default userController;
