
// Import required modules and utilities
const fs = require('fs').promises;
const { addResource } = require('../utils/AddResourceUtil');

// Mock the 'fs' module so we don't interact with the real file system.
// Instead, we simulate how readFile and writeFile should behave.
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
    }
}));

describe('Unit Tests for Utils', () => {
    // Reset mocks before each test to avoid "leaking" state between tests
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('addResource should add a resource', async () => {
        // Mock resources.json so it starts as an empty array
        const existingData = JSON.stringify([]);
        fs.readFile.mockResolvedValueOnce(existingData); // This resolves the read of utils/resources.json
        fs.writeFile.mockResolvedValue();

        const req = {
            body: {
                name: 'Test Resource',
                location: 'Room 101',
                description: 'Projector and screen',
                owner: 'user@example.com'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await addResource(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        // Extract the response
        const response = res.json.mock.calls[0][0];

        // Verify that the last resource matches our input
        expect(response.length).toEqual(1);
        expect(response[0].name).toEqual('Test Resource');
    });
});
