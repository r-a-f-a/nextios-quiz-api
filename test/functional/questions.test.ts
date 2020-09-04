describe('Questions functional tests', () => {
    describe('When seccessfully get list of questions', async () => {
        const response = await global.testRequest.get('/questions').send();
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining({}));
    });

    describe('When seccessfully get unique question', async () => {
        const response = await global.testRequest.get('/questions').send();
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({}));
    });
});