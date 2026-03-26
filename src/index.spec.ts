describe('tbx-mat-dialogs', () => {
    it('should export the public API', async () => {
        const api = await import('./index');
        expect(api).toBeDefined();
    });
});
