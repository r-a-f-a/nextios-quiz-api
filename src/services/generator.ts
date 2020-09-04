import generator from 'generate-password';
 
export default class GeneratorService {
    public static generateToken(): string {
        const token = generator.generate({
            length: 6,
            numbers: true,
            symbols: false,
            uppercase: true,
            lowercase: false,
            excludeSimilarCharacters: true
        });

        return token;
    }
}
