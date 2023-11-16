import { Request, Response } from "express";
import * as authController from "../controllers/auth.controller";
import * as authService from "../services/auth.service";

jest.mock("../services/auth.service");

const mockRequest: Partial<Request> = {
  body: {
    email: "test@example.com",
    password: "password123",
  },
};

const mockResponse: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

const mockToken = "mocked-token";

describe("Authentication Controller", () => {
  describe("register", () => {
    test("registers a user and returns a token", async () => {
      (authService.register as jest.Mock).mockResolvedValueOnce(mockToken);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: mockToken });
    });
  });

  describe("login", () => {
    test("logs in a user and returns a token", async () => {
      (authService.login as jest.Mock).mockResolvedValueOnce(mockToken);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: mockToken });
    });
  });
});
