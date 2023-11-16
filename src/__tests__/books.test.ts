import { Request, Response } from "express";
import { ParamsDictionary } from 'express-serve-static-core';
import * as bookController from "../controllers/book.controller";
import * as bookService from "../services/book.service";

jest.mock("../services/book.service");

const mockResponse: Partial<Response> = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
};
const mockBooks = [
    { id: 1, title: 'Book 1' },
    { id: 2, title: 'Book 2' },
];

describe('BookController', () => {
    test('should return all the books', async () => {
        (bookService.listBooks as jest.Mock).mockResolvedValueOnce(mockBooks);
        

        await bookController.listBooks({} as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
    });

    test('should borrow book', async () => {
        const mockRequest: Request<ParamsDictionary, any, any, any, Record<string, any>> = {
            params: { bookId: '5fb1fd8a0b7a2b1c2d4b99e9' }, 
            body: { userId: '609c091e0a6d4e001f29c3d8' } 
        } as unknown as Request<ParamsDictionary, any, any, any, Record<string, any>>;

        await bookController.loanBook(mockRequest, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "Book loaned/unloaned successfully" });
    });

    test('should find bookById', async () => {
        const mockRequest: Request<ParamsDictionary, any, any, any, Record<string, any>> = {
            params: { id: '5fb1fd8a0b7a2b1c2d4b99e9' }, 
        } as unknown as Request<ParamsDictionary, any, any, any, Record<string, any>>;
    
        await bookController.findById(mockRequest, mockResponse as Response);
    
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    test('should handle an error from bookService.listBooks', async () => {
        (bookService.listBooks as jest.Mock).mockRejectedValueOnce(new Error('Some error'));

        await bookController.listBooks({} as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
